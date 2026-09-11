import { useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Bell,
  CalendarDays,
  ClipboardList,
  Home,
  LogOut,
  Menu,
  Pill,
  Settings,
  Stethoscope,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext.jsx";
import PhilaChatBot from "./chatbot/PhilaChatBot.jsx";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/patient",
    icon: Home,
  },
  {
    label: "Medications",
    path: "/patient/medications",
    icon: Pill,
  },
  {
    label: "Appointments",
    path: "/patient/appointments",
    icon: CalendarDays,
  },
  {
    label: "Records",
    path: "/patient/records",
    icon: ClipboardList,
  },
  {
    label: "Nearest Clinics",
    path: "/patient/clinics",
    icon: Stethoscope,
  },
  {
    label: "Settings",
    path: "/patient/settings",
    icon: Settings,
  },
];

function initialsFromName(name) {
  if (!name) {
    return "PT";
  }

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] =
    useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const displayName =
    user?.fullName ||
    user?.name ||
    "Patient";

  const initials = initialsFromName(displayName);

  const currentPage =
    navigationItems.find((item) => {
      if (item.path === "/patient") {
        return location.pathname === "/patient";
      }

      return location.pathname.startsWith(item.path);
    }) || navigationItems[0];

  const handleLogout = () => {
    logout();
    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="patient-figma-root min-h-screen bg-[#f8fafc] text-[#0f172a]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[270px] border-r border-[#e2e8f0] bg-white lg:flex lg:flex-col">
        <div className="flex h-[78px] items-center border-b border-[#e2e8f0] px-7">
          <button
            type="button"
            onClick={() => navigate("/patient")}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f766e] text-white">
              <Stethoscope size={22} />
            </div>

            <div className="text-left">
              <div className="text-xl font-bold tracking-tight text-[#0f172a]">
                Phila
                <span className="text-[#0f766e]">
                  Link
                </span>
              </div>

              <div className="text-xs text-[#64748b]">
                Patient Portal
              </div>
            </div>
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-6">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/patient"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#ccfbf1] text-[#115e59]"
                      : "text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
                  }`
                }
              >
                <Icon size={20} />

                <span>
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-[#e2e8f0] p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-[#f8fafc] p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0f766e] text-sm font-semibold text-white">
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-[#0f172a]">
                {displayName}
              </div>

              <div className="text-xs text-[#64748b]">
                Patient
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#64748b] transition hover:bg-[#fee2e2] hover:text-[#dc2626]"
          >
            <LogOut size={19} />

            Logout
          </button>
        </div>
      </aside>

      <div className="lg:pl-[270px]">
        <header className="sticky top-0 z-30 flex h-[78px] items-center justify-between border-b border-[#e2e8f0] bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#e2e8f0] text-[#475569] lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={21} />
            </button>

            <div>
              <h1 className="text-lg font-semibold text-[#0f172a] sm:text-xl">
                {currentPage.label}
              </h1>

              <p className="hidden text-sm text-[#64748b] sm:block">
                Welcome back, {displayName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setNotificationsOpen(
                    (value) => !value
                  )
                }
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-[#475569] transition hover:bg-[#f8fafc]"
                aria-label="Notifications"
              >
                <Bell size={19} />

                <span className="absolute right-[7px] top-[7px] h-2 w-2 rounded-full bg-[#dc2626]" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-12 w-[320px] overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-xl sm:w-[360px]">
                  <div className="border-b border-[#e2e8f0] px-5 py-4">
                    <h2 className="font-semibold text-[#0f172a]">
                      Notifications
                    </h2>

                    <p className="mt-1 text-xs text-[#64748b]">
                      Your latest PhilaLink updates
                    </p>
                  </div>

                  <div className="divide-y divide-[#e2e8f0]">
                    <div className="px-5 py-4">
                      <p className="text-sm font-medium text-[#0f172a]">
                        Medication reminder
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#64748b]">
                        Remember to take your scheduled medication.
                      </p>
                    </div>

                    <div className="px-5 py-4">
                      <p className="text-sm font-medium text-[#0f172a]">
                        Upcoming appointment
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#64748b]">
                        Review your upcoming clinic appointment.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/patient/settings")
              }
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0f766e] text-sm font-semibold text-white"
              title={displayName}
            >
              {initials}
            </button>
          </div>
        </header>

        <main className="min-h-[calc(100vh-78px)]">
          <Outlet />
        </main>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/40"
            aria-label="Close navigation"
          />

          <aside className="relative flex h-full w-[290px] max-w-[85vw] flex-col bg-white shadow-2xl">
            <div className="flex h-[78px] items-center justify-between border-b border-[#e2e8f0] px-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0f766e] text-white">
                  <Stethoscope size={20} />
                </div>

                <span className="text-lg font-bold">
                  Phila
                  <span className="text-[#0f766e]">
                    Link
                  </span>
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setMobileOpen(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#64748b] hover:bg-[#f1f5f9]"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 space-y-2 px-4 py-6">
              {navigationItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/patient"}
                    onClick={() =>
                      setMobileOpen(false)
                    }
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
                        isActive
                          ? "bg-[#ccfbf1] text-[#115e59]"
                          : "text-[#475569] hover:bg-[#f1f5f9]"
                      }`
                    }
                  >
                    <Icon size={20} />

                    {item.label}
                  </NavLink>
                );
              })}
            </nav>

            <div className="border-t border-[#e2e8f0] p-4">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#dc2626] hover:bg-[#fee2e2]"
              >
                <LogOut size={19} />

                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      <PhilaChatBot />
    </div>
  );
}