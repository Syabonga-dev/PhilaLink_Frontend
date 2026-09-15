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
import {
  Button,
} from "../../components/patient/chatbot/AstraCompat.jsx";
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
            fieldValue(patient?.fullName),
          email:
            fieldValue(patient?.email),
          phoneNumber:
            fieldValue(
              patient?.phoneNumber
            ),
          dateOfBirth:
            fieldValue(
              patient?.dateOfBirth
            ),
          gender:
            fieldValue(patient?.gender),
          addressLine1:
            fieldValue(
              patient?.addressLine1
            ),
          addressLine2:
            fieldValue(
              patient?.addressLine2
            ),
          suburb:
            fieldValue(patient?.suburb),
          city:
            fieldValue(patient?.city),
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
    const { name, value } =
      event.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function togglePreference(key) {
    setPreferences((current) => ({
      ...current,
      [key]: !current[key],
    }));
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

      await patientsApi.updatePreferences(
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
      <div className="p-lg md:p-xl lg:p-2xl">
        <div className="animate-pulse">
          <div className="h-7 w-40 rounded bg-border-secondary mb-sm" />
          <div className="h-4 w-72 rounded bg-border-secondary mb-xl" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
            <div className="lg:col-span-2 h-96 rounded-corner-lg bg-surface-bg" />
            <div className="h-72 rounded-corner-lg bg-surface-bg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-lg md:p-xl lg:p-2xl">
      <div className="mb-lg lg:mb-xl">
        <h1 className="text-title text-text-primary">
          Settings
        </h1>

        <p className="mt-xs text-label-sm text-text-secondary">
          Manage your profile,
          notifications and privacy
          preferences.
        </p>
      </div>

      {error && (
        <div className="mb-lg flex items-start gap-md rounded-corner-lg border border-danger/20 bg-danger/10 p-md">
          <AlertCircle
            size={17}
            className="mt-0.5 shrink-0 text-danger"
          />

          <div className="flex-1">
            <p className="text-label-sm text-text-primary">
              {error}
            </p>

            <button
              type="button"
              onClick={loadSettings}
              className="mt-xs text-label-sm text-brand-primary hover:opacity-70"
            >
              Reload settings
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-lg flex items-center gap-md rounded-corner-lg border border-success/20 bg-success/10 p-md">
          <CheckCircle
            size={17}
            className="shrink-0 text-success"
          />

          <p className="text-label-sm text-text-primary">
            {success}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-lg lg:grid-cols-3 lg:gap-xl">
        <div className="flex flex-col gap-lg lg:col-span-2">
          <section className="rounded-corner-lg bg-surface-bg p-lg lg:p-xl border border-border-secondary">
            <SectionHeader
              icon={User}
              title="Personal information"
              description="Keep your personal and contact details up to date."
            />

            <div className="grid grid-cols-1 gap-md md:grid-cols-2">
              <Field
                label="Full name"
                name="fullName"
                value={profile.fullName}
                onChange={handleProfileChange}
                icon={User}
              />

              <Field
                label="Email address"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleProfileChange}
                icon={Mail}
              />

              <Field
                label="Phone number"
                name="phoneNumber"
                type="tel"
                value={profile.phoneNumber}
                onChange={handleProfileChange}
                icon={Phone}
              />

              <Field
                label="Date of birth"
                name="dateOfBirth"
                type="date"
                value={profile.dateOfBirth}
                onChange={handleProfileChange}
              />

              <div>
                <label
                  htmlFor="gender"
                  className="mb-xs block text-video-title font-medium text-text-secondary"
                >
                  Gender
                </label>

                <select
                  id="gender"
                  name="gender"
                  value={profile.gender}
                  onChange={handleProfileChange}
                  className="w-full rounded-corner-md border border-border-secondary bg-white py-2.5 px-4 text-label-sm text-text-primary outline-none transition focus:border-brand-primary"
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
          </section>

          <section className="rounded-corner-lg bg-surface-bg p-lg lg:p-xl border border-border-secondary">
            <SectionHeader
              icon={MapPin}
              title="Address"
              description="Update your residential address."
            />

            <div className="grid grid-cols-1 gap-md md:grid-cols-2">
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
                value={profile.suburb}
                onChange={handleProfileChange}
              />

              <Field
                label="City"
                name="city"
                value={profile.city}
                onChange={handleProfileChange}
              />

              <Field
                label="Province"
                name="province"
                value={profile.province}
                onChange={handleProfileChange}
              />

              <Field
                label="Postal code"
                name="postalCode"
                value={profile.postalCode}
                onChange={handleProfileChange}
              />
            </div>
          </section>

          <section className="rounded-corner-lg bg-surface-bg p-lg lg:p-xl border border-border-secondary">
            <SectionHeader
              icon={Phone}
              title="Emergency contact"
              description="Keep your emergency contact information current."
            />

            <div className="grid grid-cols-1 gap-md md:grid-cols-2">
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
          </section>

          <section className="rounded-corner-lg bg-surface-bg p-lg lg:p-xl border border-border-secondary">
            <SectionHeader
              icon={Bell}
              title="Notifications"
              description="Choose which reminders and updates you want to receive."
            />

            <div className="divide-y divide-border-secondary">
              <SettingToggle
                title="Medication reminders"
                description="Receive reminders when your medication is due."
                checked={
                  preferences.medicationReminders
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
                  preferences.appointmentReminders
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
                  preferences.clinicNotifications
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
                  preferences.healthUpdates
                }
                onChange={() =>
                  togglePreference(
                    "healthUpdates"
                  )
                }
              />
            </div>
          </section>

          <section className="rounded-corner-lg bg-surface-bg p-lg lg:p-xl border border-border-secondary">
            <SectionHeader
              icon={Shield}
              title="Privacy"
              description="Control how your information is used inside PhilaLink."
            />

            <div className="divide-y divide-border-secondary">
              <SettingToggle
                title="Share relevant health data"
                description="Allow authorized healthcare staff to access relevant information in your PhilaLink record."
                checked={
                  preferences.shareHealthData
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
                  preferences.allowChatbotProfileAccess
                }
                onChange={() =>
                  togglePreference(
                    "allowChatbotProfileAccess"
                  )
                }
              />
            </div>
          </section>

          <div className="flex justify-end">
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

        <div className="flex flex-col gap-lg">
          <section className="rounded-corner-lg bg-surface-bg p-lg lg:p-xl border border-border-secondary">
            <h2 className="text-label font-semibold text-text-primary">
              Patient details
            </h2>

            <div className="mt-lg flex flex-col gap-md">
              <InfoItem
                label="Patient number"
                value={
                  patientInfo?.patientNumber ||
                  "—"
                }
              />

              <InfoItem
                label="Registered clinic"
                value={
                  patientInfo?.clinicName ||
                  "Not assigned"
                }
              />

              <InfoItem
                label="Profile status"
                value={
                  patientInfo?.isProfileComplete
                    ? "Complete"
                    : "Incomplete"
                }
              />
            </div>
          </section>

          <section className="rounded-corner-lg bg-surface-bg p-lg lg:p-xl border border-border-secondary">
            <h2 className="text-label font-semibold text-text-primary">
              Medical profile
            </h2>

            <div className="mt-lg">
              <p className="text-video-title text-text-tertiary mb-sm">
                Allergies
              </p>

              {patientInfo?.allergies
                ?.length ? (
                <div className="flex flex-wrap gap-xs">
                  {patientInfo.allergies.map(
                    (allergy) => (
                      <span
                        key={allergy.id}
                        className="rounded-corner-full bg-bg-faint px-sm py-xs text-video-title text-text-primary"
                      >
                        {allergy.name}
                      </span>
                    )
                  )}
                </div>
              ) : (
                <p className="text-label-sm text-text-secondary">
                  None recorded
                </p>
              )}
            </div>

            <div className="mt-lg">
              <p className="text-video-title text-text-tertiary mb-sm">
                Conditions
              </p>

              {patientInfo?.conditions
                ?.length ? (
                <div className="flex flex-wrap gap-xs">
                  {patientInfo.conditions.map(
                    (condition) => (
                      <span
                        key={condition.id}
                        className="rounded-corner-full bg-bg-faint px-sm py-xs text-video-title text-text-primary"
                      >
                        {condition.name}
                      </span>
                    )
                  )}
                </div>
              ) : (
                <p className="text-label-sm text-text-secondary">
                  None recorded
                </p>
              )}
            </div>
          </section>
        </div>
      </div>

      <div className="h-20 lg:hidden" />
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="mb-lg flex items-center gap-md">
      <div className="flex h-10 w-10 items-center justify-center rounded-corner-full bg-brand-tertiary">
        <Icon
          size={17}
          className="text-brand-primary"
        />
      </div>

      <div>
        <h2 className="text-label font-semibold text-text-primary">
          {title}
        </h2>

        <p className="mt-xs text-video-title text-text-secondary">
          {description}
        </p>
      </div>
    </div>
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
    <div>
      <label
        htmlFor={name}
        className="mb-xs block text-video-title font-medium text-text-secondary"
      >
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
          />
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          className={`w-full rounded-corner-md border border-border-secondary bg-white py-2.5 pr-4 text-label-sm text-text-primary outline-none transition focus:border-brand-primary ${
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
      <p className="text-video-title text-text-tertiary">
        {label}
      </p>

      <p className="mt-xs text-label-sm text-text-primary">
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
    <div className="flex items-center justify-between gap-lg py-md first:pt-0 last:pb-0">
      <div className="min-w-0">
        <p className="text-label-sm font-medium text-text-primary">
          {title}
        </p>

        <p className="mt-xs text-video-title leading-5 text-text-secondary">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onChange}
        role="switch"
        aria-checked={checked}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked
            ? "bg-brand-primary"
            : "bg-[#cbd5e1]"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            checked
              ? "translate-x-6"
              : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}