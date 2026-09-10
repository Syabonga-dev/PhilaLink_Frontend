import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../components/ui/Toast.jsx";
import { ApiError } from "../../services/api/client.js";
import { homePathForRole } from "../../routes/ProtectedRoute.jsx";
import NavigationBar from "../../components/layout/NavigationBar.jsx";
import "./LoginPage.css";

export default function LoginPage() {
  const [idNumber, setIdNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [idError, setIdError] = useState("");

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

    setIdError("");

    if (idNumber.length !== 13 || isNaN(idNumber)) {
      setIdError("ID must be 13 digits and a number");

      setTimeout(() => {
        setIdError("");
      }, 5000);

      return;
    }

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
    <>
      <NavigationBar />

      <div className="login-page">
        <div className="login-background" />
        <div className="login-overlay" />

        <main className="login-content">
          <div className="login-card">
            <div className="login-brand">
              <img src={logo} alt="PhilaLink" />

              <div>
                <span>Phila</span>Link
              </div>
            </div>

            <div className="login-heading">
              <h1>Welcome back.</h1>

              <p>
                Sign in to access your PhilaLink healthcare dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <Input
                label="ID number"
                name="idNumber"
                value={idNumber}
                onChange={(e) => {
                  setIdNumber(e.target.value);
                  setIdError("");
                }}
                error={errors.idNumber}
                placeholder="e.g. 9001015800082"
                autoComplete="username"
                maxLength={13}
              />

              {idError && (
                <span id="invalid-id">
                  {idError}
                </span>
              )}

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

              <div className="login-options">
                <label>
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  className="forgot-password"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                className="login-submit"
                loading={loading}
              >
                {loading ? "Signing in…" : "Log in"}
              </Button>
            </form>

            <div className="login-register">
              <span>New patient?</span>

              <Link to="/register">
                Create an account
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}