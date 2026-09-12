import type { UserDTO } from '@/src/core/api/types';

export const USER_ROLES = {
  ADMIN: 'admin',
  PROVIDER: 'provider',
  CUSTOMER: 'customer',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

/**
 * Checks if a user has a specific role, supporting both new array-based RBAC `roles`
 * and legacy boolean flags for backward compatibility.
 */
export function hasRole(user: UserDTO | null | undefined, role: string): boolean {
  if (!user) return false;

  // New RBAC array check
  if (Array.isArray(user.roles)) {
    return user.roles.includes(role);
  }

  // Fallback to legacy boolean flags if roles array is not present
  if (role === USER_ROLES.ADMIN) return !!user.is_admin;
  if (role === USER_ROLES.PROVIDER) return !!user.is_provider;
  if (role === USER_ROLES.CUSTOMER) return !!user.is_customer;

  return false;
}

export function isAdmin(user: UserDTO | null | undefined): boolean {
  return hasRole(user, USER_ROLES.ADMIN);
}

export function isProvider(user: UserDTO | null | undefined): boolean {
  return hasRole(user, USER_ROLES.PROVIDER);
}

export function isCustomer(user: UserDTO | null | undefined): boolean {
  return hasRole(user, USER_ROLES.CUSTOMER);
}
