import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { getRoles, getUsers, getUserRoles, assignUserRoles } from "../../api/rbac";
import type { UserListItem, UserListParams } from "../../types/rbac";

function Spinner() {
  return (
    <div className="flex items-center justify-center py-10">
      <svg className="size-5 animate-spin text-brand-500" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  );
}

const PAGE_SIZE = 20;

export default function UserRoles() {
  // Search params
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [roleCodeFilter, setRoleCodeFilter] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState<"" | "true" | "false">("");
  const [page, setPage] = useState(0);

  // Selected user & role assignment state
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  // Debounce keyword (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setPage(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  // Reset page on filter change
  const handleRoleCodeFilter = (val: string) => {
    setRoleCodeFilter(val);
    setPage(0);
  };
  const handleIsActiveFilter = (val: "" | "true" | "false") => {
    setIsActiveFilter(val);
    setPage(0);
  };

  const userListParams: UserListParams = {
    ...(debouncedKeyword && { keyword: debouncedKeyword }),
    ...(roleCodeFilter && { roleCode: roleCodeFilter }),
    ...(isActiveFilter !== "" && { isActive: isActiveFilter === "true" }),
    page,
    size: PAGE_SIZE,
  };

  // Fetch roles (for filter dropdown & role assignment)
  const { data: roles = [] } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  // Fetch user list
  const { data: userList, isLoading: usersLoading } = useQuery({
    queryKey: ["users", userListParams],
    queryFn: () => getUsers(userListParams),
  });

  // Fetch selected user's current roles
  const { data: userRoles, isLoading: userRolesLoading } = useQuery({
    queryKey: ["userRoles", selectedUser?.id],
    queryFn: () => getUserRoles(selectedUser!.id),
    enabled: selectedUser !== null,
  });

  // Sync checkedIds when user's roles are loaded
  useEffect(() => {
    if (userRoles) {
      setCheckedIds(new Set(userRoles.map((r) => r.id)));
      setSaveStatus("idle");
    }
  }, [userRoles]);

  const { mutate: save, isPending: isSaving } = useMutation({
    mutationFn: () => assignUserRoles(selectedUser!.id, { roleIds: [...checkedIds] }),
    onSuccess: () => {
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2000);
    },
    onError: () => {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 2000);
    },
  });

  const handleSelectUser = useCallback((user: UserListItem) => {
    setSelectedUser(user);
    setCheckedIds(new Set());
    setSaveStatus("idle");
  }, []);

  const toggleRole = (id: number) => {
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

  const totalPages = userList?.totalPages ?? 1;

  return (
    <>
      <PageMeta title="사용자-역할 관리" description="사용자에게 역할을 할당하고 관리합니다" />
      <PageBreadcrumb pageTitle="사용자-역할 관리" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* User List */}
        <ComponentCard title="사용자 목록" desc="역할을 할당할 사용자를 선택하세요">
          {/* Search & Filters */}
          <div className="mb-4 space-y-2">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="이름 / 이메일 검색"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-brand-500"
            />
            <div className="flex gap-2">
              <select
                value={roleCodeFilter}
                onChange={(e) => handleRoleCodeFilter(e.target.value)}
                className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-sm text-gray-700 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
              >
                <option value="">전체 역할</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.code}>
                    {r.name}
                  </option>
                ))}
              </select>
              <select
                value={isActiveFilter}
                onChange={(e) => handleIsActiveFilter(e.target.value as "" | "true" | "false")}
                className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-sm text-gray-700 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
              >
                <option value="">전체 상태</option>
                <option value="true">활성</option>
                <option value="false">비활성</option>
              </select>
            </div>
          </div>

          {/* User List */}
          {usersLoading ? (
            <Spinner />
          ) : (
            <>
              <ul className="space-y-1">
                {userList?.content.map((user) => (
                  <li key={user.id}>
                    <button
                      onClick={() => handleSelectUser(user)}
                      className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                        selectedUser?.id === user.id
                          ? "bg-brand-50 font-medium text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                          : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/[0.03]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="block truncate font-medium">{user.name}</span>
                        {!user.isActive && (
                          <span className="shrink-0 rounded-full bg-gray-100 px-1.5 py-0.5 text-xs text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                            비활성
                          </span>
                        )}
                      </div>
                      <span className="block truncate text-xs text-gray-400 dark:text-gray-500">
                        {user.email}
                      </span>
                    </button>
                  </li>
                ))}
                {userList?.content.length === 0 && (
                  <li className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">
                    검색 결과가 없습니다.
                  </li>
                )}
              </ul>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-400 dark:hover:bg-white/[0.03]"
                  >
                    이전
                  </button>
                  <span className="text-xs text-gray-400">
                    {page + 1} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-400 dark:hover:bg-white/[0.03]"
                  >
                    다음
                  </button>
                </div>
              )}
            </>
          )}
        </ComponentCard>

        {/* Role Assignment */}
        <div className="lg:col-span-2">
          <ComponentCard
            title={selectedUser ? `${selectedUser.name} 역할 설정` : "역할 할당"}
            desc={selectedUser ? selectedUser.email : "좌측에서 사용자를 선택하세요"}
          >
            {!selectedUser ? (
              <div className="flex items-center justify-center py-12 text-sm text-gray-400 dark:text-gray-500">
                사용자를 선택하면 역할 목록이 표시됩니다.
              </div>
            ) : userRolesLoading ? (
              <Spinner />
            ) : (
              <>
                <ul className="space-y-2">
                  {roles.map((role) => (
                    <li
                      key={role.id}
                      className="flex items-center gap-3 rounded-lg border border-gray-100 px-4 py-3 dark:border-gray-800"
                    >
                      <input
                        type="checkbox"
                        id={`role-${role.id}`}
                        checked={checkedIds.has(role.id)}
                        onChange={() => toggleRole(role.id)}
                        className="size-4 cursor-pointer rounded border-gray-300 accent-brand-500"
                      />
                      <label htmlFor={`role-${role.id}`} className="flex-1 cursor-pointer">
                        <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {role.name}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {role.code}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                  <span className="text-sm text-gray-400">{checkedIds.size}개 역할 선택됨</span>
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
                      onClick={() => save()}
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
