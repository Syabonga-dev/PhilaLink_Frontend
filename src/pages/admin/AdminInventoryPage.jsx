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
  Filter,
  Minus,
  PackagePlus,
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

function safeArray(value) {
  return Array.isArray(value)
    ? value
    : [];
}

function number(value) {
  return Number(value || 0)
    .toLocaleString("en-ZA");
}

function Modal({
  title,
  subtitle,
  onClose,
  children,
}) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4">
          <div>
            <h2 className="text-base font-black text-slate-950">
              {title}
            </h2>

            {subtitle && (
              <p className="mt-1 text-xs text-slate-400">
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X
              size={18}
            />
          </button>
        </div>

        {children}
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
      <span className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-slate-500">
        {label}
      </span>

      <input
        type={type}
        min={min}
        required={
          required
        }
        value={
          value ?? ""
        }
        placeholder={
          placeholder
        }
        onChange={
          event =>
            onChange(
              event.target
                .value
            )
        }
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-teal-50"
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
      <span className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-slate-500">
        {label}
      </span>

      <select
        value={
          value
        }
        onChange={
          event =>
            onChange(
              event.target
                .value
            )
        }
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none transition focus:border-[#0f766e]"
      >
        {options.map(
          option => (
            <option
              key={
                option
              }
              value={
                option
              }
            >
              {option}
            </option>
          )
        )}
      </select>
    </label>
  );
}

function StockStatus({
  item,
}) {
  if (
    item.isActive ===
    false
  ) {
    return (
      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-500">
        Inactive
      </span>
    );
  }

  if (
    item.isLowStock
  ) {
    return (
      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-black text-amber-700">
        Low stock
      </span>
    );
  }

  return (
    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black text-emerald-700">
      Healthy
    </span>
  );
}

function InventoryKpi({
  label,
  value,
  icon:
    Icon,
  tone =
    "teal",
}) {
  const styles = {
    teal:
      "bg-teal-50 text-teal-700",
    amber:
      "bg-amber-50 text-amber-700",
    emerald:
      "bg-emerald-50 text-emerald-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_6px_24px_rgba(15,23,42,0.035)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            {number(
              value
            )}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            styles[tone] ||
            styles.teal
          }`}
        >
          <Icon
            size={18}
          />
        </div>
      </div>
    </div>
  );
}

export default function AdminInventoryPage() {
  const [
    profile,
    setProfile,
  ] =
    useState(null);

  const [
    items,
    setItems,
  ] =
    useState([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    success,
    setSuccess,
  ] =
    useState("");

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    formFilter,
    setFormFilter,
  ] =
    useState("All");

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState("All");

  const [
    showIntake,
    setShowIntake,
  ] =
    useState(false);

  const [
    form,
    setForm,
  ] =
    useState(
      EMPTY_FORM
    );

  const [
    pending,
    setPending,
  ] =
    useState(false);

  const [
    editing,
    setEditing,
  ] =
    useState(null);

  const [
    adjustment,
    setAdjustment,
  ] =
    useState(null);

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
              adminApi
                .getMe(),

              clinicAdminApi
                .getStock(),
            ]);

          setProfile(
            me
          );

          setItems(
            safeArray(
              stock
            )
          );
        } catch (
          loadError
        ) {
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

  useEffect(
    () => {
      void load();
    },
    [
      load,
    ]
  );

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
      [
        items,
      ]
    );

  const forms =
    useMemo(
      () => [
        "All",
        ...new Set(
          items
            .map(
              item =>
                item.form
            )
            .filter(
              Boolean
            )
        ),
      ],
      [
        items,
      ]
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
                .filter(
                  Boolean
                )
                .join(" ")
                .toLowerCase()
                .includes(
                  term
                );

            const matchesForm =
              formFilter ===
                "All" ||
              item.form ===
                formFilter;

            const status =
              item.isActive ===
              false
                ? "Inactive"
                : item.isLowStock
                  ? "Low"
                  : "Healthy";

            const matchesStatus =
              statusFilter ===
                "All" ||
              status ===
                statusFilter;

            return (
              matchesSearch &&
              matchesForm &&
              matchesStatus
            );
          }
        );
      },
      [
        formFilter,
        items,
        search,
        statusFilter,
      ]
    );

  function updateForm(
    key,
    value
  ) {
    setForm(
      current => ({
        ...current,
        [key]:
          value,
      })
    );
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
        "Medication name is required."
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

      setShowIntake(
        false
      );

      setSuccess(
        "Medication added to clinic inventory."
      );

      await load();
    } catch (
      createError
    ) {
      setError(
        createError?.message ||
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
    } catch (
      saveError
    ) {
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
    } catch (
      adjustError
    ) {
      setError(
        adjustError?.message ||
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
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-400">
        Loading medication inventory…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0f766e]">
            Admin / Inventory
          </p>

          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">
            Inventory List
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            {profile?.clinicName ||
              "Clinic"}{" "}
            medication stock, intake and quantity control.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={load}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
            title="Refresh inventory"
          >
            <RefreshCw
              size={16}
            />
          </button>

          <button
            type="button"
            onClick={
              () => {
                setForm(
                  EMPTY_FORM
                );

                setShowIntake(
                  true
                );
              }
            }
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0f766e] px-4 text-xs font-black text-white transition hover:bg-[#115e59]"
          >
            <Plus
              size={15}
            />

            Intake
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
          <CheckCircle2
            size={16}
          />

          {success}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        <InventoryKpi
          label="Active Items"
          value={
            summary.total
          }
          icon={Boxes}
        />

        <InventoryKpi
          label="Low Stock"
          value={
            summary.low
          }
          icon={AlertTriangle}
          tone={
            summary.low > 0
              ? "amber"
              : "emerald"
          }
        />

        <InventoryKpi
          label="Units on Hand"
          value={
            summary.units
          }
          icon={CheckCircle2}
          tone="emerald"
        />
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_6px_24px_rgba(15,23,42,0.035)]">
        <div className="border-b border-slate-200 bg-[#fbfcfd] p-4">
          <div className="grid gap-3 lg:grid-cols-[minmax(260px,1.4fr)_minmax(160px,0.7fr)_minmax(160px,0.7fr)_auto] lg:items-end">
            <label>
              <span className="mb-1.5 block text-[9px] font-black uppercase tracking-wider text-slate-400">
                Product Name
              </span>

              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={
                    search
                  }
                  onChange={
                    event =>
                      setSearch(
                        event.target
                          .value
                      )
                  }
                  placeholder="Search medication..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none transition focus:border-[#0f766e]"
                />
              </div>
            </label>

            <label>
              <span className="mb-1.5 block text-[9px] font-black uppercase tracking-wider text-slate-400">
                Form
              </span>

              <select
                value={
                  formFilter
                }
                onChange={
                  event =>
                    setFormFilter(
                      event.target
                        .value
                    )
                }
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 outline-none focus:border-[#0f766e]"
              >
                {forms.map(
                  value => (
                    <option
                      key={
                        value
                      }
                      value={
                        value
                      }
                    >
                      {value}
                    </option>
                  )
                )}
              </select>
            </label>

            <label>
              <span className="mb-1.5 block text-[9px] font-black uppercase tracking-wider text-slate-400">
                Stock Status
              </span>

              <select
                value={
                  statusFilter
                }
                onChange={
                  event =>
                    setStatusFilter(
                      event.target
                        .value
                    )
                }
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 outline-none focus:border-[#0f766e]"
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
            </label>

            <div className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0f172a] px-4 text-xs font-black text-white">
              <Filter
                size={14}
              />

              {visible.length} results
            </div>
          </div>
        </div>

        {visible.length ===
        0 ? (
          <div className="p-14 text-center">
            <Boxes
              size={30}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 text-sm font-black text-slate-800">
              No matching stock items
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Change the filters or add a medication through Intake.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[930px] text-left">
              <thead className="border-b border-slate-200 bg-white text-[9px] uppercase tracking-[0.1em] text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-black">
                    Product Name
                  </th>

                  <th className="px-4 py-3 font-black">
                    Strength
                  </th>

                  <th className="px-4 py-3 font-black">
                    Form
                  </th>

                  <th className="px-4 py-3 font-black">
                    Quantity
                  </th>

                  <th className="px-4 py-3 font-black">
                    Reorder
                  </th>

                  <th className="px-4 py-3 font-black">
                    Status
                  </th>

                  <th className="px-4 py-3 text-right font-black">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {visible.map(
                  item => (
                    <tr
                      key={
                        item.id
                      }
                      className="transition hover:bg-teal-50/30"
                    >
                      <td className="px-4 py-3">
                        <p className="text-xs font-black text-slate-900">
                          {item.medicationName}
                        </p>

                        <p className="mt-0.5 text-[10px] text-slate-400">
                          Clinic inventory
                        </p>
                      </td>

                      <td className="px-4 py-3 text-xs font-semibold text-slate-600">
                        {item.strength ||
                          "—"}
                      </td>

                      <td className="px-4 py-3 text-xs text-slate-600">
                        {item.form ||
                          "—"}
                      </td>

                      <td className="px-4 py-3">
                        <span className="text-sm font-black text-slate-950">
                          {number(
                            item.quantityOnHand
                          )}
                        </span>{" "}

                        <span className="text-[10px] text-slate-400">
                          {item.unit}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-xs font-semibold text-slate-600">
                        {number(
                          item.reorderLevel
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <StockStatus
                          item={
                            item
                          }
                        />
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={
                              () =>
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
                            className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2.5 text-[10px] font-black text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                          >
                            <Plus
                              size={12}
                            />

                            Receive
                          </button>

                          <button
                            type="button"
                            onClick={
                              () =>
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
                            className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2.5 text-[10px] font-black text-slate-600 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                          >
                            <Minus
                              size={12}
                            />

                            Issue
                          </button>

                          <button
                            type="button"
                            onClick={
                              () =>
                                setEditing({
                                  ...item,
                                })
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                            title="Edit item"
                          >
                            <Edit3
                              size={13}
                            />
                          </button>
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

      {showIntake && (
        <Modal
          title="Medication Intake"
          subtitle={`Add medication stock to ${
            profile?.clinicName ||
            "your clinic"
          }.`}
          onClose={
            () =>
              setShowIntake(
                false
              )
          }
        >
          <form
            onSubmit={
              createItem
            }
            className="grid lg:grid-cols-[minmax(0,1.45fr)_minmax(260px,0.75fr)]"
          >
            <div className="space-y-6 p-5">
              <section>
                <div className="mb-4 border-b border-slate-100 pb-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#0f766e]">
                    Product Description
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Medication identity and formulation.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Medication Name"
                    value={
                      form.medicationName
                    }
                    onChange={
                      value =>
                        updateForm(
                          "medicationName",
                          value
                        )
                    }
                    required
                    placeholder="e.g. Paracetamol"
                  />

                  <Field
                    label="Strength"
                    value={
                      form.strength
                    }
                    onChange={
                      value =>
                        updateForm(
                          "strength",
                          value
                        )
                    }
                    placeholder="e.g. 500 mg"
                  />

                  <SelectField
                    label="Form"
                    value={
                      form.form
                    }
                    onChange={
                      value =>
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
                      "Drops",
                      "Other",
                    ]}
                  />

                  <Field
                    label="Unit"
                    value={
                      form.unit
                    }
                    onChange={
                      value =>
                        updateForm(
                          "unit",
                          value
                        )
                    }
                    placeholder="tablets, bottles..."
                  />
                </div>
              </section>

              <section>
                <div className="mb-4 border-b border-slate-100 pb-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#0f766e]">
                    Quantity
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Opening quantity and reorder threshold.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Opening Quantity"
                    type="number"
                    min="0"
                    value={
                      form.quantityOnHand
                    }
                    onChange={
                      value =>
                        updateForm(
                          "quantityOnHand",
                          value
                        )
                    }
                  />

                  <Field
                    label="Reorder Level"
                    type="number"
                    min="0"
                    value={
                      form.reorderLevel
                    }
                    onChange={
                      value =>
                        updateForm(
                          "reorderLevel",
                          value
                        )
                    }
                  />
                </div>
              </section>

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={
                    () =>
                      setShowIntake(
                        false
                      )
                  }
                  className="h-10 rounded-xl border border-slate-200 px-4 text-xs font-black text-slate-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    pending
                  }
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-5 text-xs font-black text-white transition hover:bg-[#115e59] disabled:opacity-50"
                >
                  <PackagePlus
                    size={14}
                  />

                  {pending
                    ? "Saving…"
                    : "Add to inventory"}
                </button>
              </div>
            </div>

            <aside className="border-t border-slate-200 bg-[#f8fafc] p-5 lg:border-l lg:border-t-0">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                Intake Preview
              </p>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <Boxes
                    size={34}
                  />
                </div>

                <h3 className="mt-4 text-center text-base font-black text-slate-950">
                  {form.medicationName ||
                    "Medication"}
                </h3>

                <p className="mt-1 text-center text-xs text-slate-400">
                  {[
                    form.strength,
                    form.form,
                  ]
                    .filter(
                      Boolean
                    )
                    .join(" · ") ||
                    "Enter medication details"}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-slate-50 p-3 text-center">
                    <p className="text-[9px] font-black uppercase tracking-wide text-slate-400">
                      Opening
                    </p>

                    <p className="mt-1 text-xl font-black text-slate-950">
                      {number(
                        form.quantityOnHand
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 text-center">
                    <p className="text-[9px] font-black uppercase tracking-wide text-slate-400">
                      Reorder
                    </p>

                    <p className="mt-1 text-xl font-black text-slate-950">
                      {number(
                        form.reorderLevel
                      )}
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-center text-[10px] text-slate-400">
                  {form.unit ||
                    "units"}
                </p>
              </div>
            </aside>
          </form>
        </Modal>
      )}

      {editing && (
        <Modal
          title="Edit Inventory Item"
          subtitle={
            editing.medicationName
          }
          onClose={
            () =>
              setEditing(
                null
              )
          }
        >
          <form
            onSubmit={
              saveEdit
            }
            className="space-y-5 p-5"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Quantity on Hand"
                type="number"
                min="0"
                value={
                  editing.quantityOnHand
                }
                onChange={
                  value =>
                    setEditing(
                      current => ({
                        ...current,

                        quantityOnHand:
                          value,
                      })
                    )
                }
              />

              <Field
                label="Reorder Level"
                type="number"
                min="0"
                value={
                  editing.reorderLevel
                }
                onChange={
                  value =>
                    setEditing(
                      current => ({
                        ...current,

                        reorderLevel:
                          value,
                      })
                    )
                }
              />
            </div>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={
                  editing.isActive !==
                  false
                }
                onChange={
                  event =>
                    setEditing(
                      current => ({
                        ...current,

                        isActive:
                          event.target
                            .checked,
                      })
                    )
                }
              />

              Active inventory item
            </label>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={
                  () =>
                    setEditing(
                      null
                    )
                }
                className="h-10 rounded-xl border border-slate-200 px-4 text-xs font-black text-slate-600"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  pending
                }
                className="h-10 rounded-xl bg-[#0f766e] px-5 text-xs font-black text-white disabled:opacity-50"
              >
                {pending
                  ? "Saving…"
                  : "Save changes"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {adjustment && (
        <Modal
          title={
            adjustment.direction ===
            "add"
              ? "Receive Stock"
              : "Issue Stock"
          }
          subtitle={
            adjustment.item
              .medicationName
          }
          onClose={
            () =>
              setAdjustment(
                null
              )
          }
        >
          <form
            onSubmit={
              saveAdjustment
            }
            className="space-y-5 p-5"
          >
            <div className="rounded-xl bg-teal-50 p-4">
              <p className="text-[9px] font-black uppercase tracking-wider text-teal-700">
                Current stock
              </p>

              <p className="mt-1 text-2xl font-black text-slate-950">
                {number(
                  adjustment.item
                    .quantityOnHand
                )}{" "}
                <span className="text-xs font-semibold text-slate-500">
                  {adjustment.item
                    .unit}
                </span>
              </p>
            </div>

            <Field
              label="Quantity"
              type="number"
              min="1"
              required
              value={
                adjustment.quantity
              }
              onChange={
                value =>
                  setAdjustment(
                    current => ({
                      ...current,

                      quantity:
                        value,
                    })
                  )
              }
            />

            <Field
              label="Reason"
              placeholder="Delivery, dispensing, correction..."
              value={
                adjustment.reason
              }
              onChange={
                value =>
                  setAdjustment(
                    current => ({
                      ...current,

                      reason:
                        value,
                    })
                  )
              }
            />

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={
                  () =>
                    setAdjustment(
                      null
                    )
                }
                className="h-10 rounded-xl border border-slate-200 px-4 text-xs font-black text-slate-600"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  pending
                }
                className="h-10 rounded-xl bg-[#0f766e] px-5 text-xs font-black text-white disabled:opacity-50"
              >
                {pending
                  ? "Saving…"
                  : adjustment.direction ===
                    "add"
                    ? "Receive stock"
                    : "Issue stock"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
