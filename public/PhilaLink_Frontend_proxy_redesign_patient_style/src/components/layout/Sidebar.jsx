import { NavLink } from "react-router-dom";

const NURSE_NAV = [
  {
    to: "/nurse",
    label: "Dashboard",
    icon: "space_dashboard",
    end: true,
  },
  {
    to: "/nurse/patients",
    label: "Patients",
    icon: "groups",
  },
  {
    to: "/nurse/collections",
    label: "Collections",
    icon: "inventory_2",
  },
];

const PROXY_NAV = [
  {
    to: "/proxy",
    label: "Dashboard",
    icon: "space_dashboard",
    end: true,
  },
  {
    to: "/proxy/patients",
    label: "Patients",
    icon: "family_restroom",
  },
  {
    to: "/proxy/collections",
    label: "Collections",
    icon: "inventory_2",
  },
];

const ADMIN_NAV = [
  {
    to: "/admin",
    label: "Overview",
    icon: "space_dashboard",
    end: true,
  },
  {
    to: "/admin/register-staff",
    label: "Register Staff",
    icon: "person_add",
  },
  {
    to: "/admin/staff",
    label: "Manage Staff",
    icon: "badge",
  },
  {
    to: "/admin/audit",
    label: "Audit Log",
    icon: "history",
  },
];

const SUPER_ADMIN_NAV = [
  ...ADMIN_NAV,
  {
    to: "/admin/clinics",
    label: "Manage Clinics",
    icon: "local_hospital",
  },
  {
    to: "/admin/register-clinic-admin",
    label: "Register Clinic Admin",
    icon: "admin_panel_settings",
  },
];

const NAV_BY_ROLE = {
  Nurse: NURSE_NAV,
  Proxy: PROXY_NAV,
  ClinicAdmin: ADMIN_NAV,
  SuperAdmin: SUPER_ADMIN_NAV,
};

export default function Sidebar({
  role,
  open,
  onClose,
}) {
  const items =
    NAV_BY_ROLE[
      role
    ] || [];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={
            onClose
          }
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-outline-variant/60 bg-surface-container-lowest transition-transform duration-200 lg:static lg:translate-x-0 ${
          open
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center border-b border-outline-variant/60 px-5">
          <NavLink
            to={
              role === "Nurse"
                ? "/nurse"
                : role === "Proxy"
                  ? "/proxy"
                  : "/admin"
            }
            onClick={
              onClose
            }
            className="flex min-w-0 items-center gap-3"
            aria-label="PhilaLink home"
          >
            <img
              src="./logo2.png"
              alt="PhilaLink logo"
              className="h-11 w-11 shrink-0 object-contain"
            />

            <span className="text-lg font-bold text-on-surface">
              Phila
              <span className="text-primary">
                Link
              </span>
            </span>
          </NavLink>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {items.map(
            (item) => (
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
                onClick={
                  onClose
                }
                className={({
                  isActive,
                }) =>
                  `flex items-center gap-3 rounded-md border-l-[3px] px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "border-primary bg-primary-container/10 text-primary"
                      : "border-transparent text-on-surface-variant hover:bg-surface-container"
                  }`
                }
              >
                <span className="material-symbols-outlined text-[20px]">
                  {
                    item.icon
                  }
                </span>

                {item.label}
              </NavLink>
            )
          )}
        </nav>
      </aside>
    </>
  );
}
