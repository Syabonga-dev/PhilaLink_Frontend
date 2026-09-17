import {
  useEffect,
  useRef,
  useState,
} from "react";

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
  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);

  const [
    isClearing,
    setIsClearing,
  ] = useState(false);

  const [
    clearError,
    setClearError,
  ] = useState("");

  const menuRef =
    useRef(null);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handlePointerDown =
      (event) => {
        if (
          menuRef.current &&
          !menuRef.current.contains(
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
      (event) => {
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

    document.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    menuOpen,
  ]);

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
          "Clear this chat history?\n\nThis will start a new PhilaChatBot conversation. Your symptom assessments, medications, allergies, medical conditions, and other PhilaLink profile information will not be deleted."
        );

      if (!confirmed) {
        return;
      }

      setIsClearing(
        true
      );

      setClearError(
        ""
      );

      try {
        await onClearHistory();

        setMenuOpen(
          false
        );
      } catch {
        setClearError(
          "Chat history could not be cleared. Please try again."
        );
      } finally {
        setIsClearing(
          false
        );
      }
    };

  const handleMinimize =
    () => {
      setMenuOpen(
        false
      );

      onMinimize();
    };

  const handleClose =
    () => {
      setMenuOpen(
        false
      );

      onClose();
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
              label="Online"
              variant="success"
            />
          </div>

          <p className="text-video-title text-text-secondary">
            Your PhilaLink
            health assistant
          </p>
        </div>
      </div>

      <div className="flex items-center gap-xs">
        <Tooltip
          content="Minimize"
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
            onClick={
              handleMinimize
            }
            aria-label="Minimize"
          />
        </Tooltip>

        <div
          ref={
            menuRef
          }
          className="relative"
        >
          <Tooltip
            content="More options"
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
                  (
                    previous
                  ) =>
                    !previous
                );

                setClearError(
                  ""
                );
              }}
              aria-label="More options"
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
                  Chat options
                </p>

                <p className="mt-xs text-[10px] leading-4 text-text-tertiary">
                  Manage your
                  current
                  PhilaChatBot
                  conversation.
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
                        ? "Clearing..."
                        : "Clear chat history"}
                    </p>

                    <p className="mt-xs text-[10px] leading-4 text-text-tertiary">
                      Start a new
                      conversation
                      without
                      deleting your
                      PhilaLink
                      health
                      records.
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
                    Wait for the
                    current response
                    to finish before
                    clearing the
                    conversation.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <Tooltip
          content="Close"
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
            onClick={
              handleClose
            }
            aria-label="Close"
          />
        </Tooltip>
      </div>
    </div>
  );
}