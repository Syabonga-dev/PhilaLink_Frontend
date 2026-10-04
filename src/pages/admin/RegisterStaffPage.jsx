import {
  useEffect,
  useState,
} from "react";

import {
  MailCheck,
  MailWarning,
  RefreshCw,
  ShieldCheck,
  UserPlus,
} from "lucide-react";

import {
  adminApi,
} from "../../services/api/admin.js";

import {
  ApiError,
} from "../../services/api/client.js";

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

const EMPTY_FORM = {
  role:
    "Nurse",

  fullName:
    "",

  idNumber:
    "",

  phoneNumber:
    "",

  email:
    "",

  dateOfBirth:
    "",

  gender:
    "",

  addressLine1:
    "",

  addressLine2:
    "",

  suburb:
    "",

  city:
    "",

  province:
    "",

  postalCode:
    "",

  emergencyContactName:
    "",

  emergencyContactPhone:
    "",

  emergencyContactRelationship:
    "",

  employeeNumber:
    "",

  registrationNumber:
    "",

  qualification:
    "",

  clinicId:
    "",

  employmentDate:
    "",
};

function mapApiErrors(
  errors
) {
  const mapped = {};

  if (!errors) {
    return mapped;
  }

  Object.entries(
    errors
  ).forEach(
    ([
      key,
      messages,
    ]) => {
      const field =
        key.charAt(
          0
        ).toLowerCase() +
        key.slice(
          1
        );

      mapped[field] =
        Array.isArray(
          messages
        )
          ? messages[0]
          : messages;
    }
  );

  return mapped;
}

function SectionHeading({
  title,
  description,
}) {
  return (
    <div className="border-b border-slate-200 pb-3">
      <h2 className="text-sm font-semibold text-slate-950">
        {title}
      </h2>

      {description ? (
        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export default function RegisterStaffPage() {
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

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    resending,
    setResending,
  ] =
    useState(false);

  const [
    profileLoading,
    setProfileLoading,
  ] =
    useState(true);

  const [
    profileError,
    setProfileError,
  ] =
    useState("");

  const [
    adminProfile,
    setAdminProfile,
  ] =
    useState(null);

  const [
    createdAccount,
    setCreatedAccount,
  ] =
    useState(null);

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

  const [
    error,
    setError,
  ] =
    useState("");

  useEffect(
    () => {
      let active =
        true;

      async function loadContext() {
        try {
          setProfileLoading(
            true
          );

          setProfileError(
            ""
          );

          const me =
            await adminApi
              .getMe();

          if (!active) {
            return;
          }

          if (
            !me?.clinicId
          ) {
            throw new Error(
              "Your Clinic Administrator account does not have an assigned clinic."
            );
          }

          setAdminProfile(
            me
          );

          setForm(
            current => ({
              ...current,

              clinicId:
                me.clinicId,
            })
          );
        } catch (
          err
        ) {
          if (
            active
          ) {
            setProfileError(
              err?.message ||
              "Could not load your Clinic Administrator profile."
            );
          }
        } finally {
          if (
            active
          ) {
            setProfileLoading(
              false
            );
          }
        }
      }

      void loadContext();

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

  function resetForRole(
    nextRole
  ) {
    setForm({
      ...EMPTY_FORM,

      role:
        nextRole,

      clinicId:
        adminProfile
          ?.clinicId ||
        "",
    });

    setErrors({});

    setCreatedAccount(
      null
    );

    setSuccess(
      ""
    );

    setWarning(
      ""
    );

    setError(
      ""
    );
  }

  function validate() {
    const next = {};

    if (
      !form.fullName
        .trim()
    ) {
      next.fullName =
        "Enter the staff member's full name.";
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
      form.role ===
        "Nurse" &&
      !form.dateOfBirth
    ) {
      next.dateOfBirth =
        "Enter the date of birth.";
    }

    if (
      !form.gender
    ) {
      next.gender =
        "Select a gender.";
    }

    if (
      !form.addressLine1
        .trim()
    ) {
      next.addressLine1 =
        "Enter the street address.";
    }

    if (
      !form.suburb
        .trim()
    ) {
      next.suburb =
        "Enter the suburb.";
    }

    if (
      !form.city
        .trim()
    ) {
      next.city =
        "Enter the city.";
    }

    if (
      !form.province
        .trim()
    ) {
      next.province =
        "Enter the province.";
    }

    if (
      !form.postalCode
        .trim()
    ) {
      next.postalCode =
        "Enter the postal code.";
    }

    if (
      !form.emergencyContactName
        .trim()
    ) {
      next.emergencyContactName =
        "Enter an emergency contact name.";
    }

    if (
      !/^0\d{9}$/.test(
        form.emergencyContactPhone
      )
    ) {
      next.emergencyContactPhone =
        "Enter a valid emergency contact number.";
    }

    if (
      !form.emergencyContactRelationship
        .trim()
    ) {
      next.emergencyContactRelationship =
        "Enter the emergency contact relationship.";
    }

    if (
      !form.clinicId
    ) {
      next.clinicId =
        "Your Clinic Administrator account must have an assigned clinic.";
    }

    if (
      form.role ===
      "Nurse"
    ) {
      if (
        !form.employeeNumber
          .trim()
      ) {
        next.employeeNumber =
          "Enter an employee number.";
      }

      if (
        !form.registrationNumber
          .trim()
      ) {
        next.registrationNumber =
          "Enter the professional registration number.";
      }

      if (
        !form.qualification
          .trim()
      ) {
        next.qualification =
          "Enter the nurse's qualification.";
      }

      if (
        !form.employmentDate
      ) {
        next.employmentDate =
          "Enter the employment date.";
      }
    }

    setErrors(
      next
    );

    return Object.keys(
      next
    ).length ===
      0;
  }

  function buildPayload() {
    const shared = {
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
        adminProfile
          ?.clinicId,

      addressLine1:
        form.addressLine1
          .trim(),

      addressLine2:
        form.addressLine2
          .trim() ||
        null,

      suburb:
        form.suburb
          .trim(),

      city:
        form.city
          .trim(),

      province:
        form.province
          .trim(),

      postalCode:
        form.postalCode
          .trim(),

      gender:
        form.gender,

      emergencyContactName:
        form.emergencyContactName
          .trim(),

      emergencyContactPhone:
        form.emergencyContactPhone
          .trim(),

      emergencyContactRelationship:
        form.emergencyContactRelationship
          .trim(),
    };

    if (
      form.role ===
      "Nurse"
    ) {
      return {
        ...shared,

        employeeNumber:
          form.employeeNumber
            .trim(),

        registrationNumber:
          form.registrationNumber
            .trim(),

        qualification:
          form.qualification
            .trim(),

        dateOfBirth:
          form.dateOfBirth,

        employmentDate:
          form.employmentDate,
      };
    }

    return shared;
  }

  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    if (
      !validate()
    ) {
      return;
    }

    try {
      setLoading(
        true
      );

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

      const payload =
        buildPayload();

      const result =
        form.role ===
        "Nurse"
          ? await adminApi
              .registerNurse(
                payload
              )
          : await adminApi
              .registerProxy(
                payload
              );

      setCreatedAccount(
        result
      );

      if (
        result?.emailSent
      ) {
        setSuccess(
          result.message ||
          `Account created and credentials sent to ${form.email}.`
        );
      } else {
        setWarning(
          result?.message ||
          "The account was created, but the credential email could not be delivered."
        );
      }
    } catch (
      err
    ) {
      if (
        err instanceof
          ApiError &&
        err.errors
      ) {
        setErrors(
          mapApiErrors(
            err.errors
          )
        );
      }

      setError(
        err?.message ||
        "Couldn't create the account. Please try again."
      );
    } finally {
      setLoading(
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
          result.message ||
          "A new invitation was sent."
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
        "Could not resend the account invitation."
      );
    } finally {
      setResending(
        false
      );
    }
  }

  if (
    profileLoading
  ) {
    return (
      <LoadingBlock
        label="Loading registration context…"
        minHeight={
          360
        }
      />
    );
  }

  if (
    profileError
  ) {
    return (
      <Notice type="error">
        {profileError}
      </Notice>
    );
  }

  if (
    createdAccount
  ) {
    return (
      <div className="space-y-5">

        <PageHeader
          eyebrow="Clinic workforce"
          title="Account created"
          description="PhilaLink generated the temporary password on the backend. It is never shown to the Clinic Administrator."
        />

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

        {error ? (
          <Notice type="error">
            {error}
          </Notice>
        ) : null}

        <Panel
          title="New staff account"
          description="The staff member must use the credentials delivered to their registered email and change the temporary password at first login."
        >

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">

            <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">

              <div>
                <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Full name
                </dt>

                <dd className="mt-1 text-sm font-semibold text-slate-900">
                  {createdAccount.fullName ||
                    form.fullName}
                </dd>
              </div>

              <div>
                <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Role
                </dt>

                <dd className="mt-1 text-sm font-semibold text-slate-900">
                  {createdAccount.role ||
                    form.role}
                </dd>
              </div>

              <div>
                <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Clinic
                </dt>

                <dd className="mt-1 text-sm font-semibold text-slate-900">
                  {createdAccount.clinicName ||
                    adminProfile?.clinicName ||
                    "Assigned clinic"}
                </dd>
              </div>

              <div>
                <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Email
                </dt>

                <dd className="mt-1 text-sm text-slate-800">
                  {createdAccount.email ||
                    form.email}
                </dd>
              </div>

              <div>
                <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Account ID
                </dt>

                <dd className="mt-1 break-all font-mono text-xs text-slate-600">
                  {createdAccount.userId ||
                    "—"}
                </dd>
              </div>

            </dl>

            <div
              className={`border p-4 ${
                createdAccount.emailSent
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-amber-200 bg-amber-50"
              }`}
            >

              <div className="flex items-start gap-3">

                {createdAccount.emailSent ? (
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
                      createdAccount.emailSent
                        ? "text-emerald-800"
                        : "text-amber-800"
                    }`}
                  >
                    {createdAccount.emailSent
                      ? "Credentials emailed"
                      : "Email delivery failed"}
                  </p>

                  <p className="mt-2 text-xs leading-5 text-slate-700">
                    {createdAccount.emailSent
                      ? `The backend sent the temporary login password directly to ${createdAccount.email}. You cannot view or retrieve that password.`
                      : "The account exists, but the generated password was not exposed to you. Resending will generate a completely new temporary password and email it directly to the staff member."}
                  </p>

                  {!createdAccount.emailSent ? (
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

          <div className="mt-6 border-t border-slate-200 pt-4">

            <PrimaryButton
              type="button"
              onClick={() =>
                resetForRole(
                  form.role
                )
              }
            >
              <UserPlus
                size={15}
              />

              Register another account
            </PrimaryButton>

          </div>

        </Panel>

      </div>
    );
  }

  return (
    <div className="space-y-5">

      <PageHeader
        eyebrow="Clinic workforce"
        title="Register staff"
        description="Create Nurse or Proxy accounts for your assigned clinic. Login credentials are generated by the backend and sent directly to the staff member's email."
        meta={
          <span>
            Assigned clinic:{" "}
            {adminProfile
              ?.clinicName ||
              "Clinic"}
          </span>
        }
      />

      {error ? (
        <Notice type="error">
          {error}
        </Notice>
      ) : null}

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-5"
      >

        <Panel
          title="Account type"
          description="Choose the clinic workforce profile to create."
        >

          <div className="inline-flex border border-slate-300 bg-slate-50 p-1">

            {[
              "Nurse",
              "Proxy",
            ].map(
              item => (
                <button
                  key={
                    item
                  }
                  type="button"
                  onClick={() =>
                    resetForRole(
                      item
                    )
                  }
                  className={`px-5 py-2 text-sm font-medium transition ${
                    form.role ===
                    item
                      ? "bg-white text-[#0f766e] shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {item}
                </button>
              )
            )}

          </div>

        </Panel>

        <Panel>

          <div className="space-y-6">

            <section className="space-y-4">

              <SectionHeading
                title="Personal details"
                description="Identifying and contact information for the new account."
              />

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
                  required
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
                  inputMode="numeric"
                  maxLength={
                    13
                  }
                  required
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
                  required
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
                  required
                />

                {form.role ===
                "Nurse" ? (
                  <InputField
                    label="Date of birth"
                    type="date"
                    value={
                      form.dateOfBirth
                    }
                    onChange={
                      event =>
                        setField(
                          "dateOfBirth",
                          event.target
                            .value
                        )
                    }
                    error={
                      errors.dateOfBirth
                    }
                    required
                  />
                ) : (
                  <div className="border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-500">
                    Proxy date of birth is derived from the SA ID number by the existing registration flow.
                  </div>
                )}

                <SelectField
                  label="Gender"
                  value={
                    form.gender
                  }
                  onChange={
                    event =>
                      setField(
                        "gender",
                        event.target
                          .value
                      )
                  }
                  error={
                    errors.gender
                  }
                >

                  <option value="">
                    Select gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </SelectField>

              </div>

            </section>

            <section className="space-y-4">

              <SectionHeading
                title="Clinic assignment"
                description="Staff created here are automatically attached to your Clinic Administrator assignment."
              />

              <div className="border border-teal-200 bg-teal-50 px-4 py-3">

                <p className="text-[11px] font-medium uppercase tracking-wide text-teal-700">
                  Assigned clinic
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-950">
                  {adminProfile
                    ?.clinicName ||
                    "Assigned clinic"}
                </p>

              </div>

            </section>

            {form.role ===
            "Nurse" ? (
              <section className="space-y-4">

                <SectionHeading
                  title="Professional details"
                  description="Nursing registration and employment information."
                />

                <div className="grid gap-4 md:grid-cols-2">

                  <InputField
                    label="Employee number"
                    value={
                      form.employeeNumber
                    }
                    onChange={
                      event =>
                        setField(
                          "employeeNumber",
                          event.target
                            .value
                        )
                    }
                    error={
                      errors.employeeNumber
                    }
                    required
                  />

                  <InputField
                    label="Professional registration number"
                    value={
                      form.registrationNumber
                    }
                    onChange={
                      event =>
                        setField(
                          "registrationNumber",
                          event.target
                            .value
                        )
                    }
                    error={
                      errors.registrationNumber
                    }
                    required
                  />

                  <InputField
                    label="Qualification"
                    value={
                      form.qualification
                    }
                    onChange={
                      event =>
                        setField(
                          "qualification",
                          event.target
                            .value
                        )
                    }
                    error={
                      errors.qualification
                    }
                    required
                  />

                  <InputField
                    label="Employment date"
                    type="date"
                    value={
                      form.employmentDate
                    }
                    onChange={
                      event =>
                        setField(
                          "employmentDate",
                          event.target
                            .value
                        )
                    }
                    error={
                      errors.employmentDate
                    }
                    required
                  />

                </div>

              </section>
            ) : null}

            <section className="space-y-4">

              <SectionHeading
                title="Address"
                description="Residential information for the staff profile."
              />

              <div className="grid gap-4 md:grid-cols-2">

                <div className="md:col-span-2">
                  <InputField
                    label="Address line 1"
                    value={
                      form.addressLine1
                    }
                    onChange={
                      event =>
                        setField(
                          "addressLine1",
                          event.target
                            .value
                        )
                    }
                    error={
                      errors.addressLine1
                    }
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <InputField
                    label="Address line 2 (optional)"
                    value={
                      form.addressLine2
                    }
                    onChange={
                      event =>
                        setField(
                          "addressLine2",
                          event.target
                            .value
                        )
                    }
                  />
                </div>

                <InputField
                  label="Suburb"
                  value={
                    form.suburb
                  }
                  onChange={
                    event =>
                      setField(
                        "suburb",
                        event.target
                          .value
                      )
                  }
                  error={
                    errors.suburb
                  }
                  required
                />

                <InputField
                  label="City"
                  value={
                    form.city
                  }
                  onChange={
                    event =>
                      setField(
                        "city",
                        event.target
                          .value
                      )
                  }
                  error={
                    errors.city
                  }
                  required
                />

                <InputField
                  label="Province"
                  value={
                    form.province
                  }
                  onChange={
                    event =>
                      setField(
                        "province",
                        event.target
                          .value
                      )
                  }
                  error={
                    errors.province
                  }
                  required
                />

                <InputField
                  label="Postal code"
                  value={
                    form.postalCode
                  }
                  onChange={
                    event =>
                      setField(
                        "postalCode",
                        event.target
                          .value
                      )
                  }
                  error={
                    errors.postalCode
                  }
                  required
                />

              </div>

            </section>

            <section className="space-y-4">

              <SectionHeading
                title="Emergency contact"
                description="A contact to use if the staff member cannot be reached during an emergency."
              />

              <div className="grid gap-4 md:grid-cols-2">

                <div className="md:col-span-2">
                  <InputField
                    label="Emergency contact name"
                    value={
                      form.emergencyContactName
                    }
                    onChange={
                      event =>
                        setField(
                          "emergencyContactName",
                          event.target
                            .value
                        )
                    }
                    error={
                      errors.emergencyContactName
                    }
                    required
                  />
                </div>

                <InputField
                  label="Emergency contact number"
                  value={
                    form.emergencyContactPhone
                  }
                  onChange={
                    event =>
                      setField(
                        "emergencyContactPhone",
                        event.target
                          .value
                      )
                  }
                  error={
                    errors.emergencyContactPhone
                  }
                  inputMode="tel"
                  required
                />

                <InputField
                  label="Relationship"
                  value={
                    form.emergencyContactRelationship
                  }
                  onChange={
                    event =>
                      setField(
                        "emergencyContactRelationship",
                        event.target
                          .value
                      )
                  }
                  error={
                    errors.emergencyContactRelationship
                  }
                  required
                />

              </div>

            </section>

            <Notice type="info">
              PhilaLink will generate a temporary password on the server and email it directly to the staff member. The Clinic Administrator will never see the password.
            </Notice>

          </div>

        </Panel>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">

          <SecondaryButton
            type="button"
            onClick={() =>
              resetForRole(
                form.role
              )
            }
            disabled={
              loading
            }
          >
            Clear form
          </SecondaryButton>

          <PrimaryButton
            type="submit"
            disabled={
              loading ||
              !form.clinicId
            }
          >
            <UserPlus
              size={15}
            />

            {loading
              ? "Creating account…"
              : `Register ${form.role}`}
          </PrimaryButton>

        </div>

      </form>

    </div>
  );
}
