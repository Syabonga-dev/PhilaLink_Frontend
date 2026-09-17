import {
  useEffect,
  useRef,
} from "react";

import ReactMarkdown from "react-markdown";

import {
  ChevronLeft,
  LoaderCircle,
  Menu,
  Send,
  Sparkles,
  UserRound,
} from "lucide-react";

const quickReplies = [
  "What could be causing this?",
  "What should I monitor?",
  "How many days of medication do I have left?",
];

function AssistantMessage({
  text,
}) {
  return (
    <div className="break-words">
      <ReactMarkdown
        components={{
          p: ({
            children,
          }) => (
            <p className="mb-2 last:mb-0">
              {
                children
              }
            </p>
          ),

          strong: ({
            children,
          }) => (
            <strong className="font-semibold text-text-primary">
              {
                children
              }
            </strong>
          ),

          em: ({
            children,
          }) => (
            <em className="text-text-secondary">
              {
                children
              }
            </em>
          ),

          ul: ({
            children,
          }) => (
            <ul className="my-2 list-disc space-y-1 pl-5">
              {
                children
              }
            </ul>
          ),

          ol: ({
            children,
          }) => (
            <ol className="my-2 list-decimal space-y-1 pl-5">
              {
                children
              }
            </ol>
          ),

          li: ({
            children,
          }) => (
            <li className="pl-1">
              {
                children
              }
            </li>
          ),

          h1: ({
            children,
          }) => (
            <h1 className="mb-2 mt-3 text-base font-semibold text-text-primary first:mt-0">
              {
                children
              }
            </h1>
          ),

          h2: ({
            children,
          }) => (
            <h2 className="mb-2 mt-3 text-sm font-semibold text-text-primary first:mt-0">
              {
                children
              }
            </h2>
          ),

          h3: ({
            children,
          }) => (
            <h3 className="mb-1 mt-2 text-sm font-semibold text-text-primary first:mt-0">
              {
                children
              }
            </h3>
          ),

          blockquote: ({
            children,
          }) => (
            <blockquote className="my-2 border-l-2 border-brand-primary/40 pl-3 text-text-secondary">
              {
                children
              }
            </blockquote>
          ),

          code: ({
            children,
          }) => (
            <code className="rounded bg-white px-1 py-0.5 font-mono text-[0.85em] text-text-primary">
              {
                children
              }
            </code>
          ),

          a: ({
            children,
            href,
          }) => (
            <a
              href={
                href
              }
              target="_blank"
              rel="noreferrer"
              className="font-medium text-brand-primary underline underline-offset-2"
            >
              {
                children
              }
            </a>
          ),
        }}
      >
        {String(
          text ?? ""
        )}
      </ReactMarkdown>
    </div>
  );
}

export default function FollowUpScreen({
  messages,
  inputValue,
  sending = false,
  onInputChange,
  onSend,
  onMenu,
}) {
  const bottomRef =
    useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView(
      {
        behavior:
          "smooth",
      }
    );
  }, [
    messages,
    sending,
  ]);

  const handleSubmit =
    (event) => {
      event.preventDefault();

      if (!sending) {
        onSend();
      }
    };

  return (
    <>
      <div className="flex shrink-0 items-center justify-between border-b border-border-secondary bg-white px-lg py-sm">
        <button
          type="button"
          onClick={
            onMenu
          }
          className="flex items-center gap-xs rounded-corner-md px-sm py-xs text-label-sm font-medium text-text-secondary transition hover:bg-bg-faint hover:text-brand-primary"
        >
          <ChevronLeft
            size={16}
          />

          <Menu
            size={16}
          />

          <span>
            Menu
          </span>
        </button>

        <p className="text-video-title font-medium text-text-tertiary">
          Chat
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-xl">
        <div className="flex flex-col gap-md">
          {messages.map(
            (
              message,
              index
            ) => {
              const isUser =
                message.type ===
                "user";

              return (
                <div
                  key={`${message.type}-${index}`}
                  className={`flex gap-sm ${
                    isUser
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {!isUser && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-corner-full bg-brand-primary text-white">
                      <Sparkles
                        size={14}
                      />
                    </div>
                  )}

                  <div
                    className={`min-w-0 max-w-[82%] rounded-corner-lg px-md py-sm text-label-sm leading-6 ${
                      isUser
                        ? "whitespace-pre-wrap bg-brand-primary text-white"
                        : "bg-bg-faint text-text-primary"
                    }`}
                  >
                    {isUser ? (
                      message.text
                    ) : (
                      <AssistantMessage
                        text={
                          message.text
                        }
                      />
                    )}
                  </div>

                  {isUser && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-corner-full bg-bg-faint text-text-secondary">
                      <UserRound
                        size={14}
                      />
                    </div>
                  )}
                </div>
              );
            }
          )}

          {sending && (
            <div className="flex gap-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-corner-full bg-brand-primary text-white">
                <Sparkles
                  size={14}
                />
              </div>

              <div className="rounded-corner-lg bg-bg-faint px-md py-sm text-text-secondary">
                <LoaderCircle
                  size={16}
                  className="animate-spin"
                />
              </div>
            </div>
          )}

          <div
            ref={
              bottomRef
            }
          />
        </div>
      </div>

      <div className="border-t border-border-secondary bg-white p-lg">
        <div className="mb-md flex gap-sm overflow-x-auto pb-xs">
          {quickReplies.map(
            (reply) => (
              <button
                key={
                  reply
                }
                type="button"
                disabled={
                  sending
                }
                onClick={() =>
                  onInputChange(
                    reply
                  )
                }
                className="whitespace-nowrap rounded-corner-full border border-border-secondary bg-white px-md py-sm text-video-title text-text-secondary transition hover:border-brand-primary hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {
                  reply
                }
              </button>
            )
          )}
        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="flex items-end gap-sm"
        >
          <textarea
            value={
              inputValue
            }
            disabled={
              sending
            }
            onChange={(
              event
            ) =>
              onInputChange(
                event.target
                  .value
              )
            }
            onKeyDown={(
              event
            ) => {
              if (
                event.key ===
                  "Enter" &&
                !event.shiftKey &&
                !sending
              ) {
                event.preventDefault();

                onSend();
              }
            }}
            rows={1}
            placeholder="Ask Phila anything..."
            className="max-h-28 min-h-10 flex-1 resize-none rounded-corner-md border border-border-secondary bg-white px-md py-sm text-label-sm text-text-primary outline-none transition focus:border-brand-primary disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={
              !inputValue.trim() ||
              sending
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-corner-md bg-brand-primary text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Send message"
          >
            {sending ? (
              <LoaderCircle
                size={16}
                className="animate-spin"
              />
            ) : (
              <Send
                size={16}
              />
            )}
          </button>
        </form>

        <p className="mt-sm text-center text-[10px] leading-4 text-text-tertiary">
          PhilaChatBot provides general health
          information and does not replace a
          healthcare professional.
        </p>
      </div>
    </>
  );
}