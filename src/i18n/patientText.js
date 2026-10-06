import i18n from "./index.js";

import {
  getLanguageLocale,
} from "./languages.js";

function normalize(
  value
) {
  return String(
    value ?? ""
  )
    .trim()
    .toLowerCase();
}

function keyLookup(
  value,
  map,
  prefix
) {
  const key =
    map[
      normalize(
        value
      )
    ];

  if (!key) {
    return value;
  }

  return i18n.t(
    `${prefix}.${key}`
  );
}

// =========================================================
// APPOINTMENT TYPES
// =========================================================

const APPOINTMENT_TYPE_KEYS = {
  "routine checkup":
    "routineCheckup",

  "general consultation":
    "generalConsultation",

  "medication review":
    "medicationReview",

  "chronic care follow-up":
    "chronicFollowup",

  "chronic care followup":
    "chronicFollowup",

  "follow-up visit":
    "followupVisit",

  "followup visit":
    "followupVisit",

  "symptoms / feeling unwell":
    "symptoms",

  other:
    "other",

  appointment:
    "appointment",
};

export function translateAppointmentType(
  value
) {
  if (!value) {
    return i18n.t(
      "dynamic.appointmentTypes.appointment"
    );
  }

  return keyLookup(
    value,
    APPOINTMENT_TYPE_KEYS,
    "dynamic.appointmentTypes"
  );
}

// =========================================================
// PROVIDER ROLES
// =========================================================

const PROVIDER_ROLE_KEYS = {
  nurse:
    "nurse",

  "registered nurse":
    "nurse",

  doctor:
    "doctor",

  physician:
    "doctor",

  pharmacist:
    "pharmacist",

  "primary health care worker":
    "healthcareWorker",

  "primary healthcare worker":
    "healthcareWorker",

  "health care worker":
    "healthcareWorker",

  "healthcare worker":
    "healthcareWorker",
};

export function translateProviderRole(
  value
) {
  if (!value) {
    return value;
  }

  return keyLookup(
    value,
    PROVIDER_ROLE_KEYS,
    "dynamic.providerRoles"
  );
}

// =========================================================
// MEDICATION FORMS
// =========================================================

const MEDICATION_FORM_KEYS = {
  tablet:
    "tablet",

  tablets:
    "tablet",

  capsule:
    "capsule",

  capsules:
    "capsule",

  syrup:
    "syrup",

  liquid:
    "liquid",

  injection:
    "injection",

  injectable:
    "injection",

  cream:
    "cream",

  ointment:
    "ointment",

  inhaler:
    "inhaler",

  drops:
    "drops",

  drop:
    "drops",

  patch:
    "patch",

  patches:
    "patch",
};

export function translateMedicationForm(
  value
) {
  if (!value) {
    return value;
  }

  return keyLookup(
    value,
    MEDICATION_FORM_KEYS,
    "dynamic.medicationForms"
  );
}

// =========================================================
// STATUS
// =========================================================

const STATUS_KEYS = {
  scheduled:
    "scheduled",

  confirmed:
    "confirmed",

  pending:
    "pending",

  completed:
    "completed",

  cancelled:
    "cancelled",

  canceled:
    "cancelled",

  rescheduled:
    "rescheduled",

  missed:
    "missed",

  available:
    "available",

  final:
    "final",

  draft:
    "draft",
};

export function translateKnownStatus(
  value
) {
  if (!value) {
    return value;
  }

  return keyLookup(
    value,
    STATUS_KEYS,
    "dynamic.statuses"
  );
}

// =========================================================
// HEALTH METRIC TYPES
// =========================================================

const HEALTH_METRIC_KEYS = {
  "blood pressure":
    "bloodPressure",

  bloodpressure:
    "bloodPressure",

  bp:
    "bloodPressure",

  weight:
    "weight",

  glucose:
    "glucose",

  "blood glucose":
    "glucose",

  bloodglucose:
    "glucose",

  temperature:
    "temperature",

  "heart rate":
    "heartRate",

  heartrate:
    "heartRate",

  pulse:
    "heartRate",

  bmi:
    "bmi",

  "body mass index":
    "bmi",

  "oxygen saturation":
    "oxygenSaturation",

  oxygensaturation:
    "oxygenSaturation",

  spo2:
    "oxygenSaturation",
};

export function translateHealthMetricType(
  value
) {
  if (!value) {
    return value;
  }

  return keyLookup(
    value,
    HEALTH_METRIC_KEYS,
    "dynamic.healthMetrics"
  );
}

// =========================================================
// HEALTH METRIC STATUS
// =========================================================

const HEALTH_METRIC_STATUS_KEYS = {
  normal:
    "normal",

  healthy:
    "healthy",

  high:
    "high",

  low:
    "low",

  elevated:
    "elevated",

  critical:
    "critical",

  stable:
    "stable",
};

export function translateHealthMetricStatus(
  value
) {
  if (!value) {
    return value;
  }

  return keyLookup(
    value,
    HEALTH_METRIC_STATUS_KEYS,
    "dynamic.healthMetricStatuses"
  );
}

// =========================================================
// HEALTH RECORD TYPES / CATEGORIES
// =========================================================

const RECORD_KEYS = {
  consultation:
    "consultation",

  consultations:
    "consultation",

  "clinical consultation":
    "clinicalConsultation",

  clinical:
    "clinicalConsultation",

  laboratory:
    "laboratory",

  lab:
    "laboratory",

  "lab result":
    "labResult",

  "laboratory result":
    "labResult",

  test:
    "test",

  medication:
    "medication",

  medications:
    "medication",

  observation:
    "observation",

  observations:
    "observation",

  vitals:
    "vitals",

  "vital signs":
    "vitals",

  record:
    "healthRecord",

  "health record":
    "healthRecord",
};

export function translateRecordValue(
  value
) {
  if (!value) {
    return value;
  }

  return keyLookup(
    value,
    RECORD_KEYS,
    "dynamic.recordTypes"
  );
}

// =========================================================
// FACILITY TYPES
// =========================================================

const FACILITY_KEYS = {
  clinic:
    "clinic",

  hospital:
    "hospital",

  "health centre":
    "healthCentre",

  "health center":
    "healthCentre",

  "community health centre":
    "communityHealthCentre",

  "community health center":
    "communityHealthCentre",
};

export function translateFacilityType(
  value
) {
  if (!value) {
    return value;
  }

  return keyLookup(
    value,
    FACILITY_KEYS,
    "dynamic.facilityTypes"
  );
}

// =========================================================
// ROUTE DIRECTIONS
// =========================================================

const DIRECTION_KEYS = {
  left:
    "left",

  right:
    "right",

  straight:
    "straight",

  "slight left":
    "slightLeft",

  "slight right":
    "slightRight",

  "sharp left":
    "sharpLeft",

  "sharp right":
    "sharpRight",

  uturn:
    "uturn",

  "u-turn":
    "uturn",
};

export function translateRouteModifier(
  value
) {
  if (!value) {
    return "";
  }

  return keyLookup(
    String(value)
      .replace(
        /_/g,
        " "
      ),
    DIRECTION_KEYS,
    "dynamic.directions"
  );
}

// =========================================================
// ASSESSMENT CHOICES
// =========================================================

const SYMPTOM_KEYS = {
  headache:
    "headache",

  fever:
    "fever",

  cough:
    "cough",

  "sore throat":
    "soreThroat",

  nausea:
    "nausea",

  vomiting:
    "vomiting",

  diarrhea:
    "diarrhea",

  diarrhoea:
    "diarrhea",

  "stomach pain":
    "stomachPain",

  "back pain":
    "backPain",

  dizziness:
    "dizziness",

  fatigue:
    "fatigue",

  "runny nose":
    "runnyNose",

  "shortness of breath":
    "shortnessOfBreath",

  "chest pain":
    "chestPain",
};

const DURATION_KEYS = {
  "less than 1 day":
    "lessThanDay",

  "1–2 days":
    "oneTwoDays",

  "1-2 days":
    "oneTwoDays",

  "3–7 days":
    "threeSevenDays",

  "3-7 days":
    "threeSevenDays",

  "1–2 weeks":
    "oneTwoWeeks",

  "1-2 weeks":
    "oneTwoWeeks",

  "more than 2 weeks":
    "moreThanTwoWeeks",

  "more than 1 month":
    "moreThanMonth",
};

const ALLERGY_KEYS = {
  penicillin:
    "penicillin",

  ibuprofen:
    "ibuprofen",

  aspirin:
    "aspirin",

  sulfonamides:
    "sulfonamides",

  peanuts:
    "peanuts",

  shellfish:
    "shellfish",

  latex:
    "latex",
};

const CONDITION_KEYS = {
  diabetes:
    "diabetes",

  hypertension:
    "hypertension",

  asthma:
    "asthma",

  "high cholesterol":
    "highCholesterol",

  "heart disease":
    "heartDisease",

  "kidney disease":
    "kidneyDisease",

  epilepsy:
    "epilepsy",
};

const UNIT_KEYS = {
  hours:
    "hours",

  hour:
    "hours",

  days:
    "days",

  day:
    "days",

  weeks:
    "weeks",

  week:
    "weeks",

  months:
    "months",

  month:
    "months",
};

export function translateAssessmentValue(
  category,
  value
) {
  if (!value) {
    return value;
  }

  switch (category) {
    case "symptom":
      return keyLookup(
        value,
        SYMPTOM_KEYS,
        "dynamic.symptoms"
      );

    case "duration":
      return keyLookup(
        value,
        DURATION_KEYS,
        "dynamic.durations"
      );

    case "allergy":
      return keyLookup(
        value,
        ALLERGY_KEYS,
        "dynamic.allergies"
      );

    case "condition":
      return keyLookup(
        value,
        CONDITION_KEYS,
        "dynamic.conditions"
      );

    case "durationUnit":
      return keyLookup(
        value,
        UNIT_KEYS,
        "dynamic.durationUnits"
      );

    default:
      return value;
  }
}

// =========================================================
// DATE PARSING FOR ENGLISH BACKEND NOTIFICATION STRINGS
// =========================================================

const MONTHS = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

function formatBackendDate(
  value
) {
  const text =
    String(
      value ?? ""
    ).trim();

  const match =
    text.match(
      /^(?:[A-Za-z]{3},\s*)?(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})(?:\s+at\s+(\d{2}):(\d{2}))?$/
    );

  if (!match) {
    return text;
  }

  const [
    ,
    dayText,
    monthText,
    yearText,
    hourText,
    minuteText,
  ] = match;

  const month =
    MONTHS[
      monthText
        .toLowerCase()
    ];

  if (
    month ===
    undefined
  ) {
    return text;
  }

  const date =
    new Date(
      Number(
        yearText
      ),
      month,
      Number(
        dayText
      ),
      Number(
        hourText ?? 0
      ),
      Number(
        minuteText ?? 0
      )
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return text;
  }

  const locale =
    getLanguageLocale(
      i18n.resolvedLanguage ||
        i18n.language
    );

  try {
    if (
      hourText !==
      undefined
    ) {
      return date
        .toLocaleString(
          locale,
          {
            weekday:
              "short",

            day:
              "numeric",

            month:
              "short",

            year:
              "numeric",

            hour:
              "2-digit",

            minute:
              "2-digit",
          }
        );
    }

    return date
      .toLocaleDateString(
        locale,
        {
          day:
            "numeric",

          month:
            "short",

          year:
            "numeric",
        }
      );
  } catch {
    return text;
  }
}

// =========================================================
// SYSTEM NOTIFICATIONS
// =========================================================

export function translateKnownNotificationMessage(
  message
) {
  if (!message) {
    return "";
  }

  const text =
    String(
      message
    );

  const exactWeather = {
    "Weather health tip: Hot conditions are expected. Stay hydrated, avoid prolonged heat exposure, and seek medical help if you develop severe heat-related symptoms.":
      "systemNotifications.hot",

    "Weather health tip: Cold conditions are expected. Keep warm, especially if you are vulnerable to cold weather, and keep medicines stored according to their instructions.":
      "systemNotifications.cold",

    "Weather health tip: Rain or storms are expected. Plan extra travel time for clinic appointments or medicine collection and avoid unsafe flooded areas.":
      "systemNotifications.rain",

    "Weather health tip: Strong winds are expected. Take extra care when travelling and avoid unnecessary exposure if conditions become unsafe.":
      "systemNotifications.wind",
  };

  const exactKey =
    exactWeather[
      text
    ];

  if (
    exactKey
  ) {
    return i18n.t(
      exactKey
    );
  }

  let match =
    text.match(
      /^Medication reminder:\s*(.+?)\s+is scheduled for\s+(\d{2}:\d{2})\s+on\s+(.+?)\.$/i
    );

  if (
    match
  ) {
    return i18n.t(
      "systemNotifications.medicationReminder",
      {
        medication:
          match[1],

        time:
          match[2],

        date:
          formatBackendDate(
            match[3]
          ),
      }
    );
  }

  match =
    text.match(
      /^Appointment update:\s*Your\s+(.+?)\s+at\s+(.+?)\s+is\s+(.+?)\s+for\s+(.+?)\.$/i
    );

  if (
    match
  ) {
    return i18n.t(
      "systemNotifications.appointmentUpdate",
      {
        type:
          translateAppointmentType(
            match[1]
          ),

        clinic:
          match[2],

        status:
          translateKnownStatus(
            match[3]
          ),

        date:
          formatBackendDate(
            match[4]
          ),
      }
    );
  }

  match =
    text.match(
      /^Appointment reminder - soon:\s*Your\s+(.+?)\s+at\s+(.+?)\s+starts at\s+(\d{2}:\d{2})\s+today\.$/i
    );

  if (
    match
  ) {
    return i18n.t(
      "systemNotifications.appointmentSoon",
      {
        type:
          translateAppointmentType(
            match[1]
          ),

        clinic:
          match[2],

        time:
          match[3],
      }
    );
  }

  match =
    text.match(
      /^Appointment reminder:\s*Your\s+(.+?)\s+at\s+(.+?)\s+is scheduled for\s+(.+?)\.$/i
    );

  if (
    match
  ) {
    return i18n.t(
      "systemNotifications.appointmentReminder",
      {
        type:
          translateAppointmentType(
            match[1]
          ),

        clinic:
          match[2],

        date:
          formatBackendDate(
            match[3]
          ),
      }
    );
  }

  /*
   * Unknown manually-authored notifications are preserved.
   * We should not alter free clinical communication.
   */
  return text;
}

// =========================================================
// KNOWN BACKEND / CHATBOT TEXT
// =========================================================

const SERVER_TEXT_PREFIXES = [
  {
    prefix:
      "Your symptoms may require immediate medical attention.",

    key:
      "serverText.emergencyAssessment",
  },

  {
    prefix:
      "These symptoms should be assessed by a healthcare professional soon.",

    key:
      "serverText.urgentAssessment",
  },

  {
    prefix:
      "Breathing symptoms should be assessed promptly by a healthcare professional.",

    key:
      "serverText.breathingUrgent",
  },

  {
    prefix:
      "No emergency or urgent warning phrase was detected from the information provided.",

    key:
      "serverText.nonEmergencyAssessment",
  },

  {
    prefix:
      "Your message contains symptoms or information that may indicate a medical emergency.",

    key:
      "serverText.chatbotEmergency",
  },

  {
    prefix:
      "Your message contains symptoms that should be assessed promptly by a healthcare professional.",

    key:
      "serverText.chatbotUrgent",
  },

  {
    prefix:
      "I’m unable to access the health assistant right now.",

    key:
      "serverText.chatbotUnavailable",
  },

  {
    prefix:
      "I'm unable to access the health assistant right now.",

    key:
      "serverText.chatbotUnavailable",
  },

  {
    prefix:
      "I could not generate a response right now.",

    key:
      "serverText.chatbotNoResponse",
  },
];

export function translateKnownServerText(
  value
) {
  if (!value) {
    return value;
  }

  const text =
    String(
      value
    ).trim();

  const entry =
    SERVER_TEXT_PREFIXES.find(
      item =>
        text.startsWith(
          item.prefix
        )
    );

  if (!entry) {
    return text;
  }

  return i18n.t(
    entry.key
  );
}

// =========================================================
// OBJECT LOCALISATION
// =========================================================

function requestedProviderFromNotes(
  notes
) {
  if (!notes) {
    return "";
  }

  const match =
    String(
      notes
    ).match(
      /^Requested provider:\s*(.+)$/im
    );

  return (
    match?.[1]
      ?.trim() ||
    ""
  );
}

export function localizeAppointment(
  appointment
) {
  if (
    !appointment ||
    typeof appointment !==
      "object"
  ) {
    return appointment;
  }

  const rawType =
    appointment.rawType ??
    appointment.type;

  const providerValue =
    appointment.providerName ||
    appointment.nurseName ||
    requestedProviderFromNotes(
      appointment.notes
    );

  const translatedProvider =
    providerValue
      ? translateProviderRole(
          providerValue
        )
      : providerValue;

  return {
    ...appointment,

    rawType,

    type:
      translateAppointmentType(
        rawType
      ),

    /*
     * Only role-like provider strings are translated.
     * A real person's name passes through unchanged because
     * translateProviderRole returns unknown values verbatim.
     */
    providerName:
      translatedProvider ||
      appointment.providerName,

    nurseName:
      appointment.nurseName
        ? translateProviderRole(
            appointment.nurseName
          )
        : appointment.nurseName,
  };
}

export function localizeAppointments(
  value
) {
  return Array.isArray(
    value
  )
    ? value.map(
        localizeAppointment
      )
    : [];
}

export function localizeMedication(
  medication
) {
  if (
    !medication ||
    typeof medication !==
      "object"
  ) {
    return medication;
  }

  const translatedCondition =
    medication.conditionName
      ? translateAssessmentValue(
          "condition",
          medication.conditionName
        )
      : medication.conditionName;

  return {
    ...medication,

    /*
     * Names and instructions remain untouched.
     * Only known enum-like values are localised.
     */
    form:
      translateMedicationForm(
        medication.form
      ),

    conditionName:
      translatedCondition,

    prescribedBy:
      translateProviderRole(
        medication.prescribedBy
      ),
  };
}

export function localizeMedications(
  value
) {
  return Array.isArray(
    value
  )
    ? value.map(
        localizeMedication
      )
    : [];
}

function localizeHealthMetric(
  metric
) {
  if (
    !metric ||
    typeof metric !==
      "object"
  ) {
    return metric;
  }

  const translatedStatus =
    translateHealthMetricStatus(
      metric.status
    );

  const statusChanged =
    Boolean(
      metric.status
    ) &&
    translatedStatus !==
      metric.status;

  return {
    ...metric,

    /*
     * Keep the original raw status because DashboardPage
     * uses it to determine the green/normal icon.
     */
    metricType:
      translateHealthMetricType(
        metric.metricType
      ),

    note:
      metric.note ||
      (
        statusChanged
          ? translatedStatus
          : metric.note
      ),
  };
}

export function localizeDashboard(
  dashboard
) {
  if (
    !dashboard ||
    typeof dashboard !==
      "object"
  ) {
    return dashboard;
  }

  return {
    ...dashboard,

    upcomingAppointments:
      Array.isArray(
        dashboard
          .upcomingAppointments
      )
        ? dashboard
            .upcomingAppointments
            .map(
              localizeAppointment
            )
        : dashboard
            .upcomingAppointments,

    healthMetrics:
      Array.isArray(
        dashboard
          .healthMetrics
      )
        ? dashboard
            .healthMetrics
            .map(
              localizeHealthMetric
            )
        : dashboard
            .healthMetrics,
  };
}