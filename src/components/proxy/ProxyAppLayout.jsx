import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Bell,
  CalendarCheck,
  CalendarClock,
  CircleAlert,
  Clock3,
  Home,
  LogOut,
  Menu,
  PackageCheck,
  UserRoundCheck,
  Users,
  X,
} from "lucide-react";

import {
  useAuth,
} from "../../context/AuthContext.jsx";

import {
  notificationsApi,
} from "../../services/api/notifications.js";

/* ========================================= */
/* SIDEBAR ITEMS */
/* ========================================= */

const patientItems = [
  {
    label: "All Patients",
    path: "/proxy/patients",
    icon: Users,
  },
  {
    label: "Due Today",
    path: "/proxy/patients?status=today",
    icon: CalendarCheck,
    status: "today",
  },
  {
    label: "Upcoming",
    path: "/proxy/patients?status=upcoming",
    icon: CalendarClock,
    status: "upcoming",
  },
  {
    label: "Overdue",
    path: "/proxy/patients?status=overdue",
    icon: CircleAlert,
    status: "overdue",
  },
  {
    label: "No Collection",
    path: "/proxy/patients?status=none",
    icon: UserRoundCheck,
    status: "none",
  },
];

const collectionItems = [
  {
    label: "All Collections",
    path: "/proxy/collections",
    icon: PackageCheck,
  },
  {
    label: "Due Today",
    path: "/proxy/collections?status=today",
    icon: CalendarCheck,
    status: "today",
  },
  {
    label: "Upcoming",
    path: "/proxy/collections?status=upcoming",
    icon: CalendarClock,
    status: "upcoming",
  },
  {
    label: "Overdue",
    path: "/proxy/collections?status=overdue",
    icon: Clock3,
    status: "overdue",
  },
];

/* ========================================= */
/* HELPERS */
/* ========================================= */

function initialsFromName(name) {
  if (!name) {
    return "PX";
  }

  const parts = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (
    parts.length === 1
  ) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`
    .toUpperCase();
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

/* ========================================= */
/* COMPONENT */
/* ========================================= */

export default function ProxyAppLayout() {
  const location =
    useLocation();

  const navigate =
    useNavigate();

  const {
    user,
    logout,
  } = useAuth();

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

  const displayName =
    user?.fullName ||
    user?.name ||
    "Proxy";

  const initials =
    initialsFromName(
      displayName
    );

  const query =
    new URLSearchParams(
      location.search
    );

  const activeStatus =
    query.get("status");

  /* ===================================== */
  /* PAGE TITLE */
  /* ===================================== */

  let currentPageTitle =
    "Dashboard";

  if (
    location.pathname ===
    "/proxy/patients"
  ) {
    if (
      activeStatus ===
      "today"
    ) {
      currentPageTitle =
        "Patients · Due Today";
    } else if (
      activeStatus ===
      "upcoming"
    ) {
      currentPageTitle =
        "Patients · Upcoming";
    } else if (
      activeStatus ===
      "overdue"
    ) {
      currentPageTitle =
        "Patients · Overdue";
    } else if (
      activeStatus ===
      "none"
    ) {
      currentPageTitle =
        "Patients · No Collection";
    } else {
      currentPageTitle =
        "Patients";
    }
  }

  if (
    location.pathname ===
    "/proxy/collections"
  ) {
    if (
      activeStatus ===
      "today"
    ) {
      currentPageTitle =
        "Collections · Due Today";
    } else if (
      activeStatus ===
      "upcoming"
    ) {
      currentPageTitle =
        "Collections · Upcoming";
    } else if (
      activeStatus ===
      "overdue"
    ) {
      currentPageTitle =
        "Collections · Overdue";
    } else {
      currentPageTitle =
        "Collections";
    }
  }

  /* ===================================== */
  /* NOTIFICATIONS */
  /* ===================================== */

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
            Array.isArray(result)
              ? result
              : []
          );
        } catch (error) {
          console.error(
            "Failed to load proxy notifications:",
            error
          );

          setNotifications(
            []
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
      []
    );

  useEffect(() => {
    loadNotifications();
  }, [
    loadNotifications,
  ]);

  useEffect(() => {
    setMobileOpen(false);
    setNotificationsOpen(
      false
    );
  }, [
    location.pathname,
    location.search,
  ]);

  const unreadNotifications =
    notifications.filter(
      (notification) =>
        !notification.isRead
    );

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
        (current) =>
          current.map(
            (item) =>
              item.id ===
              notification.id
                ? {
                    ...item,
                    isRead: true,
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
        (current) =>
          current.map(
            (item) => ({
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

  function handleLogout() {
    logout();

    navigate(
      "/login",
      {
        replace: true,
      }
    );
  }

  /* ===================================== */
  /* ACTIVE SIDEBAR LOGIC */
  /* ===================================== */

  function itemIsActive(
    basePath,
    status = null
  ) {
    if (
      location.pathname !==
      basePath
    ) {
      return false;
    }

    if (!status) {
      return !activeStatus;
    }

    return (
      activeStatus ===
      status
    );
  }

  /* ===================================== */
  /* NAV CONTENT */
  /* ===================================== */

  function NavigationContent() {
    return (
      <>
        {/* LOGO */}

        <div className="flex h-[78px] items-center border-b border-[#e2e8f0] px-7">
          <button
            type="button"
            onClick={() =>
              navigate(
                "/proxy"
              )
            }
            className="flex items-center gap-3"
          >
            <img
              src="/logo2.png"
              alt="PhilaLink logo"
              className="h-11 w-11 shrink-0 object-contain"
            />

            <div className="text-left">
              <div className="text-xl font-bold tracking-tight text-[#0f172a]">
                Phila
                <span className="text-[#0f766e]">
                  Link
                </span>
              </div>

              <div className="text-xs text-[#64748b]">
                Proxy Portal
              </div>
            </div>
          </button>
        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 overflow-y-auto px-4 py-5">
          {/* DASHBOARD */}

          <SidebarLink
            path="/proxy"
            label="Dashboard"
            icon={Home}
            active={
              location.pathname ===
              "/proxy"
            }
          />

          {/* PATIENTS */}

          <SidebarSectionLabel>
            Patients
          </SidebarSectionLabel>

          {patientItems.map(
            (item) => (
              <SidebarLink
                key={
                  item.path
                }
                path={
                  item.path
                }
                label={
                  item.label
                }
                icon={
                  item.icon
                }
                nested
                active={itemIsActive(
                  "/proxy/patients",
                  item.status
                )}
              />
            )
          )}

          {/* COLLECTIONS */}

          <SidebarSectionLabel>
            Collections
          </SidebarSectionLabel>

          {collectionItems.map(
            (item) => (
              <SidebarLink
                key={
                  item.path
                }
                path={
                  item.path
                }
                label={
                  item.label
                }
                icon={
                  item.icon
                }
                nested
                active={itemIsActive(
                  "/proxy/collections",
                  item.status
                )}
              />
            )
          )}
        </nav>

        {/* ACCOUNT */}

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
                Proxy
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={
              handleLogout
            }
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#64748b] transition hover:bg-[#fee2e2] hover:text-[#dc2626]"
          >
            <LogOut
              size={19}
            />

            Logout
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="patient-figma-root min-h-screen bg-[#f8fafc] text-[#0f172a]">
      {/* DESKTOP SIDEBAR */}

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[270px] flex-col border-r border-[#e2e8f0] bg-white lg:flex">
        <NavigationContent />
      </aside>

      {/* CONTENT */}

      <div className="lg:pl-[270px]">
        <header className="sticky top-0 z-30 flex h-[78px] items-center justify-between border-b border-[#e2e8f0] bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setNotificationsOpen(
                  false
                );

                setMobileOpen(
                  true
                );
              }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#e2e8f0] text-[#475569] lg:hidden"
              aria-label="Open navigation"
            >
              <Menu
                size={21}
              />
            </button>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold text-[#0f172a] sm:text-xl">
                {
                  currentPageTitle
                }
              </h1>

              <p className="hidden truncate text-sm text-[#64748b] sm:block">
                Welcome back,{" "}
                {displayName}
              </p>
            </div>
          </div>

          {/* HEADER ACTIONS */}

          <div className="ml-3 flex shrink-0 items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen(
                    (value) =>
                      !value
                  );

                  if (
                    !notificationsOpen
                  ) {
                    loadNotifications();
                  }
                }}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-[#475569] transition hover:bg-[#f8fafc]"
                aria-label="Notifications"
              >
                <Bell
                  size={19}
                />

                {unreadNotifications.length >
                  0 && (
                  <span className="absolute right-[3px] top-[2px] flex h-4 min-w-4 items-center justify-center rounded-full bg-[#dc2626] px-1 text-[9px] font-bold text-white">
                    {unreadNotifications.length >
                    9
                      ? "9+"
                      : unreadNotifications.length}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="fixed left-3 right-3 top-[68px] z-[2100] overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-xl sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:w-[380px]">
                  <div className="border-b border-[#e2e8f0] px-5 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h2 className="font-semibold text-[#0f172a]">
                          Notifications
                        </h2>

                        <p className="mt-1 text-xs text-[#64748b]">
                          Collection reminders
                          and PhilaLink updates
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setNotificationsOpen(
                            false
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full text-[#64748b] hover:bg-[#f1f5f9]"
                      >
                        <X
                          size={16}
                        />
                      </button>
                    </div>

                    {unreadNotifications.length >
                      0 && (
                      <button
                        type="button"
                        onClick={
                          markAllRead
                        }
                        className="mt-3 text-xs font-semibold text-[#0f766e]"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-[380px] divide-y divide-[#e2e8f0] overflow-y-auto">
                    {notificationsLoading ? (
                      <div className="px-5 py-8 text-center text-sm text-[#64748b]">
                        Loading
                        notifications...
                      </div>
                    ) : notificationsError ? (
                      <div className="px-5 py-6">
                        <p className="text-sm text-[#dc2626]">
                          {
                            notificationsError
                          }
                        </p>
                      </div>
                    ) : notifications.length ===
                      0 ? (
                      <div className="px-5 py-10 text-center">
                        <Bell
                          size={25}
                          className="mx-auto text-[#94a3b8]"
                        />

                        <p className="mt-3 text-sm font-medium text-[#0f172a]">
                          No notifications
                        </p>
                      </div>
                    ) : (
                      notifications.map(
                        (
                          notification
                        ) => (
                          <button
                            key={
                              notification.id
                            }
                            type="button"
                            onClick={() =>
                              handleNotificationClick(
                                notification
                              )
                            }
                            className={`w-full px-5 py-4 text-left transition hover:bg-[#f8fafc] ${
                              notification.isRead
                                ? "bg-white"
                                : "bg-[#f0fdfa]"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {!notification.isRead && (
                                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#0f766e]" />
                              )}

                              <div className="min-w-0 flex-1">
                                <p className="text-sm leading-5 text-[#0f172a]">
                                  {
                                    notification.message
                                  }
                                </p>

                                <p className="mt-1 text-xs text-[#64748b]">
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
              )}
            </div>

            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0f766e] text-sm font-semibold text-white"
              title={
                displayName
              }
            >
              {initials}
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-78px)]">
          <Outlet />
        </main>
      </div>

      {/* MOBILE SIDEBAR */}

      {mobileOpen && (
        <div className="fixed inset-0 z-[3000] lg:hidden">
          <button
            type="button"
            onClick={() =>
              setMobileOpen(
                false
              )
            }
            className="absolute inset-0 bg-black/30"
            aria-label="Close navigation"
          />

          <aside className="absolute inset-y-0 left-0 flex w-[min(310px,88vw)] flex-col bg-white shadow-2xl">
            <button
              type="button"
              onClick={() =>
                setMobileOpen(
                  false
                )
              }
              className="absolute right-3 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full text-[#64748b] hover:bg-[#f1f5f9]"
            >
              <X
                size={18}
              />
            </button>

            <NavigationContent />
          </aside>
        </div>
      )}
    </div>
  );
}

/* ========================================= */
/* SIDEBAR SECTION */
/* ========================================= */

function SidebarSectionLabel({
  children,
}) {
  return (
    <div className="mb-2 mt-6 px-4 text-[10px] font-bold uppercase tracking-[0.14em] text-[#94a3b8]">
      {children}
    </div>
  );
}

/* ========================================= */
/* SIDEBAR LINK */
/* ========================================= */

function SidebarLink({
  path,
  label,
  icon: Icon,
  active,
  nested = false,
}) {
  return (
    <Link
      to={path}
      className={`mb-1 flex items-center gap-3 rounded-xl text-sm font-medium transition ${
        nested
          ? "px-4 py-2.5"
          : "px-4 py-3"
      } ${
        active
          ? "bg-[#ccfbf1] text-[#115e59]"
          : "text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
      }`}
    >
      <Icon
        size={
          nested
            ? 17
            : 20
        }
      />

      <span>
        {label}
      </span>
    </Link>
  );
}