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
  PackagePlus,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";

import {
  adminApi,
} from "../../services/api/admin.js";

import {
  clinicAdminApi,
} from "../../services/api/clinicAdmin.js";

import {
  AdminModal,
  DataTable,
  EmptyBlock,
  InputField,
  LoadingBlock,
  MetricStrip,
  Notice,
  PageHeader,
  Panel,
  PrimaryButton,
  SearchField,
  SecondaryButton,
  SelectField,
  StatusBadge,
} from "../../components/admin/AdminPrimitives.jsx";

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

function safeArray(
  value
) {
  return Array.isArray(
    value
  )
    ? value
    : [];
}

function number(
  value
) {
  return Number(
    value ||
      0
  ).toLocaleString(
    "en-ZA"
  );
}

function stockStatus(
  item
) {
  if (
    item?.isActive ===
    false
  ) {
    return "Inactive";
  }

  if (
    item?.isLowStock
  ) {
    return "Low stock";
  }

  return "Healthy";
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

          setError(
            ""
          );

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
          err
        ) {
          setError(
            err?.message ||
            "Could not load medication inventory."
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
          active:
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

          inactive:
            items.filter(
              item =>
                item.isActive ===
                false
            ).length,
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
            const searchable =
              [
                item.medicationName,
                item.strength,
                item.form,
                item.unit,
              ]
                .filter(
                  Boolean
                )
                .join(
                  " "
                )
                .toLowerCase();

            const matchesSearch =
              !term ||
              searchable.includes(
                term
              );

            const matchesForm =
              formFilter ===
                "All" ||
              item.form ===
                formFilter;

            const matchesStatus =
              statusFilter ===
                "All" ||
              stockStatus(
                item
              ) ===
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

      setShowIntake(
        false
      );

      setSuccess(
        "Medication added to clinic inventory."
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

      setError(
        ""
      );

      setSuccess(
        ""
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
        "Could not update inventory item."
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
      quantity <=
        0
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

      setSuccess(
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

  const columns = [
    {
      key:
        "medicationName",

      label:
        "Medication",

      render:
        (
          value,
          row
        ) => (
          <div>
            <p className="font-semibold text-slate-900">
              {value ||
                "—"}
            </p>

            <p className="mt-0.5 text-[11px] text-slate-400">
              {[
                row.strength,
                row.form,
              ]
                .filter(
                  Boolean
                )
                .join(
                  " · "
                ) ||
                "No strength/form"}
            </p>
          </div>
        ),
    },
    {
      key:
        "form",

      label:
        "Form",
    },
    {
      key:
        "quantityOnHand",

      label:
        "On hand",

      render:
        (
          value,
          row
        ) => (
          <span className="font-semibold text-slate-950">
            {number(
              value
            )}{" "}
            {row.unit ||
              ""}
          </span>
        ),
    },
    {
      key:
        "reorderLevel",

      label:
        "Reorder level",

      render:
        (
          value,
          row
        ) => (
          <span>
            {number(
              value
            )}{" "}
            {row.unit ||
              ""}
          </span>
        ),
    },
    {
      key:
        "status",

      label:
        "Status",

      render:
        (
          _,
          row
        ) => (
          <StatusBadge
            value={
              stockStatus(
                row
              )
            }
          />
        ),
    },
    {
      key:
        "actions",

      label:
        "Actions",

      render:
        (
          _,
          row
        ) => (
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={
                () =>
                  setAdjustment({
                    item:
                      row,

                    direction:
                      "add",

                    quantity:
                      "",

                    reason:
                      "",
                  })
              }
              className="text-[11px] font-medium text-[#0f766e] hover:underline"
            >
              Add stock
            </button>

            <button
              type="button"
              onClick={
                () =>
                  setAdjustment({
                    item:
                      row,

                    direction:
                      "remove",

                    quantity:
                      "",

                    reason:
                      "",
                  })
              }
              className="text-[11px] font-medium text-amber-700 hover:underline"
            >
              Remove
            </button>

            <button
              type="button"
              onClick={
                () =>
                  setEditing({
                    ...row,
                  })
              }
              className="text-[11px] font-medium text-slate-600 hover:underline"
            >
              Edit
            </button>
          </div>
        ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Clinic operations"
        title="Inventory"
        description={`${profile?.clinicName || "Clinic"} medication stock, intake, reorder thresholds and quantity control.`}
        actions={
          <>
            <SecondaryButton
              onClick={
                load
              }
              disabled={
                loading
              }
            >
              <RefreshCw
                size={15}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </SecondaryButton>

            <PrimaryButton
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
            >
              <Plus
                size={15}
              />

              Intake medication
            </PrimaryButton>
          </>
        }
      />

      {error ? (
        <Notice type="error">
          {error}
        </Notice>
      ) : null}

      {success ? (
        <Notice type="success">
          {success}
        </Notice>
      ) : null}

      <MetricStrip
        metrics={[
          {
            label:
              "Active stock items",

            value:
              number(
                summary.active
              ),

            helper:
              "Medication lines currently in use",

            icon:
              Boxes,
          },
          {
            label:
              "Low stock",

            value:
              number(
                summary.low
              ),

            helper:
              "At or below reorder level",

            icon:
              AlertTriangle,
          },
          {
            label:
              "Units on hand",

            value:
              number(
                summary.units
              ),

            helper:
              "Across active stock items",

            icon:
              CheckCircle2,
          },
          {
            label:
              "Inactive items",

            value:
              number(
                summary.inactive
              ),

            helper:
              "Retained for history",

            icon:
              Boxes,
          },
        ]}
      />

      <Panel
        title="Inventory list"
        description="Search and filter the clinic's current medication stock."
        noPadding
      >
        <div className="grid gap-3 border-b border-slate-200 px-5 py-4 lg:grid-cols-[minmax(260px,1.4fr)_180px_180px_auto] lg:items-end">
          <div>
            <span className="mb-1.5 block text-[11px] font-medium text-slate-600">
              Search
            </span>

            <SearchField
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
              placeholder="Medication, strength, form or unit…"
            />
          </div>

          <SelectField
            label="Form"
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
            options={
              forms
            }
          />

          <SelectField
            label="Stock status"
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
            options={[
              "All",
              "Healthy",
              "Low stock",
              "Inactive",
            ]}
          />

          <div className="flex h-10 items-center justify-center border border-slate-300 bg-slate-50 px-4 text-xs font-medium text-slate-600">
            {visible.length.toLocaleString(
              "en-ZA"
            )}{" "}
            result
            {visible.length ===
            1
              ? ""
              : "s"}
          </div>
        </div>

        {loading ? (
          <LoadingBlock
            label="Loading medication inventory…"
            minHeight={
              320
            }
          />
        ) : visible.length ? (
          <DataTable
            columns={
              columns
            }
            rows={
              visible
            }
            rowKey={
              row =>
                row.id
            }
            maxHeight={
              640
            }
          />
        ) : (
          <div className="p-5">
            <EmptyBlock
              icon={
                Search
              }
              title="No matching stock items"
              description="Change the filters or add a medication through Intake medication."
            />
          </div>
        )}
      </Panel>

      {showIntake ? (
        <AdminModal
          title="Medication intake"
          description="Create a new medication stock line for this clinic."
          onClose={
            () =>
              !pending &&
              setShowIntake(
                false
              )
          }
          width="max-w-2xl"
        >
          <form
            onSubmit={
              createItem
            }
            className="grid gap-4 p-5 sm:grid-cols-2"
          >
            <InputField
              label="Medication name"
              value={
                form.medicationName
              }
              onChange={
                event =>
                  updateForm(
                    "medicationName",
                    event.target
                      .value
                  )
              }
              placeholder="e.g. Metformin"
              required
            />

            <InputField
              label="Strength"
              value={
                form.strength
              }
              onChange={
                event =>
                  updateForm(
                    "strength",
                    event.target
                      .value
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
                event =>
                  updateForm(
                    "form",
                    event.target
                      .value
                  )
              }
              options={[
                "Tablet",
                "Capsule",
                "Liquid",
                "Injection",
                "Cream",
                "Inhaler",
                "Other",
              ]}
            />

            <InputField
              label="Unit"
              value={
                form.unit
              }
              onChange={
                event =>
                  updateForm(
                    "unit",
                    event.target
                      .value
                  )
              }
              placeholder="tablets, bottles, packs…"
              required
            />

            <InputField
              label="Opening quantity"
              type="number"
              min="0"
              value={
                form.quantityOnHand
              }
              onChange={
                event =>
                  updateForm(
                    "quantityOnHand",
                    event.target
                      .value
                  )
              }
              required
            />

            <InputField
              label="Reorder level"
              type="number"
              min="0"
              value={
                form.reorderLevel
              }
              onChange={
                event =>
                  updateForm(
                    "reorderLevel",
                    event.target
                      .value
                  )
              }
              required
            />

            <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:col-span-2 sm:flex-row sm:justify-end">
              <SecondaryButton
                type="button"
                onClick={
                  () =>
                    setShowIntake(
                      false
                    )
                }
                disabled={
                  pending
                }
              >
                Cancel
              </SecondaryButton>

              <PrimaryButton
                type="submit"
                disabled={
                  pending
                }
              >
                <PackagePlus
                  size={15}
                />

                {pending
                  ? "Saving…"
                  : "Add to inventory"}
              </PrimaryButton>
            </div>
          </form>
        </AdminModal>
      ) : null}

      {editing ? (
        <AdminModal
          title="Edit stock item"
          description={`${editing.medicationName || "Medication"} ${editing.strength || ""}`.trim()}
          onClose={
            () =>
              !pending &&
              setEditing(
                null
              )
          }
        >
          <form
            onSubmit={
              saveEdit
            }
            className="space-y-4 p-5"
          >
            <InputField
              label="Quantity on hand"
              type="number"
              min="0"
              value={
                editing.quantityOnHand
              }
              onChange={
                event =>
                  setEditing(
                    current => ({
                      ...current,

                      quantityOnHand:
                        event.target
                          .value,
                    })
                  )
              }
              required
            />

            <InputField
              label="Reorder level"
              type="number"
              min="0"
              value={
                editing.reorderLevel
              }
              onChange={
                event =>
                  setEditing(
                    current => ({
                      ...current,

                      reorderLevel:
                        event.target
                          .value,
                    })
                  )
              }
              required
            />

            <label className="flex items-center justify-between border border-slate-200 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Active inventory item
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  Inactive items remain in historical reporting.
                </p>
              </div>

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
                className="h-4 w-4 accent-[#0f766e]"
              />
            </label>

            <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
              <SecondaryButton
                type="button"
                onClick={
                  () =>
                    setEditing(
                      null
                    )
                }
                disabled={
                  pending
                }
              >
                Cancel
              </SecondaryButton>

              <PrimaryButton
                type="submit"
                disabled={
                  pending
                }
              >
                <Edit3
                  size={15}
                />

                {pending
                  ? "Saving…"
                  : "Save changes"}
              </PrimaryButton>
            </div>
          </form>
        </AdminModal>
      ) : null}

      {adjustment ? (
        <AdminModal
          title={
            adjustment.direction ===
            "remove"
              ? "Remove stock"
              : "Add stock"
          }
          description={`${adjustment.item.medicationName || "Medication"} · ${number(
            adjustment.item.quantityOnHand
          )} ${adjustment.item.unit || ""} currently on hand`}
          onClose={
            () =>
              !pending &&
              setAdjustment(
                null
              )
          }
        >
          <form
            onSubmit={
              saveAdjustment
            }
            className="space-y-4 p-5"
          >
            <InputField
              label="Quantity"
              type="number"
              min="1"
              value={
                adjustment.quantity
              }
              onChange={
                event =>
                  setAdjustment(
                    current => ({
                      ...current,

                      quantity:
                        event.target
                          .value,
                    })
                  )
              }
              required
            />

            <InputField
              label="Reason (optional)"
              value={
                adjustment.reason
              }
              onChange={
                event =>
                  setAdjustment(
                    current => ({
                      ...current,

                      reason:
                        event.target
                          .value,
                    })
                  )
              }
              placeholder="Delivery, damaged stock, issue correction…"
            />

            {adjustment.direction ===
            "remove" ? (
              <Notice type="warning">
                Removing stock decreases the quantity on hand immediately. Enter the reason when this is a correction or loss.
              </Notice>
            ) : null}

            <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
              <SecondaryButton
                type="button"
                onClick={
                  () =>
                    setAdjustment(
                      null
                    )
                }
                disabled={
                  pending
                }
              >
                Cancel
              </SecondaryButton>

              <PrimaryButton
                type="submit"
                disabled={
                  pending
                }
              >
                {adjustment.direction ===
                "remove" ? (
                  <Minus
                    size={15}
                  />
                ) : (
                  <Plus
                    size={15}
                  />
                )}

                {pending
                  ? "Updating…"
                  : adjustment.direction ===
                      "remove"
                    ? "Remove stock"
                    : "Add stock"}
              </PrimaryButton>
            </div>
          </form>
        </AdminModal>
      ) : null}
    </div>
  );
}
