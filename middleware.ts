import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE_NAME = 'knowrex_session';

function decodeSession(token?: string | null) {
  if (!token) return null;
  try {
    let base64 = token.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const user = decodeSession(cookie);

  const isLoginPage = pathname === '/admin/login';

  // 1. If user is already on /admin/login:
  if (isLoginPage) {
    if (user) {
      // Already authenticated, redirect to role-specific dashboard
      const target = user.role === 'agent' ? '/admin/escalations' : '/admin';
      return NextResponse.redirect(new URL(target, request.url));
    }
    return NextResponse.next();
  }

  // 2. For all other /admin routes:
  if (!user) {
    // Unauthenticated: redirect to login with original destination
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Role-Based Access Control (RBAC) Enforcement:
  if (user.role === 'agent') {
    // Support Agents are restricted from Vector DB management
    if (pathname.startsWith('/admin/vectors')) {
      const redirectUrl = new URL('/admin/escalations', request.url);
      redirectUrl.searchParams.set('denied', 'vectors');
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

// Apply middleware strictly to /admin routes (excluding static assets)
export const config = {
  matcher: ['/admin/:path*']
};
