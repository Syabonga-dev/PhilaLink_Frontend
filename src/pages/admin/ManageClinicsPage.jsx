import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Building2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";

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

import {
  clinicsApi,
} from "../../services/api/clinics.js";

import {
  superAdminApi,
} from "../../services/api/superAdmin.js";

const EMPTY_FORM = {
  name:
    "",

  type:
    "Clinic",

  address:
    "",

  contactNumber:
    "",

  latitude:
    "",

  longitude:
    "",

  services:
    "",

  openingTime:
    "",

  closingTime:
    "",

  isActive:
    true,
};

function timeValue(
  value
) {
  if (!value) {
    return "";
  }

  return String(
    value
  ).slice(
    0,
    5
  );
}

function displayTime(
  value
) {
  const normalized =
    timeValue(
      value
    );

  return normalized ||
    "—";
}

export default function ManageClinicsPage() {
  const [
    clinics,
    setClinics,
  ] =
    useState([]);

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    status,
    setStatus,
  ] =
    useState("All");

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

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
    modalOpen,
    setModalOpen,
  ] =
    useState(false);

  const [
    editingClinic,
    setEditingClinic,
  ] =
    useState(null);

  const [
    form,
    setForm,
  ] =
    useState(
      EMPTY_FORM
    );

  const [
    errors,
    setErrors,
  ] =
    useState({});

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

          const result =
            await superAdminApi
              .getClinics();

          setClinics(
            Array.isArray(
              result
            )
              ? result
              : []
          );
        } catch (
          err
        ) {
          setError(
            err?.message ||
              "Could not load clinics."
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

  const visible =
    useMemo(
      () => {
        const term =
          search
            .trim()
            .toLowerCase();

        return clinics.filter(
          clinic => {
            if (
              status ===
                "Active" &&
              clinic.isActive ===
                false
            ) {
              return false;
            }

            if (
              status ===
                "Inactive" &&
              clinic.isActive !==
                false
            ) {
              return false;
            }

            if (!term) {
              return true;
            }

            return [
              clinic.name,
              clinic.type,
              clinic.address,
              clinic.contactNumber,
              clinic.services,
            ]
              .filter(
                Boolean
              )
              .some(
                value =>
                  String(
                    value
                  )
                    .toLowerCase()
                    .includes(
                      term
                    )
              );
          }
        );
      },
      [
        clinics,
        search,
        status,
      ]
    );

  const metrics =
    useMemo(
      () => {
        const active =
          clinics.filter(
            clinic =>
              clinic.isActive !==
              false
          ).length;

        const inactive =
          clinics.length -
          active;

        return [
          {
            label:
              "Clinics",

            value:
              clinics.length
                .toLocaleString(
                  "en-ZA"
                ),

            helper:
              "Registered facilities",

            icon:
              Building2,
          },

          {
            label:
              "Active",

            value:
              active
                .toLocaleString(
                  "en-ZA"
                ),

            helper:
              "Available for assignment",

            icon:
              Building2,
          },

          {
            label:
              "Inactive",

            value:
              inactive
                .toLocaleString(
                  "en-ZA"
                ),

            helper:
              "Retained in system history",

            icon:
              Building2,
          },

          {
            label:
              "Visible results",

            value:
              visible.length
                .toLocaleString(
                  "en-ZA"
                ),

            helper:
              status ===
              "All"
                ? "All statuses"
                : status,

            icon:
              Search,
          },
        ];
      },
      [
        clinics,
        status,
        visible.length,
      ]
    );

  function setField(
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

    setErrors(
      current => ({
        ...current,

        [key]:
          undefined,
      })
    );
  }

  function beginCreate() {
    setEditingClinic(
      null
    );

    setForm(
      EMPTY_FORM
    );

    setErrors({});

    setError(
      ""
    );

    setSuccess(
      ""
    );

    setModalOpen(
      true
    );
  }

  function beginEdit(
    clinic
  ) {
    setEditingClinic(
      clinic
    );

    setForm({
      name:
        clinic.name ||
        "",

      type:
        clinic.type ||
        "Clinic",

      address:
        clinic.address ||
        "",

      contactNumber:
        clinic.contactNumber ||
        "",

      latitude:
        clinic.latitude ??
        "",

      longitude:
        clinic.longitude ??
        "",

      services:
        clinic.services ||
        "",

      openingTime:
        timeValue(
          clinic.openingTime
        ),

      closingTime:
        timeValue(
          clinic.closingTime
        ),

      isActive:
        clinic.isActive !==
        false,
    });

    setErrors({});

    setError(
      ""
    );

    setSuccess(
      ""
    );

    setModalOpen(
      true
    );
  }

  function validate() {
    const next = {};

    if (
      !form.name.trim()
    ) {
      next.name =
        "Enter a clinic name.";
    }

    if (
      !form.address.trim()
    ) {
      next.address =
        "Enter the clinic address.";
    }

    if (
      !form.contactNumber
        .trim()
    ) {
      next.contactNumber =
        "Enter a contact number.";
    }

    if (
      form.latitude ===
        "" ||
      Number.isNaN(
        Number(
          form.latitude
        )
      )
    ) {
      next.latitude =
        "Enter a valid latitude.";
    }

    if (
      form.longitude ===
        "" ||
      Number.isNaN(
        Number(
          form.longitude
        )
      )
    ) {
      next.longitude =
        "Enter a valid longitude.";
    }

    setErrors(
      next
    );

    return Object.keys(
      next
    ).length ===
      0;
  }

  async function save(
    event
  ) {
    event.preventDefault();

    if (
      !validate()
    ) {
      return;
    }

    const payload = {
      name:
        form.name.trim(),

      type:
        form.type
          .trim() ||
        "Clinic",

      address:
        form.address
          .trim(),

      contactNumber:
        form.contactNumber
          .trim(),

      latitude:
        Number(
          form.latitude
        ),

      longitude:
        Number(
          form.longitude
        ),

      services:
        form.services
          .trim(),

      openingTime:
        form.openingTime ||
        null,

      closingTime:
        form.closingTime ||
        null,

      ...(editingClinic
        ? {
            isActive:
              form.isActive,
          }
        : {}),
    };

    try {
      setSaving(
        true
      );

      setError(
        ""
      );

      if (
        editingClinic
      ) {
        await clinicsApi
          .update(
            editingClinic.id,
            payload
          );

        setSuccess(
          `${form.name.trim()} was updated.`
        );
      } else {
        await clinicsApi
          .create(
            payload
          );

        setSuccess(
          `${form.name.trim()} was created.`
        );
      }

      setModalOpen(
        false
      );

      setEditingClinic(
        null
      );

      setForm(
        EMPTY_FORM
      );

      await load();
    } catch (
      err
    ) {
      setError(
        err?.message ||
          "Could not save the clinic."
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  async function toggleClinic(
    clinic
  ) {
    try {
      setSaving(
        true
      );

      setError(
        ""
      );

      setSuccess(
        ""
      );

      if (
        clinic.isActive ===
        false
      ) {
        await clinicsApi
          .activate(
            clinic.id
          );

        setSuccess(
          `${clinic.name} was activated.`
        );
      } else {
        await clinicsApi
          .deactivate(
            clinic.id
          );

        setSuccess(
          `${clinic.name} was deactivated.`
        );
      }

      await load();
    } catch (
      err
    ) {
      setError(
        err?.message ||
          "Could not update the clinic status."
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  const columns = [
    {
      key:
        "name",

      label:
        "Clinic",

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
              {row.type ||
                "Clinic"}
            </p>
          </div>
        ),
    },

    {
      key:
        "address",

      label:
        "Address",

      render:
        value => (
          <span className="block max-w-[320px] whitespace-normal">
            {value ||
              "—"}
          </span>
        ),
    },

    {
      key:
        "contactNumber",

      label:
        "Contact",
    },

    {
      key:
        "hours",

      label:
        "Hours",

      render:
        (
          _,
          row
        ) => (
          <span className="whitespace-nowrap">
            {displayTime(
              row.openingTime
            )}{" "}
            –{" "}
            {displayTime(
              row.closingTime
            )}
          </span>
        ),
    },

    {
      key:
        "isActive",

      label:
        "Status",

      render:
        value => (
          <StatusBadge
            value={
              value ===
              false
                ? "Inactive"
                : "Active"
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
          <div className="flex flex-wrap gap-2">

            <button
              type="button"
              onClick={() =>
                beginEdit(
                  row
                )
              }
              className="inline-flex items-center gap-1.5 border border-slate-300 bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
            >
              <Pencil
                size={12}
              />

              Edit
            </button>

            <button
              type="button"
              onClick={() =>
                toggleClinic(
                  row
                )
              }
              disabled={
                saving
              }
              className={`border px-2.5 py-1.5 text-[11px] font-medium ${
                row.isActive ===
                false
                  ? "border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50"
                  : "border-red-200 bg-white text-red-700 hover:bg-red-50"
              }`}
            >
              {row.isActive ===
              false
                ? "Activate"
                : "Deactivate"}
            </button>

          </div>
        ),
    },
  ];

  return (
    <div className="space-y-5">

      <PageHeader
        eyebrow="Administration"
        title="Clinics"
        description="Create, update, activate and deactivate PhilaLink clinics. Inactive clinics remain visible to Super Administrators for governance and reactivation."
        actions={
          <>
            <PrimaryButton
              type="button"
              onClick={
                beginCreate
              }
            >
              <Plus
                size={15}
              />

              Add clinic
            </PrimaryButton>

            <SecondaryButton
              type="button"
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
        metrics={
          metrics
        }
      />

      <Panel
        title="Clinic directory"
        description={`${visible.length.toLocaleString(
          "en-ZA"
        )} clinic record${
          visible.length ===
          1
            ? ""
            : "s"
        } match the current view.`}
        noPadding
      >

        <div className="grid gap-3 border-b border-slate-200 px-5 py-4 md:grid-cols-[minmax(0,1fr)_220px]">

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
            placeholder="Clinic, type, address or service…"
          />

          <SelectField
            value={
              status
            }
            onChange={
              event =>
                setStatus(
                  event.target
                    .value
                )
            }
            options={[
              "All",
              "Active",
              "Inactive",
            ]}
          />

        </div>

        {loading ? (
          <LoadingBlock
            label="Loading clinics…"
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
              680
            }
          />
        ) : (
          <div className="p-5">
            <EmptyBlock
              icon={
                Building2
              }
              title="No clinics found"
              description="Change the filters or create a clinic."
            />
          </div>
        )}

      </Panel>

      {modalOpen ? (
        <AdminModal
          title={
            editingClinic
              ? "Edit clinic"
              : "Create clinic"
          }
          description={
            editingClinic
              ? "Update the clinic's operational details."
              : "Add a clinic to PhilaLink."
          }
          onClose={() => {
            if (
              !saving
            ) {
              setModalOpen(
                false
              );

              setEditingClinic(
                null
              );

              setForm(
                EMPTY_FORM
              );

              setErrors({});
            }
          }}
          width="max-w-3xl"
        >

          <form
            onSubmit={
              save
            }
            className="space-y-4 p-5"
          >

            <div className="grid gap-4 md:grid-cols-2">

              <InputField
                label="Clinic name"
                value={
                  form.name
                }
                onChange={
                  event =>
                    setField(
                      "name",
                      event.target
                        .value
                    )
                }
                error={
                  errors.name
                }
              />

              <InputField
                label="Type"
                value={
                  form.type
                }
                onChange={
                  event =>
                    setField(
                      "type",
                      event.target
                        .value
                    )
                }
              />

            </div>

            <InputField
              label="Address"
              value={
                form.address
              }
              onChange={
                event =>
                  setField(
                    "address",
                    event.target
                      .value
                  )
              }
              error={
                errors.address
              }
            />

            <div className="grid gap-4 md:grid-cols-2">

              <InputField
                label="Contact number"
                value={
                  form.contactNumber
                }
                onChange={
                  event =>
                    setField(
                      "contactNumber",
                      event.target
                        .value
                    )
                }
                error={
                  errors.contactNumber
                }
              />

              <InputField
                label="Services"
                value={
                  form.services
                }
                onChange={
                  event =>
                    setField(
                      "services",
                      event.target
                        .value
                    )
                }
                placeholder="Primary care, medication collection…"
              />

            </div>

            <div className="grid gap-4 md:grid-cols-2">

              <label className="block">
                <span className="mb-1.5 block text-[11px] font-medium text-slate-600">
                  Latitude
                </span>

                <input
                  type="number"
                  step="any"
                  value={
                    form.latitude
                  }
                  onChange={
                    event =>
                      setField(
                        "latitude",
                        event.target
                          .value
                      )
                  }
                  className={`h-10 w-full border bg-white px-3 text-sm outline-none focus:border-[#0f766e] ${
                    errors.latitude
                      ? "border-red-300"
                      : "border-slate-300"
                  }`}
                />

                {errors.latitude ? (
                  <span className="mt-1 block text-[11px] text-red-600">
                    {errors.latitude}
                  </span>
                ) : null}
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[11px] font-medium text-slate-600">
                  Longitude
                </span>

                <input
                  type="number"
                  step="any"
                  value={
                    form.longitude
                  }
                  onChange={
                    event =>
                      setField(
                        "longitude",
                        event.target
                          .value
                      )
                  }
                  className={`h-10 w-full border bg-white px-3 text-sm outline-none focus:border-[#0f766e] ${
                    errors.longitude
                      ? "border-red-300"
                      : "border-slate-300"
                  }`}
                />

                {errors.longitude ? (
                  <span className="mt-1 block text-[11px] text-red-600">
                    {errors.longitude}
                  </span>
                ) : null}
              </label>

            </div>

            <div className="grid gap-4 md:grid-cols-2">

              <InputField
                label="Opening time"
                type="time"
                value={
                  form.openingTime
                }
                onChange={
                  event =>
                    setField(
                      "openingTime",
                      event.target
                        .value
                    )
                }
              />

              <InputField
                label="Closing time"
                type="time"
                value={
                  form.closingTime
                }
                onChange={
                  event =>
                    setField(
                      "closingTime",
                      event.target
                        .value
                    )
                }
              />

            </div>

            {editingClinic ? (
              <SelectField
                label="Status"
                value={
                  form.isActive
                    ? "Active"
                    : "Inactive"
                }
                onChange={
                  event =>
                    setField(
                      "isActive",
                      event.target
                        .value ===
                        "Active"
                    )
                }
                options={[
                  "Active",
                  "Inactive",
                ]}
              />
            ) : null}

            <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">

              <SecondaryButton
                type="button"
                onClick={() =>
                  setModalOpen(
                    false
                  )
                }
                disabled={
                  saving
                }
              >
                Cancel
              </SecondaryButton>

              <PrimaryButton
                type="submit"
                disabled={
                  saving
                }
              >
                {saving
                  ? "Saving…"
                  : editingClinic
                    ? "Save changes"
                    : "Create clinic"}
              </PrimaryButton>

            </div>

          </form>

        </AdminModal>
      ) : null}

    </div>
  );
}
