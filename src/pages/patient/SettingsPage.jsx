import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  AlertCircle,
  Bell,
  CheckCircle,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  MapPin,
  Moon,
  Palette,
  Phone,
  Save,
  Shield,
  Sun,
  User,
} from "lucide-react";

import {
  Button,
} from "../../components/patient/chatbot/AstraCompat.jsx";

import {
  patientsApi,
} from "../../services/api/patients.js";

import {
  useAuth,
} from "../../context/AuthContext.jsx";

const THEME_STORAGE_KEY =
  "philalink-theme";

const emptyProfile = {
  fullName: "",
  email: "",
  phoneNumber: "",
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
  emergencyContactRelationship:
    "",
};

const emptyPreferences = {
  medicationReminders: false,
  appointmentReminders: false,
  clinicNotifications: false,
  healthUpdates: false,
  shareHealthData: false,
  allowChatbotProfileAccess:
    false,
};

const emptyPasswords = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

function fieldValue(value) {
  return value ?? "";
}

function dateInputValue(value) {
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

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  return date
    .toISOString()
    .slice(0, 10);
}

function getInitialTheme() {
  if (
    typeof document !==
    "undefined"
  ) {
    const currentTheme =
      document.documentElement
        .getAttribute(
          "data-theme"
        );

    if (
      currentTheme ===
        "dark" ||
      currentTheme ===
        "light"
    ) {
      return currentTheme;
    }
  }

  try {
    return localStorage.getItem(
      THEME_STORAGE_KEY
    ) === "dark"
      ? "dark"
      : "light";
  } catch {
    return "light";
  }
}

function getPasswordRequirements(
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
  return Object.values(
    getPasswordRequirements(
      password
    )
  ).every(Boolean);
}

export default function SettingsPage() {
  const {
    user,
    changePassword,
    setUser,
  } =
    useAuth();

  const [
    profile,
    setProfile,
  ] = useState(
    emptyProfile
  );

  const [
    preferences,
    setPreferences,
  ] = useState(
    emptyPreferences
  );

  const [
    patientInfo,
    setPatientInfo,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
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
    theme,
    setTheme,
  ] = useState(
    getInitialTheme
  );

  const [
    passwords,
    setPasswords,
  ] = useState(
    emptyPasswords
  );

  const [
    passwordErrors,
    setPasswordErrors,
  ] = useState({});

  const [
    passwordError,
    setPasswordError,
  ] = useState("");

  const [
    passwordSuccess,
    setPasswordSuccess,
  ] = useState("");

  const [
    changingPassword,
    setChangingPassword,
  ] = useState(false);

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

  const passwordRequirements =
    getPasswordRequirements(
      passwords.newPassword
    );

  const loadSettings =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError("");

          const [
            patient,
            patientPreferences,
          ] =
            await Promise.all([
              patientsApi
                .getMe(),

              patientsApi
                .getPreferences(),
            ]);

          setPatientInfo(
            patient
          );

          setProfile({
            fullName:
              fieldValue(
                patient
                  ?.fullName
              ),

            email:
              fieldValue(
                patient?.email
              ),

            phoneNumber:
              fieldValue(
                patient
                  ?.phoneNumber
              ),

            dateOfBirth:
              dateInputValue(
                patient
                  ?.dateOfBirth
              ),

            gender:
              fieldValue(
                patient?.gender
              ),

            addressLine1:
              fieldValue(
                patient
                  ?.addressLine1
              ),

            addressLine2:
              fieldValue(
                patient
                  ?.addressLine2
              ),

            suburb:
              fieldValue(
                patient?.suburb
              ),

            city:
              fieldValue(
                patient?.city
              ),

            province:
              fieldValue(
                patient
                  ?.province
              ),

            postalCode:
              fieldValue(
                patient
                  ?.postalCode
              ),

            emergencyContactName:
              fieldValue(
                patient
                  ?.emergencyContactName
              ),

            emergencyContactPhone:
              fieldValue(
                patient
                  ?.emergencyContactPhone
              ),

            emergencyContactRelationship:
              fieldValue(
                patient
                  ?.emergencyContactRelationship
              ),
          });

          setPreferences({
            medicationReminders:
              Boolean(
                patientPreferences
                  ?.medicationReminders
              ),

            appointmentReminders:
              Boolean(
                patientPreferences
                  ?.appointmentReminders
              ),

            clinicNotifications:
              Boolean(
                patientPreferences
                  ?.clinicNotifications
              ),

            healthUpdates:
              Boolean(
                patientPreferences
                  ?.healthUpdates
              ),

            shareHealthData:
              Boolean(
                patientPreferences
                  ?.shareHealthData
              ),

            allowChatbotProfileAccess:
              Boolean(
                patientPreferences
                  ?.allowChatbotProfileAccess
              ),
          });
        } catch (
          err
        ) {
          console.error(
            "Failed to load settings:",
            err
          );

          setError(
            err?.message ||
              "We could not load your settings."
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
      void loadSettings();
    },
    [
      loadSettings,
    ]
  );

  useEffect(
    () => {
      document.documentElement
        .setAttribute(
          "data-theme",
          theme
        );

      try {
        localStorage.setItem(
          THEME_STORAGE_KEY,
          theme
        );
      } catch {
        // Theme still works for the current session.
      }
    },
    [
      theme,
    ]
  );

  function handleProfileChange(
    event
  ) {
    const {
      name,
      value,
    } =
      event.target;

    setProfile(
      (current) => ({
        ...current,
        [name]:
          value,
      })
    );

    setSuccess("");
  }

  function togglePreference(
    key
  ) {
    setSuccess("");

    setPreferences(
      (current) => ({
        ...current,

        [key]:
          !current[key],
      })
    );
  }

  function toggleTheme() {
    setTheme(
      (current) =>
        current ===
        "light"
          ? "dark"
          : "light"
    );
  }

  function handlePasswordChange(
    event
  ) {
    const {
      name,
      value,
    } =
      event.target;

    setPasswords(
      (current) => ({
        ...current,

        [name]:
          value,
      })
    );

    setPasswordErrors(
      (current) => ({
        ...current,

        [name]:
          undefined,
      })
    );

    setPasswordError("");
    setPasswordSuccess("");
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updatedPatient =
        await patientsApi
          .updateMe({
            fullName:
              profile.fullName
                .trim(),

            email:
              profile.email
                .trim(),

            phoneNumber:
              profile
                .phoneNumber
                .trim(),

            dateOfBirth:
              profile
                .dateOfBirth,

            gender:
              profile.gender
                .trim(),

            addressLine1:
              profile
                .addressLine1
                .trim(),

            addressLine2:
              profile
                .addressLine2
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
              profile
                .postalCode
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

      await patientsApi
        .updatePreferences(
          preferences
        );

setPatientInfo(
  updatedPatient
);

/*
 * Keep AuthContext synchronized with profile changes so
 * components such as the top bar immediately display the
 * patient's latest name and contact information.
 *
 * Do not replace the authenticated user with updatedPatient
 * because PatientMeDto does not contain all authentication
 * fields such as role and mustChangePassword.
 */
if (user) {
  setUser({
    ...user,

    fullName:
      updatedPatient
        ?.fullName ??
      user.fullName,

    email:
      updatedPatient
        ?.email ??
      user.email,

    phoneNumber:
      updatedPatient
        ?.phoneNumber ??
      user.phoneNumber,
  });
}

/*
 * Use the values returned by the backend because the server
 * may normalize them, for example converting email to
 * lowercase.
 */
setProfile(
  (current) => ({
    ...current,

    fullName:
      updatedPatient
        ?.fullName ??
      current.fullName,

    email:
      updatedPatient
        ?.email ??
      current.email,

    phoneNumber:
      updatedPatient
        ?.phoneNumber ??
      current.phoneNumber,
  })
);

setSuccess(
  "Your settings have been saved."
);
    } catch (
      err
    ) {
      console.error(
        "Failed to save settings:",
        err
      );

      setError(
        err?.message ||
          "We could not save your settings."
      );
    } finally {
      setSaving(false);
    }
  }

  function validatePasswordChange() {
    const next = {};

    if (
      !passwords
        .currentPassword
    ) {
      next.currentPassword =
        "Enter your current password.";
    }

    if (
      !passwords
        .newPassword
    ) {
      next.newPassword =
        "Enter a new password.";
    } else if (
      !passwordIsValid(
        passwords
          .newPassword
      )
    ) {
      next.newPassword =
        "Your new password must meet all the requirements below.";
    }

    if (
      !passwords
        .confirmNewPassword
    ) {
      next.confirmNewPassword =
        "Confirm your new password.";
    } else if (
      passwords
        .newPassword !==
      passwords
        .confirmNewPassword
    ) {
      next.confirmNewPassword =
        "Passwords don't match.";
    }

    if (
      passwords
        .currentPassword &&
      passwords
        .newPassword &&
      passwords
        .currentPassword ===
        passwords
          .newPassword
    ) {
      next.newPassword =
        "Your new password must be different from your current password.";
    }

    setPasswordErrors(
      next
    );

    return (
      Object.keys(
        next
      ).length ===
      0
    );
  }

  async function handleChangePassword(
    event
  ) {
    event.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");

    if (
      !validatePasswordChange()
    ) {
      return;
    }

    try {
      setChangingPassword(
        true
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

      setPasswordErrors(
        {}
      );

      setShowCurrentPassword(
        false
      );

      setShowNewPassword(
        false
      );

      setShowConfirmPassword(
        false
      );

      setPasswordSuccess(
        "Your password has been changed successfully."
      );
    } catch (
      err
    ) {
      console.error(
        "Failed to change password:",
        err
      );

      setPasswordError(
        err?.message ||
          "We could not change your password. Please try again."
      );
    } finally {
      setChangingPassword(
        false
      );
    }
  }

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <div className="animate-pulse">
          <div className="mb-2 h-7 w-40 rounded bg-slate-200" />

          <div className="mb-8 h-4 w-72 max-w-full rounded bg-slate-200" />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="h-96 rounded-2xl border border-slate-200 bg-white lg:col-span-2" />

            <div className="h-72 rounded-2xl border border-slate-200 bg-white" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-[1500px]">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Settings
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your profile,
            security,
            notifications,
            privacy and appearance.
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <div className="min-w-0 flex-1">
              <p className="text-sm text-slate-900">
                {error}
              </p>

              <button
                type="button"
                onClick={
                  loadSettings
                }
                className="mt-2 text-sm font-medium text-teal-700 transition hover:text-teal-800"
              >
                Reload settings
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
            <CheckCircle
              size={18}
              className="shrink-0 text-green-600"
            />

            <p className="text-sm text-slate-900">
              {success}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="flex min-w-0 flex-col gap-6 xl:col-span-2">

            {/* ================================================= */}
            {/* PERSONAL INFORMATION */}
            {/* ================================================= */}

            <SettingsSection
              icon={User}
              title="Personal information"
              description="Keep your personal and contact details up to date."
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field
                  label="Full name"
                  name="fullName"
                  value={
                    profile
                      .fullName
                  }
                  onChange={
                    handleProfileChange
                  }
                  icon={User}
                />

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
                  icon={Mail}
                />

                <Field
                  label="Phone number"
                  name="phoneNumber"
                  type="tel"
                  value={
                    profile
                      .phoneNumber
                  }
                  onChange={
                    handleProfileChange
                  }
                  icon={Phone}
                />

                <Field
                  label="Date of birth"
                  name="dateOfBirth"
                  type="date"
                  value={
                    profile
                      .dateOfBirth
                  }
                  onChange={
                    handleProfileChange
                  }
                />

                <div className="md:col-span-2">
                  <label
                    htmlFor="gender"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Gender
                  </label>

                  <select
                    id="gender"
                    name="gender"
                    value={
                      profile.gender
                    }
                    onChange={
                      handleProfileChange
                    }
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
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

                    <option value="Prefer not to say">
                      Prefer not to say
                    </option>
                  </select>
                </div>
              </div>
            </SettingsSection>

            {/* ================================================= */}
            {/* ADDRESS */}
            {/* ================================================= */}

            <SettingsSection
              icon={MapPin}
              title="Address"
              description="Update your residential address."
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Field
                    label="Address line 1"
                    name="addressLine1"
                    value={
                      profile
                        .addressLine1
                    }
                    onChange={
                      handleProfileChange
                    }
                  />
                </div>

                <div className="md:col-span-2">
                  <Field
                    label="Address line 2"
                    name="addressLine2"
                    value={
                      profile
                        .addressLine2
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
                    profile
                      .province
                  }
                  onChange={
                    handleProfileChange
                  }
                />

                <Field
                  label="Postal code"
                  name="postalCode"
                  value={
                    profile
                      .postalCode
                  }
                  onChange={
                    handleProfileChange
                  }
                />
              </div>
            </SettingsSection>

            {/* ================================================= */}
            {/* EMERGENCY CONTACT */}
            {/* ================================================= */}

            <SettingsSection
              icon={Phone}
              title="Emergency contact"
              description="Keep your emergency contact information current."
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
                  label="Contact number"
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

                <div className="md:col-span-2">
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

            {/* ================================================= */}
            {/* SECURITY */}
            {/* ================================================= */}

            <SettingsSection
              icon={KeyRound}
              title="Account security"
              description="Change your PhilaLink account password."
            >
              <form
                onSubmit={
                  handleChangePassword
                }
                noValidate
              >
                {passwordError && (
                  <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                    <AlertCircle
                      size={17}
                      className="mt-0.5 shrink-0 text-red-600"
                    />

                    <p className="text-sm text-slate-900">
                      {
                        passwordError
                      }
                    </p>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                    <CheckCircle
                      size={17}
                      className="mt-0.5 shrink-0 text-green-600"
                    />

                    <p className="text-sm text-slate-900">
                      {
                        passwordSuccess
                      }
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-5">
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
                    error={
                      passwordErrors
                        .currentPassword
                    }
                    show={
                      showCurrentPassword
                    }
                    onToggle={() =>
                      setShowCurrentPassword(
                        (current) =>
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
                    error={
                      passwordErrors
                        .newPassword
                    }
                    show={
                      showNewPassword
                    }
                    onToggle={() =>
                      setShowNewPassword(
                        (current) =>
                          !current
                      )
                    }
                    autoComplete="new-password"
                  />

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
                    error={
                      passwordErrors
                        .confirmNewPassword
                    }
                    show={
                      showConfirmPassword
                    }
                    onToggle={() =>
                      setShowConfirmPassword(
                        (current) =>
                          !current
                      )
                    }
                    autoComplete="new-password"
                  />
                </div>

                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-800">
                    Your new password must contain:
                  </p>

                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <PasswordRequirement
                      met={
                        passwordRequirements
                          .length
                      }
                    >
                      At least 12 characters
                    </PasswordRequirement>

                    <PasswordRequirement
                      met={
                        passwordRequirements
                          .uppercase
                      }
                    >
                      1 uppercase letter
                    </PasswordRequirement>

                    <PasswordRequirement
                      met={
                        passwordRequirements
                          .lowercase
                      }
                    >
                      1 lowercase letter
                    </PasswordRequirement>

                    <PasswordRequirement
                      met={
                        passwordRequirements
                          .number
                      }
                    >
                      1 number
                    </PasswordRequirement>

                    <PasswordRequirement
                      met={
                        passwordRequirements
                          .special
                      }
                    >
                      1 special character
                    </PasswordRequirement>
                  </div>
                </div>

                <div className="mt-5 flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    iconStart={
                      <KeyRound
                        size={16}
                      />
                    }
                    disabled={
                      changingPassword
                    }
                  >
                    {changingPassword
                      ? "Changing password..."
                      : "Change password"}
                  </Button>
                </div>
              </form>
            </SettingsSection>

            {/* ================================================= */}
            {/* NOTIFICATIONS */}
            {/* ================================================= */}

            <SettingsSection
              icon={Bell}
              title="Notifications"
              description="Choose which reminders and updates you want to receive."
            >
              <div className="divide-y divide-slate-200">
                <SettingToggle
                  title="Medication reminders"
                  description="Receive reminders when your medication is due."
                  checked={
                    preferences
                      .medicationReminders
                  }
                  onChange={() =>
                    togglePreference(
                      "medicationReminders"
                    )
                  }
                />

                <SettingToggle
                  title="Appointment reminders"
                  description="Get notified before upcoming appointments."
                  checked={
                    preferences
                      .appointmentReminders
                  }
                  onChange={() =>
                    togglePreference(
                      "appointmentReminders"
                    )
                  }
                />

                <SettingToggle
                  title="Clinic notifications"
                  description="Receive updates from your registered clinic."
                  checked={
                    preferences
                      .clinicNotifications
                  }
                  onChange={() =>
                    togglePreference(
                      "clinicNotifications"
                    )
                  }
                />

                <SettingToggle
                  title="General health updates"
                  description="Receive health information from PhilaLink."
                  checked={
                    preferences
                      .healthUpdates
                  }
                  onChange={() =>
                    togglePreference(
                      "healthUpdates"
                    )
                  }
                />
              </div>
            </SettingsSection>

            {/* ================================================= */}
            {/* PRIVACY */}
            {/* ================================================= */}

            <SettingsSection
              icon={Shield}
              title="Privacy"
              description="Control how your information is used inside PhilaLink."
            >
              <div className="divide-y divide-slate-200">
                <SettingToggle
                  title="Share relevant health data"
                  description="Allow authorized healthcare staff to access relevant information in your PhilaLink record."
                  checked={
                    preferences
                      .shareHealthData
                  }
                  onChange={() =>
                    togglePreference(
                      "shareHealthData"
                    )
                  }
                />

                <SettingToggle
                  title="Allow PhilaChatBot profile access"
                  description="Allow PhilaChatBot to use saved profile and health information during assessments."
                  checked={
                    preferences
                      .allowChatbotProfileAccess
                  }
                  onChange={() =>
                    togglePreference(
                      "allowChatbotProfileAccess"
                    )
                  }
                />
              </div>
            </SettingsSection>

            <div className="flex justify-end pb-2">
              <Button
                variant="primary"
                iconStart={
                  <Save
                    size={16}
                  />
                }
                onClick={
                  handleSave
                }
                disabled={
                  saving
                }
              >
                {saving
                  ? "Saving..."
                  : "Save changes"}
              </Button>
            </div>
          </div>

          {/* ================================================= */}
          {/* RIGHT SIDEBAR */}
          {/* ================================================= */}

          <aside className="flex min-w-0 flex-col gap-6">
            <ThemeCard
              theme={
                theme
              }
              onToggle={
                toggleTheme
              }
            />

            <section className="rounded-2xl border border-slate-200 bg-white p-5 lg:p-6">
              <h2 className="text-base font-semibold text-slate-900">
                Patient details
              </h2>

              <div className="mt-5 flex flex-col gap-5">
                <InfoItem
                  label="Patient number"
                  value={
                    patientInfo
                      ?.patientNumber ||
                    "—"
                  }
                />

                <InfoItem
                  label="Registered clinic"
                  value={
                    patientInfo
                      ?.clinicName ||
                    "Not assigned"
                  }
                />

                <InfoItem
                  label="Profile status"
                  value={
                    patientInfo
                      ?.isProfileComplete
                      ? "Complete"
                      : "Incomplete"
                  }
                />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 lg:p-6">
              <h2 className="text-base font-semibold text-slate-900">
                Medical profile
              </h2>

              <div className="mt-5">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                  Allergies
                </p>

                {patientInfo
                  ?.allergies
                  ?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {patientInfo
                      .allergies
                      .map(
                        (
                          allergy
                        ) => (
                          <span
                            key={
                              allergy.id
                            }
                            className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700"
                          >
                            {
                              allergy.name
                            }
                          </span>
                        )
                      )}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    None recorded
                  </p>
                )}
              </div>

              <div className="mt-6">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                  Conditions
                </p>

                {patientInfo
                  ?.conditions
                  ?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {patientInfo
                      .conditions
                      .map(
                        (
                          condition
                        ) => (
                          <span
                            key={
                              condition.id
                            }
                            className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700"
                          >
                            {
                              condition.name
                            }
                          </span>
                        )
                      )}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    None recorded
                  </p>
                )}
              </div>
            </section>
          </aside>
        </div>

        <div className="h-20 lg:hidden" />
      </div>
    </div>
  );
}

/* =========================================================
   APPEARANCE CARD
========================================================= */

function ThemeCard({
  theme,
  onToggle,
}) {
  const isDark =
    theme ===
    "dark";

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-5 py-5 lg:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100">
            <Palette
              size={18}
              className="text-teal-700"
            />
          </div>

          <div className="min-w-0">
            <h2 className="text-base font-semibold text-slate-900">
              Appearance
            </h2>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              Choose how the
              patient portal looks
              on this device.
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 py-5 lg:px-6 lg:py-6">
        <div className="flex items-center justify-between gap-5">
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900">
              Theme
            </p>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              {isDark
                ? "Dark mode is on."
                : "Light mode is on."}
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={
              isDark
            }
            aria-label="Toggle dark mode"
            onClick={
              onToggle
            }
            className={`relative h-[30px] w-[58px] shrink-0 rounded-full border-0 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 ${
              isDark
                ? "bg-[#18352a]"
                : "bg-[#d1d5d3]"
            }`}
          >
            <span
              aria-hidden="true"
              className={`absolute left-[3px] top-[3px] flex h-6 w-6 items-center justify-center rounded-full bg-[#ffffff] text-[#10201a] shadow-md transition-transform duration-300 ${
                isDark
                  ? "translate-x-7"
                  : "translate-x-0"
              }`}
            >
              {isDark ? (
                <Moon
                  size={14}
                />
              ) : (
                <Sun
                  size={14}
                />
              )}
            </span>
          </button>
        </div>

        <p className="mt-4 text-xs leading-5 text-slate-400">
          Your choice is saved
          automatically and will
          still be active when you
          return.
        </p>
      </div>
    </section>
  );
}

/* =========================================================
   GENERIC SETTINGS SECTION
========================================================= */

function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-5 py-5 lg:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100">
            <Icon
              size={18}
              className="text-teal-700"
            />
          </div>

          <div className="min-w-0">
            <h2 className="text-base font-semibold text-slate-900">
              {title}
            </h2>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 py-5 lg:px-6 lg:py-6">
        {children}
      </div>
    </section>
  );
}

/* =========================================================
   STANDARD FIELD
========================================================= */

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  icon: Icon,
}) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={
            onChange
          }
          className={`h-11 w-full rounded-xl border border-slate-300 bg-white pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10 ${
            Icon
              ? "pl-10"
              : "pl-4"
          }`}
        />
      </div>
    </div>
  );
}

/* =========================================================
   PASSWORD FIELD
========================================================= */

function PasswordField({
  label,
  name,
  value,
  onChange,
  error,
  show,
  onToggle,
  autoComplete,
}) {
  return (
    <div className="min-w-0">
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={name}
          name={name}
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
          className={`h-11 w-full rounded-xl bg-white pl-4 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
            error
              ? "border border-red-400 focus:border-red-500 focus:ring-red-500/10"
              : "border border-slate-300 focus:border-teal-600 focus:ring-teal-600/10"
          }`}
        />

        <button
          type="button"
          onClick={
            onToggle
          }
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/20"
          aria-label={
            show
              ? `Hide ${label.toLowerCase()}`
              : `Show ${label.toLowerCase()}`
          }
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

      {error && (
        <p className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   PASSWORD REQUIREMENT
========================================================= */

function PasswordRequirement({
  met,
  children,
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
          met
            ? "bg-green-100 text-green-700"
            : "bg-slate-200 text-slate-500"
        }`}
      >
        {met
          ? "✓"
          : "○"}
      </span>

      <span
        className={`text-xs ${
          met
            ? "text-green-700"
            : "text-slate-500"
        }`}
      >
        {children}
      </span>
    </div>
  );
}

/* =========================================================
   INFORMATION ITEM
========================================================= */

function InfoItem({
  label,
  value,
}) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-slate-800">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   TOGGLE
========================================================= */

function SettingToggle({
  title,
  description,
  checked,
  onChange,
}) {
  return (
    <div className="flex min-h-[76px] items-center justify-between gap-5 py-4 first:pt-0 last:pb-0">
      <div className="min-w-0 flex-1 pr-2">
        <p className="text-sm font-medium text-slate-900">
          {title}
        </p>

        <p className="mt-1 max-w-3xl text-sm leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={
          checked
        }
        aria-label={
          title
        }
        onClick={
          onChange
        }
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 ${
          checked
            ? "bg-teal-700"
            : "bg-slate-300"
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
            checked
              ? "translate-x-5"
              : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}