import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../components/ui/Toast.jsx";
import { ApiError } from "../../services/api/client.js";
import { homePathForRole } from "../../routes/ProtectedRoute.jsx";
import NavigationPage from "../../components/layout/NavigationBar.jsx";

const FEATURES = [
  {
    icon: "medication",
    text: "Chronic medication collection tracking",
  },
  {
    icon: "psychology_alt",
    text: "AI-assisted symptom triage",
  },
  {
    icon: "location_on",
    text: "Live clinic capacity & directions",
  },
];

export default function LoginPage() {
  const [idNumber, setIdNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const validate = () => {
    const next = {};

    if (!idNumber.trim()) {
      next.idNumber = "Enter your ID number.";
    }

    if (!password) {
      next.password = "Enter your password.";
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const user = await login({ idNumber, password });

      toast.success(
        `Welcome back, ${user.fullName || user.name || "there"}.`
      );

      const dest =
        location.state?.from?.pathname || homePathForRole(user.role);

      navigate(dest, { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          toast.error("Incorrect ID number or password.");
        } else {
          toast.error(err.message);
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Shared Navigation */}
      <NavigationPage />

      {/* Login Content */}
      <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
        {/* Branding Panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-on-primary lg:flex">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
          <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-white/5" />

          <div className="relative">
            <h2 className="text-3xl font-bold leading-tight">
              Healthcare that stays connected to you.
            </h2>

            <div className="mt-8 space-y-4">
              {FEATURES.map((f) => (
                <div key={f.text} className="flex items-center gap-3">
                  <span className="material-symbols-outlined flex h-10 w-10 items-center justify-center rounded-md bg-white/10">
                    {f.icon}
                  </span>

                  <span className="text-sm text-white/90">
                    {f.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="relative text-xs text-white/60">
            © {new Date().getFullYear()} PhilaLink Public Health Portal
          </p>
        </div>

        {/* Form Panel */}
        <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
          <div className="mx-auto w-full max-w-sm">
            <h1 className="text-2xl font-bold text-on-surface">
              Welcome back
            </h1>

            <p className="mt-1 text-sm text-on-surface-variant">
              Log in to continue to your PhilaLink dashboard.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Input
                label="ID number"
                name="idNumber"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                error={errors.idNumber}
                placeholder="e.g. 9001015800082"
                autoComplete="username"
              />

              <Input
                label="Password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                placeholder="••••••••"
                autoComplete="current-password"
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-on-surface-variant">
                  <input
                    type="checkbox"
                    className="rounded border-outline-variant"
                  />
                  Remember me
                </label>

                <button
                  type="button"
                  className="font-medium text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full"
                loading={loading}
              >
                {loading ? "Signing in…" : "Log in"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-on-surface-variant">
              New patient{" "}
              <Link
                to="/register"
                className="font-semibold text-primary hover:underline"
              >
                Create an account
              </Link>
            </p>

            <p className="mt-2 text-center text-xs text-on-surface-variant">
              Nurse, Proxy, and Administrator accounts are created by an
              administrator — everyone logs in the same way, above.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
