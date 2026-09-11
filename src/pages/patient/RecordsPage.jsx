import { useState } from "react";
import { Badge, Button } from "../../components/patient/chatbot/AstraCompat.jsx";
import {
  Calendar,
  FileText,
  Download,
  ChevronRight,
  Search,
  Filter,
  Activity,
  Pill,
  Stethoscope,
} from "lucide-react";

const records = [
  {
    id: "1",
    title: "GP Consultation",
    type: "Consultation",
    provider: "Dr. M. Khumalo",
    facility: "Soweto Community Health Centre",
    date: "2 September 2026",
    summary:
      "Routine chronic care review. Blood pressure stable. Continue current medication plan.",
    category: "consultation",
    status: "available",
  },
  {
    id: "2",
    title: "HbA1c Blood Test",
    type: "Laboratory",
    provider: "PhilaLink Laboratory",
    facility: "PhilaLink Diagnostic Centre",
    date: "22 August 2026",
    summary:
      "HbA1c result: 7.1%. Result reviewed as part of diabetes management.",
    category: "lab",
    status: "available",
  },
  {
    id: "3",
    title: "Medication Review",
    type: "Medication",
    provider: "Dr. M. Khumalo",
    facility: "Soweto Community Health Centre",
    date: "5 August 2026",
    summary:
      "Metformin, Lisinopril and Atorvastatin continued. No medication changes recorded.",
    category: "medication",
    status: "available",
  },
  {
    id: "4",
    title: "Blood Pressure Check",
    type: "Observation",
    provider: "Sister T. Dlamini",
    facility: "Soweto Community Health Centre",
    date: "12 July 2026",
    summary:
      "Blood pressure reading: 126/80 mmHg. No concerning symptoms reported.",
    category: "observation",
    status: "available",
  },
];

const filters = [
  {
    value: "all",
    label: "All records",
  },
  {
    value: "consultation",
    label: "Consultations",
  },
  {
    value: "lab",
    label: "Laboratory",
  },
  {
    value: "medication",
    label: "Medication",
  },
  {
    value: "observation",
    label: "Observations",
  },
];

function iconForCategory(category) {
  switch (category) {
    case "consultation":
      return Stethoscope;

    case "lab":
      return FileText;

    case "medication":
      return Pill;

    case "observation":
      return Activity;

    default:
      return FileText;
  }
}

export default function RecordsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filteredRecords = records.filter((record) => {
    const matchesFilter =
      filter === "all" ||
      record.category === filter;

    const query = search.trim().toLowerCase();

    const matchesSearch =
      !query ||
      record.title
        .toLowerCase()
        .includes(query) ||
      record.provider
        .toLowerCase()
        .includes(query) ||
      record.facility
        .toLowerCase()
        .includes(query);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-lg md:p-xl lg:p-2xl">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-lg lg:mb-xl gap-md">
        <div>
          <h1 className="text-title text-text-primary">
            Health Records
          </h1>

          <p className="text-label-sm text-text-secondary mt-xs">
            View your consultations, tests,
            medication records and observations.
          </p>
        </div>

        <Button
          variant="neutral"
          iconStart={<Download size={16} />}
        >
          Download summary
        </Button>
      </div>

      <div className="bg-surface-bg rounded-corner-lg p-lg lg:p-xl mb-lg">
        <div className="flex flex-col md:flex-row gap-md">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search health records"
              className="w-full rounded-corner-md border border-border-secondary bg-white py-2.5 pl-10 pr-4 text-label-sm text-text-primary outline-none transition focus:border-brand-primary"
            />
          </div>

          <div className="flex items-center gap-xs rounded-corner-md border border-border-secondary bg-white px-3">
            <Filter
              size={15}
              className="text-text-tertiary"
            />

            <select
              value={filter}
              onChange={(event) =>
                setFilter(event.target.value)
              }
              className="bg-transparent py-2.5 text-label-sm text-text-primary outline-none"
            >
              {filters.map((item) => (
                <option
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-md">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => {
            const Icon = iconForCategory(
              record.category
            );

            const isSelected =
              selected === record.id;

            return (
              <button
                key={record.id}
                type="button"
                onClick={() =>
                  setSelected(
                    isSelected
                      ? null
                      : record.id
                  )
                }
                className={`w-full rounded-corner-lg border bg-surface-bg p-lg lg:p-xl text-left transition ${
                  isSelected
                    ? "border-brand-primary"
                    : "border-border-secondary hover:border-border-primary"
                }`}
              >
                <div className="flex items-start justify-between gap-md">
                  <div className="flex min-w-0 flex-1 items-start gap-md">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-corner-full bg-brand-tertiary">
                      <Icon
                        size={17}
                        className="text-brand-primary"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-sm">
                        <h3 className="text-label-sm font-semibold text-text-primary">
                          {record.title}
                        </h3>

                        <Badge
                          label={record.type}
                          variant="default"
                        />
                      </div>

                      <p className="mt-xs text-video-title text-text-secondary">
                        {record.provider}
                      </p>

                      <div className="mt-sm flex flex-wrap items-center gap-md">
                        <div className="flex items-center gap-xs">
                          <Calendar
                            size={12}
                            className="text-text-tertiary"
                          />

                          <span className="text-video-title text-text-secondary">
                            {record.date}
                          </span>
                        </div>

                        <span className="text-video-title text-text-secondary">
                          {record.facility}
                        </span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight
                    size={17}
                    className={`shrink-0 text-text-tertiary transition-transform ${
                      isSelected
                        ? "rotate-90"
                        : ""
                    }`}
                  />
                </div>

                {isSelected && (
                  <div className="mt-lg border-t border-border-secondary pt-lg">
                    <p className="text-video-title text-text-tertiary">
                      Clinical summary
                    </p>

                    <p className="mt-sm text-label-sm leading-6 text-text-primary">
                      {record.summary}
                    </p>

                    <div className="mt-lg flex flex-wrap gap-md">
                      <Button
                        variant="neutral"
                        iconStart={
                          <FileText size={15} />
                        }
                      >
                        View record
                      </Button>

                      <Button
                        variant="subtle"
                        iconStart={
                          <Download size={15} />
                        }
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                )}
              </button>
            );
          })
        ) : (
          <div className="rounded-corner-lg bg-surface-bg p-2xl text-center">
            <FileText
              size={28}
              className="mx-auto text-text-tertiary"
            />

            <h3 className="mt-md text-label font-semibold text-text-primary">
              No records found
            </h3>

            <p className="mt-xs text-label-sm text-text-secondary">
              Try changing your search or
              filter.
            </p>
          </div>
        )}
      </div>

      <div className="h-20 lg:hidden" />
    </div>
  );
}
