import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { getRoles, getPermissions, assignRolePermissions } from "../../api/rbac";
import type { Role, Permission } from "../../types/rbac";

function Spinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <svg className="size-5 animate-spin text-brand-500" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  );
}

export default function RolePermissions() {
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  const queryClient = useQueryClient();

  // Fetch roles and permissions in parallel (async-parallel rule)
  const { data: roles = [], isLoading: rolesLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  const { data: permissions = [], isLoading: permissionsLoading } = useQuery({
    queryKey: ["permissions"],
    queryFn: getPermissions,
  });

  const { mutate: save, isPending: isSaving } = useMutation({
    mutationFn: (permissionIds: number[]) =>
      assignRolePermissions(selectedRoleId!, { permissionIds }),
    onSuccess: (updatedRole) => {
      // Update role in cache with the returned permissions
      queryClient.setQueryData<Role[]>(["roles"], (prev) =>
        prev?.map((r) => (r.id === updatedRole.id ? updatedRole : r)) ?? [updatedRole],
      );
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2000);
    },
    onError: () => {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 2000);
    },
  });

  // Group permissions by resource using Map for O(1) lookups (js-index-maps rule)
  const groupedPermissions = useMemo(() => {
    const map = new Map<string, Permission[]>();
    for (const p of permissions) {
      const group = map.get(p.resource) ?? [];
      group.push(p);
      map.set(p.resource, group);
    }
    return map;
  }, [permissions]);

  // Derive selectedRole from roles list (rerender-derived-state rule)
  const selectedRole = useMemo(
    () => roles.find((r) => r.id === selectedRoleId) ?? null,
    [roles, selectedRoleId],
  );

  // Sync checkedIds when selectedRole changes (v5: useEffect instead of onSuccess)
  useEffect(() => {
    if (selectedRole) {
      setCheckedIds(new Set(selectedRole.permissions?.map((p) => p.id) ?? []));
      setSaveStatus("idle");
    }
  }, [selectedRole]);

  const handleSelectRole = (role: Role) => {
    setSelectedRoleId(role.id);
  };

  // Use functional setState for stable callbacks (rerender-functional-setstate rule)
  const togglePermission = (id: number) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleGroup = (ids: number[]) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      // Use Set for O(1) lookups (js-set-map-lookups rule)
      const allChecked = ids.every((id) => next.has(id));
      for (const id of ids) {
        if (allChecked) {
          next.delete(id);
        } else {
          next.add(id);
        }
      }
      return next;
    });
  };

  const handleSave = () => {
    if (selectedRoleId === null) return;
    save([...checkedIds]);
  };

  return (
    <>
      <PageMeta title="역할-권한 관리" description="역할에 권한을 할당하고 관리합니다" />
      <PageBreadcrumb pageTitle="역할-권한 관리" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Role List */}
        <ComponentCard title="역할 목록" desc="역할을 선택하세요">
          {rolesLoading ? (
            <Spinner />
          ) : (
            <ul className="space-y-1">
              {roles.map((role) => (
                <li key={role.id}>
                  <button
                    onClick={() => handleSelectRole(role)}
                    className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                      selectedRoleId === role.id
                        ? "bg-brand-50 font-medium text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                        : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/[0.03]"
                    }`}
                  >
                    <span className="block font-medium">{role.name}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{role.code}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </ComponentCard>

        {/* Permission Assignment */}
        <div className="lg:col-span-2">
          <ComponentCard
            title={selectedRole ? `${selectedRole.name} 권한 설정` : "권한 할당"}
            desc={selectedRole ? "할당할 권한을 선택하세요" : "좌측에서 역할을 선택하세요"}
          >
            {!selectedRole ? (
              <div className="flex items-center justify-center py-12 text-sm text-gray-400 dark:text-gray-500">
                역할을 선택하면 권한 목록이 표시됩니다.
              </div>
            ) : permissionsLoading ? (
              <Spinner />
            ) : (
              <>
                <div className="space-y-6">
                  {[...groupedPermissions.entries()].map(([resource, perms]) => {
                    const permIds = perms.map((p) => p.id);
                    const allChecked = permIds.every((id) => checkedIds.has(id));
                    const someChecked = permIds.some((id) => checkedIds.has(id));

                    return (
                      <div key={resource}>
                        <div className="mb-2 flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`group-${resource}`}
                            checked={allChecked}
                            ref={(el) => {
                              if (el) el.indeterminate = someChecked && !allChecked;
                            }}
                            onChange={() => toggleGroup(permIds)}
                            className="size-4 cursor-pointer rounded border-gray-300 accent-brand-500"
                          />
                          <label
                            htmlFor={`group-${resource}`}
                            className="cursor-pointer text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400"
                          >
                            {resource}
                          </label>
                        </div>
                        <ul className="ml-6 space-y-1.5">
                          {perms.map((p) => (
                            <li key={p.id} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`perm-${p.id}`}
                                checked={checkedIds.has(p.id)}
                                onChange={() => togglePermission(p.id)}
                                className="size-4 cursor-pointer rounded border-gray-300 accent-brand-500"
                              />
                              <label
                                htmlFor={`perm-${p.id}`}
                                className="flex-1 cursor-pointer text-sm text-gray-700 dark:text-gray-300"
                              >
                                {p.name}
                                <span className="ml-2 font-mono text-xs text-gray-400 dark:text-gray-500">
                                  {p.authority}
                                </span>
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                  <span className="text-sm text-gray-400">{checkedIds.size}개 권한 선택됨</span>
                  <div className="flex items-center gap-3">
                    {saveStatus === "success" && (
                      <span className="text-sm text-success-600 dark:text-success-400">
                        저장되었습니다
                      </span>
                    )}
                    {saveStatus === "error" && (
                      <span className="text-sm text-error-600 dark:text-error-400">
                        저장에 실패했습니다
                      </span>
                    )}
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSaving ? "저장 중..." : "저장"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </ComponentCard>
        </div>
      </div>
    </>
  );
}
