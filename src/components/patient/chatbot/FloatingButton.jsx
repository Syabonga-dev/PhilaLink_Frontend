import { Tooltip } from "./AstraCompat.jsx";
import { MessageCircle } from "lucide-react";

export default function FloatingButton({
  onClick,
}) {
  return (
    <div className="fixed bottom-4 left-4 z-50 lg:bottom-6 lg:left-[76px]">
      <Tooltip
        content="Your AI health assistant"
        position="right"
      >
        <button
          type="button"
          onClick={onClick}
          className="flex items-center gap-md rounded-corner-full bg-brand-primary px-lg py-md text-on-brand shadow-lg transition-colors hover:bg-brand-hover active:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
          aria-label="Open PhilaChatBot AI health assistant"
        >
          <div className="relative flex-shrink-0">
            <MessageCircle size={18} />

            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-corner-full border-2 border-brand-primary bg-success" />
          </div>

          <span className="whitespace-nowrap text-label-sm font-semibold">
            PhilaChatBot
          </span>
        </button>
      </Tooltip>
    </div>
  );
}
