import { Search, X } from "lucide-react";

export function PageHeader({
  eyebrow,
  title,
  description,
  meta,
  actions,
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0f766e]">
            {eyebrow}
          </p>
        ) : null}

        <h1 className="mt-1 text-[28px] font-semibold tracking-[-0.02em] text-slate-950 sm:text-[32px]">
          {title}
        </h1>

        {description ? (
          <p className="mt-1.5 max-w-4xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        ) : null}

        {meta ? (
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
            {meta}
          </div>
        ) : null}
      </div>

      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      ) : null}
    </header>
  );
}

export function Panel({
  children,
  className = "",
  title,
  description,
  actions,
  noPadding = false,
}) {
  return (
    <section
      className={`border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)] ${className}`}
    >
      {title || description || actions ? (
        <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title ? (
              <h2 className="text-sm font-semibold text-slate-950">
                {title}
              </h2>
            ) : null}

            {description ? (
              <p className="mt-0.5 text-xs leading-5 text-slate-500">
                {description}
              </p>
            ) : null}
          </div>

          {actions ? (
            <div className="flex flex-wrap items-center gap-2">
              {actions}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className={noPadding ? "" : "p-5"}>
        {children}
      </div>
    </section>
  );
}

export function MetricStrip({
  metrics = [],
}) {
  if (!metrics.length) {
    return null;
  }

  return (
    <div className="grid border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map(
        (metric, index) => {
          const Icon =
            metric.icon;

          return (
            <div
              key={metric.label}
              className={`min-w-0 px-5 py-4 ${
                index > 0
                  ? "border-t border-slate-200 sm:border-t-0"
                  : ""
              } ${
                index % 2 === 1
                  ? "sm:border-l"
                  : ""
              } ${
                index >= 2
                  ? "xl:border-l"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-medium text-slate-500">
                    {metric.label}
                  </p>

                  <p className="mt-1 text-2xl font-semibold tracking-[-0.02em] text-slate-950">
                    {metric.value}
                  </p>

                  {metric.helper ? (
                    <p className="mt-1 truncate text-[11px] text-slate-400">
                      {metric.helper}
                    </p>
                  ) : null}
                </div>

                {Icon ? (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-slate-200 bg-slate-50 text-slate-500">
                    <Icon
                      size={15}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}

export function FieldLabel({
  children,
}) {
  return (
    <span className="mb-1.5 block text-[11px] font-medium text-slate-600">
      {children}
    </span>
  );
}

export function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
  min,
  max,
  inputMode,
  maxLength,
  error,
  disabled = false,
}) {
  return (
    <label className="block min-w-0">
      {label ? (
        <FieldLabel>
          {label}
        </FieldLabel>
      ) : null}

      <input
        type={type}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        inputMode={inputMode}
        maxLength={maxLength}
        disabled={disabled}
        className={`h-10 w-full border bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e]/20 disabled:bg-slate-100 disabled:text-slate-400 ${
          error
            ? "border-red-300"
            : "border-slate-300"
        }`}
      />

      {error ? (
        <span className="mt-1 block text-[11px] text-red-600">
          {error}
        </span>
      ) : null}
    </label>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  children,
  error,
  disabled = false,
}) {
  return (
    <label className="block min-w-0">
      {label ? (
        <FieldLabel>
          {label}
        </FieldLabel>
      ) : null}

      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`h-10 w-full border bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e]/20 disabled:bg-slate-100 disabled:text-slate-400 ${
          error
            ? "border-red-300"
            : "border-slate-300"
        }`}
      >
        {children ||
          (options || []).map(
            option => {
              const item =
                typeof option ===
                "string"
                  ? {
                      value:
                        option,
                      label:
                        option,
                    }
                  : option;

              return (
                <option
                  key={
                    item.value
                  }
                  value={
                    item.value
                  }
                >
                  {
                    item.label
                  }
                </option>
              );
            }
          )}
      </select>

      {error ? (
        <span className="mt-1 block text-[11px] text-red-600">
          {error}
        </span>
      ) : null}
    </label>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder = "Search…",
}) {
  return (
    <div className="relative">
      <Search
        size={15}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-10 w-full border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-800 outline-none transition focus:border-[#0f766e] focus:ring-1 focus:ring-[#0f766e]/20"
      />
    </div>
  );
}

export function StatusBadge({
  value,
}) {
  const status =
    String(
      value || ""
    ).toLowerCase();

  let classes =
    "border-slate-200 bg-slate-50 text-slate-600";

  if (
    status.includes(
      "active"
    ) ||
    status.includes(
      "completed"
    ) ||
    status.includes(
      "collected"
    ) ||
    status.includes(
      "taken"
    ) ||
    status.includes(
      "healthy"
    ) ||
    status.includes(
      "confirmed"
    )
  ) {
    classes =
      "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (
    status.includes(
      "pending"
    ) ||
    status.includes(
      "scheduled"
    ) ||
    status.includes(
      "low stock"
    ) ||
    status.includes(
      "due"
    )
  ) {
    classes =
      "border-amber-200 bg-amber-50 text-amber-800";
  }

  if (
    status.includes(
      "missed"
    ) ||
    status.includes(
      "overdue"
    ) ||
    status.includes(
      "cancel"
    ) ||
    status.includes(
      "inactive"
    )
  ) {
    classes =
      "border-red-200 bg-red-50 text-red-700";
  }

  return (
    <span
      className={`inline-flex whitespace-nowrap border px-2 py-0.5 text-[11px] font-medium ${classes}`}
    >
      {value || "—"}
    </span>
  );
}

export function Notice({
  type = "info",
  children,
}) {
  const styles = {
    info:
      "border-sky-200 bg-sky-50 text-sky-800",

    success:
      "border-emerald-200 bg-emerald-50 text-emerald-800",

    warning:
      "border-amber-200 bg-amber-50 text-amber-900",

    error:
      "border-red-200 bg-red-50 text-red-800",
  };

  return (
    <div
      className={`border px-4 py-3 text-sm ${
        styles[type] ||
        styles.info
      }`}
    >
      {children}
    </div>
  );
}

export function LoadingBlock({
  label = "Loading…",
  minHeight = 220,
}) {
  return (
    <div
      className="flex items-center justify-center border border-slate-200 bg-white text-sm text-slate-500"
      style={{
        minHeight,
      }}
    >
      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-[#0f766e]" />

      {label}
    </div>
  );
}

export function EmptyBlock({
  title,
  description,
  icon:
    Icon,
}) {
  return (
    <div className="border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      {Icon ? (
        <Icon
          size={28}
          className="mx-auto text-slate-300"
        />
      ) : null}

      <p className="mt-3 text-sm font-semibold text-slate-800">
        {title}
      </p>

      {description ? (
        <p className="mx-auto mt-1 max-w-lg text-xs leading-5 text-slate-500">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function AdminModal({
  title,
  description,
  onClose,
  children,
  width =
    "max-w-xl",
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4">
      <div
        className={`max-h-[92vh] w-full overflow-y-auto bg-white shadow-2xl ${width}`}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-950">
              {title}
            </h2>

            {description ? (
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {description}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-8 w-8 shrink-0 items-center justify-center border border-slate-200 text-slate-500 hover:bg-slate-50"
          >
            <X
              size={16}
            />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

export function PrimaryButton({
  className = "",
  children,
  ...props
}) {
  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 bg-[#0f766e] px-4 text-sm font-medium text-white transition hover:bg-[#0b655e] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  className = "",
  children,
  ...props
}) {
  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function DangerButton({
  className = "",
  children,
  ...props
}) {
  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 border border-red-200 bg-white px-4 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function FilterSummary({
  items = [],
  onClear,
}) {
  const visible =
    items.filter(
      item =>
        item.value &&
        item.value !==
          "All"
    );

  if (!visible.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
      <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
        Applied
      </span>

      {visible.map(
        item => (
          <span
            key={`${item.label}-${item.value}`}
            className="border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-600"
          >
            <span className="font-medium text-slate-800">
              {
                item.label
              }:
            </span>{" "}
            {
              item.value
            }
          </span>
        )
      )}

      {onClear ? (
        <button
          type="button"
          onClick={onClear}
          className="ml-auto text-[11px] font-medium text-[#0f766e] hover:underline"
        >
          Clear filters
        </button>
      ) : null}
    </div>
  );
}

export function DataTable({
  columns = [],
  rows = [],
  rowKey,
  maxHeight = 620,
}) {
  return (
    <div
      className="overflow-auto"
      style={{
        maxHeight,
      }}
    >
      <table className="min-w-full border-collapse text-left">
        <thead className="sticky top-0 z-10 bg-slate-900 text-white">
          <tr>
            {columns.map(
              column => (
                <th
                  key={
                    column.key
                  }
                  className="whitespace-nowrap border-r border-slate-700 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.08em] last:border-r-0"
                >
                  {
                    column.label
                  }
                </th>
              )
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200">
          {rows.map(
            (
              row,
              rowIndex
            ) => (
              <tr
                key={
                  rowKey
                    ? rowKey(
                        row,
                        rowIndex
                      )
                    : rowIndex
                }
                className="bg-white transition hover:bg-slate-50"
              >
                {columns.map(
                  column => {
                    const value =
                      row[
                        column.key
                      ];

                    return (
                      <td
                        key={
                          column.key
                        }
                        className="max-w-[340px] px-4 py-3 text-xs text-slate-600"
                      >
                        {column.render
                          ? column.render(
                              value,
                              row
                            )
                          : value ??
                            "—"}
                      </td>
                    );
                  }
                )}
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
