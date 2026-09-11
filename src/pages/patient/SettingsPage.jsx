import { useState } from "react";
import { Button } from "../../components/patient/chatbot/AstraCompat.jsx";
import {
  Bell,
  Lock,
  Mail,
  Phone,
  Save,
  Shield,
  User,
} from "lucide-react";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    fullName: "Sarah Mokoena",
    email: "sarah.mokoena@example.com",
    phoneNumber: "+27 82 555 0148",
    emergencyContact: "+27 83 555 0192",
  });

  const [notifications, setNotifications] =
    useState({
      medicationReminders: true,
      appointmentReminders: true,
      clinicNotifications: true,
      healthUpdates: false,
    });

  const [privacy, setPrivacy] = useState({
    shareHealthData: true,
    allowChatbotProfileAccess: true,
  });

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleNotificationToggle = (key) => {
    setNotifications((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const handlePrivacyToggle = (key) => {
    setPrivacy((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const handleSave = () => {
    console.log("Profile settings:", profile);
    console.log(
      "Notification settings:",
      notifications
    );
    console.log("Privacy settings:", privacy);
  };

  return (
    <div className="p-lg md:p-xl lg:p-2xl">
      <div className="mb-lg lg:mb-xl">
        <h1 className="text-title text-text-primary">
          Settings
        </h1>

        <p className="mt-xs text-label-sm text-text-secondary">
          Manage your profile, notifications,
          privacy and account preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-lg lg:grid-cols-3 lg:gap-xl">
        <div className="flex flex-col gap-lg lg:col-span-2">
          <section className="rounded-corner-lg bg-surface-bg p-lg lg:p-xl">
            <div className="mb-lg flex items-center gap-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-corner-full bg-brand-tertiary">
                <User
                  size={17}
                  className="text-brand-primary"
                />
              </div>

              <div>
                <h2 className="text-label font-semibold text-text-primary">
                  Personal information
                </h2>

                <p className="mt-xs text-video-title text-text-secondary">
                  Keep your contact details up to date.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-md md:grid-cols-2">
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-xs block text-video-title font-medium text-text-secondary"
                >
                  Full name
                </label>

                <div className="relative">
                  <User
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
                  />

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={profile.fullName}
                    onChange={handleProfileChange}
                    className="w-full rounded-corner-md border border-border-secondary bg-white py-2.5 pl-10 pr-4 text-label-sm text-text-primary outline-none transition focus:border-brand-primary"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-xs block text-video-title font-medium text-text-secondary"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    className="w-full rounded-corner-md border border-border-secondary bg-white py-2.5 pl-10 pr-4 text-label-sm text-text-primary outline-none transition focus:border-brand-primary"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phoneNumber"
                  className="mb-xs block text-video-title font-medium text-text-secondary"
                >
                  Phone number
                </label>

                <div className="relative">
                  <Phone
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
                  />

                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={profile.phoneNumber}
                    onChange={handleProfileChange}
                    className="w-full rounded-corner-md border border-border-secondary bg-white py-2.5 pl-10 pr-4 text-label-sm text-text-primary outline-none transition focus:border-brand-primary"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="emergencyContact"
                  className="mb-xs block text-video-title font-medium text-text-secondary"
                >
                  Emergency contact
                </label>

                <div className="relative">
                  <Phone
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
                  />

                  <input
                    id="emergencyContact"
                    name="emergencyContact"
                    type="tel"
                    value={
                      profile.emergencyContact
                    }
                    onChange={handleProfileChange}
                    className="w-full rounded-corner-md border border-border-secondary bg-white py-2.5 pl-10 pr-4 text-label-sm text-text-primary outline-none transition focus:border-brand-primary"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-corner-lg bg-surface-bg p-lg lg:p-xl">
            <div className="mb-lg flex items-center gap-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-corner-full bg-brand-tertiary">
                <Bell
                  size={17}
                  className="text-brand-primary"
                />
              </div>

              <div>
                <h2 className="text-label font-semibold text-text-primary">
                  Notifications
                </h2>

                <p className="mt-xs text-video-title text-text-secondary">
                  Choose which reminders you want to
                  receive.
                </p>
              </div>
            </div>

            <div className="divide-y divide-border-secondary">
              <SettingToggle
                title="Medication reminders"
                description="Receive reminders when your medication is due."
                checked={
                  notifications.medicationReminders
                }
                onChange={() =>
                  handleNotificationToggle(
                    "medicationReminders"
                  )
                }
              />

              <SettingToggle
                title="Appointment reminders"
                description="Get notified before upcoming appointments."
                checked={
                  notifications.appointmentReminders
                }
                onChange={() =>
                  handleNotificationToggle(
                    "appointmentReminders"
                  )
                }
              />

              <SettingToggle
                title="Clinic notifications"
                description="Receive updates from your registered clinic."
                checked={
                  notifications.clinicNotifications
                }
                onChange={() =>
                  handleNotificationToggle(
                    "clinicNotifications"
                  )
                }
              />

              <SettingToggle
                title="General health updates"
                description="Receive occasional health information from PhilaLink."
                checked={
                  notifications.healthUpdates
                }
                onChange={() =>
                  handleNotificationToggle(
                    "healthUpdates"
                  )
                }
              />
            </div>
          </section>

          <section className="rounded-corner-lg bg-surface-bg p-lg lg:p-xl">
            <div className="mb-lg flex items-center gap-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-corner-full bg-brand-tertiary">
                <Shield
                  size={17}
                  className="text-brand-primary"
                />
              </div>

              <div>
                <h2 className="text-label font-semibold text-text-primary">
                  Privacy
                </h2>

                <p className="mt-xs text-video-title text-text-secondary">
                  Control how your information is used
                  inside PhilaLink.
                </p>
              </div>
            </div>

            <div className="divide-y divide-border-secondary">
              <SettingToggle
                title="Share relevant health data"
                description="Allow authorized healthcare staff to access relevant information in your PhilaLink record."
                checked={
                  privacy.shareHealthData
                }
                onChange={() =>
                  handlePrivacyToggle(
                    "shareHealthData"
                  )
                }
              />

              <SettingToggle
                title="Allow PhilaChatBot profile access"
                description="Allow PhilaChatBot to use your saved age, allergies and medications during health assessments."
                checked={
                  privacy.allowChatbotProfileAccess
                }
                onChange={() =>
                  handlePrivacyToggle(
                    "allowChatbotProfileAccess"
                  )
                }
              />
            </div>
          </section>

          <div className="flex justify-end">
            <Button
              variant="primary"
              iconStart={<Save size={16} />}
              onClick={handleSave}
            >
              Save changes
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-lg">
          <section className="rounded-corner-lg bg-surface-bg p-lg lg:p-xl">
            <div className="mb-lg flex items-center gap-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-corner-full bg-brand-tertiary">
                <Lock
                  size={17}
                  className="text-brand-primary"
                />
              </div>

              <div>
                <h2 className="text-label font-semibold text-text-primary">
                  Security
                </h2>

                <p className="mt-xs text-video-title text-text-secondary">
                  Protect your PhilaLink account.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-md">
              <button
                type="button"
                className="w-full rounded-corner-md border border-border-secondary bg-white px-md py-sm text-left text-label-sm font-medium text-text-primary transition hover:bg-bg-faint"
              >
                Change password
              </button>

              <button
                type="button"
                className="w-full rounded-corner-md border border-border-secondary bg-white px-md py-sm text-left text-label-sm font-medium text-text-primary transition hover:bg-bg-faint"
              >
                Review active sessions
              </button>
            </div>
          </section>

          <section className="rounded-corner-lg bg-surface-bg p-lg lg:p-xl">
            <h2 className="text-label font-semibold text-text-primary">
              Patient details
            </h2>

            <div className="mt-lg flex flex-col gap-md">
              <div>
                <p className="text-video-title text-text-tertiary">
                  Patient ID
                </p>

                <p className="mt-xs text-label-sm text-text-primary">
                  PHL-2024-8831
                </p>
              </div>

              <div>
                <p className="text-video-title text-text-tertiary">
                  Account role
                </p>

                <p className="mt-xs text-label-sm text-text-primary">
                  Patient
                </p>
              </div>

              <div>
                <p className="text-video-title text-text-tertiary">
                  Registered clinic
                </p>

                <p className="mt-xs text-label-sm text-text-primary">
                  Soweto Community Health Centre
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="h-20 lg:hidden" />
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
