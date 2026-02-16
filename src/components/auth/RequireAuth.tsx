import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthStore, type AuthStore } from "../../stores/authStore";

export default function RequireAuth() {
  const isAuthenticated = useAuthStore(
    (state: AuthStore) => state.isAuthenticated,
  );
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
