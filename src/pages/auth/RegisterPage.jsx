import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import logo2 from "../../assets/logo2.png";

import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";

import {
  useAuth,
} from "../../context/AuthContext.jsx";

import {
  useToast,
} from "../../components/ui/Toast.jsx";

import {
  ApiError,
} from "../../services/api/client.js";

import {
  authApi,
} from "../../services/api/auth.js";

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
  const [
    form,
    setForm,
  ] = useState(
    initialForm
  );

  const [
    errors,
    setErrors,
  ] = useState({});

  const [
    loading,
    setLoading,
  ] = useState(false);

  const {
    registerPatient,
  } = useAuth();

  const toast =
    useToast();

  const navigate =
    useNavigate();

  const set =
    (key) =>
    (event) => {
      setForm(
        (current) => ({
          ...current,

          [key]:
            event.target.value,
        })
      );
    };

  const validate =
    () => {
      const next = {};

      if (
        !form.fullName
          .trim()
      ) {
        next.fullName =
          "Enter your full name.";
      }

      if (
        !/^\d{13}$/.test(
          form.idNumber
        )
      ) {
        next.idNumber =
          "Enter a valid 13-digit SA ID number.";
      }

      if (
        !/^0\d{9}$/.test(
          form.phone
        )
      ) {
        next.phone =
          "Enter a valid SA phone number (e.g. 0821234567).";
      }

      if (
        !form.email
          .trim()
      ) {
        next.email =
          "Enter your email address.";
      } else if (
        !/^\S+@\S+\.\S+$/.test(
          form.email
            .trim()
        )
      ) {
        next.email =
          "Enter a valid email address.";
      }

      if (
        form.password
          .length <
        12
      ) {
        next.password =
          "Password must be at least 12 characters.";
      }

      if (
        form.confirmPassword !==
        form.password
      ) {
        next.confirmPassword =
          "Passwords don't match.";
      }

      setErrors(
        next
      );

      return (
        Object.keys(
          next
        ).length ===
        0
      );
    };

  const handleSubmit =
    async (
      event
    ) => {
      event.preventDefault();

      if (
        !validate()
      ) {
        return;
      }

      setLoading(
        true
      );

      try {
        const result =
          await registerPatient({
            fullName:
              form.fullName
                .trim(),

            idNumber:
              form.idNumber
                .trim(),

            phoneNumber:
              form.phone
                .trim(),

            email:
              form.email
                .trim(),

            password:
              form.password,
          });

        const userId =
          result?.userId ??
          result?.id;

        if (!userId) {
          throw new Error(
            "Registration completed but the verification session could not be created."
          );
        }

        let codeSent =
          false;

        try {
          await authApi
            .resendCode(
              userId
            );

          codeSent =
            true;
        } catch (
          otpError
        ) {
          console.error(
            "Initial OTP email failed:",
            otpError
          );
        }

        navigate(
          "/register/verify",
          {
            state: {
              userId,

              email:
                form.email
                  .trim(),

              phone:
                form.phone
                  .trim(),
            },
          }
        );

        if (
          codeSent
        ) {
          toast.success(
            "Account created. We sent a verification code to your email."
          );
        } else {
          toast.error(
            "Your account was created, but we couldn't send the verification email. Use Resend code on the next screen."
          );
        }
      } catch (
        error
      ) {
        if (
          error instanceof
            ApiError &&
          error.errors
        ) {
          const fieldErrors =
            {};

          Object.entries(
            error.errors
          ).forEach(
            (
              [
                key,
                messages,
              ]
            ) => {
              fieldErrors[
                key
                  .charAt(0)
                  .toLowerCase() +
                  key.slice(1)
              ] =
                Array.isArray(
                  messages
                )
                  ? messages[0]
                  : messages;
            }
          );

          setErrors(
            fieldErrors
          );
        }

        toast.error(
          error?.message ||
            "Couldn't create your account. Please try again."
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  return (
    <>
      <NavigationPage />

      <div
        className="register-page"
        style={{
          marginTop:
            "70px",
        }}
      >
        <div className="register-background" />

        <div className="register-overlay" />

        <main className="register-content">
          <div className="register-card">
            <div className="register-brand">
              <img
                src={
                  logo2
                }
                alt="PhilaLink logo"
              />

              <div>
                <span>
                  Phila
                </span>
                Link
              </div>
            </div>

            <div className="register-heading">
              <p className="register-eyebrow">
                PATIENT
                REGISTRATION
              </p>

              <h1>
                Create your
                account.
              </h1>

              <p>
                Join
                PhilaLink to
                manage your
                healthcare
                information
                and stay
                connected
                with your
                care.
              </p>
            </div>

            <div className="register-progress">
              <div className="progress-step active">
                <span>
                  1
                </span>

                <p>
                  Your details
                </p>
              </div>

              <div className="progress-line" />

              <div className="progress-step">
                <span>
                  2
                </span>

                <p>
                  Verify email
                </p>
              </div>

              <div className="progress-line" />

              <div className="progress-step">
                <span>
                  3
                </span>

                <p>
                  Complete
                </p>
              </div>
            </div>

            <form
              onSubmit={
                handleSubmit
              }
              className="register-form"
            >
              <Input
                label="Full name"
                value={
                  form.fullName
                }
                onChange={
                  set(
                    "fullName"
                  )
                }
                error={
                  errors.fullName
                }
                placeholder="Thandiwe Synthia Nzimande"
                autoComplete="name"
              />

              <Input
                label="SA ID number"
                value={
                  form.idNumber
                }
                onChange={
                  set(
                    "idNumber"
                  )
                }
                error={
                  errors.idNumber
                }
                placeholder="9001015800082"
                inputMode="numeric"
                maxLength={
                  13
                }
              />

              <Input
                label="Cellphone number"
                value={
                  form.phone
                }
                onChange={
                  set(
                    "phone"
                  )
                }
                error={
                  errors.phone
                }
                placeholder="0821234567"
                inputMode="tel"
                autoComplete="tel"
              />

              <Input
                label="Email"
                type="email"
                value={
                  form.email
                }
                onChange={
                  set(
                    "email"
                  )
                }
                error={
                  errors.email
                }
                placeholder="thandiwe@gmail.com"
                autoComplete="email"
                hint="We'll send your 6-digit verification code to this email address."
              />

              <div className="register-passwords">
                <Input
                  label="Password"
                  type="password"
                  value={
                    form.password
                  }
                  onChange={
                    set(
                      "password"
                    )
                  }
                  error={
                    errors.password
                  }
                  placeholder="••••••••••••"
                  autoComplete="new-password"
                />

                <Input
                  label="Confirm password"
                  type="password"
                  value={
                    form.confirmPassword
                  }
                  onChange={
                    set(
                      "confirmPassword"
                    )
                  }
                  error={
                    errors
                      .confirmPassword
                  }
                  placeholder="••••••••••••"
                  autoComplete="new-password"
                />
              </div>

              <Button
                type="submit"
                className="register-submit"
                loading={
                  loading
                }
              >
                {loading
                  ? "Creating account…"
                  : "Continue"}
              </Button>
            </form>

            <div className="register-login">
