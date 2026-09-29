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
    "",

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
    showCreate,
    setShowCreate,
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

          setError(
            ""
          );

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
        } catch (
          err
        ) {
          setError(
            err?.message ||
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

    try {
      setPending(
        true
      );

      setError(
        ""
      );

      setSuccess(
        ""
      );

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
    } catch (
      err
    ) {
      setError(
        err?.message ||
        "Could not create inventory item."
      );
    } finally {
      setPending(
        false
      );
    }
  }

  async function saveEdit() {
    if (!editing) {
      return;
    }

    try {
      setPending(
        true
      );

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
      err
    ) {
      setError(
        err?.message ||
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

      setError(
        ""
      );

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
      err
    ) {
      setError(
        err?.message ||
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

      {/* HEADER */}

      <section className="rounded-[30px] bg-gradient-to-br from-teal-100 via-[#f1fffc] to-white p-6 sm:p-8">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-700">
              {
                profile?.clinicName ||
                "Clinic"
              }
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Medication inventory
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Receive stock, issue stock and control reorder thresholds.
            </p>

          </div>

          <div className="flex gap-2">

            <button
              type="button"
              onClick={
                load
              }
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white bg-white/70 text-slate-600"
            >
              <RefreshCw
                size={16}
              />
            </button>

            <button
              type="button"
              onClick={() =>
                setShowCreate(
                  true
                )
              }
              className="inline-flex items-center gap-2 rounded-2xl bg-[#0f766e] px-4 py-2.5 text-xs font-bold text-white"
            >
              <Plus
                size={15}
              />
              Add medication
            </button>

          </div>

        </div>

      </section>

      {/* MESSAGES */}

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

      {/* SUMMARY */}

      <div className="grid gap-4 sm:grid-cols-3">

        <InventoryStat
          label="Active items"
          value={
            summary.total
          }
          icon={
            Boxes
          }
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

      {/* CREATE */}

      {showCreate && (
        <section className="rounded-[28px] border border-slate-200 bg-white p-5">

          <div className="flex items-center justify-between">

            <h3 className="font-bold text-slate-950">
              Add inventory item
            </h3>

            <button
              type="button"
              onClick={() =>
                setShowCreate(
                  false
                )
              }
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
            >
              <X
                size={17}
              />
            </button>

          </div>

          <form
            onSubmit={
              createItem
            }
            className="mt-5 grid gap-4 md:grid-cols-3"
          >

            <Field
              label="Medication name"
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
            />

            <Field
              label="Form"
              placeholder="Tablet, capsule..."
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
            />

            <Field
              label="Opening quantity"
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
              label="Reorder level"
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

            <div className="md:col-span-3">

              <button
                type="submit"
                disabled={
                  pending
                }
                className="rounded-2xl bg-[#0f766e] px-5 py-2.5 text-xs font-bold text-white disabled:opacity-50"
              >
                {pending
                  ? "Saving…"
                  : "Create item"}
              </button>

            </div>

          </form>

        </section>
      )}

      {/* TABLE */}

      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_15px_45px_rgba(15,23,42,0.04)]">

        {items.length ===
        0 ? (
          <div className="p-12 text-center">

            <Boxes
              size={28}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 text-sm font-bold text-slate-800">
              No stock recorded
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px] text-left text-sm">

              <thead className="bg-[#fafafd] text-[10px] uppercase tracking-[0.1em] text-slate-400">

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
                    Reorder
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

                {items.map(
                  item => (
                    <tr
                      key={
                        item.id
                      }
                      className="hover:bg-slate-50/60"
                    >

                      <td className="px-5 py-4">

                        <p className="text-xs font-bold text-slate-900">
                          {
                            item.medicationName
                          }
                        </p>

                        <p className="mt-1 text-[10px] text-slate-400">
                          {
                            item.strength ||
                            "No strength"
                          }
                        </p>

                      </td>

                      <td className="px-5 py-4 text-xs text-slate-500">
                        {
                          item.form ||
                          "—"
                        }
                      </td>

                      <td className="px-5 py-4">

                        <span className="text-sm font-bold text-slate-950">
                          {
                            item.quantityOnHand
                          }
                        </span>{" "}

                        <span className="text-[10px] text-slate-400">
                          {
                            item.unit
                          }
                        </span>

                      </td>

                      <td className="px-5 py-4 text-xs text-slate-500">
                        {
                          item.reorderLevel
                        }
                      </td>

                      <td className="px-5 py-4">

                        <StockStatus
                          item={
                            item
                          }
                        />

                      </td>

                      <td className="px-5 py-4">

                        <div className="flex gap-2">

                          <SmallButton
                            icon={
                              Plus
                            }
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
                            icon={
                              Minus
                            }
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
                            icon={
                              Edit3
                            }
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

      {/* EDIT */}

      {editing && (
        <section className="rounded-[28px] border border-slate-200 bg-white p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Edit inventory
              </p>

              <h3 className="mt-1 font-bold text-slate-950">
                {
                  editing.medicationName
                }
              </h3>

            </div>

            <button
              type="button"
              onClick={() =>
                setEditing(
                  null
                )
              }
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
            >
              <X
                size={17}
              />
            </button>

          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">

            <Field
              label="Reorder level"
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

            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">

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

              <span className="text-xs font-bold text-slate-700">
                Active inventory item
              </span>

            </label>

          </div>

          <button
            type="button"
            disabled={
              pending
            }
            onClick={
              saveEdit
            }
            className="mt-4 rounded-2xl bg-[#0f766e] px-5 py-2.5 text-xs font-bold text-white disabled:opacity-50"
          >
            Save changes
          </button>

        </section>
      )}

      {/* ADJUST */}

      {adjustment && (
        <section className="rounded-[28px] border border-slate-200 bg-white p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                {adjustment.direction ===
                "add"
                  ? "Receive stock"
                  : "Issue stock"}
              </p>

              <h3 className="mt-1 font-bold text-slate-950">
                {
                  adjustment.item
                    .medicationName
                }
              </h3>

            </div>

            <button
              type="button"
              onClick={() =>
                setAdjustment(
                  null
                )
              }
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
            >
              <X
                size={17}
              />
            </button>

          </div>

          <form
            onSubmit={
              saveAdjustment
            }
            className="mt-4 grid gap-4 sm:grid-cols-2"
          >

            <Field
              label="Quantity"
              type="number"
              min="1"
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
              placeholder="Delivery, correction, issue..."
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

            <div className="sm:col-span-2">

              <button
                type="submit"
                disabled={
                  pending
                }
                className="rounded-2xl bg-[#0f766e] px-5 py-2.5 text-xs font-bold text-white disabled:opacity-50"
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

        </section>
      )}

    </div>
  );
}

/* ========================================================= */
/* SMALL COMPONENTS                                          */
/* ========================================================= */

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
        type={
          type
        }
        min={
          min
        }
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
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
      />

    </label>
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
      onClick={
        onClick
      }
      className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-2.5 py-1.5 text-[10px] font-bold text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
    >
      <Icon
        size={12}
      />
      {label}
    </button>
  );
}