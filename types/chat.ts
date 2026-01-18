// ============================================
// Type Definitions for Knowrex Chat
// ============================================

import { EscalationReason, EscalationUrgency } from './escalation';

/**
 * Source information from RAG system
 */
export interface MessageSource {
  documentName: string;
  chunkId: string;
  text: string;
  score: number;
}

/**
 * Escalation info attached to a message
 */
export interface MessageEscalation {
  shouldEscalate: boolean;
  offerEscalation: boolean;
  reason: EscalationReason;
  urgency: EscalationUrgency;
  message: string;
}

/**
 * Represents a single chat message
 * @property id - Unique identifier for the message
 * @property role - Who sent the message: 'user' or 'assistant'
 * @property content - The actual message text
 * @property timestamp - When the message was created
 * @property sources - Document sources used for RAG responses
 * @property confidence - Average confidence score (0-1)
 * @property usedRAG - Whether RAG was used for this response
 * @property escalation - Escalation status for this message
 */
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: MessageSource[];
  confidence?: number;
  usedRAG?: boolean;
  escalation?: MessageEscalation;
  escalationId?: string; // ID if escalation was created
}

/**
 * Props for the ChatMessage component
 */
export interface ChatMessageProps {
  message: Message;
  isLatest?: boolean;
}

/**
 * Props for the ChatInput component
 */
export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

/**
 * Props for the TypingIndicator component
 */
export interface TypingIndicatorProps {
  isVisible: boolean;
}

/**
 * RAG Settings
 */
export interface RAGSettings {
  enabled: boolean;
  minConfidence: number; // 0.25 to 0.9
  showSources: boolean;
  selectedDocumentId?: string; // Filter to specific document, empty = all documents
}

/**
 * Document summary for dropdown
 */
export interface DocumentOption {
  id: string;
  name: string;
}

/**
 * API Response structure from our chat endpoint
 */
export interface ChatApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  sources?: MessageSource[];
  confidence?: number;
  usedRAG?: boolean;
}

/**
 * Request body for chat API
 */
export interface ChatApiRequest {
  message: string;
  // Conversation history we send from the frontend to our /api/chat route
  history?: Array<{ role: string; content: string }>;
  ragEnabled?: boolean;
  minConfidence?: number;
  selectedDocumentId?: string; // Optional document filter for RAG
}

/**
 * Sample question type for the welcome section
 */
export interface SampleQuestion {
  id: string;
  text: string;
  icon: string;
}
