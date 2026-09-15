import {
  useState,
} from "react";
import Card, {
  CardBody,
  CardHeader,
} from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import StatusChip from "../../components/ui/StatusChip.jsx";
import {
  EmptyState,
  ErrorState,
} from "../../components/ui/EmptyState.jsx";
import { useToast } from "../../components/ui/Toast.jsx";
import { useApi } from "../../lib/useApi.js";
import { clinicsApi } from "../../services/api/clinics.js";

const EMPTY_FORM = {
  name: "",
  type: "Clinic",
  address: "",
  contactNumber: "",
  latitude: "",
  longitude: "",
  services: "",
  openingTime: "",
  closingTime: "",
};

function timeInputValue(
  value
) {
  if (!value) {
    return "";
  }

  return String(
    value
  ).slice(0, 5);
}

function toTimeSpan(value) {
  return value
    ? `${value}:00`
    : null;
}

export default function ManageClinicsPage() {
  const [
    showForm,
    setShowForm,
  ] = useState(false);

  const [
    editingClinic,
    setEditingClinic,
  ] = useState(null);

  const [
    form,
    setForm,
  ] = useState(
    EMPTY_FORM
  );

  const [
    errors,
    setErrors,
  ] = useState({});

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    pendingId,
    setPendingId,
  ] = useState(null);

  const toast =
    useToast();

  const {
    data,
    loading,
    error,
    refetch,
    setData,
  } = useApi(
    () =>
      clinicsApi.getAll(),
    []
  );

  const clinics =
    Array.isArray(data)
      ? data
      : [];

  const set =
    (field) =>
    (event) => {
      setForm(
        (current) => ({
          ...current,
          [field]:
            event.target
              .value,
        })
      );

      setErrors(
        (current) => ({
          ...current,
          [field]:
            undefined,
        })
      );
    };

  const resetForm = () => {
    setForm(
      EMPTY_FORM
    );

    setErrors({});
    setEditingClinic(
      null
    );

    setShowForm(false);
  };

  const beginCreate = () => {
    setForm(
      EMPTY_FORM
    );

    setErrors({});
    setEditingClinic(
      null
    );

    setShowForm(true);
  };

  const beginEdit = (
    clinic
  ) => {
    setEditingClinic(
      clinic
    );

    setForm({
      name:
        clinic.name || "",

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
        String(
          clinic.latitude ??
            ""
        ),

      longitude:
        String(
          clinic.longitude ??
            ""
        ),

      services:
        clinic.services ||
        "",

      openingTime:
        timeInputValue(
          clinic.openingTime
        ),

      closingTime:
        timeInputValue(
          clinic.closingTime
        ),
    });

    setErrors({});
    setShowForm(true);
  };

  const validate = () => {
    const next = {};

    if (!form.name.trim()) {
      next.name =
        "Enter a clinic name.";
    }

    if (!form.type.trim()) {
      next.type =
        "Enter a clinic type.";
    }

    if (
      !form.address.trim()
    ) {
      next.address =
        "Enter an address.";
    }

    if (
      !form.contactNumber.trim()
    ) {
      next.contactNumber =
        "Enter a contact number.";
    }

    if (
      form.latitude ===
        "" ||
      !Number.isFinite(
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
      !Number.isFinite(
        Number(
          form.longitude
        )
      )
    ) {
      next.longitude =
        "Enter a valid longitude.";
    }

    setErrors(next);

    return (
      Object.keys(next)
        .length === 0
    );
  };

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      if (!validate()) {
        return;
      }

      setSaving(true);

      const basePayload = {
        name:
          form.name.trim(),

        type:
          form.type.trim(),

        address:
          form.address.trim(),

        contactNumber:
          form.contactNumber.trim(),

        latitude:
          Number(
            form.latitude
          ),

        longitude:
          Number(
            form.longitude
          ),

        services:
          form.services.trim(),

        openingTime:
          toTimeSpan(
            form.openingTime
          ),

        closingTime:
          toTimeSpan(
            form.closingTime
          ),
      };

      try {
        if (
          editingClinic
        ) {
          const updated =
            await clinicsApi.update(
              editingClinic.id,
              {
                ...basePayload,
                isActive:
                  editingClinic.isActive,
              }
            );

          setData(
            (current) =>
              (
                Array.isArray(
                  current
                )
                  ? current
                  : []
              ).map(
                (clinic) =>
                  clinic.id ===
                  editingClinic.id
                    ? updated
                    : clinic
              )
          );

          toast.success(
            "Clinic updated."
          );
        } else {
          const created =
            await clinicsApi.create(
              basePayload
            );

          setData(
            (current) => [
              ...(
                Array.isArray(
                  current
                )
                  ? current
                  : []
              ),
              created,
            ]
          );

          toast.success(
            "Clinic created."
          );
        }

        resetForm();
      } catch (error) {
        toast.error(
          error?.message ||
            "Couldn't save the clinic."
        );
      } finally {
        setSaving(false);
      }
    };

  const toggleClinic =
    async (clinic) => {
      setPendingId(
        clinic.id
      );

      try {
        if (
          clinic.isActive
        ) {
          await clinicsApi.deactivate(
            clinic.id
          );
        } else {
          await clinicsApi.activate(
            clinic.id
          );
        }

        setData(
          (current) =>
            (
              Array.isArray(
                current
              )
                ? current
                : []
            ).map(
              (item) =>
                item.id ===
                clinic.id
                  ? {
                      ...item,
                      isActive:
                        !item.isActive,
                    }
                  : item
            )
        );

        toast.success(
          clinic.isActive
            ? "Clinic deactivated."
            : "Clinic activated."
        );
      } catch (error) {
        toast.error(
          error?.message ||
            "Couldn't update the clinic."
        );
      } finally {
        setPendingId(null);
      }
    };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Manage clinics"
          subtitle={`${clinics.length} clinic${
            clinics.length ===
            1
              ? ""
              : "s"
          }`}
          action={
            <Button
              type="button"
              size="sm"
              icon="add"
              onClick={
                beginCreate
              }
            >
              Add clinic
            </Button>
          }
        />

        <CardBody className="pt-0">
          {loading ? (
            <div className="py-10">
              <Spinner label="Loading clinics…" />
            </div>
          ) : error ? (
            <ErrorState
              description={
                error.message
              }
              onRetry={
                refetch
              }
            />
          ) : clinics.length ===
            0 ? (
            <EmptyState
              icon="local_hospital"
              title="No clinics found"
              description="Create the first clinic to get started."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/60 text-xs uppercase tracking-wide text-on-surface-variant">
                    <th className="py-2 pr-4 font-medium">
                      Clinic
                    </th>

                    <th className="py-2 pr-4 font-medium">
                      Address
                    </th>

                    <th className="py-2 pr-4 font-medium">
                      Contact
                    </th>

                    <th className="py-2 pr-4 font-medium">
                      Hours
                    </th>

                    <th className="py-2 pr-4 font-medium">
                      Status
                    </th>

                    <th className="py-2 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-outline-variant/50">
                  {clinics.map(
                    (clinic) => (
                      <tr
                        key={
                          clinic.id
                        }
                      >
                        <td className="py-3 pr-4">
                          <p className="font-semibold text-on-surface">
                            {clinic.name}
                          </p>

                          <p className="text-xs text-on-surface-variant">
                            {clinic.type}
                          </p>
                        </td>

                        <td className="py-3 pr-4 text-on-surface-variant">
                          {clinic.address ||
                            "—"}
                        </td>

                        <td className="py-3 pr-4 text-on-surface-variant">
                          {clinic.contactNumber ||
                            "—"}
                        </td>

                        <td className="whitespace-nowrap py-3 pr-4 text-on-surface-variant">
                          {clinic.openingTime
                            ? timeInputValue(
                                clinic.openingTime
                              )
                            : "—"}
                          {" – "}
                          {clinic.closingTime
                            ? timeInputValue(
                                clinic.closingTime
                              )
                            : "—"}
                        </td>

                        <td className="py-3 pr-4">
                          <StatusChip
                            tone={
                              clinic.isActive
                                ? "success-soft"
                                : "neutral"
                            }
                          >
                            {clinic.isActive
                              ? "Active"
                              : "Inactive"}
                          </StatusChip>
                        </td>

                        <td className="py-3">
                          <div className="flex gap-3">
                            <button
                              type="button"
                              className="text-xs font-semibold text-primary hover:underline"
                              onClick={() =>
                                beginEdit(
                                  clinic
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              disabled={
                                pendingId ===
                                clinic.id
                              }
                              className={`text-xs font-semibold hover:underline disabled:opacity-50 ${
                                clinic.isActive
                                  ? "text-error"
                                  : "text-primary"
                              }`}
                              onClick={() =>
                                toggleClinic(
                                  clinic
                                )
                              }
                            >
                              {pendingId ===
                              clinic.id
                                ? "Updating…"
                                : clinic.isActive
                                ? "Deactivate"
                                : "Activate"}
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
        </CardBody>
      </Card>

      {showForm && (
        <Card>
          <CardHeader
            title={
              editingClinic
                ? "Edit clinic"
                : "Create clinic"
            }
            subtitle="Clinic details are stored in the backend database."
          />

          <CardBody>
            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Name"
                  value={
                    form.name
                  }
                  onChange={set(
                    "name"
                  )}
                  error={
                    errors.name
                  }
                />

                <Input
                  label="Type"
                  value={
                    form.type
                  }
                  onChange={set(
                    "type"
                  )}
                  error={
                    errors.type
                  }
                />
              </div>

              <Input
                label="Address"
                value={
                  form.address
                }
                onChange={set(
                  "address"
                )}
                error={
                  errors.address
                }
              />

              <Input
                label="Contact number"
                value={
                  form.contactNumber
                }
                onChange={set(
                  "contactNumber"
                )}
                error={
                  errors.contactNumber
                }
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Latitude"
                  type="number"
                  step="any"
                  value={
                    form.latitude
                  }
                  onChange={set(
                    "latitude"
                  )}
                  error={
                    errors.latitude
                  }
                />

                <Input
                  label="Longitude"
                  type="number"
                  step="any"
                  value={
                    form.longitude
                  }
                  onChange={set(
                    "longitude"
                  )}
                  error={
                    errors.longitude
                  }
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-on-surface">
                  Services
                </label>

                <textarea
                  value={
                    form.services
                  }
                  onChange={set(
                    "services"
                  )}
                  rows={3}
                  className="w-full rounded-md border border-outline-variant bg-white px-3.5 py-3 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Services offered by this clinic"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Opening time"
                  type="time"
                  value={
                    form.openingTime
                  }
                  onChange={set(
                    "openingTime"
                  )}
                />

                <Input
                  label="Closing time"
                  type="time"
                  value={
                    form.closingTime
                  }
                  onChange={set(
                    "closingTime"
                  )}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  loading={
                    saving
                  }
                  className="flex-1"
                >
                  {editingClinic
                    ? "Save changes"
                    : "Create clinic"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={
                    resetForm
                  }
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}
    </div>
  );
}