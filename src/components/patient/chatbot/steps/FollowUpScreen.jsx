import { useEffect, useRef } from "react";

import {
  Send,
  Sparkles,
  UserRound,
} from "lucide-react";

const quickReplies = [
  "What could be causing this?",
  "What medication can help?",
  "When should I see a doctor?",
];

export default function FollowUpScreen({
  messages,
  inputValue,
  onInputChange,
  onSend,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSend();
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-xl">
        <div className="flex flex-col gap-md">
          {messages.map(
            (message, index) => {
              const isUser =
                message.type === "user";

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
                      <Sparkles size={14} />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-corner-lg px-md py-sm text-label-sm leading-6 ${
                      isUser
                        ? "bg-brand-primary text-white"
                        : "bg-bg-faint text-text-primary"
                    }`}
                  >
                    {message.text}
                  </div>

                  {isUser && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-corner-full bg-bg-faint text-text-secondary">
                      <UserRound size={14} />
                    </div>
                  )}
                </div>
              );
            }
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="border-t border-border-secondary bg-white p-lg">
        <div className="mb-md flex gap-sm overflow-x-auto pb-xs">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              type="button"
              onClick={() =>
                onInputChange(reply)
              }
              className="whitespace-nowrap rounded-corner-full border border-border-secondary bg-white px-md py-sm text-video-title text-text-secondary transition hover:border-brand-primary hover:text-brand-primary"
            >
              {reply}
            </button>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-sm"
        >
          <textarea
            value={inputValue}
            onChange={(event) =>
              onInputChange(
                event.target.value
              )
            }
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey
              ) {
                event.preventDefault();
                onSend();
              }
            }}
            rows={1}
            placeholder="Type your message..."
            className="max-h-28 min-h-10 flex-1 resize-none rounded-corner-md border border-border-secondary bg-white px-md py-sm text-label-sm text-text-primary outline-none transition focus:border-brand-primary"
          />

          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-corner-md bg-brand-primary text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </form>

        <p className="mt-sm text-center text-[10px] leading-4 text-text-tertiary">
          PhilaChatBot provides general health
          information and does not replace a healthcare
          professional.
        </p>
      </div>
    </>
  );
}
