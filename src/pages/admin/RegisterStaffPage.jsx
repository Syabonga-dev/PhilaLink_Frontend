import { useState } from "react";
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
import { useToast } from "../../components/ui/Toast.jsx";
import { useApi } from "../../lib/useApi.js";
import { adminApi } from "../../services/api/admin.js";
import { clinicsApi } from "../../services/api/clinics.js";
import { ApiError } from "../../services/api/client.js";

const initialForm = {
  role: "Nurse",

  fullName: "",
  idNumber: "",
  phoneNumber: "",
  email: "",

  dateOfBirth: "",
  gender: "",

  addressLine1: "",
  addressLine2: "",
  suburb: "",
  city: "",
  province: "",
  postalCode: "",

  emergencyContactName: "",
  emergencyContactPhone: "",
  emergencyContactRelationship: "",

  employeeNumber: "",
  registrationNumber: "",
  qualification: "",
  clinicId: "",
  employmentDate: "",

  relationshipToPatient: "",
};

function mapApiErrors(errors) {
  const mapped = {};

  if (!errors) {
    return mapped;
  }

  Object.entries(errors).forEach(
    ([key, messages]) => {
      const field =
        key.charAt(0).toLowerCase() +
        key.slice(1);

      mapped[field] =
        Array.isArray(messages)
          ? messages[0]
          : messages;
    }
  );

  return mapped;
}

export default function RegisterStaffPage() {
  const [form, setForm] =
    useState(initialForm);

  const [errors, setErrors] =
    useState({});

  const [loading, setLoading] =
    useState(false);

  const [
    createdAccount,
    setCreatedAccount,
  ] = useState(null);

  const toast = useToast();

  const {
    data: clinics,
    loading: clinicsLoading,
    error: clinicsError,
    refetch: refetchClinics,
  } = useApi(
    () =>
      clinicsApi.getAll(),
    []
  );

  const clinicList =
    Array.isArray(clinics)
      ? clinics.filter(
          (clinic) =>
            clinic?.isActive !== false
        )
      : [];

  const set =
    (key) => (event) => {
      const value =
        event.target.value;

      setForm((current) => ({
        ...current,
        [key]: value,
      }));

      setErrors((current) => ({
        ...current,
        [key]: undefined,
      }));
    };

  const setRole = (role) => {
    setForm({
      ...initialForm,
      role,
    });

    setErrors({});
    setCreatedAccount(null);
  };

  const validate = () => {
    const next = {};

    if (!form.fullName.trim()) {
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

    if (!form.email.trim()) {
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

    if (!form.dateOfBirth) {
      next.dateOfBirth =
        "Enter the date of birth.";
    }

    if (!form.gender) {
      next.gender =
        "Select a gender.";
    }

    if (
      !form.addressLine1.trim()
    ) {
      next.addressLine1 =
        "Enter the street address.";
    }

    if (!form.suburb.trim()) {
      next.suburb =
        "Enter the suburb.";
    }

    if (!form.city.trim()) {
      next.city =
        "Enter the city.";
    }

    if (!form.province.trim()) {
      next.province =
        "Enter the province.";
    }

    if (
      !form.postalCode.trim()
    ) {
      next.postalCode =
        "Enter the postal code.";
    }

    if (
      !form.emergencyContactName.trim()
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
      !form.emergencyContactRelationship.trim()
    ) {
      next.emergencyContactRelationship =
        "Enter the emergency contact relationship.";
    }

    /*
     * BOTH Nurses and Proxies must belong to a clinic.
     */
    if (!form.clinicId) {
      next.clinicId =
        form.role === "Proxy"
          ? "Select the clinic where this Proxy is registered."
          : "Select a clinic.";
    }

    if (
      form.role === "Nurse"
    ) {
      if (
        !form.employeeNumber.trim()
      ) {
        next.employeeNumber =
          "Enter an employee number.";
      }

      if (
        !form.registrationNumber.trim()
      ) {
        next.registrationNumber =
          "Enter the professional registration number.";
      }

      if (
        !form.qualification.trim()
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

    if (
      form.role === "Proxy" &&
      !form.relationshipToPatient.trim()
    ) {
      next.relationshipToPatient =
        "Enter the relationship to the patient.";
    }

    setErrors(next);

    return (
      Object.keys(next).length ===
      0
    );
  };

  const buildPayload = () => {
    const shared = {
      fullName:
        form.fullName.trim(),

      idNumber:
        form.idNumber.trim(),

      phoneNumber:
        form.phoneNumber.trim(),

      email:
        form.email.trim(),

      /*
       * ClinicId is now required for
       * both Nurse and Proxy accounts.
       */
      clinicId:
        form.clinicId,

      addressLine1:
        form.addressLine1.trim(),

      addressLine2:
        form.addressLine2.trim() ||
        null,

      suburb:
        form.suburb.trim(),

      city:
        form.city.trim(),

      province:
        form.province.trim(),

      postalCode:
        form.postalCode.trim(),

      dateOfBirth:
        form.dateOfBirth,

      gender:
        form.gender,

      emergencyContactName:
        form.emergencyContactName.trim(),

      emergencyContactPhone:
        form.emergencyContactPhone.trim(),

      emergencyContactRelationship:
        form.emergencyContactRelationship.trim(),
    };

    if (
      form.role === "Nurse"
    ) {
      return {
        ...shared,

        employeeNumber:
          form.employeeNumber.trim(),

        registrationNumber:
          form.registrationNumber.trim(),

        qualification:
          form.qualification.trim(),

        employmentDate:
          form.employmentDate,
      };
    }

    return {
      ...shared,

      relationshipToPatient:
        form.relationshipToPatient.trim(),
    };
  };

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      if (!validate()) {
        return;
      }

      setLoading(true);
      setCreatedAccount(null);

      try {
        const payload =
          buildPayload();

        const result =
          form.role === "Nurse"
            ? await adminApi.registerNurse(
                payload
              )
            : await adminApi.registerProxy(
                payload
              );

        setCreatedAccount(
          result
        );

        toast.success(
          `${form.role} account created successfully.`
        );
      } catch (error) {
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
        setLoading(false);
      }
    };

  const resetForm = () => {
    const currentRole =
      form.role;

    setForm({
      ...initialForm,
      role: currentRole,
    });

    setErrors({});
    setCreatedAccount(null);
  };

  if (createdAccount) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardHeader
          title="Account created"
          subtitle="Save these login details now. The temporary password is only returned once."
        />

        <CardBody>
          <div className="space-y-4">
            <div className="rounded-lg border border-outline-variant/60 bg-surface-container-low p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-on-surface-variant">
                    Full name
                  </p>

                  <p className="mt-1 font-semibold text-on-surface">
                    {createdAccount.fullName ||
                      "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-on-surface-variant">
                    Role
                  </p>

                  <p className="mt-1 font-semibold text-on-surface">
                    {createdAccount.role ||
                      form.role}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-on-surface-variant">
                    ID number
                  </p>

                  <p className="mt-1 font-semibold text-on-surface">
                    {createdAccount.idNumber ||
                      "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-on-surface-variant">
                    User ID
                  </p>

                  <p className="mt-1 break-all font-mono text-sm text-on-surface">
                    {createdAccount.userId ||
                      "—"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-warning/40 bg-warning/10 p-4">
              <p className="text-sm font-semibold text-on-surface">
                Temporary password
              </p>

              <p className="mt-2 break-all font-mono text-lg font-bold text-on-surface">
                {
                  createdAccount.temporaryPassword
                }
              </p>

              <p className="mt-2 text-xs text-on-surface-variant">
                Share this securely
                with the account
                holder. It cannot be
                retrieved again after
                registration.
              </p>
            </div>

            <Button
              type="button"
              className="w-full"
              onClick={resetForm}
            >
              Register another account
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader
        title="Register a Nurse or Proxy account"
        subtitle="Patient self-registration is separate. Nurse and Proxy accounts must be assigned to a clinic."
      />

      <CardBody>
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid grid-cols-2 gap-2 rounded-md bg-surface-container-low p-1">
            {[
              "Nurse",
              "Proxy",
            ].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() =>
                  setRole(role)
                }
                className={`flex items-center justify-center gap-2 rounded-md px-3 py-2.5 text-sm font-semibold transition-colors ${
                  form.role === role
                    ? "bg-white text-primary shadow-card"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {role ===
                  "Nurse"
                    ? "medical_services"
                    : "family_restroom"}
                </span>

                {role}
              </button>
            ))}
          </div>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-on-surface">
              Personal details
            </h3>

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

            <div className="grid gap-4 sm:grid-cols-2">
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
                inputMode="numeric"
                maxLength={13}
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
            </div>

            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={set(
                "email"
              )}
              error={errors.email}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Date of birth"
                type="date"
                value={
                  form.dateOfBirth
                }
                onChange={set(
                  "dateOfBirth"
                )}
                error={
                  errors.dateOfBirth
                }
              />

              <Select
                label="Gender"
                value={form.gender}
                onChange={set(
                  "gender"
                )}
                error={errors.gender}
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
            <h3 className="text-sm font-semibold text-on-surface">
              Clinic
            </h3>

            <p className="text-sm text-on-surface-variant">
              {form.role === "Proxy"
                ? "The Proxy will only be able to manage linked patients and collections from this clinic."
                : "Select the clinic where this Nurse works."}
            </p>

            {clinicsLoading ? (
              <div className="rounded-md border border-outline-variant/60 p-4">
                <Spinner label="Loading clinics…" />
              </div>
            ) : clinicsError ? (
              <ErrorState
                description={
                  clinicsError.message
                }
                onRetry={
                  refetchClinics
                }
              />
            ) : clinicList.length ===
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
              <h3 className="text-sm font-semibold text-on-surface">
                Nurse details
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Employee number"
                  value={
                    form.employeeNumber
                  }
                  onChange={set(
                    "employeeNumber"
                  )}
                  error={
                    errors.employeeNumber
                  }
                />

                <Input
                  label="Registration number"
                  value={
                    form.registrationNumber
                  }
                  onChange={set(
                    "registrationNumber"
                  )}
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
                onChange={set(
                  "qualification"
                )}
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
                onChange={set(
                  "employmentDate"
                )}
                error={
                  errors.employmentDate
                }
              />
            </section>
          )}

          {form.role ===
            "Proxy" && (
            <section className="space-y-4">
              <h3 className="text-sm font-semibold text-on-surface">
                Proxy details
              </h3>

              <Input
                label="Relationship to patient"
                value={
                  form.relationshipToPatient
                }
                onChange={set(
                  "relationshipToPatient"
                )}
                error={
                  errors.relationshipToPatient
                }
                placeholder="Parent, spouse, sibling, caregiver…"
              />
            </section>
          )}

          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-on-surface">
              Address
            </h3>

            <Input
              label="Address line 1"
              value={
                form.addressLine1
              }
              onChange={set(
                "addressLine1"
              )}
              error={
                errors.addressLine1
              }
            />

            <Input
              label="Address line 2 (optional)"
              value={
                form.addressLine2
              }
              onChange={set(
                "addressLine2"
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Suburb"
                value={
                  form.suburb
                }
                onChange={set(
                  "suburb"
                )}
                error={
                  errors.suburb
                }
              />

              <Input
                label="City"
                value={form.city}
                onChange={set(
                  "city"
                )}
                error={errors.city}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Province"
                value={
                  form.province
                }
                onChange={set(
                  "province"
                )}
                error={
                  errors.province
                }
              />

              <Input
                label="Postal code"
                value={
                  form.postalCode
                }
                onChange={set(
                  "postalCode"
                )}
                error={
                  errors.postalCode
                }
                inputMode="numeric"
              />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-on-surface">
              Emergency contact
            </h3>

            <Input
              label="Emergency contact name"
              value={
                form.emergencyContactName
              }
              onChange={set(
                "emergencyContactName"
              )}
              error={
                errors.emergencyContactName
              }
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Emergency contact phone"
                value={
                  form.emergencyContactPhone
                }
                onChange={set(
                  "emergencyContactPhone"
                )}
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
                onChange={set(
                  "emergencyContactRelationship"
                )}
                error={
                  errors.emergencyContactRelationship
                }
              />
            </div>
          </section>

          <Button
            type="submit"
            className="w-full"
            loading={loading}
            disabled={
              clinicsLoading ||
              Boolean(clinicsError) ||
              clinicList.length ===
                0
            }
          >
            {loading
              ? "Creating account…"
              : `Create ${form.role} account`}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}