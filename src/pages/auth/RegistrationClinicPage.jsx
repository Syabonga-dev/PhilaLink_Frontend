import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import logo2 from "../../assets/logo2.png";

import Button from "../../components/ui/Button.jsx";

import {
  useToast,
} from "../../components/ui/Toast.jsx";

import {
  ApiError,
} from "../../services/api/client.js";

import {
  clinicsApi,
} from "../../services/api/clinics.js";

const PENDING_REGISTRATION_USER_ID =
  "philalink_pending_registration_user_id";

const PENDING_REGISTRATION_EMAIL =
  "philalink_pending_registration_email";

export default function RegistrationClinicPage() {
  const location =
    useLocation();

  const navigate =
    useNavigate();

  const toast =
    useToast();

  const state =
    location.state ||
    {};

  const userId =
    state.userId ||
    sessionStorage.getItem(
      PENDING_REGISTRATION_USER_ID
    );

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    clinics,
    setClinics,
  ] =
    useState([]);

  const [
    selectedClinic,
    setSelectedClinic,
  ] =
    useState(null);

  const [
    loadingClinics,
    setLoadingClinics,
  ] =
    useState(false);

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    searchError,
    setSearchError,
  ] =
    useState("");

  const [
    dropdownOpen,
    setDropdownOpen,
  ] =
    useState(true);

  // =====================================================
  // REGISTRATION SESSION CHECK
  // =====================================================

  useEffect(() => {
    if (
      userId
    ) {
      return;
    }

    toast.error(
      "Registration details are missing. Please register again."
    );

    navigate(
      "/register",
      {
        replace:
          true,
      }
    );
  }, [
    userId,
    navigate,
    toast,
  ]);

  // =====================================================
  // SEARCH ACTIVE CLINICS
  // =====================================================

  useEffect(() => {
    if (
      !userId
    ) {
      return;
    }

    const controller =
      new AbortController();

    const timer =
      window.setTimeout(
        async () => {
          setLoadingClinics(
            true
          );

          setSearchError(
            ""
          );

          try {
            const result =
              await clinicsApi
                .searchForRegistration({
                  search,

                  limit:
                    30,

                  signal:
                    controller.signal,
                });

            setClinics(
              Array.isArray(
                result
              )
                ? result
                : []
            );
          } catch (
            error
          ) {
            if (
              error?.name ===
                "AbortError"
            ) {
              return;
            }

            setClinics([]);

            setSearchError(
              error instanceof
                ApiError
                ? error.message
                : "Couldn't load clinics."
            );
          } finally {
            if (
              !controller
                .signal
                .aborted
            ) {
              setLoadingClinics(
                false
              );
            }
          }
        },
        250
      );

    return () => {
      window.clearTimeout(
        timer
      );

      controller.abort();
    };
  }, [
    search,
    userId,
  ]);

  // =====================================================
  // SEARCH INPUT
  // =====================================================

  const handleSearchChange =
    (
      event
    ) => {
      setSearch(
        event.target.value
      );

      setDropdownOpen(
        true
      );
    };

  // =====================================================
  // SELECT CLINIC
  // =====================================================

  const handleClinicSelect =
    (
      clinic
    ) => {
      setSelectedClinic(
        clinic
      );

      setSearch(
        clinic.name
      );

      setDropdownOpen(
        false
      );
    };

  // =====================================================
  // SAVE CLINIC
  // =====================================================

  const handleContinue =
    async () => {
      if (
        !userId
      ) {
        toast.error(
          "Registration details are missing. Please register again."
        );

        navigate(
          "/register",
          {
            replace:
              true,
          }
        );

        return;
      }

      if (
        !selectedClinic
      ) {
        toast.error(
          "Select your clinic before continuing."
        );

        return;
      }

      setSubmitting(
        true
      );

      try {
        await clinicsApi
          .selectForRegistration({
            userId,

            clinicId:
              selectedClinic.id,
          });

        sessionStorage.removeItem(
          PENDING_REGISTRATION_USER_ID
        );

        sessionStorage.removeItem(
          PENDING_REGISTRATION_EMAIL
        );

        toast.success(
          "Your clinic has been selected."
        );

        navigate(
          "/register/success",
          {
            replace:
              true,

            state: {
              clinicName:
                selectedClinic.name,
            },
          }
        );
      } catch (
        error
      ) {
        toast.error(
          error instanceof
            ApiError
            ? error.message
            : error?.message ||
                "Couldn't save your clinic. Please try again."
        );
      } finally {
        setSubmitting(
          false
        );
      }
    };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/PillShelf.jpg')",

          filter:
            "blur(5px)",
        }}
      />

      <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px]" />

      <main className="relative z-10 w-full max-w-xl">
        <Link
          to="/"
          className="mb-5 flex items-center justify-center gap-2.5"
        >
          <img
            src={
              logo2
            }
            alt="PhilaLink"
            className="h-9 w-9 object-contain"
          />

          <span className="text-xl font-bold text-white">
            Phila
            <span className="text-primary">
              Link
            </span>
          </span>
        </Link>

        <div className="rounded-2xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur-md sm:p-9">

          {/* ============================================= */}
          {/* PROGRESS */}
          {/* ============================================= */}

          <div className="mb-7 flex items-start">
            <div className="flex min-w-[58px] flex-col items-center text-primary">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                ✓
              </span>

              <span className="mt-1.5 text-[10px] font-semibold">
                Details
              </span>
            </div>

            <div className="mt-4 h-px flex-1 bg-primary/50" />

            <div className="flex min-w-[58px] flex-col items-center text-primary">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                ✓
              </span>

              <span className="mt-1.5 text-[10px] font-semibold">
                Email
              </span>
            </div>

            <div className="mt-4 h-px flex-1 bg-primary/50" />

            <div className="flex min-w-[58px] flex-col items-center text-primary">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                ✓
              </span>

              <span className="mt-1.5 text-[10px] font-semibold">
                Verify
              </span>
            </div>

            <div className="mt-4 h-px flex-1 bg-primary/50" />

            <div className="flex min-w-[58px] flex-col items-center text-primary">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                4
              </span>

              <span className="mt-1.5 text-[10px] font-bold">
                Clinic
              </span>
            </div>
          </div>

          {/* ============================================= */}
          {/* HEADING */}
          {/* ============================================= */}

          <div className="text-center">
            <span className="material-symbols-outlined mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-container/10 text-3xl text-primary">
              local_hospital
            </span>

            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Step 4 · Select clinic
            </p>

            <h1 className="mt-2 text-2xl font-bold text-on-surface">
              Choose your clinic
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-on-surface-variant">
              Search for the public health facility you normally use and select it from the list.
            </p>
          </div>

          {/* ============================================= */}
          {/* SEARCH */}
          {/* ============================================= */}

          <div className="relative mt-7">
            <label
              htmlFor="clinic-search"
              className="mb-2 block text-sm font-semibold text-on-surface"
            >
              Clinic or health facility
            </label>

            <div className="relative">
              <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[21px] text-on-surface-variant">
                search
              </span>

              <input
                id="clinic-search"
                type="search"
                value={
                  search
                }
                onChange={
                  handleSearchChange
                }
                onFocus={() =>
                  setDropdownOpen(
                    true
                  )
                }
                placeholder="Search by facility name, address or type"
                autoComplete="off"
                role="combobox"
                aria-expanded={
                  dropdownOpen
                }
                aria-controls="clinic-results"
                className="min-h-12 w-full rounded-lg border border-outline-variant bg-white py-3 pl-11 pr-4 text-sm text-on-surface outline-none transition placeholder:text-on-surface-variant/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />

              {loadingClinics && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-on-surface-variant">
                  Searching…
                </span>
              )}
            </div>

            {/* =========================================== */}
            {/* SEARCH RESULTS */}
            {/* =========================================== */}

            {dropdownOpen && (
              <div
                id="clinic-results"
                className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-outline-variant bg-white shadow-xl"
              >
                {searchError ? (
                  <div className="p-4">
                    <p className="text-sm font-semibold text-error">
                      Couldn't load clinics
                    </p>

                    <p className="mt-1 text-xs text-on-surface-variant">
                      {searchError}
                    </p>
                  </div>
                ) : loadingClinics &&
                  clinics.length ===
                    0 ? (
                  <div className="p-4 text-sm text-on-surface-variant">
                    Searching clinics…
                  </div>
                ) : clinics.length ===
                    0 ? (
                  <div className="p-4">
                    <p className="text-sm font-semibold text-on-surface">
                      No facilities found
                    </p>

                    <p className="mt-1 text-xs text-on-surface-variant">
                      Try searching with a different facility name or location.
                    </p>
                  </div>
                ) : (
                  clinics.map(
                    (
                      clinic
                    ) => {
                      const selected =
                        selectedClinic
                          ?.id ===
                        clinic.id;

                      return (
                        <button
                          key={
                            clinic.id
                          }
                          type="button"
                          onClick={() =>
                            handleClinicSelect(
                              clinic
                            )
                          }
                          className={`flex w-full items-start gap-3 border-b border-outline-variant/50 px-4 py-3 text-left transition last:border-b-0 hover:bg-primary/5 ${
                            selected
                              ? "bg-primary/10"
                              : ""
                          }`}
                        >
                          <span className="material-symbols-outlined mt-0.5 text-[21px] text-primary">
                            local_hospital
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-bold text-on-surface">
                              {
                                clinic.name
                              }
                            </span>

                            <span className="mt-0.5 block text-xs font-medium text-primary">
                              {
                                clinic.type
                              }
                            </span>

                            <span className="mt-1 block text-xs leading-5 text-on-surface-variant">
                              {
                                clinic.address
                              }
                            </span>
                          </span>

                          {selected && (
                            <span className="material-symbols-outlined text-[20px] text-primary">
                              check_circle
                            </span>
                          )}
                        </button>
                      );
                    }
                  )
                )}
              </div>
            )}
          </div>

          {/* ============================================= */}
          {/* SELECTED CLINIC */}
          {/* ============================================= */}

          {selectedClinic && (
            <div className="mt-5 rounded-xl border border-primary/25 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-2xl text-primary">
                  check_circle
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-wide text-primary">
                    Selected clinic
                  </p>

                  <p className="mt-1 text-sm font-bold text-on-surface">
                    {
                      selectedClinic.name
                    }
                  </p>

                  <p className="mt-1 text-xs font-medium text-on-surface-variant">
                    {
                      selectedClinic.type
                    }
                  </p>

                  <p className="mt-1 text-xs leading-5 text-on-surface-variant">
                    {
                      selectedClinic.address
                    }
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedClinic(
                      null
                    );

                    setSearch(
                      ""
                    );

                    setDropdownOpen(
                      true
                    );
                  }}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Change
                </button>
              </div>
            </div>
          )}

          {/* ============================================= */}
          {/* CONTINUE */}
          {/* ============================================= */}

          <Button
            type="button"
            onClick={
              handleContinue
            }
            className="mt-6 w-full"
            loading={
              submitting
            }
            disabled={
              !selectedClinic ||
              submitting
            }
          >
            {submitting
              ? "Saving clinic…"
              : "Complete registration"}
          </Button>

          <p className="mt-5 text-center text-xs leading-5 text-on-surface-variant">
            Your selected clinic will be used for your PhilaLink care information, appointments and medication collection details.
          </p>
        </div>
      </main>
    </div>
  );
}
