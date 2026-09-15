import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  AlertCircle,
  Bell,
  CheckCircle,
  Mail,
  MapPin,
  Phone,
  Save,
  Shield,
  User,
} from "lucide-react";
import { Button } from "../../components/patient/chatbot/AstraCompat.jsx";
import { patientsApi } from "../../services/api/patients.js";

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
  emergencyContactRelationship: "",
};

const emptyPreferences = {
  medicationReminders: false,
  appointmentReminders: false,
  clinicNotifications: false,
  healthUpdates: false,
  shareHealthData: false,
  allowChatbotProfileAccess: false,
};

function fieldValue(value) {
  return value ?? "";
}

function dateInputValue(value) {
  if (!value) {
    return "";
  }

  const text = String(value);

  if (/^\d{4}-\d{2}-\d{2}/.test(text)) {
    return text.slice(0, 10);
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

export default function SettingsPage() {
  const [profile, setProfile] =
    useState(emptyProfile);

  const [preferences, setPreferences] =
    useState(emptyPreferences);

  const [patientInfo, setPatientInfo] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const loadSettings =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const [
          patient,
          patientPreferences,
        ] = await Promise.all([
          patientsApi.getMe(),
          patientsApi.getPreferences(),
        ]);

        setPatientInfo(patient);

        setProfile({
          fullName:
            fieldValue(
              patient?.fullName
            ),

          email:
            fieldValue(
              patient?.email
            ),

          phoneNumber:
            fieldValue(
              patient?.phoneNumber
            ),

          dateOfBirth:
            dateInputValue(
              patient?.dateOfBirth
            ),

          gender:
            fieldValue(
              patient?.gender
            ),

          addressLine1:
            fieldValue(
              patient?.addressLine1
            ),

          addressLine2:
            fieldValue(
              patient?.addressLine2
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
              patient?.province
            ),

          postalCode:
            fieldValue(
              patient?.postalCode
            ),

          emergencyContactName:
            fieldValue(
              patient?.emergencyContactName
            ),

          emergencyContactPhone:
            fieldValue(
              patient?.emergencyContactPhone
            ),

          emergencyContactRelationship:
            fieldValue(
              patient?.emergencyContactRelationship
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
      } catch (err) {
        console.error(
          "Failed to load settings:",
          err
        );

        setError(
          err?.message ||
            "We could not load your settings."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  function handleProfileChange(
    event
  ) {
    const {
      name,
      value,
    } = event.target;

    setProfile(
      (current) => ({
        ...current,
        [name]: value,
      })
    );
  }

  function togglePreference(key) {
    setSuccess("");

    setPreferences(
      (current) => ({
        ...current,
        [key]:
          !current[key],
      })
    );
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updatedPatient =
        await patientsApi.updateMe({
          fullName:
            profile.fullName.trim(),

          email:
            profile.email.trim(),

          phoneNumber:
            profile.phoneNumber.trim(),

          dateOfBirth:
            profile.dateOfBirth,

          gender:
            profile.gender.trim(),

          addressLine1:
            profile.addressLine1.trim(),

          addressLine2:
            profile.addressLine2.trim() ||
            null,

          suburb:
            profile.suburb.trim(),

          city:
            profile.city.trim(),

          province:
            profile.province.trim(),

          postalCode:
            profile.postalCode.trim(),

          emergencyContactName:
            profile.emergencyContactName.trim(),

          emergencyContactPhone:
            profile.emergencyContactPhone.trim(),

          emergencyContactRelationship:
            profile.emergencyContactRelationship.trim(),
        });

      await patientsApi
        .updatePreferences(
          preferences
        );

      setPatientInfo(
        updatedPatient
      );

      setSuccess(
        "Your settings have been saved."
      );
    } catch (err) {
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
            notifications and privacy
            preferences.
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
                onClick={loadSettings}
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
                    profile.fullName
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
                    profile.phoneNumber
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
                    profile.dateOfBirth
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
                      profile.addressLine1
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
              icon={Phone}
              title="Emergency contact"
              description="Keep your emergency contact information current."
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field
                  label="Contact name"
                  name="emergencyContactName"
                  value={
                    profile.emergencyContactName
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
                    profile.emergencyContactPhone
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
                      profile.emergencyContactRelationship
                    }
                    onChange={
                      handleProfileChange
                    }
                  />
                </div>
              </div>
            </SettingsSection>

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
                  <Save size={16} />
                }
                onClick={handleSave}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save changes"}
              </Button>
            </div>
          </div>

          <aside className="flex min-w-0 flex-col gap-6">
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
          onChange={onChange}
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
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={onChange}
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