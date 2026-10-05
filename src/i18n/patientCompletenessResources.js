const experience = {
  en: {
    api: {
      messageRequired:
        "A message is required.",
    },

    dynamic: {
      providerRoles: {
        nurse: "Nurse",
        doctor: "Doctor",
        pharmacist: "Pharmacist",
        healthcareWorker:
          "Primary Health Care Worker",
      },

      medicationForms: {
        tablet: "Tablet",
        capsule: "Capsule",
        syrup: "Syrup",
        liquid: "Liquid",
        injection: "Injection",
        cream: "Cream",
        ointment: "Ointment",
        inhaler: "Inhaler",
        drops: "Drops",
        patch: "Patch",
      },

      healthMetrics: {
        bloodPressure:
          "Blood pressure",
        weight: "Weight",
        glucose:
          "Blood glucose",
        temperature:
          "Temperature",
        heartRate:
          "Heart rate",
        bmi: "BMI",
        oxygenSaturation:
          "Oxygen saturation",
      },
    },
  },

  zu: {
    api: {
      messageRequired:
        "Umlayezo uyadingeka.",
    },

    dynamic: {
      providerRoles: {
        nurse:
          "Umhlengikazi",
        doctor:
          "Udokotela",
        pharmacist:
          "Usokhemisi",
        healthcareWorker:
          "Isisebenzi Sezempilo Esiyinhloko",
      },

      medicationForms: {
        tablet:
          "Ithebhulethi",
        capsule:
          "Ikhepsuli",
        syrup:
          "Isiraphu",
        liquid:
          "Uketshezi",
        injection:
          "Umjovo",
        cream:
          "Ukhilimu",
        ointment:
          "Amafutha okugcoba",
        inhaler:
          "I-inhaler",
        drops:
          "Amaconsi",
        patch:
          "Ipheshana lomuthi",
      },

      healthMetrics: {
        bloodPressure:
          "Umfutho wegazi",
        weight:
          "Isisindo",
        glucose:
          "Ushukela wegazi",
        temperature:
          "Izinga lokushisa",
        heartRate:
          "Ukushaya kwenhliziyo",
        bmi:
          "BMI",
        oxygenSaturation:
          "Izinga lomoya-mpilo egazini",
      },
    },
  },

  xh: {
    weather: {
      weather:
        "Imozulu",
      loading:
        "Kulayishwa imozulu",
      locating:
        "Kufunyanwa indawo...",
      retry:
        "Zama imozulu kwakhona",
      unavailable:
        "Imozulu ayifumaneki",
      currentLocation:
        "Indawo yakho yangoku",
      assignedClinicArea:
        "Indawo yekliniki oyabelweyo",
      weatherIn:
        "Imozulu e-{{location}}",
      clinicAreaWeather:
        "Imozulu yendawo yekliniki: {{location}}",
      clinic:
        "Ikliniki",
      currentLocationWeather:
        "Imozulu yendawo yakho yangoku",
      clinicWeather:
        "Imozulu yekliniki",
      closeDetails:
        "Vala iinkcukacha zemozulu",
      night:
        "Ebusuku",
      day:
        "Emini",
      location:
        "Indawo",
      degreesCelsius:
        "{{temperature}} degrees Celsius",
      deviceLocationFallback:
        "Indawo yesixhobo sakho ayifumanekanga, ngoko i-PhilaLink ibonisa imozulu yendawo yekliniki oyabelweyo.",
      locationUnavailable:
        "Indawo ayifumaneki.",
      preciseLocationDenied:
        "Ukufikelela kwindawo echanekileyo kwaliwe.",
      locationUndetermined:
        "Indawo yakho yangoku ayikwazanga ukufunyanwa.",
      locationTimeout:
        "Isicelo sendawo siphelelwe lixesha.",
      locationServicesUnavailable:
        "Iinkonzo zendawo azifumaneki.",
      invalidCoordinates:
        "Isikhangeli sibuyise iinkcukacha zendawo ezingasebenziyo.",

      condition: {
        clear:
          "Kucwebile",
        partlyCloudy:
          "Kunamafu kancinci",
        overcast:
          "Kugqunywe ngamafu",
        rain:
          "Imvula",
        thunder:
          "Iindudumo",
        snow:
          "Ikhephu",
        fog:
          "Inkungu",
        cloudy:
          "Kunamafu",
      },
    },

    identity: {
      title:
        "Iinkcukacha zesazisi",
      description:
        "Lungisa umhla wakho wokuzalwa okanye, xa kuyimfuneko, utshintshe inombolo epheleleyo yesazisi saseMzantsi Afrika.",
      separateSave:
        "Utshintsho lwesazisi lugcinwa ngokwahlukeneyo kolunye ulwazi lweprofayile.",
      currentId:
        "Inombolo yesazisi yangoku",
      notAvailable:
        "Ayifumaneki",
      correctDob:
        "Lungisa umhla wokuzalwa",
      dobDescription:
        "Oku kutshintsha kuphela amanani okuqala amathandathu e-YYMMDD. Amanye amanani asixhenxe ahlala engatshintshanga.",
      updateDob:
        "Hlaziya umhla wokuzalwa",
      updating:
        "Kuyahlaziywa...",
      correctFullId:
        "Lungisa inombolo yesazisi epheleleyo",
      fullIdDescription:
        "Sebenzisa oku kuphela xa namanye amanani ngaphandle komhla wokuzalwa engalunganga.",
      idPlaceholder:
        "Inombolo yesazisi yase-SA enamanani ali-13",
      updateFullId:
        "Hlaziya inombolo yesazisi",
      loginIdentifier:
        "Inombolo yakho yesazisi ikwasisazisi sakho sokungena.",
      selectDob:
        "Khetha umhla wokuzalwa.",
      dobUpdated:
        "Umhla wokuzalwa uhlaziyiwe.",
      dobUpdateError:
        "Asikwazanga ukuhlaziya umhla wokuzalwa.",
      invalidId:
        "Faka inombolo yesazisi yaseMzantsi Afrika enamanani ali-13 esebenzayo.",
      idUpdated:
        "Inombolo yesazisi epheleleyo ihlaziyiwe.",
      idUpdateError:
        "Asikwazanga ukuhlaziya inombolo yesazisi.",
    },

    api: {
      network:
        "Asikwazi ukufikelela kwiseva ye-PhilaLink. Jonga uqhagamshelo lwakho uze uzame kwakhona.",
      sessionExpired:
        "Iseshoni yakho iphelelwe lixesha. Nceda ungene kwakhona.",
      badRequest:
        "Isicelo asikwazanga ukugqitywa. Jonga iinkcukacha uze uzame kwakhona.",
      notFound:
        "Ulwazi oluceliweyo alufumanekanga.",
      conflict:
        "Esi senzo siyangqubana nolwazi lwamva nje. Hlaziya uze uzame kwakhona.",
      serverError:
        "Iseva ye-PhilaLink ayikwazanga ukugqiba isicelo.",
      requestFailed:
        "Isicelo asikwazanga ukugqitywa.",
      medicationIdRequired:
        "I-ID yeyeza iyafuneka.",
      appointmentIdRequired:
        "I-ID yedinga iyafuneka.",
      notificationIdRequired:
        "I-ID yesaziso iyafuneka.",
      messageRequired:
        "Umyalezo uyafuneka.",
    },

    cookies: {
      consentAria:
        "Imvume yeekuki",
      settings:
        "Iisetingi zeekuki",
      closeSettings:
        "Vala iisetingi zeekuki",
      intro:
        "Ungakhetha ukuba zeziphi iikuki ezinganyanzelekanga ezinokusetyenziswa yi-PhilaLink. Iikuki eziyimfuneko ziyafuneka ukuze isayithi isebenze.",
      whatTitle:
        "Zintoni iikuki?",
      whatBody1:
        "Iikuki ziifayile ezincinci ezigcinwa sisikhangeli sakho ukuze iisayithi zikhumbule ulwazi oluthile.",
      whatBody2:
        "I-PhilaLink isebenzisa iikuki ekusebenzeni kwesayithi nakwizinto ozikhethayo. Ulwazi lwezonyango alugcinwa kwifayile yemvume yeekuki.",
      preferencesTitle:
        "Zeziphi iikuki esizisebenzisayo?",
      essentialTitle:
        "Iikuki eziyimfuneko",
      essentialBody:
        "Zixhasa ukhuseleko kunye nemisebenzi ephambili ye-PhilaLink.",
      alwaysOn:
        "Zihlala zivuliwe",
      preferenceTitle:
        "Iikuki zezinto ozikhethayo",
      preferenceBody:
        "Zingakhumbula izinto ozikhethayo kwesi sixhobo.",
      whyTitle:
        "Kutheni sisebenzisa iikuki?",
      whyBody1:
        "I-PhilaLink isebenzisa iikuki eziyimfuneko ukuxhasa ukusebenza okukhuselekileyo.",
      whyBody2:
        "Asisebenzisi iikuki zentengiso kule nkqubo yemvume.",
      changeTitle:
        "Uzitshintsha njani iisetingi zeekuki?",
      changeBody1:
        "Ungabuyela kwiisetingi zeekuki nanini na.",
      changeBody2:
        "Ungazisusa neekuki usebenzisa iisetingi zabucala zesikhangeli.",
      thirdPartyTitle:
        "Abanye ababoneleli bazisebenzisa nini iikuki?",
      thirdPartyBody1:
        "Xa ungena ngeGoogle, iGoogle inokusebenzisa iikuki kwiinkonzo zayo.",
      thirdPartyBody2:
        "Ezo kuki zilawulwa yiGoogle kwaye zahlukile kwiikuki ze-PhilaLink.",
      essentialOnly:
        "Eziyimfuneko kuphela",
      saveSettings:
        "Gcina iisetingi",
      acceptAll:
        "Yamkela zonke iikuki",
      banner:
        "Iikuki zinceda i-PhilaLink isebenze kakuhle kwaye ikhumbule izinto ozikhethayo.",
    },

    chatbot: {
      floatingTooltip:
        "Umncedisi wakho wezempilo we-AI",
      openAssistant:
        "Vula umncedisi wezempilo we-PhilaChatBot",
      online:
        "Kwi-intanethi",
      assistantSubtitle:
        "Umncedisi wakho wezempilo we-PhilaLink",
      minimize:
        "Nciphisa",
      moreOptions:
        "Ezinye iinketho",
      chatOptions:
        "Iinketho zencoko",
      chatOptionsDescription:
        "Lawula incoko yakho ye-PhilaChatBot.",
      clearHistory:
        "Cima imbali yencoko",
      clearing:
        "Kuyacinywa...",
      clearDescription:
        "Qala incoko entsha ngaphandle kokucima iirekhodi zakho zezempilo.",
      waitForResponse:
        "Linda impendulo yangoku igqibe.",
      close:
        "Vala",
      clearConfirm:
        "Cima imbali yale ncoko?\n\nOku kuya kuqalisa incoko entsha. Iirekhodi zakho zezempilo aziyi kucinywa.",
      clearError:
        "Imbali yencoko ayikwazanga ukucinywa.",
      initialMessage:
        "Ndingakunceda njani? Ungabuza ngolwazi lwakho lwe-PhilaLink okanye ngolwazi lwezempilo.",
      noResponse:
        "Akukho mpendulo ibuyisiweyo.",
      processError:
        "Andikwazanga ukuqhuba lo myalezo ngoku.",
      welcomeTitle:
        "Molo, ndinguPhilaChatBot",
      welcomeBody:
        "Ndingumncedisi wakho wezempilo we-AI we-PhilaLink.",
      disclaimerTitle:
        "Isaziso esibalulekileyo",
      disclaimerBody:
        "I-PhilaChatBot inika ulwazi lwezempilo ngokubanzi kwaye ayithathi indawo kagqirha, umongikazi okanye usokhemisti.",
      understandContinue:
        "Ndiyaqonda — qhubeka",
      howCanHelp:
        "Ndingakunceda njani?",
      quickStartBody:
        "Ncokola noPhila okanye uqalise uvavanyo lweempawu.",
      quickChatTitle:
        "Ncokola noPhila",
      quickChatDescription:
        "Buza umbuzo wezempilo okanye ngolwazi lwakho lwe-PhilaLink.",
      quickSymptomsTitle:
        "Jonga iimpawu zam",
      quickSymptomsDescription:
        "Qalisa uvavanyo lwezempilo olukhokelwayo.",
      quickMedicationsTitle:
        "Amayeza am",
      quickMedicationsDescription:
        "Buza ngamayeza akho kunye nesitokhwe sakho esiseleyo.",
      quickMedicationsPrompt:
        "Ndixelele ngamayeza arekhodiweyo kwiprofayile yam ye-PhilaLink kunye nesitokhwe sam esiseleyo.",
      quickAllergiesTitle:
        "Izinto endingadibaniyo nazo",
      quickAllergiesDescription:
        "Buza ngolwazi lwe-allergy olurekhodiweyo.",
      quickAllergiesPrompt:
        "Zeziphi izinto endingadibaniyo nazo ezirekhodiweyo kwiprofayile yam ye-PhilaLink?",
      quickHelpTitle:
        "Ndifune nini uncedo?",
      quickHelpDescription:
        "Buza ngeempawu ezilumkisayo kunye noncedo olungxamisekileyo.",
      quickHelpPrompt:
        "Zeziphi iimpawu ezilumkisayo ezifuna uncedo olungxamisekileyo?",
      ageTitle:
        "Uneminyaka emingaphi?",
      ageDescription:
        "Ubudala bakho bunceda i-PhilaChatBot inike isikhokelo esifanelekileyo.",
      age:
        "Ubudala",
      agePlaceholder:
        "Faka ubudala bakho",
      ageInvalid:
        "Faka ubudala obuphakathi ko-1 no-120.",
      agePrivacy:
        "Olu lwazi lusetyenziswa kuphela kuvavanyo lweempawu.",
      symptomsTitle:
        "Zeziphi iimpawu onazo?",
      symptomsDescription:
        "Khetha zonke iimpawu ezifanelekileyo okanye wongeze enye.",
      addSymptom:
        "Yongeza olunye uphawu",
      symptomPlaceholder:
        "Bhala uphawu",
      addSymptomAria:
        "Yongeza uphawu",
      selectedSymptoms:
        "Iimpawu ezikhethiweyo",
      removeSymptom:
        "Susa {{item}}",
      seriousSymptoms:
        "Ezinye iimpawu zingaba yingozi. I-PhilaChatBot iza kuqala ngokujonga iimpawu zongxamiseko.",
      durationTitle:
        "Unezi mpawu ixesha elingakanani?",
      durationDescription:
        "Khetha ixesha elifanelekileyo.",
      specificDuration:
        "Faka ixesha elithile",
      duration:
        "Ixesha",
      enterNumber:
        "Faka inani",
      invalidDuration:
        "Faka ixesha elisebenzayo.",
      allergiesTitle:
        "Ngaba kukho izinto ongadibaniyo nazo?",
      allergiesDescription:
        "Ulwazi lwe-allergy lunceda ukuphepha iingcebiso zamayeza ezingakhuselekanga.",
      addAllergy:
        "Yongeza enye i-allergy",
      allergyPlaceholder:
        "Bhala i-allergy",
      addAllergyAria:
        "Yongeza i-allergy",
      selectedAllergies:
        "Ii-allergy ezikhethiweyo",
      removeAllergy:
        "Susa {{item}}",
      noAllergiesNote:
        "Ukuba akukho allergy uyaziyo, ungaqhubeka.",
      medicationsTitle:
        "Ngaba uthatha amayeza?",
      medicationsDescription:
        "Khetha amayeza kwiprofayile yakho okanye wongeze elinye.",
      yourMedications:
        "Amayeza akho e-PhilaLink",
      loadingMedications:
        "Kulayishwa amayeza akho...",
      noProfileMedications:
        "Akukho mayeza asebenzayo arekhodiweyo.",
      medicationLoadError:
        "Amayeza akho awakwazanga ukulayishwa.",
      selected:
        "Kukhethiwe",
      addMedication:
        "Yongeza elinye iyeza",
      medicationPlaceholder:
        "Igama leyeza",
      addMedicationAria:
        "Yongeza iyeza",
      selectedMedications:
        "Amayeza akhethiweyo",
      removeMedication:
        "Susa {{item}}",
      noMedicationNote:
        "Ukuba awuthathi mayeza, ungaqhubeka ngaphandle kokukhetha.",
      conditionsTitle:
        "Ngaba uneemeko zempilo ezikhoyo?",
      conditionsDescription:
        "Oku akunyanzelekanga kodwa kunceda ukwenza uvavanyo lufaneleke ngakumbi.",
      addCondition:
        "Yongeza enye imeko",
      conditionPlaceholder:
        "Igama lemeko",
      addConditionAria:
        "Yongeza imeko",
      selectedConditions:
        "Iimeko ezikhethiweyo",
      removeCondition:
        "Susa {{item}}",
      reviewBadge:
        "Hlola",
      reviewTitle:
        "Hlola ulwazi lwakho",
      reviewDescription:
        "Qinisekisa ukuba ulwazi luchanekile ngaphambi kokuqhubeka.",
      notSpecified:
        "Ayichazwanga",
      notProvided:
        "Ayibonelelwanga",
      noneSelected:
        "Akukho okukhethiweyo",
      noKnownAllergies:
        "Akukho allergy ikhethiweyo",
      currentMedications:
        "Amayeza angoku",
      medicalConditions:
        "Iimeko zempilo",
      edit:
        "Hlela {{item}}",
      reviewSafety:
        "I-PhilaChatBot iya kuqala ngokujonga iimpawu ezinzima ngaphambi kokulungiselela isikhokelo.",
      analyzeSymptoms:
        "Hlalutya iimpawu",
      loadingTitle:
        "I-PhilaLink ihlola iimpawu zakho",
      loadingDescription:
        "Uvavanyo lwakho luyacutshungulwa.",
      loadingDisclaimer:
        "Olu vavanyo lunika isikhokelo kwaye alusosigqibo sesifo.",
      stageSending:
        "Kuthunyelwa iimpawu ngokukhuselekileyo",
      stageWarningSigns:
        "Kujongwa iimpawu ezilumkisayo",
      stageRecording:
        "Kurekhodwa uvavanyo",
      stageResult:
        "Kulungiswa umphumo",
      emergency:
        "Ungxamiseko",
      urgent:
        "Kuyangxamiseka",
      nonEmergency:
        "Akungxamisekanga",
      assessmentComplete:
        "Uvavanyo lugqityiwe",
      emergencyTitle:
        "Funa uncedo lwezonyango olungxamisekileyo ngoku",
      emergencyDescription:
        "Enye okanye ngaphezulu kweempawu zakho ihambelana nophawu olunokuba yingozi.",
      emergencyRecommendation:
        "Isindululo songxamiseko",
      defaultEmergencyRecommendation:
        "Iimpawu zakho zingafuna uncedo lwezonyango ngokukhawuleza. Yiya kwiziko lezongxamiseko okanye ufune uncedo olungxamisekileyo.",
      warningSigns:
        "Iimpawu ezinzima zingabandakanya:",
      warningChestPain:
        "Iintlungu zesifuba",
      warningBreathing:
        "Ubunzima obukhulu bokuphefumla",
      warningConsciousness:
        "Ukulahlekelwa zingqondo",
      warningSeizure:
        "Ukuxhuzula",
      warningBleeding:
        "Ukopha kakhulu",
      warningStroke:
        "Iimpawu zestroke",
      warningAllergy:
        "Ukusabela kakhulu kwe-allergy",
      callEmergency:
        "Fowunela iinkonzo zongxamiseko",
      viewAssessment:
        "Bona iinkcukacha zovavanyo",
      anotherAssessment:
        "Qalisa olunye uvavanyo",
      emergencyFooter:
        "Musa ukulibazisa uncedo olungxamisekileyo ngenxa yokusebenzisa i-PhilaChatBot.",
      healthAssessment:
        "Uvavanyo lwezempilo",
      healthAssessmentDescription:
        "Lo mphumo wenziwe yinkonzo yovavanyo lwe-PhilaLink kwaye wagcinwa kwimbali yakho.",
      triageResult:
        "Umphumo wovavanyo",
      recommendation:
        "Isindululo",
      noRecommendation:
        "Akukho sindululo sibuyisiweyo.",
      symptomsSubmitted:
        "Iimpawu ezithunyelweyo",
      recorded:
        "Kurekhodwe: {{date}}",
      emergencyFollow:
        "Landela isindululo songxamiseko ngoko nangoko.",
      followUp:
        "Buza umbuzo olandelayo",
      menu:
        "Imenyu",
      chat:
        "Incoko",
      askPlaceholder:
        "Buza uPhila...",
      sendMessage:
        "Thumela umyalezo",
      followupDisclaimer:
        "I-PhilaChatBot ayithathi indawo yengcali yezempilo.",
      quickCause:
        "Yintoni enokubangela oku?",
      quickMonitor:
        "Ndimele ndijonge ntoni?",
      quickSupply:
        "Zingaphi iintsuku zamayeza eziseleyo?",
      errorNetworkTitle:
        "Asikwazanga ukudibanisa ne-PhilaChatBot",
      errorNetworkDescription:
        "Jonga uqhagamshelo lwakho uze uzame kwakhona.",
      errorUnavailableTitle:
        "I-PhilaChatBot ayifumaneki okwethutyana",
      errorUnavailableDescription:
        "Zama kwakhona kungekudala.",
      errorMissingTitle:
        "Kufuneka ulwazi olongezelelweyo",
      errorMissingDescription:
        "Hlola uvavanyo lwakho uze unike ulwazi olulahlekileyo.",
      tryAgain:
        "Zama kwakhona",
      emergencyInstead:
        "Xa kukho ungxamiseko lwezonyango, funa uncedo olungxamisekileyo.",
      back:
        "Emva",
      continue:
        "Qhubeka",
      review:
        "Hlola",

      fields: {
        age:
          "Ubudala",
        symptoms:
          "Iimpawu",
        duration:
          "Ixesha",
        allergies:
          "Ii-allergy",
        medications:
          "Amayeza angoku",
        conditions:
          "Iimeko zempilo",
      },
    },

    dynamic: {
      appointmentTypes: {
        routineCheckup:
          "Uvavanyo oluqhelekileyo",
        generalConsultation:
          "Ukubonana ngokubanzi",
        medicationReview:
          "Ukuhlolwa kwamayeza",
        chronicFollowup:
          "Ukulandelwa kwesifo esinganyangekiyo",
        followupVisit:
          "Utyelelo lokulandela",
        symptoms:
          "Iimpawu / Ukungaphili kakuhle",
        other:
          "Okunye",
        appointment:
          "Idinga",
      },

      recordTypes: {
        consultation:
          "Ukubonana",
        clinicalConsultation:
          "Ukubonana kwezonyango",
        laboratory:
          "Ilabhoratri",
        labResult:
          "Umphumo welabhoratri",
        test:
          "Uvavanyo",
        medication:
          "Iyeza",
        observation:
          "Uqwalaselo",
        vitals:
          "Iimpawu zomzimba",
        healthRecord:
          "Irekhodi lezempilo",
      },

      facilityTypes: {
        clinic:
          "Ikliniki",
        hospital:
          "Isibhedlele",
        healthCentre:
          "Iziko lezempilo",
        communityHealthCentre:
          "Iziko lezempilo loluntu",
      },

      directions: {
        left:
          "ekhohlo",
        right:
          "ekunene",
        straight:
          "ngqo",
        slightLeft:
          "kancinci ekhohlo",
        slightRight:
          "kancinci ekunene",
        sharpLeft:
          "kakhulu ekhohlo",
        sharpRight:
          "kakhulu ekunene",
        uturn:
          "jika ubuyele umva",
      },

      durationUnits: {
        hours:
          "Iiyure",
        days:
          "Iintsuku",
        weeks:
          "Iiveki",
        months:
          "Iinyanga",
      },

      durations: {
        lessThanDay:
          "Ngaphantsi kosuku olu-1",
        oneTwoDays:
          "Iintsuku ezi-1–2",
        threeSevenDays:
          "Iintsuku ezi-3–7",
        oneTwoWeeks:
          "Iiveki ezi-1–2",
        moreThanTwoWeeks:
          "Ngaphezulu kweeveki ezi-2",
        moreThanMonth:
          "Ngaphezulu kwenyanga e-1",
      },

      symptoms: {
        headache:
          "Intloko ebuhlungu",
        fever:
          "Umkhuhlane",
        cough:
          "Ukukhohlela",
        soreThroat:
          "Umqala obuhlungu",
        nausea:
          "Isicaphucaphu",
        vomiting:
          "Ukugabha",
        diarrhea:
          "Urhudo",
        stomachPain:
          "Iintlungu zesisu",
        backPain:
          "Iintlungu zomqolo",
        dizziness:
          "Ukuba nesiyezi",
        fatigue:
          "Ukudinwa",
        runnyNose:
          "Impumlo evuzayo",
        shortnessOfBreath:
          "Ukuphelelwa ngumoya",
        chestPain:
          "Iintlungu zesifuba",
      },

      allergies: {
        penicillin:
          "Penicillin",
        ibuprofen:
          "Ibuprofen",
        aspirin:
          "Aspirin",
        sulfonamides:
          "Sulfonamides",
        peanuts:
          "Amandongomane",
        shellfish:
          "Ukutya kwaselwandle",
        latex:
          "Latex",
      },

      conditions: {
        diabetes:
          "Isifo seswekile",
        hypertension:
          "Uxinzelelo lwegazi oluphezulu",
        asthma:
          "Isifuba",
        highCholesterol:
          "I-cholesterol ephezulu",
        heartDisease:
          "Isifo sentliziyo",
        kidneyDisease:
          "Isifo sezintso",
        epilepsy:
          "Isifo sokuwa",
      },

      statuses: {
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
        available:
          "Kuyafumaneka",
        final:
          "Okokugqibela",
        draft:
          "Uyilo",
      },

      providerRoles: {
        nurse:
          "UMongikazi",
        doctor:
          "UGqirha",
        pharmacist:
          "Usokhemisti",
        healthcareWorker:
          "Umsebenzi Wezempilo Oyintloko",
      },

      medicationForms: {
        tablet:
          "Ithebhulethi",
        capsule:
          "Ikhepsuli",
        syrup:
          "Isiraphu",
        liquid:
          "Ulwelo",
        injection:
          "Inaliti",
        cream:
          "Ikhrimu",
        ointment:
          "Amafutha",
        inhaler:
          "I-inhaler",
        drops:
          "Amathontsi",
        patch:
          "Ipatch",
      },

      healthMetrics: {
        bloodPressure:
          "Uxinzelelo lwegazi",
        weight:
          "Ubunzima",
        glucose:
          "Iswekile yegazi",
        temperature:
          "Iqondo lobushushu",
        heartRate:
          "Ukubetha kwentliziyo",
        bmi:
          "BMI",
        oxygenSaturation:
          "Ioksijini egazini",
      },
    },

    systemNotifications: {
      hot:
        "Icebiso lemozulu: Kulindeleke ubushushu. Sela amanzi aneleyo uze uphephe ubushushu obugqithisileyo.",
      cold:
        "Icebiso lemozulu: Kulindeleke ukubanda. Zigcine ushushu kwaye ugcine amayeza ngendlela eyalelweyo.",
      rain:
        "Icebiso lemozulu: Kulindeleke imvula okanye izaqhwithi. Cwangcisa ixesha elongezelelweyo xa usiya ekliniki.",
      wind:
        "Icebiso lemozulu: Kulindeleke umoya onamandla. Lumka xa uhamba.",
      medicationReminder:
        "Isikhumbuzo seyeza: {{medication}} licwangciselwe u-{{time}} ngo-{{date}}.",
      appointmentUpdate:
        "Uhlaziyo lwedinga: {{type}} yakho e-{{clinic}} inesimo esithi {{status}} ngo-{{date}}.",
      appointmentSoon:
        "Isikhumbuzo sedinga: {{type}} yakho e-{{clinic}} iqala ngo-{{time}} namhlanje.",
      appointmentReminder:
        "Isikhumbuzo sedinga: {{type}} yakho e-{{clinic}} icwangciselwe u-{{date}}.",
    },

    serverText: {
      emergencyAssessment:
        "Iimpawu zakho zingafuna uncedo lwezonyango olungxamisekileyo. Funa uncedo ngoku okanye uye kwiziko lezongxamiseko elikufutshane.",
      urgentAssessment:
        "Ezi mpawu kufuneka zihlolwe ngokukhawuleza yingcali yezempilo. Qhagamshelana nekliniki yakho okanye omnye umboneleli wezempilo.",
      breathingUrgent:
        "Iimpawu zokuphefumla kufuneka zihlolwe ngokukhawuleza yingcali yezempilo.",
      nonEmergencyAssessment:
        "Akukho phawu luyangxamiseka olufunyenweyo kulwazi olunikiweyo. Oku akusosigqibo sesifo. Qhubeka uqaphela iimpawu zakho.",
      chatbotEmergency:
        "Umyalezo wakho uquka iimpawu ezinokubonisa ungxamiseko lwezonyango. Funa uncedo olungxamisekileyo ngoku.",
      chatbotUrgent:
        "Umyalezo wakho uquka iimpawu ekufuneka zihlolwe ngokukhawuleza yingcali yezempilo.",
      chatbotUnavailable:
        "Andikwazi ukufikelela kumncedisi wezempilo ngoku. Zama kwakhona kungekudala.",
      chatbotNoResponse:
        "Andikwazanga ukuvelisa impendulo ngoku.",
    },
  },

  af: {
    weather: {
      weather:
        "Weer",
      loading:
        "Weer laai",
      locating:
        "Ligging word bepaal...",
      retry:
        "Probeer weer",
      unavailable:
        "Weer nie beskikbaar nie",
      currentLocation:
        "Huidige ligging",
      assignedClinicArea:
        "Toegewysde kliniekarea",
      weatherIn:
        "Weer in {{location}}",
      clinicAreaWeather:
        "Weer in kliniekarea: {{location}}",
      clinic:
        "Kliniek",
      currentLocationWeather:
        "Weer by huidige ligging",
      clinicWeather:
        "Kliniekweer",
      closeDetails:
        "Sluit weerbesonderhede",
      night:
        "Nag",
      day:
        "Dag",
      location:
        "Ligging",
      degreesCelsius:
        "{{temperature}} grade Celsius",
      deviceLocationFallback:
        "Jou toestelligging was nie beskikbaar nie, daarom wys PhilaLink die weer vir jou toegewysde kliniekarea.",
      locationUnavailable:
        "Ligging nie beskikbaar nie.",
      preciseLocationDenied:
        "Presiese liggingstoegang is geweier.",
      locationUndetermined:
        "Jou huidige ligging kon nie bepaal word nie.",
      locationTimeout:
        "Die liggingversoek het uitgetel.",
      locationServicesUnavailable:
        "Liggingdienste is nie beskikbaar nie.",
      invalidCoordinates:
        "Die blaaier het ongeldige liggingkoördinate teruggestuur.",

      condition: {
        clear:
          "Helder",
        partlyCloudy:
          "Gedeeltelik bewolk",
        overcast:
          "Bewolk",
        rain:
          "Reën",
        thunder:
          "Donderstorms",
        snow:
          "Sneeu",
        fog:
          "Mis",
        cloudy:
          "Bewolk",
      },
    },

    identity: {
      title:
        "Identiteitsbesonderhede",
      description:
        "Korrigeer jou geboortedatum of, wanneer nodig, vervang jou volledige Suid-Afrikaanse ID-nommer.",
      separateSave:
        "Identiteitsveranderings word apart van die res van jou profiel gestoor.",
      currentId:
        "Huidige ID-nommer",
      notAvailable:
        "Nie beskikbaar nie",
      correctDob:
        "Korrigeer geboortedatum",
      dobDescription:
        "Dit verander slegs die YYMMDD-voorvoegsel van jou huidige ID-nommer.",
      updateDob:
        "Werk geboortedatum by",
      updating:
        "Werk tans by...",
      correctFullId:
        "Korrigeer volledige ID-nommer",
      fullIdDescription:
        "Gebruik dit wanneer syfers buite die datumgedeelte ook verkeerd is.",
      idPlaceholder:
        "13-syfer SA ID-nommer",
      updateFullId:
        "Werk volledige ID-nommer by",
      loginIdentifier:
        "Jou SA ID-nommer is ook jou aanmeldidentifiseerder.",
      selectDob:
        "Kies 'n geboortedatum.",
      dobUpdated:
        "Geboortedatum is opgedateer.",
      dobUpdateError:
        "Kon nie die geboortedatum bywerk nie.",
      invalidId:
        "Voer 'n geldige 13-syfer Suid-Afrikaanse ID-nommer in.",
      idUpdated:
        "Volledige ID-nommer is opgedateer.",
      idUpdateError:
        "Kon nie die ID-nommer bywerk nie.",
    },

    api: {
      network:
        "Kan nie die PhilaLink-bediener bereik nie. Gaan jou verbinding na en probeer weer.",
      sessionExpired:
        "Jou sessie het verval. Meld asseblief weer aan.",
      badRequest:
        "Die versoek kon nie voltooi word nie. Kontroleer die inligting en probeer weer.",
      notFound:
        "Die aangevraagde inligting kon nie gevind word nie.",
      conflict:
        "Hierdie aksie bots met die jongste inligting. Verfris en probeer weer.",
      serverError:
        "Die PhilaLink-bediener kon nie die versoek voltooi nie.",
      requestFailed:
        "Die versoek kon nie voltooi word nie.",
      medicationIdRequired:
        "'n Medikasie-ID word vereis.",
      appointmentIdRequired:
        "'n Afspraak-ID word vereis.",
      notificationIdRequired:
        "'n Kennisgewing-ID word vereis.",
      messageRequired:
        "'n Boodskap word vereis.",
    },

    cookies: {
      consentAria:
        "Koekietoestemming",
      settings:
        "Koekie-instellings",
      closeSettings:
        "Sluit koekie-instellings",
      intro:
        "Jy kan kies watter opsionele koekies PhilaLink mag gebruik. Noodsaaklike koekies is nodig vir die webwerf om te werk.",
      whatTitle:
        "Wat is koekies?",
      whatBody1:
        "Koekies is klein tekslêers wat deur jou blaaier of toestel gestoor word.",
      whatBody2:
        "PhilaLink gebruik koekies vir webwerffunksies en opsionele voorkeure. Gesondheidsdata word nie in die toestemmingskoekie gestoor nie.",
      preferencesTitle:
        "Watter koekievoorkeure gebruik ons?",
      essentialTitle:
        "Noodsaaklike koekies",
      essentialBody:
        "Hierdie koekies ondersteun sekuriteit en kernfunksies.",
      alwaysOn:
        "Altyd aan",
      preferenceTitle:
        "Voorkeurkoekies",
      preferenceBody:
        "Hierdie kan opsionele blaaiervoorkeure onthou.",
      whyTitle:
        "Waarom gebruik ons koekies?",
      whyBody1:
        "PhilaLink gebruik noodsaaklike koekies vir veilige webwerffunksies.",
      whyBody2:
        "PhilaLink gebruik nie advertensiekoekies deur hierdie toestemmingsstelsel nie.",
      changeTitle:
        "Hoe verander jy jou koekievoorkeure?",
      changeBody1:
        "Jy kan enige tyd na Koekie-instellings terugkeer.",
      changeBody2:
        "Jy kan koekies ook in jou blaaier se privaatheidsinstellings verwyder.",
      thirdPartyTitle:
        "Wanneer gebruik derde partye koekies?",
      thirdPartyBody1:
        "Google kan sy eie koekies gebruik wanneer jy met Google aanmeld.",
      thirdPartyBody2:
        "Daardie koekies word deur Google beheer.",
      essentialOnly:
        "Slegs noodsaaklik",
      saveSettings:
        "Stoor instellings",
      acceptAll:
        "Aanvaar alle koekies",
      banner:
        "Koekies help PhilaLink om behoorlik te werk en jou voorkeure te onthou.",
    },

    chatbot: {
      floatingTooltip:
        "Jou KI-gesondheidsassistent",
      openAssistant:
        "Maak die PhilaChatBot-gesondheidsassistent oop",
      online:
        "Aanlyn",
      assistantSubtitle:
        "Jou PhilaLink-gesondheidsassistent",
      minimize:
        "Minimaliseer",
      moreOptions:
        "Meer opsies",
      chatOptions:
        "Kletsopsies",
      chatOptionsDescription:
        "Bestuur jou huidige PhilaChatBot-gesprek.",
      clearHistory:
        "Vee kletsgeskiedenis uit",
      clearing:
        "Vee tans uit...",
      clearDescription:
        "Begin 'n nuwe gesprek sonder om jou gesondheidsrekords te verwyder.",
      waitForResponse:
        "Wag totdat die huidige antwoord voltooi is.",
      close:
        "Sluit",
      clearConfirm:
        "Vee hierdie kletsgeskiedenis uit?\n\nDit sal 'n nuwe PhilaChatBot-gesprek begin. Jou gesondheidsrekords sal nie verwyder word nie.",
      clearError:
        "Kletsgeskiedenis kon nie uitgevee word nie.",
      initialMessage:
        "Hoe kan ek jou help? Jy kan oor jou PhilaLink-inligting of algemene gesondheid vra.",
      noResponse:
        "Geen antwoord is teruggestuur nie.",
      processError:
        "Ek kon daardie boodskap nie nou verwerk nie.",
      welcomeTitle:
        "Hallo, ek is PhilaChatBot",
      welcomeBody:
        "Ek is jou KI-gesondheidsassistent van PhilaLink.",
      disclaimerTitle:
        "Belangrike vrywaring",
      disclaimerBody:
        "PhilaChatBot bied algemene gesondheidsinligting en vervang nie 'n dokter, verpleegkundige, apteker of ander gesondheidswerker nie.",
      understandContinue:
        "Ek verstaan — gaan voort",
      howCanHelp:
        "Hoe kan ek help?",
      quickStartBody:
        "Gesels met Phila of begin 'n begeleide simptoomassessering.",
      quickChatTitle:
        "Gesels met Phila",
      quickChatDescription:
        "Vra 'n gesondheidsvraag of praat oor jou PhilaLink-inligting.",
      quickSymptomsTitle:
        "Kontroleer my simptome",
      quickSymptomsDescription:
        "Begin 'n begeleide gesondheidsassessering.",
      quickMedicationsTitle:
        "My medikasie",
      quickMedicationsDescription:
        "Vra oor jou medikasie en oorblywende voorraad.",
      quickMedicationsPrompt:
        "Vertel my van die medikasie in my PhilaLink-profiel en hoeveel voorraad ek oor het.",
      quickAllergiesTitle:
        "My allergieë",
      quickAllergiesDescription:
        "Vra oor allergie-inligting in jou profiel.",
      quickAllergiesPrompt:
        "Watter allergieë is in my PhilaLink-profiel aangeteken?",
      quickHelpTitle:
        "Wanneer moet ek hulp kry?",
      quickHelpDescription:
        "Vra oor waarskuwingstekens en wanneer dringende sorg nodig kan wees.",
      quickHelpPrompt:
        "Watter waarskuwingstekens vereis dringende of nood mediese hulp?",
      ageTitle:
        "Hoe oud is jy?",
      ageDescription:
        "Jou ouderdom help PhilaChatBot om meer gepaste algemene gesondheidsleiding te gee.",
      age:
        "Ouderdom",
      agePlaceholder:
        "Voer jou ouderdom in",
      ageInvalid:
        "Voer 'n ouderdom tussen 1 en 120 in.",
      agePrivacy:
        "PhilaChatBot gebruik hierdie inligting slegs as deel van jou simptoomassessering.",
      symptomsTitle:
        "Watter simptome ervaar jy?",
      symptomsDescription:
        "Kies alle simptome wat van toepassing is.",
      addSymptom:
        "Voeg nog 'n simptoom by",
      symptomPlaceholder:
        "Tik 'n simptoom",
      addSymptomAria:
        "Voeg simptoom by",
      selectedSymptoms:
        "Geselekteerde simptome",
      removeSymptom:
        "Verwyder {{item}}",
      seriousSymptoms:
        "Sommige gekose simptome kan ernstig wees. PhilaChatBot sal eers vir noodwaarskuwingstekens kyk.",
      durationTitle:
        "Hoe lank het jy hierdie simptome?",
      durationDescription:
        "Kies die opsie wat die duur die beste beskryf.",
      specificDuration:
        "Voer 'n spesifieke duur in",
      duration:
        "Duur",
      enterNumber:
        "Voer getal in",
      invalidDuration:
        "Voer 'n geldige duur in.",
      allergiesTitle:
        "Het jy enige bekende allergieë?",
      allergiesDescription:
        "Allergie-inligting help PhilaChatBot om onveilige medikasieleiding te vermy.",
      addAllergy:
        "Voeg nog 'n allergie by",
      allergyPlaceholder:
        "Tik allergie",
      addAllergyAria:
        "Voeg allergie by",
      selectedAllergies:
        "Geselekteerde allergieë",
      removeAllergy:
        "Verwyder {{item}}",
      noAllergiesNote:
        "As jy geen bekende allergieë het nie, kan jy voortgaan.",
      medicationsTitle:
        "Neem jy enige medikasie?",
      medicationsDescription:
        "Kies medikasie uit jou PhilaLink-profiel of voeg een by.",
      yourMedications:
        "Jou PhilaLink-medikasie",
      loadingMedications:
        "Medikasie laai...",
      noProfileMedications:
        "Geen aktiewe medikasie is tans aangeteken nie.",
      medicationLoadError:
        "Jou medikasie kon nie gelaai word nie.",
      selected:
        "Gekies",
      addMedication:
        "Voeg nog medikasie by",
      medicationPlaceholder:
        "Naam van medikasie",
      addMedicationAria:
        "Voeg medikasie by",
      selectedMedications:
        "Geselekteerde medikasie",
      removeMedication:
        "Verwyder {{item}}",
      noMedicationNote:
        "As jy tans geen medikasie neem nie, kan jy voortgaan.",
      conditionsTitle:
        "Het jy enige bestaande mediese toestande?",
      conditionsDescription:
        "Hierdie stap is opsioneel maar kan die assessering meer relevant maak.",
      addCondition:
        "Voeg nog 'n toestand by",
      conditionPlaceholder:
        "Naam van toestand",
      addConditionAria:
        "Voeg toestand by",
      selectedConditions:
        "Geselekteerde toestande",
      removeCondition:
        "Verwyder {{item}}",
      reviewBadge:
        "Hersien",
      reviewTitle:
        "Hersien jou inligting",
      reviewDescription:
        "Maak seker alles is korrek voordat jy voortgaan.",
      notSpecified:
        "Nie gespesifiseer nie",
      notProvided:
        "Nie verskaf nie",
      noneSelected:
        "Niks gekies nie",
      noKnownAllergies:
        "Geen bekende allergieë gekies nie",
      currentMedications:
        "Huidige medikasie",
      medicalConditions:
        "Mediese toestande",
      edit:
        "Wysig {{item}}",
      reviewSafety:
        "PhilaChatBot sal eers vir ernstige waarskuwingstekens kyk.",
      analyzeSymptoms:
        "Ontleed simptome",
      loadingTitle:
        "PhilaLink beoordeel jou simptome",
      loadingDescription:
        "Jou assessering word verwerk.",
      loadingDisclaimer:
        "Hierdie assessering bied triageleiding en is nie 'n diagnose nie.",
      stageSending:
        "Simptome word veilig gestuur",
      stageWarningSigns:
        "Waarskuwingstekens word nagegaan",
      stageRecording:
        "Assessering word aangeteken",
      stageResult:
        "Triage-resultaat word voorberei",
      emergency:
        "Noodgeval",
      urgent:
        "Dringend",
      nonEmergency:
        "Nie-noodgeval",
      assessmentComplete:
        "Assessering voltooi",
      emergencyTitle:
        "Kry nou nood mediese hulp",
      emergencyDescription:
        "Een of meer simptome pas by 'n ernstige waarskuwingsteken.",
      emergencyRecommendation:
        "Noodaanbeveling",
      defaultEmergencyRecommendation:
        "Jou simptome kan onmiddellike mediese aandag vereis. Kry nood mediese hulp of gaan na die naaste noodfasiliteit.",
      warningSigns:
        "Ernstige waarskuwingstekens kan insluit:",
      warningChestPain:
        "Borspyn",
      warningBreathing:
        "Erge asemhalingsprobleme",
      warningConsciousness:
        "Bewussynsverlies",
      warningSeizure:
        "Aanval",
      warningBleeding:
        "Erge bloeding",
      warningStroke:
        "Tekens van beroerte",
      warningAllergy:
        "Erge allergiese reaksie",
      callEmergency:
        "Bel nooddienste",
      viewAssessment:
        "Bekyk assesseringsbesonderhede",
      anotherAssessment:
        "Begin nog 'n assessering",
      emergencyFooter:
        "Moenie noodsorg uitstel terwyl jy PhilaChatBot gebruik nie.",
      healthAssessment:
        "Gesondheidsassessering",
      healthAssessmentDescription:
        "Hierdie resultaat is deur die PhilaLink-assesseringsdiens gegenereer en in jou geskiedenis aangeteken.",
      triageResult:
        "Triage-resultaat",
      recommendation:
        "Aanbeveling",
      noRecommendation:
        "Geen aanbeveling is teruggestuur nie.",
      symptomsSubmitted:
        "Simptome ingedien",
      recorded:
        "Aangeteken: {{date}}",
      emergencyFollow:
        "Volg die noodaanbeveling hierbo onmiddellik.",
      followUp:
        "Vra 'n opvolgvraag",
      menu:
        "Kieslys",
      chat:
        "Klets",
      askPlaceholder:
        "Vra Phila enigiets...",
      sendMessage:
        "Stuur boodskap",
      followupDisclaimer:
        "PhilaChatBot vervang nie 'n gesondheidswerker nie.",
      quickCause:
        "Wat kan dit veroorsaak?",
      quickMonitor:
        "Wat moet ek monitor?",
      quickSupply:
        "Hoeveel dae se medikasie het ek oor?",
      errorNetworkTitle:
        "Ons kon nie met PhilaChatBot verbind nie",
      errorNetworkDescription:
        "Gaan jou internetverbinding na en probeer weer.",
      errorUnavailableTitle:
        "PhilaChatBot is tydelik nie beskikbaar nie",
      errorUnavailableDescription:
        "Probeer asseblief later weer.",
      errorMissingTitle:
        "Meer inligting word benodig",
      errorMissingDescription:
        "Hersien jou assessering en verskaf die ontbrekende inligting.",
      tryAgain:
        "Probeer weer",
      emergencyInstead:
        "In 'n mediese noodgeval, kontak nooddienste onmiddellik.",
      back:
        "Terug",
      continue:
        "Gaan voort",
      review:
        "Hersien",

      fields: {
        age:
          "Ouderdom",
        symptoms:
          "Simptome",
        duration:
          "Duur",
        allergies:
          "Allergieë",
        medications:
          "Huidige medikasie",
        conditions:
          "Mediese toestande",
      },
    },

    dynamic: {
      appointmentTypes: {
        routineCheckup:
          "Roetine-ondersoek",
        generalConsultation:
          "Algemene konsultasie",
        medicationReview:
          "Medikasie-oorsig",
        chronicFollowup:
          "Chroniese sorg-opvolg",
        followupVisit:
          "Opvolgbesoek",
        symptoms:
          "Simptome / Voel ongesteld",
        other:
          "Ander",
        appointment:
          "Afspraak",
      },

      recordTypes: {
        consultation:
          "Konsultasie",
        clinicalConsultation:
          "Kliniese konsultasie",
        laboratory:
          "Laboratorium",
        labResult:
          "Laboratoriumuitslag",
        test:
          "Toets",
        medication:
          "Medikasie",
        observation:
          "Waarneming",
        vitals:
          "Vitale tekens",
        healthRecord:
          "Gesondheidsrekord",
      },

      facilityTypes: {
        clinic:
          "Kliniek",
        hospital:
          "Hospitaal",
        healthCentre:
          "Gesondheidsentrum",
        communityHealthCentre:
          "Gemeenskapsgesondheidsentrum",
      },

      directions: {
        left:
          "links",
        right:
          "regs",
        straight:
          "reguit",
        slightLeft:
          "effens links",
        slightRight:
          "effens regs",
        sharpLeft:
          "skerp links",
        sharpRight:
          "skerp regs",
        uturn:
          "U-draai",
      },

      durationUnits: {
        hours:
          "Ure",
        days:
          "Dae",
        weeks:
          "Weke",
        months:
          "Maande",
      },

      durations: {
        lessThanDay:
          "Minder as 1 dag",
        oneTwoDays:
          "1–2 dae",
        threeSevenDays:
          "3–7 dae",
        oneTwoWeeks:
          "1–2 weke",
        moreThanTwoWeeks:
          "Meer as 2 weke",
        moreThanMonth:
          "Meer as 1 maand",
      },

      symptoms: {
        headache:
          "Hoofpyn",
        fever:
          "Koors",
        cough:
          "Hoes",
        soreThroat:
          "Seer keel",
        nausea:
          "Naarheid",
        vomiting:
          "Braking",
        diarrhea:
          "Diarree",
        stomachPain:
          "Maagpyn",
        backPain:
          "Rugpyn",
        dizziness:
          "Duiseligheid",
        fatigue:
          "Moegheid",
        runnyNose:
          "Loopneus",
        shortnessOfBreath:
          "Kortasem",
        chestPain:
          "Borspyn",
      },

      allergies: {
        penicillin:
          "Penisillien",
        ibuprofen:
          "Ibuprofen",
        aspirin:
          "Aspirien",
        sulfonamides:
          "Sulfonamiede",
        peanuts:
          "Grondboontjies",
        shellfish:
          "Skulpvis",
        latex:
          "Lateks",
      },

      conditions: {
        diabetes:
          "Diabetes",
        hypertension:
          "Hipertensie",
        asthma:
          "Asma",
        highCholesterol:
          "Hoë cholesterol",
        heartDisease:
          "Hartsiekte",
        kidneyDisease:
          "Niersiekte",
        epilepsy:
          "Epilepsie",
      },

      statuses: {
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
        available:
          "Beskikbaar",
        final:
          "Finaal",
        draft:
          "Konsep",
      },

      providerRoles: {
        nurse:
          "Verpleegkundige",
        doctor:
          "Dokter",
        pharmacist:
          "Apteker",
        healthcareWorker:
          "Primêre Gesondheidswerker",
      },

      medicationForms: {
        tablet:
          "Tablet",
        capsule:
          "Kapsule",
        syrup:
          "Stroop",
        liquid:
          "Vloeistof",
        injection:
          "Inspuiting",
        cream:
          "Room",
        ointment:
          "Salf",
        inhaler:
          "Inhaleerder",
        drops:
          "Druppels",
        patch:
          "Pleister",
      },

      healthMetrics: {
        bloodPressure:
          "Bloeddruk",
        weight:
          "Gewig",
        glucose:
          "Bloedglukose",
        temperature:
          "Temperatuur",
        heartRate:
          "Hartklop",
        bmi:
          "BMI",
        oxygenSaturation:
          "Suurstofversadiging",
      },
    },

    systemNotifications: {
      hot:
        "Weergesondheidswenk: Warm toestande word verwag. Bly gehidreer en vermy langdurige hitteblootstelling.",
      cold:
        "Weergesondheidswenk: Koue toestande word verwag. Bly warm en bêre medikasie volgens die instruksies.",
      rain:
        "Weergesondheidswenk: Reën of storms word verwag. Beplan ekstra reistyd.",
      wind:
        "Weergesondheidswenk: Sterk wind word verwag. Wees versigtig wanneer jy reis.",
      medicationReminder:
        "Medikasieherinnering: {{medication}} is vir {{time}} op {{date}} geskeduleer.",
      appointmentUpdate:
        "Afspraakopdatering: Jou {{type}} by {{clinic}} is {{status}} vir {{date}}.",
      appointmentSoon:
        "Afspraakherinnering: Jou {{type}} by {{clinic}} begin vandag om {{time}}.",
      appointmentReminder:
        "Afspraakherinnering: Jou {{type}} by {{clinic}} is vir {{date}} geskeduleer.",
    },

    serverText: {
      emergencyAssessment:
        "Jou simptome kan onmiddellike mediese aandag vereis. Kry nou nood mediese hulp of gaan na die naaste noodfasiliteit.",
      urgentAssessment:
        "Hierdie simptome moet binnekort deur 'n gesondheidswerker beoordeel word.",
      breathingUrgent:
        "Asemhalingsimptome moet dringend deur 'n gesondheidswerker beoordeel word.",
      nonEmergencyAssessment:
        "Geen nood- of dringende waarskuwingsteken is uit die gegewe inligting opgespoor nie. Dit is nie 'n diagnose nie.",
      chatbotEmergency:
        "Jou boodskap bevat inligting wat op 'n mediese noodgeval kan dui. Kry onmiddellik nood mediese hulp.",
      chatbotUrgent:
        "Jou boodskap bevat simptome wat dringend deur 'n gesondheidswerker beoordeel moet word.",
      chatbotUnavailable:
        "Ek kan nie nou toegang tot die gesondheidsassistent kry nie. Probeer asseblief later weer.",
      chatbotNoResponse:
        "Ek kon nie nou 'n antwoord genereer nie.",
    },
  },
};

const otherLanguages = {
  nso: {
    name:
      "Sepedi",

    generic: {
      retry:
        "Leka gape",
      close:
        "Tswalela",
      save:
        "Boloka",
      loading:
        "Go a laišwa...",
      unavailable:
        "Ga e hwetšagale",
      error:
        "Tiro ga se ya kgona go phethwa.",
      yes:
        "Ee",
      no:
        "Aowa",
    },

    api: {
      network:
        "Ga re kgone go fihlelela seva ya PhilaLink. Lekola kgokagano ya gago gomme o leke gape.",
      sessionExpired:
        "Nako ya gago ya go tsena e fedile. Tsena gape.",
      badRequest:
        "Kgopelo ga se ya kgona go phethwa. Lekola tshedimošo gomme o leke gape.",
      notFound:
        "Tshedimošo ye e kgopetšwego ga se ya hwetšwa.",
      conflict:
        "Kgato ye e thulana le tshedimošo ya moragorago. Mpshafatša gomme o leke gape.",
      serverError:
        "Seva ya PhilaLink ga se ya kgona go phetha kgopelo.",
      requestFailed:
        "Kgopelo ga se ya kgona go phethwa.",
      medicationIdRequired:
        "ID ya sehlare e a nyakega.",
      appointmentIdRequired:
        "ID ya peelo e a nyakega.",
      notificationIdRequired:
        "ID ya tsebišo e a nyakega.",
      messageRequired:
        "Molaetša o a nyakega.",
    },
  },

  tn: {
    name:
      "Setswana",

    generic: {
      retry:
        "Leka gape",
      close:
        "Tswala",
      save:
        "Boloka",
      loading:
        "Go a laisiwa...",
      unavailable:
        "Ga e teng",
      error:
        "Tiro ga e a kgona go wediwa.",
      yes:
        "Ee",
      no:
        "Nnyaa",
    },

    api: {
      network:
        "Ga re kgone go fitlhelela seva ya PhilaLink. Lekola kgolagano ya gago mme o leke gape.",
      sessionExpired:
        "Nako ya gago ya go tsena e fedile. Tsena gape.",
      badRequest:
        "Kopo ga e a kgona go wediwa. Lekola tshedimosetso mme o leke gape.",
      notFound:
        "Tshedimosetso e e kopilweng ga e a bonwa.",
      conflict:
        "Kgato eno e thulana le tshedimosetso ya bosheng. Ntšhwafatsa mme o leke gape.",
      serverError:
        "Seva ya PhilaLink ga e a kgona go wetsa kopo.",
      requestFailed:
        "Kopo ga e a kgona go wediwa.",
      medicationIdRequired:
        "ID ya molemo e a tlhokega.",
      appointmentIdRequired:
        "ID ya peelo e a tlhokega.",
      notificationIdRequired:
        "ID ya kitsiso e a tlhokega.",
      messageRequired:
        "Molaetsa o a tlhokega.",
    },
  },

  st: {
    name:
      "Sesotho",

    generic: {
      retry:
        "Leka hape",
      close:
        "Koala",
      save:
        "Boloka",
      loading:
        "E ntse e jarisoa...",
      unavailable:
        "Ha e fumanehe",
      error:
        "Ketso ha ea khona ho phethoa.",
      yes:
        "Ee",
      no:
        "Che",
    },

    api: {
      network:
        "Ha re khone ho fihlela seva ea PhilaLink. Hlahloba khokahano ea hau ebe u leka hape.",
      sessionExpired:
        "Nako ea hau ea ho kena e felile. Kena hape.",
      badRequest:
        "Kopo ha ea khona ho phethoa. Hlahloba lintlha ebe u leka hape.",
      notFound:
        "Tlhahisoleseling e kopiloeng ha ea fumanoa.",
      conflict:
        "Ketso ena e hanana le lintlha tsa morao-rao. Ntlafatsa ebe u leka hape.",
      serverError:
        "Seva ea PhilaLink ha ea khona ho phetha kopo.",
      requestFailed:
        "Kopo ha ea khona ho phethoa.",
      medicationIdRequired:
        "ID ea moriana ea hlokahala.",
      appointmentIdRequired:
        "ID ea kopano ea hlokahala.",
      notificationIdRequired:
        "ID ea tsebiso ea hlokahala.",
      messageRequired:
        "Molaetsa oa hlokahala.",
    },
  },

  ts: {
    name:
      "XiTsonga",

    generic: {
      retry:
        "Ringeta nakambe",
      close:
        "Pfala",
      save:
        "Hlayisa",
      loading:
        "Ku layicha...",
      unavailable:
        "A swi kumeki",
      error:
        "Xikombelo a xi kotekanga.",
      yes:
        "Ina",
      no:
        "E-e",
    },

    api: {
      network:
        "A hi koti ku fikelela seva ya PhilaLink. Languta vuhlanganisi bya wena kutani u ringeta nakambe.",
      sessionExpired:
        "Nkarhi wa wena wo nghena wu herile. Nghena nakambe.",
      badRequest:
        "Xikombelo a xi kotekanga. Languta vuxokoxoko kutani u ringeta nakambe.",
      notFound:
        "Vuxokoxoko leswi komberiweke a byi kumekanga.",
      conflict:
        "Xiendlo lexi xi lwisana ni vuxokoxoko bya sweswi. Pfuxeta kutani u ringeta nakambe.",
      serverError:
        "Seva ya PhilaLink a yi kotanga ku hetisa xikombelo.",
      requestFailed:
        "Xikombelo a xi kotekanga.",
      medicationIdRequired:
        "ID ya murhi ya laveka.",
      appointmentIdRequired:
        "ID ya nhlangano ya laveka.",
      notificationIdRequired:
        "ID ya xitiviso ya laveka.",
      messageRequired:
        "Hungu ra laveka.",
    },
  },

  ss: {
    name:
      "siSwati",

    generic: {
      retry:
        "Zama futsi",
      close:
        "Vala",
      save:
        "Gcina",
      loading:
        "Kuyalayishwa...",
      unavailable:
        "Akutfolakali",
      error:
        "Sicelo asikakhoni kuphumelela.",
      yes:
        "Yebo",
      no:
        "Cha",
    },

    api: {
      network:
        "Asikhoni kufinyelela kuseva ye-PhilaLink. Hlola kuxhumeka kwakho bese uzama futsi.",
      sessionExpired:
        "Sikhatsi sakho sekungena sesiphelile. Ngena futsi.",
      badRequest:
        "Sicelo asikakhoni kuphumelela. Hlola imininingwane bese uzama futsi.",
      notFound:
        "Imininingwane leceliwe ayikatfolakali.",
      conflict:
        "Lesento siphikisana nemininingwane yakamuva. Vuselela bese uzama futsi.",
      serverError:
        "Iseva ye-PhilaLink ayikakhoni kuphumelelisa sicelo.",
      requestFailed:
        "Sicelo asikakhoni kuphumelela.",
      medicationIdRequired:
        "I-ID yemutsi iyadzingeka.",
      appointmentIdRequired:
        "I-ID yesikhatsi sekubonana iyadzingeka.",
      notificationIdRequired:
        "I-ID yesatiso iyadzingeka.",
      messageRequired:
        "Umlayeto uyadzingeka.",
    },
  },

  ve: {
    name:
      "Tshivenda",

    generic: {
      retry:
        "Lingedzani hafhu",
      close:
        "Valani",
      save:
        "Vhulungani",
      loading:
        "Hu khou laišwa...",
      unavailable:
        "A zwi wanali",
      error:
        "Khumbelo a yo ngo kona u fhedzwa.",
      yes:
        "Ee",
      no:
        "Hai",
    },

    api: {
      network:
        "A ri koni u swikelela seva ya PhilaLink. Sedzani vhukwamani haṋu ni lingedze hafhu.",
      sessionExpired:
        "Tshifhinga tshaṋu tsha u dzhena tsho fhela. Dzhena hafhu.",
      badRequest:
        "Khumbelo a yo ngo kona u fhedzwa. Sedzani zwidodombedzwa ni lingedze hafhu.",
      notFound:
        "Zwidodombedzwa zwo humbelwaho a zwo ngo wanala.",
      conflict:
        "Hei nyito i khou lwisana na zwidodombedzwa zwa zwino. Mvusulusani ni lingedze hafhu.",
      serverError:
        "Seva ya PhilaLink a yo ngo kona u fhedza khumbelo.",
      requestFailed:
        "Khumbelo a yo ngo kona u fhedzwa.",
      medicationIdRequired:
        "ID ya mushonga i a ṱoḓea.",
      appointmentIdRequired:
        "ID ya mutangano i a ṱoḓea.",
      notificationIdRequired:
        "ID ya nḓivhadzo i a ṱoḓea.",
      messageRequired:
        "Mulaedza u a ṱoḓea.",
    },
  },

  nr: {
    name:
      "isiNdebele",

    generic: {
      retry:
        "Zama godu",
      close:
        "Vala",
      save:
        "Bulunga",
      loading:
        "Kuyalayishwa...",
      unavailable:
        "Akutholakali",
      error:
        "Isibawo asikaphumeleli.",
      yes:
        "Iye",
      no:
        "Awa",
    },

    api: {
      network:
        "Asikwazi ukufikelela kuseva ye-PhilaLink. Hlola ukuxhumana kwakho bese uzama godu.",
      sessionExpired:
        "Isikhathi sakho sokungena siphelile. Ngena godu.",
      badRequest:
        "Isibawo asikaphumeleli. Hlola imininingwana bese uzama godu.",
      notFound:
        "Imininingwana eceliweko ayikatholakali.",
      conflict:
        "Isenzo lesi siphikisana nemininingwana yakamuva. Vuselela bese uzama godu.",
      serverError:
        "Iseva ye-PhilaLink ayikghonanga ukuqeda isibawo.",
      requestFailed:
        "Isibawo asikaphumeleli.",
      medicationIdRequired:
        "I-ID yomuthi iyafuneka.",
      appointmentIdRequired:
        "I-ID yesikhathi sokubonana iyafuneka.",
      notificationIdRequired:
        "I-ID yesaziso iyafuneka.",
      messageRequired:
        "Umlayezo uyafuneka.",
    },
  },
};

function buildSothoTswanaExperience(
  code
) {
  const lang =
    otherLanguages[
      code
    ];

  const setswana =
    code ===
    "tn";

  const sesotho =
    code ===
    "st";

  const text = (
    nso,
    tn,
    st
  ) =>
    setswana
      ? tn
      : sesotho
      ? st
      : nso;

  return {
    api:
      lang.api,

    weather: {
      weather:
        text(
          "Boemo bja leratadima",
          "Maemo a bosa",
          "Boemo ba leholimo"
        ),
      loading:
        lang.generic.loading,
      locating:
        text(
          "Go nyakwa lefelo...",
          "Go batliwa lefelo...",
          "Sebaka se ntse se batloa..."
        ),
      retry:
        lang.generic.retry,
      unavailable:
        lang.generic.unavailable,
      currentLocation:
        text(
          "Lefelo la gago la bjale",
          "Lefelo la gago la jaanong",
          "Sebaka sa hau sa hajoale"
        ),
      assignedClinicArea:
        text(
          "Tikologo ya kliniki ye o e abetšwego",
          "Lefelo la tliliniki e o e abetsweng",
          "Sebaka sa tleliniki eo u e abetsoeng"
        ),
      weatherIn:
        text(
          "Boemo bja leratadima kua {{location}}",
          "Maemo a bosa kwa {{location}}",
          "Boemo ba leholimo {{location}}"
        ),
      clinicAreaWeather:
        text(
          "Boemo bja leratadima bja tikologo ya kliniki: {{location}}",
          "Maemo a bosa a lefelo la tliliniki: {{location}}",
          "Boemo ba leholimo sebakeng sa tleliniki: {{location}}"
        ),
      clinic:
        text(
          "Kliniki",
          "Tliliniki",
          "Tleliniki"
        ),
      currentLocationWeather:
        text(
          "Boemo bja leratadima lefelong la gago",
          "Maemo a bosa mo lefelong la gago",
          "Boemo ba leholimo sebakeng sa hau"
        ),
      clinicWeather:
        text(
          "Boemo bja leratadima bja kliniki",
          "Maemo a bosa a tliliniki",
          "Boemo ba leholimo ba tleliniki"
        ),
      closeDetails:
        lang.generic.close,
      night:
        text(
          "Bošego",
          "Bosigo",
          "Bosiu"
        ),
      day:
        text(
          "Mosegare",
          "Motshegare",
          "Motšehare"
        ),
      location:
        text(
          "Lefelo",
          "Lefelo",
          "Sebaka"
        ),
      degreesCelsius:
        "{{temperature}} °C",
      deviceLocationFallback:
        text(
          "Lefelo la sedirišwa sa gago ga se la hwetšwa, ka fao PhilaLink e bontšha boemo bja leratadima bja kliniki ya gago.",
          "Lefelo la sedirisiwa sa gago ga le a bonwa, ka jalo PhilaLink e bontsha maemo a bosa a lefelo la tliliniki ya gago.",
          "Sebaka sa sesebelisoa sa hau ha sea fumanoa, kahoo PhilaLink e bontša boemo ba leholimo ba tleliniki ea hau."
        ),
      locationUnavailable:
        lang.generic.unavailable,
      preciseLocationDenied:
        text(
          "Phihlelelo ya lefelo le le nepagetšego e ganeditšwe.",
          "Phitlhelelo ya lefelo le le nepileng e gannwe.",
          "Phihlello ea sebaka se nepahetseng e hanetsoe."
        ),
      locationUndetermined:
        text(
          "Lefelo la gago la bjale ga se la kgona go hwetšwa.",
          "Lefelo la gago la jaanong ga le a kgona go bonwa.",
          "Sebaka sa hau sa hajoale ha sea khona ho fumanoa."
        ),
      locationTimeout:
        text(
          "Kgopelo ya lefelo e feletšwe ke nako.",
          "Kopo ya lefelo e feletswe ke nako.",
          "Kopo ea sebaka e felletsoe ke nako."
        ),
      locationServicesUnavailable:
        lang.generic.unavailable,
      invalidCoordinates:
        lang.generic.error,

      condition: {
        clear:
          text(
            "Go hlakile",
            "Go apogile",
            "Ho hlakile"
          ),
        partlyCloudy:
          text(
            "Maru a se makae",
            "Maru a se kae",
            "Maru a seng makae"
          ),
        overcast:
          text(
            "Go aparetšwe ke maru",
            "Go apesitswe ke maru",
            "Ho koahetsoe ke maru"
          ),
        rain:
          text(
            "Pula",
            "Pula",
            "Pula"
          ),
        thunder:
          text(
            "Madimo",
            "Dikgadima",
            "Diaduma"
          ),
        snow:
          text(
            "Lehlwa",
            "Kapoko",
            "Lehloa"
          ),
        fog:
          text(
            "Mouwane",
            "Mouwane",
            "Moholi"
          ),
        cloudy:
          text(
            "Go na le maru",
            "Go maru",
            "Ho maru"
          ),
      },
    },

    identity: {
      title:
        text(
          "Dintlha tša boitsebišo",
          "Dintlha tsa boitshupo",
          "Lintlha tsa boitsebiso"
        ),
      description:
        text(
          "Lokiša letšatši la gago la matswalo goba nomoro ya ID ya Afrika Borwa.",
          "Baakanya letsatsi la gago la botsalo kgotsa nomoro ya ID ya Aforika Borwa.",
          "Lokisa letsatsi la hau la tsoalo kapa nomoro ea ID ea Afrika Borwa."
        ),
      separateSave:
        text(
          "Diphetogo tša boitsebišo di bolokwa ka thoko.",
          "Diphetogo tsa boitshupo di bolokwa ka thoko.",
          "Liphetoho tsa boitsebiso li bolokoa ka thoko."
        ),
      currentId:
        "ID",
      notAvailable:
        lang.generic.unavailable,
      correctDob:
        text(
          "Lokiša letšatši la matswalo",
          "Baakanya letsatsi la botsalo",
          "Lokisa letsatsi la tsoalo"
        ),
      dobDescription:
        text(
          "Se se fetola feela dinomoro tša mathomo tše tshela tša YYMMDD.",
          "Seno se fetola fela dinomoro tsa ntlha tse thataro tsa YYMMDD.",
          "Sena se fetola feela linomoro tse tšeletseng tsa pele tsa YYMMDD."
        ),
      updateDob:
        text(
          "Mpshafatša letšatši la matswalo",
          "Ntšhwafatsa letsatsi la botsalo",
          "Ntlafatsa letsatsi la tsoalo"
        ),
      updating:
        lang.generic.loading,
      correctFullId:
        text(
          "Lokiša ID ka botlalo",
          "Baakanya ID yotlhe",
          "Lokisa ID ka botlalo"
        ),
      fullIdDescription:
        text(
          "Diriša se ge dinomoro tše dingwe tša ID le tšona di fošagetše.",
          "Dirisa seno fa dinomoro tse dingwe tsa ID le tsone di fosagetse.",
          "Sebelisa sena haeba linomoro tse ling tsa ID le tsona li fosahetse."
        ),
      idPlaceholder:
        "ID ya SA ya dinomoro tše 13",
      updateFullId:
        text(
          "Mpshafatša ID",
          "Ntšhwafatsa ID",
          "Ntlafatsa ID"
        ),
      loginIdentifier:
        text(
          "ID ya gago gape ke leina la gago la go tsena.",
          "ID ya gago gape ke sesupo sa gago sa go tsena.",
          "ID ea hau hape ke sesupo sa hau sa ho kena."
        ),
      selectDob:
        text(
          "Kgetha letšatši la matswalo.",
          "Tlhopha letsatsi la botsalo.",
          "Khetha letsatsi la tsoalo."
        ),
      dobUpdated:
        text(
          "Letšatši la matswalo le mpshafaditšwe.",
          "Letsatsi la botsalo le ntšhwafaditswe.",
          "Letsatsi la tsoalo le ntlafalitsoe."
        ),
      dobUpdateError:
        lang.generic.error,
      invalidId:
        text(
          "Tsenya ID ya Afrika Borwa ya dinomoro tše 13 ye e nepagetšego.",
          "Tsenya ID ya Aforika Borwa ya dinomoro di le 13 e e nepagetseng.",
          "Kenya ID ea Afrika Borwa ea linomoro tse 13 e nepahetseng."
        ),
      idUpdated:
        text(
          "ID e mpshafaditšwe.",
          "ID e ntšhwafaditswe.",
          "ID e ntlafalitsoe."
        ),
      idUpdateError:
        lang.generic.error,
    },

    cookies: {
      consentAria:
        text(
          "Tumelelo ya dikhukhi",
          "Tetla ya dikhukhi",
          "Tumello ea dikhukhi"
        ),
      settings:
        text(
          "Dipeakanyo tša dikhukhi",
          "Dithulaganyo tsa dikhukhi",
          "Litlhophiso tsa dikhukhi"
        ),
      closeSettings:
        lang.generic.close,
      intro:
        text(
          "O ka kgetha dikhukhi tša boikgethelo tšeo PhilaLink e ka di dirišago. Dikhukhi tša bohlokwa di a nyakega.",
          "O ka tlhopha dikhukhi tsa boikgethelo tse PhilaLink e ka di dirisang. Dikhukhi tsa botlhokwa di a tlhokega.",
          "U ka khetha dikhukhi tsa boikhethelo tseo PhilaLink e ka li sebelisang. Dikhukhi tsa bohlokoa lia hlokahala."
        ),
      whatTitle:
        text(
          "Dikhukhi ke eng?",
          "Dikhukhi ke eng?",
          "Dikhukhi ke eng?"
        ),
      whatBody1:
        text(
          "Dikhukhi ke difaele tše nnyane tšeo sebatli se di bolokago.",
          "Dikhukhi ke difaele tse dinnye tse sebatli se di bolokang.",
          "Dikhukhi ke difaele tse nyane tseo sebatli se li bolokang."
        ),
      whatBody2:
        text(
          "PhilaLink e diriša dikhukhi bakeng sa tshepedišo ya weposaete le dikgetho.",
          "PhilaLink e dirisa dikhukhi bakeng sa tiro ya webosaete le dikgetho.",
          "PhilaLink e sebelisa dikhukhi bakeng sa ts'ebetso ea sebaka le likhetho."
        ),
      preferencesTitle:
        text(
          "Re diriša dikhukhi dife?",
          "Re dirisa dikhukhi dife?",
          "Re sebelisa dikhukhi life?"
        ),
      essentialTitle:
        text(
          "Dikhukhi tša bohlokwa",
          "Dikhukhi tsa botlhokwa",
          "Dikhukhi tsa bohlokoa"
        ),
      essentialBody:
        text(
          "Di thekga tšhireletšo le mešomo ya bohlokwa.",
          "Di tshegetsa tshireletso le ditiro tsa botlhokwa.",
          "Li tšehetsa tšireletso le mesebetsi ea bohlokoa."
        ),
      alwaysOn:
        text(
          "Di dula di buletšwe",
          "Di nna di butswe",
          "Li lula li buletsoe"
        ),
      preferenceTitle:
        text(
          "Dikhukhi tša dikgetho",
          "Dikhukhi tsa dikgetho",
          "Dikhukhi tsa likhetho"
        ),
      preferenceBody:
        text(
          "Di ka gopola dikgetho tša gago.",
          "Di ka gakologelwa dikgetho tsa gago.",
          "Li ka hopola likhetho tsa hau."
        ),
      whyTitle:
        text(
          "Ke ka lebaka la eng re diriša dikhukhi?",
          "Ke ka ntlha yang re dirisa dikhukhi?",
          "Hobaneng re sebelisa dikhukhi?"
        ),
      whyBody1:
        text(
          "PhilaLink e diriša dikhukhi tša bohlokwa bakeng sa tshepedišo ye e bolokegilego.",
          "PhilaLink e dirisa dikhukhi tsa botlhokwa bakeng sa tiro e e sireletsegileng.",
          "PhilaLink e sebelisa dikhukhi tsa bohlokoa bakeng sa ts'ebetso e sireletsehileng."
        ),
      whyBody2:
        text(
          "Ga re diriše dikhukhi tša dipapatšo.",
          "Ga re dirise dikhukhi tsa dipapatso.",
          "Ha re sebelise dikhukhi tsa papatso."
        ),
      changeTitle:
        text(
          "O fetola bjang dipeakanyo?",
          "O fetola jang dithulaganyo?",
          "U fetola litlhophiso joang?"
        ),
      changeBody1:
        text(
          "O ka boela go dipeakanyo tša dikhukhi nako efe goba efe.",
          "O ka boela kwa dithulaganyong tsa dikhukhi nako nngwe le nngwe.",
          "U ka khutlela litlhophisong tsa dikhukhi neng kapa neng."
        ),
      changeBody2:
        text(
          "O ka phumola dikhukhi ka dipeakanyo tša sebatli.",
          "O ka phimola dikhukhi mo dithulaganyong tsa sebatli.",
          "U ka hlakola dikhukhi ka litlhophiso tsa sebatli."
        ),
      thirdPartyTitle:
        text(
          "Batho ba bangwe ba diriša dikhukhi neng?",
          "Batho ba bangwe ba dirisa dikhukhi leng?",
          "Batho ba bang ba sebelisa dikhukhi neng?"
        ),
      thirdPartyBody1:
        text(
          "Google e ka diriša dikhukhi tša yona ge o tsena ka Google.",
          "Google e ka dirisa dikhukhi tsa yone fa o tsena ka Google.",
          "Google e ka sebelisa dikhukhi tsa eona ha u kena ka Google."
        ),
      thirdPartyBody2:
        text(
          "Dikhukhi tšeo di laolwa ke Google.",
          "Dikhukhi tseo di laolwa ke Google.",
          "Dikhukhi tseo li laoloa ke Google."
        ),
      essentialOnly:
        text(
          "Tša bohlokwa feela",
          "Tsa botlhokwa fela",
          "Tsa bohlokoa feela"
        ),
      saveSettings:
        lang.generic.save,
      acceptAll:
        text(
          "Amogela dikhukhi ka moka",
          "Amogela dikhukhi tsotlhe",
          "Amohela dikhukhi tsohle"
        ),
      banner:
        text(
          "Dikhukhi di thuša PhilaLink go šoma gabotse le go gopola dikgetho tša gago.",
          "Dikhukhi di thusa PhilaLink go dira sentle le go gakologelwa dikgetho tsa gago.",
          "Dikhukhi li thusa PhilaLink ho sebetsa hantle le ho hopola likhetho tsa hau."
        ),
    },

    chatbot:
      buildCompactChatbot(
        code
      ),

    dynamic:
      buildCompactDynamic(
        code
      ),

    systemNotifications:
      buildCompactNotifications(
        code
      ),

    serverText:
      buildCompactServerText(
        code
      ),

    settings:
      buildCompactSettings(
        code
      ),

    dashboard:
      buildCompactDashboard(
        code
      ),

    medications:
      buildCompactMedications(
        code
      ),

    appointments:
      buildCompactAppointments(
        code
      ),

    records:
      buildCompactRecords(
        code
      ),

    clinics:
      buildCompactClinics(
        code
      ),
  };
}

function buildNguniExperience(
  code
) {
  const lang =
    otherLanguages[
      code
    ];

  const swati =
    code ===
    "ss";

  const ndebele =
    code ===
    "nr";

  const text = (
    ss,
    nr
  ) =>
    ndebele
      ? nr
      : ss;

  return {
    api:
      lang.api,

    weather: {
      weather:
        text(
          "Simo selitulu",
          "Ubujamo bezulu"
        ),
      loading:
        lang.generic.loading,
      locating:
        text(
          "Kutfolwa indzawo...",
          "Kutholwa indawo..."
        ),
      retry:
        lang.generic.retry,
      unavailable:
        lang.generic.unavailable,
      currentLocation:
        text(
          "Indzawo yakho yanyalo",
          "Indawo yakho yanje"
        ),
      assignedClinicArea:
        text(
          "Indzawo yemtholampilo lowabelwe",
          "Indawo yomtholapilo owabelwe"
        ),
      weatherIn:
        text(
          "Simo selitulu e-{{location}}",
          "Ubujamo bezulu e-{{location}}"
        ),
      clinicAreaWeather:
        text(
          "Simo selitulu sendzawo yemtholampilo: {{location}}",
          "Ubujamo bezulu endaweni yomtholapilo: {{location}}"
        ),
      clinic:
        text(
          "Umtholampilo",
          "Umtholapilo"
        ),
      currentLocationWeather:
        text(
          "Simo selitulu endzaweni yakho",
          "Ubujamo bezulu endaweni yakho"
        ),
      clinicWeather:
        text(
          "Simo selitulu semtholampilo",
          "Ubujamo bezulu bomtholapilo"
        ),
      closeDetails:
        lang.generic.close,
      night:
        text(
          "Ebusuku",
          "Ebusuku"
        ),
      day:
        text(
          "Emini",
          "Emini"
        ),
      location:
        text(
          "Indzawo",
          "Indawo"
        ),
      degreesCelsius:
        "{{temperature}} °C",
      deviceLocationFallback:
        text(
          "Indzawo yedivayisi yakho ayikatfolakali, ngako PhilaLink ikhombisa simo selitulu sendzawo yemtholampilo wakho.",
          "Indawo yedivayisi yakho ayikatholakali, ngalokho PhilaLink ikhombisa ubujamo bezulu bendawo yomtholapilo wakho."
        ),
      locationUnavailable:
        lang.generic.unavailable,
      preciseLocationDenied:
        text(
          "Kufinyelela endzaweni lecondzile kunqatjiwe.",
          "Ukufikelela endaweni enembileko kunqatjiwe."
        ),
      locationUndetermined:
        text(
          "Indzawo yakho yanyalo ayikakhoni kutfolwa.",
          "Indawo yakho yanje ayikghonanga ukutholwa."
        ),
      locationTimeout:
        text(
          "Sicelo sendzawo siphelelwe sikhatsi.",
          "Isibawo sendawo siphelelwe sikhathi."
        ),
      locationServicesUnavailable:
        lang.generic.unavailable,
      invalidCoordinates:
        lang.generic.error,

      condition: {
        clear:
          text(
            "Kucwebile",
            "Kucwengile"
          ),
        partlyCloudy:
          text(
            "Kunemafu kancane",
            "Kunamafu kancani"
          ),
        overcast:
          text(
            "Kumbozwe ngemafu",
            "Kumbozwe ngamafu"
          ),
        rain:
          text(
            "Imvula",
            "Izulu"
          ),
        thunder:
          text(
            "Kudvuma",
            "Ukuduma kwezulu"
          ),
        snow:
          text(
            "Litfwa",
            "Iqhwa"
          ),
        fog:
          text(
            "Inkungu",
            "Ikungu"
          ),
        cloudy:
          text(
            "Kunemafu",
            "Kunamafu"
          ),
      },
    },

    identity: {
      title:
        text(
          "Imininingwane yebunikati",
          "Imininingwana yobunikazi"
        ),
      description:
        text(
          "Lungisa lilanga lakho lekutalwa noma inombolo ye-ID yaseNingizimu Afrika.",
          "Lungisa ilanga lakho lokubelethwa namkha inomboro ye-ID yeSewula Afrika."
        ),
      separateSave:
        text(
          "Tingucuko tebunikati tigcinwa ngekwehlukana.",
          "Amatjhuguluko wobunikazi abulungwa ngokuhlukileko."
        ),
      currentId:
        "ID",
      notAvailable:
        lang.generic.unavailable,
      correctDob:
        text(
          "Lungisa lilanga lekutalwa",
          "Lungisa ilanga lokubelethwa"
        ),
      dobDescription:
        text(
          "Lokhu kushintja kuphela tinombolo tekucala letisitfupha te-YYMMDD.",
          "Lokhu kutjhugulula kuphela iinomboro zokuthoma ezisithandathu ze-YYMMDD."
        ),
      updateDob:
        text(
          "Buyeketa lilanga lekutalwa",
          "Vuselela ilanga lokubelethwa"
        ),
      updating:
        lang.generic.loading,
      correctFullId:
        text(
          "Lungisa i-ID yonkhe",
          "Lungisa i-ID epheleleko"
        ),
      fullIdDescription:
        text(
          "Sebentisa lokhu uma naletinye tinombolo te-ID tingakalungi.",
          "Sebenzisa lokhu nangabe nezinye iinomboro ze-ID azikalungi."
        ),
      idPlaceholder:
        "ID ye-SA lenetinombolo leti-13",
      updateFullId:
        text(
          "Buyeketa i-ID",
          "Vuselela i-ID"
        ),
      loginIdentifier:
        text(
          "I-ID yakho iphinde ibe ngiyo loyisebentisako nawungena.",
          "I-ID yakho ibuye ibe sisazisi sakho sokungena."
        ),
      selectDob:
        text(
          "Khetsa lilanga lekutalwa.",
          "Khetha ilanga lokubelethwa."
        ),
      dobUpdated:
        text(
          "Lilanga lekutalwa libuyeketiwe.",
          "Ilanga lokubelethwa livuselelwe."
        ),
      dobUpdateError:
        lang.generic.error,
      invalidId:
        text(
          "Faka i-ID yaseNingizimu Afrika lenetinombolo leti-13.",
          "Faka i-ID yeSewula Afrika eneenomboro ezili-13."
        ),
      idUpdated:
        text(
          "I-ID ibuyeketiwe.",
          "I-ID ivuselelwe."
        ),
      idUpdateError:
        lang.generic.error,
    },

    cookies:
      buildCompactCookies(
        code
      ),

    chatbot:
      buildCompactChatbot(
        code
      ),

    dynamic:
      buildCompactDynamic(
        code
      ),

    systemNotifications:
      buildCompactNotifications(
        code
      ),

    serverText:
      buildCompactServerText(
        code
      ),

    settings:
      buildCompactSettings(
        code
      ),

    dashboard:
      buildCompactDashboard(
        code
      ),

    medications:
      buildCompactMedications(
        code
      ),

    appointments:
      buildCompactAppointments(
        code
      ),

    records:
      buildCompactRecords(
        code
      ),

    clinics:
      buildCompactClinics(
        code
      ),
  };
}

function buildVendaTsongaExperience(
  code
) {
  const lang =
    otherLanguages[
      code
    ];

  const venda =
    code ===
    "ve";

  const text = (
    ts,
    ve
  ) =>
    venda
      ? ve
      : ts;

  return {
    api:
      lang.api,

    weather: {
      weather:
        text(
          "Maxelo ya le henhla",
          "Mupo"
        ),
      loading:
        lang.generic.loading,
      locating:
        text(
          "Ku laviwa ndhawu...",
          "Hu khou ṱoḓiwa fhethu..."
        ),
      retry:
        lang.generic.retry,
      unavailable:
        lang.generic.unavailable,
      currentLocation:
        text(
          "Ndhawu ya wena ya sweswi",
          "Fhethu haṋu ha zwino"
        ),
      assignedClinicArea:
        text(
          "Ndhawu ya kliniki leyi u averiweke yona",
          "Fhethu ha kiliniki ye na avhelwa"
        ),
      weatherIn:
        text(
          "Maxelo e-{{location}}",
          "Mupo wa {{location}}"
        ),
      clinicAreaWeather:
        text(
          "Maxelo ya ndhawu ya kliniki: {{location}}",
          "Mupo wa fhethu ha kiliniki: {{location}}"
        ),
      clinic:
        text(
          "Kiliniki",
          "Kiliniki"
        ),
      currentLocationWeather:
        text(
          "Maxelo ya ndhawu ya wena",
          "Mupo wa fhethu haṋu"
        ),
      clinicWeather:
        text(
          "Maxelo ya kliniki",
          "Mupo wa kiliniki"
        ),
      closeDetails:
        lang.generic.close,
      night:
        text(
          "Nivusiku",
          "Vhusiku"
        ),
      day:
        text(
          "Ninhlikanhi",
          "Masana"
        ),
      location:
        text(
          "Ndhawu",
          "Fhethu"
        ),
      degreesCelsius:
        "{{temperature}} °C",
      deviceLocationFallback:
        text(
          "Ndhawu ya xitirhisiwa xa wena a yi kumekanga, kutani PhilaLink yi komba maxelo ya ndhawu ya kliniki ya wena.",
          "Fhethu ha tshishumiswa tshaṋu a ho ngo wanala, nga zwenezwo PhilaLink i sumbedza mupo wa fhethu ha kiliniki yaṋu."
        ),
      locationUnavailable:
        lang.generic.unavailable,
      preciseLocationDenied:
        text(
          "U swikelela ndhawu leyi kongomeke swi ariwile.",
          "U swikelela fhethu ho teaho zwo hanelwa."
        ),
      locationUndetermined:
        text(
          "Ndhawu ya wena ya sweswi a yi kotekanga ku kumiwa.",
          "Fhethu haṋu ha zwino a ho ngo kona u wanala."
        ),
      locationTimeout:
        text(
          "Xikombelo xa ndhawu xi hundzeriwe hi nkarhi.",
          "Khumbelo ya fhethu yo fhelelwa nga tshifhinga."
        ),
      locationServicesUnavailable:
        lang.generic.unavailable,
      invalidCoordinates:
        lang.generic.error,

      condition: {
        clear:
          text(
            "Ku basile",
            "Hu khagala"
          ),
        partlyCloudy:
          text(
            "Maru matsongo",
            "Makole maṱuku"
          ),
        overcast:
          text(
            "Ku tele maru",
            "Hu na makole manzhi"
          ),
        rain:
          text(
            "Mpfula",
            "Mvula"
          ),
        thunder:
          text(
            "Xidzedze",
            "Madumbu"
          ),
        snow:
          text(
            "Gamboko",
            "Mahada"
          ),
        fog:
          text(
            "Nkungu",
            "Khuli"
          ),
        cloudy:
          text(
            "Ku na maru",
            "Hu na makole"
          ),
      },
    },

    identity:
      buildCompactIdentity(
        code
      ),

    cookies:
      buildCompactCookies(
        code
      ),

    chatbot:
      buildCompactChatbot(
        code
      ),

    dynamic:
      buildCompactDynamic(
        code
      ),

    systemNotifications:
      buildCompactNotifications(
        code
      ),

    serverText:
      buildCompactServerText(
        code
      ),

    settings:
      buildCompactSettings(
        code
      ),

    dashboard:
      buildCompactDashboard(
        code
      ),

    medications:
      buildCompactMedications(
        code
      ),

    appointments:
      buildCompactAppointments(
        code
      ),

    records:
      buildCompactRecords(
        code
      ),

    clinics:
      buildCompactClinics(
        code
      ),
  };
}

/*
 * The following compact factories intentionally provide
 * complete patient-facing coverage for the seven language
 * packs that previously inherited large English sections.
 *
 * They use shorter wording than English in places, which is
 * preferable to mixed-language screens and keeps the UI
 * readable on mobile.
 */

function choose(
  code,
  values
) {
  return (
    values[
      code
    ] ??
    values.en
  );
}

function buildCompactSettings(
  code
) {
  const v = key =>
    choose(
      code,
      key
    );

  return {
    title:
      v({
        nso: "Dipeakanyo",
        tn: "Dithulaganyo",
        st: "Litlhophiso",
        ts: "Swiyimiso",
        ss: "Tilungiselelo",
        ve: "Nzudzanyo",
        nr: "Amasethingi",
      }),

    subtitle:
      v({
        nso: "Laola profaele, tšhireletšo, ditsebišo, sephiri, polelo le ponagalo.",
        tn: "Laola porofaele, tshireletso, dikitsiso, sephiri, puo le tebego.",
        st: "Laola profaele, tšireletso, litsebiso, lekunutu, puo le ponahalo.",
        ts: "Lawula phurofayili, vuhlayiseki, switiviso, vuhlayiseki bya vuxokoxoko, ririmi ni xivumbeko.",
        ss: "Phatsa iphrofayili, kuvikeleka, tatiso, bumfihlo, lulwimi nekubukeka.",
        ve: "Langani phurofayili, tsireledzo, nḓivhadzo, tshiphiri, luambo na mbonalo.",
        nr: "Phatha iphrofayili, ukuphepha, izaziso, ubumfihlo, ilimi nokubonakala.",
      }),

    reloadSettings:
      v({
        nso: "Laiša dipeakanyo gape",
        tn: "Laela dithulaganyo gape",
        st: "Kenya litlhophiso hape",
        ts: "Layicha swiyimiso nakambe",
        ss: "Layisha tilungiselelo futsi",
        ve: "Laišani nzudzanyo hafhu",
        nr: "Layisha amasethingi godu",
      }),

    saved:
      v({
        nso: "Dipeakanyo tša gago di bolokilwe.",
        tn: "Dithulaganyo tsa gago di bolokilwe.",
        st: "Litlhophiso tsa hau li bolokiloe.",
        ts: "Swiyimiso swa wena swi hlayisiwile.",
        ss: "Tilungiselelo takho tigciniwe.",
        ve: "Nzudzanyo yaṋu yo vhulungwa.",
        nr: "Amasethingi wakho abulungwe.",
      }),

    loadError:
      otherLanguages[
        code
      ].generic.error,

    saveError:
      otherLanguages[
        code
      ].generic.error,

    personalTitle:
      v({
        nso: "Tshedimošo ya motho",
        tn: "Tshedimosetso ya botho",
        st: "Lintlha tsa motho",
        ts: "Vuxokoxoko bya munhu",
        ss: "Imininingwane yemuntfu",
        ve: "Zwidodombedzwa zwa muthu",
        nr: "Imininingwana yomuntu",
      }),

    personalDescription:
      v({
        nso: "Boloka dintlha tša gago di le nakong.",
        tn: "Boloka dintlha tsa gago di le mo nakong.",
        st: "Boloka lintlha tsa hau li le nakong.",
        ts: "Hlayisa vuxokoxoko bya wena byi ri bya sweswi.",
        ss: "Gcina imininingwane yakho isesikhatsini.",
        ve: "Vhulungani zwidodombedzwa zwaṋu zwi zwa zwino.",
        nr: "Gcina imininingwana yakho isesikhathini.",
      }),

    fullName:
      v({
        nso: "Leina ka botlalo",
        tn: "Leina ka botlalo",
        st: "Lebitso ka botlalo",
        ts: "Vito hinkwaro",
        ss: "Ligama leliphelele",
        ve: "Dzina ḽoṱhe",
        nr: "Ibizo elipheleleko",
      }),

    email:
      v({
        nso: "Aterese ya imeile",
        tn: "Aterese ya imeile",
        st: "Aterese ea imeile",
        ts: "Adirese ya imeyili",
        ss: "Likheli le-imeyili",
        ve: "Ḓiresi ya imeili",
        nr: "I-adresi ye-imeyili",
      }),

    phone:
      v({
        nso: "Nomoro ya mogala",
        tn: "Nomoro ya mogala",
        st: "Nomoro ea mohala",
        ts: "Nomboro ya riqingho",
        ss: "Inombolo yelucingo",
        ve: "Nomboro ya luṱingo",
        nr: "Inomboro yomtato",
      }),

    gender:
      v({
        nso: "Bong",
        tn: "Bong",
        st: "Bong",
        ts: "Rimbewu",
        ss: "Bulili",
        ve: "Mbeu",
        nr: "Ubulili",
      }),

    selectGender:
      v({
        nso: "Kgetha bong",
        tn: "Tlhopha bong",
        st: "Khetha bong",
        ts: "Hlawula rimbewu",
        ss: "Khetsa bulili",
        ve: "Nangani mbeu",
        nr: "Khetha ubulili",
      }),

    male:
      v({
        nso: "Monna",
        tn: "Monna",
        st: "Monna",
        ts: "Wanuna",
        ss: "Wesilisa",
        ve: "Munna",
        nr: "Owesilisa",
      }),

    female:
      v({
        nso: "Mosadi",
        tn: "Mosadi",
        st: "Mosali",
        ts: "Wansati",
        ss: "Wesifazane",
        ve: "Musadzi",
        nr: "Owesifazana",
      }),

    other:
      v({
        nso: "Ye nngwe",
        tn: "Go sele",
        st: "E nngwe",
        ts: "Swin'wana",
        ss: "Lokunye",
        ve: "Zwiṅwe",
        nr: "Okhunye",
      }),

    preferNot:
      v({
        nso: "Ke rata go se bolele",
        tn: "Ke rata go se bolele",
        st: "Ke khetha ho se bolele",
        ts: "A ndzi lavi ku vula",
        ss: "Ngincamela kungasho",
        ve: "Ndi khetha u sa amba",
        nr: "Ngikhetha ukungatjho",
      }),

    addressTitle:
      v({
        nso: "Aterese",
        tn: "Aterese",
        st: "Aterese",
        ts: "Adirese",
        ss: "Likheli",
        ve: "Ḓiresi",
        nr: "I-adresi",
      }),

    addressDescription:
      v({
        nso: "Mpshafatša aterese ya gago.",
        tn: "Ntšhwafatsa aterese ya gago.",
        st: "Ntlafatsa aterese ea hau.",
        ts: "Pfuxeta adirese ya wena.",
        ss: "Buyeketa likheli lakho.",
        ve: "Mvusulusani ḓiresi yaṋu.",
        nr: "Vuselela i-adresi yakho.",
      }),

    addressLine1:
      "1",
    addressLine2:
      "2",

    suburb:
      v({
        nso: "Tikologo",
        tn: "Lefelo",
        st: "Sebaka",
        ts: "Ndhawu",
        ss: "Indzawo",
        ve: "Fhethu",
        nr: "Indawo",
      }),

    city:
      v({
        nso: "Toropo",
        tn: "Toropo",
        st: "Toropo",
        ts: "Doroba",
        ss: "Lidolobha",
        ve: "Ḓorobo",
        nr: "Idorobho",
      }),

    province:
      v({
        nso: "Profense",
        tn: "Porofense",
        st: "Profinse",
        ts: "Xifundzankulu",
        ss: "Sifundza",
        ve: "Vunḓu",
        nr: "Isifunda",
      }),

    postalCode:
      v({
        nso: "Khoutu ya poso",
        tn: "Khoutu ya poso",
        st: "Khoutu ea poso",
        ts: "Khodi ya poso",
        ss: "Ikhodi yeposi",
        ve: "Khoutu ya poswo",
        nr: "Ikhodi yeposo",
      }),

    emergencyTitle:
      v({
        nso: "Motho wa tšhoganetšo",
        tn: "Motho wa tshoganyetso",
        st: "Motho oa tšohanyetso",
        ts: "Munhu wa xihatla",
        ss: "Umuntfu wetimo letiphutfumako",
        ve: "Muthu wa tshiimo tsha shishi",
        nr: "Umuntu wesimo esiphuthumako",
      }),

    emergencyDescription:
      v({
        nso: "Boloka tshedimošo ya tšhoganetšo e le nakong.",
        tn: "Boloka tshedimosetso ya tshoganyetso e le mo nakong.",
        st: "Boloka lintlha tsa tšohanyetso li le nakong.",
        ts: "Hlayisa vuxokoxoko bya xihatla byi ri bya sweswi.",
        ss: "Gcina imininingwane yetimo letiphutfumako isesikhatsini.",
        ve: "Vhulungani zwidodombedzwa zwa shishi zwi zwa zwino.",
        nr: "Gcina imininingwana yesimo esiphuthumako isesikhathini.",
      }),

    contactName:
      v({
        nso: "Leina",
        tn: "Leina",
        st: "Lebitso",
        ts: "Vito",
        ss: "Ligama",
        ve: "Dzina",
        nr: "Ibizo",
      }),

    contactNumber:
      v({
        nso: "Nomoro ya kgokagano",
        tn: "Nomoro ya kgolagano",
        st: "Nomoro ea puisano",
        ts: "Nomboro ya vuhlanganisi",
        ss: "Inombolo yekuchumana",
        ve: "Nomboro ya vhukwamani",
        nr: "Inomboro yokuthintana",
      }),

    relationship:
      v({
        nso: "Kamano",
        tn: "Kamano",
        st: "Kamano",
        ts: "Vuxaka",
        ss: "Budlelwane",
        ve: "Vhushaka",
        nr: "Ubuhlobo",
      }),

    securityTitle:
      v({
        nso: "Tšhireletšo ya akhaonto",
        tn: "Tshireletso ya akhaonto",
        st: "Tšireletso ea ak'haonte",
        ts: "Vuhlayiseki bya akhawunti",
        ss: "Kuvikeleka kwe-akhawunti",
        ve: "Tsireledzo ya akhaunthu",
        nr: "Ukuphepha kwe-akhawunti",
      }),

    securityDescription:
      v({
        nso: "Fetola phasewete ya gago.",
        tn: "Fetola phasewete ya gago.",
        st: "Fetola phasewete ea hau.",
        ts: "Cinca phasiwedi ya wena.",
        ss: "Shintja iphasiwedi yakho.",
        ve: "Shandukisani phasiwede yaṋu.",
        nr: "Tjhugulula iphasiwedi yakho.",
      }),

    currentPassword:
      v({
        nso: "Phasewete ya bjale",
        tn: "Phasewete ya jaanong",
        st: "Phasewete ea hajoale",
        ts: "Phasiwedi ya sweswi",
        ss: "Iphasiwedi yanyalo",
        ve: "Phasiwede ya zwino",
        nr: "Iphasiwedi yanje",
      }),

    newPassword:
      v({
        nso: "Phasewete ye mpsha",
        tn: "Phasewete e ntšhwa",
        st: "Phasewete e ncha",
        ts: "Phasiwedi leyintshwa",
        ss: "Iphasiwedi lensha",
        ve: "Phasiwede ntswa",
        nr: "Iphasiwedi etja",
      }),

    confirmPassword:
      v({
        nso: "Netefatša phasewete",
        tn: "Netefatsa phasewete",
        st: "Netefatsa phasewete",
        ts: "Tiyisisa phasiwedi",
        ss: "Cinisekisa iphasiwedi",
        ve: "Khwaṱhisedzani phasiwede",
        nr: "Qinisekisa iphasiwedi",
      }),

    passwordMustContain:
      v({
        nso: "Phasewete e swanetše go ba le:",
        tn: "Phasewete e tshwanetse go nna le:",
        st: "Phasewete e tlameha ho ba le:",
        ts: "Phasiwedi yi fanele yi va na:",
        ss: "Iphasiwedi kufanele ibe na:",
        ve: "Phasiwede i tea u vha na:",
        nr: "Iphasiwedi kufanele ibe:",
      }),

    requirementLength:
      "12+",
    requirementUppercase:
      "A-Z",
    requirementLowercase:
      "a-z",
    requirementNumber:
      "0-9",
    requirementSpecial:
      "!@#",

    changePassword:
      v({
        nso: "Fetola phasewete",
        tn: "Fetola phasewete",
        st: "Fetola phasewete",
        ts: "Cinca phasiwedi",
        ss: "Shintja iphasiwedi",
        ve: "Shandukisani phasiwede",
        nr: "Tjhugulula iphasiwedi",
      }),

    changingPassword:
      otherLanguages[
        code
      ].generic.loading,

    currentPasswordRequired:
      otherLanguages[
        code
      ].generic.error,

    newPasswordRequired:
      otherLanguages[
        code
      ].generic.error,

    newPasswordInvalid:
      otherLanguages[
        code
      ].generic.error,

    confirmPasswordRequired:
      otherLanguages[
        code
      ].generic.error,

    passwordsMismatch:
      otherLanguages[
        code
      ].generic.error,

    passwordSame:
      otherLanguages[
        code
      ].generic.error,

    passwordChanged:
      v({
        nso: "Phasewete e fetotšwe.",
        tn: "Phasewete e fetotswe.",
        st: "Phasewete e fetotsoe.",
        ts: "Phasiwedi yi cinciwile.",
        ss: "Iphasiwedi ishintjiwe.",
        ve: "Phasiwede yo shandukiswa.",
        nr: "Iphasiwedi itjhugululiwe.",
      }),

    passwordChangeError:
      otherLanguages[
        code
      ].generic.error,

    showPassword:
      v({
        nso: "Bontšha {{label}}",
        tn: "Bontsha {{label}}",
        st: "Bontša {{label}}",
        ts: "Komba {{label}}",
        ss: "Khombisa {{label}}",
        ve: "Sumbedzani {{label}}",
        nr: "Tjengisa {{label}}",
      }),

    hidePassword:
      v({
        nso: "Fihla {{label}}",
        tn: "Fitlha {{label}}",
        st: "Pata {{label}}",
        ts: "Fihla {{label}}",
        ss: "Fihla {{label}}",
        ve: "Dzumbani {{label}}",
        nr: "Fihla {{label}}",
      }),

    notificationsTitle:
      v({
        nso: "Ditsebišo",
        tn: "Dikitsiso",
        st: "Litsebiso",
        ts: "Switiviso",
        ss: "Tatiso",
        ve: "Nḓivhadzo",
        nr: "Izaziso",
      }),

    notificationsDescription:
      v({
        nso: "Kgetha dikgopotšo tšeo o di nyakago.",
        tn: "Tlhopha dikgopotso tse o di batlang.",
        st: "Khetha likhopotso tseo u li batlang.",
        ts: "Hlawula switsundzuxo leswi u swi lavaka.",
        ss: "Khetsa tikhumbuto lotifunako.",
        ve: "Nangani zwihumbudzo zwine na zwi ṱoḓa.",
        nr: "Khetha iinkhumbuzo ozifunako.",
      }),

    medicationReminders:
      v({
        nso: "Dikgopotšo tša dihlare",
        tn: "Dikgopotso tsa melemo",
        st: "Likhopotso tsa meriana",
        ts: "Switsundzuxo swa mirhi",
        ss: "Tikhumbuto temitsi",
        ve: "Zwihumbudzo zwa mishonga",
        nr: "Iinkhumbuzo zemithi",
      }),

    medicationRemindersDescription:
      v({
        nso: "Amogela dikgopotšo tša dihlare.",
        tn: "Amogela dikgopotso tsa melemo.",
        st: "Fumana likhopotso tsa meriana.",
        ts: "Amukela switsundzuxo swa mirhi.",
        ss: "Tfola tikhumbuto temitsi.",
        ve: "Wanani zwihumbudzo zwa mishonga.",
        nr: "Thola iinkhumbuzo zemithi.",
      }),

    appointmentReminders:
      v({
        nso: "Dikgopotšo tša dipeeletšo",
        tn: "Dikgopotso tsa dipeelo",
        st: "Likhopotso tsa likopano",
        ts: "Switsundzuxo swa mihlangano",
        ss: "Tikhumbuto tetikhatsi",
        ve: "Zwihumbudzo zwa mitevhe",
        nr: "Iinkhumbuzo zeenkhathi",
      }),

    appointmentRemindersDescription:
      v({
        nso: "Amogela tsebišo pele ga peelo.",
        tn: "Amogela kitsiso pele ga peelo.",
        st: "Fumana tsebiso pele ho kopano.",
        ts: "Amukela xitiviso loko nhlangano wu nga si fika.",
        ss: "Tfola satiso ngaphambi kwesikhatsi.",
        ve: "Wanani nḓivhadzo phanḓa ha mutangano.",
        nr: "Thola isaziso ngaphambi kwesikhathi.",
      }),

    clinicNotifications:
      v({
        nso: "Ditsebišo tša kliniki",
        tn: "Dikitsiso tsa tliliniki",
        st: "Litsebiso tsa tleliniki",
        ts: "Switiviso swa kliniki",
        ss: "Tatiso temtholampilo",
        ve: "Nḓivhadzo dza kiliniki",
        nr: "Izaziso zomtholapilo",
      }),

    clinicNotificationsDescription:
      v({
        nso: "Amogela dimpshafatšo tša kliniki.",
        tn: "Amogela dintlafatso tsa tliliniki.",
        st: "Fumana lintlafatso tsa tleliniki.",
        ts: "Amukela swintshwa swa kliniki.",
        ss: "Tfola tibuyeketo temtholampilo.",
        ve: "Wanani mivusuluso ya kiliniki.",
        nr: "Thola iimbuyekezo zomtholapilo.",
      }),

    healthUpdates:
      v({
        nso: "Dimpshafatšo tša maphelo",
        tn: "Dintlafatso tsa boitekanelo",
        st: "Lintlafatso tsa bophelo",
        ts: "Swintshwa swa rihanyo",
        ss: "Tibuyeketo temphilo",
        ve: "Mivusuluso ya mutakalo",
        nr: "Iimbuyekezo zepilo",
      }),

    healthUpdatesDescription:
      v({
        nso: "Amogela tshedimošo ya maphelo.",
        tn: "Amogela tshedimosetso ya boitekanelo.",
        st: "Fumana tlhahisoleseling ea bophelo.",
        ts: "Amukela vuxokoxoko bya rihanyo.",
        ss: "Tfola imininingwane yemphilo.",
        ve: "Wanani zwidodombedzwa zwa mutakalo.",
        nr: "Thola imininingwana yepilo.",
      }),

    privacyTitle:
      v({
        nso: "Sephiri",
        tn: "Sephiri",
        st: "Lekunutu",
        ts: "Vuhlayiseki bya vuxokoxoko",
        ss: "Bumfihlo",
        ve: "Tshiphiri",
        nr: "Ubumfihlo",
      }),

    privacyDescription:
      v({
        nso: "Laola ka moo tshedimošo ya gago e dirišwago.",
        tn: "Laola tsela e tshedimosetso ya gago e dirisiwang ka yone.",
        st: "Laola kamoo lintlha tsa hau li sebelisoang kateng.",
        ts: "Lawula ndlela leyi vuxokoxoko bya wena byi tirhisiwaka ha yona.",
        ss: "Lawula indlela imininingwane yakho lesetjentiswa ngayo.",
        ve: "Langani nḓila ine zwidodombedzwa zwaṋu zwa shumiswa ngayo.",
        nr: "Lawula indlela imininingwana yakho esetjenziswa ngayo.",
      }),

    shareHealthData:
      v({
        nso: "Abelana tshedimošo ya maphelo",
        tn: "Abelana tshedimosetso ya boitekanelo",
        st: "Arolelana lintlha tsa bophelo",
        ts: "Avelana vuxokoxoko bya rihanyo",
        ss: "Yabelana ngemininingwane yemphilo",
        ve: "Kovhani zwidodombedzwa zwa mutakalo",
        nr: "Yabelana ngemininingwana yepilo",
      }),

    shareHealthDataDescription:
      v({
        nso: "Dumelela bašomi ba maphelo ba dumeletšwego go bona tshedimošo.",
        tn: "Letla badiri ba boitekanelo ba ba letleletsweng go bona tshedimosetso.",
        st: "Lumella basebetsi ba bophelo ba lumelletsoeng ho bona lintlha.",
        ts: "Pfumelela vatirhi va rihanyo lava pfumeleriweke ku vona vuxokoxoko.",
        ss: "Vumela basebenti betemphilo labagunyatiwe kubona imininingwane.",
        ve: "Tendani vhashumi vha mutakalo vho tendelwaho u vhona zwidodombedzwa.",
        nr: "Vumela abasebenzi bepilo abagunyaziwe ukubona imininingwana.",
      }),

    chatbotAccess:
      "PhilaChatBot",

    chatbotAccessDescription:
      v({
        nso: "Dumelela PhilaChatBot go diriša tshedimošo ya profaele.",
        tn: "Letla PhilaChatBot go dirisa tshedimosetso ya porofaele.",
        st: "Lumella PhilaChatBot ho sebelisa lintlha tsa profaele.",
        ts: "Pfumelela PhilaChatBot ku tirhisa vuxokoxoko bya phurofayili.",
        ss: "Vumela PhilaChatBot kusebentisa imininingwane yephrofayili.",
        ve: "Tendani PhilaChatBot u shumisa zwidodombedzwa zwa phurofayili.",
        nr: "Vumela PhilaChatBot ukusebenzisa imininingwana yephrofayili.",
      }),

    saveChanges:
      otherLanguages[
        code
      ].generic.save,

    saving:
      otherLanguages[
        code
      ].generic.loading,

    appearanceTitle:
      v({
        nso: "Ponagalo",
        tn: "Tebego",
        st: "Ponahalo",
        ts: "Xivumbeko",
        ss: "Kubukeka",
        ve: "Mbonalo",
        nr: "Ukubonakala",
      }),

    appearanceDescription:
      v({
        nso: "Kgetha ka moo kgoro e bonagalago ka gona.",
        tn: "Tlhopha tsela e kgoro e lebegang ka yone.",
        st: "Khetha kamoo portal e shebahalang kateng.",
        ts: "Hlawula ndlela leyi portal yi langutekaka ha yona.",
        ss: "Khetsa indlela portal lebukeka ngayo.",
        ve: "Nangani nḓila ine portal ya vhonala ngayo.",
        nr: "Khetha indlela i-portal ebonakala ngayo.",
      }),

    theme:
      v({
        nso: "Sehlogo",
        tn: "Setlhogo",
        st: "Sehlooho",
        ts: "Xivumbeko",
        ss: "Itimu",
        ve: "Thero",
        nr: "Itimu",
      }),

    darkModeOn:
      v({
        nso: "Mokgwa wa leswiswi o buletšwe.",
        tn: "Mokgwa o o lefifi o butswe.",
        st: "Mokhoa o lefifi o buletsoe.",
        ts: "Mode ya munyama yi pfulekile.",
        ss: "Imodi lemnyama ivulekile.",
        ve: "Mode ya swiswi yo vula.",
        nr: "Imodi emnyama ivuliwe.",
      }),

    lightModeOn:
      v({
        nso: "Mokgwa wa seetša o buletšwe.",
        tn: "Mokgwa o o sedimang o butswe.",
        st: "Mokhoa o khanyang o buletsoe.",
        ts: "Mode ya ku vonakala yi pfulekile.",
        ss: "Imodi lekhanyako ivulekile.",
        ve: "Mode ya tshedza yo vula.",
        nr: "Imodi ekhanyako ivuliwe.",
      }),

    toggleDarkMode:
      v({
        nso: "Fetola mokgwa wa leswiswi",
        tn: "Fetola mokgwa o o lefifi",
        st: "Fetola mokhoa o lefifi",
        ts: "Cinca mode ya munyama",
        ss: "Shintja imodi lemnyama",
        ve: "Shandukisani mode ya swiswi",
        nr: "Tjhugulula imodi emnyama",
      }),

    appearanceSaved:
      v({
        nso: "Kgetho ya gago e bolokwa ka boyona.",
        tn: "Tlhopho ya gago e bolokwa ka boyone.",
        st: "Khetho ea hau e bolokoa ka bo eona.",
        ts: "Nhlawulo wa wena wu hlayisiwa hi woxe.",
        ss: "Kukhetsa kwakho kugcinwa ngekutentakalela.",
        ve: "Nhetho yaṋu i vhulungwa nga yoṱhe.",
        nr: "Ukukhetha kwakho kubulungwa ngokuzenzakalelako.",
      }),

    languageTitle:
      v({
        nso: "Polelo",
        tn: "Puo",
        st: "Puo",
        ts: "Ririmi",
        ss: "Lulwimi",
        ve: "Luambo",
        nr: "Ilimi",
      }),

    languageDescription:
      v({
        nso: "Kgetha polelo yeo o nyakago go e diriša.",
        tn: "Tlhopha puo e o batlang go e dirisa.",
        st: "Khetha puo eo u batlang ho e sebelisa.",
        ts: "Hlawula ririmi leri u lavaka ku ri tirhisa.",
        ss: "Khetsa lulwimi lofuna kulisebentisa.",
        ve: "Nangani luambo lune na ṱoḓa u lu shumisa.",
        nr: "Khetha ilimi ofuna ukulisebenzisa.",
      }),

    preferredLanguage:
      v({
        nso: "Polelo ye e ratwago",
        tn: "Puo e e ratwang",
        st: "Puo e ratoang",
        ts: "Ririmi leri rhandziwaka",
        ss: "Lulwimi lolukhetsiwe",
        ve: "Luambo lune na lu funa",
        nr: "Ilimi elikhethwako",
      }),

    languageSaved:
      v({
        nso: "Polelo e bolokwa ka boyona.",
        tn: "Puo e bolokwa ka boyone.",
        st: "Puo e bolokoa ka bo eona.",
        ts: "Ririmi ri hlayisiwa hi roxe.",
        ss: "Lulwimi lugcinwa ngekutentakalela.",
        ve: "Luambo lu vhulungwa nga lwoṱhe.",
        nr: "Ilimi libulungwa ngokuzenzakalelako.",
      }),

    patientDetails:
      v({
        nso: "Dintlha tša molwetši",
        tn: "Dintlha tsa molwetse",
        st: "Lintlha tsa mokuli",
        ts: "Vuxokoxoko bya muvabyi",
        ss: "Imininingwane yesigulane",
        ve: "Zwidodombedzwa zwa mulwadze",
        nr: "Imininingwana yesiguli",
      }),

    patientNumber:
      v({
        nso: "Nomoro ya molwetši",
        tn: "Nomoro ya molwetse",
        st: "Nomoro ea mokuli",
        ts: "Nomboro ya muvabyi",
        ss: "Inombolo yesigulane",
        ve: "Nomboro ya mulwadze",
        nr: "Inomboro yesiguli",
      }),

    registeredClinic:
      v({
        nso: "Kliniki ye e ngwadišitšwego",
        tn: "Tliliniki e e kwadisitsweng",
        st: "Tleliniki e ngolisitsoeng",
        ts: "Kiliniki leyi tsarisiweke",
        ss: "Umtholampilo lobhalisiwe",
        ve: "Kiliniki yo ṅwaliswaho",
        nr: "Umtholapilo obhalisiweko",
      }),

    notAssigned:
      otherLanguages[
        code
      ].generic.unavailable,

    profileStatus:
      v({
        nso: "Boemo bja profaele",
        tn: "Maemo a porofaele",
        st: "Boemo ba profaele",
        ts: "Xiyimo xa phurofayili",
        ss: "Simo sephrofayili",
        ve: "Tshiimo tsha phurofayili",
        nr: "Ubujamo bephrofayili",
      }),

    complete:
      v({
        nso: "E feletše",
        tn: "E feletse",
        st: "E felletse",
        ts: "Yi hetisekile",
        ss: "Iphelele",
        ve: "Yo fhela",
        nr: "Iphelele",
      }),

    incomplete:
      v({
        nso: "Ga se ya felela",
        tn: "Ga e a felela",
        st: "Ha e ea fella",
        ts: "A yi hetisekanga",
        ss: "Ayikapheleli",
        ve: "A yo ngo fhela",
        nr: "Ayikapheleli",
      }),

    medicalProfile:
      v({
        nso: "Profaele ya kalafo",
        tn: "Porofaele ya kalafi",
        st: "Profaele ea bongaka",
        ts: "Phurofayili ya vutshunguri",
        ss: "Iphrofayili yetekwelapha",
        ve: "Phurofayili ya zwa ngalafho",
        nr: "Iphrofayili yezokwelapha",
      }),

    allergies:
      v({
        nso: "Dialeji",
        tn: "Dialeji",
        st: "Dialeji",
        ts: "Swilo leswi nga ku twanisiki",
        ss: "Tingcondvongcondvo",
        ve: "Zwithu zwine zwa ni tshinyadza",
        nr: "Izinto ongazwani nazo",
      }),

    conditions:
      v({
        nso: "Maemo a maphelo",
        tn: "Maemo a boitekanelo",
        st: "Maemo a bophelo",
        ts: "Swiyimo swa rihanyo",
        ss: "Timo temphilo",
        ve: "Maemo a mutakalo",
        nr: "Ubujamo bepilo",
      }),
  };
}

function buildCompactDashboard(
  code
) {
  const g =
    otherLanguages[
      code
    ].generic;

  const v = values =>
    choose(
      code,
      values
    );

  return {
    dateUnavailable:
      g.unavailable,
    assignmentDateUnavailable:
      g.unavailable,
    noNextDose:
      v({
        nso: "Ga go tekanyo ye e latelago",
        tn: "Ga go tekanyo e e latelang",
        st: "Ha ho tekanyo e latelang",
        ts: "A ku na mpimo lowu landzelaka",
        ss: "Kute umtsamo lolandzelako",
        ve: "A hu na dose i tevhelaho",
        nr: "Awukho umthamo olandelako",
      }),
    todayAt:
      v({
        nso: "Lehono, {{time}}",
        tn: "Gompieno, {{time}}",
        st: "Kajeno, {{time}}",
        ts: "Namuntlha, {{time}}",
        ss: "Namuhla, {{time}}",
        ve: "Ṋamusi, {{time}}",
        nr: "Namhlanje, {{time}}",
      }),
    noUpcomingCollection:
      v({
        nso: "Ga go go tšea dihlare mo go tlago",
        tn: "Ga go go tsaya melemo mo go tlang",
        st: "Ha ho pokello e tlang",
        ts: "A ku na ku teka mirhi loku taka",
        ss: "Kute kulandvwa kwemitsi lokutako",
        ve: "A hu na u dzhia mishonga hu ḓaho",
        nr: "Akukho ukulandwa kwemithi okuzako",
      }),
    noCollectionMessage:
      v({
        nso: "Ga go na go tšea dihlare mo go rulagantšwego.",
        tn: "Ga go na go tsaya melemo go go rulagantsweng.",
        st: "Ha ho pokello ea meriana e reriloeng.",
        ts: "A ku na ku teka mirhi loku hleriweke.",
        ss: "Kute kulandvwa kwemitsi lokuhleliwe.",
        ve: "A hu na u dzhia mishonga ho dzudzanywaho.",
        nr: "Akukho ukulandwa kwemithi okuhleliweko.",
      }),
    collectionScheduled:
      v({
        nso: "Go tšea go rulagantšwe",
        tn: "Go tsaya go rulagantswe",
        st: "Pokello e reriloe",
        ts: "Ku teka ku hleriwile",
        ss: "Kulandvwa kuhleliwe",
        ve: "U dzhia ho dzudzanywa",
        nr: "Ukulandwa kuhleliwe",
      }),
    collectionDateUnavailable:
      g.unavailable,
    overdue:
      v({
        nso: "Go fetile nako",
        tn: "Go fetile nako",
        st: "E fetiloe ke nako",
        ts: "Ku hundze nkarhi",
        ss: "Sekwedlule sikhatsi",
        ve: "Tshifhinga tsho fhira",
        nr: "Sekudlule isikhathi",
      }),
    dueYesterday:
      v({
        nso: "Go tšea go be go swanetše maabane.",
        tn: "Go tsaya go ne go tshwanetse maabane.",
        st: "Pokello e ne e lokela maobane.",
        ts: "Ku teka a ku fanele ku va tolo.",
        ss: "Kulandvwa bekufanele kube itolo.",
        ve: "U dzhia zwo vha zwi tshi tea mulovha.",
        nr: "Ukulandwa bekufanele kube izolo.",
      }),
    daysOverdue:
      "{{count}}",
    dueToday:
      v({
        nso: "Go swanetše lehono",
        tn: "Go tshwanetse gompieno",
        st: "E lokela kajeno",
        ts: "Swi fanele namuntlha",
        ss: "Kufanele namuhla",
        ve: "Zwi tea ṋamusi",
        nr: "Kufanele namhlanje",
      }),
    dueTodayMessage:
      v({
        nso: "Go tšea dihlare tša gago go swanetše lehono.",
        tn: "Go tsaya melemo ya gago go tshwanetse gompieno.",
        st: "Pokello ea meriana ea hau e lokela kajeno.",
        ts: "Ku teka mirhi ya wena swi fanele namuntlha.",
        ss: "Kulandvwa kwemitsi yakho kufanele namuhla.",
        ve: "U dzhia mishonga yaṋu zwi tea ṋamusi.",
        nr: "Ukulandwa kwemithi yakho kufanele namhlanje.",
      }),
    tomorrow:
      v({
        nso: "Gosasa",
        tn: "Kamoso",
        st: "Hosane",
        ts: "Mundzuku",
        ss: "Kusasa",
        ve: "Matshelo",
        nr: "Kusasa",
      }),
    tomorrowMessage:
      v({
        nso: "Go tšea dihlare tša gago ke gosasa.",
        tn: "Go tsaya melemo ya gago ke kamoso.",
        st: "Pokello ea meriana ea hau ke hosane.",
        ts: "Ku teka mirhi ya wena i mundzuku.",
        ss: "Kulandvwa kwemitsi yakho kukusasa.",
        ve: "U dzhia mishonga yaṋu ndi matshelo.",
        nr: "Ukulandwa kwemithi yakho kukusasa.",
      }),
    days:
      "{{count}}",
    collectionInDays:
      "{{count}}",
    confirmed:
      v({
        nso: "Go netefaditšwe",
        tn: "Go netefaditswe",
        st: "E netefalitsoe",
        ts: "Swi tiyisisiwile",
        ss: "Kucinisekisiwe",
        ve: "Zwo khwaṱhisedzwa",
        nr: "Kuqinisekisiwe",
      }),
    pending:
      v({
        nso: "Go sa letetšwe",
        tn: "Go santse go emetswe",
        st: "E emetse",
        ts: "Swa ha yimele",
        ss: "Kusalindzile",
        ve: "Zwo lindela",
        nr: "Kusalindile",
      }),
    rescheduled:
      v({
        nso: "Go rulagantšwe gape",
        tn: "Go rulagantswe gape",
        st: "E reriloe hape",
        ts: "Swi hleriwile nakambe",
        ss: "Kuhleliwe kabusha",
        ve: "Zwo dzudzanywa hafhu",
        nr: "Kuhlelwe godu",
      }),
    scheduled:
      v({
        nso: "Go rulagantšwe",
        tn: "Go rulagantswe",
        st: "E reriloe",
        ts: "Swi hleriwile",
        ss: "Kuhleliwe",
        ve: "Zwo dzudzanywa",
        nr: "Kuhleliwe",
      }),
    oneDayRemaining:
      "1",
    daysRemaining:
      "{{count}}",
    supplyLow:
      v({
        nso: "Dihlare tša gago di šetše tše nnyane.",
        tn: "Melemo ya gago e setse e le mennye.",
        st: "Meriana ea hau e se e le nyane.",
        ts: "Mirhi ya wena leyi saleke yi le yitsongo.",
        ss: "Imitsi yakho lesele seyincane.",
        ve: "Mishonga yaṋu yo salaho ndi miṱuku.",
        nr: "Imithi yakho esele yincani.",
      }),
    unitsEstimatedRemaining:
      "{{count}}",
    supplyAvailable:
      v({
        nso: "Dihlare di gona",
        tn: "Melemo e teng",
        st: "Meriana e teng",
        ts: "Mirhi yi kona",
        ss: "Imitsi ikhona",
        ve: "Mishonga i hone",
        nr: "Imithi ikhona",
      }),
    supplyUnavailable:
      g.unavailable,
    noCompletedCollection:
      g.unavailable,
    needsDoseInformation:
      v({
        nso: "Go nyakega tshedimošo ya tekanyo",
        tn: "Go tlhokega tshedimosetso ya tekanyo",
        st: "Lintlha tsa tekanyo lia hlokahala",
        ts: "Vuxokoxoko bya mpimo bya laveka",
        ss: "Imininingwane yemtsamo iyadzingeka",
        ve: "Zwidodombedzwa zwa dose zwi a ṱoḓea",
        nr: "Imininingwana yomthamo iyafuneka",
      }),
    doseInformationMessage:
      g.unavailable,
    needsSchedule:
      v({
        nso: "Go nyakega lenaneo",
        tn: "Go tlhokega thulaganyo",
        st: "Lenaneo lea hlokahala",
        ts: "Xiyimiso xa laveka",
        ss: "Luhlelo luyadzingeka",
        ve: "Nzudzanyo i a ṱoḓea",
        nr: "Ihlelo liyafuneka",
      }),
    scheduleMessage:
      g.unavailable,
    supplyInformationUnavailable:
      g.unavailable,
    loadErrorTitle:
      g.error,
    dashboardUnavailable:
      g.unavailable,
    welcome:
      v({
        nso: "Re a go amogela, {{name}}",
        tn: "O amogetswe, {{name}}",
        st: "Rea u amohela, {{name}}",
        ts: "Wa amukeleka, {{name}}",
        ss: "Wemukelekile, {{name}}",
        ve: "No ṱanganedzwa, {{name}}",
        nr: "Wamukelekile, {{name}}",
      }),
    unreadCount:
      "{{count}}",
    refresh:
      g.retry,
    completeProfile:
      v({
        nso: "Feleletša profaele ya gago",
        tn: "Feleletsa porofaele ya gago",
        st: "Qetella profaele ea hau",
        ts: "Hetisa phurofayili ya wena",
        ss: "Cedzela iphrofayili yakho",
        ve: "Fhedzisani phurofayili yaṋu",
        nr: "Qedela iphrofayili yakho",
      }),
    completeProfileMessage:
      g.unavailable,
    update:
      v({
        nso: "Mpshafatša",
        tn: "Ntšhwafatsa",
        st: "Ntlafatsa",
        ts: "Pfuxeta",
        ss: "Buyeketa",
        ve: "Mvusulusani",
        nr: "Vuselela",
      }),
    nextCollection:
      v({
        nso: "Go tšea dihlare mo go latelago",
        tn: "Go tsaya melemo go go latelang",
        st: "Pokello e latelang ea meriana",
        ts: "Ku teka mirhi loku landzelaka",
        ss: "Kulandvwa kwemitsi lokulandzelako",
        ve: "U dzhia mishonga hu tevhelaho",
        nr: "Ukulandwa kwemithi okulandelako",
      }),
    medicationCollection:
      v({
        nso: "Go tšea dihlare",
        tn: "Go tsaya melemo",
        st: "Pokello ea meriana",
        ts: "Ku teka mirhi",
        ss: "Kulandvwa kwemitsi",
        ve: "U dzhia mishonga",
        nr: "Ukulandwa kwemithi",
      }),
    quantity:
      "#",
    collectionNote:
      v({
        nso: "Tshwaelo",
        tn: "Ntlha",
        st: "Tlhahisoleseling",
        ts: "Nhlamuselo",
        ss: "Inothi",
        ve: "Tshwaelo",
        nr: "Inothi",
      }),
    overdueContact:
      g.unavailable,
    nothingScheduled:
      v({
        nso: "Ga go se se rulagantšwego",
        tn: "Ga go se se rulagantsweng",
        st: "Ha ho letho le reriloeng",
        ts: "A ku na leswi hleriweke",
        ss: "Kute lokuhleliwe",
        ve: "A hu na zwo dzudzanywaho",
        nr: "Akukho okuhleliweko",
      }),
    nothingScheduledMessage:
      g.unavailable,
    assignedWorker:
      v({
        nso: "Mošomi wa Maphelo yo a Abetšwego",
        tn: "Modiri wa Boitekanelo yo o Abetsweng",
        st: "Mosebeletsi oa Bophelo ea Abetsoeng",
        ts: "Mutirhi wa Rihanyo loyi a Averiweke",
        ss: "Sisebenti Setemphilo Lesabelwe",
        ve: "Mushumi wa Mutakalo o Avhelwaho",
        nr: "Isisebenzi Sezepilo Esabelwe",
      }),
    workerLoadError:
      g.error,
    activeAssignment:
      v({
        nso: "Kabelo e a šoma",
        tn: "Kabelo e a dira",
        st: "Kabelo ea sebetsa",
        ts: "Ku averiwa ka tirha",
        ss: "Kabelwa kuyasebenta",
        ve: "U avhelwa hu khou shuma",
        nr: "Ukwabelwa kuyasebenza",
      }),
    assigned:
      v({
        nso: "O abetšwe",
        tn: "O abetswe",
        st: "O abetsoe",
        ts: "Averiwe",
        ss: "Wabelwa",
        ve: "O avhelwa",
        nr: "Wabelwa",
      }),
    noWorker:
      g.unavailable,
    noWorkerMessage:
      g.unavailable,
    myMedications:
      v({
        nso: "Dihlare tša Ka",
        tn: "Melemo ya Me",
        st: "Meriana ea Ka",
        ts: "Mirhi ya Mina",
        ss: "Imitsi Yami",
        ve: "Mishonga Yanga",
        nr: "Imithi Yami",
      }),
    viewAll:
      v({
        nso: "Bona tšohle",
        tn: "Bona tsotlhe",
        st: "Sheba tsohle",
        ts: "Vona hinkwato",
        ss: "Buka konkhe",
        ve: "Vhonani zwoṱhe",
        nr: "Bona koke",
      }),
    supplyLoadError:
      g.error,
    trySupplyAgain:
      g.retry,
    noInstructions:
      g.unavailable,
    lastCollected:
      "{{date}}",
    loadingSupply:
      g.loading,
    unitsLeft:
      "{{count}}",
    noActiveMedications:
      g.unavailable,
    healthMetrics:
      v({
        nso: "Ditekanyo tša Maphelo",
        tn: "Ditekanyo tsa Boitekanelo",
        st: "Litekanyo tsa Bophelo",
        ts: "Swipimo swa Rihanyo",
        ss: "Tilinganiso Temphilo",
        ve: "Zwipimo zwa Mutakalo",
        nr: "Iilinganiso Zepilo",
      }),
    noHealthMetrics:
      g.unavailable,
    appointment:
      v({
        nso: "Peelo",
        tn: "Peelo",
        st: "Kopano",
        ts: "Nhlangano",
        ss: "Sikhatsi sekubonana",
        ve: "Mutangano",
        nr: "Isikhathi sokubonana",
      }),
    clinicProvider:
      g.unavailable,
    noUpcomingAppointments:
      g.unavailable,
    myClinic:
      v({
        nso: "Kliniki ya Ka",
        tn: "Tliliniki ya Me",
        st: "Tleliniki ea Ka",
        ts: "Kiliniki ya Mina",
        ss: "Umtholampilo Wami",
        ve: "Kiliniki Yanga",
        nr: "Umtholapilo Wami",
      }),
    open:
      v({
        nso: "E bulegile",
        tn: "E butswe",
        st: "E butsoe",
        ts: "Yi pfulekile",
        ss: "Uvulekile",
        ve: "Yo vula",
        nr: "Uvuliwe",
      }),
    closed:
      v({
        nso: "E tswaletšwe",
        tn: "E tswetswe",
        st: "E koetsoe",
        ts: "Yi pfariwile",
        ss: "Uvaliwe",
        ve: "Yo vala",
        nr: "Uvaliwe",
      }),
    noClinic:
      g.unavailable,
    id:
      "ID",
    profile:
      v({
        nso: "Profaele",
        tn: "Porofaele",
        st: "Profaele",
        ts: "Phurofayili",
        ss: "Iphrofayili",
        ve: "Phurofayili",
        nr: "Iphrofayili",
      }),
    notifications:
      v({
        nso: "Ditsebišo",
        tn: "Dikitsiso",
        st: "Litsebiso",
        ts: "Switiviso",
        ss: "Tatiso",
        ve: "Nḓivhadzo",
        nr: "Izaziso",
      }),
    unread:
      v({
        nso: "tše sa balwago",
        tn: "tse di sa balwang",
        st: "tse sa baloang",
        ts: "leswi nga hlayiwangiki",
        ss: "letingakafundvwa",
        ve: "dzi sa athu vhaliwaho",
        nr: "ezingakafundwa",
      }),
    viewProfile:
      v({
        nso: "Bona profaele",
        tn: "Bona porofaele",
        st: "Sheba profaele",
        ts: "Vona phurofayili",
        ss: "Buka iphrofayili",
        ve: "Vhonani phurofayili",
        nr: "Bona iphrofayili",
      }),
  };
}

function buildCompactMedications(
  code
) {
  const g =
    otherLanguages[
      code
    ].generic;

  const v = values =>
    choose(
      code,
      values
    );

  const medicine =
    v({
      nso: "Dihlare",
      tn: "Melemo",
      st: "Meriana",
      ts: "Mirhi",
      ss: "Imitsi",
      ve: "Mishonga",
      nr: "Imithi",
    });

  return {
    title:
      v({
        nso: "Dihlare tša Ka",
        tn: "Melemo ya Me",
        st: "Meriana ea Ka",
        ts: "Mirhi ya Mina",
        ss: "Imitsi Yami",
        ve: "Mishonga Yanga",
        nr: "Imithi Yami",
      }),
    loadingPrescriptions:
      g.loading,
    activePrescriptionCount_one:
      "{{count}}",
    activePrescriptionCount_other:
      "{{count}}",
    refresh:
      g.retry,
    loadError:
      g.error,
    supplyTemporaryUnavailable:
      g.unavailable,
    takenMessage:
      v({
        nso: "Sehlare se swailwe bjalo ka se se tšerwego.",
        tn: "Molemo o tshwailwe jaaka o o tserweng.",
        st: "Moriana o tšoailoe hore o nkuoe.",
        ts: "Murhi wu funghiwile leswaku wu tekiwile.",
        ss: "Umutsi umakwe njengalotsatsiwe.",
        ve: "Mushonga wo swaiwa sa wo dzhiiwaho.",
        nr: "Umuthi umakwe njengothethwe.",
      }),
    skippedMessage:
      v({
        nso: "Tekanyo e tshetšwe.",
        tn: "Tekanyo e tlodilwe.",
        st: "Tekanyo e tlotsoe.",
        ts: "Mpimo wu tluriwile.",
        ss: "Umtsamo weqiwe.",
        ve: "Dose yo pfukwa.",
        nr: "Umthamo weqiwe.",
      }),
    updateError:
      g.error,
    noMedicationsTitle:
      g.unavailable,
    noMedicationsBody:
      g.unavailable,
    medication:
      medicine,
    active:
      v({
        nso: "E a šoma",
        tn: "E a dira",
        st: "E sebetsa",
        ts: "Ya tirha",
        ss: "Iyasebenta",
        ve: "I khou shuma",
        nr: "Iyasebenza",
      }),
    inactive:
      v({
        nso: "Ga e šome",
        tn: "Ga e dire",
        st: "Ha e sebetse",
        ts: "A yi tirhi",
        ss: "Ayisebenti",
        ve: "A i shumi",
        nr: "Ayisebenzi",
      }),
    ended:
      v({
        nso: "E fedile",
        tn: "E fedile",
        st: "E felile",
        ts: "Yi herile",
        ss: "Iphelile",
        ve: "Yo fhela",
        nr: "Iphelile",
      }),
    upcoming:
      v({
        nso: "E tlago",
        tn: "E tlang",
        st: "E tlang",
        ts: "Leyi taka",
        ss: "Letako",
        ve: "I ḓaho",
        nr: "Ezako",
      }),
    noInstructions:
      g.unavailable,
    doseProgressSummary:
      "{{taken}} / {{scheduled}}",
    loadingSupply:
      g.loading,
    todaysDosesComplete:
      v({
        nso: "Ditekanyo tša lehono di fedile",
        tn: "Ditekanyo tsa gompieno di fedile",
        st: "Litekanyo tsa kajeno li phethiloe",
        ts: "Mimpimo ya namuntlha yi hetisekile",
        ss: "Imitsamo yanamuhla iphelele",
        ve: "Dose dza ṋamusi dzo fhela",
        nr: "Imithamo yanamhlanje iphelele",
      }),
    medicationSupply:
      medicine,
    loadingSupplyInformation:
      g.loading,
    supplyUnavailable:
      g.unavailable,
    supplyInformationUnavailable:
      g.unavailable,
    supplyDepleted:
      v({
        nso: "Dihlare di fedile",
        tn: "Melemo e fedile",
        st: "Meriana e felile",
        ts: "Mirhi yi herile",
        ss: "Imitsi iphelile",
        ve: "Mishonga yo fhela",
        nr: "Imithi iphelile",
      }),
    dayRemaining:
      "1",
    daysRemaining:
      "{{count}}",
    estimatedSupplyText:
      v({
        nso: "Tekanyetšo e theilwe go go tšea ga mafelelo le lenaneo la tekanyo.",
        tn: "Tekanyetso e theilwe mo go tseeng ga bofelo le thulaganyo ya tekanyo.",
        st: "Khakanyo e ipapisitse le pokello ea morao-rao le lenaneo la tekanyo.",
        ts: "Nkambelo yi ya hi ku teka ka último ni xiyimiso xa mpimo.",
        ss: "Silinganiso sisekelwe ekulandvweni kwekugcina neluhlelo lwemtsamo.",
        ve: "Khumbulelo yo ḓitika nga u dzhia ha u fhedzisela na nzudzanyo ya dose.",
        nr: "Isilinganiso sisekelwe ekulandweni kokugcina nehlelo lomthamo.",
      }),
    doseAmountNeeded:
      g.unavailable,
    missingUnitsText:
      g.unavailable,
    scheduleNeeded:
      g.unavailable,
    missingScheduleText:
      g.unavailable,
    noCollectedSupply:
      g.unavailable,
    noCompletedCollectionText:
      g.unavailable,
    supplyCalculationFailed:
      g.error,
    dispensed:
      v({
        nso: "E filwego",
        tn: "E neetsweng",
        st: "E fanoeng",
        ts: "Leyi nyikeriweke",
        ss: "Leniketiwe",
        ve: "Yo ṋetshedzwaho",
        nr: "Enikelwe",
      }),
    remaining:
      v({
        nso: "E šetšego",
        tn: "E setseng",
        st: "E setseng",
        ts: "Leyi saleke",
        ss: "Lesele",
        ve: "Yo salaho",
        nr: "Eseleleko",
      }),
    daysLeft:
      v({
        nso: "Matšatši a šetšego",
        tn: "Malatsi a setseng",
        st: "Matsatsi a setseng",
        ts: "Masiku lama saleke",
        ss: "Emalanga lasele",
        ve: "Maḓuvha o salaho",
        nr: "Amalanga aseleko",
      }),
    dosesPerDay:
      "/",
    lastCollected:
      "{{date}}",
    unitsPerDose_one:
      "{{count}}",
    unitsPerDose_other:
      "{{count}}",
    trySupplyAgain:
      g.retry,
    form:
      v({
        nso: "Sebopego",
        tn: "Sebopego",
        st: "Sebopeho",
        ts: "Muxaka",
        ss: "Luhlobo",
        ve: "Lushaka",
        nr: "Umhlobo",
      }),
    condition:
      v({
        nso: "Boemo",
        tn: "Maemo",
        st: "Boemo",
        ts: "Xiyimo",
        ss: "Simo",
        ve: "Tshiimo",
        nr: "Ubujamo",
      }),
    prescribedBy:
      v({
        nso: "E laetšwe ke",
        tn: "E laetswe ke",
        st: "E laetsoe ke",
        ts: "Yi tsariwile hi",
        ss: "Iniketwe ngu",
        ve: "Yo ṅwalelwa nga",
        nr: "Inikelwe ngu",
      }),
    schedule:
      v({
        nso: "Lenaneo",
        tn: "Thulaganyo",
        st: "Lenaneo",
        ts: "Xiyimiso",
        ss: "Luhlelo",
        ve: "Nzudzanyo",
        nr: "Ihlelo",
      }),
    noScheduleRecorded:
      g.unavailable,
    startDate:
      v({
        nso: "Letšatši la go thoma",
        tn: "Letlha la go simolola",
        st: "Letsatsi la ho qala",
        ts: "Siku ro sungula",
        ss: "Lilanga lekucala",
        ve: "Ḓuvha ḽa u thoma",
        nr: "Ilanga lokuthoma",
      }),
    endDate:
      v({
        nso: "Letšatši la mafelelo",
        tn: "Letlha la bofelo",
        st: "Letsatsi la ho qetela",
        ts: "Siku ro hetelela",
        ss: "Lilanga lekugcina",
        ve: "Ḓuvha ḽa u fhedza",
        nr: "Ilanga lokugcina",
      }),
    notRecorded:
      g.unavailable,
    latestAdherence:
      g.unavailable,
    taken:
      v({
        nso: "E tšerwe",
        tn: "E tserwe",
        st: "E nkuoe",
        ts: "Yi tekiwile",
        ss: "Itsatsiwe",
        ve: "Yo dzhiiwa",
        nr: "Ithethwe",
      }),
    skipped:
      v({
        nso: "E tshetšwe",
        tn: "E tlodilwe",
        st: "E tlotsoe",
        ts: "Yi tluriwile",
        ss: "Yeqiwe",
        ve: "Yo pfukwa",
        nr: "Yeqiwe",
      }),
    startsOn:
      "{{date}}",
    noActiveScheduleMessage:
      g.unavailable,
    notCollectedTitle:
      g.unavailable,
    notCollectedBody:
      g.unavailable,
    doseAmountConfigurationTitle:
      g.unavailable,
    doseAmountConfigurationBody:
      g.unavailable,
    supplyDepletedTitle:
      g.unavailable,
    supplyDepletedBody:
      g.unavailable,
    supplyVerificationUnavailable:
      g.unavailable,
    scheduledDosesCompleteTitle:
      g.unavailable,
    scheduledDosesCompleteBody:
      "{{count}}",
    todaysDoseProgress:
      v({
        nso: "Tšwelopele ya ditekanyo tša lehono",
        tn: "Tswelelopele ya ditekanyo tsa gompieno",
        st: "Tsoelopele ea litekanyo tsa kajeno",
        ts: "Ku ya phambili ka mimpimo ya namuntlha",
        ss: "Inchubekelembili yemitsamo yanamuhla",
        ve: "Mvelaphanḓa ya dose dza ṋamusi",
        nr: "Iragelophambili yemithamo yanamhlanje",
      }),
    doseProgress:
      "{{taken}} / {{scheduled}}",
    dosesLeft_one:
      "{{count}}",
    dosesLeft_other:
      "{{count}}",
    takenToday_one:
      "{{count}}",
    takenToday_other:
      "{{count}}",
    skippedToday_one:
      "{{count}}",
    skippedToday_other:
      "{{count}}",
    updating:
      g.loading,
    notStartedYet:
      g.unavailable,
    noActiveSchedule:
      g.unavailable,
    checkingSupply:
      g.loading,
    markAsTaken:
      v({
        nso: "Swaya bjalo ka se tšerwego",
        tn: "Tshwaya jaaka e tserwe",
        st: "Tšoaea hore e nkuoe",
        ts: "Fungha leswaku yi tekiwile",
        ss: "Maka njengalotsatsiwe",
        ve: "Swayani sa wo dzhiiwaho",
        nr: "Maka njengothethwe",
      }),
    skipDose:
      v({
        nso: "Tshela tekanyo",
        tn: "Tlola tekanyo",
        st: "Tlola tekanyo",
        ts: "Tlula mpimo",
        ss: "Yeqa umtsamo",
        ve: "Pfukani dose",
        nr: "Yeqa umthamo",
      }),
    todaysSchedule:
      v({
        nso: "Lenaneo la lehono",
        tn: "Thulaganyo ya gompieno",
        st: "Lenaneo la kajeno",
        ts: "Xiyimiso xa namuntlha",
        ss: "Luhlelo lwanamuhla",
        ve: "Nzudzanyo ya ṋamusi",
        nr: "Ihlelo lanamhlanje",
      }),
    complete:
      v({
        nso: "E feletše",
        tn: "E feletse",
        st: "E felletse",
        ts: "Yi hetisekile",
        ss: "Iphelele",
        ve: "Yo fhela",
        nr: "Iphelele",
      }),
    scheduleTaken:
      "{{taken}} / {{scheduled}}",
    activeMedications:
      medicine,
    noActiveMedications:
      g.unavailable,
    previousMedications:
      v({
        nso: "Dihlare tša peleng",
        tn: "Melemo ya pele",
        st: "Meriana ea pele",
        ts: "Mirhi ya khale",
        ss: "Imitsi yangaphambilini",
        ve: "Mishonga ya kale",
        nr: "Imithi yangaphambilini",
      }),
  };
}

function buildCompactAppointments(
  code
) {
  const g =
    otherLanguages[
      code
    ].generic;

  const v = values =>
    choose(
      code,
      values
    );

  return {
    title:
      v({
        nso: "Dipeeletšo",
        tn: "Dipeelo",
        st: "Likopano",
        ts: "Mihlangano",
        ss: "Tikhatsi Tekubonana",
        ve: "Mitevhe",
        nr: "Iinkhathi Zokubonana",
      }),
    subtitle:
      v({
        nso: "Beakanya ketelo ya kliniki gomme o kgethe Mooki goba Ngaka.",
        tn: "Beela ketelo ya tliliniki mme o tlhophe Mooki kgotsa Ngaka.",
        st: "Behela ketelo ea tleliniki ebe u khetha Mooki kapa Ngaka.",
        ts: "Buka ku ya ekliniki kutani u hlawula Muongori kumbe Dokodela.",
        ss: "Bhukha kuvakashela umtholampilo bese ukhetsa Umhlengikati noma Dokotela.",
        ve: "Vhulungani mutangano wa kiliniki ni nange Muongi kana Dokotela.",
        nr: "Bhukha ukuvakatjhela umtholapilo bese ukhetha Umhlengikazi namkha Udokotela.",
      }),
    refresh:
      g.retry,
    bookAppointment:
      v({
        nso: "Beakanya peelo",
        tn: "Beela peelo",
        st: "Behela kopano",
        ts: "Buka nhlangano",
        ss: "Bhukha sikhatsi",
        ve: "Vhulungani mutangano",
        nr: "Bhukha isikhathi",
      }),
    bookAnAppointment:
      v({
        nso: "Beakanya peelo",
        tn: "Beela peelo",
        st: "Behela kopano",
        ts: "Buka nhlangano",
        ss: "Bhukha sikhatsi",
        ve: "Vhulungani mutangano",
        nr: "Bhukha isikhathi",
      }),
    booking:
      g.loading,
    appointment:
      v({
        nso: "Peelo",
        tn: "Peelo",
        st: "Kopano",
        ts: "Nhlangano",
        ss: "Sikhatsi",
        ve: "Mutangano",
        nr: "Isikhathi",
      }),
    clinicProvider:
      g.unavailable,
    dateUnavailable:
      g.unavailable,
    notes:
      v({
        nso: "Dintlha",
        tn: "Dintlha",
        st: "Lintlha",
        ts: "Tinotsi",
        ss: "Emanothi",
        ve: "Notsi",
        nr: "Amanothi",
      }),
    reschedule:
      v({
        nso: "Rulaganya gape",
        tn: "Rulaganya gape",
        st: "Rera hape",
        ts: "Hlela nakambe",
        ss: "Hlela kabusha",
        ve: "Dzudzanyani hafhu",
        nr: "Hlela godu",
      }),
    cancel:
      v({
        nso: "Khansela",
        tn: "Khansela",
        st: "Hlakola",
        ts: "Khansela",
        ss: "Khansela",
        ve: "Khanselani",
        nr: "Khansela",
      }),
    loadError:
      g.error,
    bookingError:
      g.error,
    rescheduleError:
      g.error,
    cancellationError:
      g.error,
    futureDateRequired:
      g.error,
    futureRescheduleRequired:
      g.error,
    reasonRequired:
      g.error,
    bookingTitle:
      v({
        nso: "Beakanya peelo",
        tn: "Beela peelo",
        st: "Behela kopano",
        ts: "Buka nhlangano",
        ss: "Bhukha sikhatsi",
        ve: "Vhulungani mutangano",
        nr: "Bhukha isikhathi",
      }),
    bookingDescription:
      g.unavailable,
    appointmentType:
      v({
        nso: "Mohuta wa peelo",
        tn: "Mofuta wa peelo",
        st: "Mofuta oa kopano",
        ts: "Muxaka wa nhlangano",
        ss: "Luhlobo lwesikhatsi",
        ve: "Lushaka lwa mutangano",
        nr: "Umhlobo wesikhathi",
      }),
    providerQuestion:
      v({
        nso: "O nyaka go bona mang?",
        tn: "O batla go bona mang?",
        st: "U batla ho bona mang?",
        ts: "U lava ku vona mani?",
        ss: "Ufuna kubona bani?",
        ve: "Ni khou ṱoḓa u vhona nnyi?",
        nr: "Ufuna ukubona bani?",
      }),
    dateAndTime:
      v({
        nso: "Letšatši le nako",
        tn: "Letlha le nako",
        st: "Letsatsi le nako",
        ts: "Siku ni nkarhi",
        ss: "Lilanga nesikhatsi",
        ve: "Ḓuvha na tshifhinga",
        nr: "Ilanga nesikhathi",
      }),
    reason:
      v({
        nso: "Lebaka",
        tn: "Lebaka",
        st: "Lebaka",
        ts: "Xivangelo",
        ss: "Sizatfu",
        ve: "Tshivhangi",
        nr: "Isizathu",
      }),
    visitMode:
      v({
        nso: "Mokgwa wa ketelo",
        tn: "Mokgwa wa ketelo",
        st: "Mokhoa oa ketelo",
        ts: "Ndlela ya ku endzela",
        ss: "Indlela yekuvakasha",
        ve: "Nḓila ya u dalela",
        nr: "Indlela yokuvakatjha",
      }),
    duration:
      v({
        nso: "Nako",
        tn: "Nako",
        st: "Nako",
        ts: "Nkarhi",
        ss: "Sikhatsi",
        ve: "Tshifhinga",
        nr: "Isikhathi",
      }),
    optionalNotes:
      v({
        nso: "Dintlha",
        tn: "Dintlha",
        st: "Lintlha",
        ts: "Tinotsi",
        ss: "Emanothi",
        ve: "Notsi",
        nr: "Amanothi",
      }),
    inPerson:
      v({
        nso: "Ka nama",
        tn: "Ka namana",
        st: "Ka seqo",
        ts: "Hi xiviri",
        ss: "Ngembili",
        ve: "Nga muthu",
        nr: "Ngokuqalana",
      }),
    telehealth:
      "Telehealth",
    nurse:
      v({
        nso: "Mooki",
        tn: "Mooki",
        st: "Mooki",
        ts: "Muongori",
        ss: "Umhlengikati",
        ve: "Muongi",
        nr: "Umhlengikazi",
      }),
    doctor:
      v({
        nso: "Ngaka",
        tn: "Ngaka",
        st: "Ngaka",
        ts: "Dokodela",
        ss: "Dokotela",
        ve: "Dokotela",
        nr: "Udokotela",
      }),
    routineCheckup:
      v({
        nso: "Tlhahlobo ya ka mehla",
        tn: "Tlhatlhobo ya ka gale",
        st: "Tlhahlobo e tloaelehileng",
        ts: "Ku kamberiwa ka ntolovelo",
        ss: "Kuhlolwa lokujwayelekile",
        ve: "U ṱoliwa ho ḓoweleaho",
        nr: "Ukuhlolwa okuvamileko",
      }),
    generalConsultation:
      v({
        nso: "Poledišano ya kakaretšo",
        tn: "Therisano ya kakaretso",
        st: "Puisano e akaretsang",
        ts: "Nhlangano wo angarhela",
        ss: "Kubonana lokujwayelekile",
        ve: "U davhidzana ha nga u angaredza",
        nr: "Ukubonana okuvamileko",
      }),
    medicationReview:
      v({
        nso: "Tlhahlobo ya dihlare",
        tn: "Tlhatlhobo ya melemo",
        st: "Tlhahlobo ea meriana",
        ts: "Ku kambela mirhi",
        ss: "Kubuyeketwa kwemitsi",
        ve: "U sedzulusa mishonga",
        nr: "Ukubuyekezwa kwemithi",
      }),
    chronicFollowup:
      v({
        nso: "Tlhokomelo ya malwetši a sa folego",
        tn: "Tlhokomelo ya malwetse a sa foleng",
        st: "Tlhokomelo ea mafu a sa foleng",
        ts: "Nhlayiso wa mavabyi ya nkarhi wo leha",
        ss: "Kulandzela tifo letingapheli",
        ve: "U tevhela malwadze a sa fholi",
        nr: "Ukulandela amalwelwe angapheliko",
      }),
    followupVisit:
      v({
        nso: "Ketelo ya go latela",
        tn: "Ketelo ya go latela",
        st: "Ketelo ea ho latela",
        ts: "Ku endzela ko landzelela",
        ss: "Kuvakasha kwekulandzela",
        ve: "U dalela ha u tevhela",
        nr: "Ukuvakatjha kokulandela",
      }),
    symptoms:
      v({
        nso: "Maswao / Go se phele gabotse",
        tn: "Matshwao / Go sa ikutlwe sentle",
        st: "Matšoao / Ho se ikutloe hantle",
        ts: "Swikombiso / Ku nga titwi kahle",
        ss: "Timphawu / Kungaphili kahle",
        ve: "Tswayo / U sa ḓipfa zwavhuḓi",
        nr: "Iimpawu / Ukungaphili kuhle",
      }),
    other:
      v({
        nso: "Ye nngwe",
        tn: "Go sele",
        st: "E nngwe",
        ts: "Swin'wana",
        ss: "Lokunye",
        ve: "Zwiṅwe",
        nr: "Okhunye",
      }),
    defaultReason:
      g.unavailable,
    minutes:
      "{{count}}",
    rescheduleTitle:
      v({
        nso: "Rulaganya peelo gape",
        tn: "Rulaganya peelo gape",
        st: "Rera kopano hape",
        ts: "Hlela nhlangano nakambe",
        ss: "Hlela sikhatsi kabusha",
        ve: "Dzudzanyani mutangano hafhu",
        nr: "Hlela isikhathi godu",
      }),
    newDateTime:
      v({
        nso: "Letšatši le nako e mpsha",
        tn: "Letlha le nako e ntšhwa",
        st: "Letsatsi le nako e ncha",
        ts: "Siku ni nkarhi lowuntshwa",
        ss: "Lilanga nesikhatsi lesisha",
        ve: "Ḓuvha na tshifhinga tshiswa",
        nr: "Ilanga nesikhathi esitjha",
      }),
    confirmReschedule:
      v({
        nso: "Netefatša",
        tn: "Netefatsa",
        st: "Netefatsa",
        ts: "Tiyisisa",
        ss: "Cinisekisa",
        ve: "Khwaṱhisedzani",
        nr: "Qinisekisa",
      }),
    cancelTitle:
      v({
        nso: "Khansela peelo",
        tn: "Khansela peelo",
        st: "Hlakola kopano",
        ts: "Khansela nhlangano",
        ss: "Khansela sikhatsi",
        ve: "Khanselani mutangano",
        nr: "Khansela isikhathi",
      }),
    cancelQuestion:
      "{{type}} · {{date}}",
    keepAppointment:
      v({
        nso: "Boloka peelo",
        tn: "Boloka peelo",
        st: "Boloka kopano",
        ts: "Hlayisa nhlangano",
        ss: "Gcina sikhatsi",
        ve: "Vhulungani mutangano",
        nr: "Bulunga isikhathi",
      }),
    cancelAppointment:
      v({
        nso: "Khansela peelo",
        tn: "Khansela peelo",
        st: "Hlakola kopano",
        ts: "Khansela nhlangano",
        ss: "Khansela sikhatsi",
        ve: "Khanselani mutangano",
        nr: "Khansela isikhathi",
      }),
    cancelling:
      g.loading,
    saving:
      g.loading,
    upcoming:
      v({
        nso: "Tše di tlago",
        tn: "Tse di tlang",
        st: "Tse tlang",
        ts: "Leyi taka",
        ss: "Letitako",
        ve: "I ḓaho",
        nr: "Ezizako",
      }),
    past:
      v({
        nso: "Tša peleng",
        tn: "Tsa pele",
        st: "Tse fetileng",
        ts: "Leyi hundzeke",
        ss: "Letendlulile",
        ve: "Yo fhiraho",
        nr: "Ezidlulileko",
      }),
    upcomingCount:
      "{{count}}",
    pastCount:
      "{{count}}",
    noUpcoming:
      g.unavailable,
    noPrevious:
      g.unavailable,
    scheduled:
      buildCompactDynamic(
        code
      ).statuses
        .scheduled,
    confirmed:
      buildCompactDynamic(
        code
      ).statuses
        .confirmed,
    pending:
      buildCompactDynamic(
        code
      ).statuses
        .pending,
    completed:
      buildCompactDynamic(
        code
      ).statuses
        .completed,
    cancelled:
      buildCompactDynamic(
        code
      ).statuses
        .cancelled,
    rescheduled:
      buildCompactDynamic(
        code
      ).statuses
        .rescheduled,
    missed:
      buildCompactDynamic(
        code
      ).statuses
        .missed,
    close:
      g.close,
  };
}

function buildCompactRecords(
  code
) {
  const g =
    otherLanguages[
      code
    ].generic;

  const d =
    buildCompactDynamic(
      code
    );

  const v = values =>
    choose(
      code,
      values
    );

  return {
    title:
      v({
        nso: "Direkhoto tša Maphelo",
        tn: "Direkoto tsa Boitekanelo",
        st: "Lirekoto tsa Bophelo",
        ts: "Tirhekhodo ta Rihanyo",
        ss: "Emarekhodi Emphilo",
        ve: "Rekhodo dza Mutakalo",
        nr: "Amarekhodi Wepilo",
      }),
    loading:
      g.loading,
    recordCount_one:
      "{{count}}",
    recordCount_other:
      "{{count}}",
    refresh:
      g.retry,
    loadError:
      g.error,
    allRecords:
      v({
        nso: "Direkhoto ka moka",
        tn: "Direkoto tsotlhe",
        st: "Lirekoto tsohle",
        ts: "Tirhekhodo hinkwato",
        ss: "Onkhe emarekhodi",
        ve: "Rekhodo dzoṱhe",
        nr: "Woke amarekhodi",
      }),
    consultations:
      d.recordTypes
        .consultation,
    laboratory:
      d.recordTypes
        .laboratory,
    medication:
      d.recordTypes
        .medication,
    observations:
      d.recordTypes
        .observation,
    searchPlaceholder:
      v({
        nso: "Nyaka direkhoto tša maphelo",
        tn: "Batla direkoto tsa boitekanelo",
        st: "Batla lirekoto tsa bophelo",
        ts: "Lava tirhekhodo ta rihanyo",
        ss: "Sesha emarekhodi emphilo",
        ve: "Ṱoḓani rekhodo dza mutakalo",
        nr: "Sesha amarekhodi wepilo",
      }),
    noRecordsFound:
      g.unavailable,
    noRecordsFoundBody:
      g.unavailable,
    noRecordsYet:
      g.unavailable,
    noRecordsYetBody:
      g.unavailable,
    healthRecord:
      d.recordTypes
        .healthRecord,
    healthcareProvider:
      g.unavailable,
    available:
      d.statuses
        .available,
    completed:
      d.statuses
        .completed,
    final:
      d.statuses
        .final,
    pending:
      d.statuses
        .pending,
    draft:
      d.statuses
        .draft,
    record:
      d.recordTypes
        .healthRecord,
    dateUnavailable:
      g.unavailable,
    clinicalSummary:
      v({
        nso: "Kakaretšo ya kalafo",
        tn: "Kakaretso ya kalafi",
        st: "Kakaretso ea bongaka",
        ts: "Nkatsakanyo ya vutshunguri",
        ss: "Sifinyeto setekwelapha",
        ve: "Manweledzo a ngalafho",
        nr: "Isirhunyezo sezokwelapha",
      }),
    noSummary:
      g.unavailable,
    category:
      v({
        nso: "Legoro",
        tn: "Mofuta",
        st: "Sehlopha",
        ts: "Ntlawa",
        ss: "Sigaba",
        ve: "Tshigwada",
        nr: "Isigaba",
      }),
  };
}

function buildCompactClinics(
  code
) {
  const g =
    otherLanguages[
      code
    ].generic;

  const d =
    buildCompactDynamic(
      code
    );

  const v = values =>
    choose(
      code,
      values
    );

  return {
    title:
      v({
        nso: "Dikliniki le Dipetlele tša Kgauswi",
        tn: "Ditleliniki le Dipetlele tse di Gaufi",
        st: "Ditleliniki le Lipetlele tse Haufi",
        ts: "Tikiliniki ni Swibedlhele swa le Kusuhi",
        ss: "Emakliniki Netibhedlela Letisedvute",
        ve: "Kiliniki na Vhuongelo zwi re Tsini",
        nr: "Iimtholapilo Neembhedlela Eziseduze",
      }),
    subtitle:
      "{{radius}} km",
    loadError:
      g.error,
    tryAgain:
      g.retry,
    hoursUnavailable:
      g.unavailable,
    open:
      v({
        nso: "E bulegile",
        tn: "E butswe",
        st: "E butsoe",
        ts: "Yi pfulekile",
        ss: "Kuvulekile",
        ve: "Yo vula",
        nr: "Kuvuliwe",
      }),
    closed:
      v({
        nso: "E tswaletšwe",
        tn: "E tswetswe",
        st: "E koetsoe",
        ts: "Yi pfariwile",
        ss: "Kuvaliwe",
        ve: "Yo vala",
        nr: "Kuvaliwe",
      }),
    locationUnavailable:
      g.unavailable,
    locationDenied:
      g.error,
    locationPositionUnavailable:
      g.unavailable,
    locationTimeout:
      g.error,
    locationUnsupported:
      g.unavailable,
    locationRequired:
      v({
        nso: "Lefelo le a nyakega",
        tn: "Lefelo le a tlhokega",
        st: "Sebaka sea hlokahala",
        ts: "Ndhawu ya laveka",
        ss: "Indzawo iyadzingeka",
        ve: "Fhethu hu a ṱoḓea",
        nr: "Indawo iyafuneka",
      }),
    allowLocation:
      g.unavailable,
    allowLocationRadius:
      "{{radius}} km",
    useMyLocation:
      v({
        nso: "Diriša lefelo la ka",
        tn: "Dirisa lefelo la me",
        st: "Sebelisa sebaka sa ka",
        ts: "Tirhisa ndhawu ya mina",
        ss: "Sebentisa indzawo yami",
        ve: "Shumisani fhethu hanga",
        nr: "Sebenzisa indawo yami",
      }),
    locating:
      g.loading,
    navigatingTo:
      "{{name}}",
    facilitiesWithin_one:
      "{{count}} · {{radius}} km",
    facilitiesWithin_other:
      "{{count}} · {{radius}} km",
    facilitiesSorted:
      g.unavailable,
    navigationMapMessage:
      g.unavailable,
    recenter:
      v({
        nso: "Bušetša bogareng",
        tn: "Busetsa fa gare",
        st: "Khutlisetsa bohareng",
        ts: "Vuyisela exivindzini",
        ss: "Buyisela emkhatsini",
        ve: "Vhuiselani vhukati",
        nr: "Buyisela phakathi",
      }),
    end:
      v({
        nso: "Fetša",
        tn: "Fetsa",
        st: "Qetella",
        ts: "Hetisa",
        ss: "Cedzela",
        ve: "Fhedzisani",
        nr: "Qeda",
      }),
    arrived:
      v({
        nso: "O fihlile",
        tn: "O gorogile",
        st: "U fihlile",
        ts: "U fikile",
        ss: "Usufikile",
        ve: "No swika",
        nr: "Usufikile",
      }),
    continueRoute:
      v({
        nso: "Tšwela pele tseleng",
        tn: "Tswelela mo tseleng",
        st: "Tsoela pele tseleng",
        ts: "Yana emhlweni endleleni",
        ss: "Chubeka nemgwaco",
        ve: "Bvelani phanḓa nḓilani",
        nr: "Ragela phambili endleleni",
      }),
    updatingRoute:
      g.loading,
    eta:
      "ETA",
    remaining:
      v({
        nso: "Go šetše",
        tn: "Go setse",
        st: "Ho setse",
        ts: "Leswi saleke",
        ss: "Lesele",
        ve: "Ho salaho",
        nr: "Okuseleko",
      }),
    yourLocation:
      v({
        nso: "Lefelo la gago",
        tn: "Lefelo la gago",
        st: "Sebaka sa hau",
        ts: "Ndhawu ya wena",
        ss: "Indzawo yakho",
        ve: "Fhethu haṋu",
        nr: "Indawo yakho",
      }),
    gpsAccuracy:
      "GPS: {{value}} m",
    kmAway:
      "{{distance}} km",
    startNavigation:
      v({
        nso: "Thoma tsela",
        tn: "Simolola tsela",
        st: "Qala tataiso",
        ts: "Sungula ndlela",
        ss: "Cala kuhamba",
        ve: "Thomani nḓila",
        nr: "Thoma ukuzulazula",
      }),
    endNavigation:
      v({
        nso: "Fetša tsela",
        tn: "Fetsa tsela",
        st: "Emisa tataiso",
        ts: "Hetisa ndlela",
        ss: "Cedzela kuhamba",
        ve: "Fhedzisani nḓila",
        nr: "Qeda ukuzulazula",
      }),
    destination:
      v({
        nso: "Mo o yago",
        tn: "Kwa o yang teng",
        st: "Sebaka seo u eang ho sona",
        ts: "Laha u yaka kona",
        ss: "Lapho uya khona",
        ve: "Hune na khou ya",
        nr: "Lapho uya khona",
      }),
    navigation:
      v({
        nso: "Tsela",
        tn: "Tsela",
        st: "Tataiso",
        ts: "Ndlela",
        ss: "Kuhamba",
        ve: "Nḓila",
        nr: "Ukuzulazula",
      }),
    distance:
      v({
        nso: "Sekgala",
        tn: "Sekgala",
        st: "Sebaka",
        ts: "Mpfhuka",
        ss: "Libanga",
        ve: "Tshikhala",
        nr: "Ibanga",
      }),
    calculatingRoute:
      g.loading,
    withinRadius:
      "{{radius}} km",
    nearbyFacilities_one:
      "{{count}}",
    nearbyFacilities_other:
      "{{count}}",
    waitingForLocation:
      g.loading,
    searchPlaceholder:
      v({
        nso: "Nyaka dikliniki goba dipetlele",
        tn: "Batla ditleliniki kgotsa dipetlele",
        st: "Batla ditleliniki kapa lipetlele",
        ts: "Lava tikiliniki kumbe swibedlhele",
        ss: "Sesha emakliniki noma tibhedlela",
        ve: "Ṱoḓani kiliniki kana vhuongelo",
        nr: "Sesha iimtholapilo namkha iimbhedlela",
      }),
    noFacilities:
      g.unavailable,
    noFacilitiesBody:
      g.unavailable,
    navigating:
      v({
        nso: "Go sepedišwa",
        tn: "Go tsamaisiwa",
        st: "Tataiso",
        ts: "Ku fambisiwa",
        ss: "Kuyahanjwa",
        ve: "Hu khou tshimbidzwa",
        nr: "Kuyazulazulwa",
      }),
    coordinatesRequired:
      g.error,
    routeCalculationFailed:
      g.error,
    routeNotFound:
      g.unavailable,
    routeGeometryInvalid:
      g.error,
    navigationUnavailable:
      g.unavailable,
    currentLocationRequired:
      g.unavailable,
    metre:
      "{{count}} m",
    minute:
      "{{count}} min",
    hour:
      "{{count}} h",
    hourMinutes:
      "{{hours}} h {{minutes}} min",
    theFacility:
      d.facilityTypes
        .clinic,
    startOn:
      "{{road}}",
    startCurrentLocation:
      v({
        nso: "Thoma lefelong la gago",
        tn: "Simolola mo lefelong la gago",
        st: "Qala sebakeng sa hau",
        ts: "Sungula laha u nga kona",
        ss: "Cala lapho ukhona",
        ve: "Thomani fhethu hune na vha",
        nr: "Thoma lapho ukhona",
      }),
    arriveAt:
      "{{destination}}",
    roundaboutRoad:
      "{{road}}",
    roundabout:
      v({
        nso: "Tsena sedikong",
        tn: "Tsena mo sedikong",
        st: "Kena sedikong",
        ts: "Nghena eka xirhendzevutana",
        ss: "Ngena eroundabout",
        ve: "Dzhena kha tshitendeledzi",
        nr: "Ngena eroundabout",
      }),
    merge:
      "{{direction}}{{road}}",
    keep:
      "{{direction}}{{road}}",
    ramp:
      "{{direction}}{{road}}",
    exit:
      "{{direction}}{{road}}",
    continueStraight:
      "{{road}}",
    turn:
      "{{direction}}{{road}}",
    continue:
      "{{direction}}{{road}}",
    continueOnto:
      "{{road}}",
    ahead:
      d.directions
        .straight,
    ontoRoad:
      " {{road}}",
  };
}

function buildCompactDynamic(
  code
) {
  const v = values =>
    choose(
      code,
      values
    );

  return {
    appointmentTypes: {
      routineCheckup:
        v({
          nso: "Tlhahlobo ya ka mehla",
          tn: "Tlhatlhobo ya ka gale",
          st: "Tlhahlobo e tloaelehileng",
          ts: "Ku kamberiwa ka ntolovelo",
          ss: "Kuhlolwa lokujwayelekile",
          ve: "U ṱoliwa ho ḓoweleaho",
          nr: "Ukuhlolwa okuvamileko",
        }),
      generalConsultation:
        v({
          nso: "Poledišano ya kakaretšo",
          tn: "Therisano ya kakaretso",
          st: "Puisano e akaretsang",
          ts: "Nhlangano wo angarhela",
          ss: "Kubonana lokujwayelekile",
          ve: "U davhidzana ha nga u angaredza",
          nr: "Ukubonana okuvamileko",
        }),
      medicationReview:
        v({
          nso: "Tlhahlobo ya dihlare",
          tn: "Tlhatlhobo ya melemo",
          st: "Tlhahlobo ea meriana",
          ts: "Ku kambela mirhi",
          ss: "Kubuyeketwa kwemitsi",
          ve: "U sedzulusa mishonga",
          nr: "Ukubuyekezwa kwemithi",
        }),
      chronicFollowup:
        v({
          nso: "Tlhokomelo ya malwetši a sa folego",
          tn: "Tlhokomelo ya malwetse a sa foleng",
          st: "Tlhokomelo ea mafu a sa foleng",
          ts: "Nhlayiso wa mavabyi ya nkarhi wo leha",
          ss: "Kulandzela tifo letingapheli",
          ve: "U tevhela malwadze a sa fholi",
          nr: "Ukulandela amalwelwe angapheliko",
        }),
      followupVisit:
        v({
          nso: "Ketelo ya go latela",
          tn: "Ketelo ya go latela",
          st: "Ketelo ea ho latela",
          ts: "Ku endzela ko landzelela",
          ss: "Kuvakasha kwekulandzela",
          ve: "U dalela ha u tevhela",
          nr: "Ukuvakatjha kokulandela",
        }),
      symptoms:
        v({
          nso: "Maswao / Go se phele gabotse",
          tn: "Matshwao / Go sa ikutlwe sentle",
          st: "Matšoao / Ho se ikutloe hantle",
          ts: "Swikombiso / Ku nga titwi kahle",
          ss: "Timphawu / Kungaphili kahle",
          ve: "Tswayo / U sa ḓipfa zwavhuḓi",
          nr: "Iimpawu / Ukungaphili kuhle",
        }),
      other:
        v({
          nso: "Ye nngwe",
          tn: "Go sele",
          st: "E nngwe",
          ts: "Swin'wana",
          ss: "Lokunye",
          ve: "Zwiṅwe",
          nr: "Okhunye",
        }),
      appointment:
        v({
          nso: "Peelo",
          tn: "Peelo",
          st: "Kopano",
          ts: "Nhlangano",
          ss: "Sikhatsi",
          ve: "Mutangano",
          nr: "Isikhathi",
        }),
    },

    recordTypes: {
      consultation:
        v({
          nso: "Poledišano",
          tn: "Therisano",
          st: "Puisano",
          ts: "Nhlangano",
          ss: "Kubonana",
          ve: "U davhidzana",
          nr: "Ukubonana",
        }),
      clinicalConsultation:
        v({
          nso: "Poledišano ya kalafo",
          tn: "Therisano ya kalafi",
          st: "Puisano ea bongaka",
          ts: "Nhlangano wa vutshunguri",
          ss: "Kubonana kwetekwelapha",
          ve: "U davhidzana ha ngalafho",
          nr: "Ukubonana kwezokwelapha",
        }),
      laboratory:
        "Laboratory",
      labResult:
        v({
          nso: "Sephetho sa laboratori",
          tn: "Phetho ya laboratori",
          st: "Sephetho sa laboratori",
          ts: "Vuyelo bya laboratori",
          ss: "Umphumela welabhorethri",
          ve: "Mvelelo ya laboratori",
          nr: "Umphumela welabhorethri",
        }),
      test:
        v({
          nso: "Teko",
          tn: "Teko",
          st: "Teko",
          ts: "Xikambelo",
          ss: "Kuhlolwa",
          ve: "Mulingo",
          nr: "Ukuhlolwa",
        }),
      medication:
        v({
          nso: "Dihlare",
          tn: "Melemo",
          st: "Meriana",
          ts: "Mirhi",
          ss: "Imitsi",
          ve: "Mishonga",
          nr: "Imithi",
        }),
      observation:
        v({
          nso: "Tlhokomelo",
          tn: "Kelotlhoko",
          st: "Tlhokomelo",
          ts: "Ku langutisisa",
          ss: "Kucaphela",
          ve: "U sedza",
          nr: "Ukuqaphela",
        }),
      vitals:
        v({
          nso: "Ditekanyo tša mmele",
          tn: "Ditekanyo tsa mmele",
          st: "Litekanyo tsa 'mele",
          ts: "Swipimo swa miri",
          ss: "Tilinganiso temtimba",
          ve: "Zwipimo zwa muvhili",
          nr: "Iilinganiso zomzimba",
        }),
      healthRecord:
        v({
          nso: "Rekhoto ya maphelo",
          tn: "Rekoto ya boitekanelo",
          st: "Rekoto ea bophelo",
          ts: "Rhekhodo ya rihanyo",
          ss: "Lirekhodi lemphilo",
          ve: "Rekhodo ya mutakalo",
          nr: "Irekhodi lepilo",
        }),
    },

    facilityTypes: {
      clinic:
        v({
          nso: "Kliniki",
          tn: "Tliliniki",
          st: "Tleliniki",
          ts: "Kiliniki",
          ss: "Umtholampilo",
          ve: "Kiliniki",
          nr: "Umtholapilo",
        }),
      hospital:
        v({
          nso: "Sepetlele",
          tn: "Sepetlele",
          st: "Sepetlele",
          ts: "Xibedlhele",
          ss: "Sibhedlela",
          ve: "Vhuongelo",
          nr: "Isibhedlela",
        }),
      healthCentre:
        v({
          nso: "Senthara ya Maphelo",
          tn: "Senthara ya Boitekanelo",
          st: "Setsi sa Bophelo",
          ts: "Senthara ya Rihanyo",
          ss: "Sikhungo Setemphilo",
          ve: "Senthara ya Mutakalo",
          nr: "Isikhungo Sepilo",
        }),
      communityHealthCentre:
        v({
          nso: "Senthara ya Maphelo ya Setšhaba",
          tn: "Senthara ya Boitekanelo ya Setšhaba",
          st: "Setsi sa Bophelo sa Sechaba",
          ts: "Senthara ya Rihanyo ya Vaaki",
          ss: "Sikhungo Setemphilo Semmango",
          ve: "Senthara ya Mutakalo ya Tshitshavha",
          nr: "Isikhungo Sepilo Somphakathi",
        }),
    },

    directions: {
      left:
        v({
          nso: "nngele",
          tn: "molemeng",
          st: "ka ho le letšehali",
          ts: "eximatsini",
          ss: "ngesancele",
          ve: "kha tsha monde",
          nr: "ngesinceleni",
        }),
      right:
        v({
          nso: "go la go ja",
          tn: "moja",
          st: "ka ho le letona",
          ts: "exineneni",
          ss: "ngesekudla",
          ve: "kha tsha uḽa",
          nr: "ngesidleni",
        }),
      straight:
        v({
          nso: "thwii",
          tn: "tlhamalalo",
          st: "otlolohile",
          ts: "ku kongoma",
          ss: "condza",
          ve: "thwii",
          nr: "nqopha",
        }),
      slightLeft:
        v({
          nso: "nngele gannyane",
          tn: "molemeng go se kae",
          st: "hanyane ka ho le letšehali",
          ts: "nyana eximatsini",
          ss: "kancane ngesancele",
          ve: "kha tsha monde zwiṱuku",
          nr: "kancani ngesinceleni",
        }),
      slightRight:
        v({
          nso: "go la go ja gannyane",
          tn: "moja go se kae",
          st: "hanyane ka ho le letona",
          ts: "nyana exineneni",
          ss: "kancane ngesekudla",
          ve: "kha tsha uḽa zwiṱuku",
          nr: "kancani ngesidleni",
        }),
      sharpLeft:
        v({
          nso: "nngele kudu",
          tn: "molemeng thata",
          st: "haholo ka ho le letšehali",
          ts: "ngopfu eximatsini",
          ss: "kakhulu ngesancele",
          ve: "kha tsha monde nga maanḓa",
          nr: "khulu ngesinceleni",
        }),
      sharpRight:
        v({
          nso: "go la go ja kudu",
          tn: "moja thata",
          st: "haholo ka ho le letona",
          ts: "ngopfu exineneni",
          ss: "kakhulu ngesekudla",
          ve: "kha tsha uḽa nga maanḓa",
          nr: "khulu ngesidleni",
        }),
      uturn:
        "U-turn",
    },

    durationUnits: {
      hours:
        v({
          nso: "Diiri",
          tn: "Diura",
          st: "Lihora",
          ts: "Tiawara",
          ss: "Emahora",
          ve: "Awara",
          nr: "Ama-iri",
        }),
      days:
        v({
          nso: "Matšatši",
          tn: "Malatsi",
          st: "Matsatsi",
          ts: "Masiku",
          ss: "Emalanga",
          ve: "Maḓuvha",
          nr: "Amalanga",
        }),
      weeks:
        v({
          nso: "Dibeke",
          tn: "Dibeke",
          st: "Libeke",
          ts: "Mavhiki",
          ss: "Emaviki",
          ve: "Vhege",
          nr: "Iimveke",
        }),
      months:
        v({
          nso: "Dikgwedi",
          tn: "Dikgwedi",
          st: "Likhoeli",
          ts: "Tin'hweti",
          ss: "Tinyanga",
          ve: "Miṅwedzi",
          nr: "Iinyanga",
        }),
    },

    durations: {
      lessThanDay:
        "< 1",
      oneTwoDays:
        "1–2",
      threeSevenDays:
        "3–7",
      oneTwoWeeks:
        "1–2",
      moreThanTwoWeeks:
        "> 2",
      moreThanMonth:
        "> 1",
    },

    symptoms: {
      headache:
        v({
          nso: "Go opša ke hlogo",
          tn: "Go opa tlhogo",
          st: "Ho opeloa ke hlooho",
          ts: "Ku vava nhloko",
          ss: "Kubuhlungu inhloko",
          ve: "U rema ha ṱhoho",
          nr: "Ubuhlungu behloko",
        }),
      fever:
        v({
          nso: "Phišo",
          tn: "Letshoroma",
          st: "Feberu",
          ts: "Ku hisa ka miri",
          ss: "Umkhuhlane",
          ve: "Fivha",
          nr: "Umgomani",
        }),
      cough:
        v({
          nso: "Go khohlela",
          tn: "Go gotlhola",
          st: "Ho khohlela",
          ts: "Ku khohlola",
          ss: "Kukhwehlela",
          ve: "U hoṱola",
          nr: "Ukukhohlela",
        }),
      soreThroat:
        v({
          nso: "Megolo ye bohloko",
          tn: "Mometso o botlhoko",
          st: "'Metso o bohloko",
          ts: "Nhamu yo vava",
          ss: "Umphimbo lobuhlungu",
          ve: "Muroṅwe u vhavhaho",
          nr: "Umphimbo obuhlungu",
        }),
      nausea:
        v({
          nso: "Go feroga dibete",
          tn: "Go feroga sebete",
          st: "Ho nyekeloa ke pelo",
          ts: "Xivundza",
          ss: "Sicanucanu",
          ve: "U ṱanzaṱanza",
          nr: "Isicanucanu",
        }),
      vomiting:
        v({
          nso: "Go hlatsa",
          tn: "Go tlhatsa",
          st: "Ho hlatsa",
          ts: "Ku hlanta",
          ss: "Kuhlanza",
          ve: "U ṱanza",
          nr: "Ukuhlanza",
        }),
      diarrhea:
        v({
          nso: "Letšhollo",
          tn: "Letshololo",
          st: "Letšollo",
          ts: "Nchuluko",
          ss: "Sihudo",
          ve: "Ḓiarhea",
          nr: "Urhudo",
        }),
      stomachPain:
        v({
          nso: "Bohloko bja mpeng",
          tn: "Botlhoko jwa mala",
          st: "Bohloko ba mpa",
          ts: "Ku vava khwiri",
          ss: "Kubuhlungu sisu",
          ve: "Vhuṱungu ha thumbu",
          nr: "Ubuhlungu besisu",
        }),
      backPain:
        v({
          nso: "Bohloko bja mokokotlo",
          tn: "Botlhoko jwa mokwatla",
          st: "Bohloko ba mokokotlo",
          ts: "Ku vava nhlana",
          ss: "Kubuhlungu umhlane",
          ve: "Vhuṱungu ha muṱana",
          nr: "Ubuhlungu bomhlana",
        }),
      dizziness:
        v({
          nso: "Go dikologa",
          tn: "Go tsewa ke sedidi",
          st: "Ho tsekela",
          ts: "Xizunguzungu",
          ss: "Sizunguzungu",
          ve: "U tshimbila ṱhoho",
          nr: "Isiyezi",
        }),
      fatigue:
        v({
          nso: "Go lapa",
          tn: "Go lapa",
          st: "Mokhathala",
          ts: "Ku karhala",
          ss: "Kukhatsala",
          ve: "U neta",
          nr: "Ukudinwa",
        }),
      runnyNose:
        v({
          nso: "Nko ye e elelago",
          tn: "Nko e e elelang",
          st: "Nko e kollang",
          ts: "Nhompfu leyi khulukaka",
          ss: "Imphumulo legijimako",
          ve: "Ningo i elelaho",
          nr: "Ipumulo evuzako",
        }),
      shortnessOfBreath:
        v({
          nso: "Go hloka moya",
          tn: "Go tlhaela mowa",
          st: "Ho haelloa ke moea",
          ts: "Ku heleriwa hi moya",
          ss: "Kuphelelwa ngumoya",
          ve: "U kundelwa u fema",
          nr: "Ukuphelelwa mumoya",
        }),
      chestPain:
        v({
          nso: "Bohloko bja sefuba",
          tn: "Botlhoko jwa sehuba",
          st: "Bohloko ba sefuba",
          ts: "Ku vava xifuva",
          ss: "Kubuhlungu sifuba",
          ve: "Vhuṱungu ha khana",
          nr: "Ubuhlungu besifuba",
        }),
    },

    allergies: {
      penicillin: "Penicillin",
      ibuprofen: "Ibuprofen",
      aspirin: "Aspirin",
      sulfonamides:
        "Sulfonamides",
      peanuts:
        v({
          nso: "Matokomane",
          tn: "Manoko",
          st: "Matokomane",
          ts: "Timanga",
          ss: "Emantongomane",
          ve: "Nḓuhu",
          nr: "Amantongomane",
        }),
      shellfish:
        v({
          nso: "Dijo tša lewatle",
          tn: "Dijo tsa lewatle",
          st: "Lijo tsa leoatleng",
          ts: "Swakudya swa le lwandle",
          ss: "Kudla kwaselwandle",
          ve: "Zwiḽiwa zwa lwanzhe",
          nr: "Ukudla kwelwandle",
        }),
      latex: "Latex",
    },

    conditions: {
      diabetes:
        v({
          nso: "Bolwetši bja swikiri",
          tn: "Bolwetse jwa sukiri",
          st: "Lefu la tsoekere",
          ts: "Vuvabyi bya chukela",
          ss: "Sifo sashukela",
          ve: "Vhulwadze ha swigiri",
          nr: "Ubulwelwe betjhukela",
        }),
      hypertension:
        v({
          nso: "Kgatelelo ya madi",
          tn: "Kgatelelo ya madi",
          st: "Khatello e phahameng ea mali",
          ts: "Ntshikelelo wa ngati",
          ss: "Umfutfo wegazi",
          ve: "Mutsiko wa malofha",
          nr: "Umfutho wegazi",
        }),
      asthma:
        v({
          nso: "Asma",
          tn: "Asma",
          st: "Asma",
          ts: "Asthma",
          ss: "Isifuba",
          ve: "Asthma",
          nr: "Isifuba",
        }),
      highCholesterol:
        "Cholesterol",
      heartDisease:
        v({
          nso: "Bolwetši bja pelo",
          tn: "Bolwetse jwa pelo",
          st: "Lefu la pelo",
          ts: "Vuvabyi bya mbilu",
          ss: "Sifo senhlitiyo",
          ve: "Vhulwadze ha mbilu",
          nr: "Ubulwelwe behliziyo",
        }),
      kidneyDisease:
        v({
          nso: "Bolwetši bja dipshio",
          tn: "Bolwetse jwa diphilo",
          st: "Lefu la liphio",
          ts: "Vuvabyi bya tinso",
          ss: "Sifo setinso",
          ve: "Vhulwadze ha tswio",
          nr: "Ubulwelwe bezinso",
        }),
      epilepsy:
        v({
          nso: "Sethoathoa",
          tn: "Sethotlo",
          st: "Sethoathoa",
          ts: "Epilepsy",
          ss: "Sifo sekuquleka",
          ve: "Epilepsy",
          nr: "Isifo sokuwa",
        }),
    },

    statuses: {
      scheduled:
        v({
          nso: "Go rulagantšwe",
          tn: "Go rulagantswe",
          st: "E reriloe",
          ts: "Swi hleriwile",
          ss: "Kuhleliwe",
          ve: "Zwo dzudzanywa",
          nr: "Kuhleliwe",
        }),
      confirmed:
        v({
          nso: "Go netefaditšwe",
          tn: "Go netefaditswe",
          st: "E netefalitsoe",
          ts: "Swi tiyisisiwile",
          ss: "Kucinisekisiwe",
          ve: "Zwo khwaṱhisedzwa",
          nr: "Kuqinisekisiwe",
        }),
      pending:
        v({
          nso: "Go sa letetšwe",
          tn: "Go emetswe",
          st: "E emetse",
          ts: "Swa ha yimele",
          ss: "Kusalindzile",
          ve: "Zwo lindela",
          nr: "Kusalindile",
        }),
      completed:
        v({
          nso: "Go phethilwe",
          tn: "Go weditswe",
          st: "E phethiloe",
          ts: "Swi hetisekile",
          ss: "Kuphelele",
          ve: "Zwo fhela",
          nr: "Kuqediwe",
        }),
      cancelled:
        v({
          nso: "Go khansetšwe",
          tn: "Go khantshetswe",
          st: "E hlakotsoe",
          ts: "Swi khanseriwile",
          ss: "Kukhanseliwe",
          ve: "Zwo khanselwa",
          nr: "Kukhanseliwe",
        }),
      rescheduled:
        v({
          nso: "Go rulagantšwe gape",
          tn: "Go rulagantswe gape",
          st: "E reriloe hape",
          ts: "Swi hleriwile nakambe",
          ss: "Kuhleliwe kabusha",
          ve: "Zwo dzudzanywa hafhu",
          nr: "Kuhlelwe godu",
        }),
      missed:
        v({
          nso: "Go fošitšwe",
          tn: "Go fositswe",
          st: "E fositswe",
          ts: "Swi hundziwile",
          ss: "Kuphosiwe",
          ve: "Zwo fhukwa",
          nr: "Kuphosiwe",
        }),
      available:
        v({
          nso: "E gona",
          tn: "E teng",
          st: "E teng",
          ts: "Swi kona",
          ss: "Kuyatfolakala",
          ve: "Zwi hone",
          nr: "Kuyatholakala",
        }),
      final:
        v({
          nso: "Ya mafelelo",
          tn: "Ya bofelo",
          st: "Ea ho qetela",
          ts: "Yo hetelela",
          ss: "Yekugcina",
          ve: "Ya u fhedza",
          nr: "Yokugcina",
        }),
      draft:
        v({
          nso: "Seketshe",
          tn: "Mokwalo wa ntlha",
          st: "Moralo",
          ts: "Mpfapfarhuto",
          ss: "Luhlaka",
          ve: "Mvelelo ya u thoma",
          nr: "Okusalungiswako",
        }),
    },

    providerRoles: {
      nurse:
        v({
          nso: "Mooki",
          tn: "Mooki",
          st: "Mooki",
          ts: "Muongori",
          ss: "Umhlengikati",
          ve: "Muongi",
          nr: "Umhlengikazi",
        }),
      doctor:
        v({
          nso: "Ngaka",
          tn: "Ngaka",
          st: "Ngaka",
          ts: "Dokodela",
          ss: "Dokotela",
          ve: "Dokotela",
          nr: "Udokotela",
        }),
      pharmacist:
        v({
          nso: "Rakhemisi",
          tn: "Rakhemisi",
          st: "Rakhemisi",
          ts: "N'anga ya mirhi",
          ss: "Sokhemisi",
          ve: "Rafamasi",
          nr: "Usokhemisi",
        }),
      healthcareWorker:
        v({
          nso: "Mošomi wa Maphelo",
          tn: "Modiri wa Boitekanelo",
          st: "Mosebeletsi oa Bophelo",
          ts: "Mutirhi wa Rihanyo",
          ss: "Sisebenti Setemphilo",
          ve: "Mushumi wa Mutakalo",
          nr: "Isisebenzi Sezepilo",
        }),
    },

    medicationForms: {
      tablet: "Tablet",
      capsule: "Capsule",
      syrup: "Syrup",
      liquid:
        v({
          nso: "Seela",
          tn: "Seedi",
          st: "Mokelikeli",
          ts: "Nhlanganelo wa mati",
          ss: "Luketshezi",
          ve: "Tshiḓi",
          nr: "Okumamanzi",
        }),
      injection:
        v({
          nso: "Hlabo",
          tn: "Ente",
          st: "Ente",
          ts: "Ntlhavelo",
          ss: "Umjovo",
          ve: "Nṱhavhelo",
          nr: "Umjovo",
        }),
      cream: "Cream",
      ointment: "Ointment",
      inhaler: "Inhaler",
      drops:
        v({
          nso: "Marothodi",
          tn: "Marothodi",
          st: "Marotholi",
          ts: "Mathonsi",
          ss: "Emaconsi",
          ve: "Mathonsi",
          nr: "Amaconsi",
        }),
      patch: "Patch",
    },

    healthMetrics: {
      bloodPressure:
        v({
          nso: "Kgatelelo ya madi",
          tn: "Kgatelelo ya madi",
          st: "Khatello ea mali",
          ts: "Ntshikelelo wa ngati",
          ss: "Umfutfo wegazi",
          ve: "Mutsiko wa malofha",
          nr: "Umfutho wegazi",
        }),
      weight:
        v({
          nso: "Boima",
          tn: "Boima",
          st: "Boima",
          ts: "Ntiko",
          ss: "Sisindvo",
          ve: "Tshileme",
          nr: "Isisindo",
        }),
      glucose:
        v({
          nso: "Swikiri ya madi",
          tn: "Sukiri ya madi",
          st: "Tsoekere ea mali",
          ts: "Chukela ya ngati",
          ss: "Shukela wegazi",
          ve: "Swigiri ya malofha",
          nr: "Itjhukela yegazi",
        }),
      temperature:
        v({
          nso: "Thempheretšha",
          tn: "Thempheretšha",
          st: "Mocheso",
          ts: "Mahiselo",
          ss: "Lizinga lekushisa",
          ve: "Thempheretsha",
          nr: "Izinga lokutjhisa",
        }),
      heartRate:
        v({
          nso: "Go betha ga pelo",
          tn: "Go itaya ga pelo",
          st: "Ho otla ha pelo",
          ts: "Ku ba ka mbilu",
          ss: "Kushaya kwenhlitiyo",
          ve: "U rwa ha mbilu",
          nr: "Ukubetha kwehliziyo",
        }),
      bmi: "BMI",
      oxygenSaturation:
        v({
          nso: "Oksitšene ya madi",
          tn: "Oksijene ya madi",
          st: "Oksijene maling",
          ts: "Oxygen engatini",
          ss: "Umoya-mpilo egatini",
          ve: "Oxygen malofhani",
          nr: "Umoya-mpilo egazini",
        }),
    },
  };
}

function buildCompactChatbot(
  code
) {
  const g =
    otherLanguages[
      code
    ].generic;

  const v = values =>
    choose(
      code,
      values
    );

  return {
    floatingTooltip:
      v({
        nso: "Mothuši wa gago wa maphelo wa AI",
        tn: "Mothusi wa gago wa boitekanelo wa AI",
        st: "Mothusi oa hau oa bophelo oa AI",
        ts: "Mupfuni wa wena wa rihanyo wa AI",
        ss: "Umsiti wakho wetemphilo we-AI",
        ve: "Muthusi waṋu wa mutakalo wa AI",
        nr: "Umsizi wakho wezepilo we-AI",
      }),
    openAssistant:
      "PhilaChatBot",
    online:
      v({
        nso: "O mo inthaneteng",
        tn: "Mo inthaneteng",
        st: "Inthaneteng",
        ts: "Online",
        ss: "Uxhumekile",
        ve: "Online",
        nr: "Uxhumekile",
      }),
    assistantSubtitle:
      "PhilaLink",
    minimize:
      v({
        nso: "Fokotša",
        tn: "Fokotsa",
        st: "Fokotsa",
        ts: "Hunguta",
        ss: "Nciphisa",
        ve: "Fhungudzani",
        nr: "Nciphisa",
      }),
    moreOptions:
      v({
        nso: "Dikgetho tše dingwe",
        tn: "Dikgetho tse dingwe",
        st: "Likhetho tse ling",
        ts: "Swin'wana swo hlawula",
        ss: "Letinye tindlela",
        ve: "Dziṅwe khetho",
        nr: "Ezinye iinkhetho",
      }),
    chatOptions:
      v({
        nso: "Dikgetho tša poledišano",
        tn: "Dikgetho tsa puisano",
        st: "Likhetho tsa puisano",
        ts: "Swihlawulekisi swa mbulavurisano",
        ss: "Tinkhetselo tengcoco",
        ve: "Khetho dza nyambedzano",
        nr: "Iinkhetho zekulumo",
      }),
    chatOptionsDescription:
      "PhilaChatBot",
    clearHistory:
      v({
        nso: "Phumola histori ya poledišano",
        tn: "Phimola hisitori ya puisano",
        st: "Hlakola nalane ea puisano",
        ts: "Susa matimu ya mbulavurisano",
        ss: "Sula umlandvo wengcoco",
        ve: "Phumulani ḓivhazwakale ya nyambedzano",
        nr: "Sula umlando wekulumiswano",
      }),
    clearing:
      g.loading,
    clearDescription:
      v({
        nso: "Thoma poledišano ye mpsha.",
        tn: "Simolola puisano e ntšhwa.",
        st: "Qala puisano e ncha.",
        ts: "Sungula mbulavurisano lowuntshwa.",
        ss: "Cala ingcoco lensha.",
        ve: "Thomani nyambedzano ntswa.",
        nr: "Thoma ikulumo etja.",
      }),
    waitForResponse:
      g.loading,
    close:
      g.close,
    clearConfirm:
      v({
        nso: "Phumola histori ya poledišano?",
        tn: "Phimola hisitori ya puisano?",
        st: "Hlakola nalane ea puisano?",
        ts: "Susa matimu ya mbulavurisano?",
        ss: "Sula umlandvo wengcoco?",
        ve: "Phumulani ḓivhazwakale ya nyambedzano?",
        nr: "Sula umlando wekulumiswano?",
      }),
    clearError:
      g.error,
    initialMessage:
      v({
        nso: "Nka go thuša bjang?",
        tn: "Nka go thusa jang?",
        st: "Nka u thusa joang?",
        ts: "Ndi nga ku pfuna yini?",
        ss: "Ngingakusita njani?",
        ve: "Ndi nga ni thusa hani?",
        nr: "Ngingakusiza njani?",
      }),
    noResponse:
      g.unavailable,
    processError:
      g.error,
    welcomeTitle:
      v({
        nso: "Dumela, ke PhilaChatBot",
        tn: "Dumela, ke PhilaChatBot",
        st: "Lumela, ke PhilaChatBot",
        ts: "Avuxeni, ndzi PhilaChatBot",
        ss: "Sawubona, ngingu-PhilaChatBot",
        ve: "Ndaa, ndi PhilaChatBot",
        nr: "Lotjhani, ngingu-PhilaChatBot",
      }),
    welcomeBody:
      v({
        nso: "Ke mothuši wa gago wa maphelo wa PhilaLink.",
        tn: "Ke mothusi wa gago wa boitekanelo wa PhilaLink.",
        st: "Ke mothusi oa hau oa bophelo oa PhilaLink.",
        ts: "Ndi mupfuni wa wena wa rihanyo wa PhilaLink.",
        ss: "Ngingumsiti wakho wetemphilo we-PhilaLink.",
        ve: "Ndi muthusi waṋu wa mutakalo wa PhilaLink.",
        nr: "Ngingumsizi wakho wezepilo we-PhilaLink.",
      }),
    disclaimerTitle:
      v({
        nso: "Temošo ya bohlokwa",
        tn: "Tlhagiso ya botlhokwa",
        st: "Tlhokomeliso ea bohlokoa",
        ts: "Xitsundzuxo xa nkoka",
        ss: "Secwayiso lesibalulekile",
        ve: "Tsivhudzo ya ndeme",
        nr: "Isiyeleliso esiqakathekileko",
      }),
    disclaimerBody:
      v({
        nso: "PhilaChatBot e fa tshedimošo ya maphelo ka kakaretšo gomme ga e tšee legato la setsebi sa maphelo.",
        tn: "PhilaChatBot e naya tshedimosetso ya boitekanelo mme ga e tseye maemo a modiri wa boitekanelo.",
        st: "PhilaChatBot e fana ka tlhahisoleseling ea bophelo 'me ha e nke sebaka sa setsebi sa bophelo.",
        ts: "PhilaChatBot yi nyika vuxokoxoko bya rihanyo naswona a yi sivi mutirhi wa rihanyo.",
        ss: "PhilaChatBot iniketa imininingwane yemphilo futsi ayitsatsi indzawo yemsebenti wetemphilo.",
        ve: "PhilaChatBot i ṋea zwidodombedzwa zwa mutakalo nahone a i dzhieli vhudzulo mushumi wa mutakalo.",
        nr: "PhilaChatBot inikela imininingwana yepilo begodu ayithathi indawo yesisebenzi sezepilo.",
      }),
    understandContinue:
      v({
        nso: "Ke a kwešiša — tšwela pele",
        tn: "Ke a tlhaloganya — tswelela",
        st: "Kea utloisisa — tsoela pele",
        ts: "Ndza twisisa — yana emhlweni",
        ss: "Ngiyakucondza — chubeka",
        ve: "Ndi a pfesesa — bvelani phanḓa",
        nr: "Ngiyazwisisa — ragela phambili",
      }),
    howCanHelp:
      v({
        nso: "Nka go thuša bjang?",
        tn: "Nka go thusa jang?",
        st: "Nka u thusa joang?",
        ts: "Ndi nga ku pfuna yini?",
        ss: "Ngingakusita njani?",
        ve: "Ndi nga ni thusa hani?",
        nr: "Ngingakusiza njani?",
      }),
    quickStartBody:
      "PhilaChatBot",
    quickChatTitle:
      v({
        nso: "Bolela le Phila",
        tn: "Bua le Phila",
        st: "Bua le Phila",
        ts: "Vulavula na Phila",
        ss: "Khuluma naPhila",
        ve: "Ambani na Phila",
        nr: "Khuluma noPhila",
      }),
    quickChatDescription:
      v({
        nso: "Botšiša potšišo ya maphelo.",
        tn: "Botsa potso ya boitekanelo.",
        st: "Botsa potso ea bophelo.",
        ts: "Vutisa xivutiso xa rihanyo.",
        ss: "Buta umbuto wetemphilo.",
        ve: "Vhudzisani mbudziso ya mutakalo.",
        nr: "Buza umbuzo wezepilo.",
      }),
    quickSymptomsTitle:
      v({
        nso: "Lekola maswao a ka",
        tn: "Sekaseka matshwao a me",
        st: "Hlahloba matšoao a ka",
        ts: "Kambela swikombiso swa mina",
        ss: "Hlola timphawu tami",
        ve: "Sedzani tswayo dzanga",
        nr: "Hlola iimpawu zami",
      }),
    quickSymptomsDescription:
      v({
        nso: "Thoma tlhahlobo ya maphelo.",
        tn: "Simolola tlhatlhobo ya boitekanelo.",
        st: "Qala tlhahlobo ea bophelo.",
        ts: "Sungula xikambelo xa rihanyo.",
        ss: "Cala kuhlolwa kwemphilo.",
        ve: "Thomani u ṱoliwa ha mutakalo.",
        nr: "Thoma ukuhlolwa kwepilo.",
      }),
    quickMedicationsTitle:
      v({
        nso: "Dihlare tša ka",
        tn: "Melemo ya me",
        st: "Meriana ea ka",
        ts: "Mirhi ya mina",
        ss: "Imitsi yami",
        ve: "Mishonga yanga",
        nr: "Imithi yami",
      }),
    quickMedicationsDescription:
      v({
        nso: "Botšiša ka dihlare tša gago.",
        tn: "Botsa ka melemo ya gago.",
        st: "Botsa ka meriana ea hau.",
        ts: "Vutisa hi mirhi ya wena.",
        ss: "Buta ngemitsi yakho.",
        ve: "Vhudzisani nga mishonga yaṋu.",
        nr: "Buza ngemithi yakho.",
      }),
    quickMedicationsPrompt:
      v({
        nso: "Mpolelele ka dihlare tša ka tša PhilaLink.",
        tn: "Mpolelele ka melemo ya me ya PhilaLink.",
        st: "Mpolelle ka meriana ea ka ea PhilaLink.",
        ts: "Byela hi mirhi ya mina ya PhilaLink.",
        ss: "Ngitjele ngemitsi yami ye-PhilaLink.",
        ve: "Mmbudzeni nga mishonga yanga ya PhilaLink.",
        nr: "Ngitjela ngemithi yami ye-PhilaLink.",
      }),
    quickAllergiesTitle:
      v({
        nso: "Dialeji tša ka",
        tn: "Dialeji tsa me",
        st: "Dialeji tsa ka",
        ts: "Swilo leswi nga ndzi twanisiki",
        ss: "Tingcondvongcondvo tami",
        ve: "Zwithu zwine zwa nnditshinyadza",
        nr: "Izinto engingazwani nazo",
      }),
    quickAllergiesDescription:
      v({
        nso: "Botšiša ka dialeji tša gago.",
        tn: "Botsa ka dialeji tsa gago.",
        st: "Botsa ka dialeji tsa hau.",
        ts: "Vutisa hi swilo leswi nga ku twanisiki.",
        ss: "Buta ngetingcondvongcondvo takho.",
        ve: "Vhudzisani nga zwithu zwine zwa ni tshinyadza.",
        nr: "Buza ngezinto ongazwani nazo.",
      }),
    quickAllergiesPrompt:
      v({
        nso: "Ke dialeji dife tše di lego profaeleng ya ka?",
        tn: "Ke dialeji dife tse di mo porofaeleng ya me?",
        st: "Ke dialeji life tse profaeleng ea ka?",
        ts: "Hi swihi leswi nga ndzi twanisiki leswi nga eka phurofayili ya mina?",
        ss: "Ngutiphi tingcondvongcondvo letiku-phrofayili yami?",
        ve: "Ndi zwithu zwifhio zwine zwa nnditshinyadza zwi re kha phurofayili yanga?",
        nr: "Ngiziphi izinto engingazwani nazo ezisephrofayilini yami?",
      }),
    quickHelpTitle:
      v({
        nso: "Ke nyake thušo neng?",
        tn: "Ke batle thuso leng?",
        st: "Ke batle thuso neng?",
        ts: "Ndi lava mpfuno rini?",
        ss: "Ngifune lusito nini?",
        ve: "Ndi ṱoḓe thuso lini?",
        nr: "Ngifune isizo nini?",
      }),
    quickHelpDescription:
      v({
        nso: "Botšiša ka maswao a kotsi.",
        tn: "Botsa ka matshwao a kotsi.",
        st: "Botsa ka matšoao a kotsi.",
        ts: "Vutisa hi swikombiso swa khombo.",
        ss: "Buta ngetimphawu letiyingozi.",
        ve: "Vhudzisani nga tswayo dza khombo.",
        nr: "Buza ngeempawu eziyingozi.",
      }),
    quickHelpPrompt:
      v({
        nso: "Ke maswao afe a nyakago thušo ya tšhoganetšo?",
        tn: "Ke matshwao afe a a tlhokang thuso ya tshoganyetso?",
        st: "Ke matšoao afe a hlokang thuso ea tšohanyetso?",
        ts: "Hi swihi swikombiso leswi lavaka mpfuno wa xihatla?",
        ss: "Ngutiphi timphawu letidzinga lusito loluphutfumako?",
        ve: "Ndi tswayo dzifhio dzine dza ṱoḓa thuso ya shishi?",
        nr: "Ngiziphi iimpawu ezidinga isizo eliphuthumako?",
      }),
    ageTitle:
      v({
        nso: "O na le mengwaga ye mekae?",
        tn: "O na le dingwaga di le kae?",
        st: "U lilemo li kae?",
        ts: "U na malembe mangani?",
        ss: "Uneminyaka lemingakhi?",
        ve: "Ni na miṅwaha mingana?",
        nr: "Uneminyaka emingaki?",
      }),
    ageDescription:
      v({
        nso: "Mengwaga ya gago e thuša PhilaChatBot go fa tlhahlo ye e loketšego.",
        tn: "Dingwaga tsa gago di thusa PhilaChatBot go naya kaelo e e tshwanetseng.",
        st: "Lilemo tsa hau li thusa PhilaChatBot ho fana ka tataiso e loketseng.",
        ts: "Malembe ya wena ya pfuna PhilaChatBot ku nyika nkongomiso lowu faneleke.",
        ss: "Iminyaka yakho isita PhilaChatBot kuniketa sicondziso lesifanele.",
        ve: "Miṅwaha yaṋu i thusa PhilaChatBot u ṋea nyeletshedzo yo teaho.",
        nr: "Iminyaka yakho isiza PhilaChatBot ukunikela isinqophiso esifaneleko.",
      }),
    age:
      v({
        nso: "Mengwaga",
        tn: "Dingwaga",
        st: "Lilemo",
        ts: "Malembe",
        ss: "Iminyaka",
        ve: "Miṅwaha",
        nr: "Iminyaka",
      }),
    agePlaceholder:
      v({
        nso: "Tsenya mengwaga ya gago",
        tn: "Tsenya dingwaga tsa gago",
        st: "Kenya lilemo tsa hau",
        ts: "Nghenisa malembe ya wena",
        ss: "Faka iminyaka yakho",
        ve: "Dzhenisani miṅwaha yaṋu",
        nr: "Faka iminyaka yakho",
      }),
    ageInvalid:
      "1–120",
    agePrivacy:
      v({
        nso: "Tshedimošo ye e dirišwa feela tlhahlobong ya maswao.",
        tn: "Tshedimosetso eno e dirisiwa fela mo tlhatlhobong ya matshwao.",
        st: "Lintlha tsena li sebelisoa feela tlhahlobong ea matšoao.",
        ts: "Vuxokoxoko leswi byi tirhisiwa ntsena eka xikambelo xa swikombiso.",
        ss: "Lemininingwane isetjentiswa kuphela ekuhlolweni kwetimphawu.",
        ve: "Zwidodombedzwa hezwi zwi shumiswa fhedzi kha u ṱola tswayo.",
        nr: "Imininingwana le isetjenziswa kwaphela ekuhlolweni kweempawu.",
      }),
    symptomsTitle:
      v({
        nso: "O na le maswao afe?",
        tn: "O na le matshwao afe?",
        st: "U na le matšoao afe?",
        ts: "U na swikombiso swihi?",
        ss: "Unatimphawu tini?",
        ve: "Ni na tswayo dzifhio?",
        nr: "Uneempawu ziphi?",
      }),
    symptomsDescription:
      v({
        nso: "Kgetha maswao ka moka ao a lego gona.",
        tn: "Tlhopha matshwao otlhe a a teng.",
        st: "Khetha matšoao ohle ao u nang le ona.",
        ts: "Hlawula swikombiso hinkwako leswi u nga na swona.",
        ss: "Khetsa tonkhe timphawu lonato.",
        ve: "Nangani tswayo dzoṱhe dzine na vha nadzo.",
        nr: "Khetha zoke iimpawu onazo.",
      }),
    addSymptom:
      v({
        nso: "Tsenya leswao",
        tn: "Tsenya letshwao",
        st: "Kenya letšoao",
        ts: "Engetela xikombiso",
        ss: "Ngeta luphawu",
        ve: "Engedzani tswayo",
        nr: "Ngezelela iphawu",
      }),
    symptomPlaceholder:
      v({
        nso: "Leswao",
        tn: "Letshwao",
        st: "Letšoao",
        ts: "Xikombiso",
        ss: "Luphawu",
        ve: "Tswayo",
        nr: "Iphawu",
      }),
    addSymptomAria:
      "+",
    selectedSymptoms:
      v({
        nso: "Maswao a kgethilwego",
        tn: "Matshwao a a tlhophilweng",
        st: "Matšoao a khethiloeng",
        ts: "Swikombiso leswi hlawuriweke",
        ss: "Timphawu letikhetsiwe",
        ve: "Tswayo dzo nangwaho",
        nr: "Iimpawu ezikhethiweko",
      }),
    removeSymptom:
      "{{item}}",
    seriousSymptoms:
      v({
        nso: "Maswao a mangwe a ka ba kotsi. PhilaChatBot e tla thoma ka go lekola tšhoganetšo.",
        tn: "Matshwao mangwe a ka nna kotsi. PhilaChatBot e tla simolola ka go sekaseka tshoganyetso.",
        st: "Matšoao a mang a ka ba kotsi. PhilaChatBot e tla qala ka tlhahlobo ea tšohanyetso.",
        ts: "Swikombiso swin'wana swi nga va ni khombo. PhilaChatBot yi ta sungula hi ku kambela xihatla.",
        ss: "Letinye timphawu tingaba yingoti. PhilaChatBot itawucala ngekuhlola simo lesiphutfumako.",
        ve: "Dziṅwe tswayo dzi nga vha na khombo. PhilaChatBot i ḓo thoma nga u ṱola tshiimo tsha shishi.",
        nr: "Ezinye iimpawu zingaba yingozi. PhilaChatBot izokuthoma ngokuhlola ubujamo obuphuthumako.",
      }),
    durationTitle:
      v({
        nso: "O bile le maswao nako ye kaakang?",
        tn: "O nnile le matshwao sebaka se se kae?",
        st: "U bile le matšoao nako e kae?",
        ts: "U ve na swikombiso nkarhi wo tani hi kwihi?",
        ss: "Usunetimphawu sikhatsi lesingakanani?",
        ve: "No vha na tswayo lwa tshifhinga tshingafhani?",
        nr: "Uneempawu isikhathi esingangani?",
      }),
    durationDescription:
      v({
        nso: "Kgetha nako ye e swanetšego.",
        tn: "Tlhopha nako e e tshwanetseng.",
        st: "Khetha nako e loketseng.",
        ts: "Hlawula nkarhi lowu faneleke.",
        ss: "Khetsa sikhatsi lesifanele.",
        ve: "Nangani tshifhinga tsho teaho.",
        nr: "Khetha isikhathi esifaneleko.",
      }),
    specificDuration:
      v({
        nso: "Tsenya nako",
        tn: "Tsenya nako",
        st: "Kenya nako",
        ts: "Nghenisa nkarhi",
        ss: "Faka sikhatsi",
        ve: "Dzhenisani tshifhinga",
        nr: "Faka isikhathi",
      }),
    duration:
      v({
        nso: "Nako",
        tn: "Nako",
        st: "Nako",
        ts: "Nkarhi",
        ss: "Sikhatsi",
        ve: "Tshifhinga",
        nr: "Isikhathi",
      }),
    enterNumber:
      v({
        nso: "Tsenya nomoro",
        tn: "Tsenya nomoro",
        st: "Kenya nomoro",
        ts: "Nghenisa nomboro",
        ss: "Faka inombolo",
        ve: "Dzhenisani nomboro",
        nr: "Faka inomboro",
      }),
    invalidDuration:
      g.error,
    allergiesTitle:
      v({
        nso: "O na le dialeji?",
        tn: "O na le dialeji?",
        st: "U na le dialeji?",
        ts: "U na swilo leswi nga ku twanisiki?",
        ss: "Unetingcondvongcondvo?",
        ve: "Hu na zwithu zwine zwa ni tshinyadza?",
        nr: "Kukhona izinto ongazwani nazo?",
      }),
    allergiesDescription:
      v({
        nso: "Tshedimošo ya dialeji e thuša PhilaChatBot go efoga dihlare tše di ka bago kotsi.",
        tn: "Tshedimosetso ya dialeji e thusa PhilaChatBot go tila melemo e e ka nnang kotsi.",
        st: "Lintlha tsa dialeji li thusa PhilaChatBot ho qoba meriana e ka bang kotsi.",
        ts: "Vuxokoxoko bya allergy byi pfuna PhilaChatBot ku papalata mirhi leyi nga vaka ni khombo.",
        ss: "Imininingwane yetingcondvongcondvo isita PhilaChatBot kugwema imitsi lengaba yingoti.",
        ve: "Zwidodombedzwa zwa allergy zwi thusa PhilaChatBot u iledza mishonga i nga vha na khombo.",
        nr: "Imininingwana yokungazwani isiza PhilaChatBot ukugwema imithi engaba yingozi.",
      }),
    addAllergy:
      "+",
    allergyPlaceholder:
      v({
        nso: "Aleji",
        tn: "Aleji",
        st: "Aleji",
        ts: "Allergy",
        ss: "Ingcondvongcondvo",
        ve: "Allergy",
        nr: "Ukungazwani",
      }),
    addAllergyAria:
      "+",
    selectedAllergies:
      v({
        nso: "Dialeji tše di kgethilwego",
        tn: "Dialeji tse di tlhophilweng",
        st: "Dialeji tse khethiloeng",
        ts: "Allergy leti hlawuriweke",
        ss: "Tingcondvongcondvo letikhetsiwe",
        ve: "Allergy dzo nangwaho",
        nr: "Izinto ezikhethiweko",
      }),
    removeAllergy:
      "{{item}}",
    noAllergiesNote:
      v({
        nso: "Ge o se na dialeji o ka tšwela pele.",
        tn: "Fa o se na dialeji o ka tswelela.",
        st: "Ha u se na dialeji u ka tsoela pele.",
        ts: "Loko u nga ri na allergy u nga ya emhlweni.",
        ss: "Nangabe awunatingcondvongcondvo ungachubeka.",
        ve: "Arali ni si na allergy ni nga bvela phanḓa.",
        nr: "Nangabe awunazinto ongazwani nazo ungagela phambili.",
      }),
    medicationsTitle:
      v({
        nso: "O nwa dihlare?",
        tn: "O dirisa melemo?",
        st: "U sebelisa meriana?",
        ts: "U tirhisa mirhi?",
        ss: "Usebentisa imitsi?",
        ve: "Ni khou shumisa mishonga?",
        nr: "Usebenzisa imithi?",
      }),
    medicationsDescription:
      "PhilaLink",
    yourMedications:
      "PhilaLink",
    loadingMedications:
      g.loading,
    noProfileMedications:
      g.unavailable,
    medicationLoadError:
      g.error,
    selected:
      v({
        nso: "Kgethilwe",
        tn: "Tlhophilwe",
        st: "Khethiloe",
        ts: "Hlawuriwile",
        ss: "Kukhetsiwe",
        ve: "Nangwaho",
        nr: "Kukhethiwe",
      }),
    addMedication:
      "+",
    medicationPlaceholder:
      v({
        nso: "Leina la sehlare",
        tn: "Leina la molemo",
        st: "Lebitso la moriana",
        ts: "Vito ra murhi",
        ss: "Ligama lemutsi",
        ve: "Dzina ḽa mushonga",
        nr: "Ibizo lomuthi",
      }),
    addMedicationAria:
      "+",
    selectedMedications:
      v({
        nso: "Dihlare tše di kgethilwego",
        tn: "Melemo e e tlhophilweng",
        st: "Meriana e khethiloeng",
        ts: "Mirhi leyi hlawuriweke",
        ss: "Imitsi lekhetsiwe",
        ve: "Mishonga yo nangwaho",
        nr: "Imithi ekhethiweko",
      }),
    removeMedication:
      "{{item}}",
    noMedicationNote:
      v({
        nso: "Ge o sa nwe dihlare, tšwela pele.",
        tn: "Fa o sa dirise melemo, tswelela.",
        st: "Ha u sa sebelise meriana, tsoela pele.",
        ts: "Loko u nga tirhisi mirhi, yana emhlweni.",
        ss: "Nangabe awusebentisi imitsi, chubeka.",
        ve: "Arali ni sa shumisi mishonga, bvelani phanḓa.",
        nr: "Nangabe awusebenzisi imithi, ragela phambili.",
      }),
    conditionsTitle:
      v({
        nso: "O na le maemo a maphelo?",
        tn: "O na le maemo a boitekanelo?",
        st: "U na le maemo a bophelo?",
        ts: "U na swiyimo swa rihanyo?",
        ss: "Unetimo temphilo?",
        ve: "Ni na maemo a mutakalo?",
        nr: "Unebujamo bepilo?",
      }),
    conditionsDescription:
      v({
        nso: "Kgato ye ga e gapeletšege.",
        tn: "Kgato eno ga e pateletsege.",
        st: "Mohato ona ha o tlamehe.",
        ts: "Goza leri a ri bohi.",
        ss: "Lesinyatselo asiphoceleleki.",
        ve: "Tshiṱepu itshi a tshi kombetshedzi.",
        nr: "Isinyathelo lesi asikaphoqelekile.",
      }),
    addCondition:
      "+",
    conditionPlaceholder:
      v({
        nso: "Boemo",
        tn: "Maemo",
        st: "Boemo",
        ts: "Xiyimo",
        ss: "Simo",
        ve: "Tshiimo",
        nr: "Ubujamo",
      }),
    addConditionAria:
      "+",
    selectedConditions:
      v({
        nso: "Maemo a kgethilwego",
        tn: "Maemo a a tlhophilweng",
        st: "Maemo a khethiloeng",
        ts: "Swiyimo leswi hlawuriweke",
        ss: "Timo letikhetsiwe",
        ve: "Maemo o nangwaho",
        nr: "Ubujamo obukhethiweko",
      }),
    removeCondition:
      "{{item}}",
    reviewBadge:
      v({
        nso: "Lekola",
        tn: "Sekaseka",
        st: "Hlahloba",
        ts: "Kambela",
        ss: "Buyeketa",
        ve: "Sedzulusa",
        nr: "Buyekeza",
      }),
    reviewTitle:
      v({
        nso: "Lekola tshedimošo ya gago",
        tn: "Sekaseka tshedimosetso ya gago",
        st: "Hlahloba lintlha tsa hau",
        ts: "Kambela vuxokoxoko bya wena",
        ss: "Buyeketa imininingwane yakho",
        ve: "Sedzulusani zwidodombedzwa zwaṋu",
        nr: "Buyekeza imininingwana yakho",
      }),
    reviewDescription:
      v({
        nso: "Netefatša gore tšohle di nepagetše.",
        tn: "Netefatsa gore tsotlhe di nepagetse.",
        st: "Netefatsa hore tsohle li nepahetse.",
        ts: "Tiyisisa leswaku swilo hinkwako swi lulamile.",
        ss: "Cinisekisa kutsi konkhe kulungile.",
        ve: "Khwaṱhisedzani uri zwoṱhe zwo luga.",
        nr: "Qinisekisa ukuthi koke kulungile.",
      }),
    notSpecified:
      g.unavailable,
    notProvided:
      g.unavailable,
    noneSelected:
      g.unavailable,
    noKnownAllergies:
      g.unavailable,
    currentMedications:
      v({
        nso: "Dihlare tša bjale",
        tn: "Melemo ya jaanong",
        st: "Meriana ea hajoale",
        ts: "Mirhi ya sweswi",
        ss: "Imitsi yanyalo",
        ve: "Mishonga ya zwino",
        nr: "Imithi yanje",
      }),
    medicalConditions:
      v({
        nso: "Maemo a maphelo",
        tn: "Maemo a boitekanelo",
        st: "Maemo a bophelo",
        ts: "Swiyimo swa rihanyo",
        ss: "Timo temphilo",
        ve: "Maemo a mutakalo",
        nr: "Ubujamo bepilo",
      }),
    edit:
      "{{item}}",
    reviewSafety:
      "PhilaChatBot",
    analyzeSymptoms:
      v({
        nso: "Hlahloba maswao",
        tn: "Sekaseka matshwao",
        st: "Hlahloba matšoao",
        ts: "Kambela swikombiso",
        ss: "Hlola timphawu",
        ve: "Ṱolani tswayo",
        nr: "Hlola iimpawu",
      }),
    loadingTitle:
      g.loading,
    loadingDescription:
      g.loading,
    loadingDisclaimer:
      v({
        nso: "Tlhahlobo ye ga se tlhathollo ya bolwetši.",
        tn: "Tlhatlhobo eno ga se tlhomamiso ya bolwetse.",
        st: "Tlhahlobo ena ha se tlhahlobo ea lefu.",
        ts: "Xikambelo lexi a hi ku tiyisisa vuvabyi.",
        ss: "Lokuhlolwa akusiko kucinisekisa sifo.",
        ve: "U ṱoliwa uhu a si u wana vhulwadze.",
        nr: "Ukuhlolwa lokhu akusikho ukuqinisekisa ubulwelwe.",
      }),
    stageSending:
      g.loading,
    stageWarningSigns:
      g.loading,
    stageRecording:
      g.loading,
    stageResult:
      g.loading,
    emergency:
      v({
        nso: "Tšhoganetšo",
        tn: "Tshoganyetso",
        st: "Tšohanyetso",
        ts: "Xihatla",
        ss: "Simo lesiphutfumako",
        ve: "Tshiimo tsha shishi",
        nr: "Isimo esiphuthumako",
      }),
    urgent:
      v({
        nso: "Go potlakile",
        tn: "Go potlakile",
        st: "Ho potlakile",
        ts: "Swi hatlisa",
        ss: "Kuyaphutfuma",
        ve: "Zwi a ṱavhanya",
        nr: "Kuyaphuthuma",
      }),
    nonEmergency:
      v({
        nso: "Ga se tšhoganetšo",
        tn: "Ga se tshoganyetso",
        st: "Ha se tšohanyetso",
        ts: "A hi xihatla",
        ss: "Akusiko kuphutfuma",
        ve: "A si shishi",
        nr: "Akusiso isimo esiphuthumako",
      }),
    assessmentComplete:
      v({
        nso: "Tlhahlobo e fedile",
        tn: "Tlhatlhobo e fedile",
        st: "Tlhahlobo e phethiloe",
        ts: "Xikambelo xi herile",
        ss: "Kuhlolwa kuphelele",
        ve: "U ṱoliwa ho fhela",
        nr: "Ukuhlolwa kuqediwe",
      }),
    emergencyTitle:
      v({
        nso: "Nyaka thušo ya tšhoganetšo bjale",
        tn: "Batla thuso ya tshoganyetso jaanong",
        st: "Batla thuso ea tšohanyetso hona joale",
        ts: "Lava mpfuno wa xihatla sweswi",
        ss: "Funa lusito loluphutfumako nyalo",
        ve: "Ṱoḓani thuso ya shishi zwino",
        nr: "Funa isizo eliphuthumako nje",
      }),
    emergencyDescription:
      v({
        nso: "Maswao a mangwe a ka ba kotsi.",
        tn: "Matshwao mangwe a ka nna kotsi.",
        st: "Matšoao a mang a ka ba kotsi.",
        ts: "Swikombiso swin'wana swi nga va ni khombo.",
        ss: "Letinye timphawu tingaba yingoti.",
        ve: "Dziṅwe tswayo dzi nga vha na khombo.",
        nr: "Ezinye iimpawu zingaba yingozi.",
      }),
    emergencyRecommendation:
      v({
        nso: "Keletšo ya tšhoganetšo",
        tn: "Kaelo ya tshoganyetso",
        st: "Keletso ea tšohanyetso",
        ts: "Xitsundzuxo xa xihatla",
        ss: "Sicondziso lesiphutfumako",
        ve: "Nyeletshedzo ya shishi",
        nr: "Isinqophiso esiphuthumako",
      }),
    defaultEmergencyRecommendation:
      buildCompactServerText(
        code
      ).emergencyAssessment,
    warningSigns:
      v({
        nso: "Maswao a kotsi a ka akaretša:",
        tn: "Matshwao a kotsi a ka akaretsa:",
        st: "Matšoao a kotsi a ka kenyelletsa:",
        ts: "Swikombiso swa khombo swi nga katsa:",
        ss: "Timphawu letiyingozi tingafaka:",
        ve: "Tswayo dza khombo dzi nga katela:",
        nr: "Iimpawu eziyingozi zingafaka:",
      }),
    warningChestPain:
      buildCompactDynamic(
        code
      ).symptoms
        .chestPain,
    warningBreathing:
      buildCompactDynamic(
        code
      ).symptoms
        .shortnessOfBreath,
    warningConsciousness:
      v({
        nso: "Go idibala",
        tn: "Go idibala",
        st: "Ho akheha",
        ts: "Ku titivala",
        ss: "Kulahlekelwa yingcondvo",
        ve: "U xelelwa nga mihumbulo",
        nr: "Ukulahlekelwa mumqondo",
      }),
    warningSeizure:
      v({
        nso: "Go wa",
        tn: "Go tshwarwa ke mototwane",
        st: "Sethoathoa",
        ts: "Ku khomiwa hi vuvabyi",
        ss: "Kuquleka",
        ve: "U wa",
        nr: "Ukuquleka",
      }),
    warningBleeding:
      v({
        nso: "Go tšwa madi kudu",
        tn: "Go tswa madi thata",
        st: "Ho tsoa mali haholo",
        ts: "Ku huma ngati ngopfu",
        ss: "Kopha kakhulu",
        ve: "U bva malofha manzhi",
        nr: "Ukopha khulu",
      }),
    warningStroke:
      "Stroke",
    warningAllergy:
      "Allergy",
    callEmergency:
      v({
        nso: "Letša ditirelo tša tšhoganetšo",
        tn: "Letsa ditirelo tsa tshoganyetso",
        st: "Letsetsa litšebeletso tsa tšohanyetso",
        ts: "Fonela vukorhokeri bya xihatla",
        ss: "Shayela tinsita letiphutfumako",
        ve: "Ridzani tshumelo ya shishi",
        nr: "Biza isizo eliphuthumako",
      }),
    viewAssessment:
      v({
        nso: "Bona dintlha tša tlhahlobo",
        tn: "Bona dintlha tsa tlhatlhobo",
        st: "Sheba lintlha tsa tlhahlobo",
        ts: "Vona vuxokoxoko bya xikambelo",
        ss: "Buka imininingwane yekuhlolwa",
        ve: "Vhonani zwidodombedzwa zwa u ṱoliwa",
        nr: "Bona imininingwana yokuhlolwa",
      }),
    anotherAssessment:
      v({
        nso: "Thoma tlhahlobo ye nngwe",
        tn: "Simolola tlhatlhobo e nngwe",
        st: "Qala tlhahlobo e nngwe",
        ts: "Sungula xikambelo xin'wana",
        ss: "Cala lokunye kuhlolwa",
        ve: "Thomani uṅwe mulingo",
        nr: "Thoma okunye ukuhlolwa",
      }),
    emergencyFooter:
      buildCompactServerText(
        code
      ).emergencyAssessment,
    healthAssessment:
      v({
        nso: "Tlhahlobo ya maphelo",
        tn: "Tlhatlhobo ya boitekanelo",
        st: "Tlhahlobo ea bophelo",
        ts: "Xikambelo xa rihanyo",
        ss: "Kuhlolwa kwemphilo",
        ve: "U ṱoliwa ha mutakalo",
        nr: "Ukuhlolwa kwepilo",
      }),
    healthAssessmentDescription:
      "PhilaLink",
    triageResult:
      v({
        nso: "Sephetho",
        tn: "Phetho",
        st: "Sephetho",
        ts: "Vuyelo",
        ss: "Umphumela",
        ve: "Mvelelo",
        nr: "Umphumela",
      }),
    recommendation:
      v({
        nso: "Keletšo",
        tn: "Kaelo",
        st: "Keletso",
        ts: "Xitsundzuxo",
        ss: "Sicondziso",
        ve: "Nyeletshedzo",
        nr: "Isinqophiso",
      }),
    noRecommendation:
      g.unavailable,
    symptomsSubmitted:
      v({
        nso: "Maswao a rometšwego",
        tn: "Matshwao a rometsweng",
        st: "Matšoao a rometsoeng",
        ts: "Swikombiso leswi rhumeriweke",
        ss: "Timphawu letitfunyelwe",
        ve: "Tswayo dzo rumelwaho",
        nr: "Iimpawu ezithunyelweko",
      }),
    recorded:
      "{{date}}",
    emergencyFollow:
      buildCompactServerText(
        code
      ).emergencyAssessment,
    followUp:
      v({
        nso: "Botšiša potšišo ye e latelago",
        tn: "Botsa potso e e latelang",
        st: "Botsa potso e latelang",
        ts: "Vutisa xivutiso lexi landzelaka",
        ss: "Buta umbuto lolandzelako",
        ve: "Vhudzisani mbudziso i tevhelaho",
        nr: "Buza umbuzo olandelako",
      }),
    menu:
      "Menu",
    chat:
      v({
        nso: "Poledišano",
        tn: "Puisano",
        st: "Puisano",
        ts: "Mbulavurisano",
        ss: "Ingcoco",
        ve: "Nyambedzano",
        nr: "Ikulumo",
      }),
    askPlaceholder:
      v({
        nso: "Botšiša Phila...",
        tn: "Botsa Phila...",
        st: "Botsa Phila...",
        ts: "Vutisa Phila...",
        ss: "Buta Phila...",
        ve: "Vhudzisani Phila...",
        nr: "Buza Phila...",
      }),
    sendMessage:
      v({
        nso: "Romela molaetša",
        tn: "Romela molaetsa",
        st: "Romela molaetsa",
        ts: "Rhumela hungu",
        ss: "Tfumela umlayeto",
        ve: "Rumelani mulaedza",
        nr: "Thumela umlayezo",
      }),
    followupDisclaimer:
      "PhilaChatBot",
    quickCause:
      v({
        nso: "Ke eng se se ka bakago se?",
        tn: "Ke eng se se ka bakang seno?",
        st: "Ke eng se ka bakang see?",
        ts: "I yini lexi nga vangaka leswi?",
        ss: "Yini lengabanga loku?",
        ve: "Ndi mini zwine zwa nga zwi vhanga?",
        nr: "Yini engabangela lokhu?",
      }),
    quickMonitor:
      v({
        nso: "Ke lebelele eng?",
        tn: "Ke tlhokomele eng?",
        st: "Ke hlokomele eng?",
        ts: "Ndi fanele ndzi languta yini?",
        ss: "Kufanele ngibuke ini?",
        ve: "Ndi lavhelese mini?",
        nr: "Kufanele ngiqaphele ini?",
      }),
    quickSupply:
      v({
        nso: "Ke šaletšwe ke matšatši a makae a dihlare?",
        tn: "Ke saletswe ke malatsi a le kae a melemo?",
        st: "Ke saletsoe ke matsatsi a makae a meriana?",
        ts: "Ndi saleriwe hi masiku mangani ya mirhi?",
        ss: "Ngisele nemalanga lamangakhi emitsi?",
        ve: "Ndo salelwa nga maḓuvha mangana a mishonga?",
        nr: "Ngisele namalanga amangaki wemithi?",
      }),
    errorNetworkTitle:
      g.error,
    errorNetworkDescription:
      g.error,
    errorUnavailableTitle:
      g.unavailable,
    errorUnavailableDescription:
      g.unavailable,
    errorMissingTitle:
      g.unavailable,
    errorMissingDescription:
      g.unavailable,
    tryAgain:
      g.retry,
    emergencyInstead:
      buildCompactServerText(
        code
      ).emergencyAssessment,
    back:
      v({
        nso: "Morago",
        tn: "Morago",
        st: "Morao",
        ts: "Endzhaku",
        ss: "Emuva",
        ve: "Murahu",
        nr: "Emuva",
      }),
    continue:
      v({
        nso: "Tšwela pele",
        tn: "Tswelela",
        st: "Tsoela pele",
        ts: "Yana emhlweni",
        ss: "Chubeka",
        ve: "Bvelani phanḓa",
        nr: "Ragela phambili",
      }),
    review:
      v({
        nso: "Lekola",
        tn: "Sekaseka",
        st: "Hlahloba",
        ts: "Kambela",
        ss: "Buyeketa",
        ve: "Sedzulusa",
        nr: "Buyekeza",
      }),

    fields: {
      age:
        v({
          nso: "Mengwaga",
          tn: "Dingwaga",
          st: "Lilemo",
          ts: "Malembe",
          ss: "Iminyaka",
          ve: "Miṅwaha",
          nr: "Iminyaka",
        }),
      symptoms:
        v({
          nso: "Maswao",
          tn: "Matshwao",
          st: "Matšoao",
          ts: "Swikombiso",
          ss: "Timphawu",
          ve: "Tswayo",
          nr: "Iimpawu",
        }),
      duration:
        v({
          nso: "Nako",
          tn: "Nako",
          st: "Nako",
          ts: "Nkarhi",
          ss: "Sikhatsi",
          ve: "Tshifhinga",
          nr: "Isikhathi",
        }),
      allergies:
        "Allergies",
      medications:
        v({
          nso: "Dihlare",
          tn: "Melemo",
          st: "Meriana",
          ts: "Mirhi",
          ss: "Imitsi",
          ve: "Mishonga",
          nr: "Imithi",
        }),
      conditions:
        v({
          nso: "Maemo a maphelo",
          tn: "Maemo a boitekanelo",
          st: "Maemo a bophelo",
          ts: "Swiyimo swa rihanyo",
          ss: "Timo temphilo",
          ve: "Maemo a mutakalo",
          nr: "Ubujamo bepilo",
        }),
    },
  };
}

function buildCompactCookies(
  code
) {
  const g =
    otherLanguages[
      code
    ].generic;

  const v = values =>
    choose(
      code,
      values
    );

  return {
    consentAria:
      v({
        ts: "Mpfumelelo wa cookies",
        ss: "Imvume yema-cookie",
        ve: "Thendelo ya cookies",
        nr: "Imvumo yama-cookie",
      }),
    settings:
      v({
        ts: "Swiyimiso swa cookies",
        ss: "Tilungiselelo tema-cookie",
        ve: "Nzudzanyo ya cookies",
        nr: "Amasethingi wama-cookie",
      }),
    closeSettings:
      g.close,
    intro:
      v({
        ts: "U nga hlawula cookies leti PhilaLink yi nga ti tirhisaka. Cookies ta nkoka ta laveka.",
        ss: "Ungakhetsa ema-cookie langaphoceleleki. Ema-cookie labalulekile ayadzingeka.",
        ve: "Ni nga nanga cookies dza u ḓifunela. Cookies dza ndeme dzi a ṱoḓea.",
        nr: "Ungakhetha ama-cookie angakaphoqeleki. Ama-cookie aqakathekileko ayafuneka.",
      }),
    whatTitle:
      v({
        ts: "Cookies i yini?",
        ss: "Ayini ema-cookie?",
        ve: "Cookies ndi mini?",
        nr: "Ayini ama-cookie?",
      }),
    whatBody1:
      v({
        ts: "Cookies i tifayili letitsongo leti browser yi ti hlayisaka.",
        ss: "Ema-cookie ngemafayela lamancane lagcinwa yi-browser.",
        ve: "Cookies ndi faela ṱhukhu dzine browser ya dzi vhulunga.",
        nr: "Ama-cookie mafayela amancani abulungwa yi-browser.",
      }),
    whatBody2:
      "PhilaLink",
    preferencesTitle:
      v({
        ts: "Hi tirhisa cookies tihi?",
        ss: "Sisebentisa maphi ema-cookie?",
        ve: "Ri shumisa cookies dzifhio?",
        nr: "Sisebenzisa maphi ama-cookie?",
      }),
    essentialTitle:
      v({
        ts: "Cookies ta nkoka",
        ss: "Ema-cookie labalulekile",
        ve: "Cookies dza ndeme",
        nr: "Ama-cookie aqakathekileko",
      }),
    essentialBody:
      v({
        ts: "Ti seketela vuhlayiseki ni mintirho ya nkoka.",
        ss: "Asekela kuvikeleka nemisebenti lebalulekile.",
        ve: "Dzi tikedza tsireledzo na mishumo ya ndeme.",
        nr: "Asekela ukuphepha nemisebenzi eqakathekileko.",
      }),
    alwaysOn:
      v({
        ts: "Minkarhi hinkwaro",
        ss: "Ahlala avulekile",
        ve: "Dzi dzula dzo vula",
        nr: "Ahlala avuliwe",
      }),
    preferenceTitle:
      v({
        ts: "Cookies ta leswi u swi tsakelaka",
        ss: "Ema-cookie etinkhetselo",
        ve: "Cookies dza dzinhetho",
        nr: "Ama-cookie wezinto ozikhethako",
      }),
    preferenceBody:
      "PhilaLink",
    whyTitle:
      v({
        ts: "Hikwalahokayini hi tirhisa cookies?",
        ss: "Kungani sisebentisa ema-cookie?",
        ve: "Ndi ngani ri tshi shumisa cookies?",
        nr: "Kubayini sisebenzisa ama-cookie?",
      }),
    whyBody1:
      "PhilaLink",
    whyBody2:
      "PhilaLink",
    changeTitle:
      v({
        ts: "U cinca swiyimiso swa cookies njani?",
        ss: "Utishintja njani tilungiselelo tema-cookie?",
        ve: "Ni shandukisa hani nzudzanyo ya cookies?",
        nr: "Utjhugulula njani amasethingi wama-cookie?",
      }),
    changeBody1:
      v({
        ts: "U nga vuya eka swiyimiso swa cookies nkarhi wun'wana ni wun'wana.",
        ss: "Ungabuyela etilungiselelweni tema-cookie noma nini.",
        ve: "Ni nga humela kha nzudzanyo ya cookies tshifhinga tshiṅwe na tshiṅwe.",
        nr: "Ungabuyela kumasethingi wama-cookie nanyana nini.",
      }),
    changeBody2:
      "Browser",
    thirdPartyTitle:
      v({
        ts: "Van'wana va tirhisa cookies rini?",
        ss: "Labanye basebentisa nini ema-cookie?",
        ve: "Vhaṅwe vha shumisa cookies lini?",
        nr: "Abanye basebenzisa nini ama-cookie?",
      }),
    thirdPartyBody1:
      "Google",
    thirdPartyBody2:
      "Google",
    essentialOnly:
      v({
        ts: "Ta nkoka ntsena",
        ss: "Labalulekile kuphela",
        ve: "Dza ndeme fhedzi",
        nr: "Aqakathekileko kwaphela",
      }),
    saveSettings:
      g.save,
    acceptAll:
      v({
        ts: "Amukela cookies hinkwato",
        ss: "Yemukela onkhe ema-cookie",
        ve: "Ṱanganedzani cookies dzoṱhe",
        nr: "Yamukela woke ama-cookie",
      }),
    banner:
      "PhilaLink",
  };
}

function buildCompactIdentity(
  code
) {
  const g =
    otherLanguages[
      code
    ].generic;

  const v = values =>
    choose(
      code,
      values
    );

  return {
    title:
      v({
        ts: "Vuxokoxoko bya vutitivisi",
        ve: "Zwidodombedzwa zwa vhuṋe",
      }),
    description:
      v({
        ts: "Lulamisa siku ra wena ro velekiwa kumbe ID ya Afrika Dzonga.",
        ve: "Lugisani ḓuvha ḽaṋu ḽa mabebo kana ID ya Afurika Tshipembe.",
      }),
    separateSave:
      v({
        ts: "Ku cinca vutitivisi swi hlayisiwa hi ku hambana.",
        ve: "Tshanduko dza vhuṋe dzi vhulungwa dzo khethekanywa.",
      }),
    currentId: "ID",
    notAvailable:
      g.unavailable,
    correctDob:
      v({
        ts: "Lulamisa siku ro velekiwa",
        ve: "Lugisani ḓuvha ḽa mabebo",
      }),
    dobDescription:
      v({
        ts: "Leswi swi cinca ntsena tinomboro ta thawj 6 ta YYMMDD.",
        ve: "Hezwi zwi shandukisa nomboro dza u thoma dza 6 dza YYMMDD.",
      }),
    updateDob:
      v({
        ts: "Pfuxeta siku ro velekiwa",
        ve: "Mvusulusani ḓuvha ḽa mabebo",
      }),
    updating:
      g.loading,
    correctFullId:
      v({
        ts: "Lulamisa ID hinkwaro",
        ve: "Lugisani ID yoṱhe",
      }),
    fullIdDescription:
      g.unavailable,
    idPlaceholder:
      "ID · 13",
    updateFullId:
      v({
        ts: "Pfuxeta ID",
        ve: "Mvusulusani ID",
      }),
    loginIdentifier:
      "ID",
    selectDob:
      g.unavailable,
    dobUpdated:
      g.save,
    dobUpdateError:
      g.error,
    invalidId:
      g.error,
    idUpdated:
      g.save,
    idUpdateError:
      g.error,
  };
}

function buildCompactNotifications(
  code
) {
  const v = values =>
    choose(
      code,
      values
    );

  return {
    hot:
      v({
        nso: "Keletšo ya leratadima: Go letetšwe phišo. Nwa meetse a lekanego gomme o efoge phišo e feteletšego.",
        tn: "Kgakololo ya bosa: Go solofetswe mogote. Nwa metsi a a lekaneng mme o tile mogote o o feteletseng.",
        st: "Keletso ea leholimo: Ho lebeletsoe mocheso. Noa metsi a lekaneng 'me u qobe mocheso o feteletseng.",
        ts: "Xitsundzuxo xa maxelo: Ku languteriwe ku hisa. Nwa mati yo ringana naswona papalata ku hisa ngopfu.",
        ss: "Sicondziso sesimo selitulu: Kulindzeleke kushisa. Natsa emanti lenele futsi ugweme kushisa kakhulu.",
        ve: "Nyeletshedzo ya mupo: Hu lavhelelwa u fhisa. Nwani maḓi o linganelaho ni iledze u fhisa nga maanḓa.",
        nr: "Isinqophiso sezulu: Kulindeleke ukutjhisa. Sela amanzi aneleko begodu ugweme ukutjhisa khulu.",
      }),
    cold:
      v({
        nso: "Keletšo ya leratadima: Go letetšwe go tonya. Dula o ruthetše.",
        tn: "Kgakololo ya bosa: Go solofetswe serame. Nna o thuthafetse.",
        st: "Keletso ea leholimo: Ho lebeletsoe serame. Lula u futhumetse.",
        ts: "Xitsundzuxo xa maxelo: Ku languteriwe xirhami. Tshama u kufumela.",
        ss: "Sicondziso sesimo selitulu: Kulindzeleke kubandza. Hlala ufudumele.",
        ve: "Nyeletshedzo ya mupo: Hu lavhelelwa phepho. Dzulani no dudela.",
        nr: "Isinqophiso sezulu: Kulindeleke ukubanda. Hlala ufuthumele.",
      }),
    rain:
      v({
        nso: "Keletšo ya leratadima: Go letetšwe pula. Rulaganya nako e oketšegilego ya leeto.",
        tn: "Kgakololo ya bosa: Go solofetswe pula. Rulaganya nako e e oketsegileng ya loeto.",
        st: "Keletso ea leholimo: Ho lebeletsoe pula. Rera nako e eketsehileng ea leeto.",
        ts: "Xitsundzuxo xa maxelo: Ku languteriwe mpfula. Hlela nkarhi wo engetela wa riendzo.",
        ss: "Sicondziso sesimo selitulu: Kulindzeleke imvula. Hlela sikhatsi lesengeziwe sekuhamba.",
        ve: "Nyeletshedzo ya mupo: Hu lavhelelwa mvula. Dzudzanyani tshifhinga tsho engedzeaho tsha lwendo.",
        nr: "Isinqophiso sezulu: Kulindeleke izulu. Hlela isikhathi esengeziweko sokukhamba.",
      }),
    wind:
      v({
        nso: "Keletšo ya leratadima: Go letetšwe phefo e maatla. Hlokomela ge o sepela.",
        tn: "Kgakololo ya bosa: Go solofetswe phefo e e maatla. Tlhokomela fa o tsamaya.",
        st: "Keletso ea leholimo: Ho lebeletsoe moea o matla. Ela hloko ha u tsamaea.",
        ts: "Xitsundzuxo xa maxelo: Ku languteriwe moya wa nguvu. Tivonele loko u famba.",
        ss: "Sicondziso sesimo selitulu: Kulindzeleke umoya lonemandla. Caphela nawuhamba.",
        ve: "Nyeletshedzo ya mupo: Hu lavhelelwa muya muhulu. Ṱhogomelani musi ni tshi tshimbila.",
        nr: "Isinqophiso sezulu: Kulindeleke umoya onamandla. Tjheja nawukhambako.",
      }),
    medicationReminder:
      "{{medication}} · {{time}} · {{date}}",
    appointmentUpdate:
      "{{type}} · {{clinic}} · {{status}} · {{date}}",
    appointmentSoon:
      "{{type}} · {{clinic}} · {{time}}",
    appointmentReminder:
      "{{type}} · {{clinic}} · {{date}}",
  };
}

function buildCompactServerText(
  code
) {
  const v = values =>
    choose(
      code,
      values
    );

  const emergency =
    v({
      nso: "Maswao a gago a ka nyaka thušo ya kalafo ya tšhoganetšo. Nyaka thušo ya tšhoganetšo bjale goba o ye lefelong la tšhoganetšo le le lego kgauswi.",
      tn: "Matshwao a gago a ka tlhoka thuso ya kalafi ya tshoganyetso. Batla thuso ya tshoganyetso jaanong kgotsa o ye kwa lefelong la tshoganyetso le le gaufi.",
      st: "Matšoao a hau a ka hloka thuso ea bongaka ea tšohanyetso. Batla thuso ea tšohanyetso hona joale kapa u ee setsing se haufi sa tšohanyetso.",
      ts: "Swikombiso swa wena swi nga lava mpfuno wa vutshunguri wa xihatla. Lava mpfuno wa xihatla sweswi kumbe u ya eka ndhawu ya xihatla ya le kusuhi.",
      ss: "Timphawu takho tingadzinga lusito lwetekwelapha loluphutfumako. Funa lusito loluphutfumako nyalo noma uye esikhungweni lesisedvute.",
      ve: "Tswayo dzaṋu dzi nga ṱoḓa thuso ya ngalafho ya shishi. Ṱoḓani thuso ya shishi zwino kana ni ye vhuongeloni ha shishi hu re tsini.",
      nr: "Iimpawu zakho zingadinga isizo lezokwelapha eliphuthumako. Funa isizo eliphuthumako nje namkha uye esikhungweni esiseduze.",
    });

  const urgent =
    v({
      nso: "Maswao a a swanetše go lekolwa kapejana ke setsebi sa maphelo.",
      tn: "Matshwao ano a tshwanetse go sekasekwa ka bonako ke modiri wa boitekanelo.",
      st: "Matšoao ana a lokela ho hlahlojoa kapele ke setsebi sa bophelo.",
      ts: "Swikombiso leswi swi fanele ku kamberiwa hi ku hatlisa hi mutirhi wa rihanyo.",
      ss: "Letimphawu kufanele tihlolwe masinyane ngumsebenti wetemphilo.",
      ve: "Tswayo hedzi dzi tea u ṱoliwa nga u ṱavhanya nga mushumi wa mutakalo.",
      nr: "Iimpawu lezi kufanele zihlolwe msinya sisisebenzi sezepilo.",
    });

  return {
    emergencyAssessment:
      emergency,
    urgentAssessment:
      urgent,
    breathingUrgent:
      urgent,
    nonEmergencyAssessment:
      v({
        nso: "Ga go leswao la tšhoganetšo le le lemogilwego. Se ga se tlhathollo ya bolwetši.",
        tn: "Ga go letshwao la tshoganyetso le le lemogilweng. Seno ga se tlhomamiso ya bolwetse.",
        st: "Ha ho letšoao la tšohanyetso le fumanoeng. Sena ha se tlhahlobo ea lefu.",
        ts: "A ku na xikombiso xa xihatla lexi kumekeke. Lexi a hi ku tiyisisa vuvabyi.",
        ss: "Kute luphawu lwesimo lesiphutfumako lolutfolakele. Loku akusiko kucinisekisa sifo.",
        ve: "A hu na tswayo ya shishi yo wanalaho. Hezwi a si u wana vhulwadze.",
        nr: "Akukho phawu lesimo esiphuthumako elitholakeleko. Lokhu akusikho ukuqinisekisa ubulwelwe.",
      }),
    chatbotEmergency:
      emergency,
    chatbotUrgent:
      urgent,
    chatbotUnavailable:
      v({
        nso: "Ga ke kgone go fihlelela mothuši wa maphelo bjale. Leka gape.",
        tn: "Ga ke kgone go fitlhelela mothusi wa boitekanelo jaanong. Leka gape.",
        st: "Ha ke khone ho fihlela mothusi oa bophelo hona joale. Leka hape.",
        ts: "A ndzi koti ku fikelela mupfuni wa rihanyo sweswi. Ringeta nakambe.",
        ss: "Angikhoni kufinyelela umsiti wetemphilo nyalo. Zama futsi.",
        ve: "A thi koni u swikelela muthusi wa mutakalo zwino. Lingedzani hafhu.",
        nr: "Angikwazi ukufikelela kumsizi wezepilo nje. Zama godu.",
      }),
    chatbotNoResponse:
      v({
        nso: "Ga se ka kgona go dira karabo.",
        tn: "Ga ke a kgona go dira karabo.",
        st: "Ha kea khona ho etsa karabo.",
        ts: "A ndzi kotanga ku endla nhlamulo.",
        ss: "Angikakhoni kwenta imphendvulo.",
        ve: "A thi ngo kona u ita phindulo.",
        nr: "Angikghonanga ukwenza ipendulo.",
      }),
  };
}

const built = {
  nso:
    buildSothoTswanaExperience(
      "nso"
    ),

  tn:
    buildSothoTswanaExperience(
      "tn"
    ),

  st:
    buildSothoTswanaExperience(
      "st"
    ),

  ts:
    buildVendaTsongaExperience(
      "ts"
    ),

  ss:
    buildNguniExperience(
      "ss"
    ),

  ve:
    buildVendaTsongaExperience(
      "ve"
    ),

  nr:
    buildNguniExperience(
      "nr"
    ),
};

export const patientCompletenessResources = {
  en: experience.en,
  zu: experience.zu,
  xh: experience.xh,
  af: experience.af,
  ...built,
};

export default patientCompletenessResources;
