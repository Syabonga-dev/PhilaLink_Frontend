import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  useAuth,
} from "./context/AuthContext.jsx";

import {
  ProtectedRoute,
  RoleRoute,
  PasswordChangeRoute,
  homePathForRole,
} from "./routes/ProtectedRoute.jsx";

import LegalProtectedRoute from "./components/auth/LegalProtectedRoute.jsx";

import AuthenticatedLayout from "./components/layout/AuthenticatedLayout.jsx";

import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage.jsx";
import GoogleCallbackPage from "./pages/auth/GoogleCallbackPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import PhoneVerificationPage from "./pages/auth/PhoneVerificationPage.jsx";
import RegistrationClinicPage from "./pages/auth/RegistrationClinicPage.jsx";
import RegistrationSuccessPage from "./pages/auth/RegistrationSuccessPage.jsx";
import ChangePasswordPage from "./pages/auth/ChangePasswordPage.jsx";
import NotFound from "./pages/NotFound.jsx";

import {
  LegalAcceptancePage,
  PrivacyPolicyPage,
  TermsOfUsePage,
} from "./pages/legal/LegalPages.jsx";

import PatientAppLayout from "./components/patient/AppLayout.jsx";
import ThemePreferenceSync from "./components/patient/ThemePreferenceSync.jsx";

import PatientDashboardPage from "./pages/patient/DashboardPage.jsx";
import PatientMedicationsPage from "./pages/patient/MedicationsPage.jsx";
import PatientAppointmentsPage from "./pages/patient/AppointmentsPage.jsx";
import PatientRecordsPage from "./pages/patient/RecordsPage.jsx";
import PatientNearestClinicsPage from "./pages/patient/NearestClinicsPage.jsx";
import PatientSettingsPage from "./pages/patient/SettingsPage.jsx";

import NurseDashboard from "./pages/nurse/NurseDashboard.jsx";
import NursePatientsPage from "./pages/nurse/NursePatientsPage.jsx";
import CollectionsPage from "./pages/nurse/CollectionsPage.jsx";

import ProxyAppLayout from "./components/proxy/ProxyAppLayout.jsx";
import ProxyDashboard from "./pages/proxy/ProxyDashboard.jsx";
import ProxyPatientsPage from "./pages/proxy/ProxyPatientsPage.jsx";
import ProxyCollectionsPage from "./pages/proxy/ProxyCollectionsPage.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import RegisterStaffPage from "./pages/admin/RegisterStaffPage.jsx";
import ManageStaffPage from "./pages/admin/ManageStaffPage.jsx";
import AdminAuditLogPage from "./pages/admin/AdminAuditLogPage.jsx";
import ManageClinicsPage from "./pages/admin/ManageClinicsPage.jsx";
import RegisterClinicAdminPage from "./pages/admin/RegisterClinicAdminPage.jsx";

// =====================================================
// REDIRECT AUTHENTICATED USERS
// =====================================================

function RedirectIfAuthenticated({
  children,
}) {
  const {
    isAuthenticated,
    role,
    isLoading,
    mustChangePassword,
  } = useAuth();

  if (
    isLoading
  ) {
    return children;
  }

  if (
    isAuthenticated
  ) {
    return (
      <Navigate
        to={
          mustChangePassword
            ? "/change-password"
            : homePathForRole(
                role
              )
        }
        replace
      />
    );
  }

  return children;
}

// =====================================================
// PATIENT LAYOUT + THEME
// =====================================================

function PatientLayoutWithTheme() {
  return (
    <ThemePreferenceSync>
      <PatientAppLayout />
    </ThemePreferenceSync>
  );
}

// =====================================================
// APP
// =====================================================

export default function App() {
  return (
    <Routes>

      {/* ================================================= */}
      {/* PUBLIC */}
      {/* ================================================= */}

      <Route
        path="/"
        element={
          <RedirectIfAuthenticated>
            <LandingPage />
          </RedirectIfAuthenticated>
        }
      />

      <Route
        path="/login"
        element={
          <RedirectIfAuthenticated>
            <LoginPage />
          </RedirectIfAuthenticated>
        }
      />

      <Route
        path="/forgot-password"
        element={
          <RedirectIfAuthenticated>
            <ForgotPasswordPage />
          </RedirectIfAuthenticated>
        }
      />

      <Route
        path="/auth/google/callback"
        element={
          <GoogleCallbackPage />
        }
      />

      <Route
        path="/register"
        element={
          <RegisterPage />
        }
      />

      <Route
        path="/register/verify"
        element={
          <PhoneVerificationPage />
        }
      />

      <Route
        path="/register/clinic"
        element={
          <RegistrationClinicPage />
        }
      />

      <Route
        path="/register/success"
        element={
          <RegistrationSuccessPage />
        }
      />

      {/* ================================================= */}
      {/* PUBLIC LEGAL DOCUMENTS */}
      {/* ================================================= */}

      <Route
        path="/privacy-policy"
        element={
          <PrivacyPolicyPage />
        }
      />

      <Route
        path="/terms-of-use"
        element={
          <TermsOfUsePage />
        }
      />

      {/* ================================================= */}
      {/* AUTHENTICATED */}
      {/* ================================================= */}

      <Route
        element={
          <ProtectedRoute />
        }
      >

        {/* =============================================== */}
        {/* REQUIRED PASSWORD CHANGE */}
        {/* =============================================== */}

        <Route
          element={
            <PasswordChangeRoute />
          }
        >
          <Route
            path="/change-password"
            element={
              <ChangePasswordPage />
            }
          />
        </Route>

        {/* =============================================== */}
        {/* REQUIRED LEGAL ACCEPTANCE */}
        {/* =============================================== */}

        {/*
         * Important:
         *
         * /legal-acceptance must be authenticated,
         * but must NOT be inside LegalProtectedRoute.
         *
         * Otherwise the legal guard would redirect
         * back to itself forever.
         */}
        <Route
          path="/legal-acceptance"
          element={
            <LegalAcceptancePage />
          }
        />

        {/* =============================================== */}
        {/* LEGAL-COMPLIANT APPLICATION */}
        {/* =============================================== */}

        <Route
          element={
            <LegalProtectedRoute />
          }
        >

          {/* ============================================= */}
          {/* PATIENT */}
          {/* ============================================= */}

          <Route
            element={
              <RoleRoute
                allow={[
                  "Patient",
                ]}
              />
            }
          >
            <Route
              path="/patient"
              element={
                <PatientLayoutWithTheme />
              }
            >
              <Route
                index
                element={
                  <PatientDashboardPage />
                }
              />

              <Route
                path="medications"
                element={
                  <PatientMedicationsPage />
                }
              />

              <Route
                path="appointments"
                element={
                  <PatientAppointmentsPage />
                }
              />

              <Route
                path="records"
                element={
                  <PatientRecordsPage />
                }
              />

              <Route
                path="clinics"
                element={
                  <PatientNearestClinicsPage />
                }
              />

              <Route
                path="settings"
                element={
                  <PatientSettingsPage />
                }
              />
            </Route>
          </Route>

          {/* ============================================= */}
          {/* PROXY */}
          {/* ============================================= */}

          <Route
            element={
              <RoleRoute
                allow={[
                  "Proxy",
                ]}
              />
            }
          >
            <Route
              path="/proxy"
              element={
                <ProxyAppLayout />
              }
            >
              <Route
                index
                element={
                  <ProxyDashboard />
                }
              />

              <Route
                path="patients"
                element={
                  <ProxyPatientsPage />
                }
              />

              <Route
                path="collections"
                element={
                  <ProxyCollectionsPage />
                }
              />
            </Route>
          </Route>

          {/* ============================================= */}
          {/* NURSE + ADMIN LAYOUT */}
          {/* ============================================= */}

          <Route
            element={
              <AuthenticatedLayout />
            }
          >

            {/* =========================================== */}
            {/* NURSE */}
            {/* =========================================== */}

            <Route
              element={
                <RoleRoute
                  allow={[
                    "Nurse",
                  ]}
                />
              }
            >
              <Route
                path="/nurse"
                element={
                  <NurseDashboard />
                }
              />

              <Route
                path="/nurse/patients"
                element={
                  <NursePatientsPage />
                }
              />

              <Route
                path="/nurse/collections"
                element={
                  <CollectionsPage />
                }
              />
            </Route>

            {/* =========================================== */}
            {/* CLINIC ADMIN + SUPER ADMIN */}
            {/* =========================================== */}

            <Route
              element={
                <RoleRoute
                  allow={[
                    "ClinicAdmin",
                    "SuperAdmin",
                  ]}
                />
              }
            >
              <Route
                path="/admin"
                element={
                  <AdminDashboard />
                }
              />

              <Route
                path="/admin/register-staff"
                element={
                  <RegisterStaffPage />
                }
              />

              <Route
                path="/admin/staff"
                element={
                  <ManageStaffPage />
                }
              />

              <Route
                path="/admin/audit"
                element={
                  <AdminAuditLogPage />
                }
              />
            </Route>

            {/* =========================================== */}
            {/* SUPER ADMIN */}
            {/* =========================================== */}

            <Route
              element={
                <RoleRoute
                  allow={[
                    "SuperAdmin",
                  ]}
                />
              }
            >
              <Route
                path="/admin/clinics"
                element={
                  <ManageClinicsPage />
                }
              />

              <Route
                path="/admin/register-clinic-admin"
                element={
                  <RegisterClinicAdminPage />
                }
              />
            </Route>

          </Route>

        </Route>

      </Route>

      {/* ================================================= */}
      {/* NOT FOUND */}
      {/* ================================================= */}

      <Route
        path="*"
        element={
          <NotFound />
        }
      />

    </Routes>
  );
}
