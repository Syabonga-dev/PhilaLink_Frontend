export function Button({
  children,
  variant = "primary",
  iconStart,
  iconEnd,
  className = "",
  type = "button",
  disabled = false,
  ...props
}) {
  const variants = {
    primary:
      "bg-brand-primary text-on-brand hover:bg-brand-hover border border-brand-primary",

    subtle:
      "bg-surface-bg text-text-secondary border border-border-secondary hover:bg-bg-faint hover:text-text-primary",

    neutral:
      "bg-bg-faint text-text-primary border border-border-secondary hover:bg-bg-hover",

    danger:
      "bg-danger text-white border border-danger hover:opacity-90",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`
        inline-flex
        min-h-10
        items-center
        justify-center
        gap-sm
        rounded-corner-md
        px-lg
        py-sm
        text-label-sm
        font-medium
        transition
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variants[variant] || variants.primary}
        ${className}
      `}
      {...props}
    >
      {iconStart && (
        <span className="shrink-0">
          {iconStart}
        </span>
      )}

      <span>{children}</span>

      {iconEnd && (
        <span className="shrink-0">
          {iconEnd}
        </span>
      )}
    </button>
  );
}

export function Input({
  className = "",
  ...props
}) {
  return (
    <input
      className={`
        w-full
        rounded-corner-md
        border
        border-border-secondary
        bg-surface-bg
        px-md
        py-sm
        text-label-sm
        text-text-primary
        outline-none
        transition
        placeholder:text-text-tertiary
        focus:border-brand-primary
        ${className}
      `}
      {...props}
    />
  );
}

export function Avatar({
  src,
  alt = "User",
  fallback,
  name,
  className = "",
  size = "md",
}) {
  const sizeClasses = {
    sm: "h-8 w-8 text-video-title",
    md: "h-10 w-10 text-label-sm",
    lg: "h-12 w-12 text-label",
    xl: "h-16 w-16 text-title",
  };

  const initials =
    fallback ||
    name
      ?.split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ||
    alt
      ?.split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ||
    "P";

  return (
    <div
      className={`
        inline-flex
        shrink-0
        items-center
        justify-center
        overflow-hidden
        rounded-corner-full
        bg-brand-tertiary
        font-semibold
        text-brand-primary
        ${sizeClasses[size] || sizeClasses.md}
        ${className}
      `}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

export function Badge({
  label,
  children,
  variant = "default",
  className = "",
}) {
  const variants = {
    default:
      "bg-bg-faint text-text-secondary",

    success:
      "bg-success/10 text-success",

    warning:
      "bg-warning/10 text-warning",

    danger:
      "bg-danger/10 text-danger",

    primary:
      "bg-brand-tertiary text-brand-primary",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-corner-full
        px-md
        py-xs
        text-video-title
        font-medium
        ${variants[variant] || variants.default}
        ${className}
      `}
    >
      {label || children}
    </span>
  );
}

export function Tooltip({
  content,
  children,
}) {
  return (
    <div className="group relative inline-flex">
      {children}

      {content && (
        <div
          className="
            pointer-events-none
            absolute
            bottom-full
            left-1/2
            z-[100]
            mb-2
            hidden
            -translate-x-1/2
            whitespace-nowrap
            rounded-corner-md
            bg-surface-dark
            px-sm
            py-xs
            text-video-title
            text-text-on-dark
            shadow-figma-md
            group-hover:block
          "
        >
          {content}
        </div>
      )}
    </div>
  );
}

export function IconButton({
  icon,
  children,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`
        inline-flex
        h-9
        w-9
        shrink-0
        items-center
        justify-center
        rounded-corner-md
        text-text-secondary
        transition
        hover:bg-bg-faint
        hover:text-text-primary
        ${className}
      `}
      {...props}
    >
      {icon || children}
    </button>
  );
}

export function Callout({
  title,
  description,
  children,
  className = "",
}) {
  return (
    <div
      className={`
        rounded-corner-lg
        border
        border-border-secondary
        bg-bg-faint
        p-lg
        ${className}
      `}
    >
      {title && (
        <p className="text-label-sm font-semibold text-text-primary">
          {title}
        </p>
      )}

      {description && (
        <p className="mt-xs text-video-title leading-5 text-text-secondary">
          {description}
        </p>
      )}

      {children}
    </div>
  );
}
