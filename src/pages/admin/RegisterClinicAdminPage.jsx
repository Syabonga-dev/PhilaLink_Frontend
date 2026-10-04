import {
  useEffect,
  useState,
} from "react";

import {
  MailCheck,
  MailWarning,
  RefreshCw,
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
    resending,
    setResending,
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

  const [
    warning,
    setWarning,
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

      setWarning(
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

      if (
        result?.emailSent
      ) {
        setSuccess(
          result.message
        );
      } else {
        setWarning(
          result?.message ||
          "The account was created, but the invitation email could not be delivered."
        );
      }
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

  async function resendInvitation() {
    if (
      !createdAccount
        ?.userId
    ) {
      return;
    }

    try {
      setResending(
        true
      );

      setError(
        ""
      );

      setSuccess(
        ""
      );

      setWarning(
        ""
      );

      const result =
        await adminApi
          .resendInvitation(
            createdAccount
              .userId
          );

      setCreatedAccount(
        result
      );

      if (
        result?.emailSent
      ) {
        setSuccess(
          result.message
        );
      } else {
        setWarning(
          result?.message ||
          "The new invitation email could not be delivered."
        );
      }
    } catch (
      err
    ) {
      setError(
        err?.message ||
        "Could not resend the Clinic Administrator invitation."
      );
    } finally {
      setResending(
        false
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

    setWarning(
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
        description="Create a Clinic Administrator and set the initial clinic assignment. PhilaLink generates and emails the temporary credential directly to the administrator."
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

      {warning ? (
        <Notice type="warning">
          {warning}
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
          description="The temporary password was generated on the backend and is not returned to the Super Administrator."
        >

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">

            <div className="border border-slate-200 bg-slate-50 p-4">

              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Account
              </p>

              <p className="mt-2 text-lg font-semibold text-slate-950">
                {createdAccount
                  .fullName}
              </p>

              <dl className="mt-4 grid gap-3 text-xs sm:grid-cols-2">

                <div>
                  <dt className="text-slate-400">
                    Role
                  </dt>

                  <dd className="mt-0.5 font-medium text-slate-800">
                    {createdAccount
                      .role}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-400">
                    Clinic
                  </dt>

                  <dd className="mt-0.5 font-medium text-slate-800">
                    {createdAccount
                      .clinicName ||
                      selectedClinic
                        ?.name ||
                      "Assigned clinic"}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-400">
                    Email
                  </dt>

                  <dd className="mt-0.5 font-medium text-slate-800">
                    {createdAccount
                      .email ||
                      form.email}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-400">
                    Account ID
                  </dt>

                  <dd className="mt-0.5 break-all font-mono text-slate-700">
                    {createdAccount
                      .userId}
                  </dd>
                </div>

              </dl>

            </div>

            <div
              className={`border p-4 ${
                createdAccount
                  .emailSent
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-amber-200 bg-amber-50"
              }`}
            >

              <div className="flex items-start gap-3">

                {createdAccount
                  .emailSent ? (
                  <MailCheck
                    size={19}
                    className="mt-0.5 shrink-0 text-emerald-700"
                  />
                ) : (
                  <MailWarning
                    size={19}
                    className="mt-0.5 shrink-0 text-amber-700"
                  />
                )}

                <div className="min-w-0">

                  <p
                    className={`text-xs font-semibold uppercase tracking-wide ${
                      createdAccount
                        .emailSent
                        ? "text-emerald-800"
                        : "text-amber-800"
                    }`}
                  >
                    {createdAccount
                      .emailSent
                      ? "Credentials emailed"
                      : "Email delivery failed"}
                  </p>

                  <p className="mt-2 text-xs leading-5 text-slate-700">
                    {createdAccount
                      .emailSent
                      ? `The login credential was sent directly to ${createdAccount.email}. The Super Administrator cannot view the temporary password.`
                      : "The account exists, but the temporary password was not exposed to you. Resending creates a new temporary password and invalidates the previous one."}
                  </p>

                  {!createdAccount
                    .emailSent ? (
                    <SecondaryButton
                      type="button"
                      onClick={
                        resendInvitation
                      }
                      disabled={
                        resending
                      }
                      className="mt-4"
                    >
                      <RefreshCw
                        size={14}
                        className={
                          resending
                            ? "animate-spin"
                            : ""
                        }
                      />

                      {resending
                        ? "Resending…"
                        : "Resend invitation"}
                    </SecondaryButton>
                  ) : null}

                </div>

              </div>

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
          description="The registered email receives the temporary password. The recipient is forced to replace it at first login."
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
                The backend generates the initial password and sends it directly to the registered email. The Super Administrator never sees or receives the plaintext password.
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
