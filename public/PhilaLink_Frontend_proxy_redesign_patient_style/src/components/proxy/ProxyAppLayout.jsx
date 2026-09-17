import {
  useCallback,
  useEffect,
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
  Home,
  LogOut,
  Menu,
  PackageCheck,
  Users,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext.jsx";
import { notificationsApi } from "../../services/api/notifications.js";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/proxy",
    icon: Home,
  },
  {
    label: "Patients",
    path: "/proxy/patients",
    icon: Users,
  },
  {
    label: "Collections",
    path: "/proxy/collections",
    icon: PackageCheck,
  },
];

function initialsFromName(name) {
  if (!name) {
    return "PX";
  }

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatNotificationDate(value) {
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

function splitNotificationMessage(message) {
  const text =
    String(
      message ?? ""
    ).trim();

  if (!text) {
    return {
      title: "",
      body: "",
    };
  }

  const separatorIndex =
    text.indexOf(":");

  if (
    separatorIndex <= 0
  ) {
    return {
      title: "",
      body: text,
    };
  }

  return {
    title: text
      .slice(
        0,
        separatorIndex
      )
      .trim(),

    body: text
      .slice(
        separatorIndex + 1
      )
      .trim(),
  };
}

export default function ProxyAppLayout() {
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

  const location =
    useLocation();

  const navigate =
    useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const displayName =
    user?.fullName ||
    user?.name ||
    "Proxy";

  const initials =
    initialsFromName(
      displayName
    );

  const currentPage =
    navigationItems.find(
      (item) => {
        if (
          item.path ===
          "/proxy"
        ) {
          return (
            location.pathname ===
            "/proxy"
          );
        }

        return location.pathname.startsWith(
          item.path
        );
      }
    ) ||
    navigationItems[0];

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

  useEffect(() => {
    loadNotifications();
  }, [
    loadNotifications,
  ]);

  useEffect(() => {
    setNotificationsOpen(
      false
    );

    setMobileOpen(
      false
    );
  }, [
    location.pathname,
  ]);

  const unreadNotifications =
    notifications.filter(
      (notification) =>
        !notification.isRead
    );

  const handleNotificationClick =
    async (
      notification
    ) => {
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
                      isRead:
                        true,
                    }
                  : item
            )
        );
      } catch (error) {
        console.error(
          "Failed to mark proxy notification as read:",
          error
        );
      }
    };

  const markAllRead =
    async () => {
      try {
        await notificationsApi
          .markAllRead();

        setNotifications(
          (current) =>
            current.map(
              (item) => ({
                ...item,
                isRead:
                  true,
              })
            )
        );
      } catch (error) {
        console.error(
          "Failed to mark all proxy notifications as read:",
          error
        );
      }
    };

  const handleLogout =
    () => {
      logout();

      navigate(
        "/login",
        {
          replace: true,
        }
      );
    };

  const navContent = (
    <>
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

      <nav className="flex-1 space-y-2 px-4 py-6">
        {navigationItems.map(
          (item) => {
            const Icon =
              item.icon;

            return (
              <NavLink
                key={
                  item.path
                }
                to={
                  item.path
                }
                end={
                  item.path ===
                  "/proxy"
                }
                className={({
                  isActive,
                }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#ccfbf1] text-[#115e59]"
                      : "text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
                  }`
                }
              >
                <Icon
                  size={
                    20
                  }
                />
                <span>
                  {
                    item.label
                  }
                </span>
              </NavLink>
            );
          }
        )}
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
            size={
              19
            }
          />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="patient-figma-root min-h-screen bg-[#f8fafc] text-[#0f172a]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[270px] border-r border-[#e2e8f0] bg-white lg:flex lg:flex-col">
        {navContent}
      </aside>

      <div className="lg:pl-[270px]">
        <header className="sticky top-0 z-[1200] flex h-[78px] items-center justify-between border-b border-[#e2e8f0] bg-white/95 px-4 backdrop-blur sm:px-6 lg:z-30 lg:px-8">
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
                size={
                  21
                }
              />
            </button>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold text-[#0f172a] sm:text-xl">
                {
                  currentPage.label
                }
              </h1>

              <p className="hidden truncate text-sm text-[#64748b] sm:block">
                Welcome back,{" "}
                {displayName}
              </p>
            </div>
          </div>

          <div className="ml-3 flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setNotificationsOpen(
                    (value) =>
                      !value
                  )
                }
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-[#475569] transition hover:bg-[#f8fafc]"
                aria-label="Notifications"
                aria-expanded={
                  notificationsOpen
                }
              >
                <Bell
                  size={
                    19
                  }
                />

                {unreadNotifications.length >
                  0 && (
                  <span className="absolute right-[4px] top-[3px] flex h-4 min-w-4 items-center justify-center rounded-full bg-[#dc2626] px-1 text-[9px] font-bold text-white">
                    {unreadNotifications.length >
                    9
                      ? "9+"
                      : unreadNotifications.length}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="fixed left-3 right-3 top-[68px] z-[2100] max-h-[calc(100dvh-80px)] overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-xl sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:w-[min(380px,calc(100vw-2rem))] sm:max-h-none">
                  <div className="border-b border-[#e2e8f0] px-4 py-3 sm:px-5 sm:py-4">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="font-semibold text-[#0f172a]">
                        Notifications
                      </h2>

                      <div className="flex items-center gap-2">
                        {unreadNotifications.length >
                          0 && (
                          <button
                            type="button"
                            onClick={
                              markAllRead
                            }
                            className="rounded-full bg-[#ccfbf1] px-2.5 py-1 text-[11px] font-semibold text-[#115e59] transition hover:bg-[#99f6e4]"
                          >
                            Mark all read
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            setNotificationsOpen(
                              false
                            )
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-full text-[#64748b] transition hover:bg-[#f1f5f9] sm:hidden"
                          aria-label="Close notifications"
                        >
                          <X
                            size={
                              15
                            }
                          />
                        </button>
                      </div>
                    </div>

                    <p className="mt-1 text-xs text-[#64748b]">
                      Collection reminders and PhilaLink updates
                    </p>
                  </div>

                  <div className="max-h-[calc(100dvh-165px)] divide-y divide-[#e2e8f0] overflow-y-auto overscroll-contain sm:max-h-[360px]">
                    {notificationsLoading ? (
                      <div className="px-5 py-6 text-center">
                        <p className="text-sm text-[#64748b]">
                          Loading notifications...
                        </p>
                      </div>
                    ) : notificationsError ? (
                      <div className="px-5 py-5">
                        <p className="text-sm text-[#dc2626]">
                          {
                            notificationsError
                          }
                        </p>

                        <button
                          type="button"
                          onClick={
                            loadNotifications
                          }
                          className="mt-2 text-xs font-medium text-[#0f766e]"
                        >
                          Try again
                        </button>
                      </div>
                    ) : notifications.length ===
                      0 ? (
                      <div className="px-5 py-8 text-center">
                        <Bell
                          size={
                            24
                          }
                          className="mx-auto text-[#94a3b8]"
                        />

                        <p className="mt-3 text-sm font-medium text-[#0f172a]">
                          No notifications
                        </p>

                        <p className="mt-1 text-xs text-[#64748b]">
                          You're all caught up.
                        </p>
                      </div>
                    ) : (
                      notifications.map(
                        (
                          notification
                        ) => {
                          const {
                            title,
                            body,
                          } =
                            splitNotificationMessage(
                              notification.message
                            );

                          return (
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
                                  <p className="break-words text-sm leading-5 text-[#0f172a]">
                                    {title && (
                                      <span className="font-bold">
                                        {title}:
                                      </span>
                                    )}

                                    {body && (
                                      <span className="font-normal">
                                        {title
                                          ? " "
                                          : ""}
                                        {body}
                                      </span>
                                    )}
                                  </p>

                                  <p className="mt-1 text-xs text-[#64748b]">
                                    {formatNotificationDate(
                                      notification.createdAt
                                    )}
                                  </p>
                                </div>
                              </div>
                            </button>
                          );
                        }
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

      {mobileOpen && (
        <div className="fixed inset-0 z-[3000] lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() =>
              setMobileOpen(
                false
              )
            }
            className="absolute inset-0 bg-black/30"
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
              aria-label="Close navigation"
            >
              <X
                size={
                  18
                }
              />
            </button>

            {navContent}
          </aside>
        </div>
      )}
    </div>
  );
}
