import { useState } from "react";
import { Link } from "react-router-dom";
import Card, {
  CardBody,
  CardHeader,
} from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Input, {
  Select,
} from "../../components/ui/Input.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import {
  ErrorState,
  EmptyState,
} from "../../components/ui/EmptyState.jsx";
import StatusChip from "../../components/ui/StatusChip.jsx";
import { useApi } from "../../lib/useApi.js";
import { adminApi } from "../../services/api/admin.js";
import { useToast } from "../../components/ui/Toast.jsx";

export default function ManageStaffPage() {
  const [search, setSearch] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState("All");

  const [pendingId, setPendingId] =
    useState(null);

  const toast = useToast();

  const {
    data: accounts,
    loading,
    error,
    refetch,
    setData,
  } = useApi(
    () =>
      adminApi.listAccounts(),
    []
  );

  const accountList =
    Array.isArray(accounts)
      ? accounts
      : [];

  const searchTerm =
    search.trim().toLowerCase();

  const filtered =
    accountList.filter(
      (account) => {
        const matchesRole =
          roleFilter === "All" ||
          account.role ===
            roleFilter;

        const matchesSearch =
          !searchTerm ||
          [
            account.fullName,
            account.idNumber,
            account.role,
          ]
            .filter(Boolean)
            .some((value) =>
              String(value)
                .toLowerCase()
                .includes(
                  searchTerm
                )
            );

        return (
          matchesRole &&
          matchesSearch
        );
      }
    );

  const toggleActive =
    async (account) => {
      if (!account?.userId) {
        toast.error(
          "This account does not have a valid user ID."
        );
        return;
      }

      setPendingId(
        account.userId
      );

      try {
        if (account.isActive) {
          await adminApi.deactivateAccount(
            account.userId
          );
        } else {
          await adminApi.activateAccount(
            account.userId
          );
        }

        setData((current) =>
          current.map((item) =>
            item.userId ===
            account.userId
              ? {
                  ...item,
                  isActive:
                    !item.isActive,
                }
              : item
          )
        );

        toast.success(
          `${account.fullName} ${
            account.isActive
              ? "deactivated"
              : "activated"
          }.`
        );
      } catch (error) {
        console.error(
          "Failed to update account:",
          error
        );

        toast.error(
          "Couldn't update this account. Please try again."
        );
      } finally {
        setPendingId(null);
      }
    };

  return (
    <Card>
      <CardHeader
        title="Manage staff"
        subtitle={`${filtered.length} account${
          filtered.length === 1
            ? ""
            : "s"
        }`}
        action={
          <Button
            as={Link}
            to="/admin/register-staff"
            size="sm"
            icon="person_add"
          >
            Register staff
          </Button>
        }
      />

      <CardBody className="pt-0">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="Search name or ID number…"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            className="flex-1"
          />

          <Select
            value={roleFilter}
            onChange={(event) =>
              setRoleFilter(
                event.target.value
              )
            }
            className="sm:w-44"
          >
            {[
              "All",
              "Nurse",
              "Proxy",
              "ClinicAdmin",
              "SuperAdmin",
            ].map((role) => (
              <option
                key={role}
                value={role}
              >
                {role ===
                "ClinicAdmin"
                  ? "Clinic Admin"
                  : role ===
                    "SuperAdmin"
                  ? "Super Admin"
                  : role}
              </option>
            ))}
          </Select>
        </div>

        {loading ? (
          <div className="py-10">
            <Spinner label="Loading accounts…" />
          </div>
        ) : error ? (
          <ErrorState
            description={
              error.message
            }
            onRetry={refetch}
          />
        ) : filtered.length ===
          0 ? (
          <EmptyState
            icon="badge"
            title="No accounts found"
            description={
              search ||
              roleFilter !== "All"
                ? "Try changing your search or role filter."
                : "No accounts are currently available."
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-outline-variant/60 text-xs uppercase tracking-wide text-on-surface-variant">
                  <th className="py-2 pr-4 font-medium">
                    Name
                  </th>

                  <th className="py-2 pr-4 font-medium">
                    ID number
                  </th>

                  <th className="py-2 pr-4 font-medium">
                    Role
                  </th>

                  <th className="py-2 pr-4 font-medium">
                    Status
                  </th>

                  <th className="py-2 pr-4 font-medium">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-outline-variant/50">
                {filtered.map(
                  (account) => (
                    <tr
                      key={
                        account.userId
                      }
                    >
                      <td className="py-3 pr-4 font-semibold text-on-surface">
                        {
                          account.fullName
                        }
                      </td>

                      <td className="py-3 pr-4 text-on-surface-variant">
                        {account.idNumber ||
                          "—"}
                      </td>

                      <td className="py-3 pr-4 text-on-surface-variant">
                        {account.role ===
                        "ClinicAdmin"
                          ? "Clinic Admin"
                          : account.role ===
                            "SuperAdmin"
                          ? "Super Admin"
                          : account.role}
                      </td>

                      <td className="py-3 pr-4">
                        <StatusChip
                          tone={
                            account.isActive
                              ? "success-soft"
                              : "neutral"
                          }
                        >
                          {account.isActive
                            ? "Active"
                            : "Deactivated"}
                        </StatusChip>
                      </td>

                      <td className="py-3 pr-4">
                        <button
                          type="button"
                          onClick={() =>
                            toggleActive(
                              account
                            )
                          }
                          disabled={
                            pendingId ===
                            account.userId
                          }
                          className={`text-xs font-semibold hover:underline disabled:cursor-not-allowed disabled:opacity-50 ${
                            account.isActive
                              ? "text-error"
                              : "text-primary"
                          }`}
                        >
                          {pendingId ===
                          account.userId
                            ? "Updating…"
                            : account.isActive
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
      </CardBody>
    </Card>
  );
}