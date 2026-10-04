import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  RefreshCw,
  Search,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";

import {
  useAuth,
} from "../../context/AuthContext.jsx";

import {
  clinicAdminApi,
} from "../../services/api/clinicAdmin.js";

import {
  superAdminAccountsApi,
} from "../../services/api/superAdminAccounts.js";

import {
  adminApi,
} from "../../services/api/admin.js";

import {
  DataTable,
  EmptyBlock,
  LoadingBlock,
  MetricStrip,
  Notice,
  PageHeader,
  Panel,
  SearchField,
  SecondaryButton,
  SelectField,
  StatusBadge,
} from "../../components/admin/AdminPrimitives.jsx";

/* ========================================================= */
/* HELPERS                                                   */
/* ========================================================= */

function number(
  value
) {
  return Number(
    value ||
      0
  ).toLocaleString(
    "en-ZA"
  );
}

function formatDate(
  value
) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(
      value
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  return date.toLocaleDateString(
    "en-ZA",
    {
      day:
        "2-digit",

      month:
        "short",

      year:
        "numeric",
    }
  );
}

function accountClinic(
  row
) {
  if (
    row.role ===
    "SuperAdmin"
  ) {
    return "System-wide";
  }

  return row.clinicName ||
    "Unassigned";
}

/* ========================================================= */
/* PAGE                                                      */
/* ========================================================= */

export default function ManageStaffPage() {
  const {
    role,
  } =
    useAuth();

  const isClinicAdmin =
    role ===
    "ClinicAdmin";

  const isSuperAdmin =
    role ===
    "SuperAdmin";

  const [
    filter,
    setFilter,
  ] =
    useState(
      "All"
    );

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    staff,
    setStaff,
  ] =
    useState([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    pendingId,
    setPendingId,
  ] =
    useState(null);

  /* ======================================================= */
  /* LOAD                                                    */
  /* ======================================================= */

  const load =
    useCallback(
      async () => {
        try {
          setLoading(
            true
          );

          setError(
            ""
          );

          const result =
            isClinicAdmin
              ? await clinicAdminApi
                  .getStaff(
                    filter
                  )
              : await superAdminAccountsApi
                  .getAccounts(
                    filter
                  );

          setStaff(
            Array.isArray(
              result
            )
              ? result
              : []
          );
        } catch (
          err
        ) {
          setError(
            err?.message ||
              (
                isClinicAdmin
                  ? "Could not load clinic staff accounts."
                  : "Could not load system accounts."
              )
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      [
        filter,
        isClinicAdmin,
      ]
    );

  useEffect(
    () => {
      void load();
    },
    [
      load,
    ]
  );

  /* ======================================================= */
  /* SEARCH                                                  */
  /* ======================================================= */

  const visible =
    useMemo(
      () => {
        const term =
          search
            .trim()
            .toLowerCase();

        if (!term) {
          return staff;
        }

        return staff.filter(
          item =>
            [
              item.fullName,
              item.idNumber,
              item.email,
              item.phoneNumber,
              item.role,
              item.clinicName,
            ]
              .filter(
                Boolean
              )
              .some(
                value =>
                  String(
                    value
                  )
                    .toLowerCase()
                    .includes(
                      term
                    )
              )
        );
      },
      [
        search,
        staff,
      ]
    );

  /* ======================================================= */
  /* METRICS                                                 */
  /* ======================================================= */

  const metrics =
    useMemo(
      () => {
        const active =
          staff.filter(
            item =>
              item.isActive
          ).length;

        if (
          isClinicAdmin
        ) {
          const nurses =
            staff.filter(
              item =>
                item.role ===
                "Nurse"
            ).length;

          const proxies =
            staff.filter(
              item =>
                item.role ===
                "Proxy"
            ).length;

          return [
            {
              label:
                "Visible accounts",

              value:
                number(
                  staff.length
                ),

              helper:
                filter ===
                "All"
                  ? "All clinic staff"
                  : filter,

              icon:
                Users,
            },

            {
              label:
                "Active accounts",

              value:
                number(
                  active
                ),

              helper:
                "Currently enabled",

              icon:
                ShieldCheck,
            },

            {
              label:
                "Nurses",

              value:
                number(
                  nurses
                ),

              helper:
                "Professional staff",

              icon:
                Users,
            },

            {
              label:
                "Proxies",

              value:
                number(
                  proxies
                ),

              helper:
                "Registered proxies",

              icon:
                Users,
            },
          ];
        }

        const verified =
          staff.filter(
            item =>
              item.isVerified
          ).length;

        const passwordSetupPending =
          staff.filter(
            item =>
              item.mustChangePassword
          ).length;

        return [
          {
            label:
              "Visible accounts",

            value:
              number(
                staff.length
              ),

            helper:
              filter ===
              "All"
                ? "System-wide"
                : filter,

            icon:
              Users,
          },

          {
            label:
              "Active accounts",

            value:
              number(
                active
              ),

            helper:
              "Authentication enabled",

            icon:
              ShieldCheck,
          },

          {
            label:
              "Verified accounts",

            value:
              number(
                verified
              ),

            helper:
              "Identity/account verified",

            icon:
              ShieldCheck,
          },

          {
            label:
              "Password setup pending",

            value:
              number(
                passwordSetupPending
              ),

            helper:
              "Temporary credential active",

            icon:
              UserPlus,
          },
        ];
      },
      [
        filter,
        isClinicAdmin,
        staff,
      ]
    );

  /* ======================================================= */
  /* ACTIVATE / DEACTIVATE                                   */
  /* ======================================================= */

  async function toggle(
    item
  ) {
    try {
      setPendingId(
        item.userId
      );

      setError(
        ""
      );

      if (
        isClinicAdmin
      ) {
        if (
          item.isActive
        ) {
          await clinicAdminApi
            .deactivateStaff(
              item.userId
            );
        } else {
          await clinicAdminApi
            .activateStaff(
              item.userId
            );
        }
      } else if (
        item.isActive
      ) {
        await adminApi
          .deactivateAccount(
            item.userId
          );
      } else {
        await adminApi
          .activateAccount(
            item.userId
          );
      }

      setStaff(
        current =>
          current.map(
            row =>
              row.userId ===
              item.userId
                ? {
                    ...row,

                    isActive:
                      !row.isActive,
                  }
                : row
          )
      );
    } catch (
      err
    ) {
      setError(
        err?.message ||
          "Could not update account."
      );
    } finally {
      setPendingId(
        null
      );
    }
  }

  /* ======================================================= */
  /* ROLE OPTIONS                                            */
  /* ======================================================= */

  const roleOptions =
    isClinicAdmin
      ? [
          "All",
          "Nurse",
          "Proxy",
        ]
      : [
          "All",
          "Patient",
          "Nurse",
          "Proxy",
          "ClinicAdmin",
          "SuperAdmin",
        ];

  /* ======================================================= */
  /* CLINIC ADMIN TABLE                                      */
  /* ======================================================= */

  const clinicAdminColumns = [
    {
      key:
        "fullName",

      label:
        "Staff member",

      render:
        (
          value,
          row
        ) => (
          <div>
            <p className="font-semibold text-slate-900">
              {value ||
                "—"}
            </p>

            <p className="mt-0.5 text-[11px] text-slate-400">
              {row.email ||
                "No email"}
            </p>
          </div>
        ),
    },

    {
      key:
        "role",

      label:
        "Role",

      render:
        value => (
          <span className="border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700">
            {value ||
              "—"}
          </span>
        ),
    },

    {
      key:
        "idNumber",

      label:
        "ID number",

      render:
        value => (
          <span className="font-mono text-[11px]">
            {value ||
              "—"}
          </span>
        ),
    },

    {
      key:
        "phoneNumber",

      label:
        "Contact",

      render:
        value =>
          value ||
          "—",
    },

    {
      key:
        "isActive",

      label:
        "Status",

      render:
        value => (
          <StatusBadge
            value={
              value
                ? "Active"
                : "Inactive"
            }
          />
        ),
    },

    {
      key:
        "actions",

      label:
        "Account access",

      render:
        (
          _,
          row
        ) => (
          <button
            type="button"
            disabled={
              pendingId ===
              row.userId
            }
            onClick={
              () =>
                toggle(
                  row
                )
            }
            className={`text-[11px] font-medium hover:underline disabled:opacity-50 ${
              row.isActive
                ? "text-red-600"
                : "text-[#0f766e]"
            }`}
          >
            {pendingId ===
            row.userId
              ? "Updating…"
              : row.isActive
                ? "Deactivate"
                : "Activate"}
          </button>
        ),
    },
  ];

  /* ======================================================= */
  /* SUPER ADMIN TABLE                                       */
  /* ======================================================= */

  const superAdminColumns = [
    {
      key:
        "fullName",

      label:
        "Account",

      render:
        (
          value,
          row
        ) => (
          <div className="min-w-[190px]">
            <p className="font-semibold text-slate-900">
              {value ||
                "—"}
            </p>

            <p className="mt-0.5 text-[11px] text-slate-400">
              {row.email ||
                "No email"}
            </p>
          </div>
        ),
    },

    {
      key:
        "role",

      label:
        "Role",

      render:
        value => (
          <span className="whitespace-nowrap border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700">
            {value ||
              "—"}
          </span>
        ),
    },

    {
      key:
        "clinicName",

      label:
        "Clinic / scope",

      render:
        (
          _,
          row
        ) => (
          <span
            className={
              row.role ===
              "SuperAdmin"
                ? "font-medium text-[#0f766e]"
                : row.clinicName
                  ? "text-slate-800"
                  : "text-amber-700"
            }
          >
            {accountClinic(
              row
            )}
          </span>
        ),
    },

    {
      key:
        "phoneNumber",

      label:
        "Contact",

      render:
        value =>
          value ||
          "—",
    },

    {
      key:
        "idNumber",

      label:
        "ID number",

      render:
        value => (
          <span className="whitespace-nowrap font-mono text-[11px] text-slate-600">
            {value ||
              "—"}
          </span>
        ),
    },

    {
      key:
        "isVerified",

      label:
        "Verification",

      render:
        value => (
          <span
            className={`inline-flex border px-2 py-0.5 text-[10px] font-semibold ${
              value
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-amber-200 bg-amber-50 text-amber-700"
            }`}
          >
            {value
              ? "Verified"
              : "Pending"}
          </span>
        ),
    },

    {
      key:
        "mustChangePassword",

      label:
        "Onboarding",

      render:
        (
          value,
          row
        ) => {
          if (
            !value
          ) {
            return (
              <span className="inline-flex border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                Ready
              </span>
            );
          }

          return (
            <div>
              <span className="inline-flex border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                Password setup pending
              </span>

              <p className="mt-1 text-[10px] text-slate-400">
                First login required
              </p>
            </div>
          );
        },
    },

    {
      key:
        "createdAt",

      label:
        "Created",

      render:
        value => (
          <span className="whitespace-nowrap text-xs text-slate-600">
            {formatDate(
              value
            )}
          </span>
        ),
    },

    {
      key:
        "isActive",

      label:
        "Access",

      render:
        value => (
          <StatusBadge
            value={
              value
                ? "Active"
                : "Inactive"
            }
          />
        ),
    },

    {
      key:
        "actions",

      label:
        "Action",

      render:
        (
          _,
          row
        ) => (
          <button
            type="button"
            disabled={
              pendingId ===
              row.userId
            }
            onClick={
              () =>
                toggle(
                  row
                )
            }
            className={`whitespace-nowrap text-[11px] font-medium hover:underline disabled:opacity-50 ${
              row.isActive
                ? "text-red-600"
                : "text-[#0f766e]"
            }`}
          >
            {pendingId ===
            row.userId
              ? "Updating…"
              : row.isActive
                ? "Deactivate"
                : "Activate"}
          </button>
        ),
    },
  ];

  const columns =
    isClinicAdmin
      ? clinicAdminColumns
      : superAdminColumns;

  /* ======================================================= */
  /* RENDER                                                  */
  /* ======================================================= */

  return (
    <div className="space-y-5">

      <PageHeader
        eyebrow={
          isClinicAdmin
            ? "Clinic workforce"
            : "Administration"
        }
        title={
          isClinicAdmin
            ? "Staff"
            : "Accounts"
        }
        description={
          isClinicAdmin
            ? "Review Nurse and Proxy accounts assigned to your clinic and control account access."
            : "Review account identity, clinic scope, verification, onboarding and access across PhilaLink."
        }
        actions={
          <>
            <SecondaryButton
              onClick={
                load
              }
              disabled={
                loading
              }
            >
              <RefreshCw
                size={15}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </SecondaryButton>

            {isClinicAdmin ? (
              <Link
                to="/admin/register-staff"
                className="inline-flex h-10 items-center justify-center gap-2 bg-[#0f766e] px-4 text-sm font-medium text-white hover:bg-[#0b655e]"
              >
                <UserPlus
                  size={15}
                />

                Register staff
              </Link>
            ) : null}
          </>
        }
      />

      {error ? (
        <Notice type="error">
          {error}
        </Notice>
      ) : null}

      <MetricStrip
        metrics={
          metrics
        }
      />

      <Panel
        title={
          isClinicAdmin
            ? "Staff directory"
            : "System account directory"
        }
        description={
          isClinicAdmin
            ? "Nurses and Proxies assigned to your clinic."
            : "System-wide account information with clinic scope and onboarding state."
        }
        noPadding
      >

        <div className="grid gap-3 border-b border-slate-200 px-5 py-4 lg:grid-cols-[minmax(260px,1fr)_220px_auto] lg:items-end">

          <div>
            <span className="mb-1.5 block text-[11px] font-medium text-slate-600">
              Search
            </span>

            <SearchField
              value={
                search
              }
              onChange={
                event =>
                  setSearch(
                    event.target
                      .value
                  )
              }
              placeholder={
                isClinicAdmin
                  ? "Name, ID, email or phone…"
                  : "Name, ID, email, phone, role or clinic…"
              }
            />
          </div>

          <SelectField
            label="Role"
            value={
              filter
            }
            onChange={
              event =>
                setFilter(
                  event.target
                    .value
                )
            }
            options={
              roleOptions
            }
          />

          <div className="flex h-10 items-center justify-center border border-slate-300 bg-slate-50 px-4 text-xs font-medium text-slate-600">
            {visible.length.toLocaleString(
              "en-ZA"
            )}{" "}
            result
            {visible.length ===
            1
              ? ""
              : "s"}
          </div>

        </div>

        {loading ? (
          <LoadingBlock
            label={
              isClinicAdmin
                ? "Loading staff…"
                : "Loading system accounts…"
            }
            minHeight={
              320
            }
          />
        ) : visible.length ? (
          <DataTable
            columns={
              columns
            }
            rows={
              visible
            }
            rowKey={
              row =>
                row.userId
            }
            maxHeight={
              680
            }
          />
        ) : (
          <div className="p-5">
            <EmptyBlock
              icon={
                Search
              }
              title={
                isClinicAdmin
                  ? "No staff found"
                  : "No accounts found"
              }
              description={
                isClinicAdmin
                  ? "Change the role filter or search term, or register a new Nurse or Proxy account."
                  : "Change the role filter or search term."
              }
            />
          </div>
        )}

      </Panel>

    </div>
  );
}
