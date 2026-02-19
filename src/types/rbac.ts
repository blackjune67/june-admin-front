export interface Permission {
  id: number;
  resource: string;
  action: string;
  name: string;
  description: string | null;
  authority: string;
}

export interface Role {
  id: number;
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
  isSystem: boolean;
  permissions?: Permission[];
}

export interface AssignRolePermissionsRequest {
  permissionIds: number[];
}

export interface AssignUserRolesRequest {
  roleIds: number[];
}

export interface UserListItem {
  id: number;
  email: string;
  name: string;
  isActive: boolean;
  roles: Pick<Role, "id" | "code" | "name">[];
}

export interface UserListParams {
  keyword?: string;
  roleCode?: string;
  isActive?: boolean;
  page?: number;
  size?: number;
}

export interface UserListResponse {
  content: UserListItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
