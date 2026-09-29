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

export default function ManageStaffPage() {
  const {
    role,
  } =
    useAuth();

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
    useState(
      ""
    );

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
        staff,
        search,
      ]
    );

  async function toggle(
    item
  ) {
    try {
      setPendingId(
        item.userId
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

  const filters =
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

  return (
    <div className="space-y-5">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-violet-600">
            Workforce
          </p>

          <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Staff management
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Review and manage clinic account access.
          </p>

        </div>

        <Link
          to="/admin/register-staff"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#6d28d9] px-4 py-2.5 text-xs font-bold text-white"
        >
          <UserPlus
            size={15}
          />
          Register staff
        </Link>

      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="rounded-[28px] border border-slate-200 bg-white p-4 sm:p-5">

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

          <div className="relative w-full lg:max-w-sm">

            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
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
              placeholder="Search staff..."
              className="w-full rounded-2xl border border-slate-200 py-2.5 pl-10 pr-4 text-xs outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
            />

          </div>

          <div className="flex flex-wrap gap-2">

            {filters.map(
              item => (
                <button
                  key={
                    item
                  }
                  type="button"
                  onClick={() =>
                    setFilter(
                      item
                    )
                  }
                  className={`rounded-full px-3.5 py-2 text-[10px] font-bold ${
                    filter ===
                    item
                      ? "bg-[#6d28d9] text-white"
                      : "border border-slate-200 text-slate-500"
                  }`}
                >
                  {item}
                </button>
              )
            )}

            <button
              type="button"
              onClick={
                load
              }
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500"
            >
              <RefreshCw
                size={13}
              />
            </button>

          </div>

        </div>

      </section>

      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white">

        {loading ? (
          <div className="p-12 text-center text-sm text-slate-400">
            Loading staff…
          </div>
        ) : visible.length ===
          0 ? (
          <div className="p-12 text-center">

            <Users
              size={28}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 text-sm font-bold text-slate-800">
              No staff found
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px] text-left">

              <thead className="bg-[#fafafd] text-[10px] uppercase tracking-wider text-slate-400">

                <tr>

                  <th className="px-5 py-4">
                    Staff member
                  </th>

                  <th className="px-5 py-4">
                    Role
                  </th>

                  <th className="px-5 py-4">
                    ID number
                  </th>

                  <th className="px-5 py-4">
                    Contact
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>

                  <th className="px-5 py-4">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {visible.map(
                  item => (
                    <tr
                      key={
                        item.userId
                      }
                      className="hover:bg-slate-50/60"
                    >

                      <td className="px-5 py-4">

                        <p className="text-xs font-bold text-slate-900">
                          {
                            item.fullName
                          }
                        </p>

                        <p className="mt-1 text-[10px] text-slate-400">
                          {
                            item.email ||
                            "—"
                          }
                        </p>

                      </td>

                      <td className="px-5 py-4">

                        <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-bold text-violet-700">
                          {
                            item.role
                          }
                        </span>

                      </td>

                      <td className="px-5 py-4 font-mono text-[11px] text-slate-500">
                        {
                          item.idNumber ||
                          "—"
                        }
                      </td>

                      <td className="px-5 py-4 text-xs text-slate-500">
                        {
                          item.phoneNumber ||
                          "—"
                        }
                      </td>

                      <td className="px-5 py-4">

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                            item.isActive
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {item.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </td>

                      <td className="px-5 py-4">

                        <button
                          type="button"
                          disabled={
                            pendingId ===
                            item.userId
                          }
                          onClick={() =>
                            toggle(
                              item
                            )
                          }
                          className={`text-[10px] font-bold hover:underline disabled:opacity-50 ${
                            item.isActive
                              ? "text-rose-600"
                              : "text-teal-700"
                          }`}
                        >
                          {pendingId ===
                          item.userId
                            ? "Updating…"
                            : item.isActive
                              ? "Deactivate"
                              : "Activate"}
                        </button>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </section>

    </div>
  );
}