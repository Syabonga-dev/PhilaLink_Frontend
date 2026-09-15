import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Spinner from "../components/ui/Spinner.jsx";

export function ProtectedRoute() {
  const {
    isAuthenticated,
    isLoading,
  } = useAuth();

  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Spinner label="Checking your session…" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return <Outlet />;
}

export function RoleRoute({
  allow,
}) {
  const {
    role,
    isLoading,
  } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Spinner label="Checking access…" />
      </div>
    );
  }

  if (
    !role ||
    !allow.includes(role)
  ) {
    return (
      <Navigate
        to={homePathForRole(role)}
        replace
      />
    );
  }

  return <Outlet />;
}

export function homePathForRole(
  role
) {
  switch (role) {
    case "Patient":
      return "/patient";

    case "Nurse":
      return "/nurse";

    case "Proxy":
      return "/proxy";

    case "ClinicAdmin":
    case "SuperAdmin":
      return "/admin";

    default:
      return "/login";
  }
}