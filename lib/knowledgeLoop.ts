// ============================================
// Knowledge Loop Library - Learn from Escalations
// Phase 4.5: Knowledge Loop System
// Learn from human-resolved escalations to improve AI responses!
// ============================================

import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';
import {
  Escalation,
  FAQEntry,
  KBIntegrationType
} from '@/types/escalation';
import { updateEscalation, getKBPendingEscalations } from './escalationSystem';
import { generateEmbedding } from './embeddings';
import { addVectors, queryVectors, deleteVectorById } from './vectorStore';

// Re-export FAQEntry type for use in RAG system
export type { FAQEntry } from '@/types/escalation';

// Data directories
const FAQ_DIR = path.join(process.cwd(), 'data', 'faq');
const DOCUMENTS_DIR = path.join(process.cwd(), 'data', 'documents');

/**
 * Ensure FAQ directory exists
 */
async function ensureFAQDir(): Promise<void> {
  try {
    await fs.access(FAQ_DIR);
  } catch {
    await fs.mkdir(FAQ_DIR, { recursive: true });
  }
}

/**
 * Get FAQ file path
 */
function getFAQPath(id: string): string {
  return path.join(FAQ_DIR, `${id}.json`);
}

// ============================================
// FAQ MANAGEMENT
// ============================================

/**
 * Create a new FAQ entry from an escalation
 */
export async function createFAQFromEscalation(escalation: Escalation): Promise<FAQEntry | null> {
  if (!escalation.humanAnswer) {
    console.error('Cannot create FAQ: No human answer provided');
    return null;
  }

  await ensureFAQDir();

  const faq: FAQEntry = {
    id: uuidv4(),
    question: escalation.userQuestion,
    answer: escalation.humanAnswer,
    category: escalation.category || 'General',
    tags: escalation.tags || [],
    sourceEscalationId: escalation.id,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  await fs.writeFile(getFAQPath(faq.id), JSON.stringify(faq, null, 2));

  // Mark escalation as added to KB
  await updateEscalation(escalation.id, { addedToKB: true });

  // ⚡ Knowledge Loop: Auto-vectorize FAQ into Pinecone
  try {
    await syncFAQToVectorDB(faq);
  } catch (err) {
    console.warn('[Knowledge Loop] Auto-vectorization to Pinecone had warning:', err);
  }

  console.log(`✅ Created FAQ entry ${faq.id} from escalation ${escalation.id}`);
  return faq;
}

/**
 * Get all FAQ entries
 */
export async function getAllFAQs(): Promise<FAQEntry[]> {
  await ensureFAQDir();

  const files = await fs.readdir(FAQ_DIR);
  const jsonFiles = files.filter(f => f.endsWith('.json'));

  const faqs: FAQEntry[] = [];

  for (const file of jsonFiles) {
    try {
      const data = await fs.readFile(path.join(FAQ_DIR, file), 'utf-8');
      const faq = JSON.parse(data);
      faq.createdAt = new Date(faq.createdAt);
      faq.updatedAt = new Date(faq.updatedAt);
      faqs.push(faq);
    } catch {
      // Skip invalid files
    }
  }

  return faqs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/**
 * Get FAQ by ID
 */
export async function getFAQ(id: string): Promise<FAQEntry | null> {
  try {
    const data = await fs.readFile(getFAQPath(id), 'utf-8');
    const faq = JSON.parse(data);
    faq.createdAt = new Date(faq.createdAt);
    faq.updatedAt = new Date(faq.updatedAt);
    return faq;
  } catch {
    return null;
  }
}

/**
 * Update FAQ entry
 */
export async function updateFAQ(id: string, updates: Partial<FAQEntry>): Promise<FAQEntry | null> {
  const faq = await getFAQ(id);
  if (!faq) return null;

  const updated: FAQEntry = {
    ...faq,
    ...updates,
    updatedAt: new Date()
  };

  await fs.writeFile(getFAQPath(id), JSON.stringify(updated, null, 2));

  // Update in Pinecone
  try {
    await syncFAQToVectorDB(updated);
  } catch (err) {
    console.warn('[Knowledge Loop] Pinecone update warning:', err);
  }

  return updated;
}

/**
 * Sync an FAQ entry directly into Pinecone Cloud Vector Index
 */
export async function syncFAQToVectorDB(faq: FAQEntry): Promise<boolean> {
  try {
    const textToEmbed = `Question: ${faq.question}\n\nAnswer: ${faq.answer}`;
    const embedding = await generateEmbedding(textToEmbed);

    await addVectors([{
      id: `faq_${faq.id}`,
      embedding,
      metadata: {
        documentId: 'knowledge_loop_faq',
        documentName: `FAQ: ${faq.category || 'General'}`,
        text: `**Question:** ${faq.question}\n\n**Answer:** ${faq.answer}`,
        chunkIndex: 0,
        charCount: textToEmbed.length,
        faqId: faq.id,
        type: 'faq',
        category: faq.category || 'General'
      }
    }]);

    console.log(`[Knowledge Loop] ⚡ Successfully vectorized FAQ into Pinecone: ${faq.id}`);
    return true;
  } catch (error) {
    console.error(`[Knowledge Loop] Failed to vectorize FAQ ${faq.id}:`, error);
    return false;
  }
}

/**
 * Delete FAQ entry (removes from disk and Pinecone)
 */
export async function deleteFAQ(id: string): Promise<boolean> {
  try {
    await fs.unlink(getFAQPath(id));
    // Remove from Pinecone vector index
    await deleteVectorById(`faq_${id}`).catch(err => {
      console.warn('[Knowledge Loop] Pinecone delete vector warning:', err);
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Search FAQs using Semantic Pinecone Vector Search with Keyword Fallback
 */
export async function searchFAQs(query: string): Promise<FAQEntry[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  // 1. Semantic Search via Pinecone Cloud
  try {
    const queryEmbedding = await generateEmbedding(cleanQuery);
    const vectorMatches = await queryVectors(queryEmbedding, 5, {
      documentId: 'knowledge_loop_faq'
    });

    // If matches found with reasonable confidence score
    if (vectorMatches.length > 0 && vectorMatches[0].score >= 0.35) {
      console.log(`[Knowledge Loop] 🧠 Pinecone semantic match found: ${vectorMatches.length} FAQs (top match: ${(vectorMatches[0].score * 100).toFixed(1)}%)`);

      const allFaqs = await getAllFAQs();
      const faqMap = new Map(allFaqs.map(f => [f.id, f]));

      const semanticResults: FAQEntry[] = [];
      for (const match of vectorMatches) {
        const faqId = (match.metadata as any).faqId;
        const found = faqMap.get(faqId);
        if (found) {
          semanticResults.push(found);
        } else {
          // Reconstruct from Pinecone metadata if physical file is missing
          const parts = match.text.split('**Answer:**');
          semanticResults.push({
            id: faqId || match.id,
            question: parts[0]?.replace('**Question:**', '').trim() || cleanQuery,
            answer: parts[1]?.trim() || match.text,
            category: (match.metadata as any).category || 'General',
            tags: [],
            sourceEscalationId: faqId || match.id,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }

      if (semanticResults.length > 0) {
        return semanticResults;
      }
    }
  } catch (error) {
    console.warn('[Knowledge Loop] Pinecone FAQ search error, falling back to substring:', error);
  }

  // 2. Keyword Substring Fallback
  const faqs = await getAllFAQs();
  const lowerQuery = cleanQuery.toLowerCase();

  return faqs.filter(faq =>
    faq.question.toLowerCase().includes(lowerQuery) ||
    faq.answer.toLowerCase().includes(lowerQuery) ||
    faq.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Batch sync all existing FAQs to Pinecone
 */
export async function syncAllFAQsToVectorDB(): Promise<{ total: number; synced: number }> {
  const faqs = await getAllFAQs();
  let synced = 0;
  for (const faq of faqs) {
    const success = await syncFAQToVectorDB(faq);
    if (success) synced++;
  }
  return { total: faqs.length, synced };
}

// ============================================
// DOCUMENT INTEGRATION
// ============================================

/**
 * Append FAQ to existing document
 * This adds the Q&A pair to a document so it can be re-embedded
 */
export async function appendToDocument(
  documentId: string,
  question: string,
  answer: string
): Promise<boolean> {
  const docPath = path.join(DOCUMENTS_DIR, `${documentId}.json`);
  
  try {
    const data = await fs.readFile(docPath, 'utf-8');
    const doc = JSON.parse(data);

    // Append Q&A as a new section
    const newContent = `\n\n---\n## FAQ Addition\n\n**Q: ${question}**\n\n${answer}\n`;
    
    // Update document content
    doc.content = (doc.content || '') + newContent;
    doc.updatedAt = new Date().toISOString();

    await fs.writeFile(docPath, JSON.stringify(doc, null, 2));
    
    console.log(`✅ Appended Q&A to document ${documentId}`);
    return true;
  } catch (error) {
    console.error(`Failed to append to document ${documentId}:`, error);
    return false;
  }
}

/**
 * Create a new FAQ document from resolved escalations
 * This bundles multiple FAQs into a single document for embedding
 */
export async function createFAQDocument(
  title: string,
  category: string,
  faqs: FAQEntry[]
): Promise<string | null> {
  if (faqs.length === 0) return null;

  const docId = uuidv4();
  
  // Build document content
  let content = `# ${title}\n\nCategory: ${category}\n\n`;
  content += `This document contains frequently asked questions and their answers.\n\n---\n\n`;

  for (const faq of faqs) {
    content += `## Q: ${faq.question}\n\n`;
    content += `**Answer:** ${faq.answer}\n\n`;
    if (faq.tags.length > 0) {
      content += `*Tags: ${faq.tags.join(', ')}*\n\n`;
    }
    content += `---\n\n`;
  }

  const doc = {
    id: docId,
    title,
    content,
    category,
    type: 'faq_compilation',
    sourceType: 'escalation_resolution',
    faqCount: faqs.length,
    faqIds: faqs.map(f => f.id),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const docPath = path.join(DOCUMENTS_DIR, `${docId}.json`);
  await fs.writeFile(docPath, JSON.stringify(doc, null, 2));

  console.log(`✅ Created FAQ document ${docId} with ${faqs.length} FAQs`);
  return docId;
}

// ============================================
// KNOWLEDGE LOOP PROCESSING
// ============================================

/**
 * Process all pending KB additions
 */
export async function processKBQueue(): Promise<{
  processed: number;
  faqsCreated: number;
  errors: number;
}> {
  const pendingEscalations = await getKBPendingEscalations();
  
  let processed = 0;
  let faqsCreated = 0;
  let errors = 0;

  for (const escalation of pendingEscalations) {
    try {
      switch (escalation.kbIntegrationType) {
        case 'faq':
          const faq = await createFAQFromEscalation(escalation);
          if (faq) {
            faqsCreated++;
            processed++;
          } else {
            errors++;
          }
          break;

        case 'doc_update':
          // If there's a related document, append to it
          if (escalation.relatedDocuments.length > 0 && escalation.humanAnswer) {
            const success = await appendToDocument(
              escalation.relatedDocuments[0],
              escalation.userQuestion,
              escalation.humanAnswer
            );
            if (success) {
              await updateEscalation(escalation.id, { addedToKB: true });
              processed++;
            } else {
              errors++;
            }
          }
          break;

        case 'verified':
          // Just mark as verified, no KB addition needed
          await updateEscalation(escalation.id, { addedToKB: true });
          processed++;
          break;

        default:
          // Default to FAQ creation
          const defaultFaq = await createFAQFromEscalation(escalation);
          if (defaultFaq) {
            faqsCreated++;
            processed++;
          }
      }
    } catch (error) {
      console.error(`Error processing escalation ${escalation.id}:`, error);
      errors++;
    }
  }

  return { processed, faqsCreated, errors };
}

/**
 * Get KB statistics
 */
export async function getKBStats(): Promise<{
  totalFAQs: number;
  byCategory: Record<string, number>;
  recentlyAdded: number;
}> {
  const faqs = await getAllFAQs();
  
  const byCategory: Record<string, number> = {};
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  let recentlyAdded = 0;

  for (const faq of faqs) {
    const cat = faq.category || 'Uncategorized';
    byCategory[cat] = (byCategory[cat] || 0) + 1;
    
    if (faq.createdAt.getTime() >= oneWeekAgo) {
      recentlyAdded++;
    }
  }

  return {
    totalFAQs: faqs.length,
    byCategory,
    recentlyAdded
  };
}

/**
 * Find similar FAQs (simple text matching)
 * This helps avoid duplicate KB entries
 */
export async function findSimilarFAQs(question: string, threshold: number = 0.6): Promise<FAQEntry[]> {
  const faqs = await getAllFAQs();
  
  // Simple word-based similarity
  const questionWords = new Set(question.toLowerCase().split(/\s+/));
  
  const similar: Array<{ faq: FAQEntry; score: number }> = [];

  for (const faq of faqs) {
    const faqWords = new Set(faq.question.toLowerCase().split(/\s+/));
    
    // Calculate Jaccard similarity
    const intersection = [...questionWords].filter(w => faqWords.has(w)).length;
    const union = new Set([...questionWords, ...faqWords]).size;
    const similarity = intersection / union;

    if (similarity >= threshold) {
      similar.push({ faq, score: similarity });
    }
  }

  return similar
    .sort((a, b) => b.score - a.score)
    .map(s => s.faq);
}

/**
 * Generate a summary of knowledge gained from escalations
 */
export async function generateKnowledgeSummary(): Promise<string> {
  const faqs = await getAllFAQs();
  const stats = await getKBStats();

  let summary = `## Knowledge Base Summary\n\n`;
  summary += `**Total FAQ Entries:** ${stats.totalFAQs}\n\n`;
  summary += `**Added This Week:** ${stats.recentlyAdded}\n\n`;
  summary += `### Categories:\n`;
  
  for (const [category, count] of Object.entries(stats.byCategory)) {
    summary += `- ${category}: ${count} entries\n`;
  }

  summary += `\n### Recent FAQs:\n`;
  const recent = faqs.slice(0, 5);
  for (const faq of recent) {
    summary += `- **Q:** ${faq.question.substring(0, 50)}...\n`;
  }

  return summary;
}
