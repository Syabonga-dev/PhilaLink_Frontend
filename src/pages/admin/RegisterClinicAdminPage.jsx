import {
  useState,
} from "react";
import Card, {
  CardBody,
  CardHeader,
} from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Input, {
  Select,
} from "../../components/ui/Input.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import {
  EmptyState,
  ErrorState,
} from "../../components/ui/EmptyState.jsx";
import { useToast } from "../../components/ui/Toast.jsx";
import { useApi } from "../../lib/useApi.js";
import { adminApi } from "../../services/api/admin.js";
import { clinicsApi } from "../../services/api/clinics.js";

const INITIAL_FORM = {
  fullName: "",
  idNumber: "",
  phoneNumber: "",
  email: "",
  clinicId: "",
};

export default function RegisterClinicAdminPage() {
  const [
    form,
    setForm,
  ] = useState(
    INITIAL_FORM
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
    createdAccount,
    setCreatedAccount,
  ] = useState(null);

  const toast =
    useToast();

  const {
    data: clinics,
    loading,
    error,
    refetch,
  } = useApi(
    () =>
      clinicsApi.getAll(),
    []
  );

  const clinicList =
    Array.isArray(clinics)
      ? clinics.filter(
          (clinic) =>
            clinic.isActive !==
            false
        )
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

  const validate = () => {
    const next = {};

    if (
      !form.fullName.trim()
    ) {
      next.fullName =
        "Enter the administrator's full name.";
    }

    if (
      !/^\d{13}$/.test(
        form.idNumber
      )
    ) {
      next.idNumber =
        "Enter a valid 13-digit SA ID number.";
    }

    if (
      !/^0\d{9}$/.test(
        form.phoneNumber
      )
    ) {
      next.phoneNumber =
        "Enter a valid SA cellphone number.";
    }

    if (
      !/^\S+@\S+\.\S+$/.test(
        form.email
      )
    ) {
      next.email =
        "Enter a valid email address.";
    }

    if (!form.clinicId) {
      next.clinicId =
        "Select a clinic.";
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

      try {
        const result =
          await adminApi.registerClinicAdmin(
            {
              fullName:
                form.fullName.trim(),

              idNumber:
                form.idNumber.trim(),

              phoneNumber:
                form.phoneNumber.trim(),

              email:
                form.email.trim(),

              clinicId:
                form.clinicId,
            }
          );

        setCreatedAccount(
          result
        );

        toast.success(
          "Clinic Admin account created."
        );
      } catch (error) {
        toast.error(
          error?.message ||
            "Couldn't create the Clinic Admin account."
        );
      } finally {
        setSaving(false);
      }
    };

  if (createdAccount) {
    return (
      <Card className="mx-auto max-w-xl">
        <CardHeader
          title="Clinic Admin created"
          subtitle="Save the temporary password now."
        />

        <CardBody>
          <div className="space-y-4">
            <div className="rounded-lg border border-outline-variant/60 bg-surface-container-low p-4">
              <p className="font-semibold text-on-surface">
                {createdAccount.fullName}
              </p>

              <p className="mt-1 text-sm text-on-surface-variant">
                {createdAccount.idNumber}
              </p>

              <p className="mt-1 text-sm text-on-surface-variant">
                {createdAccount.role}
              </p>
            </div>

            <div className="rounded-lg border border-warning/40 bg-warning/10 p-4">
              <p className="text-sm font-semibold text-on-surface">
                Temporary password
              </p>

              <p className="mt-2 break-all font-mono text-lg font-bold text-on-surface">
                {createdAccount.temporaryPassword}
              </p>
            </div>

            <Button
              type="button"
              className="w-full"
              onClick={() => {
                setForm(
                  INITIAL_FORM
                );

                setCreatedAccount(
                  null
                );

                setErrors(
                  {}
                );
              }}
            >
              Register another
              Clinic Admin
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader
        title="Register Clinic Admin"
        subtitle="Super Admin only"
      />

      <CardBody>
        {loading ? (
          <Spinner label="Loading clinics…" />
        ) : error ? (
          <ErrorState
            description={
              error.message
            }
            onRetry={
              refetch
            }
          />
        ) : clinicList.length ===
          0 ? (
          <EmptyState
            icon="local_hospital"
            title="No active clinics"
            description="Create or activate a clinic before assigning a Clinic Admin."
          />
        ) : (
          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-4"
          >
            <Input
              label="Full name"
              value={
                form.fullName
              }
              onChange={set(
                "fullName"
              )}
              error={
                errors.fullName
              }
            />

            <Input
              label="SA ID number"
              value={
                form.idNumber
              }
              onChange={set(
                "idNumber"
              )}
              error={
                errors.idNumber
              }
              maxLength={
                13
              }
              inputMode="numeric"
            />

            <Input
              label="Cellphone number"
              value={
                form.phoneNumber
              }
              onChange={set(
                "phoneNumber"
              )}
              error={
                errors.phoneNumber
              }
              inputMode="tel"
            />

            <Input
              label="Email"
              type="email"
              value={
                form.email
              }
              onChange={set(
                "email"
              )}
              error={
                errors.email
              }
            />

            <Select
              label="Clinic"
              value={
                form.clinicId
              }
              onChange={set(
                "clinicId"
              )}
              error={
                errors.clinicId
              }
            >
              <option value="">
                Select clinic
              </option>

              {clinicList.map(
                (clinic) => (
                  <option
                    key={
                      clinic.id
                    }
                    value={
                      clinic.id
                    }
                  >
                    {clinic.name}
                  </option>
                )
              )}
            </Select>

            <Button
              type="submit"
              className="w-full"
              loading={
                saving
              }
            >
              Create Clinic
              Admin
            </Button>
          </form>
        )}
      </CardBody>
    </Card>
  );
}