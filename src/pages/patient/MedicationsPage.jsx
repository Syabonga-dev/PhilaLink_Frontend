import { useState } from "react";
import { Badge, Button } from "../../components/patient/chatbot/AstraCompat.jsx";
import {
  Clock,
  Plus,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Pill,
} from "lucide-react";

const medications = [
  {
    id: "1",
    name: "Metformin 500mg",
    type: "Tablet",
    schedule: "Twice daily with food",
    time: ["08:00", "18:00"],
    prescribedBy: "Dr. M. Khumalo",
    condition: "Type 2 Diabetes",
    nextDose: "Today, 18:00",
    status: "due",
    daysLeft: 14,
  },
  {
    id: "2",
    name: "Lisinopril 10mg",
    type: "Tablet",
    schedule: "Once daily",
    time: ["08:00"],
    prescribedBy: "Dr. M. Khumalo",
    condition: "Hypertension",
    nextDose: "Tomorrow, 08:00",
    status: "upcoming",
    daysLeft: 21,
  },
  {
    id: "3",
    name: "Atorvastatin 20mg",
    type: "Tablet",
    schedule: "Once daily at bedtime",
    time: ["21:00"],
    prescribedBy: "Dr. M. Khumalo",
    condition: "Cholesterol management",
    nextDose: "Tonight, 21:00",
    status: "upcoming",
    daysLeft: 7,
  },
];

export default function MedicationsPage() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="p-lg md:p-xl lg:p-2xl">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-lg lg:mb-xl gap-md">
        <div>
          <h1 className="text-title text-text-primary">
            My Medications
          </h1>

          <p className="text-label-sm text-text-secondary mt-xs">
            {medications.length} active prescriptions · Last synced today
          </p>
        </div>

        <Button
          variant="primary"
          iconStart={<Plus size={16} />}
        >
          Request refill
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg lg:gap-xl">
        <div className="lg:col-span-2 flex flex-col gap-md">
          {medications.map((med) => (
            <button
              key={med.id}
              onClick={() =>
                setSelected(
                  selected === med.id ? null : med.id
                )
              }
              className={`w-full text-left bg-surface-bg rounded-corner-lg p-lg lg:p-xl border transition-colors ${
                selected === med.id
                  ? "border-brand-primary"
                  : "border-border-secondary hover:border-border-primary"
              }`}
            >
              <div className="flex items-start justify-between gap-md">
                <div className="flex items-center gap-md flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-corner-full bg-brand-tertiary flex items-center justify-center flex-shrink-0">
                    <Pill
                      size={16}
                      className="text-brand-primary"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-label-sm text-text-primary font-semibold">
                      {med.name}
                    </p>

                    <p className="text-video-title text-text-secondary mt-xs">
                      {med.schedule}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-md flex-shrink-0">
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

                  <ChevronRight
                    size={16}
                    className={`text-text-tertiary transition-transform ${
                      selected === med.id
                        ? "rotate-90"
                        : ""
                    }`}
                  />
                </div>
              </div>

              {selected === med.id && (
                <div className="mt-lg pt-lg border-t border-border-secondary grid grid-cols-2 gap-md">
                  <div>
                    <p className="text-video-title text-text-tertiary mb-xs">
                      Condition
                    </p>

                    <p className="text-label-sm text-text-primary">
                      {med.condition}
                    </p>
                  </div>

                  <div>
                    <p className="text-video-title text-text-tertiary mb-xs">
                      Prescribed by
                    </p>

                    <p className="text-label-sm text-text-primary">
                      {med.prescribedBy}
                    </p>
                  </div>

                  <div>
                    <p className="text-video-title text-text-tertiary mb-xs">
                      Next dose
                    </p>

                    <div className="flex items-center gap-xs">
                      <Clock
                        size={12}
                        className="text-text-secondary"
                      />

                      <p className="text-label-sm text-text-primary">
                        {med.nextDose}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-video-title text-text-tertiary mb-xs">
                      Supply remaining
                    </p>

                    <div className="flex items-center gap-xs">
                      {med.daysLeft <= 7 ? (
                        <AlertCircle
                          size={12}
                          className="text-warning"
                        />
                      ) : (
                        <CheckCircle
                          size={12}
                          className="text-success"
                        />
                      )}

                      <p className="text-label-sm text-text-primary">
                        {med.daysLeft} days left
                      </p>
                    </div>
                  </div>

                  <div className="col-span-2 flex gap-md mt-xs">
                    <Button
                      variant="neutral"
                      className="flex-1"
                    >
                      Mark as taken
                    </Button>

                    <Button
                      variant="subtle"
                      className="flex-1"
                    >
                      Skip dose
                    </Button>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-lg">
          <div className="bg-surface-bg rounded-corner-lg p-lg lg:p-xl">
            <h2 className="text-label text-text-primary font-semibold mb-lg">
              Today's schedule
            </h2>

            <div className="flex flex-col gap-md">
              {["08:00", "18:00", "21:00"].map(
                (time) => {
                  const med = medications.find((m) =>
                    m.time.includes(time)
                  );

                  return (
                    <div
                      key={time}
                      className="flex items-center gap-md"
                    >
                      <div className="w-12 flex-shrink-0 text-right">
                        <span className="text-video-title text-text-tertiary">
                          {time}
                        </span>
                      </div>

                      <div className="w-px h-6 bg-border-secondary flex-shrink-0" />

                      <div className="flex-1 min-w-0">
                        {med ? (
                          <p className="text-label-sm text-text-primary truncate">
                            {med.name}
                          </p>
                        ) : (
                          <p className="text-label-sm text-text-tertiary">
                            No medication
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          <div className="bg-surface-bg rounded-corner-lg p-lg lg:p-xl">
            <h2 className="text-label text-text-primary font-semibold mb-lg">
              Allergies on record
            </h2>

            <div className="flex flex-col gap-sm">
              {["Penicillin", "Sulfonamides"].map(
                (allergy) => (
                  <div
                    key={allergy}
                    className="flex items-center gap-md"
                  >
                    <AlertCircle
                      size={13}
                      className="text-danger flex-shrink-0"
                    />

                    <span className="text-label-sm text-text-primary">
                      {allergy}
                    </span>
                  </div>
                )
              )}

              <button
                type="button"
                className="text-label-sm text-brand-primary hover:opacity-70 transition-opacity text-left mt-xs"
              >
                Update allergies →
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="h-20 lg:hidden" />
    </div>
  );
}
