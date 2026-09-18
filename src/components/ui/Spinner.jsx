import {
  LoaderCircle,
} from "lucide-react";


export default function Spinner({
  label,
  size = 22,
}) {
  return (
    <div className="flex flex-col items-center gap-3 text-on-surface-variant">

      <LoaderCircle
        size={
          size
        }
        className="animate-spin text-primary"
        aria-hidden="true"
      />

      {label && (
        <span className="text-sm">
          {
            label
          }
        </span>
      )}
    </div>
  );
}