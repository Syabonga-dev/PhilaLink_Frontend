import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Building2,
  KeyRound,
  Mail,
  MapPin,
  Save,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";

import {
  useAuth,
} from "../../context/AuthContext.jsx";

import {
  nursesApi,
} from "../../services/api/nurses.js";

const blankProfile = {
  fullName:
    "",

  phoneNumber:
    "",

  email:
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
};

export default function NurseSettingsPage() {
  const {
    user,
    setUser,
    changePassword,
  } =
    useAuth();

  const [
    profileInfo,
    setProfileInfo,
  ] =
    useState(null);

  const [
    profile,
    setProfile,
  ] =
    useState(
      blankProfile
    );

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
    passwords,
    setPasswords,
  ] =
    useState({
      currentPassword:
        "",

      newPassword:
        "",

      confirmNewPassword:
        "",
    });

  const [
    changingPassword,
    setChangingPassword,
  ] =
    useState(false);

  const [
    passwordError,
    setPasswordError,
  ] =
    useState("");

  const [
    passwordSuccess,
    setPasswordSuccess,
  ] =
    useState("");

  const load =
    useCallback(
      async () => {
        try {
          setLoading(
            true
          );

          const data =
            await nursesApi
              .getMe();

          setProfileInfo(
            data
          );

          setProfile({
            fullName:
              data?.fullName ||
              "",

            phoneNumber:
              data?.phoneNumber ||
              "",

            email:
              data?.email ||
              "",

            gender:
              data?.gender ||
              "",

            addressLine1:
              data?.addressLine1 ||
              "",

            addressLine2:
              data?.addressLine2 ||
              "",

            suburb:
              data?.suburb ||
              "",

            city:
              data?.city ||
              "",

            province:
              data?.province ||
              "",

            postalCode:
              data?.postalCode ||
              "",

            emergencyContactName:
              data?.emergencyContactName ||
              "",

            emergencyContactPhone:
              data?.emergencyContactPhone ||
              "",

            emergencyContactRelationship:
              data?.emergencyContactRelationship ||
              "",
          });
        } catch (loadError) {
          setError(
            loadError?.message ||
              "Could not load Nurse settings."
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
      load();
    },
    [
      load,
    ]
  );

  function change(
    event
  ) {
    setProfile({
      ...profile,

      [event.target.name]:
        event.target.value,
    });
  }

  async function saveProfile(
    event
  ) {
    event.preventDefault();

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

      const updated =
        await nursesApi
          .updateMe(
            profile
          );

      setProfileInfo(
        updated
      );

      if (user) {
        setUser({
          ...user,

          fullName:
            updated.fullName,

          email:
            updated.email,

          phoneNumber:
            updated.phoneNumber,
        });
      }

      setSuccess(
        "Profile updated successfully."
      );
    } catch (saveError) {
      setError(
        saveError?.message ||
          "Could not save profile."
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  async function savePassword(
    event
  ) {
    event.preventDefault();

    setPasswordError(
      ""
    );

    setPasswordSuccess(
      ""
    );

    if (
      passwords.newPassword !==
      passwords.confirmNewPassword
    ) {
      setPasswordError(
        "New passwords do not match."
      );

      return;
    }

    try {
      setChangingPassword(
        true
      );

      await changePassword(
        passwords
      );

      setPasswords({
        currentPassword:
          "",

        newPassword:
          "",

        confirmNewPassword:
          "",
      });

      setPasswordSuccess(
        "Password changed successfully."
      );
    } catch (changeError) {
      setPasswordError(
        changeError?.message ||
          "Could not change password."
      );
    } finally {
      setChangingPassword(
        false
      );
    }
  }

  if (
    loading
  ) {
    return (
      <div className="p-10 text-center text-sm text-[#64748b]">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      <div className="mx-auto max-w-[1300px]">

        <div className="mb-6">

          <h2 className="text-2xl font-bold">
            Settings
          </h2>

          <p className="mt-1 text-sm text-[#64748b]">
            Manage your Nurse account and contact information.
          </p>

        </div>

        {error && (
          <Feedback
            error
          >
            {error}
          </Feedback>
        )}

        {success && (
          <Feedback>
            {success}
          </Feedback>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">

          <form
            onSubmit={
              saveProfile
            }
            className="space-y-6"
          >

            <SettingsSection
              icon={
                UserRound
              }
              title="Personal information"
              description="Your PhilaLink Nurse account details."
            >

              <div className="grid gap-5 sm:grid-cols-2">

                <Field
                  label="Full name"
                  name="fullName"
                  value={
                    profile.fullName
                  }
                  onChange={
                    change
                  }
                  required
                />

                <Field
                  label="Phone number"
                  name="phoneNumber"
                  value={
                    profile.phoneNumber
                  }
                  onChange={
                    change
                  }
                  required
                />

                <Field
                  label="Email"
                  type="email"
                  name="email"
                  value={
                    profile.email
                  }
                  onChange={
                    change
                  }
                  required
                />

                <div>

                  <label className="mb-2 block text-sm font-medium text-[#334155]">
                    Gender
                  </label>

                  <select
                    name="gender"
                    value={
                      profile.gender
                    }
                    onChange={
                      change
                    }
                    className="h-11 w-full rounded-xl border border-[#cbd5e1] px-3 text-sm outline-none focus:border-[#0f766e]"
                  >
                    <option value="">
                      Select
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
                  </select>

                </div>

              </div>

            </SettingsSection>

            <SettingsSection
              icon={
                MapPin
              }
              title="Address"
              description="Residential or contact address."
            >

              <div className="grid gap-5 sm:grid-cols-2">

                <div className="sm:col-span-2">

                  <Field
                    label="Address line 1"
                    name="addressLine1"
                    value={
                      profile.addressLine1
                    }
                    onChange={
                      change
                    }
                  />

                </div>

                <div className="sm:col-span-2">

                  <Field
                    label="Address line 2"
                    name="addressLine2"
                    value={
                      profile.addressLine2
                    }
                    onChange={
                      change
                    }
                  />

                </div>

                <Field
                  label="Suburb"
                  name="suburb"
                  value={
                    profile.suburb
                  }
                  onChange={
                    change
                  }
                />

                <Field
                  label="City"
                  name="city"
                  value={
                    profile.city
                  }
                  onChange={
                    change
                  }
                />

                <Field
                  label="Province"
                  name="province"
                  value={
                    profile.province
                  }
                  onChange={
                    change
                  }
                />

                <Field
                  label="Postal code"
                  name="postalCode"
                  value={
                    profile.postalCode
                  }
                  onChange={
                    change
                  }
                />

              </div>

            </SettingsSection>

            <SettingsSection
              icon={
                UsersRound
              }
              title="Emergency contact"
              description="Emergency contact details."
            >

              <div className="grid gap-5 sm:grid-cols-2">

                <Field
                  label="Contact name"
                  name="emergencyContactName"
                  value={
                    profile.emergencyContactName
                  }
                  onChange={
                    change
                  }
                />

                <Field
                  label="Contact phone"
                  name="emergencyContactPhone"
                  value={
                    profile.emergencyContactPhone
                  }
                  onChange={
                    change
                  }
                />

                <div className="sm:col-span-2">

                  <Field
                    label="Relationship"
                    name="emergencyContactRelationship"
                    value={
                      profile.emergencyContactRelationship
                    }
                    onChange={
                      change
                    }
                  />

                </div>

              </div>

            </SettingsSection>

            <div className="flex justify-end">

              <button
                type="submit"
                disabled={
                  saving
                }
                className="inline-flex items-center gap-2 rounded-xl bg-[#0f766e] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                <Save
                  size={16}
                />

                {saving
                  ? "Saving..."
                  : "Save profile"}
              </button>

            </div>

          </form>

          <aside className="space-y-6">

            {/* PROFESSIONAL DETAILS */}

            <section className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white">

              <div className="border-b border-[#e2e8f0] p-5">

                <h3 className="font-semibold">
                  Professional details
                </h3>

                <p className="mt-1 text-sm text-[#64748b]">
                  Managed administratively.
                </p>

              </div>

              <div className="space-y-5 p-5">

                <Info
                  icon={
                    ShieldCheck
                  }
                  label="Employee number"
                  value={
                    profileInfo?.employeeNumber
                  }
                />

                <Info
                  icon={
                    ShieldCheck
                  }
                  label="Registration number"
                  value={
                    profileInfo?.registrationNumber
                  }
                />

                <Info
                  icon={
                    ShieldCheck
                  }
                  label="Qualification"
                  value={
                    profileInfo?.qualification
                  }
                />

                <Info
                  icon={
                    Building2
                  }
                  label="Clinic"
                  value={
                    profileInfo?.clinicName
                  }
                />

                <Info
                  icon={
                    Mail
                  }
                  label="ID number"
                  value={
                    profileInfo?.idNumber
                  }
                />

              </div>

            </section>

            {/* SECURITY */}

            <form
              onSubmit={
                savePassword
              }
              className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white"
            >

              <div className="border-b border-[#e2e8f0] p-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ccfbf1] text-[#0f766e]">
                    <KeyRound
                      size={18}
                    />
                  </div>

                  <div>

                    <h3 className="font-semibold">
                      Security
                    </h3>

                    <p className="text-sm text-[#64748b]">
                      Change password.
                    </p>

                  </div>

                </div>

              </div>

              <div className="space-y-4 p-5">

                {passwordError && (
                  <Feedback
                    error
                  >
                    {passwordError}
                  </Feedback>
                )}

                {passwordSuccess && (
                  <Feedback>
                    {passwordSuccess}
                  </Feedback>
                )}

                <Field
                  type="password"
                  label="Current password"
                  name="currentPassword"
                  value={
                    passwords.currentPassword
                  }
                  onChange={(
                    event
                  ) =>
                    setPasswords({
                      ...passwords,

                      currentPassword:
                        event.target
                          .value,
                    })
                  }
                />

                <Field
                  type="password"
                  label="New password"
                  name="newPassword"
                  value={
                    passwords.newPassword
                  }
                  onChange={(
                    event
                  ) =>
                    setPasswords({
                      ...passwords,

                      newPassword:
                        event.target
                          .value,
                    })
                  }
                />

                <Field
                  type="password"
                  label="Confirm password"
                  name="confirmNewPassword"
                  value={
                    passwords.confirmNewPassword
                  }
                  onChange={(
                    event
                  ) =>
                    setPasswords({
                      ...passwords,

                      confirmNewPassword:
                        event.target
                          .value,
                    })
                  }
                />

                <button
                  type="submit"
                  disabled={
                    changingPassword
                  }
                  className="w-full rounded-xl border border-[#0f766e] px-4 py-2.5 text-sm font-semibold text-[#0f766e]"
                >
                  {changingPassword
                    ? "Changing..."
                    : "Change password"}
                </button>

              </div>

            </form>

          </aside>

        </div>

      </div>

    </div>
  );
}

function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white">

      <div className="border-b border-[#e2e8f0] p-5 sm:px-6">

        <div className="flex items-start gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ccfbf1] text-[#0f766e]">
            <Icon
              size={18}
            />
          </div>

          <div>

            <h3 className="font-semibold">
              {title}
            </h3>

            <p className="mt-1 text-sm text-[#64748b]">
              {description}
            </p>

          </div>

        </div>

      </div>

      <div className="p-5 sm:p-6">
        {children}
      </div>

    </section>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}) {
  return (
    <div>

      <label
        htmlFor={
          name
        }
        className="mb-2 block text-sm font-medium text-[#334155]"
      >
        {label}
      </label>

      <input
        id={
          name
        }
        name={
          name
        }
        type={
          type
        }
        value={
          value
        }
        required={
          required
        }
        onChange={
          onChange
        }
        className="h-11 w-full rounded-xl border border-[#cbd5e1] px-3 text-sm outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10"
      />

    </div>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex gap-3">

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f1f5f9] text-[#64748b]">
        <Icon
          size={15}
        />
      </div>

      <div>

        <p className="text-xs text-[#94a3b8]">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-[#334155]">
          {value ||
            "—"}
        </p>

      </div>

    </div>
  );
}

function Feedback({
  children,
  error = false,
}) {
  return (
    <div
      className={[
        "rounded-xl p-3 text-sm",
        error
          ? "bg-[#fef2f2] text-[#b91c1c]"
          : "bg-[#f0fdf4] text-[#166534]",
      ].join(
        " "
      )}
    >
      {children}
    </div>
  );
}
