import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import {
  ProtectedRoute,
  RoleRoute,
  PasswordChangeRoute,
  homePathForRole,
} from "./routes/ProtectedRoute.jsx";

import AuthenticatedLayout from "./components/layout/AuthenticatedLayout.jsx";

import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import PhoneVerificationPage from "./pages/auth/PhoneVerificationPage.jsx";
import RegistrationSuccessPage from "./pages/auth/RegistrationSuccessPage.jsx";
import ChangePasswordPage from "./pages/auth/ChangePasswordPage.jsx";
import NotFound from "./pages/NotFound.jsx";

import PatientAppLayout from "./components/patient/AppLayout.jsx";
import PatientDashboardPage from "./pages/patient/DashboardPage.jsx";
import PatientMedicationsPage from "./pages/patient/MedicationsPage.jsx";
import PatientAppointmentsPage from "./pages/patient/AppointmentsPage.jsx";
import PatientRecordsPage from "./pages/patient/RecordsPage.jsx";
import PatientNearestClinicsPage from "./pages/patient/NearestClinicsPage.jsx";
import PatientSettingsPage from "./pages/patient/SettingsPage.jsx";

import NurseDashboard from "./pages/nurse/NurseDashboard.jsx";
import NursePatientsPage from "./pages/nurse/NursePatientsPage.jsx";
import CollectionsPage from "./pages/nurse/CollectionsPage.jsx";

import ProxyDashboard from "./pages/proxy/ProxyDashboard.jsx";
import ProxyPatientsPage from "./pages/proxy/ProxyPatientsPage.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import RegisterStaffPage from "./pages/admin/RegisterStaffPage.jsx";
import ManageStaffPage from "./pages/admin/ManageStaffPage.jsx";

function RedirectIfAuthenticated({
  children,
}) {
  const {
    isAuthenticated,
    role,
    isLoading,
    mustChangePassword,
  } = useAuth();

  if (isLoading) {
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

export default function App() {
  return (
    <Routes>
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
        path="/register/success"
        element={
          <RegistrationSuccessPage />
        }
      />

      <Route
        element={
          <ProtectedRoute />
        }
      >
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
              <PatientAppLayout />
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

        <Route
          element={
            <AuthenticatedLayout />
          }
        >
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
                <ProxyDashboard />
              }
            />

            <Route
              path="/proxy/patients"
              element={
                <ProxyPatientsPage />
              }
            />
          </Route>

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
          </Route>
        </Route>
      </Route>

      <Route
        path="*"
        element={
          <NotFound />
        }
      />
    </Routes>
  );
}