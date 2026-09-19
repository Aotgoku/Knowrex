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

/**
 * Simple, tamper-resistant session serializer for Next.js Edge Middleware & Server
 */
export function serializeSession(user: AuthUser): string {
  const payload = {
    ...user,
    issuedAt: Date.now()
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

/**
 * Deserialize and validate session token from cookie
 */
export function deserializeSession(token?: string | null): AuthUser | null {
  if (!token) return null;
  try {
    const jsonStr = Buffer.from(token, 'base64url').toString('utf-8');
    const data = JSON.parse(jsonStr);
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
