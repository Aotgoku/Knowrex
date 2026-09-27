import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, DEMO_USERS, serializeSession, deserializeSession, AuthUser } from '@/lib/auth';
import { checkRateLimit } from '@/lib/cache';

/**
 * GET /api/auth
 * Returns the currently authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const cookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const user = deserializeSession(cookie);

    return NextResponse.json({
      authenticated: !!user,
      user
    });
  } catch (error: any) {
    return NextResponse.json(
      { authenticated: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/auth
 * Logs in via Demo role or email/password and sets HTTP-only session cookie
 */
export async function POST(request: NextRequest) {
  try {
    // Rate Limiting: 10 login attempts per minute per IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'anonymous';
    const rateCheck = await checkRateLimit(`auth:${ip}`, 10, 60);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: `Too many login attempts. Please wait ${rateCheck.resetInSeconds}s.` },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { role, email } = body;


    let user: AuthUser | null = null;

    if (role === 'admin' || role === 'agent') {
      user = DEMO_USERS[role as 'admin' | 'agent'];
    } else if (email && typeof email === 'string') {
      const normalizedEmail = email.toLowerCase().trim();
      const isAdmin = normalizedEmail.includes('admin') || normalizedEmail.startsWith('sarah');
      user = {
        id: `usr_${Date.now()}`,
        email: normalizedEmail,
        name: normalizedEmail.split('@')[0],
        role: isAdmin ? 'admin' : 'agent',
        title: isAdmin ? 'Super Admin' : 'Support Agent'
      };
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Please provide valid credentials or select a role.' },
        { status: 400 }
      );
    }

    const token = serializeSession(user);
    const response = NextResponse.json({
      success: true,
      user,
      message: `Welcome back, ${user.name} (${user.role.toUpperCase()})`
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true, // Prevent JS from reading the session cookie (XSS protection)
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Login failed' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/auth
 * Clears the session cookie (Logout)
 */
export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  });

  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: '',
    path: '/',
    maxAge: 0
  });

  return response;
}
