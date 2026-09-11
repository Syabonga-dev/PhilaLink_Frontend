import { useState } from "react";
import { Badge, Button } from "../../components/patient/chatbot/AstraCompat.jsx";
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Video,
  ChevronRight,
} from "lucide-react";

const upcoming = [
  {
    id: "1",
    type: "GP Consultation",
    provider: "Dr. M. Khumalo",
    facility: "Soweto Community Health Centre",
    date: "Thursday, 12 September 2026",
    time: "10:00 – 10:30",
    mode: "in-person",
    status: "confirmed",
  },
  {
    id: "2",
    type: "Blood Test (HbA1c)",
    provider: "PhilaLink Laboratory",
    facility: "PhilaLink Diagnostic Centre",
    date: "Monday, 16 September 2026",
    time: "08:30 – 09:00",
    mode: "in-person",
    status: "pending",
  },
  {
    id: "3",
    type: "Chronic Medication Review",
    provider: "Dr. M. Khumalo",
    facility: "Telehealth",
    date: "Monday, 23 September 2026",
    time: "14:00 – 14:20",
    mode: "telehealth",
    status: "confirmed",
  },
];

const past = [
  {
    id: "4",
    type: "Blood Pressure Check",
    provider: "Sister T. Dlamini",
    date: "Monday, 2 September 2026",
    status: "completed",
  },
];

export default function AppointmentsPage() {
  const [tab, setTab] = useState("upcoming");

  return (
    <div className="p-lg md:p-xl lg:p-2xl">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-lg lg:mb-xl gap-md">
        <div>
          <h1 className="text-title text-text-primary">
            Appointments
          </h1>

          <p className="text-label-sm text-text-secondary mt-xs">
            {upcoming.length} upcoming · Soweto Community Health Centre
          </p>
        </div>

        <Button
          variant="primary"
          iconStart={<Plus size={16} />}
        >
          Book appointment
        </Button>
      </div>

      <div className="flex gap-md mb-xl border-b border-border-secondary">
        {["upcoming", "past"].map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`pb-md text-label-sm font-medium transition-colors capitalize border-b-2 -mb-px ${
              tab === item
                ? "text-brand-primary border-brand-primary"
                : "text-text-secondary border-transparent hover:text-text-primary"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === "upcoming" ? (
        <div className="flex flex-col gap-md">
          {upcoming.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-surface-bg rounded-corner-lg p-lg lg:p-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-md">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-md mb-md">
                    <h3 className="text-label-sm text-text-primary font-semibold">
                      {appointment.type}
                    </h3>

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

                  <div className="flex flex-col gap-sm">
                    <div className="flex items-center gap-xs">
                      <Calendar
                        size={13}
                        className="text-text-tertiary flex-shrink-0"
                      />

                      <span className="text-label-sm text-text-secondary">
                        {appointment.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-xs">
                      <Clock
                        size={13}
                        className="text-text-tertiary flex-shrink-0"
                      />

                      <span className="text-label-sm text-text-secondary">
                        {appointment.time}
                      </span>
                    </div>

                    <div className="flex items-center gap-xs">
                      {appointment.mode ===
                      "telehealth" ? (
                        <Video
                          size={13}
                          className="text-brand-primary flex-shrink-0"
                        />
                      ) : (
                        <MapPin
                          size={13}
                          className="text-text-tertiary flex-shrink-0"
                        />
                      )}

                      <span className="text-label-sm text-text-secondary">
                        {appointment.facility}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-md mt-lg pt-lg border-t border-border-secondary">
                <Button
                  variant="neutral"
                  className="flex-1"
                >
                  Reschedule
                </Button>

                {appointment.mode ===
                  "telehealth" && (
                  <Button
                    variant="primary"
                    iconStart={<Video size={15} />}
                    className="flex-1"
                  >
                    Join call
                  </Button>
                )}

                <Button variant="subtle">
                  Cancel
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-md">
          {past.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-surface-bg rounded-corner-lg p-lg lg:p-xl flex items-center justify-between gap-md opacity-70"
            >
              <div>
                <p className="text-label-sm text-text-primary font-medium">
                  {appointment.type}
                </p>

                <p className="text-video-title text-text-secondary mt-xs">
                  {appointment.date} ·{" "}
                  {appointment.provider}
                </p>
              </div>

              <div className="flex items-center gap-md">
                <Badge
                  label="Completed"
                  variant="success"
                />

                <button
                  type="button"
                  className="text-brand-primary hover:opacity-70 transition-opacity"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="h-20 lg:hidden" />
    </div>
  );
}
