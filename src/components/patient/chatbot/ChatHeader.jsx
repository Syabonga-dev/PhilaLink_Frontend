import {
  IconButton,
  Badge,
  Tooltip,
} from "./AstraCompat.jsx";

import {
  Zap,
  Minus,
  X,
  MoreVertical,
} from "lucide-react";

export default function ChatHeader({
  onMinimize,
  onClose,
}) {
  return (
    <div className="flex flex-shrink-0 items-center justify-between border-b border-border-secondary px-xl py-lg">
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
            Your PhilaLink health assistant
          </p>
        </div>
      </div>

      <div className="flex items-center gap-xs">
        <Tooltip
          content="Minimize"
          position="bottom"
        >
          <IconButton
            icon={<Minus size={14} />}
            variant="subtle"
            size="small"
            onClick={onMinimize}
            aria-label="Minimize"
          />
        </Tooltip>

        <Tooltip
          content="More options"
          position="bottom"
        >
          <IconButton
            icon={
              <MoreVertical size={14} />
            }
            variant="subtle"
            size="small"
            aria-label="More options"
          />
        </Tooltip>

        <Tooltip
          content="Close"
          position="bottom"
        >
          <IconButton
            icon={<X size={14} />}
            variant="subtle"
            size="small"
            onClick={onClose}
            aria-label="Close"
          />
        </Tooltip>
      </div>
    </div>
  );
}
