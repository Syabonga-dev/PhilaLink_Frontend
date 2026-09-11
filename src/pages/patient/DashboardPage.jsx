import { useNavigate } from "react-router-dom";
import { Avatar, Badge } from "../../components/patient/chatbot/AstraCompat.jsx";
import {
  Calendar,
  ChevronRight,
  Clock,
  AlertCircle,
  CheckCircle,
  Activity,
} from "lucide-react";

const medications = [
  {
    name: "Metformin 500mg",
    schedule: "Twice daily with food",
    next: "Today, 18:00",
    status: "due",
  },
  {
    name: "Lisinopril 10mg",
    schedule: "Once daily",
    next: "Tomorrow, 08:00",
    status: "upcoming",
  },
  {
    name: "Atorvastatin 20mg",
    schedule: "Once daily at bedtime",
    next: "Tonight, 21:00",
    status: "upcoming",
  },
];

const appointments = [
  {
    type: "GP Consultation",
    provider: "Dr. M. Khumalo",
    date: "Thu, 12 Sep",
    time: "10:00",
    status: "confirmed",
  },
  {
    type: "Blood Test (HbA1c)",
    provider: "PhilaLink Laboratory",
    date: "Mon, 16 Sep",
    time: "08:30",
    status: "pending",
  },
];

const metrics = [
  {
    label: "Blood Pressure",
    value: "128/82",
    unit: "mmHg",
    status: "warning",
    note: "Slightly elevated",
  },
  {
    label: "Blood Glucose",
    value: "7.2",
    unit: "mmol/L",
    status: "success",
    note: "Within target",
  },
  {
    label: "Weight",
    value: "74.5",
    unit: "kg",
    status: "success",
    note: "Stable",
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="p-lg md:p-xl lg:p-2xl">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-lg lg:mb-xl gap-md">
        <div>
          <h1 className="text-title text-text-primary">
            Good morning, Sarah
          </h1>

          <p className="text-label-sm text-text-secondary mt-xs">
            Thursday, 10 September 2026 · PhilaLink Patient Portal
          </p>
        </div>

        <Badge
          label="3 reminders due"
          variant="warning"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg lg:gap-xl">
        <div className="col-span-1 md:col-span-2 flex flex-col gap-lg lg:gap-xl">
          <div className="bg-surface-bg rounded-corner-lg p-lg lg:p-xl">
            <div className="flex items-center justify-between mb-lg">
              <h2 className="text-label text-text-primary font-semibold">
                My Medications
              </h2>

              <button
                type="button"
                onClick={() =>
                  navigate("/patient/medications")
                }
                className="text-label-sm text-brand-primary flex items-center gap-xs hover:opacity-70 transition-opacity"
              >
                View all
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="flex flex-col">
              {medications.map((med, index) => (
                <div
                  key={med.name}
                  className={`flex items-start sm:items-center justify-between py-lg gap-md ${
                    index < medications.length - 1
                      ? "border-b border-border-secondary"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-md flex-1 min-w-0">
                    <div
                      className={`w-2 h-2 rounded-corner-full flex-shrink-0 ${
                        med.status === "due"
                          ? "bg-warning"
                          : "bg-bg-hover"
                      }`}
                    />

                    <div className="min-w-0">
                      <p className="text-label-sm text-text-primary font-medium truncate">
                        {med.name}
                      </p>

                      <p className="text-video-title text-text-secondary mt-xs">
                        {med.schedule}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-xs sm:gap-md flex-shrink-0">
                    <div className="flex items-center gap-xs">
                      <Clock
                        size={12}
                        className="text-text-tertiary"
                      />

                      <span className="text-video-title text-text-secondary whitespace-nowrap">
                        {med.next}
                      </span>
                    </div>

                    <Badge
                      label={
                        med.status === "due"
                          ? "Due now"
                          : "Upcoming"
                      }
                      variant={
                        med.status === "due"
                          ? "warning"
                          : "default"
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-bg rounded-corner-lg p-lg lg:p-xl">
            <div className="flex items-center justify-between mb-lg">
              <h2 className="text-label text-text-primary font-semibold">
                Health Metrics
              </h2>

              <span className="text-video-title text-text-secondary">
                Last updated: Today
              </span>
            </div>

            <div className="flex flex-col sm:grid sm:grid-cols-3 gap-md">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="bg-bg-faint rounded-corner-md p-md"
                >
                  <div className="flex items-center gap-md sm:flex-col sm:items-start sm:gap-xs">
                    <p className="text-video-title text-text-secondary w-28 flex-shrink-0 sm:w-auto sm:mb-xs">
                      {metric.label}
                    </p>

                    <p className="text-label-sm text-text-primary font-semibold flex-1 sm:flex-none">
                      {metric.value}

                      <span className="text-video-title text-text-secondary font-normal ml-xs">
                        {metric.unit}
                      </span>
                    </p>

                    <div className="flex items-center gap-xs flex-shrink-0">
                      {metric.status === "success" ? (
                        <CheckCircle
                          size={11}
                          className="text-success"
                        />
                      ) : (
                        <AlertCircle
                          size={11}
                          className="text-warning"
                        />
                      )}

                      <span className="text-video-title text-text-secondary hidden sm:inline">
                        {metric.note}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-lg lg:gap-xl">
          <div className="bg-surface-bg rounded-corner-lg p-lg lg:p-xl">
            <div className="flex items-center justify-between mb-lg">
              <h2 className="text-label text-text-primary font-semibold">
                Appointments
              </h2>

              <button
                type="button"
                onClick={() =>
                  navigate("/patient/appointments")
                }
                className="text-label-sm text-brand-primary hover:opacity-70 transition-opacity"
              >
                Book
              </button>
            </div>

            <div className="flex flex-col gap-lg">
              {appointments.map((appointment) => (
                <div
                  key={appointment.type}
                  className="bg-bg-faint rounded-corner-md p-lg"
                >
                  <div className="flex items-start justify-between gap-md">
                    <div className="flex-1 min-w-0">
                      <p className="text-label-sm text-text-primary font-medium truncate">
                        {appointment.type}
                      </p>

                      <p className="text-video-title text-text-secondary mt-xs">
                        {appointment.provider}
                      </p>
                    </div>

                    <Badge
                      label={
                        appointment.status ===
                        "confirmed"
                          ? "Confirmed"
                          : "Pending"
                      }
                      variant={
                        appointment.status ===
                        "confirmed"
                          ? "success"
                          : "default"
                      }
                    />
                  </div>

                  <div className="flex items-center gap-xs mt-md">
                    <Calendar
                      size={11}
                      className="text-text-tertiary"
                    />

                    <span className="text-video-title text-text-secondary">
                      {appointment.date} ·{" "}
                      {appointment.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-bg rounded-corner-lg p-lg lg:p-xl">
            <h2 className="text-label text-text-primary font-semibold mb-lg">
              My Clinic
            </h2>

            <div className="flex flex-col gap-md">
              <p className="text-label-sm text-text-primary font-medium">
                Soweto Community Health Centre
              </p>

              <p className="text-label-sm text-text-secondary">
                Dr. M. Khumalo · General Practitioner
              </p>

              <div className="flex items-center gap-xs">
                <Activity
                  size={11}
                  className="text-success"
                />

                <span className="text-video-title text-text-secondary">
                  Open · Closes 17:00
                </span>
              </div>

              <button
                type="button"
                className="text-label-sm text-brand-primary hover:opacity-70 transition-opacity text-left mt-xs"
              >
                Contact clinic →
              </button>
            </div>
          </div>

          <div className="bg-surface-bg rounded-corner-lg p-lg lg:p-xl">
            <div className="flex items-center gap-md mb-lg">
              <Avatar
                type="initial"
                initials="SM"
                size="large"
                shape="square"
                className="!rounded-[10px]"
              />

              <div>
                <p className="text-label-sm text-text-primary font-medium">
                  Ms. S. Mokoena
                </p>

                <p className="text-video-title text-text-secondary">
                  ID: PHL-2024-8831
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-sm">
              <div className="flex justify-between gap-md">
                <span className="text-video-title text-text-secondary">
                  Date of birth
                </span>

                <span className="text-video-title text-text-primary">
                  12 March 1982
                </span>
              </div>

              <div className="flex justify-between gap-md">
                <span className="text-video-title text-text-secondary">
                  Conditions
                </span>

                <span className="text-video-title text-text-primary text-right">
                  Diabetes, Hypertension
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-20 lg:hidden" />
    </div>
  );
}
