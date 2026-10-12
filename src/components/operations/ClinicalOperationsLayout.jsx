import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Bell,
  CalendarDays,
  CheckCheck,
  Cookie,
  LayoutDashboard,
  LogOut,
  Menu,
  PackageCheck,
  RefreshCw,
  Settings,
  Users,
  X,
} from "lucide-react";

import {
  useAuth,
} from "../../context/AuthContext.jsx";

import {
  notificationsApi,
} from "../../services/api/notifications.js";

import {
  nursesApi,
} from "../../services/api/nurses.js";

import {
  proxiesApi,
} from "../../services/api/proxies.js";

import "../../styles/clinical-operations.css";

const PORTALS = {
  nurse: {
    basePath: "/nurse",
    roleLabel: "Clinic nurse",
    shortRole: "Nurse",
    fallbackContext: "Assigned clinic",

    nav: [
      {
        to: "/nurse",
        label: "Overview",
        icon: LayoutDashboard,
        end: true,
        section: "Clinical operations",
      },
      {
        to: "/nurse/patients",
        label: "Patients",
        icon: Users,
        section: "Clinical operations",
      },
      {
        to: "/nurse/appointments",
        label: "Appointments",
        icon: CalendarDays,
        section: "Clinical operations",
      },
      {
        to: "/nurse/collections",
        label: "Collections",
        icon: PackageCheck,
        section: "Clinical operations",
      },
      {
        to: "/nurse/settings",
        label: "Settings",
        icon: Settings,
        section: "Account",
      },
    ],

    loadContext: () =>
      nursesApi.getMe(),

    getContextName:
      profile =>
        profile?.clinicName ||
        "Assigned clinic",
  },

  proxy: {
    basePath: "/proxy",
    roleLabel: "Care proxy",
    shortRole: "Proxy",
    fallbackContext:
      "Linked patient care",

    nav: [
      {
        to: "/proxy",
        label: "Overview",
        icon: LayoutDashboard,
        end: true,
        section: "Care coordination",
      },
      {
        to: "/proxy/patients",
        label: "Patients",
        icon: Users,
        section: "Care coordination",
      },
      {
        to: "/proxy/collections",
        label: "Collections",
        icon: PackageCheck,
        section: "Care coordination",
      },
      {
        to: "/proxy/settings",
        label: "Settings",
        icon: Settings,
        section: "Account",
      },
    ],

    loadContext: () =>
      proxiesApi.getCare(),

    getContextName:
      care =>
        care?.clinicName ||
        "Linked patient care",
  },
};

function initials(
  value,
  fallback
) {
  const words =
    String(value || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  if (!words.length) {
    return fallback;
  }

  return words
    .slice(0, 2)
    .map(
      word =>
        word[0]?.toUpperCase()
    )
    .join("");
}

function formatNotificationDate(
  value
) {
  if (!value) {
    return "";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  return date.toLocaleString(
    "en-ZA",
    {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

function pageTitle(
  pathname,
  portal
) {
  const base =
    portal.basePath;

  if (
    pathname ===
    base
  ) {
    return "Overview";
  }

  if (
    pathname.startsWith(
      `${base}/patients/`
    )
  ) {
    return "Patient care";
  }

  if (
    pathname.startsWith(
      `${base}/patients`
    )
  ) {
    return "Patients";
  }

  if (
    pathname.startsWith(
      `${base}/appointments`
    )
  ) {
    return "Appointments";
  }

  if (
    pathname.startsWith(
      `${base}/collections`
    )
  ) {
    return "Collections";
  }

  if (
    pathname.startsWith(
      `${base}/settings`
    )
  ) {
    return "Settings";
  }

  return portal.shortRole;
}

function useVisibleViewportHeight() {
  const [
    height,
    setHeight,
  ] = useState(null);

  useEffect(() => {
    function update() {
      const measured =
        window.visualViewport
          ?.height ||
        window.innerHeight ||
        document.documentElement
          .clientHeight;

      setHeight(
        Math.max(
          1,
          Math.floor(
            measured
          )
        )
      );
    }

    update();

    const viewport =
      window.visualViewport;

    viewport?.addEventListener(
      "resize",
      update
    );

    viewport?.addEventListener(
      "scroll",
      update
    );

    window.addEventListener(
      "resize",
      update
    );

    window.addEventListener(
      "orientationchange",
      update
    );

    return () => {
      viewport?.removeEventListener(
        "resize",
        update
      );

      viewport?.removeEventListener(
        "scroll",
        update
      );

      window.removeEventListener(
        "resize",
        update
      );

      window.removeEventListener(
        "orientationchange",
        update
      );
    };
  }, []);

  return height;
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
        {items.map(item => {
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
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}

function NotificationsPanel({
  notifications,
  loading,
  error,
  onRefresh,
  onMarkAllRead,
  onNotificationClick,
  onClose,
}) {
  const unread =
    notifications.filter(
      item =>
        !item.isRead
    );

  return (
    <div className="absolute right-4 top-[56px] z-[80] w-[min(380px,calc(100vw-2rem))] border border-slate-200 bg-white shadow-xl sm:right-6 lg:right-8">
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-slate-950">
            Notifications
          </p>

          <p className="mt-0.5 text-[11px] text-slate-500">
            {unread.length} unread
          </p>
        </div>

        <button
          type="button"
          onClick={
            onClose
          }
          aria-label="Close notifications"
          className="flex h-8 w-8 items-center justify-center border border-slate-200 text-slate-500 hover:bg-slate-50"
        >
          <X size={15} />
        </button>
      </div>

      <div className="flex items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2">
        <button
          type="button"
          onClick={
            onRefresh
          }
          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600 hover:text-slate-900"
        >
          <RefreshCw
            size={13}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>

        {unread.length ? (
          <button
            type="button"
            onClick={
              onMarkAllRead
            }
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#0f766e] hover:underline"
          >
            <CheckCheck
              size={13}
            />

            Mark all read
          </button>
        ) : null}
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        {loading &&
        !notifications.length ? (
          <div className="px-4 py-10 text-center text-xs text-slate-500">
            Loading notifications…
          </div>
        ) : error ? (
          <div className="m-4 border border-red-200 bg-red-50 px-3 py-3 text-xs text-red-700">
            {error}
          </div>
        ) : !notifications.length ? (
          <div className="px-4 py-10 text-center text-xs text-slate-500">
            No notifications.
          </div>
        ) : (
          notifications.map(
            notification => (
              <button
                key={
                  notification.id
                }
                type="button"
                onClick={() =>
                  onNotificationClick(
                    notification
                  )
                }
                className={`block w-full border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-slate-50 ${
                  notification.isRead
                    ? "bg-white"
                    : "bg-[#f0fdfa]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      notification.isRead
                        ? "bg-slate-300"
                        : "bg-[#0f766e]"
                    }`}
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-xs leading-5 text-slate-700">
                      {notification.message ||
                        "Notification"}
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                      {formatNotificationDate(
                        notification.createdAt
                      )}
                    </p>
                  </div>
                </div>
              </button>
            )
          )
        )}
      </div>
    </div>
  );
}

export default function ClinicalOperationsLayout({
  portal:
    portalKey,
}) {
  const portal =
    PORTALS[portalKey] ||
    PORTALS.nurse;

  const {
    user,
    logout,
  } = useAuth();

  const location =
    useLocation();

  const navigate =
    useNavigate();

  const viewportHeight =
    useVisibleViewportHeight();

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  const [
    notificationsOpen,
    setNotificationsOpen,
  ] = useState(false);

  const [
    notifications,
    setNotifications,
  ] = useState([]);

  const [
    notificationsLoading,
    setNotificationsLoading,
  ] = useState(false);

  const [
    notificationsError,
    setNotificationsError,
  ] = useState("");

  const [
    contextName,
    setContextName,
  ] = useState(
    portal.fallbackContext
  );

  useEffect(() => {
    document
      .documentElement
      .setAttribute(
        "data-theme",
        "light"
      );
  }, []);

  useEffect(() => {
    let active = true;

    portal
      .loadContext()
      .then(result => {
        if (!active) {
          return;
        }

        setContextName(
          portal.getContextName(
            result
          ) ||
            portal.fallbackContext
        );
      })
      .catch(() => {
        if (active) {
          setContextName(
            portal.fallbackContext
          );
        }
      });

    return () => {
      active = false;
    };
  }, [
    portal,
  ]);

  const loadNotifications =
    useCallback(
      async () => {
        try {
          setNotificationsLoading(
            true
          );

          setNotificationsError(
            ""
          );

          const result =
            await notificationsApi
              .getMine();

          setNotifications(
            Array.isArray(
              result
            )
              ? result
              : []
          );
        } catch (error) {
          console.error(
            `Failed to load ${portal.shortRole} notifications:`,
            error
          );

          setNotificationsError(
            error?.message ||
              "Could not load notifications."
          );
        } finally {
          setNotificationsLoading(
            false
          );
        }
      },
      [
        portal.shortRole,
      ]
    );

  useEffect(() => {
    loadNotifications();
  }, [
    loadNotifications,
  ]);

  useEffect(() => {
    setMobileOpen(
      false
    );

    setNotificationsOpen(
      false
    );
  }, [
    location.pathname,
    location.search,
  ]);

  useEffect(() => {
    if (!mobileOpen) {
      return undefined;
    }

    const previous =
      document.body.style
        .overflow;

    document.body.style
      .overflow =
      "hidden";

    return () => {
      document.body.style
        .overflow =
        previous;
    };
  }, [
    mobileOpen,
  ]);

  useEffect(() => {
    if (
      !mobileOpen &&
      !notificationsOpen
    ) {
      return undefined;
    }

    const handleKeyDown =
      event => {
        if (
          event.key ===
          "Escape"
        ) {
          setMobileOpen(
            false
          );

          setNotificationsOpen(
            false
          );
        }
      };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [
    mobileOpen,
    notificationsOpen,
  ]);

  async function handleNotificationClick(
    notification
  ) {
    if (
      !notification?.id ||
      notification.isRead
    ) {
      return;
    }

    try {
      await notificationsApi
        .markRead(
          notification.id
        );

      setNotifications(
        current =>
          current.map(
            item =>
              item.id ===
              notification.id
                ? {
                    ...item,
                    isRead:
                      true,
                  }
                : item
          )
      );
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error
      );
    }
  }

  async function markAllRead() {
    try {
      await notificationsApi
        .markAllRead();

      setNotifications(
        current =>
          current.map(
            item => ({
              ...item,
              isRead: true,
            })
          )
      );
    } catch (error) {
      console.error(
        "Failed to mark all notifications as read:",
        error
      );
    }
  }

  function openCookieSettings() {
    window.dispatchEvent(
      new Event(
        "philalink:open-cookie-settings"
      )
    );

    setMobileOpen(
      false
    );
  }

  function handleLogout() {
    logout();

    navigate(
      "/login",
      {
        replace:
          true,
      }
    );
  }

  const displayName =
    user?.fullName ||
    user?.name ||
    portal.shortRole;

  const displayInitials =
    initials(
      displayName,
      portalKey ===
      "proxy"
        ? "PX"
        : "NU"
    );

  const unreadCount =
    notifications.filter(
      item =>
        !item.isRead
    ).length;

  const sections =
    useMemo(() => {
      const grouped =
        new Map();

      portal.nav.forEach(
        item => {
          if (
            !grouped.has(
              item.section
            )
          ) {
            grouped.set(
              item.section,
              []
            );
          }

          grouped
            .get(
              item.section
            )
            .push(item);
        }
      );

      return Array.from(
        grouped.entries()
      ).map(
        ([
          label,
          items,
        ]) => ({
          label,
          items,
        })
      );
    }, [
      portal,
    ]);

  const sidebarStyle = {
    height:
      viewportHeight
        ? `${viewportHeight}px`
        : "100svh",

    maxHeight:
      viewportHeight
        ? `${viewportHeight}px`
        : "100svh",

    gridTemplateRows:
      "64px auto minmax(0, 1fr) auto",
  };

  return (
    <div
      className="patient-figma-root clinical-ops-root min-h-screen bg-[#f4f6f5] text-slate-950"
      data-portal={
        portalKey
      }
    >
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
        <div className="flex h-[64px] min-h-0 items-center border-b border-slate-200 px-5">
          <NavLink
            to={
              portal.basePath
            }
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
                {
                  portal.roleLabel
                }
              </p>
            </div>
          </NavLink>
        </div>

        <div className="min-h-0 border-b border-slate-200 px-5 py-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-slate-400">
            Working context
          </p>

          <p className="mt-1 truncate text-sm font-semibold text-slate-900">
            {contextName}
          </p>

          <p className="mt-0.5 text-[11px] text-slate-500">
            {portalKey ===
            "nurse"
              ? "Clinic-scoped clinical access"
              : "Linked-patient care access"}
          </p>
        </div>

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

        <div className="min-h-0 border-t border-slate-200 bg-white px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={
              openCookieSettings
            }
            className="mb-3 flex w-full items-center gap-2 border border-slate-200 bg-white px-3 py-2 text-left text-[11px] font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <Cookie
              size={14}
            />

            Cookie preferences
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-slate-900 text-xs font-semibold text-white">
              {
                displayInitials
              }
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-900">
                {displayName}
              </p>

              <p className="truncate text-[10px] text-slate-500">
                {
                  portal.roleLabel
                }
              </p>
            </div>

            <button
              type="button"
              onClick={
                handleLogout
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
                portal
              )}
            </p>

            <p className="mt-0.5 truncate text-[11px] text-slate-500">
              {contextName}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              aria-label="Notifications"
              onClick={() =>
                setNotificationsOpen(
                  current =>
                    !current
                )
              }
              className="relative flex h-9 w-9 items-center justify-center border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
            >
              <Bell
                size={16}
              />

              {unreadCount >
              0 ? (
                <span className="absolute -right-1 -top-1 flex min-h-[17px] min-w-[17px] items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-semibold text-white">
                  {unreadCount >
                  9
                    ? "9+"
                    : unreadCount}
                </span>
              ) : null}
            </button>

            <div className="hidden items-center gap-3 sm:flex">
              <div className="text-right">
                <p className="max-w-[220px] truncate text-xs font-medium text-slate-800">
                  {displayName}
                </p>

                <p className="text-[10px] text-slate-400">
                  {
                    portal.roleLabel
                  }
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center bg-[#0f766e] text-xs font-semibold text-white">
                {
                  displayInitials
                }
              </div>
            </div>
          </div>

          {notificationsOpen ? (
            <NotificationsPanel
              notifications={
                notifications
              }
              loading={
                notificationsLoading
              }
              error={
                notificationsError
              }
              onRefresh={
                loadNotifications
              }
              onMarkAllRead={
                markAllRead
              }
              onNotificationClick={
                handleNotificationClick
              }
              onClose={() =>
                setNotificationsOpen(
                  false
                )
              }
            />
          ) : null}
        </header>

        <main className="clinical-ops-content min-h-[calc(100vh-64px)]">
          <Outlet />
        </main>
      </div>

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
