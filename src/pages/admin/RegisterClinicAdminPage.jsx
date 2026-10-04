import {
  useEffect,
  useState,
} from "react";

import {
  ClipboardCopy,
  ShieldCheck,
} from "lucide-react";

import {
  InputField,
  LoadingBlock,
  Notice,
  PageHeader,
  Panel,
  PrimaryButton,
  SecondaryButton,
  SelectField,
} from "../../components/admin/AdminPrimitives.jsx";

import {
  adminApi,
} from "../../services/api/admin.js";

import {
  superAdminApi,
} from "../../services/api/superAdmin.js";

const INITIAL_FORM = {
  fullName:
    "",

  idNumber:
    "",

  phoneNumber:
    "",

  email:
    "",

  clinicId:
    "",
};

export default function RegisterClinicAdminPage() {
  const [
    form,
    setForm,
  ] =
    useState(
      INITIAL_FORM
    );

  const [
    errors,
    setErrors,
  ] =
    useState({});

  const [
    clinics,
    setClinics,
  ] =
    useState([]);

  const [
    loadingClinics,
    setLoadingClinics,
  ] =
    useState(true);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    createdAccount,
    setCreatedAccount,
  ] =
    useState(null);

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

  useEffect(
    () => {
      let active =
        true;

      async function loadClinics() {
        try {
          setLoadingClinics(
            true
          );

          const result =
            await superAdminApi
              .getClinics();

          if (!active) {
            return;
          }

          setClinics(
            Array.isArray(
              result
            )
              ? result.filter(
                  clinic =>
                    clinic.isActive !==
                    false
                )
              : []
          );
        } catch (
          err
        ) {
          if (
            active
          ) {
            setError(
              err?.message ||
                "Could not load clinics."
            );
          }
        } finally {
          if (
            active
          ) {
            setLoadingClinics(
              false
            );
          }
        }
      }

      void loadClinics();

      return () => {
        active =
          false;
      };
    },
    []
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

  function validate() {
    const next = {};

    if (
      !form.fullName
        .trim()
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

    if (
      !form.clinicId
    ) {
      next.clinicId =
        "Select the clinic this administrator will manage.";
    }

    setErrors(
      next
    );

    return Object.keys(
      next
    ).length ===
      0;
  }

  async function submit(
    event
  ) {
    event.preventDefault();

    if (
      !validate()
    ) {
      return;
    }

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

      const result =
        await adminApi
          .registerClinicAdmin({
            fullName:
              form.fullName
                .trim(),

            idNumber:
              form.idNumber
                .trim(),

            phoneNumber:
              form.phoneNumber
                .trim(),

            email:
              form.email
                .trim(),

            clinicId:
              form.clinicId,
          });

      setCreatedAccount(
        result
      );

      setSuccess(
        "Clinic Administrator account created successfully."
      );
    } catch (
      err
    ) {
      setError(
        err?.message ||
          "Could not create the Clinic Administrator account."
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  async function copyPassword() {
    if (
      !createdAccount
        ?.temporaryPassword
    ) {
      return;
    }

    try {
      await navigator.clipboard
        .writeText(
          createdAccount
            .temporaryPassword
        );

      setSuccess(
        "Temporary password copied to the clipboard."
      );
    } catch {
      setError(
        "Could not copy the temporary password automatically."
      );
    }
  }

  function reset() {
    setForm(
      INITIAL_FORM
    );

    setErrors({});

    setCreatedAccount(
      null
    );

    setError(
      ""
    );

    setSuccess(
      ""
    );
  }

  const selectedClinic =
    clinics.find(
      clinic =>
        clinic.id ===
        form.clinicId
    );

  return (
    <div className="space-y-5">

      <PageHeader
        eyebrow="Administration"
        title="Register Clinic Administrator"
        description="Create a Clinic Administrator account and assign its initial clinic boundary. The assignment can be changed or removed later from Clinic Administrators."
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

      {loadingClinics ? (
        <LoadingBlock
          label="Loading active clinics…"
          minHeight={
            260
          }
        />
      ) : createdAccount ? (
        <Panel
          title="Clinic Administrator created"
          description="Save the temporary password now. It is not stored in plaintext and cannot be retrieved later."
        >

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">

            <div className="border border-slate-200 bg-slate-50 p-4">

              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Account
              </p>

              <p className="mt-2 text-lg font-semibold text-slate-950">
                {
                  createdAccount
                    .fullName
                }
              </p>

              <dl className="mt-4 grid gap-3 text-xs sm:grid-cols-2">

                <div>
                  <dt className="text-slate-400">
                    Role
                  </dt>

                  <dd className="mt-0.5 font-medium text-slate-800">
                    {
                      createdAccount
                        .role
                    }
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-400">
                    Clinic
                  </dt>

                  <dd className="mt-0.5 font-medium text-slate-800">
                    {selectedClinic
                      ?.name ||
                      "Assigned clinic"}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-400">
                    ID number
                  </dt>

                  <dd className="mt-0.5 font-medium text-slate-800">
                    {
                      createdAccount
                        .idNumber
                    }
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-400">
                    Account ID
                  </dt>

                  <dd className="mt-0.5 break-all font-mono text-slate-700">
                    {
                      createdAccount
                        .userId
                    }
                  </dd>
                </div>

              </dl>

            </div>

            <div className="border border-amber-200 bg-amber-50 p-4">

              <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-800">
                Temporary password
              </p>

              <p className="mt-3 break-all font-mono text-xl font-semibold text-slate-950">
                {
                  createdAccount
                    .temporaryPassword
                }
              </p>

              <p className="mt-2 text-xs leading-5 text-amber-900">
                The user must replace this password before normal application use.
              </p>

              <SecondaryButton
                type="button"
                onClick={
                  copyPassword
                }
                className="mt-4"
              >
                <ClipboardCopy
                  size={15}
                />

                Copy password
              </SecondaryButton>

            </div>

          </div>

          <div className="mt-5 border-t border-slate-200 pt-4">
            <PrimaryButton
              type="button"
              onClick={
                reset
              }
            >
              Register another Clinic Administrator
            </PrimaryButton>
          </div>

        </Panel>
      ) : (
        <Panel
          title="Account details"
          description="Clinic Administrator accounts are created verified, receive a temporary password and must belong to an active clinic when first registered."
        >

          {!clinics.length ? (
            <Notice type="warning">
              No active clinics are available. Create or reactivate a clinic before registering a Clinic Administrator.
            </Notice>
          ) : (
            <form
              onSubmit={
                submit
              }
              className="space-y-5"
            >

              <div className="grid gap-4 md:grid-cols-2">

                <InputField
                  label="Full name"
                  value={
                    form.fullName
                  }
                  onChange={
                    event =>
                      setField(
                        "fullName",
                        event.target
                          .value
                      )
                  }
                  error={
                    errors.fullName
                  }
                />

                <InputField
                  label="SA ID number"
                  value={
                    form.idNumber
                  }
                  onChange={
                    event =>
                      setField(
                        "idNumber",
                        event.target
                          .value
                      )
                  }
                  error={
                    errors.idNumber
                  }
                  maxLength={
                    13
                  }
                  inputMode="numeric"
                />

                <InputField
                  label="Cellphone number"
                  value={
                    form.phoneNumber
                  }
                  onChange={
                    event =>
                      setField(
                        "phoneNumber",
                        event.target
                          .value
                      )
                  }
                  error={
                    errors.phoneNumber
                  }
                  inputMode="tel"
                />

                <InputField
                  label="Email"
                  type="email"
                  value={
                    form.email
                  }
                  onChange={
                    event =>
                      setField(
                        "email",
                        event.target
                          .value
                      )
                  }
                  error={
                    errors.email
                  }
                />

              </div>

              <SelectField
                label="Assigned clinic"
                value={
                  form.clinicId
                }
                onChange={
                  event =>
                    setField(
                      "clinicId",
                      event.target
                        .value
                    )
                }
                error={
                  errors.clinicId
                }
              >

                <option value="">
                  Select clinic
                </option>

                {clinics.map(
                  clinic => (
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

              </SelectField>

              <Notice type="info">
                Clinic assignment controls the Clinic Administrator's patient, staff, inventory, analytics, reporting and audit scope. A Super Administrator can reassign or deassign the account later.
              </Notice>

              <div className="flex justify-end border-t border-slate-200 pt-4">

                <PrimaryButton
                  type="submit"
                  disabled={
                    saving ||
                    !clinics.length
                  }
                >
                  <ShieldCheck
                    size={15}
                  />

                  {saving
                    ? "Creating…"
                    : "Create Clinic Administrator"}
                </PrimaryButton>

              </div>

            </form>
          )}

        </Panel>
      )}

    </div>
  );
}
