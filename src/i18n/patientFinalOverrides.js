// =========================================================
// PHILALINK FINAL PATIENT LOCALISATION OVERRIDES
// =========================================================
//
// This file is intentionally merged LAST.
//
// It closes the remaining patient-portal localisation gaps
// after:
// - resources.js
// - dashboardResources.js
// - patientPageResources.js
// - patientExperienceResources.js
// - patientCompletenessResources.js
//
// It does NOT translate:
// - medication names
// - clinic names
// - clinician-entered medication instructions
// - clinical record summaries
// - clinician-entered notes
//
// Those values may contain clinically meaningful free text
// and should not be altered automatically.
// =========================================================

const xhPages = {
  weather: {
    degreesCelsius:
      "{{temperature}} °C",
  },

  medications: {
    title:
      "Amayeza Am",

    loadingPrescriptions:
      "Kulayishwa amayeza akho...",

    activePrescriptionCount_one:
      "{{count}} iyeza elisebenzayo",

    activePrescriptionCount_other:
      "{{count}} amayeza asebenzayo",

    refresh:
      "Hlaziya",

    loadError:
      "Asikwazanga kulayisha amayeza akho.",

    supplyTemporaryUnavailable:
      "Ulwazi lwamayeza aseleyo alufumaneki okwethutyana.",

    takenMessage:
      "Iyeza liphawulwe njengelithathiweyo. Isixa samayeza aseleyo siphinde sabalwa.",

    skippedMessage:
      "Iyeza liphawulwe njengelitsityiweyo.",

    updateError:
      "Asikwazanga ukuhlaziya eli yeza.",

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

    doseProgressSummary:
      "{{taken}} kwamathamo {{scheduled}} acwangcisiweyo aphawulwe njengathathiweyo namhlanje",

    loadingSupply:
      "Kulayishwa amayeza aseleyo",

    todaysDosesComplete:
      "Amathamo anamhlanje agqityiwe",

    medicationSupply:
      "Amayeza aseleyo",

    loadingSupplyInformation:
      "Kulayishwa ulwazi lwamayeza aseleyo...",

    supplyUnavailable:
      "Ulwazi lwamayeza aseleyo alufumaneki",

    supplyInformationUnavailable:
      "Ulwazi lwamayeza aseleyo alukafumaneki.",

    supplyDepleted:
      "Amayeza aseleyo aphelile",

    dayRemaining:
      "Kusele usuku olu-1",

    daysRemaining:
      "Kusele iintsuku eziyi-{{count}}",

    estimatedSupplyText:
      "Oku kuqikelelwa kusetyenziswa ukuqokelelwa kwakho kwamayeza okugqityiweyo kutshanje, ishedyuli esebenzayo kunye namathamo owaphawule njengathathiweyo.",

    doseAmountNeeded:
      "Kufuneka ubungakanani bethamo",

    missingUnitsText:
      "Isixa samayeza anikiweyo sirekhodiwe, kodwa iiyunithi ezisetyenziswa kwithamo ngalinye azikarekhodwa.",

    scheduleNeeded:
      "Kufuneka ishedyuli",

    missingScheduleText:
      "Isixa samayeza anikiweyo sirekhodiwe, kodwa akukho shedyuli esebenzayo.",

    noCollectedSupply:
      "Akukho mayeza aqokelelweyo",

    noCompletedCollectionText:
      "Akukho kuqokelelwa kwamayeza okugqityiweyo okurekhodiweyo kweli yeza.",

    supplyCalculationFailed:
      "Ulwazi lwamayeza aseleyo alukwazanga ukubalwa.",

    dispensed:
      "Anikiweyo",

    remaining:
      "Aseleyo",

    daysLeft:
      "Iintsuku eziseleyo",

    dosesPerDay:
      "Amathamo ngosuku",

    lastCollected:
      "Agqityelwa ukuqokelelwa {{date}}",

    unitsPerDose_one:
      "{{count}} iyunithi kwithamo",

    unitsPerDose_other:
      "{{count}} iiyunithi kwithamo",

    trySupplyAgain:
      "Zama ulwazi lwamayeza kwakhona",

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

    startsOn:
      "Eli yeza liqala ngo-{{date}}. Ukurekhoda ithamo kuya kufumaneka emva kokuba iyeza liqalile.",

    noActiveScheduleMessage:
      "Akukho shedyuli yamathamo esebenzayo erekhodiweyo kweli yeza. Qhagamshelana nekliniki yakho ngaphambi kokurekhoda ithamo.",

    notCollectedTitle:
      "Iyeza alikaqokelelwa",

    notCollectedBody:
      "Ungalibona eli yeza neshedyuli yalo, kodwa awunakuphawula ithamo njengelithathiweyo de kubekho ukuqokelelwa kwamayeza okugqityiweyo.",

    doseAmountConfigurationTitle:
      "Ubungakanani bethamo busafuna ukuseta",

    doseAmountConfigurationBody:
      "Ikliniki yakho kufuneka irekhode inani leeyunithi zamayeza ezisetyenziswa kwithamo ngalinye ngaphambi kokuba ukwazi ukurekhoda amathamo athathiweyo.",

    supplyDepletedTitle:
      "Amayeza arekhodiweyo aseleyo aphelile",

    supplyDepletedBody:
      "Akukho mayeza aneleyo arekhodiweyo aseleyo ukuze kuthathwe elinye ithamo. Kufuneka kugqitywe ukuqokelelwa kwamayeza okutsha ngaphambi kokurekhoda elinye ithamo.",

    supplyVerificationUnavailable:
      "Amayeza aseleyo awakwazanga ukuqinisekiswa. Ukurekhoda ithamo elithathiweyo akufumaneki okwethutyana.",

    scheduledDosesCompleteTitle:
      "Amathamo anamhlanje acwangcisiweyo agqityiwe",

    scheduledDosesCompleteBody:
      "Uwaphawule onke amathamo {{count}} acwangcisiweyo njengathathiweyo namhlanje. Elinye ithamo alinakurekhodwa de kube lusuku olulandelayo.",

    todaysDoseProgress:
      "Inkqubela yamathamo anamhlanje",

    doseProgress:
      "{{taken}} kwamathamo {{scheduled}} acwangcisiweyo aphawulwe njengathathiweyo.",

    dosesLeft_one:
      "Kusele ithamo {{count}}",

    dosesLeft_other:
      "Kusele amathamo {{count}}",

    takenToday_one:
      "{{count}} ithamo lithathwe namhlanje",

    takenToday_other:
      "{{count}} amathamo athathwe namhlanje",

    skippedToday_one:
      "{{count}} ithamo litsityiwe",

    skippedToday_other:
      "{{count}} amathamo atsityiwe",

    updating:
      "Kuyahlaziywa...",

    notStartedYet:
      "Alikaqali",

    noActiveSchedule:
      "Akukho shedyuli esebenzayo",

    checkingSupply:
      "Kujongwa amayeza aseleyo...",

    markAsTaken:
      "Phawula njengelithathiweyo",

    skipDose:
      "Tsiba ithamo",

    todaysSchedule:
      "Ishedyuli yanamhlanje",

    complete:
      "Igqityiwe",

    scheduleTaken:
      "{{taken}} kwamathamo {{scheduled}} athathwe namhlanje",

    activeMedications:
      "Amayeza asebenzayo",

    noActiveMedications:
      "Akukho mayeza asebenzayo.",

    previousMedications:
      "Amayeza angaphambili",
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

    dateUnavailable:
      "Umhla awufumaneki",

    notes:
      "Amanqaku",

    reschedule:
      "Cwangcisa kwakhona",

    cancel:
      "Rhoxisa",

    loadError:
      "Asikwazanga kulayisha iidinga zakho.",

    bookingError:
      "Asikwazanga ukubhukisha idinga lakho.",

    rescheduleError:
      "Asikwazanga ukucwangcisa kwakhona eli dinga.",

    cancellationError:
      "Asikwazanga ukurhoxisa eli dinga.",

    futureDateRequired:
      "Khetha umhla nexesha ledinga elizayo.",

    futureRescheduleRequired:
      "Khetha umhla nexesha elizayo lokucwangcisa kwakhona.",

    reasonRequired:
      "Faka isizathu sedinga lakho.",

    bookingTitle:
      "Bhukisha idinga",

    bookingDescription:
      "Khetha inkonzo nokuba ufuna ukubona uMongikazi okanye uGqirha.",

    appointmentType:
      "Uhlobo lwedinga",

    providerQuestion:
      "Ufuna ukubona bani?",

    dateAndTime:
      "Umhla nexesha",

    reason:
      "Isizathu",

    visitMode:
      "Indlela yokubonana",

    duration:
      "Ubude bexesha",

    optionalNotes:
      "Amanqaku (ukuba uyafuna)",

    inPerson:
      "Ngobuqu",

    telehealth:
      "Uthethwano olukude",

    nurse:
      "UMongikazi",

    doctor:
      "UGqirha",

    routineCheckup:
      "Uvavanyo oluqhelekileyo",

    generalConsultation:
      "Ukubonana ngokubanzi",

    medicationReview:
      "Ukuhlolwa kwamayeza",

    chronicFollowup:
      "Ukulandela ukhathalelo lwesifo esinganyangekiyo",

    followupVisit:
      "Utyelelo lokulandela",

    symptoms:
      "Iimpawu / Ukungaphili kakuhle",

    other:
      "Okunye",

    defaultReason:
      "Uvavanyo oluqhelekileyo lwesigulana",

    minutes:
      "{{count}} imizuzu",

    rescheduleTitle:
      "Cwangcisa kwakhona idinga",

    newDateTime:
      "Umhla nexesha elitsha",

    confirmReschedule:
      "Qinisekisa ukucwangcisa kwakhona",

    cancelTitle:
      "Rhoxisa idinga",

    cancelQuestion:
      "Uqinisekile ukuba ufuna ukurhoxisa {{type}} yakho ngo-{{date}}?",

    keepAppointment:
      "Gcina idinga",

    cancelAppointment:
      "Rhoxisa idinga",

    cancelling:
      "Kuyarhoxiswa...",

    saving:
      "Kuyagcinwa...",

    upcoming:
      "Ezizayo",

    past:
      "Ezidlulileyo",

    upcomingCount:
      "Ezizayo ({{count}})",

    pastCount:
      "Ezidlulileyo ({{count}})",

    noUpcoming:
      "Akukho zidinga zizayo",

    noPrevious:
      "Akukho zidinga zangaphambili",

    scheduled:
      "Kucwangcisiwe",

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

    missed:
      "Kuphosiwe",

    close:
      "Vala",
  },

  records: {
    title:
      "Iirekhodi Zempilo",

    loading:
      "Kulayishwa iirekhodi zakho zempilo...",

    recordCount_one:
      "{{count}} irekhodi eligciniweyo",

    recordCount_other:
      "{{count}} iirekhodi ezigciniweyo",

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

    noRecordsYetBody:
      "Iirekhodi zakho zonyango ziya kuvela apha xa zongezwa liqela lakho lezempilo.",

    healthRecord:
      "Irekhodi lezempilo",

    healthcareProvider:
      "Umboneleli wezempilo",

    available:
      "Iyafumaneka",

    completed:
      "Igqityiwe",

    final:
      "Yokugqibela",

    pending:
      "Isalindelwe",

    draft:
      "Uyilo",

    record:
      "Irekhodi",

    dateUnavailable:
      "Umhla awufumaneki",

    clinicalSummary:
      "Isishwankathelo sonyango",

    noSummary:
      "Akukho sishwankathelo sonyango sirekhodiweyo.",

    category:
      "Udidi",
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
      "Ukufikelela kwindawo kwaliwe. Vumela ukufikelela kwindawo kwiisetingi zesikhangeli sakho ukuze ufumane amaziko akufutshane.",

    locationPositionUnavailable:
      "Indawo yakho yangoku ayikwazanga ukufunyanwa.",

    locationTimeout:
      "Isicelo sendawo siphelelwe lixesha. Zama kwakhona.",

    locationUnsupported:
      "Iinkonzo zendawo azixhaswa sesi sikhangeli.",

    locationRequired:
      "Indawo iyafuneka",

    allowLocation:
      "Vumela ukufikelela kwindawo ukuze ufumane iikliniki nezibhedlele ezikufutshane.",

    allowLocationRadius:
      "Vumela ukufikelela kwindawo ukuze ufumane iikliniki nezibhedlele ezingaphakathi kwe-{{radius}} km.",

    useMyLocation:
      "Sebenzisa indawo yam",

    locating:
      "Kufunyanwa indawo...",

    navigatingTo:
      "Kuyiwa e-{{name}}",

    facilitiesWithin_one:
      "{{count}} iziko elingaphakathi kwe-{{radius}} km",

    facilitiesWithin_other:
      "{{count}} amaziko angaphakathi kwe-{{radius}} km",

    facilitiesSorted:
      "Amaziko ahlelwe ngokusondela kuqala.",

    navigationMapMessage:
      "Kuboniswa kuphela indawo yakho yangoku nendawo oya kuyo ngexesha lokukhokelwa.",

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

    eta:
      "Ixesha lokufika",

    remaining:
      "Okuseleyo",

    yourLocation:
      "Indawo yakho",

    gpsAccuracy:
      "Ukuchaneka kwe-GPS: {{value}} m",

    kmAway:
      "{{distance}} km ukusuka kuwe",

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

    withinRadius:
      "Ngaphakathi kwe-{{radius}} km",

    nearbyFacilities_one:
      "{{count}} iziko elikufutshane",

    nearbyFacilities_other:
      "{{count}} amaziko akufutshane",

    waitingForLocation:
      "Kulindwe indawo",

    searchPlaceholder:
      "Khangela iikliniki okanye izibhedlele",

    noFacilities:
      "Akukho maziko afunyenweyo",

    noFacilitiesBody:
      "Akukho kliniki okanye zibhedlele ze-PhilaLink zifunyenweyo ngaphakathi kwe-{{radius}} km ukusuka kwindawo yakho yangoku.",

    navigating:
      "Kuyakhokelwa",

    coordinatesRequired:
      "Iinkcukacha zendawo ezisebenzayo ziyafuneka ukuze kuqalwe ukukhokelwa.",

    routeCalculationFailed:
      "Indlela yokukhokelwa ayikwazanga ukubalwa.",

    routeNotFound:
      "Akukho ndlela yokuqhuba ifunyenweyo eya kweli ziko.",

    routeGeometryInvalid:
      "Indlela ayinazo iinkcukacha zemephu ezaneleyo.",

    navigationUnavailable:
      "Ukukhokelwa akufumaneki ngoku.",

    currentLocationRequired:
      "Indawo yakho yangoku iyafuneka ngaphambi kokuba ukukhokelwa kuqale.",

    metre:
      "{{count}} m",

    minute:
      "{{count}} umz.",

    hour:
      "{{count}} iyure",

    hourMinutes:
      "{{hours}} iyure {{minutes}} umz.",

    theFacility:
      "iziko",

    startOn:
      "Qala ku-{{road}}",

    startCurrentLocation:
      "Qala kwindawo yakho yangoku",

    arriveAt:
      "Fika e-{{destination}}",

    roundaboutRoad:
      "Ngena kwisangqa sendlela uze uqhubeke ku-{{road}}",

    roundabout:
      "Ngena kwisangqa sendlela",

    merge:
      "Joyina indlela{{direction}}{{road}}",

    keep:
      "Hlala {{direction}}{{road}}",

    ramp:
      "Thatha indlela yokungena{{direction}}{{road}}",

    exit:
      "Thatha indlela yokuphuma{{direction}}{{road}}",

    continueStraight:
      "Qhubeka ngqo{{road}}",

    turn:
      "Jika {{direction}}{{road}}",

    continue:
      "Qhubeka {{direction}}{{road}}",

    continueOnto:
      "Qhubeka ku-{{road}}",

    ahead:
      "phambili",

    ontoRoad:
      " ku-{{road}}",
  },
};

const afPages = {
  weather: {
    degreesCelsius:
      "{{temperature}} °C",
  },

  medications: {
    title:
      "My Medikasie",

    loadingPrescriptions:
      "Jou medikasie laai...",

    activePrescriptionCount_one:
      "{{count}} aktiewe voorskrif",

    activePrescriptionCount_other:
      "{{count}} aktiewe voorskrifte",

    refresh:
      "Verfris",

    loadError:
      "Ons kon nie jou medikasie laai nie.",

    supplyTemporaryUnavailable:
      "Medikasievoorraadinligting is tydelik nie beskikbaar nie.",

    takenMessage:
      "Medikasie is as geneem gemerk. Jou oorblywende voorraad is herbereken.",

    skippedMessage:
      "Medikasie is as oorgeslaan gemerk.",

    updateError:
      "Ons kon nie hierdie medikasie bywerk nie.",

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

    doseProgressSummary:
      "{{taken}} van {{scheduled}} geskeduleerde dosisse is vandag as geneem gemerk",

    loadingSupply:
      "Voorraad laai",

    todaysDosesComplete:
      "Vandag se dosisse is voltooi",

    medicationSupply:
      "Medikasievoorraad",

    loadingSupplyInformation:
      "Medikasievoorraadinligting laai...",

    supplyUnavailable:
      "Voorraad nie beskikbaar nie",

    supplyInformationUnavailable:
      "Voorraadinligting is nog nie beskikbaar nie.",

    supplyDepleted:
      "Voorraad uitgeput",

    dayRemaining:
      "1 dag oor",

    daysRemaining:
      "{{count}} dae oor",

    estimatedSupplyText:
      "Beraam volgens jou jongste voltooide afhaling, aktiewe doseringskedule en dosisse wat jy as geneem gemerk het.",

    doseAmountNeeded:
      "Dosisgrootte word benodig",

    missingUnitsText:
      "Jou uitgereikte hoeveelheid is aangeteken, maar die eenhede per dosis is nog nie vasgelê nie.",

    scheduleNeeded:
      "Skedule word benodig",

    missingScheduleText:
      "Jou uitgereikte hoeveelheid is aangeteken, maar daar is geen aktiewe doseringskedule nie.",

    noCollectedSupply:
      "Geen afgehaalde voorraad nie",

    noCompletedCollectionText:
      "Geen voltooide medikasie-afhaling is vir hierdie medikasie aangeteken nie.",

    supplyCalculationFailed:
      "Voorraadinligting kon nie bereken word nie.",

    dispensed:
      "Uitgereik",

    remaining:
      "Oorblywend",

    daysLeft:
      "Dae oor",

    dosesPerDay:
      "Dosisse per dag",

    lastCollected:
      "Laas afgehaal {{date}}",

    unitsPerDose_one:
      "{{count}} eenheid per dosis",

    unitsPerDose_other:
      "{{count}} eenhede per dosis",

    trySupplyAgain:
      "Probeer voorraad weer",

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

    startsOn:
      "Hierdie medikasie begin op {{date}}. Dosisregistrasie sal beskikbaar wees sodra die medikasie begin het.",

    noActiveScheduleMessage:
      "Geen aktiewe doseringskedule is vir hierdie medikasie aangeteken nie. Kontak jou kliniek voordat jy 'n dosis registreer.",

    notCollectedTitle:
      "Medikasie is nog nie afgehaal nie",

    notCollectedBody:
      "Jy kan hierdie voorskrif en sy skedule sien, maar jy kan nie 'n dosis as geneem merk totdat 'n voltooide medikasie-afhaling aangeteken is nie.",

    doseAmountConfigurationTitle:
      "Dosisgrootte moet nog opgestel word",

    doseAmountConfigurationBody:
      "Jou kliniek moet die aantal medikasie-eenhede per dosis aanteken voordat geneemde dosisse geregistreer kan word.",

    supplyDepletedTitle:
      "Aangetekende medikasievoorraad is uitgeput",

    supplyDepletedBody:
      "Daar is nie genoeg aangetekende medikasie oor vir nog 'n dosis nie. 'n Nuwe medikasie-afhaling moet voltooi word voordat nog 'n geneemde dosis geregistreer kan word.",

    supplyVerificationUnavailable:
      "Medikasievoorraad kon nie geverifieer word nie. Registrasie van 'n geneemde dosis is tydelik nie beskikbaar nie.",

    scheduledDosesCompleteTitle:
      "Vandag se geskeduleerde dosisse is voltooi",

    scheduledDosesCompleteBody:
      "Jy het al {{count}} geskeduleerde dosisse vandag as geneem gemerk. Nog 'n geneemde dosis kan eers die volgende dag geregistreer word.",

    todaysDoseProgress:
      "Vandag se dosisvordering",

    doseProgress:
      "{{taken}} van {{scheduled}} geskeduleerde dosisse is as geneem gemerk.",

    dosesLeft_one:
      "{{count}} dosis oor",

    dosesLeft_other:
      "{{count}} dosisse oor",

    takenToday_one:
      "{{count}} dosis vandag geneem",

    takenToday_other:
      "{{count}} dosisse vandag geneem",

    skippedToday_one:
      "{{count}} dosis oorgeslaan",

    skippedToday_other:
      "{{count}} dosisse oorgeslaan",

    updating:
      "Werk by...",

    notStartedYet:
      "Nog nie begin nie",

    noActiveSchedule:
      "Geen aktiewe skedule nie",

    checkingSupply:
      "Voorraad word nagegaan...",

    markAsTaken:
      "Merk as geneem",

    skipDose:
      "Slaan dosis oor",

    todaysSchedule:
      "Vandag se skedule",

    complete:
      "Voltooi",

    scheduleTaken:
      "{{taken}} van {{scheduled}} vandag geneem",

    activeMedications:
      "Aktiewe medikasie",

    noActiveMedications:
      "Geen aktiewe medikasie nie.",

    previousMedications:
      "Vorige medikasie",
  },

  appointments: {
    title:
      "Afsprake",

    subtitle:
      "Bespreek 'n kliniekbesoek en kies of jy 'n verpleegkundige of dokter wil sien.",

    refresh:
      "Verfris",

    bookAppointment:
      "Bespreek afspraak",

    bookAnAppointment:
      "Bespreek 'n afspraak",

    booking:
      "Bespreek tans...",

    appointment:
      "Afspraak",

    clinicProvider:
      "Kliniekverskaffer",

    dateUnavailable:
      "Datum nie beskikbaar nie",

    notes:
      "Notas",

    reschedule:
      "Herskeduleer",

    cancel:
      "Kanselleer",

    loadError:
      "Ons kon nie jou afsprake laai nie.",

    bookingError:
      "Ons kon nie jou afspraak bespreek nie.",

    rescheduleError:
      "Ons kon nie hierdie afspraak herskeduleer nie.",

    cancellationError:
      "Ons kon nie hierdie afspraak kanselleer nie.",

    futureDateRequired:
      "Kies asseblief 'n toekomstige afspraakdatum en -tyd.",

    futureRescheduleRequired:
      "Kies 'n toekomstige datum en tyd om die afspraak te herskeduleer.",

    reasonRequired:
      "Voer asseblief die rede vir jou afspraak in.",

    bookingTitle:
      "Bespreek afspraak",

    bookingDescription:
      "Kies die diens en of jy 'n verpleegkundige of dokter wil sien.",

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
      "Afstandskonsultasie",

    nurse:
      "Verpleegkundige",

    doctor:
      "Dokter",

    routineCheckup:
      "Roetine-ondersoek",

    generalConsultation:
      "Algemene konsultasie",

    medicationReview:
      "Medikasiehersiening",

    chronicFollowup:
      "Opvolg vir chroniese sorg",

    followupVisit:
      "Opvolgbesoek",

    symptoms:
      "Simptome / Voel ongesteld",

    other:
      "Ander",

    defaultReason:
      "Roetine-pasiëntondersoek",

    minutes:
      "{{count}} minute",

    rescheduleTitle:
      "Herskeduleer afspraak",

    newDateTime:
      "Nuwe datum en tyd",

    confirmReschedule:
      "Bevestig herskedulering",

    cancelTitle:
      "Kanselleer afspraak",

    cancelQuestion:
      "Is jy seker jy wil jou {{type}} op {{date}} kanselleer?",

    keepAppointment:
      "Hou afspraak",

    cancelAppointment:
      "Kanselleer afspraak",

    cancelling:
      "Kanselleer tans...",

    saving:
      "Stoor tans...",

    upcoming:
      "Komende",

    past:
      "Verlede",

    upcomingCount:
      "Komende ({{count}})",

    pastCount:
      "Verlede ({{count}})",

    noUpcoming:
      "Geen komende afsprake nie",

    noPrevious:
      "Geen vorige afsprake nie",

    scheduled:
      "Geskeduleer",

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

    missed:
      "Gemis",

    close:
      "Sluit",
  },

  records: {
    title:
      "Gesondheidsrekords",

    loading:
      "Jou gesondheidsrekords laai...",

    recordCount_one:
      "{{count}} rekord op lêer",

    recordCount_other:
      "{{count}} rekords op lêer",

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

    noRecordsYetBody:
      "Jou kliniese rekords sal hier verskyn wanneer dit deur jou gesondheidsorgspan bygevoeg word.",

    healthRecord:
      "Gesondheidsrekord",

    healthcareProvider:
      "Gesondheidsorgverskaffer",

    available:
      "Beskikbaar",

    completed:
      "Voltooi",

    final:
      "Finaal",

    pending:
      "Hangende",

    draft:
      "Konsep",

    record:
      "Rekord",

    dateUnavailable:
      "Datum nie beskikbaar nie",

    clinicalSummary:
      "Kliniese opsomming",

    noSummary:
      "Geen kliniese opsomming is aangeteken nie.",

    category:
      "Kategorie",
  },

  clinics: {
    title:
      "Nabygeleë Klinieke en Hospitale",

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
      "Liggingstoegang is geweier. Aktiveer liggingstoegang in jou blaaierinstellings om nabygeleë fasiliteite te vind.",

    locationPositionUnavailable:
      "Jou huidige ligging kon nie bepaal word nie.",

    locationTimeout:
      "Die liggingversoek het uitgetel. Probeer weer.",

    locationUnsupported:
      "Liggingdienste word nie deur hierdie blaaier ondersteun nie.",

    locationRequired:
      "Ligging word vereis",

    allowLocation:
      "Laat liggingstoegang toe om klinieke en hospitale naby jou te vind.",

    allowLocationRadius:
      "Laat liggingstoegang toe om klinieke en hospitale binne {{radius}} km te vind.",

    useMyLocation:
      "Gebruik my ligging",

    locating:
      "Ligging word bepaal...",

    navigatingTo:
      "Navigeer na {{name}}",

    facilitiesWithin_one:
      "{{count}} fasiliteit binne {{radius}} km",

    facilitiesWithin_other:
      "{{count}} fasiliteite binne {{radius}} km",

    facilitiesSorted:
      "Fasiliteite word van naaste na verste gerangskik.",

    navigationMapMessage:
      "Slegs jou huidige posisie en bestemming word tydens navigasie gewys.",

    recenter:
      "Hersentreer",

    end:
      "Beëindig",

    arrived:
      "Jy het aangekom",

    continueRoute:
      "Gaan voort op jou roete",

    updatingRoute:
      "Roete word bygewerk",

    eta:
      "Aankomstyd",

    remaining:
      "Oorblywend",

    yourLocation:
      "Jou ligging",

    gpsAccuracy:
      "GPS-akkuraatheid: {{value}} m",

    kmAway:
      "{{distance}} km weg",

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

    withinRadius:
      "Binne {{radius}} km",

    nearbyFacilities_one:
      "{{count}} nabygeleë fasiliteit",

    nearbyFacilities_other:
      "{{count}} nabygeleë fasiliteite",

    waitingForLocation:
      "Wag vir ligging",

    searchPlaceholder:
      "Soek klinieke of hospitale",

    noFacilities:
      "Geen fasiliteite gevind nie",

    noFacilitiesBody:
      "Geen PhilaLink-klinieke of hospitale is binne {{radius}} km van jou huidige ligging gevind nie.",

    navigating:
      "Navigeer",

    coordinatesRequired:
      "Geldige koördinate word vir navigasie vereis.",

    routeCalculationFailed:
      "Die navigasieroete kon nie bereken word nie.",

    routeNotFound:
      "Geen ryroete na hierdie fasiliteit is gevind nie.",

    routeGeometryInvalid:
      "Die roete bevat nie genoeg kaartinligting nie.",

    navigationUnavailable:
      "Navigasie is tans nie beskikbaar nie.",

    currentLocationRequired:
      "Jou huidige ligging word vereis voordat navigasie kan begin.",

    metre:
      "{{count}} m",

    minute:
      "{{count}} min",

    hour:
      "{{count}} uur",

    hourMinutes:
      "{{hours}} uur {{minutes}} min",

    theFacility:
      "die fasiliteit",

    startOn:
      "Begin op {{road}}",

    startCurrentLocation:
      "Begin vanaf jou huidige ligging",

    arriveAt:
      "Arriveer by {{destination}}",

    roundaboutRoad:
      "Gaan die verkeersirkel binne en gaan voort op {{road}}",

    roundabout:
      "Gaan die verkeersirkel binne",

    merge:
      "Voeg in{{direction}}{{road}}",

    keep:
      "Hou {{direction}}{{road}}",

    ramp:
      "Neem die oprit{{direction}}{{road}}",

    exit:
      "Neem die afrit{{direction}}{{road}}",

    continueStraight:
      "Gaan reguit voort{{road}}",

    turn:
      "Draai {{direction}}{{road}}",

    continue:
      "Gaan voort {{direction}}{{road}}",

    continueOnto:
      "Gaan voort op {{road}}",

    ahead:
      "vorentoe",

    ontoRoad:
      " op {{road}}",
  },
};

const compactCorrections = {
  nso: {
    appointments: {
      telehealth:
        "Tlhokomelo ya maphelo ka kgokagano ya kgole",
    },

    chatbot: {
      online:
        "Inthaneteng",

      chatOptionsDescription:
        "Laola poledišano ya gago ya bjale le PhilaChatBot.",

      quickStartBody:
        "Bolela le Phila goba thoma tlhahlobo ya maswao.",

      medicationsDescription:
        "Kgetha dihlare tša gago tša PhilaLink goba o tsenye se sengwe.",

      yourMedications:
        "Dihlare tša gago tša PhilaLink",

      reviewSafety:
        "PhilaChatBot e tla thoma ka go lekola maswao a kotsi pele e lokiša tlhahlo.",
    },

    dynamic: {
      medicationForms: {
        tablet:
          "Pilisi",
        capsule:
          "Khepsule",
        syrup:
          "Sirapo",
        liquid:
          "Seela",
        injection:
          "Hlabo",
        cream:
          "Khilimu",
        ointment:
          "Setlolo",
        inhaler:
          "Sedirišwa sa go hema",
        drops:
          "Marothodi",
        patch:
          "Phatšhe ya sehlare",
      },
    },
  },

  tn: {
    appointments: {
      telehealth:
        "Tlhokomelo ya boitekanelo ka kgolagano ya kgakala",
    },

    chatbot: {
      online:
        "Inthaneteng",

      chatOptionsDescription:
        "Laola puisano ya gago ya jaanong le PhilaChatBot.",

      quickStartBody:
        "Bua le Phila kgotsa simolola tlhatlhobo ya matshwao.",

      medicationsDescription:
        "Tlhopha melemo ya gago ya PhilaLink kgotsa tsenya mongwe.",

      yourMedications:
        "Melemo ya gago ya PhilaLink",

      reviewSafety:
        "PhilaChatBot e tla simolola ka go sekaseka matshwao a kotsi pele e baakanya kaelo.",
    },

    dynamic: {
      medicationForms: {
        tablet:
          "Pilisi",
        capsule:
          "Khepsule",
        syrup:
          "Sirapo",
        liquid:
          "Seedi",
        injection:
          "Ente",
        cream:
          "Khirimi",
        ointment:
          "Setlolo",
        inhaler:
          "Sedirisiwa sa go hema",
        drops:
          "Marothodi",
        patch:
          "Patshe ya molemo",
      },
    },
  },

  st: {
    appointments: {
      telehealth:
        "Tlhokomelo ea bophelo ka thōko",
    },

    chatbot: {
      online:
        "Inthaneteng",

      chatOptionsDescription:
        "Laola puisano ea hau ea hajoale le PhilaChatBot.",

      quickStartBody:
        "Bua le Phila kapa qala tlhahlobo ea matšoao.",

      medicationsDescription:
        "Khetha meriana ea hau ea PhilaLink kapa u kenye e meng.",

      yourMedications:
        "Meriana ea hau ea PhilaLink",

      reviewSafety:
        "PhilaChatBot e tla qala ka ho hlahloba matšoao a kotsi pele e lokisa tataiso.",
    },

    dynamic: {
      medicationForms: {
        tablet:
          "Pilisi",
        capsule:
          "Khapsule",
        syrup:
          "Sirapo",
        liquid:
          "Mokelikeli",
        injection:
          "Ente",
        cream:
          "Kerime",
        ointment:
          "Setlolo",
        inhaler:
          "Sesebelisoa sa ho hema",
        drops:
          "Marotholi",
        patch:
          "Patjhe ea moriana",
      },
    },
  },

  ts: {
    appointments: {
      telehealth:
        "Nhlayiso wa rihanyo hi vuhlanganisi bya le kule",
    },

    chatbot: {
      online:
        "Eka inthanete",

      chatOptionsDescription:
        "Lawula mbulavurisano wa wena wa sweswi na PhilaChatBot.",

      quickStartBody:
        "Vulavula na Phila kumbe sungula xikambelo xa swikombiso.",

      medicationsDescription:
        "Hlawula mirhi ya wena ya PhilaLink kumbe engetela yin'wana.",

      yourMedications:
        "Mirhi ya wena ya PhilaLink",

      reviewSafety:
        "PhilaChatBot yi ta sungula hi ku kambela swikombiso swa khombo yi nga si lunghisa nkongomiso.",
    },

    dynamic: {
      medicationForms: {
        tablet:
          "Pilisi",
        capsule:
          "Khepsuli",
        syrup:
          "Sirapu",
        liquid:
          "Nhlanganelo wa mati",
        injection:
          "Ntlhavelo",
        cream:
          "Khirimi",
        ointment:
          "Mafurha yo tota",
        inhaler:
          "Xitirhisiwa xo hefemula",
        drops:
          "Mathonsi",
        patch:
          "Phachi ya murhi",
      },
    },
  },

  ss: {
    appointments: {
      telehealth:
        "Kunakekelwa kwemphilo ukhashane",
    },

    chatbot: {
      online:
        "Uxhumekile",

      chatOptionsDescription:
        "Phatsa ingcoco yakho yanyalo ye-PhilaChatBot.",

      quickStartBody:
        "Khuluma naPhila noma ucale kuhlolwa kwetimphawu.",

      medicationsDescription:
        "Khetsa imitsi yakho ye-PhilaLink noma wengete lomunye.",

      yourMedications:
        "Imitsi yakho ye-PhilaLink",

      reviewSafety:
        "PhilaChatBot itawucala ngekuhlola timphawu letiyingozi ngaphambi kwekulungisa sicondziso.",
    },

    dynamic: {
      medicationForms: {
        tablet:
          "Lipilisi",
        capsule:
          "Ikhepsuli",
        syrup:
          "Isiraphu",
        liquid:
          "Luketshezi",
        injection:
          "Umjovo",
        cream:
          "Khilimu",
        ointment:
          "Sigcotfo",
        inhaler:
          "Sifutsi sekuphefumula",
        drops:
          "Emaconsi",
        patch:
          "Ipheshi yemutsi",
      },
    },
  },

  ve: {
    appointments: {
      telehealth:
        "Ndaulo ya mutakalo nga kule",
    },

    chatbot: {
      online:
        "Kha inthanete",

      chatOptionsDescription:
        "Langani nyambedzano yaṋu ya zwino ya PhilaChatBot.",

      quickStartBody:
        "Ambani na Phila kana thomani u ṱola tswayo.",

      medicationsDescription:
        "Nangani mishonga yaṋu ya PhilaLink kana ni engedze muṅwe.",

      yourMedications:
        "Mishonga yaṋu ya PhilaLink",

      reviewSafety:
        "PhilaChatBot i ḓo thoma nga u sedza tswayo dza khombo i sa athu u lugisa nyeletshedzo.",
    },

    dynamic: {
      medicationForms: {
        tablet:
          "Philisi",
        capsule:
          "Khephusule",
        syrup:
          "Sirapu",
        liquid:
          "Tshiḓi",
        injection:
          "Nṱhavhelo",
        cream:
          "Khirimu",
        ointment:
          "Tshizolo",
        inhaler:
          "Tshishumiswa tsha u fema",
        drops:
          "Mathonsi",
        patch:
          "Phathshi ya mushonga",
      },
    },
  },

  nr: {
    appointments: {
      telehealth:
        "Ukunakekelwa kwepilo ukude",
    },

    chatbot: {
      online:
        "Uxhumekile",

      chatOptionsDescription:
        "Phatha ikulumo yakho yanje ye-PhilaChatBot.",

      quickStartBody:
        "Khuluma noPhila namkha thoma ukuhlolwa kweempawu.",

      medicationsDescription:
        "Khetha imithi yakho ye-PhilaLink namkha ungeze omunye.",

      yourMedications:
        "Imithi yakho ye-PhilaLink",

      reviewSafety:
        "PhilaChatBot izokuthoma ngokuhlola iimpawu eziyingozi ngaphambi kokulungisa isinqophiso.",
    },

    dynamic: {
      medicationForms: {
        tablet:
          "Iphilisi",
        capsule:
          "Ikhepsuli",
        syrup:
          "Isiraphu",
        liquid:
          "Okumamanzi",
        injection:
          "Umjovo",
        cream:
          "Ikhrimu",
        ointment:
          "Amafutha wokugcoba",
        inhaler:
          "Isifutho sokuphefumula",
        drops:
          "Amaconsi",
        patch:
          "Ipheshi yomuthi",
      },
    },
  },
};

const healthMetricStatuses = {
  en: {
    normal:
      "Normal",
    healthy:
      "Healthy",
    high:
      "High",
    low:
      "Low",
    elevated:
      "Elevated",
    critical:
      "Critical",
    stable:
      "Stable",
  },

  zu: {
    normal:
      "Okuvamile",
    healthy:
      "Kunempilo",
    high:
      "Phezulu",
    low:
      "Phansi",
    elevated:
      "Kuphakeme",
    critical:
      "Kubucayi",
    stable:
      "Kuzinzile",
  },

  xh: {
    normal:
      "Eqhelekileyo",
    healthy:
      "Isempilweni",
    high:
      "Phezulu",
    low:
      "Phantsi",
    elevated:
      "Iphakamile",
    critical:
      "Ibaluleke kakhulu",
    stable:
      "Izinzile",
  },

  af: {
    normal:
      "Normaal",
    healthy:
      "Gesond",
    high:
      "Hoog",
    low:
      "Laag",
    elevated:
      "Verhoog",
    critical:
      "Kritiek",
    stable:
      "Stabiel",
  },

  nso: {
    normal:
      "Tlwaelegile",
    healthy:
      "Phetše gabotse",
    high:
      "Godimo",
    low:
      "Fase",
    elevated:
      "Phagame",
    critical:
      "Kotsi kudu",
    stable:
      "E tsitsitse",
  },

  tn: {
    normal:
      "Tlwaelegile",
    healthy:
      "E siame",
    high:
      "Kwa godimo",
    low:
      "Kwa tlase",
    elevated:
      "E tlhatlogile",
    critical:
      "Kotsi thata",
    stable:
      "E tsepame",
  },

  st: {
    normal:
      "Tloaelehileng",
    healthy:
      "E phetse hantle",
    high:
      "Holimo",
    low:
      "Tlase",
    elevated:
      "E phahame",
    critical:
      "E mahlonoko",
    stable:
      "E tsitsitse",
  },

  ts: {
    normal:
      "Tolovelekile",
    healthy:
      "Rihanyo lerinene",
    high:
      "Ehenhla",
    low:
      "Ehansi",
    elevated:
      "Yi tlakukile",
    critical:
      "Xi na khombo swinene",
    stable:
      "Yi tshamisekile",
  },

  ss: {
    normal:
      "Kujwayelekile",
    healthy:
      "Kunemphilo",
    high:
      "Phezulu",
    low:
      "Phansi",
    elevated:
      "Kuphakeme",
    critical:
      "Kuyingoti",
    stable:
      "Kutinikile",
  },

  ve: {
    normal:
      "Zwo ḓowelea",
    healthy:
      "U na mutakalo",
    high:
      "Nṱha",
    low:
      "Fhasi",
    elevated:
      "Zwo gonya",
    critical:
      "Zwi na khombo vhukuma",
    stable:
      "Zwo khwaṱha",
  },

  nr: {
    normal:
      "Kujayelekile",
    healthy:
      "Kunepilo",
    high:
      "Phezulu",
    low:
      "Phasi",
    elevated:
      "Kuphakeme",
    critical:
      "Kuyingozi khulu",
    stable:
      "Kuzinzile",
  },
};

export const patientFinalOverrides = {
  en: {
    dynamic: {
      healthMetricStatuses:
        healthMetricStatuses.en,
    },
  },

  zu: {
    weather: {
      degreesCelsius:
        "{{temperature}} °C",
    },

    dynamic: {
      healthMetricStatuses:
        healthMetricStatuses.zu,
    },
  },

  xh: {
    ...xhPages,

    dynamic: {
      healthMetricStatuses:
        healthMetricStatuses.xh,
    },
  },

  af: {
    ...afPages,

    dynamic: {
      healthMetricStatuses:
        healthMetricStatuses.af,
    },
  },

  nso: {
    ...compactCorrections.nso,

    dynamic: {
      ...compactCorrections
        .nso
        .dynamic,

      healthMetricStatuses:
        healthMetricStatuses.nso,
    },
  },

  tn: {
    ...compactCorrections.tn,

    dynamic: {
      ...compactCorrections
        .tn
        .dynamic,

      healthMetricStatuses:
        healthMetricStatuses.tn,
    },
  },

  st: {
    ...compactCorrections.st,

    dynamic: {
      ...compactCorrections
        .st
        .dynamic,

      healthMetricStatuses:
        healthMetricStatuses.st,
    },
  },

  ts: {
    ...compactCorrections.ts,

    dynamic: {
      ...compactCorrections
        .ts
        .dynamic,

      healthMetricStatuses:
        healthMetricStatuses.ts,
    },
  },

  ss: {
    ...compactCorrections.ss,

    dynamic: {
      ...compactCorrections
        .ss
        .dynamic,

      healthMetricStatuses:
        healthMetricStatuses.ss,
    },
  },

  ve: {
    ...compactCorrections.ve,

    dynamic: {
      ...compactCorrections
        .ve
        .dynamic,

      healthMetricStatuses:
        healthMetricStatuses.ve,
    },
  },

  nr: {
    ...compactCorrections.nr,

    dynamic: {
      ...compactCorrections
        .nr
        .dynamic,

      healthMetricStatuses:
        healthMetricStatuses.nr,
    },
  },
};

export default patientFinalOverrides;
