import {
  useState,
} from "react";
import {
  Outlet,
  useLocation,
} from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const TITLES = {
  "/nurse":
    "Nurse Dashboard",

  "/nurse/patients":
    "Patients",

  "/nurse/collections":
    "Medication Collections",

  "/proxy":
    "Proxy Dashboard",

  "/proxy/patients":
    "Patients",

  "/proxy/collections":
    "Collections",

  "/admin":
    "Admin Overview",

  "/admin/register-staff":
    "Register Nurse / Proxy",

  "/admin/staff":
    "Manage Staff",

  "/admin/audit":
    "Audit Log",

  "/admin/clinics":
    "Manage Clinics",

  "/admin/register-clinic-admin":
    "Register Clinic Admin",
};

export default function AuthenticatedLayout() {
  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  const { role } =
    useAuth();

  const location =
    useLocation();

  const title =
    TITLES[
      location.pathname
    ] || "PhilaLink";

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        role={role}
        open={
          sidebarOpen
        }
        onClose={() =>
          setSidebarOpen(
            false
          )
        }
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          title={title}
          onMenuClick={() =>
            setSidebarOpen(
              true
            )
          }
        />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
