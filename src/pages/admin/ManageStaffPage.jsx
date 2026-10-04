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
  UserPlus,
  Users,
} from "lucide-react";

import {
  useAuth,
} from "../../context/AuthContext.jsx";

import {
  adminApi,
} from "../../services/api/admin.js";

import {
  clinicAdminApi,
} from "../../services/api/clinicAdmin.js";

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

export default function ManageStaffPage() {
  const {
    role,
  } =
    useAuth();

  const [
    filter,
    setFilter,
  ] =
    useState("All");

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
            role ===
            "ClinicAdmin"
              ? await clinicAdminApi
                  .getStaff(
                    filter
                  )
              : await adminApi
                  .listAccounts(
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
            "Could not load staff accounts."
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      [
        role,
        filter,
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

  const metrics =
    useMemo(
      () => {
        const active =
          staff.filter(
            item =>
              item.isActive
          ).length;

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
                ? "All roles"
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
              Users,
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
              "Registered proxy accounts",

            icon:
              Users,
          },
        ];
      },
      [
        filter,
        staff,
      ]
    );

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
        role ===
        "ClinicAdmin"
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

  const roleOptions =
    role ===
    "ClinicAdmin"
      ? [
          "All",
          "Nurse",
          "Proxy",
        ]
      : [
          "All",
          "Nurse",
          "Proxy",
          "Patient",
          "ClinicAdmin",
          "SuperAdmin",
        ];

  const columns = [
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

  return (
    <div className="space-y-5">

      <PageHeader
        eyebrow={
          role ===
          "ClinicAdmin"
            ? "Clinic workforce"
            : "Administration"
        }
        title={
          role ===
          "ClinicAdmin"
            ? "Staff"
            : "Accounts"
        }
        description={
          role ===
          "ClinicAdmin"
            ? "Review Nurse and Proxy accounts assigned to your clinic and control account access."
            : "Review administrative and service accounts across PhilaLink."
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

            {role ===
            "ClinicAdmin" ? (
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
          role ===
          "ClinicAdmin"
            ? "Staff directory"
            : "Account directory"
        }
        description={
          role ===
          "ClinicAdmin"
            ? "Filter Nurses and Proxies assigned to your clinic."
            : "Filter system accounts by role or search identifying and contact details."
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
              placeholder="Name, ID, email or phone…"
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
              role ===
              "ClinicAdmin"
                ? "Loading staff…"
                : "Loading accounts…"
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
              650
            }
          />
        ) : (
          <div className="p-5">
            <EmptyBlock
              icon={
                Search
              }
              title={
                role ===
                "ClinicAdmin"
                  ? "No staff found"
                  : "No accounts found"
              }
              description={
                role ===
                "ClinicAdmin"
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
