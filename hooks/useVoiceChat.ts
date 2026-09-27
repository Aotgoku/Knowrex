'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseVoiceChatReturn {
  isListening: boolean;
  isSpeaking: boolean;
  isSupported: boolean;
  isMuted: boolean;
  permissionDenied: boolean;
  startListening: (onInterim: (text: string) => void, onFinal?: (text: string) => void) => Promise<void>;
  stopListening: () => void;
  speakText: (rawMarkdown: string) => void;
  stopSpeaking: () => void;
  toggleMute: () => void;
  dismissPermissionError: () => void;
}

/**
 * Clean markdown symbols for natural Text-to-Speech readout
 */
function cleanMarkdownForTTS(text: string): string {
  return text
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove markdown headers
    .replace(/#{1,6}\s+/g, '')
    // Remove bold and italic markers
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // Remove links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove bullet points and numbered list markers
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Remove emojis and special symbols
    .replace(/[✨📄🚨📌•🔄👤🤖✍️💡]/g, '')
    // Remove multiple newlines and spaces
    .replace(/\n{2,}/g, '. ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Custom hook for Voice AI Customer Support
 * 100% Native Web Speech API (Speech-to-Text & Text-to-Speech)
 * Zero external dependencies, Zero cloud costs, Vercel HTTPS ready.
 */
export function useVoiceChat(): UseVoiceChatReturn {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Check browser support and load preferences on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Check Speech Recognition support (Chrome, Edge, Safari)
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
    }

    // 2. Check Speech Synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    // 3. Load voice mute preference
    const savedMute = localStorage.getItem('knowrex-voice-muted');
    if (savedMute === 'true') {
      setIsMuted(true);
    }
  }, []);

  /**
   * Start microphone capture with live transcription
   * Instantiates a fresh SpeechRecognition session each time to prevent
   * InvalidStateError and microphone driver race conditions.
   */
  const startListening = useCallback(
    async (onInterim: (text: string) => void, onFinal?: (text: string) => void) => {
      if (typeof window === 'undefined') return;

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert('Voice speech recognition is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari.');
        return;
      }

      // If already speaking, stop TTS before listening
      if (synthRef.current && synthRef.current.speaking) {
        synthRef.current.cancel();
        setIsSpeaking(false);
      }

      // Stop any existing recognition instance cleanly
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
        recognitionRef.current = null;
      }

      setPermissionDenied(false);

      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = typeof navigator !== 'undefined' ? (navigator.language || 'en-US') : 'en-US';

        let accumulated = '';

        recognition.onstart = () => {
          setIsListening(true);
          setPermissionDenied(false);
        };

        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              accumulated += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }

          const currentText = (accumulated + interimTranscript).trim();
          if (currentText) {
            onInterim(currentText);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('[Voice AI] Recognition error:', event.error);
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setPermissionDenied(true);
          }
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
          const finalText = accumulated.trim();
          if (finalText && onFinal) {
            onFinal(finalText);
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err: any) {
        console.warn('[Voice AI] Failed to start recognition:', err);
        setIsListening(false);
      }
    },
    []
  );

  /**
   * Stop listening
   */
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('[Voice AI] Stop error:', err);
      }
    }
    setIsListening(false);
  }, [isListening]);

  /**
   * Read response text out loud
   */
  const speakText = useCallback(
    (rawMarkdown: string) => {
      if (isMuted || !synthRef.current || typeof window === 'undefined') return;

      const cleanText = cleanMarkdownForTTS(rawMarkdown);
      if (!cleanText) return;

      // Cancel any ongoing speech
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05; // Natural conversational speed
      utterance.pitch = 1.0;

      // Select best natural voice
      const voices = synthRef.current.getVoices();
      const naturalVoice = voices.find(
        (v) =>
          (v.name.includes('Natural') ||
            v.name.includes('Google') ||
            v.name.includes('Samantha') ||
            v.name.includes('Jenny') ||
            v.name.includes('Guy')) &&
          v.lang.startsWith('en')
      );

      if (naturalVoice) {
        utterance.voice = naturalVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    },
    [isMuted]
  );

  /**
   * Stop ongoing speech
   */
  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  /**
   * Toggle voice readout mute
   */
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      localStorage.setItem('knowrex-voice-muted', String(next));
      if (next && synthRef.current) {
        synthRef.current.cancel();
        setIsSpeaking(false);
      }
      return next;
    });
  }, []);

  /**
   * Dismiss permission denied warning
   */
  const dismissPermissionError = useCallback(() => {
    setPermissionDenied(false);
  }, []);

  return {
    isListening,
    isSpeaking,
    isSupported,
    isMuted,
    permissionDenied,
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
    toggleMute,
    dismissPermissionError
  };
}
