import { api } from "../../../lib/api";
import type { Role, Permission, RoleApiResponse } from "../types";

export const ENDPOINTS = {
  PERMISSIONS: {
    LIST: "/permissions",
  },
  ROLES: {
    LIST: "/roles",
    BASE: "/roles",
  },
} as const;

export class RoleService {
  static async getRoles(): Promise<Role[]> {
    const response = await api.get<RoleApiResponse<Role[]>>(
      ENDPOINTS.ROLES.LIST,
    );
    return (response.data as any).data || response.data;
  }

  static async getPermissions(): Promise<Permission[]> {
    const response = await api.get<RoleApiResponse<Permission[]>>(
      ENDPOINTS.PERMISSIONS.LIST,
    );
    return (response.data as any).data || response.data;
  }

  static async createRole(data: {
    name: string;
    permissions: string[];
  }): Promise<Role> {
    const response = await api.post<RoleApiResponse<Role>>(
      ENDPOINTS.ROLES.BASE,
      data,
    );
    return (response.data as any).data || response.data;
  }

  static async updateRole(
    uuid: string,
    data: { name: string; permissions: string[] },
  ): Promise<Role> {
    const response = await api.put<RoleApiResponse<Role>>(
      `${ENDPOINTS.ROLES.BASE}/${uuid}`,
      data,
    );
    return (response.data as any).data || response.data;
  }

  static async deleteRole(uuid: string): Promise<void> {
    await api.delete(`${ENDPOINTS.ROLES.BASE}/${uuid}`);
  }
}
