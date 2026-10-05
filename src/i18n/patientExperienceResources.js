// =========================================================
// PHILALINK PATIENT EXPERIENCE TRANSLATIONS
// =========================================================
//
// This file fills the remaining patient-facing localisation
// gaps without forcing the existing page resource files to
// be rewritten.
//
// The current mixed-language issue reported in the patient
// portal is specifically caused by incomplete isiZulu
// overrides. The isiZulu page fixes below are therefore
// complete for every key currently used by:
// - Medications
// - Appointments
// - Records
// - Nearest Clinics
//
// Shared patient-experience namespaces are also defined here
// for:
// - Weather
// - Identity settings
// - PhilaChatBot
// - Cookie consent
// - API errors
// - Dynamic database/enumeration labels
// - System notifications
// - Known backend health-assessment messages
// =========================================================

const enExperience = {
  weather: {
    weather: "Weather",
    loading: "Loading weather",
    locating: "Locating...",
    retry: "Retry weather",
    unavailable: "Weather unavailable",
    currentLocation: "Current location",
    assignedClinicArea: "Assigned clinic area",
    weatherIn: "Weather in {{location}}",
    clinicAreaWeather:
      "Clinic-area weather: {{location}}",
    clinic: "Clinic",
    currentLocationWeather:
      "Current-location weather",
    clinicWeather: "Clinic weather",
    closeDetails:
      "Close weather details",
    night: "Night",
    day: "Day",
    location: "Location",
    degreesCelsius:
      "{{temperature}} degrees Celsius",
    deviceLocationFallback:
      "Your device location was unavailable, so PhilaLink is showing weather for your assigned clinic area.",
    locationUnavailable:
      "Location unavailable.",
    preciseLocationDenied:
      "Precise location access was denied.",
    locationUndetermined:
      "Your current location could not be determined.",
    locationTimeout:
      "The location request timed out.",
    locationServicesUnavailable:
      "Location services are unavailable.",
    invalidCoordinates:
      "The browser returned invalid location coordinates.",
    condition: {
      clear: "Clear",
      partlyCloudy: "Partly cloudy",
      overcast: "Overcast",
      rain: "Rain",
      thunder: "Thunderstorms",
      snow: "Snow",
      fog: "Fog",
      cloudy: "Cloudy",
    },
  },

  identity: {
    title: "Identity details",
    description:
      "Correct your date of birth or, when necessary, replace the complete South African ID number.",
    separateSave:
      "Identity changes are saved separately from the rest of your profile. Use the relevant update button below.",
    currentId: "Current ID number",
    notAvailable: "Not available",
    correctDob:
      "Correct date of birth",
    dobDescription:
      "This changes only the YYMMDD prefix of your current ID number. The remaining seven digits stay exactly the same.",
    updateDob:
      "Update date of birth",
    updating: "Updating...",
    correctFullId:
      "Correct full ID number",
    fullIdDescription:
      "Use this only when digits outside the date prefix are also wrong. Your date of birth will be updated from the new ID's first six digits.",
    idPlaceholder:
      "13-digit SA ID number",
    updateFullId:
      "Update full ID number",
    loginIdentifier:
      "Your SA ID number is also your login identifier, so use the corrected number the next time you sign in.",
    selectDob:
      "Select a date of birth.",
    dobUpdated:
      "Date of birth updated. Only the first six digits of the ID number were changed.",
    dobUpdateError:
      "Could not update the date of birth.",
    invalidId:
      "Enter a valid 13-digit South African ID number.",
    idUpdated:
      "Full ID number updated. Date of birth was synchronized from its first six digits.",
    idUpdateError:
      "Could not update the ID number.",
  },

  api: {
    network:
      "Can't reach the PhilaLink server. Check your connection and try again.",
    sessionExpired:
      "Your session has expired. Please log in again.",
    badRequest:
      "The request could not be completed. Please check the information and try again.",
    notFound:
      "The requested information could not be found.",
    conflict:
      "This action conflicts with the latest information. Refresh and try again.",
    serverError:
      "The PhilaLink server could not complete the request. Please try again.",
    requestFailed:
      "The request could not be completed.",
    medicationIdRequired:
      "A medication ID is required.",
    appointmentIdRequired:
      "An appointment ID is required.",
    notificationIdRequired:
      "A notification ID is required.",
  },

  cookies: {
    consentAria: "Cookie consent",
    settings: "Cookie settings",
    closeSettings:
      "Close cookie settings",
    intro:
      "You can choose which optional cookies PhilaLink may use. Essential cookies are required for the website to work correctly and cannot be disabled.",

    whatTitle:
      "What are cookies?",
    whatBody1:
      "Cookies are small text files stored by your browser or device. They allow websites to remember certain information between visits.",
    whatBody2:
      "PhilaLink uses cookies only for website functionality and optional preferences. Healthcare information such as medication, appointments and clinical records is not stored in the cookie consent file.",

    preferencesTitle:
      "Which cookie preferences do we use?",
    essentialTitle:
      "Essential cookies",
    essentialBody:
      "These support security, remember your cookie choice and allow core PhilaLink functionality to operate.",
    alwaysOn: "Always on",
    preferenceTitle:
      "Preference cookies",
    preferenceBody:
      "These may remember optional browser preferences to make PhilaLink easier to use on this device.",

    whyTitle:
      "Why do we use cookies?",
    whyBody1:
      "PhilaLink uses essential cookies to support secure website functionality and remember your consent decision.",
    whyBody2:
      "Optional preference cookies can help remember non-sensitive browser choices. PhilaLink does not currently use advertising cookies through this consent system.",

    changeTitle:
      "How do you change your cookie preferences?",
    changeBody1:
      "You can return to Cookie settings and update your preference at any time. Saving a new choice replaces the previous cookie preference on this browser.",
    changeBody2:
      "You can also remove PhilaLink cookies using your browser's privacy or site-data settings.",

    thirdPartyTitle:
      "When will third parties use cookies?",
    thirdPartyBody1:
      "If you choose to sign in with Google, Google may use cookies on its own services during the authentication process.",
    thirdPartyBody2:
      "Those cookies are controlled by Google and are separate from the PhilaLink consent cookie.",

    essentialOnly:
      "Essential only",
    saveSettings:
      "Save settings",
    acceptAll:
      "Accept all cookies",

    banner:
      "Cookies help PhilaLink work properly and remember your preferences. You can change your cookie settings at any time.",
  },

  chatbot: {
    floatingTooltip:
      "Your AI health assistant",
    openAssistant:
      "Open PhilaChatBot AI health assistant",

    online: "Online",
    assistantSubtitle:
      "Your PhilaLink health assistant",
    minimize: "Minimize",
    moreOptions:
      "More options",
    chatOptions:
      "Chat options",
    chatOptionsDescription:
      "Manage your current PhilaChatBot conversation.",
    clearHistory:
      "Clear chat history",
    clearing:
      "Clearing...",
    clearDescription:
      "Start a new conversation without deleting your PhilaLink health records.",
    waitForResponse:
      "Wait for the current response to finish before clearing the conversation.",
    close: "Close",
    clearConfirm:
      "Clear this chat history?\n\nThis will start a new PhilaChatBot conversation. Your symptom assessments, medications, allergies, medical conditions, and other PhilaLink profile information will not be deleted.",
    clearError:
      "Chat history could not be cleared. Please try again.",

    initialMessage:
      "How can I help you? You can ask about your PhilaLink information or general health information.",
    noResponse:
      "No response was returned.",
    processError:
      "I couldn't process that message right now.",

    welcomeTitle:
      "Hi, I'm PhilaChatBot",
    welcomeBody:
      "Your AI health assistant from PhilaLink. I can help you understand your symptoms, check medication information, and provide general health guidance.",
    disclaimerTitle:
      "Important disclaimer",
    disclaimerBody:
      "PhilaChatBot provides general health information and does not replace a doctor, nurse, pharmacist, or other healthcare professional. Always seek professional medical advice for health concerns that require clinical assessment.",
    understandContinue:
      "I understand — continue",

    howCanHelp:
      "How can I help?",
    quickStartBody:
      "Chat freely with Phila or start a guided symptom assessment.",

    quickChatTitle:
      "Chat with Phila",
    quickChatDescription:
      "Ask a health question or talk about your PhilaLink information.",

    quickSymptomsTitle:
      "Check my symptoms",
    quickSymptomsDescription:
      "Start a guided health assessment.",

    quickMedicationsTitle:
      "My medications",
    quickMedicationsDescription:
      "Ask about your medications, their general use, and your remaining supply.",
    quickMedicationsPrompt:
      "Tell me about the medications recorded in my PhilaLink profile and how much medication supply I have left.",

    quickAllergiesTitle:
      "My allergies",
    quickAllergiesDescription:
      "Ask about allergy information recorded in your profile.",
    quickAllergiesPrompt:
      "What allergies are recorded in my PhilaLink profile, and what general information should I keep in mind about them?",

    quickHelpTitle:
      "When should I seek help?",
    quickHelpDescription:
      "Ask about warning signs and when urgent or emergency care may be needed.",
    quickHelpPrompt:
      "What warning signs should make someone seek urgent or emergency medical help?",

    ageTitle:
      "How old are you?",
    ageDescription:
      "Your age helps PhilaChatBot provide more appropriate general health guidance.",
    age: "Age",
    agePlaceholder:
      "Enter your age",
    ageInvalid:
      "Please enter an age between 1 and 120.",
    agePrivacy:
      "PhilaChatBot uses this information only as part of your symptom assessment.",

    symptomsTitle:
      "What symptoms are you experiencing?",
    symptomsDescription:
      "Select all symptoms that apply. You can also add a symptom that is not listed.",
    addSymptom:
      "Add another symptom",
    symptomPlaceholder:
      "Type a symptom",
    addSymptomAria:
      "Add symptom",
    selectedSymptoms:
      "Selected symptoms",
    removeSymptom:
      "Remove {{item}}",
    seriousSymptoms:
      "Some symptoms you selected can be serious. PhilaChatBot will perform an emergency safety check before showing general guidance.",

    durationTitle:
      "How long have you had these symptoms?",
    durationDescription:
      "Select the option that best describes how long your symptoms have been present.",
    specificDuration:
      "Enter a specific duration",
    duration: "Duration",
    enterNumber:
      "Enter number",
    invalidDuration:
      "Please enter a valid duration.",

    allergiesTitle:
      "Do you have any known allergies?",
    allergiesDescription:
      "Your allergy information helps PhilaChatBot avoid unsafe medication guidance.",
    addAllergy:
      "Add another allergy",
    allergyPlaceholder:
      "Type allergy",
    addAllergyAria:
      "Add allergy",
    selectedAllergies:
      "Allergies selected",
    removeAllergy:
      "Remove {{item}}",
    noAllergiesNote:
      "If you have no known allergies, you can continue without selecting anything.",

    medicationsTitle:
      "Are you taking any medications?",
    medicationsDescription:
      "Select medications from your PhilaLink profile or add another one.",
    yourMedications:
      "Your PhilaLink medications",
    loadingMedications:
      "Loading your medications...",
    noProfileMedications:
      "No active medications are currently recorded in your PhilaLink profile.",
    medicationLoadError:
      "Your PhilaLink medications could not be loaded. You can still add a medication manually.",
    selected: "Selected",
    addMedication:
      "Add another medication",
    medicationPlaceholder:
      "Medication name",
    addMedicationAria:
      "Add medication",
    selectedMedications:
      "Selected medications",
    removeMedication:
      "Remove {{item}}",
    noMedicationNote:
      "If you are not currently taking medication, leave this section empty and continue.",

    conditionsTitle:
      "Do you have any existing medical conditions?",
    conditionsDescription:
      "This step is optional, but it can help make the assessment more relevant.",
    addCondition:
      "Add another condition",
    conditionPlaceholder:
      "Condition name",
    addConditionAria:
      "Add condition",
    selectedConditions:
      "Selected conditions",
    removeCondition:
      "Remove {{item}}",

    reviewBadge: "Review",
    reviewTitle:
      "Review your information",
    reviewDescription:
      "Make sure everything is correct before PhilaChatBot prepares your health guidance.",
    notSpecified:
      "Not specified",
    notProvided:
      "Not provided",
    noneSelected:
      "None selected",
    noKnownAllergies:
      "No known allergies selected",
    currentMedications:
      "Current medications",
    medicalConditions:
      "Medical conditions",
    edit:
      "Edit {{item}}",
    reviewSafety:
      "PhilaChatBot will first check for serious warning signs before preparing possible causes, medication guidance, and next steps.",
    analyzeSymptoms:
      "Analyze symptoms",

    loadingTitle:
      "PhilaLink is assessing your symptoms",
    loadingDescription:
      "Your assessment is being processed by the PhilaLink backend.",
    loadingDisclaimer:
      "This assessment provides triage guidance and is not a medical diagnosis.",

    stageSending:
      "Sending your symptoms securely",
    stageWarningSigns:
      "Checking for warning signs",
    stageRecording:
      "Recording your assessment",
    stageResult:
      "Preparing your triage result",

    emergency: "Emergency",
    urgent: "Urgent",
    nonEmergency:
      "Non-emergency",
    assessmentComplete:
      "Assessment complete",

    emergencyTitle:
      "Seek emergency medical attention now",
    emergencyDescription:
      "One or more of the symptoms you submitted matched a serious warning sign. PhilaChatBot cannot safely determine the cause through this chat.",
    emergencyRecommendation:
      "Emergency recommendation",
    defaultEmergencyRecommendation:
      "Your symptoms may require immediate medical attention. Please seek emergency medical help now or go to the nearest emergency facility. Do not rely on PhilaLink for emergency treatment.",
    warningSigns:
      "Serious warning signs may include:",
    warningChestPain:
      "Chest pain",
    warningBreathing:
      "Severe difficulty breathing",
    warningConsciousness:
      "Loss of consciousness",
    warningSeizure:
      "Seizure",
    warningBleeding:
      "Severe bleeding",
    warningStroke:
      "Signs of stroke",
    warningAllergy:
      "Severe allergic reaction",
    callEmergency:
      "Call emergency services",
    viewAssessment:
      "View assessment details",
    anotherAssessment:
      "Start another assessment",
    emergencyFooter:
      "Do not delay emergency care while using PhilaChatBot.",

    healthAssessment:
      "Health assessment",
    healthAssessmentDescription:
      "This result was generated by the PhilaLink symptom assessment service and recorded in your patient history.",
    triageResult:
      "Triage result",
    recommendation:
      "Recommendation",
    noRecommendation:
      "No recommendation was returned.",
    symptomsSubmitted:
      "Symptoms submitted",
    recorded:
      "Recorded: {{date}}",
    emergencyFollow:
      "Follow the emergency recommendation above immediately.",
    followUp:
      "Ask a follow-up question",

    menu: "Menu",
    chat: "Chat",
    askPlaceholder:
      "Ask Phila anything...",
    sendMessage:
      "Send message",
    followupDisclaimer:
      "PhilaChatBot provides general health information and does not replace a healthcare professional.",

    quickCause:
      "What could be causing this?",
    quickMonitor:
      "What should I monitor?",
    quickSupply:
      "How many days of medication do I have left?",

    errorNetworkTitle:
      "We couldn't connect to PhilaChatBot",
    errorNetworkDescription:
      "Check your internet connection and try again.",
    errorUnavailableTitle:
      "PhilaChatBot is temporarily unavailable",
    errorUnavailableDescription:
      "The health assistant could not process your request right now. Please try again shortly.",
    errorMissingTitle:
      "More information is needed",
    errorMissingDescription:
      "Please review your assessment and provide the missing information before continuing.",
    tryAgain: "Try again",
    emergencyInstead:
      "If you are experiencing a medical emergency, contact emergency services instead of waiting for the chatbot.",

    back: "Back",
    continue: "Continue",
    review: "Review",

    fields: {
      age: "Age",
      symptoms: "Symptoms",
      duration: "Duration",
      allergies: "Allergies",
      medications: "Current medications",
      conditions: "Medical conditions",
    },
  },

  dynamic: {
    appointmentTypes: {
      routineCheckup:
        "Routine Checkup",
      generalConsultation:
        "General Consultation",
      medicationReview:
        "Medication Review",
      chronicFollowup:
        "Chronic Care Follow-up",
      followupVisit:
        "Follow-up Visit",
      symptoms:
        "Symptoms / Feeling Unwell",
      other: "Other",
      appointment: "Appointment",
    },

    recordTypes: {
      consultation: "Consultation",
      clinicalConsultation:
        "Clinical consultation",
      laboratory: "Laboratory",
      labResult: "Laboratory result",
      test: "Test",
      medication: "Medication",
      observation: "Observation",
      vitals: "Vital signs",
      healthRecord:
        "Health record",
    },

    facilityTypes: {
      clinic: "Clinic",
      hospital: "Hospital",
      healthCentre:
        "Health centre",
      communityHealthCentre:
        "Community health centre",
    },

    directions: {
      left: "left",
      right: "right",
      straight: "straight",
      slightLeft:
        "slightly left",
      slightRight:
        "slightly right",
      sharpLeft:
        "sharply left",
      sharpRight:
        "sharply right",
      uturn: "U-turn",
    },

    durationUnits: {
      hours: "Hours",
      days: "Days",
      weeks: "Weeks",
      months: "Months",
    },

    durations: {
      lessThanDay:
        "Less than 1 day",
      oneTwoDays: "1–2 days",
      threeSevenDays:
        "3–7 days",
      oneTwoWeeks:
        "1–2 weeks",
      moreThanTwoWeeks:
        "More than 2 weeks",
      moreThanMonth:
        "More than 1 month",
    },

    symptoms: {
      headache: "Headache",
      fever: "Fever",
      cough: "Cough",
      soreThroat: "Sore throat",
      nausea: "Nausea",
      vomiting: "Vomiting",
      diarrhea: "Diarrhea",
      stomachPain:
        "Stomach pain",
      backPain: "Back pain",
      dizziness: "Dizziness",
      fatigue: "Fatigue",
      runnyNose: "Runny nose",
      shortnessOfBreath:
        "Shortness of breath",
      chestPain: "Chest pain",
    },

    allergies: {
      penicillin: "Penicillin",
      ibuprofen: "Ibuprofen",
      aspirin: "Aspirin",
      sulfonamides:
        "Sulfonamides",
      peanuts: "Peanuts",
      shellfish: "Shellfish",
      latex: "Latex",
    },

    conditions: {
      diabetes: "Diabetes",
      hypertension:
        "Hypertension",
      asthma: "Asthma",
      highCholesterol:
        "High cholesterol",
      heartDisease:
        "Heart disease",
      kidneyDisease:
        "Kidney disease",
      epilepsy: "Epilepsy",
    },

    statuses: {
      scheduled: "Scheduled",
      confirmed: "Confirmed",
      pending: "Pending",
      completed: "Completed",
      cancelled: "Cancelled",
      rescheduled:
        "Rescheduled",
      missed: "Missed",
      available: "Available",
      final: "Final",
      draft: "Draft",
    },
  },

  systemNotifications: {
    hot:
      "Weather health tip: Hot conditions are expected. Stay hydrated, avoid prolonged heat exposure, and seek medical help if you develop severe heat-related symptoms.",
    cold:
      "Weather health tip: Cold conditions are expected. Keep warm, especially if you are vulnerable to cold weather, and keep medicines stored according to their instructions.",
    rain:
      "Weather health tip: Rain or storms are expected. Plan extra travel time for clinic appointments or medicine collection and avoid unsafe flooded areas.",
    wind:
      "Weather health tip: Strong winds are expected. Take extra care when travelling and avoid unnecessary exposure if conditions become unsafe.",

    medicationReminder:
      "Medication reminder: {{medication}} is scheduled for {{time}} on {{date}}.",

    appointmentUpdate:
      "Appointment update: Your {{type}} at {{clinic}} is {{status}} for {{date}}.",

    appointmentSoon:
      "Appointment reminder - soon: Your {{type}} at {{clinic}} starts at {{time}} today.",

    appointmentReminder:
      "Appointment reminder: Your {{type}} at {{clinic}} is scheduled for {{date}}.",
  },

  serverText: {
    emergencyAssessment:
      "Your symptoms may require immediate medical attention. Please seek emergency medical help now or go to the nearest emergency facility. Do not rely on PhilaLink for emergency treatment.",

    urgentAssessment:
      "These symptoms should be assessed by a healthcare professional soon. Please contact your clinic or another qualified healthcare provider as soon as possible. If symptoms become severe, rapidly worsen, or you develop difficulty breathing, chest pain, fainting, confusion, severe bleeding, or another emergency warning sign, seek emergency medical help immediately.",

    breathingUrgent:
      "Breathing symptoms should be assessed promptly by a healthcare professional. Please contact your clinic, an urgent care service, or another qualified healthcare provider as soon as possible. If you are struggling to breathe, cannot speak normally because of breathlessness, develop chest pain, become confused, faint, or your lips or face turn blue, seek emergency medical help immediately.",

    nonEmergencyAssessment:
      "No emergency or urgent warning phrase was detected from the information provided. This is not a diagnosis. Monitor your symptoms, follow your usual care plan, and contact your clinic if symptoms persist, worsen, recur, or concern you. If new severe symptoms develop, seek urgent or emergency medical care.",

    chatbotEmergency:
      "Your message contains symptoms or information that may indicate a medical emergency. Please seek emergency medical help now or go to the nearest emergency facility. Do not rely on PhilaLink or the chatbot for emergency treatment.",

    chatbotUrgent:
      "Your message contains symptoms that should be assessed promptly by a healthcare professional. Please contact your clinic, an urgent care service, or another qualified healthcare provider as soon as possible. If you are struggling to breathe, develop chest pain, faint, become confused, have severe bleeding, or your symptoms rapidly worsen, seek emergency medical help immediately.",

    chatbotUnavailable:
      "I'm unable to access the health assistant right now. Please try again shortly. If you have urgent symptoms, seek medical assistance immediately.",

    chatbotNoResponse:
      "I could not generate a response right now.",
  },
};

const zuExperience = {
  weather: {
    weather: "Isimo sezulu",
    loading:
      "Kulayishwa isimo sezulu",
    locating:
      "Kutholwa indawo...",
    retry:
      "Zama isimo sezulu futhi",
    unavailable:
      "Isimo sezulu asitholakali",
    currentLocation:
      "Indawo yakho yamanje",
    assignedClinicArea:
      "Indawo yomtholampilo owabelwe",
    weatherIn:
      "Isimo sezulu e-{{location}}",
    clinicAreaWeather:
      "Isimo sezulu endaweni yomtholampilo: {{location}}",
    clinic: "Umtholampilo",
    currentLocationWeather:
      "Isimo sezulu endaweni yakho yamanje",
    clinicWeather:
      "Isimo sezulu somtholampilo",
    closeDetails:
      "Vala imininingwane yesimo sezulu",
    night: "Ebusuku",
    day: "Emini",
    location: "Indawo",
    degreesCelsius:
      "{{temperature}} degrees Celsius",
    deviceLocationFallback:
      "Indawo yedivayisi yakho ayitholakalanga, ngakho i-PhilaLink ikhombisa isimo sezulu sendawo yomtholampilo owabelwe.",
    locationUnavailable:
      "Indawo ayitholakali.",
    preciseLocationDenied:
      "Ukufinyelela endaweni enembile kunqatshiwe.",
    locationUndetermined:
      "Indawo yakho yamanje ayikwazanga ukutholwa.",
    locationTimeout:
      "Isicelo sendawo siphelelwe isikhathi.",
    locationServicesUnavailable:
      "Izinsizakalo zendawo azitholakali.",
    invalidCoordinates:
      "Isiphequluli sibuyise izixhumanisi zendawo ezingavumelekile.",
    condition: {
      clear: "Kucwebile",
      partlyCloudy:
        "Kunamafu kancane",
      overcast:
        "Kumbozwe ngamafu",
      rain: "Imvula",
      thunder:
        "Izivunguvungu",
      snow: "Iqhwa",
      fog: "Inkungu",
      cloudy: "Kunamafu",
    },
  },

  identity: {
    title:
      "Imininingwane yobunikazi",
    description:
      "Lungisa usuku lwakho lokuzalwa noma, uma kudingeka, ushintshe inombolo kamazisi yaseNingizimu Afrika ephelele.",
    separateSave:
      "Izinguquko zobunikazi zilondolozwa ngokwehlukana nezinye izinguquko zephrofayela. Sebenzisa inkinobho efanele ngezansi.",
    currentId:
      "Inombolo kamazisi yamanje",
    notAvailable:
      "Ayitholakali",
    correctDob:
      "Lungisa usuku lokuzalwa",
    dobDescription:
      "Lokhu kushintsha kuphela amadijithi okuqala ayisithupha e-YYMMDD enombolweni kamazisi yakho. Amanye amadijithi ayisikhombisa ahlala engashintshi.",
    updateDob:
      "Buyekeza usuku lokuzalwa",
    updating:
      "Kuyabuyekezwa...",
    correctFullId:
      "Lungisa inombolo kamazisi ephelele",
    fullIdDescription:
      "Sebenzisa lokhu kuphela uma namadijithi angaphandle kwengxenye yosuku lokuzalwa engalungile. Usuku lwakho lokuzalwa luzobuyekezwa kusukela kumadijithi okuqala ayisithupha kamazisi omusha.",
    idPlaceholder:
      "Inombolo kamazisi yase-SA enamadijithi ayi-13",
    updateFullId:
      "Buyekeza inombolo kamazisi ephelele",
    loginIdentifier:
      "Inombolo yakho kamazisi yase-SA nayo iyisihlonzi sakho sokungena, ngakho sebenzisa inombolo elungisiwe ngesikhathi esilandelayo ungena.",
    selectDob:
      "Khetha usuku lokuzalwa.",
    dobUpdated:
      "Usuku lokuzalwa lubuyekeziwe. Kushintshwe kuphela amadijithi okuqala ayisithupha enombolweni kamazisi.",
    dobUpdateError:
      "Asikwazanga ukubuyekeza usuku lokuzalwa.",
    invalidId:
      "Faka inombolo kamazisi yaseNingizimu Afrika evumelekile enamadijithi ayi-13.",
    idUpdated:
      "Inombolo kamazisi ephelele ibuyekeziwe. Usuku lokuzalwa luvumelanisiwe namadijithi ayo okuqala ayisithupha.",
    idUpdateError:
      "Asikwazanga ukubuyekeza inombolo kamazisi.",
  },

  api: {
    network:
      "Asikwazi ukuxhumana neseva ye-PhilaLink. Hlola uxhumano lwakho bese uzama futhi.",
    sessionExpired:
      "Isikhathi sakho sokungena sesiphelelwe. Sicela ungene futhi.",
    badRequest:
      "Isicelo asikwazanga ukuqedwa. Hlola imininingwane bese uzama futhi.",
    notFound:
      "Ulwazi oluceliwe alutholakalanga.",
    conflict:
      "Lesi senzo siphikisana nolwazi lwakamuva. Vuselela bese uzama futhi.",
    serverError:
      "Iseva ye-PhilaLink ayikwazanga ukuqedela isicelo. Zama futhi.",
    requestFailed:
      "Isicelo asikwazanga ukuqedwa.",
    medicationIdRequired:
      "I-ID yomuthi iyadingeka.",
    appointmentIdRequired:
      "I-ID yesikhathi sokubonana iyadingeka.",
    notificationIdRequired:
      "I-ID yesaziso iyadingeka.",
  },

  cookies: {
    consentAria:
      "Imvume yamakhukhi",
    settings:
      "Izilungiselelo zamakhukhi",
    closeSettings:
      "Vala izilungiselelo zamakhukhi",
    intro:
      "Ungakhetha ukuthi yimaphi amakhukhi angakhethwa i-PhilaLink engawasebenzisa. Amakhukhi abalulekile ayadingeka ukuze iwebhusayithi isebenze kahle futhi awakwazi ukuvalwa.",

    whatTitle:
      "Ayini amakhukhi?",
    whatBody1:
      "Amakhukhi amafayela amancane ombhalo agcinwa yisiphequluli noma idivayisi yakho. Avumela amawebhusayithi ukuthi akhumbule ulwazi oluthile phakathi kokuvakasha.",
    whatBody2:
      "I-PhilaLink isebenzisa amakhukhi kuphela ukuze iwebhusayithi isebenze kanye nokugcina izinketho ozikhethayo. Ulwazi lwezempilo olufana nemithi, izikhathi zokubonana namarekhodi ezokwelapha alugcinwa efayeleni lemvume yamakhukhi.",

    preferencesTitle:
      "Yiziphi izinketho zamakhukhi esizisebenzisayo?",
    essentialTitle:
      "Amakhukhi abalulekile",
    essentialBody:
      "Lawa asekela ukuphepha, akhumbula ukukhetha kwakho kwamakhukhi futhi avumela imisebenzi eyisisekelo ye-PhilaLink ukuthi isebenze.",
    alwaysOn:
      "Ahlala evuliwe",
    preferenceTitle:
      "Amakhukhi ezinketho",
    preferenceBody:
      "Lawa angakhumbula izinketho zesiphequluli ezingaphoqelekile ukuze i-PhilaLink ibe lula ukuyisebenzisa kule divayisi.",

    whyTitle:
      "Kungani sisebenzisa amakhukhi?",
    whyBody1:
      "I-PhilaLink isebenzisa amakhukhi abalulekile ukusekela ukusebenza okuphephile kwewebhusayithi nokukhumbula isinqumo sakho semvume.",
    whyBody2:
      "Amakhukhi ezinketho angasiza ukukhumbula ukukhetha kwesiphequluli okungazweli. I-PhilaLink okwamanje ayisebenzisi amakhukhi ezikhangiso ngalolu hlelo lwemvume.",

    changeTitle:
      "Uzishintsha kanjani izinketho zamakhukhi?",
    changeBody1:
      "Ungabuyela kuzilungiselelo zamakhukhi futhi ushintshe okukhethayo nganoma yisiphi isikhathi. Ukulondoloza ukukhetha okusha kuthatha indawo kokudala kulesi siphequluli.",
    changeBody2:
      "Ungaphinde ususe amakhukhi e-PhilaLink usebenzisa izilungiselelo zobumfihlo noma zedatha yesayithi zesiphequluli sakho.",

    thirdPartyTitle:
      "Abanye abahlinzeki bazowasebenzisa nini amakhukhi?",
    thirdPartyBody1:
      "Uma ukhetha ukungena nge-Google, i-Google ingasebenzisa amakhukhi ezinsizakalweni zayo ngesikhathi sokuqinisekiswa kokungena.",
    thirdPartyBody2:
      "Lawo makhukhi alawulwa yi-Google futhi ahlukile kukhukhi lemvume le-PhilaLink.",

    essentialOnly:
      "Abalulekile kuphela",
    saveSettings:
      "Londoloza izilungiselelo",
    acceptAll:
      "Yamukela wonke amakhukhi",

    banner:
      "Amakhukhi asiza i-PhilaLink ukuthi isebenze kahle futhi ikhumbule izinketho zakho. Ungashintsha izilungiselelo zamakhukhi nganoma yisiphi isikhathi.",
  },

  chatbot: {
    floatingTooltip:
      "Umsizi wakho wezempilo we-AI",
    openAssistant:
      "Vula umsizi wezempilo we-PhilaChatBot",

    online: "Uxhumekile",
    assistantSubtitle:
      "Umsizi wakho wezempilo we-PhilaLink",
    minimize: "Nciphisa",
    moreOptions:
      "Ezinye izinketho",
    chatOptions:
      "Izinketho zengxoxo",
    chatOptionsDescription:
      "Phatha ingxoxo yakho yamanje ye-PhilaChatBot.",
    clearHistory:
      "Sula umlando wengxoxo",
    clearing:
      "Kuyasulwa...",
    clearDescription:
      "Qala ingxoxo entsha ngaphandle kokususa amarekhodi akho ezempilo e-PhilaLink.",
    waitForResponse:
      "Linda impendulo yamanje iqede ngaphambi kokusula ingxoxo.",
    close: "Vala",
    clearConfirm:
      "Sula lo mlando wengxoxo?\n\nLokhu kuzoqala ingxoxo entsha ye-PhilaChatBot. Ukuhlolwa kwezimpawu zakho, imithi, ukungezwani komzimba, izimo zezempilo nolunye ulwazi lwephrofayela ye-PhilaLink ngeke kususwe.",
    clearError:
      "Umlando wengxoxo awukwazanga ukusulwa. Zama futhi.",

    initialMessage:
      "Ngingakusiza kanjani? Ungabuza ngolwazi lwakho lwe-PhilaLink noma ulwazi olujwayelekile lwezempilo.",
    noResponse:
      "Ayikho impendulo ebuyisiwe.",
    processError:
      "Angikwazanga ukucubungula lowo mlayezo njengamanje.",

    welcomeTitle:
      "Sawubona, ngingu-PhilaChatBot",
    welcomeBody:
      "Ngingumsizi wakho wezempilo we-AI we-PhilaLink. Ngingakusiza uqonde izimpawu zakho, uhlole ulwazi lwemithi futhi uthole isiqondiso esijwayelekile sezempilo.",
    disclaimerTitle:
      "Isaziso esibalulekile",
    disclaimerBody:
      "I-PhilaChatBot inikeza ulwazi olujwayelekile lwezempilo futhi ayithathi indawo kadokotela, umhlengikazi, usokhemisi noma omunye uchwepheshe wezempilo. Funa usizo lochwepheshe uma udaba lwakho ludinga ukuhlolwa kwezokwelapha.",
    understandContinue:
      "Ngiyaqonda — qhubeka",

    howCanHelp:
      "Ngingakusiza kanjani?",
    quickStartBody:
      "Xoxa ngokukhululekile noPhila noma uqale ukuhlolwa kwezimpawu okuholwayo.",

    quickChatTitle:
      "Xoxa noPhila",
    quickChatDescription:
      "Buza umbuzo wezempilo noma ukhulume ngolwazi lwakho lwe-PhilaLink.",

    quickSymptomsTitle:
      "Hlola izimpawu zami",
    quickSymptomsDescription:
      "Qala ukuhlolwa kwezempilo okuholwayo.",

    quickMedicationsTitle:
      "Imithi yami",
    quickMedicationsDescription:
      "Buza ngemithi yakho, ukusetshenziswa kwayo okujwayelekile kanye nemithi esele.",
    quickMedicationsPrompt:
      "Ngitshele ngemithi erekhodiwe kuphrofayela yami ye-PhilaLink nokuthi kusele imithi engakanani.",

    quickAllergiesTitle:
      "Ukungezwani komzimba kwami",
    quickAllergiesDescription:
      "Buza ngolwazi lokungezwani komzimba olurekhodiwe kuphrofayela yakho.",
    quickAllergiesPrompt:
      "Yikuphi ukungezwani komzimba okurekhodiwe kuphrofayela yami ye-PhilaLink, futhi yiluphi ulwazi olujwayelekile okufanele ngilukhumbule?",

    quickHelpTitle:
      "Kufanele ngilufune nini usizo?",
    quickHelpDescription:
      "Buza ngezimpawu eziyingozi nokuthi usizo oluphuthumayo lungadingeka nini.",
    quickHelpPrompt:
      "Yiziphi izimpawu eziyingozi okufanele zenze umuntu afune usizo lwezempilo oluphuthumayo?",

    ageTitle:
      "Uneminyaka emingaki?",
    ageDescription:
      "Iminyaka yakho isiza i-PhilaChatBot inikeze isiqondiso sezempilo esifanele kakhulu.",
    age: "Iminyaka",
    agePlaceholder:
      "Faka iminyaka yakho",
    ageInvalid:
      "Faka iminyaka ephakathi ko-1 no-120.",
    agePrivacy:
      "I-PhilaChatBot isebenzisa lolu lwazi kuphela njengengxenye yokuhlolwa kwezimpawu zakho.",

    symptomsTitle:
      "Yiziphi izimpawu ozizwayo?",
    symptomsDescription:
      "Khetha zonke izimpawu ezikuthintayo. Ungangeza nesinye isimpawu esingekho ohlwini.",
    addSymptom:
      "Engeza esinye isimpawu",
    symptomPlaceholder:
      "Bhala isimpawu",
    addSymptomAria:
      "Engeza isimpawu",
    selectedSymptoms:
      "Izimpawu ezikhethiwe",
    removeSymptom:
      "Susa {{item}}",
    seriousSymptoms:
      "Ezinye zezimpawu ozikhethile zingaba zimbi. I-PhilaChatBot izokwenza ukuhlola kokuphepha kwezimo eziphuthumayo ngaphambi kokubonisa isiqondiso esijwayelekile.",

    durationTitle:
      "Usunesikhathi esingakanani nalezi zimpawu?",
    durationDescription:
      "Khetha inketho echaza kahle ukuthi izimpawu zakho sezinesikhathi esingakanani.",
    specificDuration:
      "Faka isikhathi esithile",
    duration: "Isikhathi",
    enterNumber:
      "Faka inombolo",
    invalidDuration:
      "Faka isikhathi esivumelekile.",

    allergiesTitle:
      "Ingabe kukhona okwaziwayo umzimba wakho ongakwamukeli?",
    allergiesDescription:
      "Ulwazi lokungezwani komzimba lusiza i-PhilaChatBot igweme isiqondiso semithi esingaphephile.",
    addAllergy:
      "Engeza okunye ukungezwani komzimba",
    allergyPlaceholder:
      "Bhala ukungezwani komzimba",
    addAllergyAria:
      "Engeza ukungezwani komzimba",
    selectedAllergies:
      "Ukungezwani komzimba okukhethiwe",
    removeAllergy:
      "Susa {{item}}",
    noAllergiesNote:
      "Uma kungekho ukungezwani komzimba okwaziyo, ungaqhubeka ungakhethanga lutho.",

    medicationsTitle:
      "Ingabe kukhona imithi oyisebenzisayo?",
    medicationsDescription:
      "Khetha imithi kuphrofayela yakho ye-PhilaLink noma wengeze omunye.",
    yourMedications:
      "Imithi yakho ye-PhilaLink",
    loadingMedications:
      "Kulayishwa imithi yakho...",
    noProfileMedications:
      "Ayikho imithi esebenzayo erekhodiwe kuphrofayela yakho ye-PhilaLink njengamanje.",
    medicationLoadError:
      "Imithi yakho ye-PhilaLink ayikwazanga ukulayishwa. Usengangeza umuthi ngesandla.",
    selected: "Kukhethiwe",
    addMedication:
      "Engeza omunye umuthi",
    medicationPlaceholder:
      "Igama lomuthi",
    addMedicationAria:
      "Engeza umuthi",
    selectedMedications:
      "Imithi ekhethiwe",
    removeMedication:
      "Susa {{item}}",
    noMedicationNote:
      "Uma ungasebenzisi imithi njengamanje, shiya lesi sigaba singenalutho bese uqhubeka.",

    conditionsTitle:
      "Ingabe unezimo zezempilo ezikhona?",
    conditionsDescription:
      "Lesi sinyathelo asiphoqelekile, kodwa singasiza ukwenza ukuhlolwa kuhambisane kangcono nawe.",
    addCondition:
      "Engeza esinye isimo",
    conditionPlaceholder:
      "Igama lesimo",
    addConditionAria:
      "Engeza isimo",
    selectedConditions:
      "Izimo ezikhethiwe",
    removeCondition:
      "Susa {{item}}",

    reviewBadge:
      "Buyekeza",
    reviewTitle:
      "Buyekeza ulwazi lwakho",
    reviewDescription:
      "Qinisekisa ukuthi konke kulungile ngaphambi kokuthi i-PhilaChatBot ilungise isiqondiso sakho sezempilo.",
    notSpecified:
      "Akucacisiwe",
    notProvided:
      "Akufakiwe",
    noneSelected:
      "Akukho okukhethiwe",
    noKnownAllergies:
      "Akukho ukungezwani komzimba okukhethiwe",
    currentMedications:
      "Imithi yamanje",
    medicalConditions:
      "Izimo zezempilo",
    edit:
      "Hlela {{item}}",
    reviewSafety:
      "I-PhilaChatBot izoqala ngokuhlola izimpawu eziyingozi ngaphambi kokulungisa izimbangela ezingaba khona, isiqondiso semithi nezinyathelo ezilandelayo.",
    analyzeSymptoms:
      "Hlaziya izimpawu",

    loadingTitle:
      "I-PhilaLink ihlola izimpawu zakho",
    loadingDescription:
      "Ukuhlolwa kwakho kuyacutshungulwa uhlelo lwangemuva lwe-PhilaLink.",
    loadingDisclaimer:
      "Lokhu kuhlolwa kunikeza isiqondiso sokuhlukanisa ukuphuthuma futhi akusikho ukuxilongwa kwesifo.",

    stageSending:
      "Kuthunyelwa izimpawu zakho ngokuphephile",
    stageWarningSigns:
      "Kuhlolwa izimpawu eziyingozi",
    stageRecording:
      "Kurekhodwa ukuhlolwa kwakho",
    stageResult:
      "Kulungiswa umphumela wokuhlolwa",

    emergency:
      "Isimo esiphuthumayo",
    urgent: "Kuyaphuthuma",
    nonEmergency:
      "Akusona isimo esiphuthumayo",
    assessmentComplete:
      "Ukuhlolwa kuqediwe",

    emergencyTitle:
      "Funa usizo lwezempilo oluphuthumayo manje",
    emergencyDescription:
      "Isibonakaliso esisodwa noma eziningi ozithumele zihambisana nophawu olukhulu oluyingozi. I-PhilaChatBot ayikwazi ukuthola imbangela ngokuphephile ngale ngxoxo.",
    emergencyRecommendation:
      "Isincomo esiphuthumayo",
    defaultEmergencyRecommendation:
      "Izimpawu zakho zingadinga ukunakekelwa kwezempilo ngokushesha. Funa usizo lwezempilo oluphuthumayo manje noma uye esikhungweni esiphuthumayo esiseduze. Ungathembeli ku-PhilaLink ukuze uthole ukwelashwa okuphuthumayo.",
    warningSigns:
      "Izimpawu eziyingozi zingabandakanya:",
    warningChestPain:
      "Ubuhlungu besifuba",
    warningBreathing:
      "Ukuphefumula kanzima kakhulu",
    warningConsciousness:
      "Ukulahlekelwa ukwazi",
    warningSeizure:
      "Ukuquleka",
    warningBleeding:
      "Ukopha kakhulu",
    warningStroke:
      "Izimpawu zestroke",
    warningAllergy:
      "Ukungezwani komzimba okukhulu",
    callEmergency:
      "Shayela izinsizakalo eziphuthumayo",
    viewAssessment:
      "Buka imininingwane yokuhlolwa",
    anotherAssessment:
      "Qala okunye ukuhlolwa",
    emergencyFooter:
      "Ungalibali ukunakekelwa okuphuthumayo ngenxa yokusebenzisa i-PhilaChatBot.",

    healthAssessment:
      "Ukuhlolwa kwezempilo",
    healthAssessmentDescription:
      "Lo mphumela wenziwe insizakalo yokuhlolwa kwezimpawu ye-PhilaLink futhi warekhodwa emlandweni wakho wesiguli.",
    triageResult:
      "Umphumela wokuhlukanisa ukuphuthuma",
    recommendation:
      "Isincomo",
    noRecommendation:
      "Asikho isincomo esibuyisiwe.",
    symptomsSubmitted:
      "Izimpawu ezithunyelwe",
    recorded:
      "Kurekhodwe: {{date}}",
    emergencyFollow:
      "Landela isincomo esiphuthumayo esingenhla ngokushesha.",
    followUp:
      "Buza umbuzo olandelayo",

    menu: "Imenyu",
    chat: "Ingxoxo",
    askPlaceholder:
      "Buza uPhila noma yini...",
    sendMessage:
      "Thumela umlayezo",
    followupDisclaimer:
      "I-PhilaChatBot inikeza ulwazi olujwayelekile lwezempilo futhi ayithathi indawo yochwepheshe bezempilo.",

    quickCause:
      "Yini engase ibangele lokhu?",
    quickMonitor:
      "Yini okufanele ngiyiqaphe?",
    quickSupply:
      "Kusele izinsuku ezingaki zemithi?",

    errorNetworkTitle:
      "Asikwazanga ukuxhumana ne-PhilaChatBot",
    errorNetworkDescription:
      "Hlola uxhumano lwakho lwe-inthanethi bese uzama futhi.",
    errorUnavailableTitle:
      "I-PhilaChatBot ayitholakali okwesikhashana",
    errorUnavailableDescription:
      "Umsizi wezempilo akakwazanga ukucubungula isicelo sakho njengamanje. Zama futhi maduzane.",
    errorMissingTitle:
      "Kudingeka ulwazi olwengeziwe",
    errorMissingDescription:
      "Buyekeza ukuhlolwa kwakho bese ufaka ulwazi olushodayo ngaphambi kokuqhubeka.",
    tryAgain: "Zama futhi",
    emergencyInstead:
      "Uma usesimweni esiphuthumayo sezempilo, xhumana nezinsizakalo eziphuthumayo kunokulinda i-chatbot.",

    back: "Emuva",
    continue: "Qhubeka",
    review: "Buyekeza",

    fields: {
      age: "Iminyaka",
      symptoms: "Izimpawu",
      duration: "Isikhathi",
      allergies:
        "Ukungezwani komzimba",
      medications:
        "Imithi yamanje",
      conditions:
        "Izimo zezempilo",
    },
  },

  dynamic: {
    appointmentTypes: {
      routineCheckup:
        "Ukuhlolwa okujwayelekile",
      generalConsultation:
        "Ukubonana okujwayelekile",
      medicationReview:
        "Ukubuyekezwa kwemithi",
      chronicFollowup:
        "Ukulandela ukunakekelwa kwesifo esingamahlalakhona",
      followupVisit:
        "Ukuvakasha kokulandela",
      symptoms:
        "Izimpawu / Ukungaphatheki kahle",
      other: "Okunye",
      appointment:
        "Isikhathi sokubonana",
    },

    recordTypes: {
      consultation: "Ukubonana",
      clinicalConsultation:
        "Ukubonana kwezokwelapha",
      laboratory:
        "Ilabhorethri",
      labResult:
        "Umphumela welabhorethri",
      test: "Ukuhlolwa",
      medication: "Imithi",
      observation:
        "Ukuqapha",
      vitals:
        "Izimpawu ezibalulekile zomzimba",
      healthRecord:
        "Irekhodi lezempilo",
    },

    facilityTypes: {
      clinic: "Umtholampilo",
      hospital: "Isibhedlela",
      healthCentre:
        "Isikhungo sezempilo",
      communityHealthCentre:
        "Isikhungo sezempilo somphakathi",
    },

    directions: {
      left: "kwesobunxele",
      right: "kwesokudla",
      straight: "uqonde",
      slightLeft:
        "kancane kwesobunxele",
      slightRight:
        "kancane kwesokudla",
      sharpLeft:
        "kakhulu kwesobunxele",
      sharpRight:
        "kakhulu kwesokudla",
      uturn:
        "ujike ubuyele emuva",
    },

    durationUnits: {
      hours: "Amahora",
      days: "Izinsuku",
      weeks: "Amasonto",
      months: "Izinyanga",
    },

    durations: {
      lessThanDay:
        "Ngaphansi kosuku olu-1",
      oneTwoDays:
        "Usuku olu-1–2",
      threeSevenDays:
        "Izinsuku ezi-3–7",
      oneTwoWeeks:
        "Iviki eli-1–2",
      moreThanTwoWeeks:
        "Ngaphezu kwamasonto ama-2",
      moreThanMonth:
        "Ngaphezu kwenyanga e-1",
    },

    symptoms: {
      headache:
        "Ubuhlungu bekhanda",
      fever: "Imfiva",
      cough: "Ukukhwehlela",
      soreThroat:
        "Ubuhlungu bomphimbo",
      nausea:
        "Ukuzizwa unesicanucanu",
      vomiting: "Ukuhlanza",
      diarrhea: "Uhudo",
      stomachPain:
        "Ubuhlungu besisu",
      backPain:
        "Ubuhlungu bomhlane",
      dizziness:
        "Isiyezi",
      fatigue:
        "Ukukhathala",
      runnyNose:
        "Ikhala eligijimayo",
      shortnessOfBreath:
        "Ukuphelelwa umoya",
      chestPain:
        "Ubuhlungu besifuba",
    },

    allergies: {
      penicillin: "Penicillin",
      ibuprofen: "Ibuprofen",
      aspirin: "Aspirin",
      sulfonamides:
        "Sulfonamides",
      peanuts: "Amakinati",
      shellfish:
        "Ukudla kwasolwandle okunegobolondo",
      latex: "Latex",
    },

    conditions: {
      diabetes:
        "Isifo sikashukela",
      hypertension:
        "Umfutho wegazi ophezulu",
      asthma: "Isifuba somoya",
      highCholesterol:
        "I-cholesterol ephezulu",
      heartDisease:
        "Isifo senhliziyo",
      kidneyDisease:
        "Isifo sezinso",
      epilepsy: "Isithuthwane",
    },

    statuses: {
      scheduled: "Kuhleliwe",
      confirmed:
        "Kuqinisekisiwe",
      pending: "Kusalindile",
      completed: "Kuqediwe",
      cancelled:
        "Kukhanseliwe",
      rescheduled:
        "Kuhlelwe kabusha",
      missed: "Kuphosiwe",
      available:
        "Kuyatholakala",
      final: "Okokugcina",
      draft:
        "Okusalungiswa",
    },
  },

  systemNotifications: {
    hot:
      "Ithiphu yezempilo yesimo sezulu: Kulindeleke ukushisa. Phuza amanzi anele, gwema ukuhlala isikhathi eside ekushiseni, futhi ufune usizo lwezempilo uma uba nezimpawu ezinzima ezihlobene nokushisa.",

    cold:
      "Ithiphu yezempilo yesimo sezulu: Kulindeleke ukubanda. Zigcine ufudumele, ikakhulukazi uma usengozini ngenxa yesimo sezulu esibandayo, futhi ugcine imithi ngokwemiyalelo yayo.",

    rain:
      "Ithiphu yezempilo yesimo sezulu: Kulindeleke imvula noma izivunguvungu. Hlela isikhathi esengeziwe sokuhamba uma uya emtholampilo noma ukuyolanda imithi futhi ugweme izindawo ezigcwele amanzi ezingaphephile.",

    wind:
      "Ithiphu yezempilo yesimo sezulu: Kulindeleke imimoya enamandla. Qaphela kakhulu uma uhamba futhi ugweme ukuvezwa okungadingekile uma izimo zingaphephile.",

    medicationReminder:
      "Isikhumbuzi somuthi: {{medication}} uhlelelwe u-{{time}} ngo-{{date}}.",

    appointmentUpdate:
      "Isibuyekezo sesikhathi sokubonana: {{type}} yakho e-{{clinic}} inesimo esithi {{status}} ngo-{{date}}.",

    appointmentSoon:
      "Isikhumbuzi sesikhathi sokubonana - maduze: {{type}} yakho e-{{clinic}} iqala ngo-{{time}} namuhla.",

    appointmentReminder:
      "Isikhumbuzi sesikhathi sokubonana: {{type}} yakho e-{{clinic}} ihlelelwe u-{{date}}.",
  },

  serverText: {
    emergencyAssessment:
      "Izimpawu zakho zingadinga ukunakekelwa kwezempilo ngokushesha. Funa usizo lwezempilo oluphuthumayo manje noma uye esikhungweni esiphuthumayo esiseduze. Ungathembeli ku-PhilaLink ukuze uthole ukwelashwa okuphuthumayo.",

    urgentAssessment:
      "Lezi zimpawu kufanele zihlolwe uchwepheshe wezempilo maduzane. Xhumana nomtholampilo wakho noma omunye umhlinzeki wezempilo oqeqeshiwe ngokushesha ngangokunokwenzeka. Uma izimpawu ziba zimbi kakhulu, ziba zimbi ngokushesha, noma uba nobunzima bokuphefumula, ubuhlungu besifuba, ukuquleka, ukudideka, ukopha kakhulu noma olunye uphawu oluphuthumayo, funa usizo lwezempilo oluphuthumayo ngokushesha.",

    breathingUrgent:
      "Izimpawu zokuphefumula kufanele zihlolwe ngokushesha uchwepheshe wezempilo. Xhumana nomtholampilo wakho, insizakalo yokunakekelwa okuphuthumayo noma omunye umhlinzeki wezempilo oqeqeshiwe ngokushesha ngangokunokwenzeka. Uma uphefumula kanzima, ungakwazi ukukhuluma kahle ngenxa yokuphelelwa umoya, uba nobuhlungu besifuba, udideka, uquleka noma izindebe noma ubuso buba luhlaza okwesibhakabhaka, funa usizo lwezempilo oluphuthumayo ngokushesha.",

    nonEmergencyAssessment:
      "Akukho gama elikhombisa isimo esiphuthumayo noma esidinga ukunakekelwa ngokushesha elitholakele olwazini olunikeziwe. Lokhu akusikho ukuxilongwa kwesifo. Qapha izimpawu zakho, landela uhlelo lwakho lokunakekelwa olujwayelekile, futhi uxhumane nomtholampilo uma izimpawu ziqhubeka, ziba zimbi, ziphinda noma zikukhathaza. Uma kuvela izimpawu ezintsha ezinzima, funa ukunakekelwa okuphuthumayo.",

    chatbotEmergency:
      "Umlayezo wakho uqukethe izimpawu noma ulwazi olungakhombisa isimo sezempilo esiphuthumayo. Funa usizo lwezempilo oluphuthumayo manje noma uye esikhungweni esiphuthumayo esiseduze. Ungathembeli ku-PhilaLink noma ku-chatbot ukuze uthole ukwelashwa okuphuthumayo.",

    chatbotUrgent:
      "Umlayezo wakho uqukethe izimpawu okufanele zihlolwe ngokushesha uchwepheshe wezempilo. Xhumana nomtholampilo wakho, insizakalo yokunakekelwa okuphuthumayo noma omunye umhlinzeki wezempilo oqeqeshiwe ngokushesha ngangokunokwenzeka. Uma uphefumula kanzima, uba nobuhlungu besifuba, uquleka, udideka, wopha kakhulu noma izimpawu ziba zimbi ngokushesha, funa usizo lwezempilo oluphuthumayo ngokushesha.",

    chatbotUnavailable:
      "Angikwazi ukufinyelela umsizi wezempilo njengamanje. Zama futhi maduzane. Uma unezimpawu eziphuthumayo, funa usizo lwezempilo ngokushesha.",

    chatbotNoResponse:
      "Angikwazanga ukwenza impendulo njengamanje.",
  },
};

// =========================================================
// COMPLETE ISIZULU PAGE OVERRIDES
// =========================================================

export const patientPageFixes = {
  zu: {
    medications: {
      title: "Imithi Yami",

      loadingPrescriptions:
        "Kulayishwa imithi yakho...",

      activePrescriptionCount_one:
        "{{count}} umuthi osebenzayo",

      activePrescriptionCount_other:
        "{{count}} imithi esebenzayo",

      refresh: "Vuselela",

      loadError:
        "Asikwazanga ukulayisha imithi yakho.",

      supplyTemporaryUnavailable:
        "Ulwazi lwemithi esele alutholakali okwesikhashana.",

      takenMessage:
        "Umuthi umakwe njengothathiwe. Inani lemithi esele selibalwe kabusha.",

      skippedMessage:
        "Umuthi umakwe njengoweqiwe.",

      updateError:
        "Asikwazanga ukubuyekeza lo muthi.",

      noMedicationsTitle:
        "Ayikho imithi erekhodiwe",

      noMedicationsBody:
        "Okwamanje ayikho imithi exhunywe kuphrofayela yakho yesiguli.",

      medication: "Umuthi",
      active: "Iyasebenza",
      inactive: "Ayisebenzi",
      ended: "Iphelile",
      upcoming: "Ezayo",

      noInstructions:
        "Ayikho imiyalelo erekhodiwe",

      doseProgressSummary:
        "{{taken}} kwemithamo engu-{{scheduled}} ehleliwe imakwe njengethathiwe namuhla",

      loadingSupply:
        "Kulayishwa ulwazi lwemithi esele",

      todaysDosesComplete:
        "Imithamo yanamuhla isiqediwe",

      medicationSupply:
        "Imithi esele",

      loadingSupplyInformation:
        "Kulayishwa ulwazi lwemithi esele...",

      supplyUnavailable:
        "Ulwazi lwemithi esele alutholakali",

      supplyInformationUnavailable:
        "Ulwazi lwemithi esele alukatholakali.",

      supplyDepleted:
        "Imithi esele isiphelile",

      dayRemaining:
        "Kusele usuku olu-1",

      daysRemaining:
        "Kusele izinsuku eziyi-{{count}}",

      estimatedSupplyText:
        "Lokhu kulinganiselwa kusukela ekuqoqweni kwakho kwakamuva okuqediwe, ohlelweni lwemithamo olusebenzayo nasemithamweni oyimake njengoyithathile.",

      doseAmountNeeded:
        "Kudingeka inani lomthamo",

      missingUnitsText:
        "Inani lomuthi onikeziwe lirekhodiwe, kodwa amayunithi asetshenziswa ngomthamo awakarekhodwa.",

      scheduleNeeded:
        "Kudingeka uhlelo lomthamo",

      missingScheduleText:
        "Inani lomuthi onikeziwe lirekhodiwe, kodwa alukho uhlelo lomthamo olusebenzayo.",

      noCollectedSupply:
        "Awukho umuthi oqoqiwe",

      noCompletedCollectionText:
        "Akukho ukuqoqwa kwemithi okuqediwe okurekhodiwe kwalo muthi.",

      supplyCalculationFailed:
        "Ulwazi lwemithi esele alukwazanga ukubalwa.",

      dispensed: "Enikeziwe",
      remaining: "Eseleyo",
      daysLeft: "Izinsuku ezisele",
      dosesPerDay:
        "Imithamo ngosuku",

      lastCollected:
        "Kugcine ukuqoqwa ngo-{{date}}",

      unitsPerDose_one:
        "{{count}} iyunithi ngomthamo",

      unitsPerDose_other:
        "{{count}} amayunithi ngomthamo",

      trySupplyAgain:
        "Zama ulwazi lwemithi futhi",

      form: "Uhlobo",
      condition:
        "Isimo sempilo",
      prescribedBy:
        "Inikezwe ngu",
      schedule: "Uhlelo",

      noScheduleRecorded:
        "Alukho uhlelo olurekhodiwe",

      startDate:
        "Usuku lokuqala",

      endDate:
        "Usuku lokugcina",

      notRecorded:
        "Akurekhodiwe",

      latestAdherence:
        "Ukulandela imithi kwakamuva",

      taken: "Ithathiwe",
      skipped: "Yeqiwe",

      startsOn:
        "Lo muthi uqala ngo-{{date}}. Ukurekhoda umthamo kuzotholakala uma umuthi usuqalile.",

      noActiveScheduleMessage:
        "Alukho uhlelo lomthamo olusebenzayo olurekhodiwe kulo muthi. Xhumana nomtholampilo wakho ngaphambi kokurekhoda umthamo.",

      notCollectedTitle:
        "Umuthi awukaqoqwa",

      notCollectedBody:
        "Ungabuka lo muthi nohlelo lwawo, kodwa awukwazi ukumaka umthamo njengothathiwe kuze kube sekuqediwe ukuqoqwa kwemithi.",

      doseAmountConfigurationTitle:
        "Inani lomthamo lisadinga ukusethwa",

      doseAmountConfigurationBody:
        "Umtholampilo wakho kufanele urekhode inani lamayunithi omuthi asetshenziswa ngomthamo ngaphambi kokuthi ukwazi ukurekhoda imithamo ethathiwe.",

      supplyDepletedTitle:
        "Imithi erekhodiwe esele isiphelile",

      supplyDepletedBody:
        "Awukho umuthi owanele osele ukuze kuthathwe omunye umthamo. Kudingeka kuqedwe ukuqoqwa kwemithi okusha ngaphambi kokurekhoda omunye umthamo othathiwe.",

      supplyVerificationUnavailable:
        "Imithi esele ayikwazanga ukuqinisekiswa. Ukurekhoda umthamo othathiwe akutholakali okwesikhashana.",

      scheduledDosesCompleteTitle:
        "Imithamo yanamuhla ehleliwe isiqediwe",

      scheduledDosesCompleteBody:
        "Umaka yonke imithamo engu-{{count}} ehleliwe njengoyithathile namuhla. Omunye umthamo othathiwe awukwazi ukurekhodwa kuze kube usuku olulandelayo.",

      todaysDoseProgress:
        "Inqubekela-phambili yemithamo yanamuhla",

      doseProgress:
        "{{taken}} kwemithamo engu-{{scheduled}} ehleliwe imakwe njengethathiwe.",

      dosesLeft_one:
        "Kusele umthamo {{count}}",

      dosesLeft_other:
        "Kusele imithamo {{count}}",

      takenToday_one:
        "{{count}} umthamo uthathiwe namuhla",

      takenToday_other:
        "{{count}} imithamo ithathiwe namuhla",

      skippedToday_one:
        "{{count}} umthamo weqiwe",

      skippedToday_other:
        "{{count}} imithamo yeqiwe",

      updating:
        "Kuyabuyekezwa...",

      notStartedYet:
        "Awukaqali",

      noActiveSchedule:
        "Alukho uhlelo olusebenzayo",

      checkingSupply:
        "Kuhlolwa imithi esele...",

      markAsTaken:
        "Maka njengothathiwe",

      skipDose:
        "Yeqa umthamo",

      todaysSchedule:
        "Uhlelo lwanamuhla",

      complete: "Kuphelele",

      scheduleTaken:
        "{{taken}} kwemithamo engu-{{scheduled}} ithathiwe namuhla",

      activeMedications:
        "Imithi esebenzayo",

      noActiveMedications:
        "Ayikho imithi esebenzayo.",

      previousMedications:
        "Imithi yangaphambilini",
    },

    appointments: {
      title:
        "Izikhathi Zokubonana",

      subtitle:
        "Bhuka ukuvakashela umtholampilo bese ukhetha ukuthi ufuna ukubona uMhlengikazi noma uDokotela.",

      refresh: "Vuselela",

      bookAppointment:
        "Bhuka isikhathi",

      bookAnAppointment:
        "Bhuka isikhathi",

      booking:
        "Kuyabhukwa...",

      appointment:
        "Isikhathi sokubonana",

      clinicProvider:
        "Umhlinzeki womtholampilo",

      dateUnavailable:
        "Usuku alutholakali",

      notes: "Amanothi",

      reschedule:
        "Hlela kabusha",

      cancel: "Khansela",

      loadError:
        "Asikwazanga ukulayisha izikhathi zakho zokubonana.",

      bookingError:
        "Asikwazanga ukubhuka isikhathi sakho.",

      rescheduleError:
        "Asikwazanga ukuhlela kabusha lesi sikhathi.",

      cancellationError:
        "Asikwazanga ukukhansela lesi sikhathi.",

      futureDateRequired:
        "Khetha usuku nesikhathi esizayo.",

      futureRescheduleRequired:
        "Khetha usuku nesikhathi esizayo sokuhlela kabusha.",

      reasonRequired:
        "Faka isizathu sesikhathi sakho sokubonana.",

      bookingTitle:
        "Bhuka isikhathi",

      bookingDescription:
        "Khetha insizakalo nokuthi ufuna ukubona uMhlengikazi noma uDokotela.",

      appointmentType:
        "Uhlobo lokubonana",

      providerQuestion:
        "Ufuna ukubona bani?",

      dateAndTime:
        "Usuku nesikhathi",

      reason: "Isizathu",

      visitMode:
        "Indlela yokubonana",

      duration:
        "Ubude besikhathi",

      optionalNotes:
        "Amanothi (uma kudingeka)",

      inPerson:
        "Ngokubonana ngqo",

      telehealth:
        "Ukubonana nge-inthanethi",

      nurse: "Umhlengikazi",
      doctor: "Udokotela",

      routineCheckup:
        "Ukuhlolwa okujwayelekile",

      generalConsultation:
        "Ukubonana okujwayelekile",

      medicationReview:
        "Ukubuyekezwa kwemithi",

      chronicFollowup:
        "Ukulandela ukunakekelwa kwesifo esingamahlalakhona",

      followupVisit:
        "Ukuvakasha kokulandela",

      symptoms:
        "Izimpawu / Ukungaphatheki kahle",

      other: "Okunye",

      defaultReason:
        "Ukuhlolwa okujwayelekile kwesiguli",

      minutes:
        "Imizuzu engu-{{count}}",

      rescheduleTitle:
        "Hlela kabusha isikhathi",

      newDateTime:
        "Usuku nesikhathi esisha",

      confirmReschedule:
        "Qinisekisa ukuhlela kabusha",

      cancelTitle:
        "Khansela isikhathi",

      cancelQuestion:
        "Uqinisekile ukuthi ufuna ukukhansela {{type}} yakho ngo-{{date}}?",

      keepAppointment:
        "Gcina isikhathi",

      cancelAppointment:
        "Khansela isikhathi",

      cancelling:
        "Kuyakhanselwa...",

      saving:
        "Kuyalondolozwa...",

      upcoming: "Ezizayo",
      past: "Ezidlule",

      upcomingCount:
        "Ezizayo ({{count}})",

      pastCount:
        "Ezidlule ({{count}})",

      noUpcoming:
        "Azikho izikhathi zokubonana ezizayo",

      noPrevious:
        "Azikho izikhathi zangaphambilini",

      scheduled: "Kuhleliwe",
      confirmed:
        "Kuqinisekisiwe",
      pending: "Kusalindile",
      completed: "Kuqediwe",
      cancelled:
        "Kukhanseliwe",
      rescheduled:
        "Kuhlelwe kabusha",
      missed: "Kuphosiwe",

      close: "Vala",
    },

    records: {
      title:
        "Amarekhodi Ezempilo",

      loading:
        "Kulayishwa amarekhodi akho ezempilo...",

      recordCount_one:
        "{{count}} irekhodi eligciniwe",

      recordCount_other:
        "{{count}} amarekhodi agciniwe",

      refresh: "Vuselela",

      loadError:
        "Asikwazanga ukulayisha amarekhodi akho ezempilo.",

      allRecords:
        "Wonke amarekhodi",

      consultations:
        "Ukubonana",

      laboratory:
        "Ilabhorethri",

      medication: "Imithi",

      observations:
        "Ukuqapha",

      searchPlaceholder:
        "Sesha amarekhodi ezempilo",

      noRecordsFound:
        "Awekho amarekhodi atholakele",

      noRecordsFoundBody:
        "Zama ukushintsha usesho noma isihlungi.",

      noRecordsYet:
        "Awekho amarekhodi ezempilo okwamanje",

      noRecordsYetBody:
        "Amarekhodi akho ezokwelapha azovela lapha uma engezwa yithimba lakho lezempilo.",

      healthRecord:
        "Irekhodi lezempilo",

      healthcareProvider:
        "Umhlinzeki wezempilo",

      available:
        "Kuyatholakala",

      completed:
        "Kuqediwe",

      final:
        "Okokugcina",

      pending:
        "Kusalindile",

      draft:
        "Okusalungiswa",

      record: "Irekhodi",

      dateUnavailable:
        "Usuku alutholakali",

      clinicalSummary:
        "Isifinyezo sezokwelapha",

      noSummary:
        "Asikho isifinyezo sezokwelapha esirekhodiwe.",

      category:
        "Isigaba",
    },

    clinics: {
      title:
        "Imitholampilo Nezibhedlela Eziseduze",

      subtitle:
        "Izikhungo zezempilo ezingaphakathi kuka-{{radius}} km ukusuka endaweni yakho yamanje.",

      loadError:
        "Asikwazanga ukulayisha imitholampilo nezibhedlela.",

      tryAgain:
        "Zama futhi",

      hoursUnavailable:
        "Amahora awatholakali",

      open: "Kuvuliwe",
      closed: "Kuvaliwe",

      locationUnavailable:
        "Indawo ayitholakali.",

      locationDenied:
        "Ukufinyelela endaweni kunqatshiwe. Vumela ukufinyelela endaweni kuzilungiselelo zesiphequluli sakho ukuze uthole izikhungo eziseduze.",

      locationPositionUnavailable:
        "Indawo yakho yamanje ayikwazanga ukutholwa.",

      locationTimeout:
        "Isicelo sendawo siphelelwe isikhathi. Zama futhi.",

      locationUnsupported:
        "Izinsizakalo zendawo azisekelwa yilesi siphequluli.",

      locationRequired:
        "Indawo iyadingeka",

      allowLocation:
        "Vumela ukufinyelela endaweni ukuze uthole imitholampilo nezibhedlela eziseduze.",

      allowLocationRadius:
        "Vumela ukufinyelela endaweni ukuze uthole imitholampilo nezibhedlela ezingaphakathi kuka-{{radius}} km.",

      useMyLocation:
        "Sebenzisa indawo yami",

      locating:
        "Kutholwa indawo...",

      navigatingTo:
        "Kuyiwa e-{{name}}",

      facilitiesWithin_one:
        "{{count}} isikhungo esingaphakathi kuka-{{radius}} km",

      facilitiesWithin_other:
        "{{count}} izikhungo ezingaphakathi kuka-{{radius}} km",

      facilitiesSorted:
        "Izikhungo zihlelwe ngokusondela kuqala.",

      navigationMapMessage:
        "Kuboniswa kuphela indawo yakho yamanje nendawo oya kuyo ngesikhathi sokuzulazula.",

      recenter:
        "Buyisela phakathi",

      end: "Qeda",

      arrived:
        "Usufikile",

      continueRoute:
        "Qhubeka nomzila wakho",

      updatingRoute:
        "Kubuyekezwa umzila",

      eta:
        "Isikhathi sokufika",

      remaining:
        "Okusele",

      yourLocation:
        "Indawo yakho",

      gpsAccuracy:
        "Ukunemba kwe-GPS: {{value}} m",

      kmAway:
        "{{distance}} km ukusuka kuwe",

      startNavigation:
        "Qala ukuzulazula",

      endNavigation:
        "Qeda ukuzulazula",

      destination:
        "Indawo oya kuyo",

      navigation:
        "Ukuzulazula",

      distance: "Ibanga",

      calculatingRoute:
        "Kubalwa umzila...",

      withinRadius:
        "Ngaphakathi kuka-{{radius}} km",

      nearbyFacilities_one:
        "{{count}} isikhungo esiseduze",

      nearbyFacilities_other:
        "{{count}} izikhungo eziseduze",

      waitingForLocation:
        "Kulindwe indawo",

      searchPlaceholder:
        "Sesha imitholampilo noma izibhedlela",

      noFacilities:
        "Azikho izikhungo ezitholakele",

      noFacilitiesBody:
        "Ayikho imitholampilo noma izibhedlela ze-PhilaLink ezitholakele ngaphakathi kuka-{{radius}} km ukusuka endaweni yakho yamanje.",

      navigating:
        "Kuyazulazulwa",

      coordinatesRequired:
        "Kudingeka izixhumanisi zendawo ezivumelekile ukuze kuqalwe ukuzulazula.",

      routeCalculationFailed:
        "Umzila wokuzulazula awukwazanga ukubalwa.",

      routeNotFound:
        "Awukho umzila wokushayela otholakele oya kulesi sikhungo.",

      routeGeometryInvalid:
        "Umzila awunalo ulwazi olwanele lwemephu.",

      navigationUnavailable:
        "Ukuzulazula akutholakali njengamanje.",

      currentLocationRequired:
        "Indawo yakho yamanje iyadingeka ngaphambi kokuthi ukuzulazula kuqale.",

      metre:
        "{{count}} m",

      minute:
        "{{count}} imiz.",

      hour:
        "{{count}} ihora",

      hourMinutes:
        "{{hours}} ihora {{minutes}} imiz.",

      theFacility:
        "isikhungo",

      startOn:
        "Qala ku-{{road}}",

      startCurrentLocation:
        "Qala endaweni yakho yamanje",

      arriveAt:
        "Fika e-{{destination}}",

      roundaboutRoad:
        "Ngena eroundabout bese uqhubeka ku-{{road}}",

      roundabout:
        "Ngena eroundabout",

      merge:
        "Joyina umzila{{direction}}{{road}}",

      keep:
        "Qhubeka {{direction}}{{road}}",

      ramp:
        "Thatha irampu {{direction}}{{road}}",

      exit:
        "Thatha indawo yokuphuma {{direction}}{{road}}",

      continueStraight:
        "Qhubeka uqonde{{road}}",

      turn:
        "Jikela {{direction}}{{road}}",

      continue:
        "Qhubeka {{direction}}{{road}}",

      continueOnto:
        "Qhubeka ku-{{road}}",

      ahead:
        "phambili",

      ontoRoad:
        " ku-{{road}}",
    },
  },
};

export const patientExperienceResources = {
  en: {
    translation:
      enExperience,
  },

  zu: {
    translation:
      zuExperience,
  },
};

export default patientExperienceResources;
