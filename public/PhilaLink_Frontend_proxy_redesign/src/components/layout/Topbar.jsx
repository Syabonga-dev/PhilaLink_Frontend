import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { notificationsApi } from "../../services/api/notifications.js";

function formatNotificationDate(value) {
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
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

export default function Topbar({
  title,
  onMenuClick,
}) {
  const {
    user,
    logout,
  } = useAuth();

  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);

  const [
    notificationOpen,
    setNotificationOpen,
  ] = useState(false);

  const [
    notifications,
    setNotifications,
  ] = useState([]);

  const [
    notificationLoading,
    setNotificationLoading,
  ] = useState(false);

  const [
    notificationError,
    setNotificationError,
  ] = useState("");

  const menuRef =
    useRef(null);

  const notificationRef =
    useRef(null);

  const loadNotifications =
    useCallback(
      async () => {
        try {
          setNotificationLoading(
            true
          );

          setNotificationError(
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
            "Failed to load notifications:",
            error
          );

          setNotificationError(
            error?.message ||
              "Could not load notifications."
          );
        } finally {
          setNotificationLoading(
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
    user?.id,
  ]);

  useEffect(() => {
    function onClickOutside(
      event
    ) {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target
        )
      ) {
        setMenuOpen(
          false
        );
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          event.target
        )
      ) {
        setNotificationOpen(
          false
        );
      }
    }

    document.addEventListener(
      "mousedown",
      onClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        onClickOutside
      );
  }, []);

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.isRead
    ).length;

  const initials = (
    user?.fullName ||
    user?.name ||
    "U"
  )
    .split(" ")
    .map((part) =>
      part[0]
    )
    .slice(0, 2)
    .join("")
    .toUpperCase();

  async function markRead(
    notification
  ) {
    if (
      !notification ||
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

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-outline-variant/60 bg-surface-container-lowest/90 px-4 backdrop-blur lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={
            onMenuClick
          }
          className="material-symbols-outlined rounded-md p-1.5 text-on-surface hover:bg-surface-container lg:hidden"
          aria-label="Open menu"
        >
          menu
        </button>

        <h1 className="text-lg font-semibold text-on-surface">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="relative"
          ref={
            notificationRef
          }
        >
          <button
            type="button"
            onClick={() => {
              setNotificationOpen(
                (value) =>
                  !value
              );

              setMenuOpen(
                false
              );

              if (
                !notificationOpen
              ) {
                loadNotifications();
              }
            }}
            className="material-symbols-outlined relative rounded-full p-2 text-on-surface-variant hover:bg-surface-container"
            aria-label={`Notifications${
              unreadCount
                ? `, ${unreadCount} unread`
                : ""
            }`}
          >
            notifications

            {unreadCount >
              0 && (
              <span className="absolute -right-0.5 -top-0.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold leading-none text-white">
                {unreadCount >
                9
                  ? "9+"
                  : unreadCount}
              </span>
            )}
          </button>

          {notificationOpen && (
            <div className="absolute right-0 mt-2 w-[min(92vw,380px)] overflow-hidden rounded-xl border border-outline-variant/60 bg-white shadow-elevated">
              <div className="flex items-center justify-between gap-3 border-b border-outline-variant/60 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-on-surface">
                    Notifications
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {unreadCount} unread
                  </p>
                </div>

                {unreadCount >
                  0 && (
                  <button
                    type="button"
                    onClick={
                      markAllRead
                    }
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-[420px] overflow-y-auto">
                {notificationLoading ? (
                  <div className="px-4 py-8 text-center text-sm text-on-surface-variant">
                    Loading notifications...
                  </div>
                ) : notificationError ? (
                  <div className="px-4 py-5">
                    <p className="text-sm text-error">
                      {
                        notificationError
                      }
                    </p>
                    <button
                      type="button"
                      onClick={
                        loadNotifications
                      }
                      className="mt-2 text-xs font-semibold text-primary hover:underline"
                    >
                      Try again
                    </button>
                  </div>
                ) : notifications.length ===
                  0 ? (
                  <div className="px-4 py-8 text-center">
                    <span className="material-symbols-outlined text-3xl text-on-surface-variant">
                      notifications_none
                    </span>
                    <p className="mt-2 text-sm font-medium text-on-surface">
                      No notifications
                    </p>
                    <p className="mt-1 text-xs text-on-surface-variant">
                      New collection reminders will appear here.
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
                          markRead(
                            notification
                          )
                        }
                        className={`block w-full border-b border-outline-variant/40 px-4 py-3 text-left transition last:border-b-0 ${
                          notification.isRead
                            ? "bg-white hover:bg-surface-container-low"
                            : "bg-primary-container/10 hover:bg-primary-container/20"
                        }`}
                      >
                        <div className="flex gap-3">
                          <span
                            className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                              notification.isRead
                                ? "bg-transparent"
                                : "bg-primary"
                            }`}
                          />

                          <div className="min-w-0">
                            <p className="text-sm leading-5 text-on-surface">
                              {
                                notification.message
                              }
                            </p>

                            <p className="mt-1 text-xs text-on-surface-variant">
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
          className="relative"
          ref={
            menuRef
          }
        >
          <button
            onClick={() => {
              setMenuOpen(
                (value) =>
                  !value
              );

              setNotificationOpen(
                false
              );
            }}
            className="flex items-center gap-2 rounded-full border border-outline-variant/60 py-1 pl-1 pr-3 hover:bg-surface-container"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary">
              {initials}
            </span>

            <span className="hidden text-sm font-medium sm:inline">
              {user?.fullName ||
                user?.name ||
                "Account"}
            </span>

            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
              expand_more
            </span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-md border border-outline-variant/60 bg-white shadow-elevated animate-fade-in">
              <div className="border-b border-outline-variant/60 px-4 py-3">
                <p className="truncate text-sm font-semibold text-on-surface">
                  {user?.fullName ||
                    user?.name}
                </p>
                <p className="truncate text-xs text-on-surface-variant">
                  {user?.role}
                </p>
              </div>

              <button
                onClick={
                  logout
                }
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-error hover:bg-error-container/40"
              >
                <span className="material-symbols-outlined text-[18px]">
                  logout
                </span>
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
