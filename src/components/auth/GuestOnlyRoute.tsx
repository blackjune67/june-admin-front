import { Navigate, Outlet } from "react-router";
import { useAuthStore, type AuthStore } from "../../stores/authStore";

export default function GuestOnlyRoute() {
  const isAuthenticated = useAuthStore(
    (state: AuthStore) => state.isAuthenticated,
  );

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
