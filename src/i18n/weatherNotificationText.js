import i18n from "./index.js";

import {
  normalizeLanguage,
} from "./languages.js";

/*
 * Weather notification messages are stored by the backend
 * in one canonical English format.
 *
 * We keep that database format unchanged and translate the
 * message when it is displayed.
 *
 * That gives us two important benefits:
 *
 * 1. Existing historical notifications immediately follow
 *    the patient's currently selected language.
 *
 * 2. Changing languages does not require rewriting rows in
 *    the Notifications table.
 */

const WEATHER_COPY = {
  en: {
    title:
      "Weather update",

    current:
      "{{location}} is currently {{temperature}}°C with {{condition}}.",

    forecast:
      "The next forecast period around {{time}} is {{temperature}}°C with {{condition}}.",

    advice: {
      heat:
        "Stay hydrated and avoid prolonged heat exposure where possible.",

      cold:
        "Keep warm and store medication according to its instructions.",

      storm:
        "Stormy conditions are possible; take extra care when travelling and avoid unsafe flooded areas.",

      rain:
        "Rain is possible; allow extra travel time for clinic visits or medication collection.",

      wind:
        "Strong winds are possible; take extra care when travelling outdoors.",

      mild:
        "Conditions are relatively mild; keep hydrated and plan ahead if you need to travel for healthcare.",
    },
  },

  zu: {
    title:
      "Isibuyekezo sesimo sezulu",

    current:
      "{{location}} njengamanje ino-{{temperature}}°C futhi {{condition}}.",

    forecast:
      "Isikhathi esilandelayo sesibikezelo cishe ngo-{{time}} sizoba ngu-{{temperature}}°C futhi {{condition}}.",

    advice: {
      heat:
        "Phuza amanzi anele futhi ugweme ukuhlala isikhathi eside ekushiseni lapho kungenzeka.",

      cold:
        "Zigcine ufudumele futhi ugcine imithi ngendlela eyalelwe ngayo.",

      storm:
        "Kungase kube nezivunguvungu; qaphela kakhulu lapho uhamba futhi ugweme izindawo ezigcwele amanzi ezingaphephile.",

      rain:
        "Kungase kune imvula; hlela isikhathi esengeziwe uma uya emtholampilo noma ukuyolanda imithi.",

      wind:
        "Kungase kube nemimoya enamandla; qaphela kakhulu lapho uhamba ngaphandle.",

      mild:
        "Isimo sezulu sibonakala sithambile; phuza amanzi anele futhi hlela kusenesikhathi uma kufanele uhambe uyothola ukunakekelwa kwezempilo.",
    },
  },

  xh: {
    title:
      "Uhlaziyo lwemozulu",

    current:
      "{{location}} ngoku ino-{{temperature}}°C kwaye {{condition}}.",

    forecast:
      "Ixesha elilandelayo loqikelelo malunga no-{{time}} liya kuba ngu-{{temperature}}°C kwaye {{condition}}.",

    advice: {
      heat:
        "Sela amanzi ngokwaneleyo kwaye uphephe ukuhlala ixesha elide ebushushwini xa kunokwenzeka.",

      cold:
        "Zigcine ushushu kwaye ugcine amayeza ngokwemiyalelo yawo.",

      storm:
        "Kunokwenzeka izaqhwithi; lumka ngakumbi xa uhamba kwaye uphephe iindawo ezikhukulayo ezingakhuselekanga.",

      rain:
        "Imvula inokwenzeka; vumela ixesha elongezelelweyo lokuya ekliniki okanye ukuqokelela amayeza.",

      wind:
        "Imimoya enamandla inokwenzeka; lumka ngakumbi xa uhamba ngaphandle.",

      mild:
        "Imeko yemozulu ithambile; sela amanzi ngokwaneleyo kwaye ucwangcise kwangaphambili xa kufuneka uye kufumana ukhathalelo lwempilo.",
    },
  },

  af: {
    title:
      "Weeropdatering",

    current:
      "{{location}} is tans {{temperature}}°C met {{condition}}.",

    forecast:
      "Die volgende voorspellingsperiode omstreeks {{time}} is {{temperature}}°C met {{condition}}.",

    advice: {
      heat:
        "Bly gehidreer en vermy langdurige blootstelling aan hitte waar moontlik.",

      cold:
        "Bly warm en bêre medikasie volgens die instruksies daarvan.",

      storm:
        "Stormagtige toestande is moontlik; wees ekstra versigtig wanneer jy reis en vermy onveilige oorstroomde gebiede.",

      rain:
        "Reën is moontlik; laat ekstra reistyd toe vir kliniekbesoeke of die afhaal van medikasie.",

      wind:
        "Sterk winde is moontlik; wees ekstra versigtig wanneer jy buite reis.",

      mild:
        "Toestande is betreklik matig; bly gehidreer en beplan vooruit as jy vir gesondheidsorg moet reis.",
    },
  },

  nso: {
    title:
      "Tshedimošo ya maemo a leratadima",

    current:
      "{{location}} ga bjale e na le {{temperature}}°C gomme {{condition}}.",

    forecast:
      "Nako e latelago ya ponelopele mo e ka bago ka {{time}} e tla ba {{temperature}}°C gomme {{condition}}.",

    advice: {
      heat:
        "Nwa meetse a lekanego gomme o pheme go dula phišong nako e telele ge go kgonega.",

      cold:
        "Dula o ruthetše gomme o boloke dihlare go ya ka ditaelo tša tšona.",

      storm:
        "Maemo a ledimo a ka direga; hlokomela kudu ge o sepela gomme o pheme mafelo ao a tletšego meetse ao a sego a bolokega.",

      rain:
        "Pula e ka na; beakanya nako e oketšegilego ya go ya kliniking goba go tšea dihlare.",

      wind:
        "Diphefo tše maatla di ka ba gona; hlokomela kudu ge o sepela ka ntle.",

      mild:
        "Maemo a leratadima a bonolo; nwa meetse a lekanego gomme o rulaganye pele ge o swanetše go sepela go hwetša tlhokomelo ya maphelo.",
    },
  },

  tn: {
    title:
      "Ntlafatso ya maemo a bosa",

    current:
      "{{location}} ga jaana e na le {{temperature}}°C mme {{condition}}.",

    forecast:
      "Paka e e latelang ya ponelopele mo e ka nnang ka {{time}} e tla nna {{temperature}}°C mme {{condition}}.",

    advice: {
      heat:
        "Nwa metsi a a lekaneng mme o tile go nna mo mogoteng lobaka lo loleele fa go kgonega.",

      cold:
        "Ipoloke o thuthafetse mme o boloke melemo go ya ka ditaelo tsa yone.",

      storm:
        "Maemo a setsuatsue a ka nna teng; tlhokomela thata fa o tsamaya mme o tile mafelo a a tletseng metsi a a sa sireletsegang.",

      rain:
        "Pula e ka na; rulaganya nako e e oketsegileng ya go ya kwa tleliniking kgotsa go tsaya melemo.",

      wind:
        "Diphefo tse di maatla di ka nna teng; tlhokomela thata fa o tsamaya kwa ntle.",

      mild:
        "Maemo a bosa a bonolo; nwa metsi a a lekaneng mme rulaganya pele fa o tshwanetse go tsamaya go bona tlhokomelo ya botsogo.",
    },
  },

  st: {
    title:
      "Ntlafatso ea boemo ba leholimo",

    current:
      "{{location}} hona joale e na le {{temperature}}°C 'me {{condition}}.",

    forecast:
      "Nako e latelang ea ponelopele hoo e ka bang ka {{time}} e tla ba {{temperature}}°C 'me {{condition}}.",

    advice: {
      heat:
        "Noa metsi a lekaneng 'me u qobe ho lula mochesong nako e telele ha ho khoneha.",

      cold:
        "Ipoloke u futhumetse 'me u boloke meriana ho latela litaelo tsa eona.",

      storm:
        "Ho ka ba le lifefo; ela hloko haholo ha u tsamaea 'me u qobe libaka tse tletseng metsi tse sa sireletsehang.",

      rain:
        "Pula e ka na; lumella nako e eketsehileng ea ho ea tleliniking kapa ho lata meriana.",

      wind:
        "Meea e matla e ka ba teng; ela hloko haholo ha u tsamaea ka ntle.",

      mild:
        "Boemo ba leholimo bo bonolo; noa metsi a lekaneng 'me u rere esale pele haeba u tlameha ho tsamaea ho fumana tlhokomelo ea bophelo.",
    },
  },

  ts: {
    title:
      "Ntlhantlho wa maxelo ya le henhla",

    current:
      "{{location}} sweswi yi na {{temperature}}°C naswona {{condition}}.",

    forecast:
      "Nkarhi lowu landzelaka wa vuprofeta kwalomu ka {{time}} wu ta va {{temperature}}°C naswona {{condition}}.",

    advice: {
      heat:
        "Nwa mati yo ringana naswona u papalata ku va eka ku hisa nkarhi wo leha loko swi koteka.",

      cold:
        "Tshama u kufumela naswona u hlayisa mirhi hi ku landza swiletelo swa yona.",

      storm:
        "Swidzedze swi nga va kona; tivonele swinene loko u famba naswona u papalata tindhawu leti nga hlayisekangiki leti teleke mati.",

      rain:
        "Mpfula yi nga na; tinyike nkarhi wo engetela ku ya etliniki kumbe ku ya teka mirhi.",

      wind:
        "Mimoya ya Matimba yi nga va kona; tivonele swinene loko u famba ehandle.",

      mild:
        "Maxelo ya le henhla ya olova; nwa mati yo ringana naswona u kunguhata ka ha ri na nkarhi loko u fanele ku famba ku ya kuma nhlayiso wa rihanyo.",
    },
  },

  ss: {
    title:
      "Sibuyeketo sesimo selitulu",

    current:
      "{{location}} nyalo ino-{{temperature}}°C futsi {{condition}}.",

    forecast:
      "Sikhatsi lesilandzelako sesibikezelo cishe nga-{{time}} sitawuba ngu-{{temperature}}°C futsi {{condition}}.",

    advice: {
      heat:
        "Natsa emanti lenele futsi ugweme kuhlala ekushiseni sikhatsi lesidze lapho kungenteka khona.",

      cold:
        "Tigcine ufutfumele futsi ugcine imitsi ngekulandzela ticondziso tayo.",

      storm:
        "Kungaba netiphepho; caphela kakhulu nawuhamba futsi ugweme tindzawo letigcwele emanti letingakaphephi.",

      rain:
        "Imvula ingana; hlela sikhatsi lesengetiwe sekuya emtfolampilo noma kuyolanda imitsi.",

      wind:
        "Kungaba nemimoya lenemandla; caphela kakhulu nawuhamba ngaphandle.",

      mild:
        "Simo selitulu siphansi; natsa emanti lenele futsi uhlele kusenesikhatsi uma kufanele uhambe kuyotfola kunakekelwa kwemphilo.",
    },
  },

  ve: {
    title:
      "Mvusuludzo wa mutsho wa mupo",

    current:
      "{{location}} zwino hu na {{temperature}}°C nahone {{condition}}.",

    forecast:
      "Tshifhinga tshi tevhelaho tsha khumbelo ya mutsho nga {{time}} hu ḓo vha {{temperature}}°C nahone {{condition}}.",

    advice: {
      heat:
        "Nwani maḓi o linganaho nahone ni iledze u vha kha mufhiso tshifhinga tshilapfu arali zwi tshi konadzea.",

      cold:
        "Dzulani no dudela nahone ni vhulunge mishonga u ya nga ndaela dzayo.",

      storm:
        "Mabebo mahulu a nga vha hone; ṱhogomelani musi ni tshi tshimbila nahone ni iledze fhethu ho ḓalaho maḓi hune ha sa tsireledzea.",

      rain:
        "Mvula i nga na; dzudzanyani tshifhinga tsho engedzeaho tsha u ya kiḽiniki kana u dzhia mishonga.",

      wind:
        "Mimuya ya maanḓa i nga vha hone; ṱhogomelani musi ni tshi tshimbila nnḓa.",

      mild:
        "Mutsho wo luga; nwani maḓi o linganaho nahone ni dzudzanye hu tshee na tshifhinga arali ni tshi tea u tshimbila u wana ndaulo ya mutakalo.",
    },
  },

  nr: {
    title:
      "Ukubuyekezwa kobujamo bezulu",

    current:
      "{{location}} nje ino-{{temperature}}°C begodu {{condition}}.",

    forecast:
      "Isikhathi esilandelako sesibikezelo pheze ngo-{{time}} sizokuba ngu-{{temperature}}°C begodu {{condition}}.",

    advice: {
      heat:
        "Sela amanzi aneleko begodu ubalekele ukuhlala ekutjhiseni isikhathi eside nakukghonekako.",

      cold:
        "Zigcine ufuthumele begodu ugcine imithi ngokuya ngeenqophiso zayo.",

      storm:
        "Kungaba neziphepho; tjheja khulu nawukhambako begodu ubalekele iindawo ezizele amanzi ezingakavikeleki.",

      rain:
        "Izulu lingana; hlela isikhathi esingeziweko sokuya eklinigi namkha ukuyokuthatha imithi.",

      wind:
        "Kungaba nemimoya enamandla; tjheja khulu nawukhamba ngaphandle.",

      mild:
        "Ubujamo bezulu buphakathi; sela amanzi aneleko begodu uhlele kusenesikhathi nawufanele ukhamba ukuyokufumana ukunakekelwa kwepilo.",
    },
  },
};

function interpolate(
  template,
  values
) {
  return String(
    template ?? ""
  ).replace(
    /\{\{(\w+)\}\}/g,
    (
      _,
      key
    ) =>
      values[
        key
      ] ??
      ""
  );
}

function currentLanguage() {
  return normalizeLanguage(
    i18n.resolvedLanguage ||
      i18n.language
  );
}

function copy() {
  return (
    WEATHER_COPY[
      currentLanguage()
    ] ||
    WEATHER_COPY.en
  );
}

function weatherKind(
  description
) {
  const value =
    String(
      description ?? ""
    )
      .trim()
      .toLowerCase();

  if (
    value.includes(
      "thunder"
    ) ||
    value.includes(
      "storm"
    )
  ) {
    return "thunder";
  }

  if (
    value.includes(
      "rain"
    ) ||
    value.includes(
      "drizzle"
    ) ||
    value.includes(
      "shower"
    )
  ) {
    return "rain";
  }

  if (
    value.includes(
      "snow"
    ) ||
    value.includes(
      "sleet"
    )
  ) {
    return "snow";
  }

  if (
    value.includes(
      "mist"
    ) ||
    value.includes(
      "fog"
    ) ||
    value.includes(
      "haze"
    ) ||
    value.includes(
      "smoke"
    )
  ) {
    return "fog";
  }

  if (
    value.includes(
      "clear"
    )
  ) {
    return "clear";
  }

  if (
    value.includes(
      "overcast"
    )
  ) {
    return "overcast";
  }

  if (
    value.includes(
      "few cloud"
    ) ||
    value.includes(
      "scattered cloud"
    )
  ) {
    return "partlyCloudy";
  }

  if (
    value.includes(
      "broken cloud"
    ) ||
    value.includes(
      "cloud"
    )
  ) {
    return "cloudy";
  }

  return "cloudy";
}

function translateCondition(
  description
) {
  const key =
    weatherKind(
      description
    );

  const translated =
    i18n.t(
      `weather.condition.${key}`
    );

  return translated ||
    description;
}

function adviceKind(
  advice
) {
  const value =
    String(
      advice ?? ""
    )
      .trim()
      .toLowerCase();

  if (
    value.startsWith(
      "stay hydrated and avoid prolonged heat exposure"
    )
  ) {
    return "heat";
  }

  if (
    value.startsWith(
      "keep warm and store medication"
    )
  ) {
    return "cold";
  }

  if (
    value.startsWith(
      "stormy conditions are possible"
    )
  ) {
    return "storm";
  }

  if (
    value.startsWith(
      "rain is possible"
    )
  ) {
    return "rain";
  }

  if (
    value.startsWith(
      "strong winds are possible"
    )
  ) {
    return "wind";
  }

  if (
    value.startsWith(
      "conditions are relatively mild"
    )
  ) {
    return "mild";
  }

  return null;
}

function translateAdvice(
  advice
) {
  const kind =
    adviceKind(
      advice
    );

  if (!kind) {
    return advice;
  }

  return (
    copy()
      .advice[
        kind
      ] ||
    advice
  );
}

/*
 * Backend format with forecast:
 *
 * Weather update: Gqeberha is currently 19°C with Broken clouds.
 * The next forecast period around 23:00 is 19°C with Broken clouds.
 * Conditions are relatively mild; ...
 */
const WEATHER_WITH_FORECAST =
  /^Weather update:\s*(.+?)\s+is currently\s+(-?\d+(?:\.\d+)?)°C\s+with\s+(.+?)\.\s+The next forecast period around\s+(\d{1,2}:\d{2})\s+is\s+(-?\d+(?:\.\d+)?)°C\s+with\s+(.+?)\.\s+(.+)$/i;

/*
 * Backend fallback when no future forecast is available:
 *
 * Weather update: Gqeberha is currently 19°C with Broken clouds.
 * Conditions are relatively mild; ...
 */
const WEATHER_CURRENT_ONLY =
  /^Weather update:\s*(.+?)\s+is currently\s+(-?\d+(?:\.\d+)?)°C\s+with\s+(.+?)\.\s+(.+)$/i;

export function translateWeatherUpdateMessage(
  message
) {
  const text =
    String(
      message ?? ""
    ).trim();

  if (
    !text
      .toLowerCase()
      .startsWith(
        "weather update:"
      )
  ) {
    return text;
  }

  const languageCopy =
    copy();

  let match =
    text.match(
      WEATHER_WITH_FORECAST
    );

  if (match) {
    const [
      ,
      location,
      currentTemperature,
      currentDescription,
      forecastTime,
      forecastTemperature,
      forecastDescription,
      advice,
    ] =
      match;

    const currentText =
      interpolate(
        languageCopy.current,
        {
          location:
            location.trim(),

          temperature:
            currentTemperature,

          condition:
            translateCondition(
              currentDescription
            ),
        }
      );

    const forecastText =
      interpolate(
        languageCopy.forecast,
        {
          time:
            forecastTime,

          temperature:
            forecastTemperature,

          condition:
            translateCondition(
              forecastDescription
            ),
        }
      );

    return [
      `${languageCopy.title}:`,
      currentText,
      forecastText,
      translateAdvice(
        advice
      ),
    ]
      .filter(
        Boolean
      )
      .join(
        " "
      );
  }

  match =
    text.match(
      WEATHER_CURRENT_ONLY
    );

  if (match) {
    const [
      ,
      location,
      currentTemperature,
      currentDescription,
      advice,
    ] =
      match;

    const currentText =
      interpolate(
        languageCopy.current,
        {
          location:
            location.trim(),

          temperature:
            currentTemperature,

          condition:
            translateCondition(
              currentDescription
            ),
        }
      );

    return [
      `${languageCopy.title}:`,
      currentText,
      translateAdvice(
        advice
      ),
    ]
      .filter(
        Boolean
      )
      .join(
        " "
      );
  }

  /*
   * Unknown/new backend format:
   * preserve it rather than accidentally corrupting the message.
   */
  return text;
}
