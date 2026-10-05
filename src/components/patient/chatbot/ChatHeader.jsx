import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useTranslation,
} from "react-i18next";

import {
  IconButton,
  Badge,
  Tooltip,
} from "./AstraCompat.jsx";

import {
  LoaderCircle,
  Minus,
  MoreVertical,
  Trash2,
  X,
  Zap,
} from "lucide-react";

export default function ChatHeader({
  onMinimize,
  onClose,
  onClearHistory,
  sending = false,
}) {
  const {
    t,
  } =
    useTranslation();

  const [
    menuOpen,
    setMenuOpen,
  ] =
    useState(false);

  const [
    isClearing,
    setIsClearing,
  ] =
    useState(false);

  const [
    clearError,
    setClearError,
  ] =
    useState("");

  const menuRef =
    useRef(null);

  useEffect(
    () => {
      if (!menuOpen) {
        return undefined;
      }

      const handlePointerDown =
        event => {
          if (
            menuRef.current &&
            !menuRef
              .current
              .contains(
                event.target
              )
          ) {
            setMenuOpen(
              false
            );

            setClearError(
              ""
            );
          }
        };

      const handleKeyDown =
        event => {
          if (
            event.key ===
            "Escape"
          ) {
            setMenuOpen(
              false
            );

            setClearError(
              ""
            );
          }
        };

      document
        .addEventListener(
          "pointerdown",
          handlePointerDown
        );

      document
        .addEventListener(
          "keydown",
          handleKeyDown
        );

      return () => {
        document
          .removeEventListener(
            "pointerdown",
            handlePointerDown
          );

        document
          .removeEventListener(
            "keydown",
            handleKeyDown
          );
      };
    },
    [
      menuOpen,
    ]
  );

  const handleClearHistory =
    async () => {
      if (
        isClearing ||
        sending
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          t(
            "chatbot.clearConfirm"
          )
        );

      if (!confirmed) {
        return;
      }

      setIsClearing(
        true
      );

      setClearError("");

      try {
        await onClearHistory();

        setMenuOpen(
          false
        );
      } catch {
        setClearError(
          t(
            "chatbot.clearError"
          )
        );
      } finally {
        setIsClearing(
          false
        );
      }
    };

  return (
    <div className="relative flex flex-shrink-0 items-center justify-between border-b border-border-secondary px-xl py-lg">
      <div className="flex items-center gap-md">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-corner-full bg-brand-primary">
          <Zap
            size={15}
            className="text-on-brand"
          />
        </div>

        <div>
          <div className="flex items-center gap-xs">
            <span className="text-label font-semibold text-text-primary">
              PhilaChatBot
            </span>

            <Badge
              label={t(
                "chatbot.online"
              )}
              variant="success"
            />
          </div>

          <p className="text-video-title text-text-secondary">
            {t(
              "chatbot.assistantSubtitle"
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-xs">
        <Tooltip
          content={t(
            "chatbot.minimize"
          )}
          position="bottom"
        >
          <IconButton
            icon={
              <Minus
                size={14}
              />
            }
            variant="subtle"
            size="small"
            onClick={() => {
              setMenuOpen(
                false
              );

              onMinimize();
            }}
            aria-label={t(
              "chatbot.minimize"
            )}
          />
        </Tooltip>

        <div
          ref={menuRef}
          className="relative"
        >
          <Tooltip
            content={t(
              "chatbot.moreOptions"
            )}
            position="bottom"
          >
            <IconButton
              icon={
                <MoreVertical
                  size={14}
                />
              }
              variant="subtle"
              size="small"
              onClick={() => {
                setMenuOpen(
                  previous =>
                    !previous
                );

                setClearError(
                  ""
                );
              }}
              aria-label={t(
                "chatbot.moreOptions"
              )}
              aria-expanded={
                menuOpen
              }
              aria-haspopup="menu"
            />
          </Tooltip>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full z-[50] mt-2 w-64 overflow-hidden rounded-corner-lg border border-border-secondary bg-white shadow-xl"
            >
              <div className="border-b border-border-secondary px-md py-sm">
                <p className="text-video-title font-semibold text-text-primary">
                  {t(
                    "chatbot.chatOptions"
                  )}
                </p>

                <p className="mt-xs text-[10px] leading-4 text-text-tertiary">
                  {t(
                    "chatbot.chatOptionsDescription"
                  )}
                </p>
              </div>

              <div className="p-xs">
                <button
                  type="button"
                  role="menuitem"
                  disabled={
                    sending ||
                    isClearing
                  }
                  onClick={
                    handleClearHistory
                  }
                  className="flex w-full items-start gap-sm rounded-corner-md px-md py-sm text-left transition hover:bg-danger/5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <div className="mt-[2px] flex h-7 w-7 shrink-0 items-center justify-center rounded-corner-full bg-danger/10 text-danger">
                    {isClearing ? (
                      <LoaderCircle
                        size={14}
                        className="animate-spin"
                      />
                    ) : (
                      <Trash2
                        size={14}
                      />
                    )}
                  </div>

                  <div>
                    <p className="text-label-sm font-medium text-danger">
                      {isClearing
                        ? t(
                            "chatbot.clearing"
                          )
                        : t(
                            "chatbot.clearHistory"
                          )}
                    </p>

                    <p className="mt-xs text-[10px] leading-4 text-text-tertiary">
                      {t(
                        "chatbot.clearDescription"
                      )}
                    </p>
                  </div>
                </button>
              </div>

              {clearError && (
                <div className="border-t border-border-secondary bg-danger/5 px-md py-sm">
                  <p className="text-[10px] leading-4 text-danger">
                    {
                      clearError
                    }
                  </p>
                </div>
              )}

              {sending && (
                <div className="border-t border-border-secondary px-md py-sm">
                  <p className="text-[10px] leading-4 text-text-tertiary">
                    {t(
                      "chatbot.waitForResponse"
                    )}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <Tooltip
          content={t(
            "chatbot.close"
          )}
          position="bottom"
        >
          <IconButton
            icon={
              <X
                size={14}
              />
            }
            variant="subtle"
            size="small"
            onClick={() => {
              setMenuOpen(
                false
              );

              onClose();
            }}
            aria-label={t(
              "chatbot.close"
            )}
          />
        </Tooltip>
      </div>
    </div>
  );
}
