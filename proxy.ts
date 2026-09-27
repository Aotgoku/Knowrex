import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE_NAME = 'knowrex_session';
const AUTH_SECRET =
  process.env.AUTH_SECRET ||
  process.env.SESSION_SECRET ||
  'knowrex-enterprise-auth-hmac-secret-v1-2026';

// ── Edge-safe HMAC verification (Web Crypto API — no Node.js crypto) ──────────

async function getKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

async function verifySession(
  token: string
): Promise<{ role: string } | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [base64Payload, signatureB64] = parts;

    const key = await getKey(AUTH_SECRET);
    const expectedSigBuffer = await crypto.subtle.sign(
      'HMAC',
      key,
      new TextEncoder().encode(base64Payload)
    );

    const toBytes = (b64: string) =>
      Uint8Array.from(
        atob(b64.replace(/-/g, '+').replace(/_/g, '/')),
        c => c.charCodeAt(0)
      );

    const provided = toBytes(signatureB64);
    const expected = new Uint8Array(expectedSigBuffer);

    if (provided.length !== expected.length) return null;
    let diff = 0;
    for (let i = 0; i < provided.length; i++) diff |= provided[i] ^ expected[i];
    if (diff !== 0) return null;

    const jsonStr = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
    const data = JSON.parse(jsonStr);

    const MAX_AGE = 7 * 24 * 60 * 60 * 1000;
    if (data.issuedAt && Date.now() - data.issuedAt > MAX_AGE) return null;
    if (!data.id || !data.role || !data.email) return null;

    return { role: data.role };
  } catch {
    return null;
  }
}

// ── Proxy (Next.js 16 Middleware) ─────────────────────────────────────────────

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieValue = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const user = cookieValue ? await verifySession(cookieValue) : null;

  const isLoginPage = pathname === '/admin/login';

  // Already logged in → redirect away from login page
  if (isLoginPage) {
    if (user) {
      const target = user.role === 'agent' ? '/admin/escalations' : '/admin';
      return NextResponse.redirect(new URL(target, request.url));
    }
    return NextResponse.next();
  }

  // Not authenticated → go to login
  if (!user) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // RBAC: Support Agents cannot access Vector DB management
  if (user.role === 'agent' && pathname.startsWith('/admin/vectors')) {
    const redirectUrl = new URL('/admin/escalations', request.url);
    redirectUrl.searchParams.set('denied', 'vectors');
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
