import {
  useEffect,
  useMemo,
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
  LayoutDashboard,
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

import {
  adminApi,
} from "../../services/api/admin.js";

const CLINIC_ADMIN_NAV = [
  {
    to: "/admin",
    label: "Analytics",
    icon: BarChart3,
    end: true,
  },
  {
    to: "/admin/inventory",
    label: "Inventory",
    icon: Boxes,
  },
  {
    to: "/admin/reports",
    label: "Reports",
    icon: FileBarChart,
  },
  {
    to: "/admin/staff",
    label: "Staff",
    icon: Users,
  },
  {
    to: "/admin/register-staff",
    label: "Register staff",
    icon: UserPlus,
  },
  {
    to: "/admin/audit",
    label: "Audit log",
    icon: ClipboardList,
  },
];

const SUPER_ADMIN_SECTIONS = [
  {
    label: "System",
    items: [
      {
        to: "/admin",
        label: "Overview",
        icon: LayoutDashboard,
        end: true,
      },
      {
        to: "/admin/analytics",
        label: "Analytics",
        icon: BarChart3,
      },
      {
        to: "/admin/system-reports",
        label: "Reports",
        icon: FileBarChart,
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        to: "/admin/staff",
        label: "Accounts",
        icon: Users,
      },
      {
        to: "/admin/clinics",
        label: "Clinics",
        icon: Building2,
      },
      {
        to: "/admin/clinic-admins",
        label: "Clinic admins",
        icon: ShieldCheck,
      },
    ],
  },
  {
    label: "Governance",
    items: [
      {
        to: "/admin/audit",
        label: "Audit log",
        icon: ClipboardList,
      },
    ],
  },
];

function initials(value) {
  const words = String(
    value || ""
  )
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) {
    return "AD";
  }

  return words
    .slice(0, 2)
    .map(
      word =>
        word[0]?.toUpperCase()
    )
    .join("");
}

function pageTitle(
  pathname,
  role
) {
  if (
    pathname ===
    "/admin"
  ) {
    return role ===
      "SuperAdmin"
      ? "Overview"
      : "Analytics";
  }

  if (
    pathname.startsWith(
      "/admin/analytics"
    )
  ) {
    return "Analytics";
  }

  if (
    pathname.startsWith(
      "/admin/system-reports"
    )
  ) {
    return "Reports";
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
    return "Register staff";
  }

  if (
    pathname.startsWith(
      "/admin/staff"
    )
  ) {
    return role ===
      "SuperAdmin"
      ? "Accounts"
      : "Staff";
  }

  if (
    pathname.startsWith(
      "/admin/audit"
    )
  ) {
    return "Audit log";
  }

  if (
    pathname.startsWith(
      "/admin/register-clinic-admin"
    )
  ) {
    return "Register Clinic Administrator";
  }

  if (
    pathname.startsWith(
      "/admin/clinic-admins"
    )
  ) {
    return "Clinic admins";
  }

  if (
    pathname.startsWith(
      "/admin/clinics"
    )
  ) {
    return "Clinics";
  }

  return "Administration";
}

function NavSection({
  label,
  items,
  onNavigate,
}) {
  return (
    <div>
      <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>

      <div className="mt-2 space-y-1">
        {items.map(
          item => {
            const Icon =
              item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={
                  onNavigate
                }
                className={({
                  isActive,
                }) =>
                  `group relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#e9f6f3] text-[#0f766e]"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                {({
                  isActive,
                }) => (
                  <>
                    {isActive ? (
                      <span className="absolute inset-y-0 left-0 w-[3px] bg-[#0f766e]" />
                    ) : null}

                    <Icon
                      size={17}
                      strokeWidth={
                        1.8
                      }
                    />

                    <span className="truncate">
                      {
                        item.label
                      }
                    </span>
                  </>
                )}
              </NavLink>
            );
          }
        )}
      </div>
    </div>
  );
}

export default function AdminAppLayout() {
  const {
    user,
    role,
    logout,
  } = useAuth();

  const location =
    useLocation();

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  const [
    profile,
    setProfile,
  ] = useState(null);

  const [
    viewportHeight,
    setViewportHeight,
  ] = useState(null);

  /*
   * Load the current administrator profile.
   */
  useEffect(() => {
    let active = true;

    adminApi
      .getMe()
      .then(
        result => {
          if (active) {
            setProfile(
              result
            );
          }
        }
      )
      .catch(
        () => {
          if (active) {
            setProfile(
              null
            );
          }
        }
      );

    return () => {
      active = false;
    };
  }, []);

  /*
   * Close the mobile drawer whenever
   * navigation changes.
   */
  useEffect(() => {
    setMobileOpen(
      false
    );
  }, [
    location.pathname,
  ]);

  /*
   * Prevent the page behind the drawer
   * from scrolling while the drawer is open.
   */
  useEffect(() => {
    if (!mobileOpen) {
      return undefined;
    }

    const previousOverflow =
      document.body
        .style
        .overflow;

    document.body
      .style
      .overflow =
      "hidden";

    return () => {
      document.body
        .style
        .overflow =
        previousOverflow;
    };
  }, [
    mobileOpen,
  ]);

  /*
   * Track only the ACTUAL visible viewport height.
   *
   * Important:
   * Do NOT apply visualViewport.offsetTop to a fixed
   * element. Fixed elements are already positioned
   * inside the browser's visible viewport on these
   * mobile browsers.
   *
   * Adding offsetTop as well can move the bottom of
   * the sidebar beneath the browser controls.
   */
  useEffect(() => {
    function updateViewportHeight() {
      const viewport =
        window.visualViewport;

      const height =
        viewport?.height ||
        window.innerHeight ||
        document.documentElement
          .clientHeight;

      setViewportHeight(
        Math.max(
          1,
          Math.floor(
            height
          )
        )
      );
    }

    updateViewportHeight();

    const viewport =
      window.visualViewport;

    viewport?.addEventListener(
      "resize",
      updateViewportHeight
    );

    viewport?.addEventListener(
      "scroll",
      updateViewportHeight
    );

    window.addEventListener(
      "resize",
      updateViewportHeight
    );

    window.addEventListener(
      "orientationchange",
      updateViewportHeight
    );

    return () => {
      viewport?.removeEventListener(
        "resize",
        updateViewportHeight
      );

      viewport?.removeEventListener(
        "scroll",
        updateViewportHeight
      );

      window.removeEventListener(
        "resize",
        updateViewportHeight
      );

      window.removeEventListener(
        "orientationchange",
        updateViewportHeight
      );
    };
  }, []);

  const displayName =
    user?.fullName ||
    user?.name ||
    profile?.fullName ||
    "Administrator";

  const contextName =
    role ===
    "ClinicAdmin"
      ? profile
          ?.clinicName ||
        "Assigned clinic"
      : "PhilaLink administration";

  const sections =
    useMemo(
      () => {
        if (
          role ===
          "SuperAdmin"
        ) {
          return SUPER_ADMIN_SECTIONS;
        }

        return [
          {
            label:
              "Clinic operations",

            items:
              CLINIC_ADMIN_NAV
                .slice(
                  0,
                  3
                ),
          },

          {
            label:
              "Workforce",

            items:
              CLINIC_ADMIN_NAV
                .slice(
                  3,
                  5
                ),
          },

          {
            label:
              "Governance",

            items:
              CLINIC_ADMIN_NAV
                .slice(
                  5
                ),
          },
        ];
      },
      [
        role,
      ]
    );

  /*
   * Fall back to svh before JavaScript has measured
   * the viewport. Once measured, use the actual
   * visible pixel height.
   */
  const sidebarStyle =
    viewportHeight
      ? {
          height:
            `${viewportHeight}px`,

          maxHeight:
            `${viewportHeight}px`,

          gridTemplateRows:
            "76px auto minmax(0, 1fr) auto",
        }
      : {
          height:
            "100svh",

          maxHeight:
            "100svh",

          gridTemplateRows:
            "76px auto minmax(0, 1fr) auto",
        };

  return (
    <div className="min-h-screen bg-[#f4f6f5] text-slate-950">
      {/* ============================================= */}
      {/* MOBILE BACKDROP                               */}
      {/* ============================================= */}

      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-slate-950/35 lg:hidden"
          onClick={() =>
            setMobileOpen(
              false
            )
          }
        />
      ) : null}

      {/* ============================================= */}
      {/* SIDEBAR                                       */}
      {/* ============================================= */}

      <aside
        className={`fixed left-0 top-0 z-50 grid w-[252px] overflow-hidden border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
        style={
          sidebarStyle
        }
      >
        {/* =========================================== */}
        {/* BRAND                                       */}
        {/* =========================================== */}

        <div className="flex h-[76px] min-h-0 items-center border-b border-slate-200 px-5">
          <NavLink
            to="/admin"
            onClick={() =>
              setMobileOpen(
                false
              )
            }
            className="flex min-w-0 items-center gap-3"
          >
            <img
              src="/logo2.png"
              alt="PhilaLink"
              className="h-9 w-9 shrink-0 object-contain"
            />

            <div className="min-w-0">
              <p className="truncate text-[17px] font-semibold tracking-[-0.02em] text-slate-950">
                PhilaLink
              </p>

              <p className="truncate text-[10px] font-medium uppercase tracking-[0.12em] text-[#0f766e]">
                {role ===
                "SuperAdmin"
                  ? "System admin"
                  : "Clinic admin"}
              </p>
            </div>
          </NavLink>
        </div>

        {/* =========================================== */}
        {/* WORKING CONTEXT                             */}
        {/* =========================================== */}

        <div className="min-h-0 border-b border-slate-200 px-5 py-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-slate-400">
            Working context
          </p>

          <p className="mt-1 truncate text-sm font-semibold text-slate-900">
            {contextName}
          </p>

          <p className="mt-0.5 text-[11px] text-slate-500">
            {role ===
            "SuperAdmin"
              ? "National administration"
              : "Clinic-scoped access"}
          </p>
        </div>

        {/* =========================================== */}
        {/* SCROLLABLE NAVIGATION                       */}
        {/* =========================================== */}

        <nav className="min-h-0 overflow-y-auto overscroll-contain px-3 py-5">
          <div className="space-y-6">
            {sections.map(
              section => (
                <NavSection
                  key={
                    section.label
                  }
                  label={
                    section.label
                  }
                  items={
                    section.items
                  }
                  onNavigate={() =>
                    setMobileOpen(
                      false
                    )
                  }
                />
              )
            )}
          </div>
        </nav>

        {/* =========================================== */}
        {/* PROFILE + LOGOUT                            */}
        {/* =========================================== */}

        <div
          className="
            min-h-0
            border-t
            border-slate-200
            bg-white
            px-4
            pt-3
            pb-[calc(0.75rem+env(safe-area-inset-bottom))]
          "
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-slate-900 text-xs font-semibold text-white">
              {initials(
                displayName
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-900">
                {
                  displayName
                }
              </p>

              <p className="truncate text-[10px] text-slate-500">
                {role ===
                "SuperAdmin"
                  ? "Super Administrator"
                  : "Clinic Administrator"}
              </p>
            </div>

            <button
              type="button"
              onClick={
                logout
              }
              title="Sign out"
              aria-label="Sign out"
              className="flex h-9 w-9 shrink-0 items-center justify-center border border-slate-200 bg-white text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut
                size={16}
              />
            </button>
          </div>
        </div>
      </aside>

      {/* ============================================= */}
      {/* CONTENT                                       */}
      {/* ============================================= */}

      <div className="lg:pl-[252px]">
        <header className="sticky top-0 z-30 flex h-[64px] items-center border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <button
            type="button"
            className="mr-3 flex h-9 w-9 items-center justify-center border border-slate-200 text-slate-600 lg:hidden"
            onClick={() =>
              setMobileOpen(
                true
              )
            }
            aria-label="Open navigation"
          >
            <Menu
              size={18}
            />
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">
              {pageTitle(
                location.pathname,
                role
              )}
            </p>

            <p className="mt-0.5 truncate text-[11px] text-slate-500">
              {contextName}
            </p>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <div className="text-right">
              <p className="max-w-[220px] truncate text-xs font-medium text-slate-800">
                {
                  displayName
                }
              </p>

              <p className="text-[10px] text-slate-400">
                {role ===
                "SuperAdmin"
                  ? "Super Administrator"
                  : "Clinic Administrator"}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center bg-[#0f766e] text-xs font-semibold text-white">
              {initials(
                displayName
              )}
            </div>
          </div>
        </header>

        <main className="w-full p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* ============================================= */}
      {/* MOBILE CLOSE BUTTON                           */}
      {/* ============================================= */}

      {mobileOpen ? (
        <button
          type="button"
          onClick={() =>
            setMobileOpen(
              false
            )
          }
          aria-label="Close navigation"
          className="fixed left-[260px] top-3 z-[60] flex h-9 w-9 items-center justify-center border border-slate-200 bg-white text-slate-600 shadow lg:hidden"
        >
          <X
            size={17}
          />
        </button>
      ) : null}
    </div>
  );
}
