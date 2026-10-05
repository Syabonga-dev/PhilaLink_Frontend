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
  Languages,
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
  useTranslation,
} from "react-i18next";

import {
  Button,
} from "../../components/patient/chatbot/AstraCompat.jsx";

import {
  patientsApi,
} from "../../services/api/patients.js";

import {
  useAuth,
} from "../../context/AuthContext.jsx";

import {
  SUPPORTED_LANGUAGES,
  normalizeLanguage,
} from "../../i18n/languages.js";

import IdentityEditor from "../../components/account/IdentityEditor.jsx";

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

function fieldValue(
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
    .slice(
      0,
      10
    );
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
    t,
    i18n,
  } =
    useTranslation();

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

  const currentLanguage =
    normalizeLanguage(
      i18n.resolvedLanguage ||
        i18n.language
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
                patient
                  ?.email
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
                patient
                  ?.gender
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
                patient
                  ?.suburb
              ),

            city:
              fieldValue(
                patient
                  ?.city
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
              i18n.t(
                "settings.loadError"
              )
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      [
        i18n,
      ]
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
        // Theme still works for this session.
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
      (
        current
      ) => ({
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
      (
        current
      ) => ({
        ...current,

        [key]:
          !current[key],
      })
    );
  }

  function toggleTheme() {
    setTheme(
      (
        current
      ) =>
        current ===
        "light"
          ? "dark"
          : "light"
    );
  }

  async function handleLanguageChange(
    event
  ) {
    const language =
      normalizeLanguage(
        event.target.value
      );

    await i18n
      .changeLanguage(
        language
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
      (
        current
      ) => ({
        ...current,

        [name]:
          value,
      })
    );

    setPasswordErrors(
      (
        current
      ) => ({
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
              profile
                .fullName
                .trim(),

            email:
              profile
                .email
                .trim(),

            phoneNumber:
              profile
                .phoneNumber
                .trim(),

            gender:
              profile
                .gender
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
              profile
                .suburb
                .trim(),

            city:
              profile
                .city
                .trim(),

            province:
              profile
                .province
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

      setProfile(
        (
          current
        ) => ({
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
        t(
          "settings.saved"
        )
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
          t(
            "settings.saveError"
          )
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  function validatePasswordChange() {
    const next =
      {};

    if (
      !passwords
        .currentPassword
    ) {
      next.currentPassword =
        t(
          "settings.currentPasswordRequired"
        );
    }

    if (
      !passwords
        .newPassword
    ) {
      next.newPassword =
        t(
          "settings.newPasswordRequired"
        );
    } else if (
      !passwordIsValid(
        passwords
          .newPassword
      )
    ) {
      next.newPassword =
        t(
          "settings.newPasswordInvalid"
        );
    }

    if (
      !passwords
        .confirmNewPassword
    ) {
      next.confirmNewPassword =
        t(
          "settings.confirmPasswordRequired"
        );
    } else if (
      passwords
        .newPassword !==
      passwords
        .confirmNewPassword
    ) {
      next.confirmNewPassword =
        t(
          "settings.passwordsMismatch"
        );
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
        t(
          "settings.passwordSame"
        );
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
        t(
          "settings.passwordChanged"
        )
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
          t(
            "settings.passwordChangeError"
          )
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
            {t(
              "settings.title"
            )}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {t(
              "settings.subtitle"
            )}
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
                {t(
                  "settings.reloadSettings"
                )}
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

            <SettingsSection
              icon={User}
              title={t(
                "settings.personalTitle"
              )}
              description={t(
                "settings.personalDescription"
              )}
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field
                  label={t(
                    "settings.fullName"
                  )}
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
                  label={t(
                    "settings.email"
                  )}
                  name="email"
                  type="email"
                  value={
                    profile
                      .email
                  }
                  onChange={
                    handleProfileChange
                  }
                  icon={Mail}
                />

                <Field
                  label={t(
                    "settings.phone"
                  )}
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

                <div className="md:col-span-2">
                  <label
                    htmlFor="gender"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    {t(
                      "settings.gender"
                    )}
                  </label>

                  <select
                    id="gender"
                    name="gender"
                    value={
                      profile
                        .gender
                    }
                    onChange={
                      handleProfileChange
                    }
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
                  >
                    <option value="">
                      {t(
                        "settings.selectGender"
                      )}
                    </option>

                    <option value="Male">
                      {t(
                        "settings.male"
                      )}
                    </option>

                    <option value="Female">
                      {t(
                        "settings.female"
                      )}
                    </option>

                    <option value="Other">
                      {t(
                        "settings.other"
                      )}
                    </option>

                    <option value="Prefer not to say">
                      {t(
                        "settings.preferNot"
                      )}
                    </option>
                  </select>
                </div>
              </div>
            </SettingsSection>

            <IdentityEditor
              idNumber={
                patientInfo
                  ?.idNumber
              }
              dateOfBirth={
                profile
                  .dateOfBirth
              }
              onUpdated={(
                identity
              ) => {
                setPatientInfo(
                  (
                    current
                  ) => ({
                    ...current,

                    idNumber:
                      identity
                        .idNumber,

                    dateOfBirth:
                      identity
                        .dateOfBirth,
                  })
                );

                setProfile(
                  (
                    current
                  ) => ({
                    ...current,

                    dateOfBirth:
                      dateInputValue(
                        identity
                          .dateOfBirth
                      ),
                  })
                );
              }}
            />

            <SettingsSection
              icon={MapPin}
              title={t(
                "settings.addressTitle"
              )}
              description={t(
                "settings.addressDescription"
              )}
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Field
                    label={t(
                      "settings.addressLine1"
                    )}
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
                    label={t(
                      "settings.addressLine2"
                    )}
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
                  label={t(
                    "settings.suburb"
                  )}
                  name="suburb"
                  value={
                    profile
                      .suburb
                  }
                  onChange={
                    handleProfileChange
                  }
                />

                <Field
                  label={t(
                    "settings.city"
                  )}
                  name="city"
                  value={
                    profile
                      .city
                  }
                  onChange={
                    handleProfileChange
                  }
                />

                <Field
                  label={t(
                    "settings.province"
                  )}
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
                  label={t(
                    "settings.postalCode"
                  )}
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

            <SettingsSection
              icon={Phone}
              title={t(
                "settings.emergencyTitle"
              )}
              description={t(
                "settings.emergencyDescription"
              )}
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field
                  label={t(
                    "settings.contactName"
                  )}
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
                  label={t(
                    "settings.contactNumber"
                  )}
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
                    label={t(
                      "settings.relationship"
                    )}
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

            <SettingsSection
              icon={KeyRound}
              title={t(
                "settings.securityTitle"
              )}
              description={t(
                "settings.securityDescription"
              )}
            >
              <form
                onSubmit={
                  handleChangePassword
                }
                noValidate
              >
                {passwordError && (
                  <MessageBox
                    type="error"
                  >
                    {
                      passwordError
                    }
                  </MessageBox>
                )}

                {passwordSuccess && (
                  <MessageBox
                    type="success"
                  >
                    {
                      passwordSuccess
                    }
                  </MessageBox>
                )}

                <div className="grid grid-cols-1 gap-5">
                  <PasswordField
                    label={t(
                      "settings.currentPassword"
                    )}
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
                        (
                          current
                        ) =>
                          !current
                      )
                    }
                    autoComplete="current-password"
                  />

                  <PasswordField
                    label={t(
                      "settings.newPassword"
                    )}
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
                        (
                          current
                        ) =>
                          !current
                      )
                    }
                    autoComplete="new-password"
                  />

                  <PasswordField
                    label={t(
                      "settings.confirmPassword"
                    )}
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
                        (
                          current
                        ) =>
                          !current
                      )
                    }
                    autoComplete="new-password"
                  />
                </div>

                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-800">
                    {t(
                      "settings.passwordMustContain"
                    )}
                  </p>

                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <PasswordRequirement
                      met={
                        passwordRequirements
                          .length
                      }
                    >
                      {t(
                        "settings.requirementLength"
                      )}
                    </PasswordRequirement>

                    <PasswordRequirement
                      met={
                        passwordRequirements
                          .uppercase
                      }
                    >
                      {t(
                        "settings.requirementUppercase"
                      )}
                    </PasswordRequirement>

                    <PasswordRequirement
                      met={
                        passwordRequirements
                          .lowercase
                      }
                    >
                      {t(
                        "settings.requirementLowercase"
                      )}
                    </PasswordRequirement>

                    <PasswordRequirement
                      met={
                        passwordRequirements
                          .number
                      }
                    >
                      {t(
                        "settings.requirementNumber"
                      )}
                    </PasswordRequirement>

                    <PasswordRequirement
                      met={
                        passwordRequirements
                          .special
                      }
                    >
                      {t(
                        "settings.requirementSpecial"
                      )}
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
                    {
                      changingPassword
                        ? t(
                            "settings.changingPassword"
                          )
                        : t(
                            "settings.changePassword"
                          )
                    }
                  </Button>
                </div>
              </form>
            </SettingsSection>

            <SettingsSection
              icon={Bell}
              title={t(
                "settings.notificationsTitle"
              )}
              description={t(
                "settings.notificationsDescription"
              )}
            >
              <div className="divide-y divide-slate-200">
                <SettingToggle
                  title={t(
                    "settings.medicationReminders"
                  )}
                  description={t(
                    "settings.medicationRemindersDescription"
                  )}
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
                  title={t(
                    "settings.appointmentReminders"
                  )}
                  description={t(
                    "settings.appointmentRemindersDescription"
                  )}
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
                  title={t(
                    "settings.clinicNotifications"
                  )}
                  description={t(
                    "settings.clinicNotificationsDescription"
                  )}
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
                  title={t(
                    "settings.healthUpdates"
                  )}
                  description={t(
                    "settings.healthUpdatesDescription"
                  )}
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

            <SettingsSection
              icon={Shield}
              title={t(
                "settings.privacyTitle"
              )}
              description={t(
                "settings.privacyDescription"
              )}
            >
              <div className="divide-y divide-slate-200">
                <SettingToggle
                  title={t(
                    "settings.shareHealthData"
                  )}
                  description={t(
                    "settings.shareHealthDataDescription"
                  )}
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
                  title={t(
                    "settings.chatbotAccess"
                  )}
                  description={t(
                    "settings.chatbotAccessDescription"
                  )}
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
                {
                  saving
                    ? t(
                        "settings.saving"
                      )
                    : t(
                        "settings.saveChanges"
                      )
                }
              </Button>
            </div>
          </div>

          <aside className="flex min-w-0 flex-col gap-6">
            <LanguageCard
              value={
                currentLanguage
              }
              onChange={
                handleLanguageChange
              }
            />

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
                {t(
                  "settings.patientDetails"
                )}
              </h2>

              <div className="mt-5 flex flex-col gap-5">
                <InfoItem
                  label={t(
                    "settings.patientNumber"
                  )}
                  value={
                    patientInfo
                      ?.patientNumber ||
                    "—"
                  }
                />

                <InfoItem
                  label={t(
                    "settings.registeredClinic"
                  )}
                  value={
                    patientInfo
                      ?.clinicName ||
                    t(
                      "settings.notAssigned"
                    )
                  }
                />

                <InfoItem
                  label={t(
                    "settings.profileStatus"
                  )}
                  value={
                    patientInfo
                      ?.isProfileComplete
                      ? t(
                          "settings.complete"
                        )
                      : t(
                          "settings.incomplete"
                        )
                  }
                />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 lg:p-6">
              <h2 className="text-base font-semibold text-slate-900">
                {t(
                  "settings.medicalProfile"
                )}
              </h2>

              <div className="mt-5">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                  {t(
                    "settings.allergies"
                  )}
                </p>

                {
                  patientInfo
                    ?.allergies
                    ?.length
                    ? (
                        <div className="flex flex-wrap gap-2">
                          {
                            patientInfo
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
                              )
                          }
                        </div>
                      )
                    : (
                        <p className="text-sm text-slate-500">
                          {t(
                            "common.noneRecorded"
                          )}
                        </p>
                      )
                }
              </div>

              <div className="mt-6">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                  {t(
                    "settings.conditions"
                  )}
                </p>

                {
                  patientInfo
                    ?.conditions
                    ?.length
                    ? (
                        <div className="flex flex-wrap gap-2">
                          {
                            patientInfo
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
                              )
                          }
                        </div>
                      )
                    : (
                        <p className="text-sm text-slate-500">
                          {t(
                            "common.noneRecorded"
                          )}
                        </p>
                      )
                }
              </div>
            </section>
          </aside>
        </div>

        <div className="h-20 lg:hidden" />
      </div>
    </div>
  );
}

function LanguageCard({
  value,
  onChange,
}) {
  const {
    t,
  } =
    useTranslation();

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-5 py-5 lg:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100">
            <Languages
              size={18}
              className="text-teal-700"
            />
          </div>

          <div className="min-w-0">
            <h2 className="text-base font-semibold text-slate-900">
              {t(
                "settings.languageTitle"
              )}
            </h2>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              {t(
                "settings.languageDescription"
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 py-5 lg:px-6 lg:py-6">
        <label
          htmlFor="preferred-language"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          {t(
            "settings.preferredLanguage"
          )}
        </label>

        <select
          id="preferred-language"
          value={
            value
          }
          onChange={
            onChange
          }
          className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
        >
          {
            SUPPORTED_LANGUAGES.map(
              (
                language
              ) => (
                <option
                  key={
                    language.code
                  }
                  value={
                    language.code
                  }
                >
                  {
                    language.name
                  }
                </option>
              )
            )
          }
        </select>

        <p className="mt-4 text-xs leading-5 text-slate-400">
          {t(
            "settings.languageSaved"
          )}
        </p>
      </div>
    </section>
  );
}

function ThemeCard({
  theme,
  onToggle,
}) {
  const {
    t,
  } =
    useTranslation();

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
              {t(
                "settings.appearanceTitle"
              )}
            </h2>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              {t(
                "settings.appearanceDescription"
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 py-5 lg:px-6 lg:py-6">
        <div className="flex items-center justify-between gap-5">
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900">
              {t(
                "settings.theme"
              )}
            </p>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              {
                isDark
                  ? t(
                      "settings.darkModeOn"
                    )
                  : t(
                      "settings.lightModeOn"
                    )
              }
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={
              isDark
            }
            aria-label={t(
              "settings.toggleDarkMode"
            )}
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
              className={`absolute left-[3px] top-[3px] flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#10201a] shadow-md transition-transform duration-300 ${
                isDark
                  ? "translate-x-7"
                  : "translate-x-0"
              }`}
            >
              {
                isDark
                  ? (
                      <Moon
                        size={14}
                      />
                    )
                  : (
                      <Sun
                        size={14}
                      />
                    )
              }
            </span>
          </button>
        </div>

        <p className="mt-4 text-xs leading-5 text-slate-400">
          {t(
            "settings.appearanceSaved"
          )}
        </p>
      </div>
    </section>
  );
}

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
              {
                description
              }
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
        htmlFor={
          name
        }
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
  const {
    t,
  } =
    useTranslation();

  return (
    <div className="min-w-0">
      <label
        htmlFor={
          name
        }
        className="mb-2 block text-sm font-medium text-slate-700"
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
              ? t(
                  "settings.hidePassword",
                  {
                    label:
                      label.toLowerCase(),
                  }
                )
              : t(
                  "settings.showPassword",
                  {
                    label:
                      label.toLowerCase(),
                  }
                )
          }
        >
          {
            show
              ? (
                  <EyeOff
                    size={17}
                  />
                )
              : (
                  <Eye
                    size={17}
                  />
                )
          }
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
        {
          met
            ? "✓"
            : "○"
        }
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
          {
            description
          }
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

function MessageBox({
  type,
  children,
}) {
  const success =
    type ===
    "success";

  return (
    <div
      className={`mb-5 flex items-start gap-3 rounded-xl border p-4 ${
        success
          ? "border-green-200 bg-green-50"
          : "border-red-200 bg-red-50"
      }`}
    >
      {
        success
          ? (
              <CheckCircle
                size={17}
                className="mt-0.5 shrink-0 text-green-600"
              />
            )
          : (
              <AlertCircle
                size={17}
                className="mt-0.5 shrink-0 text-red-600"
              />
            )
      }

      <p className="text-sm text-slate-900">
        {children}
      </p>
    </div>
  );
}