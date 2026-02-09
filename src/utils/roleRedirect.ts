import type { Role } from '../types';

export const getRoleRedirectPath = (_roles: Role[]): string => {
    return '/dashboard';
};
