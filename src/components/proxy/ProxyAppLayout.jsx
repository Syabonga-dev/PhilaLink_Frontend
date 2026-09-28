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
  Cookie,
  Home,
  LogOut,
  PackageCheck,
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
/* PRIMARY NAVIGATION                                        */
/* ========================================================= */

const navigationItems = [
  {
    label:
      "Dashboard",

    path:
      "/proxy",

    icon:
      Home,
  },

  {
    label:
      "Patients",

    path:
      "/proxy/patients",

    icon:
      Users,
  },

  {
    label:
      "Collections",

    path:
      "/proxy/collections",

    icon:
      PackageCheck,
  },
];

/* ========================================================= */
/* HELPERS                                                   */
/* ========================================================= */

function initialsFromName(
  name
) {
  if (!name) {
    return "PX";
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
    return "PX";
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
    pathname ===
    "/proxy/patients"
  ) {
    return "Patients";
  }

  if (
    pathname ===
    "/proxy/collections"
  ) {
    return "Collections";
  }

  return "Dashboard";
}

/* ========================================================= */
/* COMPONENT                                                 */
/* ========================================================= */

export default function ProxyAppLayout() {
  const location =
    useLocation();

  const navigate =
    useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  /* ===================================================== */
  /* PROXY THEME                                           */
  /* ===================================================== */

  useEffect(
    () => {
      /*
       * The Proxy Portal currently has its own fixed
       * light appearance.
       *
       * Patient theme preferences may have previously
       * changed the root document theme in the same browser.
       */
      document
        .documentElement
        .setAttribute(
          "data-theme",
          "light"
        );
    },
    []
  );

  /* ===================================================== */
  /* STATE                                                 */
  /* ===================================================== */

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

  /* ===================================================== */
  /* USER                                                  */
  /* ===================================================== */

  const displayName =
    user?.fullName ||
    user?.name ||
    "Proxy";

  const initials =
    initialsFromName(
      displayName
    );

  const currentPageTitle =
    getPageTitle(
      location.pathname
    );

  /* ===================================================== */
  /* ACTIVE NAVIGATION                                     */
  /* ===================================================== */

  function routeIsActive(
    path
  ) {
    if (
      path ===
      "/proxy"
    ) {
      return (
        location.pathname ===
        "/proxy"
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
        "Failed to mark all notifications as read:",
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
    return (
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col border-r border-[#e2e8f0] bg-white lg:flex">

        {/* LOGO */}

        <div className="flex h-[72px] shrink-0 items-center border-b border-[#e2e8f0] px-6">
          <button
            type="button"
            onClick={() =>
              navigate(
                "/proxy"
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
                Proxy Portal
              </div>
            </div>
          </button>
        </div>

        {/* NAV */}

        <nav className="flex-1 overflow-y-auto px-3 py-5">

          <SidebarSectionLabel>
            Workspace
          </SidebarSectionLabel>

          <DesktopNavLink
            item={
              navigationItems[0]
            }
            active={routeIsActive(
              navigationItems[0]
                .path
            )}
          />

          <SidebarSectionLabel>
            Care
          </SidebarSectionLabel>

          {navigationItems
            .slice(1)
            .map(
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
                  active={routeIsActive(
                    item.path
                  )}
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
                Proxy
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

      {/* ================================================= */}
      {/* APPLICATION                                      */}
      {/* ================================================= */}

      <div className="min-h-screen lg:pl-[248px]">

        {/* =============================================== */}
        {/* TOP HEADER                                      */}
        {/* =============================================== */}

        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#e2e8f0] bg-white/95 px-4 backdrop-blur sm:px-5 lg:h-[72px] lg:px-8">

          {/* PAGE */}

          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold text-[#0f172a] sm:text-lg lg:text-xl">
              {currentPageTitle}
            </h1>

            <p className="mt-0.5 hidden truncate text-xs text-[#64748b] sm:block lg:text-sm">
              Welcome back,{" "}
              {displayName}
            </p>
          </div>

          {/* ACTIONS */}

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
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#e2e8f0] bg-white text-[#475569] transition hover:bg-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#0f766e]/20"
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
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0f766e] text-sm font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-[#0f766e]/30 focus:ring-offset-2"
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

            {/* DESKTOP HEADER AVATAR */}

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

        {/* =============================================== */}
        {/* CONTENT                                         */}
        {/* =============================================== */}

        <main className="min-h-[calc(100vh-64px)] pb-24 lg:min-h-[calc(100vh-72px)] lg:pb-0">
          <Outlet />
        </main>

      </div>

      {/* ================================================= */}
      {/* MOBILE BOTTOM NAVIGATION                         */}
      {/* ================================================= */}

      <nav
        aria-label="Proxy navigation"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e2e8f0] bg-white/95 px-2 pt-2 shadow-[0_-6px_24px_rgba(15,23,42,0.06)] backdrop-blur lg:hidden"
        style={{
          paddingBottom:
            "max(env(safe-area-inset-bottom), 0.5rem)",
        }}
      >
        <div className="mx-auto grid max-w-md grid-cols-3 gap-1">
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
                active={routeIsActive(
                  item.path
                )}
              />
            )
          )}
        </div>
      </nav>

    </div>
  );
}

/* ========================================================= */
/* DESKTOP NAV LINK                                          */
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
        "mb-1 flex min-h-[44px] items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[#0f766e]/20",
        active
          ? "bg-[#ccfbf1] text-[#115e59]"
          : "text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a]",
      ].join(" ")}
    >
      <Icon
        size={19}
        strokeWidth={
          active
            ? 2.2
            : 2
        }
      />

      <span>
        {item.label}
      </span>
    </Link>
  );
}

/* ========================================================= */
/* MOBILE NAV LINK                                           */
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
        "flex min-h-[54px] flex-col items-center justify-center gap-1 rounded-xl px-2 py-1 text-[11px] font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#0f766e]/20",
        active
          ? "bg-[#f0fdfa] text-[#0f766e]"
          : "text-[#64748b] active:bg-[#f1f5f9]",
      ].join(" ")}
    >
      <Icon
        size={20}
        strokeWidth={
          active
            ? 2.3
            : 2
        }
      />

      <span>
        {item.label}
      </span>
    </Link>
  );
}

/* ========================================================= */
/* SIDEBAR SECTION LABEL                                     */
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
        "flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition focus:outline-none focus:ring-2",
        danger
          ? "text-[#64748b] hover:bg-[#fee2e2] hover:text-[#dc2626] focus:ring-[#dc2626]/20"
          : "text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] focus:ring-[#0f766e]/20",
      ].join(" ")}
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
              Proxy account
            </p>
          </div>

          <button
            type="button"
            aria-label="Close account menu"
            onClick={
              onClose
            }
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#64748b] hover:bg-[#f1f5f9]"
          >
            <X
              size={16}
            />
          </button>
        </div>

        <div className="p-2">

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

        {/* HEADER */}

        <div className="border-b border-[#e2e8f0] px-4 py-4 sm:px-5">

          <div className="flex items-start justify-between gap-3">

            <div>
              <h2 className="font-semibold text-[#0f172a]">
                Notifications
              </h2>

              <p className="mt-1 text-xs leading-5 text-[#64748b]">
                Collection reminders and PhilaLink updates
              </p>
            </div>

            <button
              type="button"
              aria-label="Close notifications"
              onClick={
                onClose
              }
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#64748b] transition hover:bg-[#f1f5f9]"
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

        {/* CONTENT */}

        <div className="max-h-[65vh] divide-y divide-[#e2e8f0] overflow-y-auto sm:max-h-[420px]">

          {loading ? (
            <div className="px-5 py-10 text-center text-sm text-[#64748b]">
              Loading notifications...
            </div>
          ) : error ? (
            <div className="px-5 py-6">
              <p className="text-sm leading-6 text-[#dc2626]">
                {error}
              </p>
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
                New reminders will appear here.
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
                  ].join(" ")}
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