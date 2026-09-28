import {
  useEffect,
  useState,
} from "react";

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
  const [
    dob,
    setDob,
  ] = useState(
    normalizeDate(
      dateOfBirth
    )
  );

  const [
    fullIdNumber,
    setFullIdNumber,
  ] = useState(
    idNumber ?? ""
  );

  const [
    savingDob,
    setSavingDob,
  ] = useState(false);

  const [
    savingId,
    setSavingId,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

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
        response?.dateOfBirth
      )
    );

    setFullIdNumber(
      response?.idNumber ??
        ""
    );

    setSuccess(
      message
    );

    setError(
      ""
    );

    onUpdated?.(
      response
    );
  }

  async function handleDobSubmit(
    event
  ) {
    event.preventDefault();

    if (!dob) {
      setError(
        "Select a date of birth."
      );

      return;
    }

    try {
      setSavingDob(
        true
      );

      setError(
        ""
      );

      setSuccess(
        ""
      );

      const response =
        await identityApi
          .updateDateOfBirth({
            dateOfBirth:
              dob,
          });

      applyResponse(
        response,
        "Date of birth updated. Only the first six digits of the ID number were changed."
      );
    } catch (updateError) {
      setError(
        updateError?.message ||
          "Could not update the date of birth."
      );
    } finally {
      setSavingDob(
        false
      );
    }
  }

  async function handleIdSubmit(
    event
  ) {
    event.preventDefault();

    const normalized =
      fullIdNumber.trim();

    if (
      !/^\d{13}$/.test(
        normalized
      )
    ) {
      setError(
        "Enter a valid 13-digit South African ID number."
      );

      return;
    }

    try {
      setSavingId(
        true
      );

      setError(
        ""
      );

      setSuccess(
        ""
      );

      const response =
        await identityApi
          .updateIdNumber({
            idNumber:
              normalized,
          });

      applyResponse(
        response,
        "Full ID number updated. Date of birth was synchronized from its first six digits."
      );
    } catch (updateError) {
      setError(
        updateError?.message ||
          "Could not update the ID number."
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
              Identity details
            </h2>

            <p className="mt-1 text-sm leading-5 text-[#64748b]">
              Correct your date of birth or, when necessary, replace the complete South African ID number.
            </p>

            <p className="mt-2 text-xs leading-5 text-[#64748b]">
              Identity changes are saved separately from the rest of your profile. Use the relevant update button below.
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
            Current ID number
          </p>

          <p className="mt-2 break-all font-mono text-sm font-semibold text-[#0f172a]">
            {idNumber ||
              "Not available"}
          </p>

        </div>

        <form
          onSubmit={
            handleDobSubmit
          }
          className="space-y-4"
        >

          <div>

            <div className="flex items-center gap-2">

              <CalendarDays
                size={16}
                className="text-[#0f766e]"
              />

              <h3 className="text-sm font-semibold text-[#0f172a]">
                Correct date of birth
              </h3>

            </div>

            <p className="mt-1 text-xs leading-5 text-[#64748b]">
              This changes only the YYMMDD prefix of your current ID number. The remaining seven digits stay exactly the same.
            </p>

          </div>

          <input
            type="date"
            value={
              dob
            }
            onChange={(
              event
            ) => {
              setDob(
                event.target.value
              );

              setError(
                ""
              );

              setSuccess(
                ""
              );
            }}
            className="h-11 w-full rounded-xl border border-[#cbd5e1] bg-white px-4 text-sm text-[#0f172a] outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10"
          />

          <button
            type="submit"
            disabled={
              savingDob
            }
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-4 text-sm font-semibold text-white transition hover:bg-[#115e59] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >

            <Save
              size={16}
            />

            {savingDob
              ? "Updating..."
              : "Update date of birth"}

          </button>

        </form>

        <div className="border-t border-[#e2e8f0]" />

        <form
          onSubmit={
            handleIdSubmit
          }
          className="space-y-4"
        >

          <div>

            <div className="flex items-center gap-2">

              <IdCard
                size={16}
                className="text-[#0f766e]"
              />

              <h3 className="text-sm font-semibold text-[#0f172a]">
                Correct full ID number
              </h3>

            </div>

            <p className="mt-1 text-xs leading-5 text-[#64748b]">
              Use this only when digits outside the date prefix are also wrong. Your date of birth will be updated from the new ID's first six digits.
            </p>

          </div>

          <input
            type="text"
            inputMode="numeric"
            maxLength={13}
            value={
              fullIdNumber
            }
            onChange={(
              event
            ) => {
              setFullIdNumber(
                event.target.value
                  .replace(
                    /\D/g,
                    ""
                  )
                  .slice(
                    0,
                    13
                  )
              );

              setError(
                ""
              );

              setSuccess(
                ""
              );
            }}
            placeholder="13-digit SA ID number"
            className="h-11 w-full rounded-xl border border-[#cbd5e1] bg-white px-4 font-mono text-sm text-[#0f172a] outline-none transition focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10"
          />

          <button
            type="submit"
            disabled={
              savingId
            }
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-[#0f766e] px-4 text-sm font-semibold text-[#0f766e] transition hover:bg-[#f0fdfa] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >

            <IdCard
              size={16}
            />

            {savingId
              ? "Updating..."
              : "Update full ID number"}

          </button>

          <p className="text-xs leading-5 text-[#64748b]">
            Your SA ID number is also your login identifier, so use the corrected number the next time you sign in.
          </p>

        </form>

      </div>

    </section>
  );
}