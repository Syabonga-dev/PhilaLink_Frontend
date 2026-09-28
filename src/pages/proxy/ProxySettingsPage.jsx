import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  IdCard,
  KeyRound,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Save,
  ShieldCheck,
  User,
  UsersRound,
} from "lucide-react";

import {
  useAuth,
} from "../../context/AuthContext.jsx";

import {
  proxiesApi,
} from "../../services/api/proxies.js";

import IdentityEditor from "../../components/account/IdentityEditor.jsx";

/* ========================================================= */
/* INITIAL STATE                                             */
/* ========================================================= */

const emptyProfile = {
  fullName:
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
};

const emptyPasswords = {
  currentPassword:
    "",

  newPassword:
    "",

  confirmNewPassword:
    "",
};

/* ========================================================= */
/* HELPERS                                                   */
/* ========================================================= */

function valueOrEmpty(
  value
) {
  return value ?? "";
}

function dateInputValue(
  value
) {
  if (!value) {
    return "";
  }

  const text =
    String(value);

  if (
    /^\d{4}-\d{2}-\d{2}/.test(
      text
    )
  ) {
    return text.slice(
      0,
      10
    );
  }

  const parsed =
    new Date(value);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return "";
  }

  return parsed
    .toISOString()
    .slice(
      0,
      10
    );
}

function formatDate(
  value
) {
  if (!value) {
    return "—";
  }

  const parsed =
    new Date(value);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return "—";
  }

  return parsed.toLocaleDateString(
    "en-ZA",
    {
      day:
        "numeric",

      month:
        "short",

      year:
        "numeric",
    }
  );
}

function passwordRequirements(
  password
) {
  return {
    length:
      password.length >=
      12,

    uppercase:
      /[A-Z]/.test(
        password
      ),

    lowercase:
      /[a-z]/.test(
        password
      ),

    number:
      /\d/.test(
        password
      ),

    special:
      /[^A-Za-z0-9]/.test(
        password
      ),
  };
}

function passwordIsValid(
  password
) {
  return Object
    .values(
      passwordRequirements(
        password
      )
    )
    .every(Boolean);
}

/* ========================================================= */
/* PAGE                                                      */
/* ========================================================= */

export default function ProxySettingsPage() {
  const {
    user,
    setUser,
    changePassword,
  } = useAuth();

  const [
    profileInfo,
    setProfileInfo,
  ] = useState(null);

  const [
    profile,
    setProfile,
  ] = useState(
    emptyProfile
  );

  const [
    passwords,
    setPasswords,
  ] = useState(
    emptyPasswords
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    changingPassword,
    setChangingPassword,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const [
    passwordError,
    setPasswordError,
  ] = useState("");

  const [
    passwordSuccess,
    setPasswordSuccess,
  ] = useState("");

  const [
    showCurrentPassword,
    setShowCurrentPassword,
  ] = useState(false);

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  /* ===================================================== */
  /* LOAD PROFILE                                          */
  /* ===================================================== */

  const loadProfile =
    useCallback(
      async () => {
        try {
          setLoading(
            true
          );

          setError(
            ""
          );

          const data =
            await proxiesApi
              .getProfile();

          setProfileInfo(
            data
          );

          setProfile({
            fullName:
              valueOrEmpty(
                data?.fullName
              ),

            phoneNumber:
              valueOrEmpty(
                data?.phoneNumber
              ),

            email:
              valueOrEmpty(
                data?.email
              ),

            dateOfBirth:
              dateInputValue(
                data?.dateOfBirth
              ),

            gender:
              valueOrEmpty(
                data?.gender
              ),

            addressLine1:
              valueOrEmpty(
                data?.addressLine1
              ),

            addressLine2:
              valueOrEmpty(
                data?.addressLine2
              ),

            suburb:
              valueOrEmpty(
                data?.suburb
              ),

            city:
              valueOrEmpty(
                data?.city
              ),

            province:
              valueOrEmpty(
                data?.province
              ),

            postalCode:
              valueOrEmpty(
                data?.postalCode
              ),

            emergencyContactName:
              valueOrEmpty(
                data?.emergencyContactName
              ),

            emergencyContactPhone:
              valueOrEmpty(
                data?.emergencyContactPhone
              ),

            emergencyContactRelationship:
              valueOrEmpty(
                data?.emergencyContactRelationship
              ),
          });
        } catch (loadError) {
          console.error(
            "Failed to load Proxy profile:",
            loadError
          );

          setError(
            loadError?.message ||
              "Could not load your profile."
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
      loadProfile();
    },
    [
      loadProfile,
    ]
  );

  /* ===================================================== */
  /* PROFILE FORM                                          */
  /* ===================================================== */

  function handleProfileChange(
    event
  ) {
    const {
      name,
      value,
    } =
      event.target;

    setProfile(
      (
        current
      ) => ({
        ...current,

        [name]:
          value,
      })
    );

    setSuccess(
      ""
    );

    setError(
      ""
    );
  }

  function validateProfile() {
    if (
      !profile.fullName
        .trim()
    ) {
      return "Full name is required.";
    }

    if (
      !profile.phoneNumber
        .trim()
    ) {
      return "Phone number is required.";
    }

    if (
      !profile.email
        .trim()
    ) {
      return "Email address is required.";
    }

    return "";
  }

  async function handleSaveProfile(
    event
  ) {
    event.preventDefault();

    const validationError =
      validateProfile();

    if (
      validationError
    ) {
      setError(
        validationError
      );

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

      const updated =
        await proxiesApi
          .updateProfile({
            fullName:
              profile.fullName
                .trim(),

            phoneNumber:
              profile.phoneNumber
                .trim(),

            email:
              profile.email
                .trim(),

            gender:
              profile.gender
                .trim(),

            addressLine1:
              profile.addressLine1
                .trim(),

            addressLine2:
              profile.addressLine2
                .trim() ||
              null,

            suburb:
              profile.suburb
                .trim(),

            city:
              profile.city
                .trim(),

            province:
              profile.province
                .trim(),

            postalCode:
              profile.postalCode
                .trim(),

            emergencyContactName:
              profile
                .emergencyContactName
                .trim(),

            emergencyContactPhone:
              profile
                .emergencyContactPhone
                .trim(),

            emergencyContactRelationship:
              profile
                .emergencyContactRelationship
                .trim(),
          });

      setProfileInfo(
        updated
      );

      /*
       * Keep AuthContext and its local cached user in sync so
       * the updated name immediately appears in the sidebar
       * and header without forcing a logout/login cycle.
       */
      if (user) {
        setUser({
          ...user,

          fullName:
            updated?.fullName ??
            user.fullName,

          phoneNumber:
            updated?.phoneNumber ??
            user.phoneNumber,

          email:
            updated?.email ??
            user.email,
        });
      }

      setSuccess(
        "Profile updated successfully."
      );
    } catch (saveError) {
      console.error(
        "Failed to update Proxy profile:",
        saveError
      );

      setError(
        saveError?.message ||
          "Could not save your profile."
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  /* ===================================================== */
  /* PASSWORD                                              */
  /* ===================================================== */

  const requirements =
    useMemo(
      () =>
        passwordRequirements(
          passwords
            .newPassword
        ),
      [
        passwords
          .newPassword,
      ]
    );

  function handlePasswordChange(
    event
  ) {
    const {
      name,
      value,
    } =
      event.target;

    setPasswords(
      (
        current
      ) => ({
        ...current,

        [name]:
          value,
      })
    );

    setPasswordError(
      ""
    );

    setPasswordSuccess(
      ""
    );
  }

  async function handleChangePassword(
    event
  ) {
    event.preventDefault();

    if (
      !passwords
        .currentPassword
    ) {
      setPasswordError(
        "Current password is required."
      );

      return;
    }

    if (
      !passwordIsValid(
        passwords
          .newPassword
      )
    ) {
      setPasswordError(
        "Your new password does not meet all password requirements."
      );

      return;
    }

    if (
      passwords.newPassword !==
      passwords.confirmNewPassword
    ) {
      setPasswordError(
        "The new passwords do not match."
      );

      return;
    }

    try {
      setChangingPassword(
        true
      );

      setPasswordError(
        ""
      );

      setPasswordSuccess(
        ""
      );

      await changePassword({
        currentPassword:
          passwords
            .currentPassword,

        newPassword:
          passwords
            .newPassword,

        confirmNewPassword:
          passwords
            .confirmNewPassword,
      });

      setPasswords(
        emptyPasswords
      );

      setPasswordSuccess(
        "Password changed successfully."
      );
    } catch (changeError) {
      console.error(
        "Failed to change password:",
        changeError
      );

      setPasswordError(
        changeError?.message ||
          "Could not change your password."
      );
    } finally {
      setChangingPassword(
        false
      );
    }
  }

  /* ===================================================== */
  /* LOADING                                               */
  /* ===================================================== */

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-[#e2e8f0] bg-white px-6 py-16 text-center text-sm text-[#64748b]">
            Loading account settings...
          </div>
        </div>
      </div>
    );
  }

  /* ===================================================== */
  /* RENDER                                                */
  /* ===================================================== */

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#0f172a]">
              Account settings
            </h1>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-[#64748b]">
              Manage your personal information, contact details and account security.
            </p>
          </div>

          <button
            type="button"
            onClick={
              loadProfile
            }
            className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl border border-[#e2e8f0] bg-white px-4 text-sm font-medium text-[#334155] transition hover:bg-[#f8fafc] sm:w-auto"
          >
            <RefreshCw
              size={16}
            />

            Refresh
          </button>

        </div>

        {/* FEEDBACK */}

        {error && (
          <Feedback
            type="error"
            message={
              error
            }
          />
        )}

        {success && (
          <Feedback
            type="success"
            message={
              success
            }
          />
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">

          {/* ============================================= */}
          {/* MAIN PROFILE                                  */}
          {/* ============================================= */}

          <form
            onSubmit={
              handleSaveProfile
            }
            className="min-w-0 space-y-6"
          >

            <SettingsSection
              icon={
                User
              }
              title="Personal information"
              description="Basic information associated with your Proxy profile."
            >
              <div className="grid gap-5 sm:grid-cols-2">

                <Field
                  label="Full name"
                  name="fullName"
                  value={
                    profile.fullName
                  }
                  onChange={
                    handleProfileChange
                  }
                  icon={
                    User
                  }
                  required
                />

                <Field
                  label="Gender"
                  name="gender"
                  value={
                    profile.gender
                  }
                  onChange={
                    handleProfileChange
                  }
                />

              </div>
            </SettingsSection>

            <IdentityEditor
              idNumber={
                profileInfo?.idNumber
              }
              dateOfBirth={
                profile.dateOfBirth
              }
              onUpdated={(
                identity
              ) => {
                setProfileInfo(
                  (current) => ({
                    ...current,

                    idNumber:
                      identity.idNumber,

                    dateOfBirth:
                      identity.dateOfBirth,
                  })
                );

                setProfile(
                  (current) => ({
                    ...current,

                    dateOfBirth:
                      dateInputValue(
                        identity.dateOfBirth
                      ),
                  })
                );
              }}
            />

            <SettingsSection
              icon={
                Phone
              }
              title="Contact details"
              description="Keep these details current so PhilaLink and clinic staff can contact you."
            >
              <div className="grid gap-5 sm:grid-cols-2">

                <Field
                  label="Email address"
                  name="email"
                  type="email"
                  value={
                    profile.email
                  }
                  onChange={
                    handleProfileChange
                  }
                  icon={
                    Mail
                  }
                  required
                />

                <Field
                  label="Phone number"
                  name="phoneNumber"
                  type="tel"
                  value={
                    profile.phoneNumber
                  }
                  onChange={
                    handleProfileChange
                  }
                  icon={
                    Phone
                  }
                  required
                />

              </div>
            </SettingsSection>

            <SettingsSection
              icon={
                MapPin
              }
              title="Address"
              description="Your current residential or contact address."
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
                      handleProfileChange
                    }
                    icon={
                      MapPin
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
                      handleProfileChange
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
                    handleProfileChange
                  }
                />

                <Field
                  label="City"
                  name="city"
                  value={
                    profile.city
                  }
                  onChange={
                    handleProfileChange
                  }
                />

                <Field
                  label="Province"
                  name="province"
                  value={
                    profile.province
                  }
                  onChange={
                    handleProfileChange
                  }
                />

                <Field
                  label="Postal code"
                  name="postalCode"
                  value={
                    profile.postalCode
                  }
                  onChange={
                    handleProfileChange
                  }
                />

              </div>
            </SettingsSection>

            <SettingsSection
              icon={
                UsersRound
              }
              title="Emergency contact"
              description="Someone clinic staff can contact when necessary."
            >
              <div className="grid gap-5 sm:grid-cols-2">

                <Field
                  label="Contact name"
                  name="emergencyContactName"
                  value={
                    profile
                      .emergencyContactName
                  }
                  onChange={
                    handleProfileChange
                  }
                />

                <Field
                  label="Contact phone"
                  name="emergencyContactPhone"
                  type="tel"
                  value={
                    profile
                      .emergencyContactPhone
                  }
                  onChange={
                    handleProfileChange
                  }
                />

                <div className="sm:col-span-2">
                  <Field
                    label="Relationship"
                    name="emergencyContactRelationship"
                    value={
                      profile
                        .emergencyContactRelationship
                    }
                    onChange={
                      handleProfileChange
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
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-5 text-sm font-semibold text-white transition hover:bg-[#115e59] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
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

          {/* ============================================= */}
          {/* ACCOUNT SIDEBAR                               */}
          {/* ============================================= */}

          <aside className="min-w-0 space-y-6">

            <section className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white">

              <div className="border-b border-[#e2e8f0] px-5 py-5">

                <h2 className="font-semibold text-[#0f172a]">
                  Account details
                </h2>

                <p className="mt-1 text-sm leading-5 text-[#64748b]">
                  Managed account information.
                </p>

              </div>

              <div className="space-y-5 p-5">

                <InfoItem
                  icon={
                    IdCard
                  }
                  label="ID number"
                  value={
                    profileInfo
                      ?.idNumber ||
                    "—"
                  }
                />

                <InfoItem
                  icon={
                    Building2
                  }
                  label="Registered clinic"
                  value={
                    profileInfo
                      ?.clinicName ||
                    "Not assigned"
                  }
                />

                <InfoItem
                  icon={
                    ShieldCheck
                  }
                  label="Verification"
                  value={
                    profileInfo
                      ?.isVerified
                      ? "Verified"
                      : "Not verified"
                  }
                />

                <InfoItem
                  icon={
                    LockKeyhole
                  }
                  label="Account status"
                  value={
                    profileInfo
                      ?.isActive
                      ? "Active"
                      : "Inactive"
                  }
                />

                <InfoItem
                  label="Account created"
                  value={
                    formatDate(
                      profileInfo
                        ?.createdAt
                    )
                  }
                />

              </div>

              <div className="border-t border-[#e2e8f0] bg-[#f8fafc] px-5 py-4">

                <p className="text-xs leading-5 text-[#64748b]">
                  Your registered clinic cannot be changed from this page. Clinic reassignment is handled administratively.
                </p>

              </div>

            </section>

            {/* SECURITY */}

            <form
              onSubmit={
                handleChangePassword
              }
              className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white"
            >

              <div className="border-b border-[#e2e8f0] px-5 py-5">

                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ccfbf1] text-[#0f766e]">
                    <KeyRound
                      size={18}
                    />
                  </div>

                  <div>

                    <h2 className="font-semibold text-[#0f172a]">
                      Security
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-[#64748b]">
                      Change your account password.
                    </p>

                  </div>

                </div>

              </div>

              <div className="space-y-5 p-5">

                {passwordError && (
                  <Feedback
                    type="error"
                    message={
                      passwordError
                    }
                    compact
                  />
                )}

                {passwordSuccess && (
                  <Feedback
                    type="success"
                    message={
                      passwordSuccess
                    }
                    compact
                  />
                )}

                <PasswordField
                  label="Current password"
                  name="currentPassword"
                  value={
                    passwords
                      .currentPassword
                  }
                  onChange={
                    handlePasswordChange
                  }
                  show={
                    showCurrentPassword
                  }
                  onToggle={() =>
                    setShowCurrentPassword(
                      (
                        current
                      ) =>
                        !current
                    )
                  }
                  autoComplete="current-password"
                />

                <PasswordField
                  label="New password"
                  name="newPassword"
                  value={
                    passwords
                      .newPassword
                  }
                  onChange={
                    handlePasswordChange
                  }
                  show={
                    showNewPassword
                  }
                  onToggle={() =>
                    setShowNewPassword(
                      (
                        current
                      ) =>
                        !current
                    )
                  }
                  autoComplete="new-password"
                />

                {passwords
                  .newPassword && (
                  <div className="rounded-xl bg-[#f8fafc] p-4">

                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#64748b]">
                      Password requirements
                    </p>

                    <div className="space-y-2">

                      <Requirement
                        met={
                          requirements.length
                        }
                      >
                        At least 12 characters
                      </Requirement>

                      <Requirement
                        met={
                          requirements.uppercase
                        }
                      >
                        One uppercase letter
                      </Requirement>

                      <Requirement
                        met={
                          requirements.lowercase
                        }
                      >
                        One lowercase letter
                      </Requirement>

                      <Requirement
                        met={
                          requirements.number
                        }
                      >
                        One number
                      </Requirement>

                      <Requirement
                        met={
                          requirements.special
                        }
                      >
                        One special character
                      </Requirement>

                    </div>

                  </div>
                )}

                <PasswordField
                  label="Confirm new password"
                  name="confirmNewPassword"
                  value={
                    passwords
                      .confirmNewPassword
                  }
                  onChange={
                    handlePasswordChange
                  }
                  show={
                    showConfirmPassword
                  }
                  onToggle={() =>
                    setShowConfirmPassword(
                      (
                        current
                      ) =>
                        !current
                    )
                  }
                  autoComplete="new-password"
                />

                <button
                  type="submit"
                  disabled={
                    changingPassword
                  }
                  className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-[#0f766e] px-4 text-sm font-semibold text-[#0f766e] transition hover:bg-[#f0fdfa] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <KeyRound
                    size={16}
                  />

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

/* ========================================================= */
/* SETTINGS SECTION                                          */
/* ========================================================= */

function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white">

      <div className="border-b border-[#e2e8f0] px-5 py-5 sm:px-6">

        <div className="flex items-start gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ccfbf1] text-[#0f766e]">
            <Icon
              size={18}
            />
          </div>

          <div className="min-w-0">

            <h2 className="font-semibold text-[#0f172a]">
              {title}
            </h2>

            <p className="mt-1 text-sm leading-5 text-[#64748b]">
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

/* ========================================================= */
/* FIELD                                                     */
/* ========================================================= */

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  icon: Icon,
  required = false,
}) {
  return (
    <div className="min-w-0">

      <label
        htmlFor={
          name
        }
        className="mb-2 block text-sm font-medium text-[#334155]"
      >
        {label}

        {required && (
          <span className="ml-1 text-[#dc2626]">
            *
          </span>
        )}
      </label>

      <div className="relative">

        {Icon && (
          <Icon
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]"
          />
        )}

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
          onChange={
            onChange
          }
          required={
            required
          }
          className={[
            "h-11 w-full rounded-xl border border-[#cbd5e1] bg-white pr-4 text-sm text-[#0f172a] outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10",
            Icon
              ? "pl-10"
              : "pl-4",
          ].join(
            " "
          )}
        />

      </div>

    </div>
  );
}

/* ========================================================= */
/* PASSWORD FIELD                                            */
/* ========================================================= */

function PasswordField({
  label,
  name,
  value,
  onChange,
  show,
  onToggle,
  autoComplete,
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

      <div className="relative">

        <input
          id={
            name
          }
          name={
            name
          }
          type={
            show
              ? "text"
              : "password"
          }
          value={
            value
          }
          onChange={
            onChange
          }
          autoComplete={
            autoComplete
          }
          className="h-11 w-full rounded-xl border border-[#cbd5e1] bg-white px-4 pr-12 text-sm text-[#0f172a] outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10"
        />

        <button
          type="button"
          onClick={
            onToggle
          }
          aria-label={
            show
              ? `Hide ${label.toLowerCase()}`
              : `Show ${label.toLowerCase()}`
          }
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#64748b] transition hover:bg-[#f1f5f9]"
        >

          {show ? (
            <EyeOff
              size={17}
            />
          ) : (
            <Eye
              size={17}
            />
          )}

        </button>

      </div>

    </div>
  );
}

/* ========================================================= */
/* REQUIREMENT                                               */
/* ========================================================= */

function Requirement({
  met,
  children,
}) {
  return (
    <div className="flex items-center gap-2">

      <span
        className={[
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
          met
            ? "bg-[#dcfce7] text-[#15803d]"
            : "bg-[#e2e8f0] text-[#64748b]",
        ].join(
          " "
        )}
      >

        {met
          ? "✓"
          : "○"}

      </span>

      <span
        className={[
          "text-xs",
          met
            ? "text-[#15803d]"
            : "text-[#64748b]",
        ].join(
          " "
        )}
      >
        {children}
      </span>

    </div>
  );
}

/* ========================================================= */
/* INFO ITEM                                                 */
/* ========================================================= */

function InfoItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex gap-3">

      {Icon && (
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f1f5f9] text-[#64748b]">
          <Icon
            size={15}
          />
        </div>
      )}

      <div className="min-w-0">

        <p className="text-xs font-medium text-[#94a3b8]">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-[#334155]">
          {value}
        </p>

      </div>

    </div>
  );
}

/* ========================================================= */
/* FEEDBACK                                                  */
/* ========================================================= */

function Feedback({
  type,
  message,
  compact = false,
}) {
  const success =
    type ===
    "success";

  const Icon =
    success
      ? CheckCircle2
      : AlertCircle;

  return (
    <div
      className={[
        "flex items-start gap-3 rounded-xl",
        compact
          ? "p-3"
          : "mb-5 p-4",
        success
          ? "bg-[#dcfce7] text-[#166534]"
          : "bg-[#fee2e2] text-[#b91c1c]",
      ].join(
        " "
      )}
    >
      <Icon
        size={18}
        className="mt-0.5 shrink-0"
      />

      <p className="text-sm leading-5">
        {message}
      </p>

    </div>
  );
}