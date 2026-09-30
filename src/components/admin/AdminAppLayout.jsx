import {
  useState,
} from "react";

import {
  NavLink,
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  BarChart3,
  Boxes,
  Building2,
  ClipboardList,
  FileBarChart,
  LogOut,
  Menu,
  ShieldCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";

import {
  useAuth,
} from "../../context/AuthContext.jsx";

const CLINIC_ADMIN_NAV = [
  {
    to:
      "/admin",
    label:
      "Analytics",
    icon:
      BarChart3,
    end:
      true,
  },
  {
    to:
      "/admin/inventory",
    label:
      "Inventory",
    icon:
      Boxes,
  },
  {
    to:
      "/admin/reports",
    label:
      "Reports",
    icon:
      FileBarChart,
  },
  {
    to:
      "/admin/staff",
    label:
      "Staff",
    icon:
      Users,
  },
  {
    to:
      "/admin/register-staff",
    label:
      "Register",
    icon:
      UserPlus,
  },
  {
    to:
      "/admin/audit",
    label:
      "Audit",
    icon:
      ClipboardList,
  },
];

const SUPER_ADMIN_NAV = [
  {
    to:
      "/admin",
    label:
      "Overview",
    icon:
      BarChart3,
    end:
      true,
  },
  {
    to:
      "/admin/staff",
    label:
      "Accounts",
    icon:
      Users,
  },
  {
    to:
      "/admin/register-staff",
    label:
      "Register",
    icon:
      UserPlus,
  },
  {
    to:
      "/admin/clinics",
    label:
      "Clinics",
    icon:
      Building2,
  },
  {
    to:
      "/admin/register-clinic-admin",
    label:
      "Admins",
    icon:
      ShieldCheck,
  },
  {
    to:
      "/admin/audit",
    label:
      "Audit",
    icon:
      ClipboardList,
  },
];

function initials(
  value
) {
  const words =
    String(
      value ||
        ""
    )
      .trim()
      .split(
        /\s+/
      )
      .filter(
        Boolean
      );

  if (
    words.length ===
    0
  ) {
    return "AD";
  }

  return words
    .slice(
      0,
      2
    )
    .map(
      word =>
        word[0]
          .toUpperCase()
    )
    .join("");
}

function pageTitle(
  pathname
) {
  if (
    pathname ===
    "/admin"
  ) {
    return "Dashboard";
  }

  if (
    pathname.startsWith(
      "/admin/inventory"
    )
  ) {
    return "Inventory";
  }

  if (
    pathname.startsWith(
      "/admin/reports"
    )
  ) {
    return "Reports";
  }

  if (
    pathname.startsWith(
      "/admin/register-staff"
    )
  ) {
    return "Register Staff";
  }

  if (
    pathname.startsWith(
      "/admin/staff"
    )
  ) {
    return "Staff";
  }

  if (
    pathname.startsWith(
      "/admin/audit"
    )
  ) {
    return "Audit Log";
  }

  if (
    pathname.startsWith(
      "/admin/clinics"
    )
  ) {
    return "Clinics";
  }

  if (
    pathname.startsWith(
      "/admin/register-clinic-admin"
    )
  ) {
    return "Clinic Admins";
  }

  return "Administration";
}

export default function AdminAppLayout() {
  const {
    user,
    role,
    logout,
  } =
    useAuth();

  const location =
    useLocation();

  const [
    mobileOpen,
    setMobileOpen,
  ] =
    useState(
      false
    );

  const navigation =
    role ===
    "SuperAdmin"
      ? SUPER_ADMIN_NAV
      : CLINIC_ADMIN_NAV;

  const displayName =
    user?.fullName ||
    user?.name ||
    "Administrator";

  return (
    <div className="min-h-screen bg-[#f7faf9] text-slate-950">
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[2px] lg:hidden"
          onClick={() =>
            setMobileOpen(
              false
            )
          }
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[92px] flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex h-[82px] items-center justify-center border-b border-slate-100">
          <NavLink
            to="/admin"
            onClick={() =>
              setMobileOpen(
                false
              )
            }
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 ring-1 ring-teal-100"
            title="PhilaLink"
          >
            <img
              src="/logo2.png"
              alt="PhilaLink"
              className="h-10 w-10 object-contain"
            />
          </NavLink>
        </div>

        <nav className="min-h-0 flex-1 space-y-2 overflow-y-auto px-2 py-5">
          {navigation.map(
            item => {
              const Icon =
                item.icon;

              return (
                <NavLink
                  key={
                    item.to
                  }
                  to={
                    item.to
                  }
                  end={
                    item.end
                  }
                  title={
                    item.label
                  }
                  onClick={() =>
                    setMobileOpen(
                      false
                    )
                  }
                  className={({
                    isActive,
                  }) =>
                    `group flex min-h-[62px] flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[10px] font-semibold transition ${
                      isActive
                        ? "bg-teal-50 text-[#0f766e] ring-1 ring-teal-100"
                        : "text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                    }`
                  }
                >
                  <Icon
                    size={20}
                    strokeWidth={1.9}
                  />

                  <span className="max-w-full truncate">
                    {item.label}
                  </span>
                </NavLink>
              );
            }
          )}
        </nav>

        <div className="border-t border-slate-100 px-2 py-4">
          <div
            title={
              displayName
            }
            className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0f766e] text-xs font-bold text-white shadow-sm"
          >
            {initials(
              displayName
            )}
          </div>

          <button
            type="button"
            title="Logout"
            onClick={
              logout
            }
            className="mx-auto mt-3 flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut
              size={18}
            />
          </button>
        </div>
      </aside>

      <div className="lg:pl-[92px]">
        <header className="sticky top-0 z-30 flex h-[72px] items-center border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <button
            type="button"
            className="mr-3 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 lg:hidden"
            onClick={() =>
              setMobileOpen(
                true
              )
            }
          >
            <Menu
              size={20}
            />
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-900">
              {pageTitle(
                location.pathname
              )}
            </p>

            <p className="mt-0.5 truncate text-[11px] text-slate-400">
              {role ===
              "SuperAdmin"
                ? "PhilaLink system administration"
                : "Clinic administration"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="max-w-[220px] truncate text-xs font-bold text-slate-900">
                {displayName}
              </p>

              <p className="text-[10px] text-slate-400">
                {role ===
                "SuperAdmin"
                  ? "Super Administrator"
                  : "Clinic Administrator"}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0f766e] text-xs font-bold text-white shadow-sm">
              {initials(
                displayName
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1650px] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {mobileOpen && (
        <button
          type="button"
          className="fixed left-[98px] top-4 z-[60] flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-600 shadow-lg lg:hidden"
          onClick={() =>
            setMobileOpen(
              false
            )
          }
        >
          <X
            size={19}
          />
        </button>
      )}
    </div>
  );
}
