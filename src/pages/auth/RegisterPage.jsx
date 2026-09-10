import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../components/ui/Toast.jsx";
import { ApiError } from "../../services/api/client.js";
import NavigationPage from "../../components/layout/NavigationBar.jsx";
import "./RegisterPage.css";

const initialForm = {
  fullName: "",
  idNumber: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { registerPatient } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const set = (key) => (e) =>
    setForm((f) => ({
      ...f,
      [key]: e.target.value,
    }));

  const validate = () => {
    const next = {};

    if (!form.fullName.trim()) {
      next.fullName = "Enter your full name.";
    }

    if (!/^\d{13}$/.test(form.idNumber)) {
      next.idNumber = "Enter a valid 13-digit SA ID number.";
    }

    if (!/^0\d{9}$/.test(form.phone)) {
      next.phone =
        "Enter a valid SA phone number (e.g. 0821234567).";
    }

    if (
      form.email &&
      !/^\S+@\S+\.\S+$/.test(form.email)
    ) {
      next.email = "Enter a valid email address.";
    }

    if (form.password.length < 8) {
      next.password = "Password must be at least 8 characters.";
    }

    if (form.confirmPassword !== form.password) {
      next.confirmPassword = "Passwords don't match.";
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const result = await registerPatient({
        fullName: form.fullName,
        idNumber: form.idNumber,
        phone: form.phone,
        email: form.email || undefined,
        password: form.password,
      });

      toast.success(
        "Account created — let's verify your phone number."
      );

      navigate("/register/verify", {
        state: {
          userId: result?.userId ?? result?.id,
          phone: form.phone,
          idNumber: form.idNumber,
          password: form.password,
        },
      });
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        const fieldErrors = {};

        Object.entries(err.errors).forEach(([key, msgs]) => {
          fieldErrors[
            key.charAt(0).toLowerCase() + key.slice(1)
          ] = Array.isArray(msgs) ? msgs[0] : msgs;
        });

        setErrors(fieldErrors);
      }

      toast.error(
        err.message ||
          "Couldn't create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavigationPage />

      <div className="register-page" style={{marginTop: "70px"}}>
        <div className="register-background" />
        <div className="register-overlay" />

        <main className="register-content">
          <div className="register-card">
            <div className="register-brand">
              <img src={logo} alt="PhilaLink" />

              <div>
                <span>Phila</span>Link
              </div>
            </div>

            <div className="register-heading">
              <p className="register-eyebrow">
                PATIENT REGISTRATION
              </p>

              <h1>Create your account.</h1>

              <p>
                Join PhilaLink to manage your healthcare
                information and stay connected with your care.
              </p>
            </div>

            <div className="register-progress">
              <div className="progress-step active">
                <span>1</span>
                <p>Your details</p>
              </div>

              <div className="progress-line" />

              <div className="progress-step">
                <span>2</span>
                <p>Verify phone</p>
              </div>

              <div className="progress-line" />

              <div className="progress-step">
                <span>3</span>
                <p>Complete</p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="register-form"
            >
              <Input
                label="Full name"
                value={form.fullName}
                onChange={set("fullName")}
                error={errors.fullName}
                placeholder="Thandiwe Synthia Nzimande"
                autoComplete="name"
              />

              <Input
                label="SA ID number"
                value={form.idNumber}
                onChange={set("idNumber")}
                error={errors.idNumber}
                placeholder="9001015800082"
                inputMode="numeric"
                maxLength={13}
              />

              <Input
                label="Cellphone number"
                value={form.phone}
                onChange={set("phone")}
                error={errors.phone}
                placeholder="0821234567"
                inputMode="tel"
                autoComplete="tel"
                hint="We'll text a verification code to this number."
              />

              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={set("email")}
                error={errors.email}
                placeholder="Thandiwe@gmail.com"
                autoComplete="email"
              />

              <div className="register-passwords">
                <Input
                  label="Password"
                  type="password"
                  value={form.password}
                  onChange={set("password")}
                  error={errors.password}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />

                <Input
                  label="Confirm password"
                  type="password"
                  value={form.confirmPassword}
                  onChange={set("confirmPassword")}
                  error={errors.confirmPassword}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>

              <Button
                type="submit"
                className="register-submit"
                loading={loading}
              >
                {loading
                  ? "Creating account…"
                  : "Continue"}
              </Button>
            </form>

            <div className="register-login">
              <span>Already have an account?</span>

              <Link to="/login">
                Log in
              </Link>
            </div>

            <p className="register-note">
              Nurse and Proxy accounts are created by a
              PhilaLink administrator.
            </p>
          </div>
        </main>
      </div>
    </>
  );
}