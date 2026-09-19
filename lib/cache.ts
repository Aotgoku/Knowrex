// ============================================
// Universal Dual-Tier Semantic Cache & Rate Limiter
// - Tier 1: Upstash Redis REST API (Serverless / Production)
// - Tier 2: In-Memory Map with TTL (Zero-config local fallback)
// ============================================

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

// In-Memory fallback store
const memoryCache = new Map<string, CacheEntry<any>>();
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Normalizes query string for caching
 */
function normalizeKey(query: string): string {
  return 'knowrex:cache:' + query.toLowerCase().trim().replace(/[^a-z0-9]/g, '_').slice(0, 80);
}

/**
 * Checks if Upstash Redis credentials are configured
 */
function isRedisConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

/**
 * Retrieve cached item from Redis or In-Memory
 */
export async function getCachedItem<T>(key: string): Promise<T | null> {
  const normalized = normalizeKey(key);

  // 1. Try Upstash Redis if configured
  if (isRedisConfigured()) {
    try {
      const url = `${process.env.UPSTASH_REDIS_REST_URL}/get/${encodeURIComponent(normalized)}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
        },
        cache: 'no-store'
      });
      if (res.ok) {
        const data = await res.json();
        if (data.result) {
          return JSON.parse(data.result) as T;
        }
      }
    } catch (err) {
      console.warn('[Cache] Upstash Redis GET error, falling back to memory:', err);
    }
  }

  // 2. In-Memory fallback
  const entry = memoryCache.get(normalized);
  if (entry) {
    if (Date.now() > entry.expiresAt) {
      memoryCache.delete(normalized);
      return null;
    }
    return entry.value as T;
  }

  return null;
}

/**
 * Set item in Redis or In-Memory cache with TTL
 */
export async function setCachedItem<T>(
  key: string,
  value: T,
  ttlSeconds: number = 300 // 5 minutes default
): Promise<void> {
  const normalized = normalizeKey(key);
  const serialized = JSON.stringify(value);

  // 1. Save to Upstash Redis if configured
  if (isRedisConfigured()) {
    try {
      const url = `${process.env.UPSTASH_REDIS_REST_URL}/set/${encodeURIComponent(normalized)}/${encodeURIComponent(serialized)}?ex=${ttlSeconds}`;
      await fetch(url, {
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
        },
        cache: 'no-store'
      });
      return;
    } catch (err) {
      console.warn('[Cache] Upstash Redis SET error, saving to memory:', err);
    }
  }

  // 2. Save to In-Memory store
  memoryCache.set(normalized, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000
  });
}

/**
 * Simple Token-Bucket Rate Limiter
 * @param identifier IP address or user session ID
 * @param maxRequests Max calls allowed within window (default 20)
 * @param windowSeconds Window duration in seconds (default 60s)
 */
export async function checkRateLimit(
  identifier: string,
  maxRequests: number = 20,
  windowSeconds: number = 60
): Promise<{ allowed: boolean; remaining: number; resetInSeconds: number }> {
  const key = `ratelimit:${identifier}`;
  const now = Date.now();

  // In-memory rate limiting check
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowSeconds * 1000
    });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetInSeconds: windowSeconds
    };
  }

  if (record.count >= maxRequests) {
    const resetInSeconds = Math.max(1, Math.round((record.resetAt - now) / 1000));
    return {
      allowed: false,
      remaining: 0,
      resetInSeconds
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetInSeconds: Math.max(1, Math.round((record.resetAt - now) / 1000))
  };
}
