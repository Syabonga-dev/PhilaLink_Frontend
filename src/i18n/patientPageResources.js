const en = {
  medications: {
    title: "My Medications",
    loadingPrescriptions: "Loading your prescriptions...",
    activePrescriptionCount_one: "{{count}} active prescription",
    activePrescriptionCount_other: "{{count}} active prescriptions",
    refresh: "Refresh",
    loadError: "We could not load your medications.",
    supplyTemporaryUnavailable:
      "Medication supply information is temporarily unavailable.",
    takenMessage:
      "Medication marked as taken. Your remaining supply has been recalculated.",
    skippedMessage:
      "Medication marked as skipped.",
    updateError:
      "We could not update this medication.",

    noMedicationsTitle:
      "No medications on record",
    noMedicationsBody:
      "There are currently no medications linked to your patient profile.",

    medication: "Medication",
    active: "Active",
    inactive: "Inactive",
    ended: "Ended",
    upcoming: "Upcoming",

    noInstructions:
      "No instructions recorded",

    doseProgressSummary:
      "{{taken}} of {{scheduled}} scheduled {{doseWord}} marked as taken today",

    loadingSupply:
      "Loading supply",

    todaysDosesComplete:
      "Today's doses complete",

    medicationSupply:
      "Medication supply",

    loadingSupplyInformation:
      "Loading medication supply information...",

    supplyUnavailable:
      "Supply unavailable",

    supplyInformationUnavailable:
      "Supply information is not available yet.",

    supplyDepleted:
      "Supply depleted",

    dayRemaining:
      "1 day remaining",

    daysRemaining:
      "{{count}} days remaining",

    estimatedSupplyText:
      "Estimated from your latest completed collection, active dosing schedule and doses you have marked as taken.",

    doseAmountNeeded:
      "Dose amount needed",

    missingUnitsText:
      "Your dispensed quantity is recorded, but units per dose have not been captured yet.",

    scheduleNeeded:
      "Schedule needed",

    missingScheduleText:
      "Your dispensed quantity is recorded, but no active dosing schedule is available.",

    noCollectedSupply:
      "No collected supply",

    noCompletedCollectionText:
      "No completed medication collection has been recorded for this medication.",

    supplyCalculationFailed:
      "Supply information could not be calculated.",

    dispensed:
      "Dispensed",

    remaining:
      "Remaining",

    daysLeft:
      "Days left",

    dosesPerDay:
      "Doses/day",

    lastCollected:
      "Last collected {{date}}",

    unitsPerDose_one:
      "{{count}} unit per dose",

    unitsPerDose_other:
      "{{count}} units per dose",

    trySupplyAgain:
      "Try supply again",

    form:
      "Form",

    condition:
      "Condition",

    prescribedBy:
      "Prescribed by",

    schedule:
      "Schedule",

    noScheduleRecorded:
      "No schedule recorded",

    startDate:
      "Start date",

    endDate:
      "End date",

    notRecorded:
      "Not recorded",

    latestAdherence:
      "Latest adherence entry",

    taken:
      "Taken",

    skipped:
      "Skipped",

    startsOn:
      "This medication starts on {{date}}. Dose logging will become available once the medication has started.",

    noActiveScheduleMessage:
      "No active dosing schedule has been recorded for this medication. Contact your clinic before logging a dose.",

    notCollectedTitle:
      "Medication has not been collected yet",

    notCollectedBody:
      "You can view this prescription and its schedule, but you cannot mark a dose as taken until a completed medication collection has been recorded.",

    doseAmountConfigurationTitle:
      "Dose amount needs to be configured",

    doseAmountConfigurationBody:
      "Your clinic must record the number of medication units used per dose before Taken doses can be logged.",

    supplyDepletedTitle:
      "Recorded medication supply is depleted",

    supplyDepletedBody:
      "There is not enough recorded medication remaining for another dose. A new medication collection must be completed before another Taken dose can be recorded.",

    supplyVerificationUnavailable:
      "Medication supply could not be verified. Taken-dose logging is temporarily unavailable.",

    scheduledDosesCompleteTitle:
      "Today's scheduled doses are complete",

    scheduledDosesCompleteBody:
      "You have marked all {{count}} scheduled {{doseWord}} as taken today. Another Taken entry cannot be recorded until the next day.",

    todaysDoseProgress:
      "Today's dose progress",

    doseProgress:
      "{{taken}} of {{scheduled}} scheduled {{doseWord}} marked as taken.",

    dosesLeft_one:
      "{{count}} dose left",

    dosesLeft_other:
      "{{count}} doses left",

    takenToday_one:
      "{{count}} dose taken today",

    takenToday_other:
      "{{count}} doses taken today",

    skippedToday_one:
      "{{count}} dose skipped",

    skippedToday_other:
      "{{count}} doses skipped",

    updating:
      "Updating...",

    notStartedYet:
      "Not started yet",

    noActiveSchedule:
      "No active schedule",

    checkingSupply:
      "Checking supply...",

    markAsTaken:
      "Mark as taken",

    skipDose:
      "Skip dose",

    todaysSchedule:
      "Today's schedule",

    complete:
      "Complete",

    scheduleTaken:
      "{{taken}} of {{scheduled}} taken today",

    activeMedications:
      "Active medications",

    noActiveMedications:
      "No active medications.",

    previousMedications:
      "Previous medications",
  },

  appointments: {
    title: "Appointments",

    subtitle:
      "Book a clinic visit and choose whether you want to see a Nurse or Doctor.",

    refresh:
      "Refresh",

    bookAppointment:
      "Book appointment",

    bookAnAppointment:
      "Book an appointment",

    booking:
      "Booking...",

    appointment:
      "Appointment",

    clinicProvider:
      "Clinic provider",

    dateUnavailable:
      "Date not available",

    notes:
      "Notes",

    reschedule:
      "Reschedule",

    cancel:
      "Cancel",

    loadError:
      "We could not load your appointments.",

    bookingError:
      "We could not book your appointment.",

    rescheduleError:
      "We could not reschedule this appointment.",

    cancellationError:
      "We could not cancel this appointment.",

    futureDateRequired:
      "Please choose a future appointment date and time.",

    futureRescheduleRequired:
      "Choose a future appointment date and time.",

    reasonRequired:
      "Please enter the reason for your appointment.",

    bookingTitle:
      "Book appointment",

    bookingDescription:
      "Choose the service and whether you want to see a Nurse or Doctor.",

    appointmentType:
      "Appointment type",

    providerQuestion:
      "Who do you want to see?",

    dateAndTime:
      "Date and time",

    reason:
      "Reason",

    visitMode:
      "Visit mode",

    duration:
      "Duration",

    optionalNotes:
      "Notes (optional)",

    inPerson:
      "In person",

    telehealth:
      "Telehealth",

    nurse:
      "Nurse",

    doctor:
      "Doctor",

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

    other:
      "Other",

    defaultReason:
      "Routine patient checkup",

    minutes:
      "{{count}} minutes",

    rescheduleTitle:
      "Reschedule appointment",

    newDateTime:
      "New date and time",

    confirmReschedule:
      "Confirm reschedule",

    cancelTitle:
      "Cancel appointment",

    cancelQuestion:
      "Are you sure you want to cancel your {{type}} on {{date}}?",

    keepAppointment:
      "Keep appointment",

    cancelAppointment:
      "Cancel appointment",

    cancelling:
      "Cancelling...",

    saving:
      "Saving...",

    upcoming:
      "Upcoming",

    past:
      "Past",

    upcomingCount:
      "Upcoming ({{count}})",

    pastCount:
      "Past ({{count}})",

    noUpcoming:
      "No upcoming appointments",

    noPrevious:
      "No previous appointments",

    scheduled:
      "Scheduled",

    confirmed:
      "Confirmed",

    pending:
      "Pending",

    completed:
      "Completed",

    cancelled:
      "Cancelled",

    rescheduled:
      "Rescheduled",

    missed:
      "Missed",

    close:
      "Close",
  },

  records: {
    title:
      "Health Records",

    loading:
      "Loading your clinical records...",

    recordCount_one:
      "{{count}} record on file",

    recordCount_other:
      "{{count}} records on file",

    refresh:
      "Refresh",

    loadError:
      "We could not load your health records.",

    allRecords:
      "All records",

    consultations:
      "Consultations",

    laboratory:
      "Laboratory",

    medication:
      "Medication",

    observations:
      "Observations",

    searchPlaceholder:
      "Search health records",

    noRecordsFound:
      "No records found",

    noRecordsFoundBody:
      "Try changing your search or filter.",

    noRecordsYet:
      "No health records yet",

    noRecordsYetBody:
      "Your clinical records will appear here when they are added by your healthcare team.",

    healthRecord:
      "Health record",

    healthcareProvider:
      "Healthcare provider",

    available:
      "Available",

    completed:
      "Completed",

    final:
      "Final",

    pending:
      "Pending",

    draft:
      "Draft",

    record:
      "Record",

    dateUnavailable:
      "Date unavailable",

    clinicalSummary:
      "Clinical summary",

    noSummary:
      "No clinical summary was recorded.",

    category:
      "Category",
  },

  clinics: {
    title:
      "Nearby Clinics & Hospitals",

    subtitle:
      "Healthcare facilities within {{radius}} km of your current location.",

    loadError:
      "We could not load clinics and hospitals.",

    tryAgain:
      "Try again",

    hoursUnavailable:
      "Hours unavailable",

    open:
      "Open",

    closed:
      "Closed",

    locationUnavailable:
      "Location unavailable.",

    locationDenied:
      "Location access denied. Enable location access in your browser settings to find nearby facilities.",

    locationPositionUnavailable:
      "Your current location could not be determined.",

    locationTimeout:
      "Location request timed out. Please try again.",

    locationUnsupported:
      "Location services are not supported by this browser.",

    locationRequired:
      "Location required",

    allowLocation:
      "Allow location access to find clinics and hospitals near you.",

    allowLocationRadius:
      "Allow location access to find clinics and hospitals within {{radius}} km.",

    useMyLocation:
      "Use my location",

    locating:
      "Locating...",

    navigatingTo:
      "Navigating to {{name}}",

    facilitiesWithin_one:
      "{{count}} facility within {{radius}} km",

    facilitiesWithin_other:
      "{{count}} facilities within {{radius}} km",

    facilitiesSorted:
      "Facilities are sorted nearest first.",

    navigationMapMessage:
      "Only your current position and destination are shown while navigating.",

    recenter:
      "Recenter",

    end:
      "End",

    arrived:
      "You have arrived",

    continueRoute:
      "Continue on your route",

    updatingRoute:
      "Updating route",

    eta:
      "ETA",

    remaining:
      "Remaining",

    yourLocation:
      "Your location",

    gpsAccuracy:
      "GPS accuracy: {{value}} m",

    kmAway:
      "{{distance}} km away",

    startNavigation:
      "Start navigation",

    endNavigation:
      "End navigation",

    destination:
      "Destination",

    navigation:
      "Navigation",

    distance:
      "Distance",

    calculatingRoute:
      "Calculating route...",

    withinRadius:
      "Within {{radius}} km",

    nearbyFacilities_one:
      "{{count}} nearby facility",

    nearbyFacilities_other:
      "{{count}} nearby facilities",

    waitingForLocation:
      "Waiting for location",

    searchPlaceholder:
      "Search clinics or hospitals",

    noFacilities:
      "No facilities found",

    noFacilitiesBody:
      "No clinics or hospitals in PhilaLink were found within {{radius}} km of your current location.",

    navigating:
      "Navigating",

    coordinatesRequired:
      "Valid coordinates are required for navigation.",

    routeCalculationFailed:
      "The navigation route could not be calculated.",

    routeNotFound:
      "No driving route was found to this facility.",

    routeGeometryInvalid:
      "The route did not contain enough map information.",

    navigationUnavailable:
      "Navigation is currently unavailable.",

    currentLocationRequired:
      "Your current location is required before navigation can begin.",

    metre:
      "{{count}} m",

    minute:
      "{{count}} min",

    hour:
      "{{count}} hr",

    hourMinutes:
      "{{hours}} hr {{minutes}} min",

    theFacility:
      "the facility",

    startOn:
      "Start on {{road}}",

    startCurrentLocation:
      "Start from your current location",

    arriveAt:
      "Arrive at {{destination}}",

    roundaboutRoad:
      "Enter the roundabout and continue onto {{road}}",

    roundabout:
      "Enter the roundabout",

    merge:
      "Merge{{direction}}{{road}}",

    keep:
      "Keep {{direction}}{{road}}",

    ramp:
      "Take the ramp{{direction}}{{road}}",

    exit:
      "Take the exit{{direction}}{{road}}",

    continueStraight:
      "Continue straight{{road}}",

    turn:
      "Turn {{direction}}{{road}}",

    continue:
      "Continue{{direction}}{{road}}",

    continueOnto:
      "Continue onto {{road}}",

    ahead:
      "ahead",

    ontoRoad:
      " onto {{road}}",
  },
};

function mergeLanguage(
  overrides
) {
  return {
    medications: {
      ...en.medications,
      ...(overrides.medications ||
        {}),
    },

    appointments: {
      ...en.appointments,
      ...(overrides.appointments ||
        {}),
    },

    records: {
      ...en.records,
      ...(overrides.records ||
        {}),
    },

    clinics: {
      ...en.clinics,
      ...(overrides.clinics ||
        {}),
    },
  };
}

const zu =
  mergeLanguage({
    medications: {
      title:
        "Imithi Yami",
      loadingPrescriptions:
        "Kulayishwa imithi yakho...",
      refresh:
        "Vuselela",
      loadError:
        "Asikwazanga ukulayisha imithi yakho.",
      noMedicationsTitle:
        "Ayikho imithi erekhodiwe",
      noMedicationsBody:
        "Okwamanje ayikho imithi exhunywe kuphrofayela yakho yesiguli.",
      medication:
        "Umuthi",
      active:
        "Iyasebenza",
      inactive:
        "Ayisebenzi",
      ended:
        "Iphelile",
      upcoming:
        "Ezayo",
      noInstructions:
        "Ayikho imiyalelo erekhodiwe",
      medicationSupply:
        "Imithi esele",
      dispensed:
        "Enikeziwe",
      remaining:
        "Eseleyo",
      daysLeft:
        "Izinsuku ezisele",
      dosesPerDay:
        "Imithamo/ngosuku",
      form:
        "Uhlobo",
      condition:
        "Isimo sempilo",
      prescribedBy:
        "Inikezwe ngu",
      schedule:
        "Uhlelo",
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
      taken:
        "Ithathiwe",
      skipped:
        "Yeqiwe",
      todaysDoseProgress:
        "Inqubekela-phambili yemithamo yanamuhla",
      updating:
        "Kuyabuyekezwa...",
      markAsTaken:
        "Maka njengethathiwe",
      skipDose:
        "Yeqa umthamo",
      todaysSchedule:
        "Uhlelo lwanamuhla",
      complete:
        "Kuphelele",
      activeMedications:
        "Imithi esebenzayo",
      noActiveMedications:
        "Ayikho imithi esebenzayo.",
      previousMedications:
        "Imithi yangaphambilini",
      trySupplyAgain:
        "Zama futhi",
    },

    appointments: {
      title:
        "Izikhathi Zokubonana",
      subtitle:
        "Bhuka ukuvakashela umtholampilo bese ukhetha ukuthi ufuna ukubona uMhlengikazi noma uDokotela.",
      refresh:
        "Vuselela",
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
      notes:
        "Amanothi",
      reschedule:
        "Hlela kabusha",
      cancel:
        "Khansela",
      appointmentType:
        "Uhlobo lokubonana",
      providerQuestion:
        "Ufuna ukubona bani?",
      dateAndTime:
        "Usuku nesikhathi",
      reason:
        "Isizathu",
      visitMode:
        "Indlela yokubonana",
      duration:
        "Ubude besikhathi",
      optionalNotes:
        "Amanothi (uma kudingeka)",
      inPerson:
        "Ngokwenyama",
      telehealth:
        "Ukubonana nge-inthanethi",
      nurse:
        "Umhlengikazi",
      doctor:
        "Udokotela",
      upcoming:
        "Ezizayo",
      past:
        "Ezidlule",
      noUpcoming:
        "Azikho izikhathi zokubonana ezizayo",
      noPrevious:
        "Azikho izikhathi zangaphambilini",
      confirmed:
        "Kuqinisekisiwe",
      pending:
        "Kusalindile",
      completed:
        "Kuqediwe",
      cancelled:
        "Kukhanseliwe",
      rescheduled:
        "Kuhlelwe kabusha",
      scheduled:
        "Kuhleliwe",
      close:
        "Vala",
      keepAppointment:
        "Gcina isikhathi",
      cancelAppointment:
        "Khansela isikhathi",
    },

    records: {
      title:
        "Amarekhodi Ezempilo",
      loading:
        "Kulayishwa amarekhodi akho ezempilo...",
      refresh:
        "Vuselela",
      loadError:
        "Asikwazanga ukulayisha amarekhodi akho ezempilo.",
      allRecords:
        "Wonke amarekhodi",
      consultations:
        "Ukubonana",
      laboratory:
        "Ilabhorethri",
      medication:
        "Imithi",
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
      healthcareProvider:
        "Umhlinzeki wezempilo",
      clinicalSummary:
        "Isifinyezo sezokwelapha",
      category:
        "Isigaba",
      dateUnavailable:
        "Usuku alutholakali",
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
      open:
        "Kuvuliwe",
      closed:
        "Kuvaliwe",
      locationUnavailable:
        "Indawo ayitholakali.",
      locationDenied:
        "Ukufinyelela endaweni kwenqatshiwe. Vumela indawo kuzilungiselelo zesiphequluli sakho.",
      locationRequired:
        "Indawo iyadingeka",
      useMyLocation:
        "Sebenzisa indawo yami",
      locating:
        "Kutholwa indawo...",
      navigatingTo:
        "Kuya ku-{{name}}",
      facilitiesSorted:
        "Izikhungo zihlelwe ngokusondela.",
      recenter:
        "Buyisela phakathi",
      end:
        "Qeda",
      arrived:
        "Usufikile",
      continueRoute:
        "Qhubeka nomzila wakho",
      updatingRoute:
        "Kubuyekezwa umzila",
      remaining:
        "Okusele",
      yourLocation:
        "Indawo yakho",
      startNavigation:
        "Qala ukuzulazula",
      endNavigation:
        "Qeda ukuzulazula",
      destination:
        "Indawo oya kuyo",
      navigation:
        "Ukuzulazula",
      distance:
        "Ibanga",
      calculatingRoute:
        "Kubalwa umzila...",
      waitingForLocation:
        "Kulindwe indawo",
      searchPlaceholder:
        "Sesha imitholampilo noma izibhedlela",
      noFacilities:
        "Azikho izikhungo ezitholakele",
      navigating:
        "Kuyazulazulwa",
    },
  });

const xh =
  mergeLanguage({
    medications: {
      title:
        "Amayeza Am",
      loadingPrescriptions:
        "Kulayishwa amayeza akho...",
      refresh:
        "Hlaziya",
      loadError:
        "Asikwazanga kulayisha amayeza akho.",
      noMedicationsTitle:
        "Akukho mayeza arekhodiweyo",
      noMedicationsBody:
        "Okwangoku akukho mayeza adityaniswe neprofayile yakho yesigulana.",
      medication:
        "Iyeza",
      active:
        "Liyasebenza",
      inactive:
        "Alisebenzi",
      ended:
        "Liphelile",
      upcoming:
        "Lizayo",
      noInstructions:
        "Akukho miyalelo irekhodiweyo",
      medicationSupply:
        "Amayeza aseleyo",
      dispensed:
        "Anikiweyo",
      remaining:
        "Aseleyo",
      daysLeft:
        "Iintsuku eziseleyo",
      dosesPerDay:
        "Amathamo/ngosuku",
      form:
        "Uhlobo",
      condition:
        "Imeko",
      prescribedBy:
        "Amiselwe ngu",
      schedule:
        "Ishedyuli",
      noScheduleRecorded:
        "Akukho shedyuli irekhodiweyo",
      startDate:
        "Umhla wokuqala",
      endDate:
        "Umhla wokuphela",
      notRecorded:
        "Ayirekhodwanga",
      latestAdherence:
        "Ukulandela amayeza kwakutshanje",
      taken:
        "Lithathiwe",
      skipped:
        "Litsityiwe",
      todaysDoseProgress:
        "Inkqubela yamathamo anamhlanje",
      updating:
        "Kuyahlaziywa...",
      markAsTaken:
        "Phawula njengelithathiweyo",
      skipDose:
        "Tsiba ithamo",
      todaysSchedule:
        "Ishedyuli yanamhlanje",
      complete:
        "Igqityiwe",
      activeMedications:
        "Amayeza asebenzayo",
      noActiveMedications:
        "Akukho mayeza asebenzayo.",
      previousMedications:
        "Amayeza angaphambili",
      trySupplyAgain:
        "Zama kwakhona",
    },

    appointments: {
      title:
        "Iidinga",
      subtitle:
        "Bhukisha utyelelo lwekliniki uze ukhethe ukuba ufuna ukubona uMongikazi okanye uGqirha.",
      refresh:
        "Hlaziya",
      bookAppointment:
        "Bhukisha idinga",
      bookAnAppointment:
        "Bhukisha idinga",
      booking:
        "Kuyabhukishwa...",
      appointment:
        "Idinga",
      clinicProvider:
        "Umboneleli wekliniki",
      notes:
        "Amanqaku",
      reschedule:
        "Cwangcisa kwakhona",
      cancel:
        "Rhoxisa",
      appointmentType:
        "Uhlobo lwedinga",
      providerQuestion:
        "Ufuna ukubona bani?",
      dateAndTime:
        "Umhla nexesha",
      reason:
        "Isizathu",
      visitMode:
        "Indlela yotyelelo",
      duration:
        "Ubude bexesha",
      optionalNotes:
        "Amanqaku (ukuba uyafuna)",
      inPerson:
        "Ngobuqu",
      telehealth:
        "Ngomnxeba/Intanethi",
      nurse:
        "UMongikazi",
      doctor:
        "UGqirha",
      upcoming:
        "Ezizayo",
      past:
        "Ezidlulileyo",
      noUpcoming:
        "Akukho zidinga zizayo",
      noPrevious:
        "Akukho zidinga zangaphambili",
      confirmed:
        "Kuqinisekisiwe",
      pending:
        "Kusalindelwe",
      completed:
        "Kugqityiwe",
      cancelled:
        "Kurhoxisiwe",
      rescheduled:
        "Kucwangciswe kwakhona",
      scheduled:
        "Kucwangcisiwe",
      close:
        "Vala",
      keepAppointment:
        "Gcina idinga",
      cancelAppointment:
        "Rhoxisa idinga",
    },

    records: {
      title:
        "Iirekhodi Zempilo",
      loading:
        "Kulayishwa iirekhodi zakho zonyango...",
      refresh:
        "Hlaziya",
      loadError:
        "Asikwazanga kulayisha iirekhodi zakho zempilo.",
      allRecords:
        "Zonke iirekhodi",
      consultations:
        "Ukubonana",
      laboratory:
        "Ilabhoratri",
      medication:
        "Amayeza",
      observations:
        "Uqwalaselo",
      searchPlaceholder:
        "Khangela iirekhodi zempilo",
      noRecordsFound:
        "Akukho rekhodi lifunyenweyo",
      noRecordsFoundBody:
        "Zama ukutshintsha uphendlo okanye isihluzo.",
      noRecordsYet:
        "Akukho rekhodi zempilo okwangoku",
      healthcareProvider:
        "Umboneleli wezempilo",
      clinicalSummary:
        "Isishwankathelo sonyango",
      category:
        "Udidi",
      dateUnavailable:
        "Umhla awufumaneki",
    },

    clinics: {
      title:
        "Iikliniki Nezibhedlele Ezikufutshane",
      subtitle:
        "Amaziko ezempilo angaphakathi kwe-{{radius}} km ukusuka kwindawo yakho yangoku.",
      loadError:
        "Asikwazanga kulayisha iikliniki nezibhedlele.",
      tryAgain:
        "Zama kwakhona",
      hoursUnavailable:
        "Iiyure azifumaneki",
      open:
        "Ivuliwe",
      closed:
        "Ivaliwe",
      locationUnavailable:
        "Indawo ayifumaneki.",
      locationDenied:
        "Ukufikelela kwindawo kwaliwe. Vumela indawo kwiisetingi zesikhangeli sakho.",
      locationRequired:
        "Indawo iyafuneka",
      useMyLocation:
        "Sebenzisa indawo yam",
      locating:
        "Kufunyanwa indawo...",
      navigatingTo:
        "Kuyiwa e-{{name}}",
      facilitiesSorted:
        "Amaziko ahlelwe ngawo akufutshane kuqala.",
      recenter:
        "Buyisela embindini",
      end:
        "Phelisa",
      arrived:
        "Ufikile",
      continueRoute:
        "Qhubeka ngendlela yakho",
      updatingRoute:
        "Kuhlaziywa indlela",
      remaining:
        "Okuseleyo",
      yourLocation:
        "Indawo yakho",
      startNavigation:
        "Qala ukukhokelwa",
      endNavigation:
        "Phelisa ukukhokelwa",
      destination:
        "Indawo oya kuyo",
      navigation:
        "Ukukhokelwa",
      distance:
        "Umgama",
      calculatingRoute:
        "Kubalwa indlela...",
      waitingForLocation:
        "Kulindwe indawo",
      searchPlaceholder:
        "Khangela iikliniki okanye izibhedlele",
      noFacilities:
        "Akukho maziko afunyenweyo",
      navigating:
        "Kuyakhokelwa",
    },
  });

const af =
  mergeLanguage({
    medications: {
      title:
        "My Medikasie",
      loadingPrescriptions:
        "Jou voorskrifte laai...",
      refresh:
        "Verfris",
      loadError:
        "Ons kon nie jou medikasie laai nie.",
      noMedicationsTitle:
        "Geen medikasie op rekord nie",
      noMedicationsBody:
        "Daar is tans geen medikasie aan jou pasiëntprofiel gekoppel nie.",
      medication:
        "Medikasie",
      active:
        "Aktief",
      inactive:
        "Onaktief",
      ended:
        "Beëindig",
      upcoming:
        "Komende",
      noInstructions:
        "Geen instruksies aangeteken nie",
      medicationSupply:
        "Medikasievoorraad",
      dispensed:
        "Uitgereik",
      remaining:
        "Oorblywend",
      daysLeft:
        "Dae oor",
      dosesPerDay:
        "Dosisse/dag",
      form:
        "Vorm",
      condition:
        "Toestand",
      prescribedBy:
        "Voorgeskryf deur",
      schedule:
        "Skedule",
      noScheduleRecorded:
        "Geen skedule aangeteken nie",
      startDate:
        "Begindatum",
      endDate:
        "Einddatum",
      notRecorded:
        "Nie aangeteken nie",
      latestAdherence:
        "Jongste nakomingsinskrywing",
      taken:
        "Geneem",
      skipped:
        "Oorgeslaan",
      todaysDoseProgress:
        "Vandag se dosisvordering",
      updating:
        "Werk by...",
      markAsTaken:
        "Merk as geneem",
      skipDose:
        "Slaan dosis oor",
      todaysSchedule:
        "Vandag se skedule",
      complete:
        "Voltooi",
      activeMedications:
        "Aktiewe medikasie",
      noActiveMedications:
        "Geen aktiewe medikasie nie.",
      previousMedications:
        "Vorige medikasie",
      trySupplyAgain:
        "Probeer voorraad weer",
    },

    appointments: {
      title:
        "Afsprake",
      subtitle:
        "Bespreek 'n kliniekbesoek en kies of jy 'n Verpleegkundige of Dokter wil sien.",
      refresh:
        "Verfris",
      bookAppointment:
        "Bespreek afspraak",
      bookAnAppointment:
        "Bespreek 'n afspraak",
      booking:
        "Bespreek...",
      appointment:
        "Afspraak",
      clinicProvider:
        "Kliniekverskaffer",
      notes:
        "Notas",
      reschedule:
        "Herskeduleer",
      cancel:
        "Kanselleer",
      appointmentType:
        "Tipe afspraak",
      providerQuestion:
        "Wie wil jy sien?",
      dateAndTime:
        "Datum en tyd",
      reason:
        "Rede",
      visitMode:
        "Besoekmodus",
      duration:
        "Duur",
      optionalNotes:
        "Notas (opsioneel)",
      inPerson:
        "Persoonlik",
      telehealth:
        "Telehealth",
      nurse:
        "Verpleegkundige",
      doctor:
        "Dokter",
      upcoming:
        "Komende",
      past:
        "Verlede",
      noUpcoming:
        "Geen komende afsprake nie",
      noPrevious:
        "Geen vorige afsprake nie",
      confirmed:
        "Bevestig",
      pending:
        "Hangende",
      completed:
        "Voltooi",
      cancelled:
        "Gekanselleer",
      rescheduled:
        "Herskeduleer",
      scheduled:
        "Geskeduleer",
      keepAppointment:
        "Behou afspraak",
      cancelAppointment:
        "Kanselleer afspraak",
    },

    records: {
      title:
        "Gesondheidsrekords",
      loading:
        "Jou kliniese rekords laai...",
      refresh:
        "Verfris",
      loadError:
        "Ons kon nie jou gesondheidsrekords laai nie.",
      allRecords:
        "Alle rekords",
      consultations:
        "Konsultasies",
      laboratory:
        "Laboratorium",
      medication:
        "Medikasie",
      observations:
        "Waarnemings",
      searchPlaceholder:
        "Soek gesondheidsrekords",
      noRecordsFound:
        "Geen rekords gevind nie",
      noRecordsFoundBody:
        "Probeer jou soektog of filter verander.",
      noRecordsYet:
        "Nog geen gesondheidsrekords nie",
      healthcareProvider:
        "Gesondheidsorgverskaffer",
      clinicalSummary:
        "Kliniese opsomming",
      category:
        "Kategorie",
      dateUnavailable:
        "Datum nie beskikbaar nie",
    },

    clinics: {
      title:
        "Nabygeleë Klinieke & Hospitale",
      subtitle:
        "Gesondheidsfasiliteite binne {{radius}} km van jou huidige ligging.",
      loadError:
        "Ons kon nie klinieke en hospitale laai nie.",
      tryAgain:
        "Probeer weer",
      hoursUnavailable:
        "Ure nie beskikbaar nie",
      open:
        "Oop",
      closed:
        "Gesluit",
      locationUnavailable:
        "Ligging nie beskikbaar nie.",
      locationDenied:
        "Liggingstoegang is geweier. Aktiveer ligging in jou blaaierinstellings.",
      locationRequired:
        "Ligging benodig",
      useMyLocation:
        "Gebruik my ligging",
      locating:
        "Ligging word bepaal...",
      navigatingTo:
        "Navigeer na {{name}}",
      facilitiesSorted:
        "Fasiliteite is naaste eerste gesorteer.",
      recenter:
        "Hersentreer",
      end:
        "Beëindig",
      arrived:
        "Jy het aangekom",
      continueRoute:
        "Gaan voort op jou roete",
      updatingRoute:
        "Roete word opgedateer",
      remaining:
        "Oorblywend",
      yourLocation:
        "Jou ligging",
      startNavigation:
        "Begin navigasie",
      endNavigation:
        "Beëindig navigasie",
      destination:
        "Bestemming",
      navigation:
        "Navigasie",
      distance:
        "Afstand",
      calculatingRoute:
        "Roete word bereken...",
      waitingForLocation:
        "Wag vir ligging",
      searchPlaceholder:
        "Soek klinieke of hospitale",
      noFacilities:
        "Geen fasiliteite gevind nie",
      navigating:
        "Navigeer",
    },
  });

const nso =
  mergeLanguage({
    medications: {
      title:
        "Dihlare tša Ka",
      refresh:
        "Mpshafatša",
      active:
        "E a šoma",
      inactive:
        "Ga e šome",
      schedule:
        "Lenaneo",
      startDate:
        "Letšatši la go thoma",
      endDate:
        "Letšatši la mafelelo",
      taken:
        "E tšerwe",
      skipped:
        "E tshetšwe",
      todaysSchedule:
        "Lenaneo la lehono",
      activeMedications:
        "Dihlare tše di šomago",
      previousMedications:
        "Dihlare tša peleng",
    },

    appointments: {
      title:
        "Dipeeletšo",
      refresh:
        "Mpshafatša",
      bookAppointment:
        "Beakanya kopano",
      nurse:
        "Mooki",
      doctor:
        "Ngaka",
      upcoming:
        "Tše di tlago",
      past:
        "Tša peleng",
      cancel:
        "Khansela",
      reschedule:
        "Beakanya gape",
    },

    records: {
      title:
        "Direkhoto tša Maphelo",
      refresh:
        "Mpshafatša",
      allRecords:
        "Direkhoto ka moka",
      laboratory:
        "Laboratori",
      medication:
        "Dihlare",
      searchPlaceholder:
        "Nyaka direkhoto tša maphelo",
      category:
        "Legoro",
    },

    clinics: {
      title:
        "Dikliniki le Dipetlele tša Kgauswi",
      open:
        "E bulegile",
      closed:
        "E tswaletšwe",
      locationRequired:
        "Lefelo le a nyakega",
      useMyLocation:
        "Diriša lefelo la ka",
      startNavigation:
        "Thoma tsela",
      endNavigation:
        "Fetša tsela",
      distance:
        "Sekgala",
      searchPlaceholder:
        "Nyaka dikliniki goba dipetlele",
    },
  });

const tn =
  mergeLanguage({
    medications: {
      title:
        "Melemo ya Me",
      refresh:
        "Ntšhwafatsa",
      active:
        "E a dira",
      inactive:
        "Ga e dire",
      schedule:
        "Thulaganyo",
      startDate:
        "Letlha la go simolola",
      endDate:
        "Letlha la bofelo",
      taken:
        "E tserwe",
      skipped:
        "E tlodilwe",
      todaysSchedule:
        "Thulaganyo ya gompieno",
      activeMedications:
        "Melemo e e dirang",
      previousMedications:
        "Melemo ya pele",
    },

    appointments: {
      title:
        "Dipeelo",
      refresh:
        "Ntšhwafatsa",
      bookAppointment:
        "Beela kopano",
      nurse:
        "Mooki",
      doctor:
        "Ngaka",
      upcoming:
        "Tse di tlang",
      past:
        "Tsa pele",
      cancel:
        "Khansela",
      reschedule:
        "Rulaganya gape",
    },

    records: {
      title:
        "Direkoto tsa Boitekanelo",
      refresh:
        "Ntšhwafatsa",
      allRecords:
        "Direkoto tsotlhe",
      laboratory:
        "Laboratori",
      medication:
        "Melemo",
      searchPlaceholder:
        "Batla direkoto tsa boitekanelo",
      category:
        "Mofuta",
    },

    clinics: {
      title:
        "Ditleliniki le Dipetlele tse di Gaufi",
      open:
        "E butswe",
      closed:
        "E tswetswe",
      locationRequired:
        "Lefelo le a tlhokega",
      useMyLocation:
        "Dirisa lefelo la me",
      startNavigation:
        "Simolola tsela",
      endNavigation:
        "Fetsa tsela",
      distance:
        "Sekgala",
      searchPlaceholder:
        "Batla ditleliniki kgotsa dipetlele",
    },
  });

const st =
  mergeLanguage({
    medications: {
      title:
        "Meriana ea Ka",
      refresh:
        "Ntlafatsa",
      active:
        "E sebetsa",
      inactive:
        "Ha e sebetse",
      schedule:
        "Lenaneo",
      startDate:
        "Letsatsi la ho qala",
      endDate:
        "Letsatsi la ho qetela",
      taken:
        "E nkuoe",
      skipped:
        "E tlotsoe",
      todaysSchedule:
        "Lenaneo la kajeno",
      activeMedications:
        "Meriana e sebetsang",
      previousMedications:
        "Meriana ea pele",
    },

    appointments: {
      title:
        "Likopano",
      refresh:
        "Ntlafatsa",
      bookAppointment:
        "Behela kopano",
      nurse:
        "Mooki",
      doctor:
        "Ngaka",
      upcoming:
        "Tse tlang",
      past:
        "Tse fetileng",
      cancel:
        "Hlakola",
      reschedule:
        "Rera hape",
    },

    records: {
      title:
        "Lirekoto tsa Bophelo",
      refresh:
        "Ntlafatsa",
      allRecords:
        "Lirekoto tsohle",
      laboratory:
        "Laboratori",
      medication:
        "Meriana",
      searchPlaceholder:
        "Batla lirekoto tsa bophelo",
      category:
        "Sehlopha",
    },

    clinics: {
      title:
        "Ditleliniki le Lipetlele tse Haufi",
      open:
        "E butsoe",
      closed:
        "E koetsoe",
      locationRequired:
        "Sebaka sea hlokahala",
      useMyLocation:
        "Sebelisa sebaka sa ka",
      startNavigation:
        "Qala tataiso",
      endNavigation:
        "Emisa tataiso",
      distance:
        "Sebaka",
      searchPlaceholder:
        "Batla ditleliniki kapa lipetlele",
    },
  });

const ts =
  mergeLanguage({
    medications: {
      title:
        "Mirhi ya Mina",
      refresh:
        "Pfuxeta",
      active:
        "Ya tirha",
      inactive:
        "A yi tirhi",
      schedule:
        "Xiyimiso",
      startDate:
        "Siku ro sungula",
      endDate:
        "Siku ro hetelela",
      taken:
        "Yi tekiwile",
      skipped:
        "Yi tluriwile",
      todaysSchedule:
        "Xiyimiso xa namuntlha",
      activeMedications:
        "Mirhi leyi tirhaka",
      previousMedications:
        "Mirhi ya khale",
    },

    appointments: {
      title:
        "Mihlangano",
      refresh:
        "Pfuxeta",
      bookAppointment:
        "Buka nhlangano",
      nurse:
        "Muongori",
      doctor:
        "Dokodela",
      upcoming:
        "Leyi taka",
      past:
        "Leyi hundzeke",
      cancel:
        "Khansela",
      reschedule:
        "Hlela nakambe",
    },

    records: {
      title:
        "Tirhekhodo ta Rihanyo",
      refresh:
        "Pfuxeta",
      allRecords:
        "Tirhekhodo hinkwato",
      laboratory:
        "Laboratori",
      medication:
        "Mirhi",
      searchPlaceholder:
        "Lava tirhekhodo ta rihanyo",
      category:
        "Ntlawa",
    },

    clinics: {
      title:
        "Tikiliniki ni Swibedlhele swa le Kusuhi",
      open:
        "Yi pfulekile",
      closed:
        "Yi pfariwile",
      locationRequired:
        "Ndhawu ya laveka",
      useMyLocation:
        "Tirhisa ndhawu ya mina",
      startNavigation:
        "Sungula ndlela",
      endNavigation:
        "Hetisa ndlela",
      distance:
        "Mpfhuka",
      searchPlaceholder:
        "Lava tikiliniki kumbe swibedlhele",
    },
  });

const ss =
  mergeLanguage({
    medications: {
      title:
        "Imitsi Yami",
      refresh:
        "Vuselela",
      active:
        "Iyasebenta",
      inactive:
        "Ayisebenti",
      schedule:
        "Luhlelo",
      startDate:
        "Lilanga lekucala",
      endDate:
        "Lilanga lekugcina",
      taken:
        "Itsatsiwe",
      skipped:
        "Yeqiwe",
      todaysSchedule:
        "Luhlelo lwanamuhla",
      activeMedications:
        "Imitsi lesebentako",
      previousMedications:
        "Imitsi yangaphambilini",
    },

    appointments: {
      title:
        "Tikhatsi Tekubonana",
      refresh:
        "Vuselela",
      bookAppointment:
        "Bhukha sikhatsi",
      nurse:
        "Umhlengikati",
      doctor:
        "Dokotela",
      upcoming:
        "Letitako",
      past:
        "Letendlulile",
      cancel:
        "Khansela",
      reschedule:
        "Hlela kabusha",
    },

    records: {
      title:
        "Emarekhodi Emphilo",
      refresh:
        "Vuselela",
      allRecords:
        "Onkhe emarekhodi",
      laboratory:
        "Ilabhorethri",
      medication:
        "Imitsi",
      searchPlaceholder:
        "Sesha emarekhodi emphilo",
      category:
        "Sigaba",
    },

    clinics: {
      title:
        "Emakliniki Netibhedlela Letisedvute",
      open:
        "Kuvulekile",
      closed:
        "Kuvaliwe",
      locationRequired:
        "Indzawo iyadzingeka",
      useMyLocation:
        "Sebentisa indzawo yami",
      startNavigation:
        "Cala kuhamba",
      endNavigation:
        "Cedzela kuhamba",
      distance:
        "Libanga",
      searchPlaceholder:
        "Sesha emakliniki noma tibhedlela",
    },
  });

const ve =
  mergeLanguage({
    medications: {
      title:
        "Mishonga Yanga",
      refresh:
        "Mvusulusani",
      active:
        "I khou shuma",
      inactive:
        "A i shumi",
      schedule:
        "Nzudzanyo",
      startDate:
        "Ḓuvha ḽa u thoma",
      endDate:
        "Ḓuvha ḽa u fhedza",
      taken:
        "Yo dzhiiwa",
      skipped:
        "Yo pfukwa",
      todaysSchedule:
        "Nzudzanyo ya ṋamusi",
      activeMedications:
        "Mishonga i shumaho",
      previousMedications:
        "Mishonga ya kale",
    },

    appointments: {
      title:
        "Mitevhe",
      refresh:
        "Mvusulusani",
      bookAppointment:
        "Vhulungani mutangano",
      nurse:
        "Muongi",
      doctor:
        "Dokotela",
      upcoming:
        "I ḓaho",
      past:
        "Yo fhiraho",
      cancel:
        "Khanselani",
      reschedule:
        "Dzudzanyani hafhu",
    },

    records: {
      title:
        "Rekhodo dza Mutakalo",
      refresh:
        "Mvusulusani",
      allRecords:
        "Rekhodo dzoṱhe",
      laboratory:
        "Laboratori",
      medication:
        "Mishonga",
      searchPlaceholder:
        "Ṱoḓani rekhodo dza mutakalo",
      category:
        "Tshigwada",
    },

    clinics: {
      title:
        "Kiliniki na Vhuongelo zwi re Tsini",
      open:
        "Yo vula",
      closed:
        "Yo vala",
      locationRequired:
        "Fhethu hu a ṱoḓea",
      useMyLocation:
        "Shumisani fhethu hanga",
      startNavigation:
        "Thomani ndila",
      endNavigation:
        "Fhedzisani ndila",
      distance:
        "Tshikhala",
      searchPlaceholder:
        "Ṱoḓani kiliniki kana vhuongelo",
    },
  });

const nr =
  mergeLanguage({
    medications: {
      title:
        "Imithi Yami",
      refresh:
        "Vuselela",
      active:
        "Iyasebenza",
      inactive:
        "Ayisebenzi",
      schedule:
        "Ihlelo",
      startDate:
        "Ilanga lokuthoma",
      endDate:
        "Ilanga lokugcina",
      taken:
        "Ithethwe",
      skipped:
        "Yeqiwe",
      todaysSchedule:
        "Ihlelo lanamhlanje",
      activeMedications:
        "Imithi esebenzako",
      previousMedications:
        "Imithi yangaphambilini",
    },

    appointments: {
      title:
        "Iinkhathi Zokubonana",
      refresh:
        "Vuselela",
      bookAppointment:
        "Bhukha isikhathi",
      nurse:
        "Umhlengikazi",
      doctor:
        "Udokotela",
      upcoming:
        "Ezizako",
      past:
        "Ezidlulileko",
      cancel:
        "Khansela",
      reschedule:
        "Hlela godu",
    },

    records: {
      title:
        "Amarekhodi Wepilo",
      refresh:
        "Vuselela",
      allRecords:
        "Woke amarekhodi",
      laboratory:
        "Ilabhorethri",
      medication:
        "Imithi",
      searchPlaceholder:
        "Sesha amarekhodi wepilo",
      category:
        "Isigaba",
    },

    clinics: {
      title:
        "Iimtholapilo Neembhedlela Eziseduze",
      open:
        "Kuvuliwe",
      closed:
        "Kuvaliwe",
      locationRequired:
        "Indawo iyafuneka",
      useMyLocation:
        "Sebenzisa indawo yami",
      startNavigation:
        "Thoma ukuzulazula",
      endNavigation:
        "Qeda ukuzulazula",
      distance:
        "Ibanga",
      searchPlaceholder:
        "Sesha iimtholapilo namkha iimbhedlela",
    },
  });

export const patientPageResources = {
  en,
  zu,
  xh,
  af,
  nso,
  tn,
  st,
  ts,
  ss,
  ve,
  nr,
};
