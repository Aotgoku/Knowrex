// ============================================
// Knowrex RBAC & Authentication System
// Defines user roles, permissions, session helpers & demo profiles
// ============================================

export type UserRole = 'admin' | 'agent' | 'user';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  title?: string;
}

export const AUTH_COOKIE_NAME = 'knowrex_session';

// Demo Profiles for immediate testing & evaluation
export const DEMO_USERS: Record<'admin' | 'agent', AuthUser> = {
  admin: {
    id: 'usr_admin_001',
    email: 'admin@knowrex.ai',
    name: 'Sarah Connor',
    role: 'admin',
    title: 'Super Admin / Knowledge Manager',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80'
  },
  agent: {
    id: 'usr_agent_002',
    email: 'agent@knowrex.ai',
    name: 'Alex Rivera',
    role: 'agent',
    title: 'Senior Support Specialist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
  }
};

/**
 * Check if a role has permission for a specific action
 */
export function hasPermission(
  role: UserRole,
  action: 'manage_vectors' | 'delete_documents' | 'upload_documents' | 'resolve_escalations' | 'view_analytics' | 'view_documents'
): boolean {
  switch (action) {
    case 'manage_vectors':
    case 'delete_documents':
      // Only Super Admin can wipe vectors or delete company docs
      return role === 'admin';

    case 'upload_documents':
      return role === 'admin';

    case 'view_documents':
    case 'resolve_escalations':
    case 'view_analytics':
      // Both Super Admin and Support Agent have operational access
      return role === 'admin' || role === 'agent';

    default:
      return false;
  }
}

import crypto from 'crypto';

const AUTH_SECRET = process.env.AUTH_SECRET || process.env.SESSION_SECRET || 'knowrex-enterprise-auth-hmac-secret-v1-2026';

function signPayload(payload: string): string {
  return crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('base64url');
}

/**
 * Cryptographically signed session serializer for Next.js Middleware & Server
 * Token format: <base64payload>.<hmacSignature>
 */
export function serializeSession(user: AuthUser): string {
  const payload = {
    ...user,
    issuedAt: Date.now()
  };
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = signPayload(base64Payload);
  return `${base64Payload}.${signature}`;
}

/**
 * Deserialize and cryptographically validate session token from cookie
 * Rejects tampered, forged, or expired tokens
 */
export function deserializeSession(token?: string | null): AuthUser | null {
  if (!token || typeof token !== 'string') return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [base64Payload, signature] = parts;
    const expectedSignature = signPayload(base64Payload);

    // Constant-time comparison to prevent timing attacks
    if (signature.length !== expectedSignature.length) return null;
    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
    if (!isValid) return null;

    const jsonStr = Buffer.from(base64Payload, 'base64url').toString('utf-8');
    const data = JSON.parse(jsonStr);

    // Verify session age (max 7 days)
    const MAX_AGE = 7 * 24 * 60 * 60 * 1000;
    if (data.issuedAt && Date.now() - data.issuedAt > MAX_AGE) {
      return null;
    }

    if (!data.id || !data.role || !data.email) return null;
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
      avatar: data.avatar,
      title: data.title
    };
  } catch {
    return null;
  }
}

