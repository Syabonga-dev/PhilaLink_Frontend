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
  Building2,
  Link2Off,
  RefreshCw,
  Search,
  ShieldCheck,
  UserPlus,
} from "lucide-react";

import {
  AdminModal,
  DataTable,
  DangerButton,
  EmptyBlock,
  LoadingBlock,
  MetricStrip,
  Notice,
  PageHeader,
  Panel,
  PrimaryButton,
  SearchField,
  SecondaryButton,
  SelectField,
  StatusBadge,
} from "../../components/admin/AdminPrimitives.jsx";

import {
  superAdminApi,
} from "../../services/api/superAdmin.js";

export default function ManageClinicAdminsPage() {
  const [
    admins,
    setAdmins,
  ] =
    useState([]);

  const [
    clinics,
    setClinics,
  ] =
    useState([]);

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    assignmentFilter,
    setAssignmentFilter,
  ] =
    useState(
      "All"
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    pending,
    setPending,
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

  const [
    warning,
    setWarning,
  ] =
    useState("");

  const [
    assigning,
    setAssigning,
  ] =
    useState(null);

  const [
    deassigning,
    setDeassigning,
  ] =
    useState(null);

  const [
    selectedClinicId,
    setSelectedClinicId,
  ] =
    useState("");

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

          const [
            adminResult,
            clinicResult,
          ] =
            await Promise.all([
              superAdminApi
                .getClinicAdmins(),

              superAdminApi
                .getClinics(),
            ]);

          setAdmins(
            Array.isArray(
              adminResult
            )
              ? adminResult
              : []
          );

          setClinics(
            Array.isArray(
              clinicResult
            )
              ? clinicResult
              : []
          );
        } catch (
          err
        ) {
          setError(
            err?.message ||
            "Could not load Clinic Administrator assignments."
          );
        } finally {
          setLoading(
            false
          );
        }
      },
      []
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

        return admins.filter(
          admin => {
            const assigned =
              Boolean(
                admin.clinicId
              );

            if (
              assignmentFilter ===
                "Assigned" &&
              !assigned
            ) {
              return false;
            }

            if (
              assignmentFilter ===
                "Unassigned" &&
              assigned
            ) {
              return false;
            }

            if (!term) {
              return true;
            }

            return [
              admin.fullName,
              admin.email,
              admin.phoneNumber,
              admin.clinicName,
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
              );
          }
        );
      },
      [
        admins,
        assignmentFilter,
        search,
      ]
    );

  const activeClinics =
    clinics.filter(
      clinic =>
        clinic.isActive !==
        false
    );

  const metrics =
    useMemo(
      () => {
        const assigned =
          admins.filter(
            admin =>
              admin.clinicId
          ).length;

        const unassigned =
          admins.length -
          assigned;

        const active =
          admins.filter(
            admin =>
              admin.isActive
          ).length;

        return [
          {
            label:
              "Clinic admins",

            value:
              admins.length
                .toLocaleString(
                  "en-ZA"
                ),

            helper:
              "System-wide accounts",

            icon:
              ShieldCheck,
          },

          {
            label:
              "Assigned",

            value:
              assigned
                .toLocaleString(
                  "en-ZA"
                ),

            helper:
              "Attached to a clinic",

            icon:
              Building2,
          },

          {
            label:
              "Unassigned",

            value:
              unassigned
                .toLocaleString(
                  "en-ZA"
                ),

            helper:
              "No clinic access",

            icon:
              Link2Off,
          },

          {
            label:
              "Active accounts",

            value:
              active
                .toLocaleString(
                  "en-ZA"
                ),

            helper:
              "Authentication enabled",

            icon:
              ShieldCheck,
          },
        ];
      },
      [
        admins,
      ]
    );

  function clearMessages() {
    setError(
      ""
    );

    setSuccess(
      ""
    );

    setWarning(
      ""
    );
  }

  function beginAssign(
    admin
  ) {
    clearMessages();

    setAssigning(
      admin
    );

    setSelectedClinicId(
      admin.clinicId ||
      ""
    );
  }

  function updateAdmin(
    updated
  ) {
    setAdmins(
      current =>
        current.map(
          item =>
            item.userId ===
            updated.userId
              ? {
                  ...item,
                  ...updated,
                }
              : item
        )
    );
  }

  function handleNotificationResult(
    updated,
    actionText
  ) {
    if (
      updated
        ?.notificationEmailSent ===
      false
    ) {
      setSuccess(
        actionText
      );

      setWarning(
        updated
          ?.notificationEmailMessage ||
        "The assignment was saved, but the notification email could not be delivered."
      );

      return;
    }

    setSuccess(
      updated
        ?.notificationEmailMessage
        ? `${actionText} ${updated.notificationEmailMessage}`
        : actionText
    );
  }

  async function saveAssignment(
    event
  ) {
    event.preventDefault();

    if (
      !assigning ||
      !selectedClinicId
    ) {
      setError(
        "Select an active clinic."
      );

      return;
    }

    try {
      setPending(
        true
      );

      clearMessages();

      const updated =
        await superAdminApi
          .assignClinicAdmin(
            assigning.userId,
            selectedClinicId
          );

      updateAdmin(
        updated
      );

      handleNotificationResult(
        updated,
        `${updated.fullName} is now assigned to ${updated.clinicName}.`
      );

      setAssigning(
        null
      );

      setSelectedClinicId(
        ""
      );
    } catch (
      err
    ) {
      setError(
        err?.message ||
        "Could not assign the Clinic Administrator."
      );
    } finally {
      setPending(
        false
      );
    }
  }

  async function confirmDeassign() {
    if (
      !deassigning
    ) {
      return;
    }

    try {
      setPending(
        true
      );

      clearMessages();

      const updated =
        await superAdminApi
          .deassignClinicAdmin(
            deassigning
              .userId
          );

      updateAdmin(
        updated
      );

      handleNotificationResult(
        updated,
        `${updated.fullName} has been deassigned from the clinic.`
      );

      setDeassigning(
        null
      );
    } catch (
      err
    ) {
      setError(
        err?.message ||
        "Could not deassign the Clinic Administrator."
      );
    } finally {
      setPending(
        false
      );
    }
  }

  const columns = [
    {
      key:
        "fullName",

      label:
        "Clinic administrator",

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
        "phoneNumber",

      label:
        "Phone",
    },

    {
      key:
        "clinicName",

      label:
        "Assigned clinic",

      render:
        (
          value,
          row
        ) =>
          row.clinicId ? (
            <span className="font-medium text-slate-800">
              {value ||
                "Clinic"}
            </span>
          ) : (
            <span className="text-amber-700">
              Unassigned
            </span>
          ),
    },

    {
      key:
        "isActive",

      label:
        "Account",

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
        "assignment",

      label:
        "Assignment",

      render:
        (
          _,
          row
        ) => (
          <StatusBadge
            value={
              row.clinicId
                ? "Assigned"
                : "Unassigned"
            }
          />
        ),
    },

    {
      key:
        "actions",

      label:
        "Actions",

      render:
        (
          _,
          row
        ) => (
          <div className="flex flex-wrap gap-2">

            <button
              type="button"
              onClick={() =>
                beginAssign(
                  row
                )
              }
              className="border border-slate-300 bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
            >
              {row.clinicId
                ? "Reassign"
                : "Assign"}
            </button>

            {row.clinicId ? (
              <button
                type="button"
                onClick={() => {
                  clearMessages();

                  setDeassigning(
                    row
                  );
                }}
                className="border border-red-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-red-700 hover:bg-red-50"
              >
                Deassign
              </button>
            ) : null}

          </div>
        ),
    },
  ];

  return (
    <div className="space-y-5">

      <PageHeader
        eyebrow="Administration"
        title="Clinic administrators"
        description="Assign, reassign or deassign Clinic Administrator accounts. PhilaLink emails each assignment change directly to the affected administrator."
        actions={
          <>
            <Link
              to="/admin/register-clinic-admin"
              className="inline-flex h-10 items-center justify-center gap-2 bg-[#0f766e] px-4 text-sm font-medium text-white hover:bg-[#0b655e]"
            >
              <UserPlus
                size={15}
              />

              Register clinic admin
            </Link>

            <SecondaryButton
              type="button"
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
          </>
        }
      />

      {error ? (
        <Notice type="error">
          {error}
        </Notice>
      ) : null}

      {success ? (
        <Notice type="success">
          {success}
        </Notice>
      ) : null}

      {warning ? (
        <Notice type="warning">
          {warning}
        </Notice>
      ) : null}

      <MetricStrip
        metrics={
          metrics
        }
      />

      <Panel
        title="Assignments"
        description={`${visible.length.toLocaleString(
          "en-ZA"
        )} visible Clinic Administrator account${
          visible.length ===
          1
            ? ""
            : "s"
        }.`}
        noPadding
      >

        <div className="grid gap-3 border-b border-slate-200 px-5 py-4 md:grid-cols-[minmax(0,1fr)_220px]">

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
            placeholder="Name, email, phone or clinic…"
          />

          <SelectField
            value={
              assignmentFilter
            }
            onChange={
              event =>
                setAssignmentFilter(
                  event.target
                    .value
                )
            }
            options={[
              "All",
              "Assigned",
              "Unassigned",
            ]}
          />

        </div>

        {loading ? (
          <LoadingBlock
            label="Loading Clinic Administrators…"
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
              title="No Clinic Administrators found"
              description="Change the search or assignment filter, or register a new Clinic Administrator."
            />
          </div>
        )}

      </Panel>

      {assigning ? (
        <AdminModal
          title={
            assigning.clinicId
              ? "Reassign Clinic Administrator"
              : "Assign Clinic Administrator"
          }
          description={`${assigning.fullName} will receive clinic-scoped administrator access to the selected clinic. The change will also be emailed to ${assigning.email}.`}
          onClose={() => {
            if (
              !pending
            ) {
              setAssigning(
                null
              );

              setSelectedClinicId(
                ""
              );
            }
          }}
        >

          <form
            onSubmit={
              saveAssignment
            }
            className="space-y-4 p-5"
          >

            <SelectField
              label="Clinic"
              value={
                selectedClinicId
              }
              onChange={
                event =>
                  setSelectedClinicId(
                    event.target
                      .value
                  )
              }
            >

              <option value="">
                Select active clinic
              </option>

              {activeClinics.map(
                clinic => (
                  <option
                    key={
                      clinic.id
                    }
                    value={
                      clinic.id
                    }
                  >
                    {clinic.name}
                  </option>
                )
              )}

            </SelectField>

            <Notice type="info">
              Reassignment immediately changes the clinic boundary used by Clinic Administrator endpoints. The administrator will receive an email confirming the change.
            </Notice>

            <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">

              <SecondaryButton
                type="button"
                onClick={() => {
                  setAssigning(
                    null
                  );

                  setSelectedClinicId(
                    ""
                  );
                }}
                disabled={
                  pending
                }
              >
                Cancel
              </SecondaryButton>

              <PrimaryButton
                type="submit"
                disabled={
                  pending ||
                  !selectedClinicId
                }
              >
                {pending
                  ? "Saving…"
                  : "Save assignment"}
              </PrimaryButton>

            </div>

          </form>

        </AdminModal>
      ) : null}

      {deassigning ? (
        <AdminModal
          title="Deassign Clinic Administrator"
          description="Remove this account's clinic assignment without deleting the account."
          onClose={() => {
            if (
              !pending
            ) {
              setDeassigning(
                null
              );
            }
          }}
        >

          <div className="space-y-4 p-5">

            <Notice type="warning">
              {deassigning.fullName} will lose clinic-scoped administration access to {deassigning.clinicName || "the current clinic"}. PhilaLink will email this change to {deassigning.email}.
            </Notice>

            <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">

              <SecondaryButton
                type="button"
                onClick={() =>
                  setDeassigning(
                    null
                  )
                }
                disabled={
                  pending
                }
              >
                Cancel
              </SecondaryButton>

              <DangerButton
                type="button"
                onClick={
                  confirmDeassign
                }
                disabled={
                  pending
                }
              >
                <Link2Off
                  size={15}
                />

                {pending
                  ? "Deassigning…"
                  : "Deassign"}
              </DangerButton>

            </div>

          </div>

        </AdminModal>
      ) : null}

    </div>
  );
}
