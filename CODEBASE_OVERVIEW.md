# Knowrex - Complete Codebase Overview

## What is Knowrex?

Knowrex is an AI-powered customer support chatbot built with Next.js 16 + React 19, backed by Google Gemini 2.5 Flash as the LLM. It uses a full RAG (Retrieval-Augmented Generation) pipeline to answer questions from uploaded documents, and includes an escalation system for routing unanswered queries to human agents.

---

## Tech Stack (Full Breakdown)

| Technology | Version | Why It is Used |
|---|---|---|
| Next.js | 16.1.1 | Full-stack React framework with API routes + SSR |
| React | 19.2.3 | UI rendering, state management |
| TypeScript | ^5 | Static type safety across the whole codebase |
| TailwindCSS | ^4 | Utility-first CSS for all UI styling |
| Google Gemini AI | ^0.24.1 | The core LLM for generating chat responses |
| @xenova/transformers | ^2.17.2 | Runs all-MiniLM-L6-v2 locally for 384-dim embeddings (free, no API cost) |
| pdf-parse | ^1.1.1 | Extracts text from uploaded PDF files |
| mammoth | ^1.11.0 | Extracts text from uploaded .docx Word files |
| formidable | ^3.5.4 | Handles multipart form data for file uploads |
| uuid | ^13.0.0 | Generates unique IDs for escalations, FAQs, documents |
| lucide-react | ^0.562.0 | Icon library used throughout the UI |
| cli-progress | ^3.12.0 | Progress bars for CLI-style embedding scripts |
| File System (fs) | Node built-in | Used as the ONLY database - all data stored as JSON files |
| localStorage | Browser built-in | Persists chat history on the client side |

---

## Project Structure - File-by-File Breakdown

### app/ (Next.js App Router)

- app/page.tsx - Main chat UI (819 lines). Manages all state: messages, loading, RAG settings, escalation polling. Reads/writes localStorage.
- app/layout.tsx - Root layout, font imports, HTML metadata
- app/globals.css - Global CSS custom properties (--background, --card-bg, --muted etc.) for dark/light mode theming
- app/admin/page.tsx - Admin dashboard UI
- app/admin/layout.tsx - Admin layout wrapper
- app/admin/documents/ - Document management page (list/delete uploaded docs)
- app/admin/escalations/ - Escalation management page (assign/resolve escalations)
- app/admin/vectors/ - Vector store stats page

### app/api/ (Backend API Routes)

- app/api/chat/route.ts - Core chat POST endpoint. Orchestrates RAG pipeline + Gemini 2.5 Flash streaming. Embeds __RAG_METADATA__ in stream.
- app/api/upload/route.ts - File upload handler. PDF/DOCX -> text extraction -> chunking -> embedding -> vectorStore
- app/api/documents/route.ts - GET list documents, DELETE a document + its vectors
- app/api/embeddings/route.ts - Embedding stats, re-embedding triggers
- app/api/escalations/route.ts - POST create escalation, GET list escalations, PATCH resolve/assign/reject
- app/api/knowledge/route.ts - FAQ management (list, create, delete, process KB queue)
- app/api/chroma/route.ts - Vector store stats and reset endpoint
- app/api/debug-search/ - Debug endpoint for testing vector search queries
- app/api/test-gemini/ - Test endpoint for verifying Gemini API connection

### components/ (React UI Components)

- components/ChatMessage.tsx - Renders a single chat message bubble. Handles markdown rendering, source citations, and the escalation prompt button.
- components/ChatInput.tsx - Text input area with send button. Handles Enter key, disabled state during loading.
- components/TypingIndicator.tsx - Three animated dots shown while AI is generating a response.
- components/RAGSettings.tsx - Collapsible settings panel. Contains RAG toggle, confidence threshold slider, document filter dropdown. Also exports useRAGSettings hook for localStorage persistence.
- components/SourceCitation.tsx - Renders the source citation cards shown below AI responses (document name, match score, text snippet).
- components/EscalationPrompt.tsx - The "Talk to a human" button shown when AI is unsure. Handles the escalation submission.
- components/admin/ - Admin-specific components (escalation list items, detail views)

### lib/ (Core Business Logic)

- lib/ragSystem.ts - Main RAG orchestrator. Does: query expansion -> FAQ search -> vector search -> merge results -> format context. Entry point: performRAG()
- lib/vectorStore.ts - File-based vector database. Reads 136MB vectors.json into memory on first call, then caches it. Does cosine similarity calculation in JavaScript.
- lib/vectorSearch.ts - Higher-level wrapper over vectorStore. Generates query embedding then calls queryVectors().
- lib/embeddings.ts - Local embedding generation. Uses @xenova/transformers pipeline with all-MiniLM-L6-v2 model. Generates 384-dimensional vectors. Caches the model after first load.
- lib/documentProcessor.ts - Parses PDF (via pdf-parse), DOCX (via mammoth), and TXT files. Returns raw text string.
- lib/chunkingAlgorithm.ts - Splits document text into overlapping chunks. Configurable chunk size and overlap.
- lib/escalationSystem.ts - Checks if a query should be escalated (keyword detection, confidence threshold, sensitive topics). Also handles CRUD operations for escalation files.
- lib/knowledgeLoop.ts - FAQ system. Creates FAQ entries from resolved escalations. Provides keyword-based FAQ search. Handles Knowledge Loop processing queue.
- lib/promptTemplates.ts - Builds system prompts for Gemini. GENERAL_SYSTEM_PROMPT for regular chat. buildRAGPrompt() for document-augmented chat.
- lib/fileUtils.ts - File reading/writing utilities (read JSON, write JSON, ensure directories exist)

### types/ (TypeScript Interfaces)

- types/chat.ts - Message, MessageSource, RAGSettings, DocumentOption interfaces
- types/document.ts - Document, DocumentChunk, ProcessedDocument interfaces
- types/escalation.ts - Escalation, FAQEntry, EscalationStatus, EscalationReason, EscalationUrgency types + constants
- types/packages.d.ts - Module declarations for pdf-parse and mammoth (no official @types packages)

### data/ (File-Based Database - NO REAL DB)

- data/chroma/vectors.json - ALL vector embeddings stored as one JSON file (~136MB with real documents)
- data/documents/*.json - One JSON file per uploaded document (metadata + text content)
- data/escalations/*.json - One JSON file per escalation ticket
- data/faq/*.json - One JSON file per FAQ entry (created from resolved escalations)

---

## Data Flow - How a Chat Message Works

1. User types ? app/page.tsx sendMessage()
2. POST to /api/chat with {message, history, ragEnabled, minConfidence, selectedDocumentId}
3. RAG Pipeline in api/chat/route.ts:
   a. shouldUseRAG(query) - skip if greeting
   b. expandQuery() - add synonyms for better vector matching
   c. searchFAQs() - keyword match against data/faq/*.json
   d. searchVectors() - load vectors.json into memory, cosine similarity search
   e. Merge FAQ + document results (FAQs prioritized)
   f. formatContext() - build context string for prompt
4. shouldEscalate() - check confidence thresholds + keywords
5. Build augmented message with document context
6. Send to Gemini 2.5 Flash via streaming
7. Stream contains __RAG_METADATA__ prefix with sources/confidence JSON
8. Frontend parses metadata, removes it, renders streaming text
9. Save full conversation to localStorage

---

## Storage Architecture (Current - All File-Based)

| Data | Where | Format | Problem |
|---|---|---|---|
| Chat history | Browser localStorage | JSON string | Lost on different device, quota limits |
| Vector embeddings | data/chroma/vectors.json | Single JSON file | 136MB loaded into RAM, crashes serverless |
| Document metadata | data/documents/*.json | One file per doc | No concurrency safety, lost on redeploy |
| Escalations | data/escalations/*.json | One file per escalation | Same as above |
| FAQ entries | data/faq/*.json | One file per FAQ | Same as above |
| Dark mode | localStorage | boolean string | Has a BUG (wrong key used) |
| RAG settings | localStorage | JSON string | Cleared with browser data |

---

## Current State - What Works vs What Doesnt

### Working Well
- Chat UI with dark/light mode and streaming responses
- RAG pipeline (document search + source citations)
- PDF, DOCX, TXT document upload and processing
- Human escalation workflow (create + admin resolve)
- Knowledge Loop (FAQs from resolved escalations)
- Admin dashboard for managing everything
- Local free embeddings with @xenova/transformers
- Real-time streaming from Gemini 2.5 Flash
- Query expansion for better vector matching
- Escalation polling every 5 seconds

### Critical Bugs

BUG 1 - Chat refresh issue (HIGH)
What: Opening the page refreshes all chats and scrolls to bottom
Root cause: localStorage loads asynchronously but auto-scroll fires immediately. isInitialized flag sets to true BEFORE loadMessages() async function completes.
File: app/page.tsx line 183 (setIsInitialized(true) before await loadMessages())

BUG 2 - Dark mode doesnt persist (MEDIUM)
What: Dark mode resets on refresh
Root cause: app/page.tsx line 105 reads 'knowrex-dark-mode' but line 292 writes 'bizassist-dark-mode' (old project name, forgot to update)

BUG 3 - No admin authentication (HIGH)
What: /admin is completely public - any URL visitor can see all escalations and delete documents
Root cause: No middleware, no auth check

BUG 4 - 136MB vector file in memory (HIGH)
What: Cannot deploy to Vercel or any serverless platform
Root cause: vectors.json is loaded entirely into Node.js memory. Serverless functions have 1-3 second cold starts and memory limits.

BUG 5 - No database (HIGH)
What: All data is in local JSON files that disappear on redeploy, cant scale
Root cause: File system used as database instead of actual DB

---

## TOP 3 PRIORITIES FOR PRODUCTION

### Priority 1 - Add a Real Database (Supabase)
Impact: Fixes chat loss on refresh, fixes data loss on redeploy, enables multi-user
How: 
  - Use Supabase (free tier) - Postgres + Realtime + Auth built in
  - Tables: conversations, messages, documents, escalations, faqs
  - Chat history fetched from DB on mount instead of localStorage
  - Also fixes the refresh/scroll-to-bottom bug
  - Total effort: 2-3 days

### Priority 2 - Replace vectors.json with Pinecone
Impact: Enables Vercel deployment, fixes serverless memory crash, enables scale
How:
  - Use Pinecone (free tier) - 1 million vectors, serverless-ready
  - Install @pinecone-database/pinecone
  - Update lib/vectorStore.ts to call Pinecone API instead of reading local file
  - Add PINECONE_API_KEY to .env
  - Re-embed all documents into Pinecone
  - Total effort: 1-2 days

### Priority 3 - Add Authentication (NextAuth.js or Clerk)
Impact: Protects admin dashboard and user data from unauthorized access
How:
  - Use Clerk (easiest - 15 minute setup, free tier)
  - Or NextAuth.js with credentials
  - Add middleware.ts to protect /admin/**
  - Login page at /login
  - Total effort: 1 day

---

## Full Improvement Roadmap (After Top 3)

4.  Fix dark mode localStorage key bug (1 line fix - line 292 in page.tsx)
5.  Add rate limiting on /api/chat (@upstash/ratelimit + Redis)
6.  Add session IDs (UUID cookie) to track users without requiring login
7.  Add React Error Boundaries to prevent full crash
8.  Remove console.logs from production code
9.  Add Sentry for error monitoring
10. Add semantic search for FAQs (embed them too, not just keyword match)
11. Replace 5s polling with WebSockets for real-time escalation updates
12. Add CI/CD pipeline (GitHub Actions + Vercel auto-deploy)
13. Add Playwright end-to-end tests
14. Add multi-tenant support for different businesses

---

## Resume Summary

Knowrex is a full-stack AI customer support system built with Next.js 16, React 19, and Google Gemini 2.5 Flash. It implements a complete Retrieval-Augmented Generation (RAG) pipeline using local all-MiniLM-L6-v2 transformer embeddings (384 dimensions, zero API cost), cosine similarity vector search, and a self-learning Knowledge Loop that converts human-resolved escalations into searchable FAQ entries. Features include real-time streaming responses with source citations, confidence-based human escalation routing, and a full admin dashboard for document and escalation management.

Technical highlights:
- RAG pipeline: document chunking + local embedding (384-dim) + cosine similarity search + Gemini context augmentation
- Human-in-the-loop escalation with confidence-threshold detection and admin resolution
- Knowledge Loop: human answers automatically vectorized and added to knowledge base
- Real-time streaming via ReadableStream + TextDecoder with custom metadata protocol
- Local embedding inference with @xenova/transformers (no paid embedding API)
