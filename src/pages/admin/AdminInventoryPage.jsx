import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  Edit3,
  Minus,
  Plus,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

import {
  adminApi,
} from "../../services/api/admin.js";

import {
  clinicAdminApi,
} from "../../services/api/clinicAdmin.js";

const EMPTY_FORM = {
  medicationName:
    "",
  strength:
    "",
  form:
    "Tablet",
  unit:
    "tablets",
  quantityOnHand:
    "",
  reorderLevel:
    "",
};

export default function AdminInventoryPage() {
  const [
    profile,
    setProfile,
  ] = useState(null);
  const [
    items,
    setItems,
  ] = useState([]);
  const [
    loading,
    setLoading,
  ] = useState(true);
  const [
    error,
    setError,
  ] = useState("");
  const [
    success,
    setSuccess,
  ] = useState("");
  const [
    search,
    setSearch,
  ] = useState("");
  const [
    statusFilter,
    setStatusFilter,
  ] = useState("All");
  const [
    showCreate,
    setShowCreate,
  ] = useState(false);
  const [
    form,
    setForm,
  ] = useState(
    EMPTY_FORM
  );
  const [
    pending,
    setPending,
  ] = useState(false);
  const [
    editing,
    setEditing,
  ] = useState(null);
  const [
    adjustment,
    setAdjustment,
  ] = useState(null);

  const load =
    useCallback(
      async () => {
        try {
          setLoading(
            true
          );
          setError("");

          const [
            me,
            stock,
          ] =
            await Promise.all([
              adminApi.getMe(),
              clinicAdminApi
                .getStock(),
            ]);

          setProfile(
            me
          );
          setItems(
            Array.isArray(
              stock
            )
              ? stock
              : []
          );
        } catch (loadError) {
          setError(
            loadError?.message ||
              "Could not load inventory."
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      []
    );

  useEffect(() => {
    void load();
  }, [load]);

  const summary =
    useMemo(
      () => {
        const active =
          items.filter(
            item =>
              item.isActive !==
              false
          );

        return {
          total:
            active.length,
          low:
            active.filter(
              item =>
                item.isLowStock
            ).length,
          units:
            active.reduce(
              (
                sum,
                item
              ) =>
                sum +
                Number(
                  item.quantityOnHand ||
                  0
                ),
              0
            ),
        };
      },
      [items]
    );

  const visible =
    useMemo(
      () => {
        const term =
          search
            .trim()
            .toLowerCase();

        return items.filter(
          item => {
            const matchesSearch =
              !term ||
              [
                item.medicationName,
                item.strength,
                item.form,
                item.unit,
              ]
                .filter(Boolean)
                .some(value =>
                  String(value)
                    .toLowerCase()
                    .includes(
                      term
                    )
                );

            let matchesStatus =
              true;

            if (
              statusFilter ===
              "Low"
            ) {
              matchesStatus =
                item.isActive !==
                  false &&
                Boolean(
                  item.isLowStock
                );
            } else if (
              statusFilter ===
              "Healthy"
            ) {
              matchesStatus =
                item.isActive !==
                  false &&
                !item.isLowStock;
            } else if (
              statusFilter ===
              "Inactive"
            ) {
              matchesStatus =
                item.isActive ===
                false;
            }

            return (
              matchesSearch &&
              matchesStatus
            );
          }
        );
      },
      [
        items,
        search,
        statusFilter,
      ]
    );

  function updateForm(
    key,
    value
  ) {
    setForm(current => ({
      ...current,
      [key]:
        value,
    }));
  }

  async function createItem(
    event
  ) {
    event.preventDefault();

    if (
      !profile?.clinicId
    ) {
      setError(
        "Clinic profile is unavailable."
      );
      return;
    }

    if (
      !form.medicationName
        .trim()
    ) {
      setError(
        "Enter a medication name."
      );
      return;
    }

    try {
      setPending(
        true
      );
      setError("");
      setSuccess("");

      await clinicAdminApi
        .createStock({
          clinicId:
            profile.clinicId,
          medicationName:
            form.medicationName
              .trim(),
          strength:
            form.strength
              .trim(),
          form:
            form.form
              .trim(),
          unit:
            form.unit
              .trim(),
          quantityOnHand:
            Number(
              form.quantityOnHand ||
              0
            ),
          reorderLevel:
            Number(
              form.reorderLevel ||
              0
            ),
        });

      setForm(
        EMPTY_FORM
      );
      setShowCreate(
        false
      );
      setSuccess(
        "Inventory item created."
      );
      await load();
    } catch (saveError) {
      setError(
        saveError?.message ||
          "Could not create inventory item."
      );
    } finally {
      setPending(
        false
      );
    }
  }

  async function saveEdit(
    event
  ) {
    event.preventDefault();

    if (!editing) {
      return;
    }

    try {
      setPending(
        true
      );
      setError("");

      await clinicAdminApi
        .updateStock(
          editing.id,
          {
            quantityOnHand:
              Number(
                editing.quantityOnHand ||
                0
              ),
            reorderLevel:
              Number(
                editing.reorderLevel ||
                0
              ),
            isActive:
              editing.isActive !==
              false,
          }
        );

      setEditing(
        null
      );
      setSuccess(
        "Inventory item updated."
      );
      await load();
    } catch (saveError) {
      setError(
        saveError?.message ||
          "Could not update inventory."
      );
    } finally {
      setPending(
        false
      );
    }
  }

  async function saveAdjustment(
    event
  ) {
    event.preventDefault();

    if (!adjustment) {
      return;
    }

    const quantity =
      Number(
        adjustment.quantity
      );

    if (
      !Number.isFinite(
        quantity
      ) ||
      quantity <= 0
    ) {
      setError(
        "Enter a quantity greater than zero."
      );
      return;
    }

    try {
      setPending(
        true
      );
      setError("");

      await clinicAdminApi
        .adjustStock(
          adjustment.item.id,
          {
            quantityChange:
              adjustment.direction ===
              "remove"
                ? -quantity
                : quantity,
            reason:
              adjustment.reason
                .trim() ||
              null,
          }
        );

      setAdjustment(
        null
      );
      setSuccess(
        "Stock quantity updated."
      );
      await load();
    } catch (saveError) {
      setError(
        saveError?.message ||
          "Could not adjust stock."
      );
    } finally {
      setPending(
        false
      );
    }
  }

  if (loading) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-12 text-center text-sm text-slate-400">
        Loading medication inventory…
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[30px] border border-teal-100 bg-gradient-to-br from-teal-100 via-[#f0fdfa] to-white p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-700">
              {profile?.clinicName ||
                "Clinic"}
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Medication inventory
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Search stock, add medication items, receive deliveries and record issued stock.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={load}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white bg-white/80 text-slate-600 shadow-sm"
              title="Refresh inventory"
            >
              <RefreshCw
                size={16}
              />
            </button>

            <button
              type="button"
              onClick={() => {
                setForm(
                  EMPTY_FORM
                );
                setShowCreate(
                  true
                );
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#0f766e] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#115e59]"
            >
              <Plus
                size={15}
              />
              Add medication
            </button>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <CheckCircle2
            size={16}
          />
          {success}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <InventoryStat
          label="Active items"
          value={
            summary.total
          }
          icon={Boxes}
        />
        <InventoryStat
          label="Low stock"
          value={
            summary.low
          }
          icon={
            AlertTriangle
          }
          warning={
            summary.low >
            0
          }
        />
        <InventoryStat
          label="Units on hand"
          value={
            summary.units
          }
          icon={
            CheckCircle2
          }
        />
      </div>

      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_15px_45px_rgba(15,23,42,0.04)]">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative min-w-0 flex-1 sm:max-w-md">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={event =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search medication, strength or form..."
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-teal-50"
            />
          </div>

          <select
            value={
              statusFilter
            }
            onChange={event =>
              setStatusFilter(
                event.target.value
              )
            }
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-600 outline-none focus:border-[#0f766e]"
          >
            <option value="All">
              All stock
            </option>
            <option value="Healthy">
              Healthy
            </option>
            <option value="Low">
              Low stock
            </option>
            <option value="Inactive">
              Inactive
            </option>
          </select>
        </div>

        {visible.length ===
        0 ? (
          <div className="p-12 text-center">
            <Boxes
              size={28}
              className="mx-auto text-slate-300"
            />
            <p className="mt-3 text-sm font-bold text-slate-800">
              No matching stock items
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Change the search/filter or add a medication item.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-[#f8fafc] text-[10px] uppercase tracking-[0.1em] text-slate-400">
                <tr>
                  <th className="px-5 py-4 font-bold">
                    Medication
                  </th>
                  <th className="px-5 py-4 font-bold">
                    Form
                  </th>
                  <th className="px-5 py-4 font-bold">
                    Quantity
                  </th>
                  <th className="px-5 py-4 font-bold">
                    Reorder level
                  </th>
                  <th className="px-5 py-4 font-bold">
                    Status
                  </th>
                  <th className="px-5 py-4 font-bold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {visible.map(
                  item => (
                    <tr
                      key={item.id}
                      className="hover:bg-teal-50/30"
                    >
                      <td className="px-5 py-4">
                        <p className="text-xs font-bold text-slate-900">
                          {item.medicationName}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-400">
                          {item.strength ||
                            "No strength"}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-xs text-slate-500">
                        {item.form ||
                          "—"}
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-slate-950">
                          {item.quantityOnHand}
                        </span>{" "}
                        <span className="text-[10px] text-slate-400">
                          {item.unit}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-xs text-slate-500">
                        {item.reorderLevel}
                      </td>

                      <td className="px-5 py-4">
                        <StockStatus
                          item={item}
                        />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <SmallButton
                            icon={Plus}
                            label="Receive"
                            onClick={() =>
                              setAdjustment({
                                item,
                                direction:
                                  "add",
                                quantity:
                                  "",
                                reason:
                                  "",
                              })
                            }
                          />
                          <SmallButton
                            icon={Minus}
                            label="Issue"
                            onClick={() =>
                              setAdjustment({
                                item,
                                direction:
                                  "remove",
                                quantity:
                                  "",
                                reason:
                                  "",
                              })
                            }
                          />
                          <SmallButton
                            icon={Edit3}
                            label="Edit"
                            onClick={() =>
                              setEditing({
                                ...item,
                              })
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showCreate && (
        <Modal
          title="Add inventory item"
          subtitle="Add medication stock to your assigned clinic."
          onClose={() =>
            setShowCreate(
              false
            )
          }
        >
          <form
            onSubmit={
              createItem
            }
            className="grid gap-4 sm:grid-cols-2"
          >
            <div className="sm:col-span-2 rounded-2xl bg-teal-50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                Clinic
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                {profile?.clinicName ||
                  "Assigned clinic"}
              </p>
            </div>

            <Field
              label="Medication name"
              value={
                form.medicationName
              }
              onChange={value =>
                updateForm(
                  "medicationName",
                  value
                )
              }
              required
            />
            <Field
              label="Strength"
              placeholder="e.g. 500 mg"
              value={
                form.strength
              }
              onChange={value =>
                updateForm(
                  "strength",
                  value
                )
              }
            />

            <SelectField
              label="Form"
              value={form.form}
              onChange={value =>
                updateForm(
                  "form",
                  value
                )
              }
              options={[
                "Tablet",
                "Capsule",
                "Syrup",
                "Injection",
                "Cream",
                "Inhaler",
                "Other",
              ]}
            />

            <Field
              label="Unit"
              placeholder="tablets, bottles..."
              value={form.unit}
              onChange={value =>
                updateForm(
                  "unit",
                  value
                )
              }
            />

            <Field
              label="Opening quantity"
              type="number"
              min="0"
              value={
                form.quantityOnHand
              }
              onChange={value =>
                updateForm(
                  "quantityOnHand",
                  value
                )
              }
            />

            <Field
              label="Reorder level"
              type="number"
              min="0"
              value={
                form.reorderLevel
              }
              onChange={value =>
                updateForm(
                  "reorderLevel",
                  value
                )
              }
            />

            <div className="sm:col-span-2 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() =>
                  setShowCreate(
                    false
                  )
                }
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={pending}
                className="rounded-xl bg-[#0f766e] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#115e59] disabled:opacity-50"
              >
                {pending
                  ? "Saving…"
                  : "Add medication"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {editing && (
        <Modal
          title="Edit inventory item"
          subtitle={
            editing.medicationName
          }
          onClose={() =>
            setEditing(
              null
            )
          }
        >
          <form
            onSubmit={saveEdit}
            className="space-y-4"
          >
            <Field
              label="Quantity on hand"
              type="number"
              min="0"
              value={
                editing.quantityOnHand
              }
              onChange={value =>
                setEditing(current => ({
                  ...current,
                  quantityOnHand:
                    value,
                }))
              }
            />

            <Field
              label="Reorder level"
              type="number"
              min="0"
              value={
                editing.reorderLevel
              }
              onChange={value =>
                setEditing(current => ({
                  ...current,
                  reorderLevel:
                    value,
                }))
              }
            />

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={
                  editing.isActive !==
                  false
                }
                onChange={event =>
                  setEditing(current => ({
                    ...current,
                    isActive:
                      event.target.checked,
                  }))
                }
              />
              Active inventory item
            </label>

            <ModalFooter
              pending={pending}
              onCancel={() =>
                setEditing(
                  null
                )
              }
              label="Save changes"
            />
          </form>
        </Modal>
      )}

      {adjustment && (
        <Modal
          title={
            adjustment.direction ===
            "add"
              ? "Receive stock"
              : "Issue stock"
          }
          subtitle={
            adjustment.item
              .medicationName
          }
          onClose={() =>
            setAdjustment(
              null
            )
          }
        >
          <form
            onSubmit={
              saveAdjustment
            }
            className="space-y-4"
          >
            <Field
              label="Quantity"
              type="number"
              min="1"
              value={
                adjustment.quantity
              }
              onChange={value =>
                setAdjustment(current => ({
                  ...current,
                  quantity:
                    value,
                }))
              }
              required
            />

            <Field
              label="Reason"
              placeholder="Delivery, correction, dispensing..."
              value={
                adjustment.reason
              }
              onChange={value =>
                setAdjustment(current => ({
                  ...current,
                  reason:
                    value,
                }))
              }
            />

            <ModalFooter
              pending={pending}
              onCancel={() =>
                setAdjustment(
                  null
                )
              }
              label={
                adjustment.direction ===
                "add"
                  ? "Receive stock"
                  : "Issue stock"
              }
            />
          </form>
        </Modal>
      )}
    </div>
  );
}

function InventoryStat({
  label,
  value,
  icon:
    Icon,
  warning,
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-950">
            {Number(
              value || 0
            ).toLocaleString(
              "en-ZA"
            )}
          </p>
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
            warning
              ? "bg-amber-50 text-amber-700"
              : "bg-teal-50 text-teal-700"
          }`}
        >
          <Icon
            size={19}
          />
        </div>
      </div>
    </div>
  );
}

function StockStatus({
  item,
}) {
  if (
    !item.isActive
  ) {
    return (
      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
        Inactive
      </span>
    );
  }

  if (
    item.isLowStock
  ) {
    return (
      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-700">
        Low stock
      </span>
    );
  }

  return (
    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
      Healthy
    </span>
  );
}

function SmallButton({
  icon:
    Icon,
  label,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-2.5 py-1.5 text-[10px] font-bold text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
    >
      <Icon
        size={12}
      />
      {label}
    </button>
  );
}

function Modal({
  title,
  subtitle,
  onClose,
  children,
}) {
  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-slate-950/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-5">
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-[28px] bg-white shadow-2xl sm:max-w-3xl sm:rounded-[28px]">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-100 bg-white px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#0f766e]">
              Inventory
            </p>
            <h3 className="mt-1 text-lg font-bold text-slate-950">
              {title}
            </h3>
            {subtitle && (
              <p className="mt-1 text-xs text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
          >
            <X
              size={18}
            />
          </button>
        </div>
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type =
    "text",
  placeholder =
    "",
  min,
  required =
    false,
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </span>
      <input
        type={type}
        min={min}
        required={required}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={event =>
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-teal-50"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </span>
      <select
        value={value}
        onChange={event =>
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-teal-50"
      >
        {options.map(
          option => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          )
        )}
      </select>
    </label>
  );
}

function ModalFooter({
  pending,
  onCancel,
  label,
}) {
  return (
    <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
      <button
        type="button"
        onClick={onCancel}
        disabled={pending}
        className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-[#0f766e] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#115e59] disabled:opacity-50"
      >
        {pending
          ? "Saving…"
          : label}
      </button>
    </div>
  );
}
