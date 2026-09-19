'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseVoiceChatReturn {
  isListening: boolean;
  isSpeaking: boolean;
  isSupported: boolean;
  isMuted: boolean;
  permissionDenied: boolean;
  startListening: (onInterim: (text: string) => void, onFinal?: (text: string) => void) => void;
  stopListening: () => void;
  speakText: (rawMarkdown: string) => void;
  stopSpeaking: () => void;
  toggleMute: () => void;
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
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('[Voice AI] SpeechRecognition init failed:', err);
      }
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
   */
  const startListening = useCallback(
    (onInterim: (text: string) => void, onFinal?: (text: string) => void) => {
      if (!recognitionRef.current) {
        alert('Voice speech recognition is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari.');
        return;
      }

      // If already speaking, cancel TTS before listening
      if (synthRef.current && synthRef.current.speaking) {
        synthRef.current.cancel();
        setIsSpeaking(false);
      }

      setPermissionDenied(false);

      try {
        const recognition = recognitionRef.current;
        let finalAccumulated = '';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalAccumulated += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }

          const currentText = (finalAccumulated + interimTranscript).trim();
          onInterim(currentText);
        };

        recognition.onerror = (event: any) => {
          console.warn('[Voice AI] Recognition error:', event.error);
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setPermissionDenied(true);
            alert('Microphone access was denied. Please allow microphone access in your browser address bar to use Voice Mode.');
          }
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
          if (finalAccumulated.trim() && onFinal) {
            onFinal(finalAccumulated.trim());
          }
        };

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
    toggleMute
  };
}
