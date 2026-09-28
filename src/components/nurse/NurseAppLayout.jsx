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
  CalendarDays,
  Cookie,
  Home,
  LogOut,
  PackageCheck,
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

/* ========================================================= */
/* NAVIGATION                                                */
/* ========================================================= */

const navigationItems = [
  {
    label:
      "Dashboard",

    path:
      "/nurse",

    icon:
      Home,

    section:
      "Workspace",
  },

  {
    label:
      "Patients",

    path:
      "/nurse/patients",

    icon:
      Users,

    section:
      "Care",
  },

  {
    label:
      "Appointments",

    path:
      "/nurse/appointments",

    icon:
      CalendarDays,

    section:
      "Care",
  },

  {
    label:
      "Collections",

    path:
      "/nurse/collections",

    icon:
      PackageCheck,

    section:
      "Care",
  },

  {
    label:
      "Settings",

    path:
      "/nurse/settings",

    icon:
      Settings,

    section:
      "Account",
  },
];

/* ========================================================= */
/* HELPERS                                                   */
/* ========================================================= */

function initialsFromName(
  name
) {
  if (!name) {
    return "NU";
  }

  const parts =
    String(name)
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  if (
    parts.length ===
    0
  ) {
    return "NU";
  }

  if (
    parts.length ===
    1
  ) {
    return parts[0]
      .slice(
        0,
        2
      )
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
      day:
        "numeric",

      month:
        "short",

      hour:
        "2-digit",

      minute:
        "2-digit",
    }
  );
}

function getPageTitle(
  pathname
) {
  if (
    pathname.startsWith(
      "/nurse/patients/"
    )
  ) {
    return "Patient Care";
  }

  if (
    pathname ===
    "/nurse/patients"
  ) {
    return "Patients";
  }

  if (
    pathname ===
    "/nurse/appointments"
  ) {
    return "Appointments";
  }

  if (
    pathname ===
    "/nurse/collections"
  ) {
    return "Collections";
  }

  if (
    pathname ===
    "/nurse/settings"
  ) {
    return "Settings";
  }

  return "Dashboard";
}

/* ========================================================= */
/* COMPONENT                                                 */
/* ========================================================= */

export default function NurseAppLayout() {
  const location =
    useLocation();

  const navigate =
    useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  useEffect(
    () => {
      document
        .documentElement
        .setAttribute(
          "data-theme",
          "light"
        );
    },
    []
  );

  const [
    notificationsOpen,
    setNotificationsOpen,
  ] = useState(false);

  const [
    accountOpen,
    setAccountOpen,
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
    "Nurse";

  const initials =
    initialsFromName(
      displayName
    );

  const currentPageTitle =
    getPageTitle(
      location.pathname
    );

  function routeIsActive(
    path
  ) {
    if (
      path ===
      "/nurse"
    ) {
      return (
        location.pathname ===
        "/nurse"
      );
    }

    return (
      location.pathname ===
        path ||
      location.pathname.startsWith(
        `${path}/`
      )
    );
  }

  /* ===================================================== */
  /* NOTIFICATIONS                                         */
  /* ===================================================== */

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
            "Failed to load Nurse notifications:",
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

  useEffect(
    () => {
      loadNotifications();
    },
    [
      loadNotifications,
    ]
  );

  const unreadNotifications =
    notifications.filter(
      (
        notification
      ) =>
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
        (
          current
        ) =>
          current.map(
            (
              item
            ) =>
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
        "Failed to mark Nurse notification as read:",
        error
      );
    }
  }

  async function markAllRead() {
    try {
      await notificationsApi
        .markAllRead();

      setNotifications(
        (
          current
        ) =>
          current.map(
            (
              item
            ) => ({
              ...item,

              isRead:
                true,
            })
          )
      );
    } catch (error) {
      console.error(
        "Failed to mark all Nurse notifications as read:",
        error
      );
    }
  }

  /* ===================================================== */
  /* CLOSE MENUS ON ROUTE CHANGE                           */
  /* ===================================================== */

  useEffect(
    () => {
      setNotificationsOpen(
        false
      );

      setAccountOpen(
        false
      );
    },
    [
      location.pathname,
      location.search,
    ]
  );

  /* ===================================================== */
  /* ESCAPE KEY                                            */
  /* ===================================================== */

  useEffect(
    () => {
      if (
        !notificationsOpen &&
        !accountOpen
      ) {
        return undefined;
      }

      function handleKeyDown(
        event
      ) {
        if (
          event.key ===
          "Escape"
        ) {
          setNotificationsOpen(
            false
          );

          setAccountOpen(
            false
          );
        }
      }

      window.addEventListener(
        "keydown",
        handleKeyDown
      );

      return () =>
        window.removeEventListener(
          "keydown",
          handleKeyDown
        );
    },
    [
      notificationsOpen,
      accountOpen,
    ]
  );

  /* ===================================================== */
  /* ACCOUNT ACTIONS                                       */
  /* ===================================================== */

  function openCookieSettings() {
    window.dispatchEvent(
      new Event(
        "philalink:open-cookie-settings"
      )
    );

    setAccountOpen(
      false
    );
  }

  function handleLogout() {
    setAccountOpen(
      false
    );

    logout();

    navigate(
      "/login",
      {
        replace:
          true,
      }
    );
  }

  /* ===================================================== */
  /* DESKTOP SIDEBAR                                       */
  /* ===================================================== */

  function DesktopSidebar() {
    const workspace =
      navigationItems.filter(
        (
          item
        ) =>
          item.section ===
          "Workspace"
      );

    const care =
      navigationItems.filter(
        (
          item
        ) =>
          item.section ===
          "Care"
      );

    const account =
      navigationItems.filter(
        (
          item
        ) =>
          item.section ===
          "Account"
      );

    return (
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col border-r border-[#e2e8f0] bg-white lg:flex">

        {/* BRAND */}

        <div className="flex h-[72px] shrink-0 items-center border-b border-[#e2e8f0] px-6">

          <button
            type="button"
            onClick={() =>
              navigate(
                "/nurse"
              )
            }
            className="flex min-w-0 items-center gap-3 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-[#0f766e]/20"
          >

            <img
              src="/logo2.png"
              alt="PhilaLink"
              className="h-10 w-10 shrink-0 object-contain"
            />

            <div className="min-w-0">

              <div className="truncate text-lg font-bold tracking-tight text-[#0f172a]">
                Phila
                <span className="text-[#0f766e]">
                  Link
                </span>
              </div>

              <div className="truncate text-xs text-[#64748b]">
                Nurse Portal
              </div>

            </div>

          </button>

        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 overflow-y-auto px-3 py-5">

          <SidebarSectionLabel>
            Workspace
          </SidebarSectionLabel>

          {workspace.map(
            (
              item
            ) => (
              <DesktopNavLink
                key={
                  item.path
                }
                item={
                  item
                }
                active={
                  routeIsActive(
                    item.path
                  )
                }
              />
            )
          )}

          <SidebarSectionLabel>
            Care
          </SidebarSectionLabel>

          {care.map(
            (
              item
            ) => (
              <DesktopNavLink
                key={
                  item.path
                }
                item={
                  item
                }
                active={
                  routeIsActive(
                    item.path
                  )
                }
              />
            )
          )}

          <SidebarSectionLabel>
            Account
          </SidebarSectionLabel>

          {account.map(
            (
              item
            ) => (
              <DesktopNavLink
                key={
                  item.path
                }
                item={
                  item
                }
                active={
                  routeIsActive(
                    item.path
                  )
                }
              />
            )
          )}

        </nav>

        {/* ACCOUNT */}

        <div className="shrink-0 border-t border-[#e2e8f0] p-3">

          <div className="mb-2 flex items-center gap-3 rounded-xl bg-[#f8fafc] p-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0f766e] text-sm font-semibold text-white">
              {initials}
            </div>

            <div className="min-w-0 flex-1">

              <p className="truncate text-sm font-semibold text-[#0f172a]">
                {displayName}
              </p>

              <p className="mt-0.5 text-xs text-[#64748b]">
                Nurse
              </p>

            </div>

          </div>

          <AccountAction
            icon={
              Cookie
            }
            label="Cookie settings"
            onClick={
              openCookieSettings
            }
          />

          <AccountAction
            icon={
              LogOut
            }
            label="Logout"
            danger
            onClick={
              handleLogout
            }
          />

        </div>

      </aside>
    );
  }

  /* ===================================================== */
  /* RENDER                                                */
  /* ===================================================== */

  return (
    <div className="patient-figma-root min-h-screen bg-[#f8fafc] text-[#0f172a]">

      <DesktopSidebar />

      <div className="min-h-screen lg:pl-[248px]">

        {/* TOP BAR */}

        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#e2e8f0] bg-white/95 px-4 backdrop-blur sm:px-5 lg:h-[72px] lg:px-8">

          <div className="min-w-0">

            <h1 className="truncate text-base font-semibold text-[#0f172a] sm:text-lg lg:text-xl">
              {currentPageTitle}
            </h1>

            <p className="mt-0.5 hidden truncate text-xs text-[#64748b] sm:block lg:text-sm">
              Welcome back,{" "}
              {displayName}
            </p>

          </div>

          <div className="ml-3 flex shrink-0 items-center gap-2 sm:gap-3">

            {/* NOTIFICATIONS */}

            <div className="relative">

              <button
                type="button"
                aria-label="Notifications"
                aria-expanded={
                  notificationsOpen
                }
                onClick={() => {
                  setAccountOpen(
                    false
                  );

                  setNotificationsOpen(
                    (
                      current
                    ) =>
                      !current
                  );

                  if (
                    !notificationsOpen
                  ) {
                    loadNotifications();
                  }
                }}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#e2e8f0] bg-white text-[#475569] transition hover:bg-[#f8fafc]"
              >

                <Bell
                  size={18}
                />

                {unreadNotifications.length >
                  0 && (
                  <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-[#dc2626] px-1 text-[9px] font-bold leading-none text-white">
                    {unreadNotifications.length >
                    9
                      ? "9+"
                      : unreadNotifications.length}
                  </span>
                )}

              </button>

              {notificationsOpen && (
                <NotificationPanel
                  notifications={
                    notifications
                  }
                  loading={
                    notificationsLoading
                  }
                  error={
                    notificationsError
                  }
                  unreadCount={
                    unreadNotifications.length
                  }
                  onClose={() =>
                    setNotificationsOpen(
                      false
                    )
                  }
                  onNotificationClick={
                    handleNotificationClick
                  }
                  onMarkAllRead={
                    markAllRead
                  }
                />
              )}

            </div>

            {/* MOBILE ACCOUNT */}

            <div className="relative lg:hidden">

              <button
                type="button"
                aria-label="Account menu"
                aria-expanded={
                  accountOpen
                }
                onClick={() => {
                  setNotificationsOpen(
                    false
                  );

                  setAccountOpen(
                    (
                      current
                    ) =>
                      !current
                  );
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0f766e] text-sm font-semibold text-white"
              >
                {initials}
              </button>

              {accountOpen && (
                <MobileAccountPanel
                  displayName={
                    displayName
                  }
                  initials={
                    initials
                  }
                  onSettings={() =>
                    navigate(
                      "/nurse/settings"
                    )
                  }
                  onCookieSettings={
                    openCookieSettings
                  }
                  onLogout={
                    handleLogout
                  }
                  onClose={() =>
                    setAccountOpen(
                      false
                    )
                  }
                />
              )}

            </div>

            {/* DESKTOP AVATAR */}

            <div
              className="hidden h-10 w-10 items-center justify-center rounded-full bg-[#0f766e] text-sm font-semibold text-white lg:flex"
              title={
                displayName
              }
            >
              {initials}
            </div>

          </div>

        </header>

        {/* PAGE CONTENT */}

        <main className="min-h-[calc(100vh-64px)] pb-24 lg:min-h-[calc(100vh-72px)] lg:pb-0">
          <Outlet />
        </main>

      </div>

      {/* =================================================== */}
      {/* MOBILE NAVIGATION                                   */}
      {/* =================================================== */}

      <nav
        aria-label="Nurse navigation"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e2e8f0] bg-white/95 px-1 pt-2 shadow-[0_-6px_24px_rgba(15,23,42,0.06)] backdrop-blur lg:hidden"
        style={{
          paddingBottom:
            "max(env(safe-area-inset-bottom), 0.5rem)",
        }}
      >

        <div className="mx-auto grid max-w-xl grid-cols-5 gap-1">

          {navigationItems.map(
            (
              item
            ) => (
              <MobileNavLink
                key={
                  item.path
                }
                item={
                  item
                }
                active={
                  routeIsActive(
                    item.path
                  )
                }
              />
            )
          )}

        </div>

      </nav>

    </div>
  );
}

/* ========================================================= */
/* DESKTOP NAV                                               */
/* ========================================================= */

function DesktopNavLink({
  item,
  active,
}) {
  const Icon =
    item.icon;

  return (
    <Link
      to={
        item.path
      }
      aria-current={
        active
          ? "page"
          : undefined
      }
      className={[
        "mb-1 flex min-h-[44px] items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition",
        active
          ? "bg-[#ccfbf1] text-[#115e59]"
          : "text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a]",
      ].join(
        " "
      )}
    >

      <Icon
        size={19}
      />

      <span>
        {item.label}
      </span>

    </Link>
  );
}

/* ========================================================= */
/* MOBILE NAV                                                */
/* ========================================================= */

function MobileNavLink({
  item,
  active,
}) {
  const Icon =
    item.icon;

  return (
    <Link
      to={
        item.path
      }
      aria-current={
        active
          ? "page"
          : undefined
      }
      className={[
        "flex min-h-[54px] min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1 text-[9px] font-semibold transition sm:text-[10px]",
        active
          ? "bg-[#f0fdfa] text-[#0f766e]"
          : "text-[#64748b] active:bg-[#f1f5f9]",
      ].join(
        " "
      )}
    >

      <Icon
        size={19}
      />

      <span className="max-w-full truncate">
        {item.label}
      </span>

    </Link>
  );
}

/* ========================================================= */
/* SECTION LABEL                                             */
/* ========================================================= */

function SidebarSectionLabel({
  children,
}) {
  return (
    <div className="mb-2 mt-4 px-3.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#94a3b8] first:mt-0">
      {children}
    </div>
  );
}

/* ========================================================= */
/* ACCOUNT ACTION                                            */
/* ========================================================= */

function AccountAction({
  icon: Icon,
  label,
  onClick,
  danger = false,
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={[
        "flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition",
        danger
          ? "text-[#64748b] hover:bg-[#fee2e2] hover:text-[#dc2626]"
          : "text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]",
      ].join(
        " "
      )}
    >

      <Icon
        size={18}
      />

      {label}

    </button>
  );
}

/* ========================================================= */
/* MOBILE ACCOUNT PANEL                                      */
/* ========================================================= */

function MobileAccountPanel({
  displayName,
  initials,
  onSettings,
  onCookieSettings,
  onLogout,
  onClose,
}) {
  return (
    <>

      <button
        type="button"
        aria-label="Close account menu"
        onClick={
          onClose
        }
        className="fixed inset-0 z-[1990] bg-transparent"
      />

      <div className="fixed left-3 right-3 top-[72px] z-[2000] overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-xl sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:w-[300px]">

        <div className="flex items-center gap-3 border-b border-[#e2e8f0] p-4">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0f766e] text-sm font-semibold text-white">
            {initials}
          </div>

          <div className="min-w-0 flex-1">

            <p className="truncate text-sm font-semibold text-[#0f172a]">
              {displayName}
            </p>

            <p className="mt-0.5 text-xs text-[#64748b]">
              Nurse account
            </p>

          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748b] hover:bg-[#f1f5f9]"
          >

            <X
              size={16}
            />

          </button>

        </div>

        <div className="p-2">

          <AccountAction
            icon={
              Settings
            }
            label="Account settings"
            onClick={
              onSettings
            }
          />

          <AccountAction
            icon={
              Cookie
            }
            label="Cookie settings"
            onClick={
              onCookieSettings
            }
          />

          <AccountAction
            icon={
              LogOut
            }
            label="Logout"
            danger
            onClick={
              onLogout
            }
          />

        </div>

      </div>

    </>
  );
}

/* ========================================================= */
/* NOTIFICATION PANEL                                        */
/* ========================================================= */

function NotificationPanel({
  notifications,
  loading,
  error,
  unreadCount,
  onClose,
  onNotificationClick,
  onMarkAllRead,
}) {
  return (
    <>

      <button
        type="button"
        aria-label="Close notifications"
        onClick={
          onClose
        }
        className="fixed inset-0 z-[1990] bg-transparent"
      />

      <div className="fixed left-3 right-3 top-[72px] z-[2000] overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-xl sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:w-[380px]">

        <div className="border-b border-[#e2e8f0] px-4 py-4 sm:px-5">

          <div className="flex items-start justify-between gap-3">

            <div>

              <h2 className="font-semibold text-[#0f172a]">
                Notifications
              </h2>

              <p className="mt-1 text-xs leading-5 text-[#64748b]">
                Appointments, collections and PhilaLink updates
              </p>

            </div>

            <button
              type="button"
              onClick={
                onClose
              }
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748b] hover:bg-[#f1f5f9]"
            >

              <X
                size={16}
              />

            </button>

          </div>

          {unreadCount >
            0 && (
            <button
              type="button"
              onClick={
                onMarkAllRead
              }
              className="mt-3 text-xs font-semibold text-[#0f766e]"
            >
              Mark all as read
            </button>
          )}

        </div>

        <div className="max-h-[65vh] divide-y divide-[#e2e8f0] overflow-y-auto sm:max-h-[420px]">

          {loading ? (

            <div className="px-5 py-10 text-center text-sm text-[#64748b]">
              Loading notifications...
            </div>

          ) : error ? (

            <div className="px-5 py-6 text-sm text-[#dc2626]">
              {error}
            </div>

          ) : notifications.length ===
            0 ? (

            <div className="px-5 py-10 text-center">

              <Bell
                size={24}
                className="mx-auto text-[#94a3b8]"
              />

              <p className="mt-3 text-sm font-medium text-[#0f172a]">
                No notifications
              </p>

              <p className="mt-1 text-xs text-[#64748b]">
                New Nurse notifications will appear here.
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
                    onNotificationClick(
                      notification
                    )
                  }
                  className={[
                    "w-full px-4 py-4 text-left transition hover:bg-[#f8fafc] sm:px-5",
                    notification.isRead
                      ? "bg-white"
                      : "bg-[#f0fdfa]",
                  ].join(
                    " "
                  )}
                >

                  <div className="flex items-start gap-3">

                    {!notification.isRead && (
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#0f766e]" />
                    )}

                    <div className="min-w-0 flex-1">

                      <p className="text-sm leading-5 text-[#0f172a]">
                        {notification.message}
                      </p>

                      <p className="mt-1.5 text-xs text-[#64748b]">
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

    </>
  );
}
