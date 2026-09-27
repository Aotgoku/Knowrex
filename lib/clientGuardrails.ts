// ============================================
// Client-Side Live Guardrails Simulator Evaluator
// 100% authentic Luhn algorithm & prompt injection firewall
// Runs locally in the browser with sub-millisecond execution
// ============================================

export interface LiveGuardrailEval {
  allowed: boolean;
  blocked: boolean;
  isJailbreak: boolean;
  injectionDetected: boolean;
  detectedThreats: string[];
  piiRedacted: boolean;
  sanitized: boolean;
  luhnChecksumValid: boolean;
  detectedPII: string[];
  detectedPii: string[];
  sanitizedText: string;
  sanitizedOutput: string;
  latencyMs: number;
  latency: string;
  reason: string;
  tokenCost: number;
}

const JAILBREAK_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts|rules|commands)/i,
  /disregard\s+(all\s+)?(previous|prior|system)\s+(instructions|guidelines|safety)/i,
  /you\s+are\s+now\s+(in\s+)?(dan|developer|unrestricted|god|jailbreak)\s+mode/i,
  /act\s+as\s+an?\s+(unfiltered|jailbroken|evil|unrestricted|limitless)\s+ai/i,
  /reveal\s+(your\s+)?(system\s+prompt|internal\s+instructions|master\s+prompt|api\s*keys?)/i,
  /show\s+me\s+(the\s+)?(system\s+instructions|initial\s+prompt|developer\s+prompt)/i,
  /bypass\s+(all\s+)?(content\s+filters|safety\s+filters|restrictions)/i,
  /(drop\s+table|delete\s+from\s+users|drop\s+database|truncate\s+table)/i,
  /<\s*\|\s*system\s*\|\s*>/i,
  /<\s*im_start\s*>\s*system/i,
  /\[system\s*:\s*you\s+are/i,
  /do\s+anything\s+now/i
];

function isValidLuhn(digits: string): boolean {
  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

export function evaluateLiveGuardrails(input: string): LiveGuardrailEval {
  const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const detectedThreats: string[] = [];
  const detectedPII: string[] = [];
  let sanitizedText = input;

  // 1. Check for Prompt Injections
  for (const pattern of JAILBREAK_PATTERNS) {
    if (pattern.test(input)) {
      detectedThreats.push(`Prompt Injection Pattern: ${pattern.toString().slice(1, 30)}...`);
    }
  }

  // 2. Validate & Redact Credit Cards via Luhn Mod-10
  const ccRegex = /\b(?:\d{4}[ -]?){3}\d{4}\b/g;
  sanitizedText = sanitizedText.replace(ccRegex, (match) => {
    const rawDigits = match.replace(/[\s-]/g, '');
    if (rawDigits.length >= 13 && rawDigits.length <= 19 && isValidLuhn(rawDigits)) {
      detectedPII.push('Credit Card Number (Luhn Mod-10 Verified)');
      return `[REDACTED_CARD_ENDING_${rawDigits.slice(-4)}]`;
    }
    return match;
  });

  // 3. SSN Redaction
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
  if (ssnRegex.test(sanitizedText)) {
    detectedPII.push('Social Security Number (SSN)');
    sanitizedText = sanitizedText.replace(ssnRegex, '[REDACTED_SSN]');
  }

  // 4. Phone Number Redaction
  const phoneRegex = /\b(?:\+?\d{1,3}[ -]?)?(?:[6-9]\d{9}|(?:\d{3}[ -]?\d{3}[ -]?\d{4}))\b/g;
  sanitizedText = sanitizedText.replace(phoneRegex, (match) => {
    const rawDigits = match.replace(/[\s-+]/g, '');
    if (rawDigits.length >= 10 && rawDigits.length <= 13) {
      detectedPII.push('Phone Number');
      return '[REDACTED_PHONE]';
    }
    return match;
  });

  const isJailbreak = detectedThreats.length > 0;
  const piiRedacted = detectedPII.length > 0;
  const luhnChecksumValid = detectedPII.some(p => p.includes('Luhn'));
  const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const latencyMs = Math.max(0.8, +(endTime - startTime).toFixed(2));
  const uniquePII = Array.from(new Set(detectedPII));

  return {
    allowed: !isJailbreak,
    blocked: isJailbreak,
    isJailbreak,
    injectionDetected: isJailbreak,
    detectedThreats,
    piiRedacted,
    sanitized: piiRedacted,
    luhnChecksumValid,
    detectedPII: uniquePII,
    detectedPii: uniquePII,
    sanitizedText,
    sanitizedOutput: sanitizedText,
    latencyMs,
    latency: `${latencyMs}ms`,
    reason: isJailbreak 
      ? 'Jailbreak / Prompt Injection heuristic triggered' 
      : piiRedacted 
        ? 'Luhn algorithm modulus-10 PII scrubbing applied' 
        : 'Query passed all heuristic guardrails cleanly',
    tokenCost: isJailbreak ? 0 : Math.max(1, Math.ceil(input.split(/\s+/).filter(Boolean).length * 1.3))
  };
}
