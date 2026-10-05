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
  CalendarDays,
  CheckCheck,
  ClipboardList,
  Home,
  LogOut,
  Menu,
  Pill,
  Settings,
  Stethoscope,
  X,
} from "lucide-react";

import {
  useTranslation,
} from "react-i18next";

import {
  useAuth,
} from "../../context/AuthContext.jsx";

import {
  notificationsApi,
} from "../../services/api/notifications.js";

import {
  getLanguageLocale,
} from "../../i18n/languages.js";

import PhilaChatBot from "./chatbot/PhilaChatBot.jsx";
import WeatherChip from "./WeatherChip.jsx";

const NOTIFICATION_REFRESH_MS =
  60 * 1000;

const navigationItems = [
  {
    labelKey:
      "nav.dashboard",
    path:
      "/patient",
    icon:
      Home,
  },
  {
    labelKey:
      "nav.medications",
    path:
      "/patient/medications",
    icon:
      Pill,
  },
  {
    labelKey:
      "nav.appointments",
    path:
      "/patient/appointments",
    icon:
      CalendarDays,
  },
  {
    labelKey:
      "nav.records",
    path:
      "/patient/records",
    icon:
      ClipboardList,
  },
  {
    labelKey:
      "nav.clinics",
    path:
      "/patient/clinics",
    icon:
      Stethoscope,
  },
  {
    labelKey:
      "nav.settings",
    path:
      "/patient/settings",
    icon:
      Settings,
  },
];

function initialsFromName(
  name
) {
  if (!name) {
    return "PT";
  }

  const parts =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

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

  return `${parts[0][0]}${
    parts[
      parts.length -
        1
    ][0]
  }`.toUpperCase();
}

function formatNotificationDate(
  value,
  locale
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

  try {
    return date
      .toLocaleString(
        locale,
        {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
  } catch {
    return date
      .toLocaleString(
        "en-ZA",
        {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
  }
}

function splitNotificationMessage(
  message
) {
  const text =
    String(
      message ??
        ""
    ).trim();

  if (!text) {
    return {
      title: "",
      body: "",
    };
  }

  const separatorIndex =
    text.indexOf(
      ":"
    );

  if (
    separatorIndex <=
    0
  ) {
    return {
      title: "",
      body:
        text,
    };
  }

  return {
    title:
      text
        .slice(
          0,
          separatorIndex
        )
        .trim(),

    body:
      text
        .slice(
          separatorIndex +
            1
        )
        .trim(),
  };
}

export default function AppLayout() {
  const {
    t,
    i18n,
  } =
    useTranslation();

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
    notificationActionError,
    setNotificationActionError,
  ] = useState("");

  const [
    markingAllRead,
    setMarkingAllRead,
  ] = useState(false);

  const location =
    useLocation();

  const navigate =
    useNavigate();

  const {
    user,
    logout,
  } =
    useAuth();

  const displayName =
    user?.fullName ||
    user?.name ||
    t(
      "common.patient"
    );

  const initials =
    initialsFromName(
      displayName
    );

  const locale =
    getLanguageLocale(
      i18n.resolvedLanguage ||
        i18n.language
    );

  const currentPage =
    navigationItems.find(
      (
        item
      ) => {
        if (
          item.path ===
          "/patient"
        ) {
          return (
            location.pathname ===
            "/patient"
          );
        }

        return location.pathname
          .startsWith(
            item.path
          );
      }
    ) ||
    navigationItems[0];

  const loadNotifications =
    useCallback(
      async ({
        background =
          false,
      } = {}) => {
        try {
          if (
            !background
          ) {
            setNotificationsLoading(
              true
            );

            setNotificationActionError(
              ""
            );
          }

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
        } catch (
          error
        ) {
          console.error(
            "Failed to load notifications:",
            error
          );

          if (
            !background
          ) {
            setNotificationsError(
              error?.message ||
                i18n.t(
                  "notifications.loadError"
                )
            );
          }
        } finally {
          if (
            !background
          ) {
            setNotificationsLoading(
              false
            );
          }
        }
      },
      [
        i18n,
      ]
    );

  useEffect(
    () => {
      void loadNotifications();

      const intervalId =
        window.setInterval(
          () => {
            if (
              document
                .visibilityState ===
              "visible"
            ) {
              void loadNotifications({
                background:
                  true,
              });
            }
          },
          NOTIFICATION_REFRESH_MS
        );

      const handleVisibilityChange =
        () => {
          if (
            document
              .visibilityState ===
            "visible"
          ) {
            void loadNotifications({
              background:
                true,
            });
          }
        };

      document.addEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      return () => {
        window.clearInterval(
          intervalId
        );

        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      };
    },
    [
      loadNotifications,
    ]
  );

  useEffect(
    () => {
      setNotificationsOpen(
        false
      );

      setMobileOpen(
        false
      );
    },
    [
      location.pathname,
    ]
  );

  useEffect(
    () => {
      if (
        !mobileOpen
      ) {
        return undefined;
      }

      const previousOverflow =
        document.body.style
          .overflow;

      document.body.style
        .overflow =
        "hidden";

      return () => {
        document.body.style
          .overflow =
          previousOverflow;
      };
    },
    [
      mobileOpen,
    ]
  );

  const unreadNotifications =
    notifications.filter(
      (
        notification
      ) =>
        !notification
          .isRead
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

    setNotificationActionError(
      ""
    );

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
    } catch (
      error
    ) {
      console.error(
        "Failed to mark notification as read:",
        error
      );

      setNotificationActionError(
        error?.message ||
          t(
            "notifications.markError"
          )
      );
    }
  }

  async function handleMarkAllRead() {
    if (
      markingAllRead ||
      unreadNotifications
        .length ===
        0
    ) {
      return;
    }

    try {
      setMarkingAllRead(
        true
      );

      setNotificationActionError(
        ""
      );

      await notificationsApi
        .markAllRead();

      setNotifications(
        (
          current
        ) =>
          current.map(
            (
              notification
            ) => ({
              ...notification,
              isRead:
                true,
            })
          )
      );
    } catch (
      error
    ) {
      console.error(
        "Failed to mark all notifications as read:",
        error
      );

      setNotificationActionError(
        error?.message ||
          t(
            "notifications.markAllError"
          )
      );
    } finally {
      setMarkingAllRead(
        false
      );
    }
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

  function renderNavigation({
    mobile =
      false,
  } = {}) {
    return navigationItems.map(
      (
        item
      ) => {
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
              "/patient"
            }
            onClick={
              mobile
                ? () =>
                    setMobileOpen(
                      false
                    )
                : undefined
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
              size={20}
            />

            <span>
              {t(
                item.labelKey
              )}
            </span>
          </NavLink>
        );
      }
    );
  }

  return (
    <div className="patient-figma-root min-h-screen bg-[#f8fafc] text-[#0f172a]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[270px] border-r border-[#e2e8f0] bg-white lg:flex lg:flex-col">
        <div className="flex h-[78px] items-center border-b border-[#e2e8f0] px-7">
          <button
            type="button"
            onClick={() =>
              navigate(
                "/patient"
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
                {t(
                  "layout.patientPortal"
                )}
              </div>
            </div>
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-6">
          {renderNavigation()}
        </nav>

        <div className="border-t border-[#e2e8f0] p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-[#f8fafc] p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0f766e] text-sm font-semibold text-white">
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-[#0f172a]">
                {
                  displayName
                }
              </div>

              <div className="text-xs text-[#64748b]">
                {t(
                  "common.patient"
                )}
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

            {t(
              "common.logout"
            )}
          </button>
        </div>
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
              aria-label={t(
                "layout.openNavigation"
              )}
            >
              <Menu
                size={21}
              />
            </button>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold text-[#0f172a] sm:text-xl">
                {t(
                  currentPage
                    .labelKey
                )}
              </h1>

              <p className="hidden truncate text-sm text-[#64748b] sm:block">
                {t(
                  "layout.welcomeBack",
                  {
                    name:
                      displayName,
                  }
                )}
              </p>
            </div>
          </div>

          <div className="ml-3 flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen(
                    (
                      current
                    ) => {
                      const next =
                        !current;

                      if (
                        next
                      ) {
                        setNotificationActionError(
                          ""
                        );

                        void loadNotifications({
                          background:
                            true,
                        });
                      }

                      return next;
                    }
                  );
                }}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-[#475569] transition hover:bg-[#f8fafc]"
                aria-label={t(
                  "notifications.title"
                )}
                aria-expanded={
                  notificationsOpen
                }
              >
                <Bell
                  size={19}
                />

                {
                  unreadNotifications
                    .length >
                    0 && (
                    <span className="absolute right-[4px] top-[3px] flex h-4 min-w-4 items-center justify-center rounded-full bg-[#dc2626] px-1 text-[9px] font-bold text-white">
                      {
                        unreadNotifications
                          .length >
                        9
                          ? "9+"
                          : unreadNotifications
                              .length
                      }
                    </span>
                  )
                }
              </button>

              {notificationsOpen && (
                <div className="fixed left-3 right-3 top-[68px] z-[2100] max-h-[calc(100dvh-80px)] overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-xl sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:w-[min(380px,calc(100vw-2rem))] sm:max-h-none">
                  <div className="border-b border-[#e2e8f0] px-4 py-3 sm:px-5 sm:py-4">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="font-semibold text-[#0f172a]">
                        {t(
                          "notifications.title"
                        )}
                      </h2>

                      <div className="flex items-center gap-2">
                        {
                          unreadNotifications
                            .length >
                            0 && (
                            <span className="rounded-full bg-[#ccfbf1] px-2 py-1 text-[11px] font-semibold text-[#115e59]">
                              {
                                unreadNotifications
                                  .length
                              }{" "}
                              {t(
                                "notifications.unread"
                              )}
                            </span>
                          )
                        }

                        <button
                          type="button"
                          onClick={() =>
                            setNotificationsOpen(
                              false
                            )
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-full text-[#64748b] transition hover:bg-[#f1f5f9] sm:hidden"
                          aria-label={t(
                            "notifications.close"
                          )}
                        >
                          <X
                            size={15}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="mt-1 flex items-center justify-between gap-3">
                      <p className="min-w-0 text-xs text-[#64748b]">
                        {t(
                          "notifications.latest"
                        )}
                      </p>

                      {
                        unreadNotifications
                          .length >
                          0 && (
                          <button
                            type="button"
                            onClick={
                              handleMarkAllRead
                            }
                            disabled={
                              markingAllRead
                            }
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-[#0f766e] transition hover:bg-[#f0fdfa] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <CheckCheck
                              size={14}
                            />

                            {
                              markingAllRead
                                ? t(
                                    "notifications.marking"
                                  )
                                : t(
                                    "notifications.markAllRead"
                                  )
                            }
                          </button>
                        )
                      }
                    </div>

                    {notificationActionError && (
                      <p className="mt-2 text-xs text-[#dc2626]">
                        {
                          notificationActionError
                        }
                      </p>
                    )}
                  </div>

                  <div className="max-h-[calc(100dvh-190px)] divide-y divide-[#e2e8f0] overflow-y-auto overscroll-contain sm:max-h-[360px]">
                    {
                      notificationsLoading
                        ? (
                            <div className="px-5 py-6 text-center">
                              <p className="text-sm text-[#64748b]">
                                {t(
                                  "notifications.loading"
                                )}
                              </p>
                            </div>
                          )
                        : notificationsError
                        ? (
                            <div className="px-5 py-5">
                              <p className="text-sm text-[#dc2626]">
                                {
                                  notificationsError
                                }
                              </p>

                              <button
                                type="button"
                                onClick={() =>
                                  void loadNotifications()
                                }
                                className="mt-2 text-xs font-medium text-[#0f766e]"
                              >
                                {t(
                                  "common.tryAgain"
                                )}
                              </button>
                            </div>
                          )
                        : notifications
                              .length ===
                            0
                        ? (
                            <div className="px-5 py-8 text-center">
                              <Bell
                                size={24}
                                className="mx-auto text-[#94a3b8]"
                              />

                              <p className="mt-3 text-sm font-medium text-[#0f172a]">
                                {t(
                                  "notifications.noNotifications"
                                )}
                              </p>

                              <p className="mt-1 text-xs text-[#64748b]">
                                {t(
                                  "notifications.caughtUp"
                                )}
                              </p>
                            </div>
                          )
                        : notifications.map(
                            (
                              notification
                            ) => {
                              const {
                                title,
                                body,
                              } =
                                splitNotificationMessage(
                                  notification
                                    .message
                                );

                              return (
                                <button
                                  key={
                                    notification
                                      .id
                                  }
                                  type="button"
                                  onClick={() =>
                                    handleNotificationClick(
                                      notification
                                    )
                                  }
                                  className={`w-full px-5 py-4 text-left transition hover:bg-[#f8fafc] ${
                                    notification
                                      .isRead
                                      ? "bg-white"
                                      : "bg-[#f0fdfa]"
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    {
                                      !notification
                                        .isRead && (
                                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#0f766e]" />
                                      )
                                    }

                                    <div className="min-w-0 flex-1">
                                      <p className="break-words text-sm leading-5 text-[#0f172a]">
                                        {title && (
                                          <span className="font-bold">
                                            {
                                              title
                                            }
                                            :
                                          </span>
                                        )}

                                        {body && (
                                          <span className="font-normal">
                                            {
                                              title
                                                ? " "
                                                : ""
                                            }
                                            {
                                              body
                                            }
                                          </span>
                                        )}
                                      </p>

                                      <p className="mt-1 text-xs text-[#64748b]">
                                        {
                                          formatNotificationDate(
                                            notification
                                              .createdAt,
                                            locale
                                          )
                                        }
                                      </p>
                                    </div>
                                  </div>
                                </button>
                              );
                            }
                          )
                    }
                  </div>
                </div>
              )}
            </div>

            <WeatherChip
              onNotificationCreated={() =>
                loadNotifications({
                  background:
                    true,
                })
              }
            />

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/patient/settings"
                )
              }
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0f766e] text-sm font-semibold text-white"
              title={
                displayName
              }
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
        <div className="fixed inset-0 z-[3000] h-[100dvh] min-h-[100dvh] w-screen lg:hidden">
          <button
            type="button"
            onClick={() =>
              setMobileOpen(
                false
              )
            }
            className="fixed inset-0 z-0 h-[100dvh] w-screen bg-black/40"
            aria-label={t(
              "layout.closeNavigation"
            )}
          />

          <aside className="fixed inset-y-0 left-0 z-10 flex h-[100dvh] min-h-[100dvh] max-h-[100dvh] w-[290px] max-w-[85vw] flex-col overflow-hidden border-r border-[#e2e8f0] bg-white shadow-2xl">
            <div className="flex h-[78px] shrink-0 items-center justify-between border-b border-[#e2e8f0] bg-white px-5">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(
                    false
                  );

                  navigate(
                    "/patient"
                  );
                }}
                className="flex min-w-0 items-center gap-3"
              >
                <img
                  src="/logo2.png"
                  alt="PhilaLink logo"
                  className="h-10 w-10 shrink-0 object-contain"
                />

                <span className="text-lg font-bold">
                  Phila
                  <span className="text-[#0f766e]">
                    Link
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setMobileOpen(
                    false
                  )
                }
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#64748b] hover:bg-[#f1f5f9]"
                aria-label={t(
                  "layout.closeNavigation"
                )}
              >
                <X
                  size={20}
                />
              </button>
            </div>

            <nav className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain px-4 py-6">
              {renderNavigation({
                mobile:
                  true,
              })}
            </nav>

            <div className="shrink-0 border-t border-[#e2e8f0] bg-white p-4">
              <div className="mb-3 flex items-center gap-3 rounded-xl bg-[#f8fafc] p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0f766e] text-sm font-semibold text-white">
                  {
                    initials
                  }
                </div>

                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-[#0f172a]">
                    {
                      displayName
                    }
                  </div>

                  <div className="text-xs text-[#64748b]">
                    {t(
                      "common.patient"
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={
                  handleLogout
                }
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#dc2626] hover:bg-[#fee2e2]"
              >
                <LogOut
                  size={19}
                />

                {t(
                  "common.logout"
                )}
              </button>
            </div>
          </aside>
        </div>
      )}

      <PhilaChatBot />
    </div>
  );
}