import { authRequest } from "./http";
import type {
  Role,
  Permission,
  AssignRolePermissionsRequest,
  AssignUserRolesRequest,
  UserListParams,
  UserListResponse,
} from "../types/rbac";

export const getRoles = () =>
  authRequest<Role[]>("/api/v1/roles", { method: "GET" });

export const getPermissions = () =>
  authRequest<Permission[]>("/api/v1/permissions", { method: "GET" });

export const assignRolePermissions = (
  roleId: number,
  body: AssignRolePermissionsRequest,
) =>
  authRequest<Role>(`/api/v1/roles/${roleId}/permissions`, {
    method: "PUT",
    body: JSON.stringify(body),
  });

export const getUsers = (params: UserListParams = {}) => {
  const qs = new URLSearchParams();
  if (params.keyword) qs.set("keyword", params.keyword);
  if (params.roleCode) qs.set("roleCode", params.roleCode);
  if (params.isActive !== undefined) qs.set("isActive", String(params.isActive));
  if (params.page !== undefined) qs.set("page", String(params.page));
  if (params.size !== undefined) qs.set("size", String(params.size));
  const query = qs.toString();
  return authRequest<UserListResponse>(
    `/api/v1/users${query ? `?${query}` : ""}`,
    { method: "GET" },
  );
};

export const getUserRoles = (userId: number) =>
  authRequest<Role[]>(`/api/v1/users/${userId}/roles`, { method: "GET" });

export const assignUserRoles = (userId: number, body: AssignUserRolesRequest) =>
  authRequest<null>(`/api/v1/users/${userId}/roles`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
