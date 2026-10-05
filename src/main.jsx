import React from "react";
import ReactDOM from "react-dom/client";

import {
  BrowserRouter,
} from "react-router-dom";

import App from "./App.jsx";

import {
  AuthProvider,
} from "./context/AuthContext.jsx";

import {
  ToastProvider,
} from "./components/ui/Toast.jsx";

import LanguagePreferenceSync from "./components/patient/LanguagePreferenceSync.jsx";

import CookieConsent from "./components/privacy/CookieConsent.jsx";

import "./i18n/index.js";
import "./index.css";

const THEME_STORAGE_KEY =
  "philalink-theme";

try {
  const savedTheme =
    localStorage.getItem(
      THEME_STORAGE_KEY
    );

  const initialTheme =
    savedTheme === "dark"
      ? "dark"
      : "light";

  document.documentElement.setAttribute(
    "data-theme",
    initialTheme
  );
} catch {
  document.documentElement.setAttribute(
    "data-theme",
    "light"
  );
}

ReactDOM.createRoot(
  document.getElementById(
    "root"
  )
).render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition:
          true,

        v7_relativeSplatPath:
          true,
      }}
    >
      <ToastProvider>
        <AuthProvider>
          <LanguagePreferenceSync>
            <App />
          </LanguagePreferenceSync>

          <CookieConsent />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);