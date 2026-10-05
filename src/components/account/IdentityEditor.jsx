import {
  useEffect,
  useState,
} from "react";

import {
  useTranslation,
} from "react-i18next";

import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  IdCard,
  Save,
} from "lucide-react";

import {
  identityApi,
} from "../../services/api/identity.js";

function normalizeDate(
  value
) {
  if (!value) {
    return "";
  }

  const text =
    String(value);

  if (
    /^\d{4}-\d{2}-\d{2}/.test(
      text
    )
  ) {
    return text.slice(
      0,
      10
    );
  }

  return "";
}

export default function IdentityEditor({
  idNumber,
  dateOfBirth,
  onUpdated,
}) {
  const {
    t,
  } =
    useTranslation();

  const [
    dob,
    setDob,
  ] =
    useState(
      normalizeDate(
        dateOfBirth
      )
    );

  const [
    fullIdNumber,
    setFullIdNumber,
  ] =
    useState(
      idNumber ?? ""
    );

  const [
    savingDob,
    setSavingDob,
  ] =
    useState(false);

  const [
    savingId,
    setSavingId,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    success,
    setSuccess,
  ] =
    useState("");

  useEffect(
    () => {
      setDob(
        normalizeDate(
          dateOfBirth
        )
      );
    },
    [
      dateOfBirth,
    ]
  );

  useEffect(
    () => {
      setFullIdNumber(
        idNumber ?? ""
      );
    },
    [
      idNumber,
    ]
  );

  function applyResponse(
    response,
    message
  ) {
    setDob(
      normalizeDate(
        response
          ?.dateOfBirth
      )
    );

    setFullIdNumber(
      response
        ?.idNumber ??
        ""
    );

    setSuccess(
      message
    );

    setError("");

    onUpdated?.(
      response
    );
  }

  async function handleDobSubmit() {
    if (savingDob) {
      return;
    }

    if (!dob) {
      setError(
        t(
          "identity.selectDob"
        )
      );

      return;
    }

    try {
      setSavingDob(
        true
      );

      setError("");
      setSuccess("");

      const response =
        await identityApi
          .updateDateOfBirth({
            dateOfBirth:
              dob,
          });

      applyResponse(
        response,
        t(
          "identity.dobUpdated"
        )
      );
    } catch (
      updateError
    ) {
      console.error(
        "Failed to update date of birth:",
        updateError
      );

      setError(
        updateError
          ?.message ||
        t(
          "identity.dobUpdateError"
        )
      );
    } finally {
      setSavingDob(
        false
      );
    }
  }

  async function handleIdSubmit() {
    if (savingId) {
      return;
    }

    const normalized =
      fullIdNumber
        .trim();

    if (
      !/^\d{13}$/.test(
        normalized
      )
    ) {
      setError(
        t(
          "identity.invalidId"
        )
      );

      return;
    }

    try {
      setSavingId(
        true
      );

      setError("");
      setSuccess("");

      const response =
        await identityApi
          .updateIdNumber({
            idNumber:
              normalized,
          });

      applyResponse(
        response,
        t(
          "identity.idUpdated"
        )
      );
    } catch (
      updateError
    ) {
      console.error(
        "Failed to update ID number:",
        updateError
      );

      setError(
        updateError
          ?.message ||
        t(
          "identity.idUpdateError"
        )
      );
    } finally {
      setSavingId(
        false
      );
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white">
      <div className="border-b border-[#e2e8f0] px-5 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ccfbf1] text-[#0f766e]">
            <IdCard
              size={18}
            />
          </div>

          <div className="min-w-0">
            <h2 className="font-semibold text-[#0f172a]">
              {t(
                "identity.title"
              )}
            </h2>

            <p className="mt-1 text-sm leading-5 text-[#64748b]">
              {t(
                "identity.description"
              )}
            </p>

            <p className="mt-2 text-xs leading-5 text-[#64748b]">
              {t(
                "identity.separateSave"
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-5 sm:p-6">
        {error && (
          <div className="flex items-start gap-3 rounded-xl bg-[#fee2e2] p-4 text-[#b91c1c]">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <p className="text-sm leading-5">
              {error}
            </p>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 rounded-xl bg-[#dcfce7] p-4 text-[#166534]">
            <CheckCircle2
              size={18}
              className="mt-0.5 shrink-0"
            />

            <p className="text-sm leading-5">
              {success}
            </p>
          </div>
        )}

        <div className="rounded-xl bg-[#f8fafc] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">
            {t(
              "identity.currentId"
            )}
          </p>

          <p className="mt-2 break-all font-mono text-sm font-semibold text-[#0f172a]">
            {idNumber ||
              t(
                "identity.notAvailable"
              )}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <CalendarDays
                size={16}
                className="text-[#0f766e]"
              />

              <h3 className="text-sm font-semibold text-[#0f172a]">
                {t(
                  "identity.correctDob"
                )}
              </h3>
            </div>

            <p className="mt-1 text-xs leading-5 text-[#64748b]">
              {t(
                "identity.dobDescription"
              )}
            </p>
          </div>

          <input
            type="date"
            value={dob}
            onChange={
              event => {
                setDob(
                  event
                    .target
                    .value
                );

                setError("");
                setSuccess("");
              }
            }
            className="h-11 w-full rounded-xl border border-[#cbd5e1] bg-white px-4 text-sm text-[#0f172a] outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10"
          />

          <button
            type="button"
            onClick={
              handleDobSubmit
            }
            disabled={
              savingDob
            }
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-4 text-sm font-semibold text-white transition hover:bg-[#115e59] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            <Save
              size={16}
            />

            {savingDob
              ? t(
                  "identity.updating"
                )
              : t(
                  "identity.updateDob"
                )}
          </button>
        </div>

        <div className="border-t border-[#e2e8f0]" />

        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <IdCard
                size={16}
                className="text-[#0f766e]"
              />

              <h3 className="text-sm font-semibold text-[#0f172a]">
                {t(
                  "identity.correctFullId"
                )}
              </h3>
            </div>

            <p className="mt-1 text-xs leading-5 text-[#64748b]">
              {t(
                "identity.fullIdDescription"
              )}
            </p>
          </div>

          <input
            type="text"
            inputMode="numeric"
            maxLength={13}
            value={
              fullIdNumber
            }
            onChange={
              event => {
                setFullIdNumber(
                  event
                    .target
                    .value
                    .replace(
                      /\D/g,
                      ""
                    )
                    .slice(
                      0,
                      13
                    )
                );

                setError("");
                setSuccess("");
              }
            }
            placeholder={t(
              "identity.idPlaceholder"
            )}
            className="h-11 w-full rounded-xl border border-[#cbd5e1] bg-white px-4 font-mono text-sm text-[#0f172a] outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10"
          />

          <button
            type="button"
            onClick={
              handleIdSubmit
            }
            disabled={
              savingId
            }
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-[#0f766e] px-4 text-sm font-semibold text-[#0f766e] transition hover:bg-[#f0fdfa] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            <IdCard
              size={16}
            />

            {savingId
              ? t(
                  "identity.updating"
                )
              : t(
                  "identity.updateFullId"
                )}
          </button>

          <p className="text-xs leading-5 text-[#64748b]">
            {t(
              "identity.loginIdentifier"
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
