import {
  useEffect,
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
  ErrorState,
  EmptyState,
} from "../../components/ui/EmptyState.jsx";

import {
  useToast,
} from "../../components/ui/Toast.jsx";

import {
  useAuth,
} from "../../context/AuthContext.jsx";

import {
  adminApi,
} from "../../services/api/admin.js";

import {
  clinicsApi,
} from "../../services/api/clinics.js";

import {
  ApiError,
} from "../../services/api/client.js";

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
    ([key, messages]) => {
      const field =
        key.charAt(0)
          .toLowerCase() +
        key.slice(1);

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

function SectionTitle({
  children,
  description,
}) {
  return (
    <div>
      <h3 className="text-sm font-bold text-slate-900">
        {children}
      </h3>

      {description && (
        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}

function ClinicLockedCard({
  clinicName,
}) {
  return (
    <div className="rounded-2xl border border-teal-200 bg-teal-50/70 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#0f766e] text-white">
          <span className="material-symbols-outlined text-[20px]">
            local_hospital
          </span>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-teal-700">
            Assigned clinic
          </p>

          <p className="mt-1 text-sm font-bold text-slate-950">
            {clinicName ||
              "Your assigned clinic"}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Staff registered by a Clinic Administrator are automatically attached to this clinic.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterStaffPage() {
  const {
    role,
  } =
    useAuth();

  const isClinicAdmin =
    role ===
    "ClinicAdmin";

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
    clinics,
    setClinics,
  ] =
    useState([]);

  const [
    createdAccount,
    setCreatedAccount,
  ] =
    useState(null);

  const toast =
    useToast();

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

          setAdminProfile(
            me
          );

          if (
            isClinicAdmin
          ) {
            if (
              !me?.clinicId
            ) {
              throw new Error(
                "Your Clinic Administrator account does not have an assigned clinic."
              );
            }

            setForm(
              current => ({
                ...current,
                clinicId:
                  me.clinicId,
              })
            );

            setClinics([]);
          } else {
            const result =
              await clinicsApi
                .getAll();

            if (!active) {
              return;
            }

            setClinics(
              Array.isArray(
                result
              )
                ? result.filter(
                    clinic =>
                      clinic?.isActive !==
                      false
                  )
                : []
            );
          }
        } catch (
          error
        ) {
          if (
            active
          ) {
            setProfileError(
              error?.message ||
                "Could not load registration context."
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
    [
      isClinicAdmin,
    ]
  );

  const set =
    key =>
    event => {
      const value =
        event.target
          .value;

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
    };

  function resetForRole(
    nextRole
  ) {
    setForm({
      ...EMPTY_FORM,
      role:
        nextRole,
      clinicId:
        isClinicAdmin
          ? adminProfile
              ?.clinicId ||
            ""
          : "",
    });

    setErrors({});

    setCreatedAccount(
      null
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
      !form.email.trim()
    ) {
      next.email =
        "Enter an email address.";
    } else if (
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
      !form.suburb.trim()
    ) {
      next.suburb =
        "Enter the suburb.";
    }

    if (
      !form.city.trim()
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
        isClinicAdmin
          ? "Your Clinic Administrator account must have an assigned clinic."
          : "Select a clinic.";
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

    return (
      Object.keys(
        next
      ).length ===
      0
    );
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
        form.clinicId,

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

      toast.success(
        `${form.role} account created successfully.`
      );
    } catch (
      error
    ) {
      if (
        error instanceof
          ApiError &&
        error.errors
      ) {
        setErrors(
          mapApiErrors(
            error.errors
          )
        );
      }

      toast.error(
        error?.message ||
          "Couldn't create the account. Please try again."
      );
    } finally {
      setLoading(
        false
      );
    }
  }

  function resetForm() {
    resetForRole(
      form.role
    );
  }

  if (
    profileLoading
  ) {
    return (
      <div className="mx-auto max-w-4xl rounded-[28px] border border-slate-200 bg-white p-12">
        <Spinner label="Loading clinic registration details…" />
      </div>
    );
  }

  if (
    profileError
  ) {
    return (
      <div className="mx-auto max-w-4xl">
        <ErrorState
          description={
            profileError
          }
        />
      </div>
    );
  }

  if (
    createdAccount
  ) {
    return (
      <Card className="mx-auto max-w-2xl overflow-hidden border-teal-100">
        <div className="h-2 bg-[#0f766e]" />

        <CardHeader
          title="Account created"
          subtitle="Save these login details now. The temporary password is only returned once."
        />

        <CardBody>
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Full name
                  </p>

                  <p className="mt-1 font-semibold text-slate-950">
                    {createdAccount.fullName ||
                      form.fullName ||
                      "—"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Role
                  </p>

                  <p className="mt-1 font-semibold text-slate-950">
                    {createdAccount.role ||
                      form.role}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Clinic
                  </p>

                  <p className="mt-1 font-semibold text-slate-950">
                    {isClinicAdmin
                      ? adminProfile
                          ?.clinicName ||
                        "Assigned clinic"
                      : clinics.find(
                          clinic =>
                            clinic.id ===
                            form.clinicId
                        )?.name ||
                        "—"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    User ID
                  </p>

                  <p className="mt-1 break-all font-mono text-sm text-slate-700">
                    {createdAccount.userId ||
                      "—"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-bold text-slate-950">
                Temporary password
              </p>

              <p className="mt-2 break-all font-mono text-lg font-bold text-[#0f766e]">
                {createdAccount.temporaryPassword ||
                  "—"}
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Share this securely with the account holder. It cannot be retrieved again after registration.
              </p>
            </div>

            <Button
              type="button"
              className="w-full"
              onClick={
                resetForm
              }
            >
              Register another account
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <section className="rounded-[30px] border border-teal-100 bg-gradient-to-br from-teal-100 via-[#f1fffc] to-white p-6 sm:p-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-700">
          Clinic workforce
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
          Register staff
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Create Nurse or Proxy accounts. Clinic Administrators register people directly into their own assigned clinic.
        </p>
      </section>

      <Card className="border-slate-200">
        <CardBody>
          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-8"
          >
            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
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
                    className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition ${{
                      Nurse:
                        form.role ===
                        "Nurse",
                      Proxy:
                        form.role ===
                        "Proxy",
                    }[item]
                      ? "bg-white text-[#0f766e] shadow-sm ring-1 ring-teal-100"
                      : "text-slate-500 hover:text-slate-800"}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {item ===
                      "Nurse"
                        ? "medical_services"
                        : "family_restroom"}
                    </span>

                    {item}
                  </button>
                )
              )}
            </div>

            <section className="space-y-4">
              <SectionTitle description="The account holder's identifying and contact information.">
                Personal details
              </SectionTitle>

              <Input
                label="Full name"
                value={
                  form.fullName
                }
                onChange={
                  set(
                    "fullName"
                  )
                }
                error={
                  errors.fullName
                }
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="SA ID number"
                  value={
                    form.idNumber
                  }
                  onChange={
                    set(
                      "idNumber"
                    )
                  }
                  error={
                    errors.idNumber
                  }
                  inputMode="numeric"
                  maxLength={13}
                />

                <Input
                  label="Cellphone number"
                  value={
                    form.phoneNumber
                  }
                  onChange={
                    set(
                      "phoneNumber"
                    )
                  }
                  error={
                    errors.phoneNumber
                  }
                  inputMode="tel"
                />
              </div>

              <Input
                label="Email"
                type="email"
                value={
                  form.email
                }
                onChange={
                  set(
                    "email"
                  )
                }
                error={
                  errors.email
                }
              />

              <div className="grid gap-4 sm:grid-cols-2">
                {form.role ===
                "Nurse" ? (
                  <Input
                    label="Date of birth"
                    type="date"
                    value={
                      form.dateOfBirth
                    }
                    onChange={
                      set(
                        "dateOfBirth"
                      )
                    }
                    error={
                      errors.dateOfBirth
                    }
                  />
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs leading-5 text-slate-500">
                    Proxy date of birth is derived from the SA ID number by the existing registration flow.
                  </div>
                )}

                <Select
                  label="Gender"
                  value={
                    form.gender
                  }
                  onChange={
                    set(
                      "gender"
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
                </Select>
              </div>
            </section>

            <section className="space-y-4">
              <SectionTitle description={
                isClinicAdmin
                  ? "Your clinic is taken from your Clinic Administrator profile and cannot be changed here."
                  : "Choose the clinic that this account should belong to."
              }>
                Clinic
              </SectionTitle>

              {isClinicAdmin ? (
                <>
                  <ClinicLockedCard
                    clinicName={
                      adminProfile
                        ?.clinicName
                    }
                  />

                  {errors.clinicId && (
                    <p className="text-xs font-medium text-red-600">
                      {errors.clinicId}
                    </p>
                  )}
                </>
              ) : clinics.length ===
                0 ? (
                <EmptyState
                  icon="local_hospital"
                  title="No active clinics available"
                  description={`A clinic must exist before a ${form.role} can be registered.`}
                />
              ) : (
                <Select
                  label="Clinic"
                  value={
                    form.clinicId
                  }
                  onChange={
                    set(
                      "clinicId"
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
                        {clinic.type
                          ? ` — ${clinic.type}`
                          : ""}
                      </option>
                    )
                  )}
                </Select>
              )}
            </section>

            {form.role ===
              "Nurse" && (
              <section className="space-y-4">
                <SectionTitle description="Professional details used for the Nurse profile.">
                  Nurse details
                </SectionTitle>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Employee number"
                    value={
                      form.employeeNumber
                    }
                    onChange={
                      set(
                        "employeeNumber"
                      )
                    }
                    error={
                      errors.employeeNumber
                    }
                  />

                  <Input
                    label="Registration number"
                    value={
                      form.registrationNumber
                    }
                    onChange={
                      set(
                        "registrationNumber"
                      )
                    }
                    error={
                      errors.registrationNumber
                    }
                  />
                </div>

                <Input
                  label="Qualification"
                  value={
                    form.qualification
                  }
                  onChange={
                    set(
                      "qualification"
                    )
                  }
                  error={
                    errors.qualification
                  }
                />

                <Input
                  label="Employment date"
                  type="date"
                  value={
                    form.employmentDate
                  }
                  onChange={
                    set(
                      "employmentDate"
                    )
                  }
                  error={
                    errors.employmentDate
                  }
                />
              </section>
            )}

            <section className="space-y-4">
              <SectionTitle description="Residential information for the staff profile.">
                Address
              </SectionTitle>

              <Input
                label="Address line 1"
                value={
                  form.addressLine1
                }
                onChange={
                  set(
                    "addressLine1"
                  )
                }
                error={
                  errors.addressLine1
                }
              />

              <Input
                label="Address line 2 (optional)"
                value={
                  form.addressLine2
                }
                onChange={
                  set(
                    "addressLine2"
                  )
                }
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Suburb"
                  value={
                    form.suburb
                  }
                  onChange={
                    set(
                      "suburb"
                    )
                  }
                  error={
                    errors.suburb
                  }
                />

                <Input
                  label="City"
                  value={
                    form.city
                  }
                  onChange={
                    set(
                      "city"
                    )
                  }
                  error={
                    errors.city
                  }
                />

                <Input
                  label="Province"
                  value={
                    form.province
                  }
                  onChange={
                    set(
                      "province"
                    )
                  }
                  error={
                    errors.province
                  }
                />

                <Input
                  label="Postal code"
                  value={
                    form.postalCode
                  }
                  onChange={
                    set(
                      "postalCode"
                    )
                  }
                  error={
                    errors.postalCode
                  }
                />
              </div>
            </section>

            <section className="space-y-4">
              <SectionTitle description="A contact to use if the account holder cannot be reached during an emergency.">
                Emergency contact
              </SectionTitle>

              <Input
                label="Emergency contact name"
                value={
                  form.emergencyContactName
                }
                onChange={
                  set(
                    "emergencyContactName"
                  )
                }
                error={
                  errors.emergencyContactName
                }
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Emergency contact number"
                  value={
                    form.emergencyContactPhone
                  }
                  onChange={
                    set(
                      "emergencyContactPhone"
                    )
                  }
                  error={
                    errors.emergencyContactPhone
                  }
                  inputMode="tel"
                />

                <Input
                  label="Relationship"
                  value={
                    form.emergencyContactRelationship
                  }
                  onChange={
                    set(
                      "emergencyContactRelationship"
                    )
                  }
                  error={
                    errors.emergencyContactRelationship
                  }
                />
              </div>
            </section>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={
                  resetForm
                }
                disabled={
                  loading
                }
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Clear form
              </button>

              <Button
                type="submit"
                disabled={
                  loading ||
                  !form.clinicId
                }
              >
                {loading
                  ? "Creating account…"
                  : `Register ${form.role}`}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
