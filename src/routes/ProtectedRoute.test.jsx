import {
  render,
  screen,
} from "@testing-library/react";

import {
  MemoryRouter,
  Route,
  Routes,
} from "react-router-dom";

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  ProtectedRoute,
  RoleRoute,
  PasswordChangeRoute,
  homePathForRole,
} from "./ProtectedRoute.jsx";

/*
 * Keep authentication completely deterministic.
 *
 * These tests are about routing behaviour, not API calls or
 * AuthProvider internals, so useAuth is mocked at the module
 * boundary.
 */
const authMock =
  vi.hoisted(
    () => ({
      state: {
        isAuthenticated:
          false,

        isLoading:
          false,

        mustChangePassword:
          false,

        role:
          null,
      },
    })
  );

vi.mock(
  "../context/AuthContext.jsx",
  () => ({
    useAuth:
      () =>
        authMock.state,
  })
);

function setAuth({
  isAuthenticated =
    true,

  isLoading =
    false,

  mustChangePassword =
    false,

  role =
    "Patient",
} = {}) {
  authMock.state = {
    isAuthenticated,
    isLoading,
    mustChangePassword,
    role,
  };
}

function renderProtectedRoute(
  initialPath =
    "/patient"
) {
  return render(
    <MemoryRouter
      initialEntries={[
        initialPath,
      ]}
    >
      <Routes>
        <Route
          path="/login"
          element={
            <div>
              Login destination
            </div>
          }
        />

        <Route
          path="/change-password"
          element={
            <div>
              Change password destination
            </div>
          }
        />

        <Route
          element={
            <ProtectedRoute />
          }
        >
          <Route
            path="/patient"
            element={
              <div>
                Protected patient content
              </div>
            }
          />

          <Route
            path="/nurse"
            element={
              <div>
                Protected nurse content
              </div>
            }
          />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

function renderRoleRoute({
  role =
    "Patient",

  allow = [
    "Patient",
  ],

  initialPath =
    "/restricted",

  mustChangePassword =
    false,
} = {}) {
  setAuth({
    role,
    mustChangePassword,
  });

  return render(
    <MemoryRouter
      initialEntries={[
        initialPath,
      ]}
    >
      <Routes>
        <Route
          path="/change-password"
          element={
            <div>
              Change password destination
            </div>
          }
        />

        <Route
          path="/patient"
          element={
            <div>
              Patient home
            </div>
          }
        />

        <Route
          path="/nurse"
          element={
            <div>
              Nurse home
            </div>
          }
        />

        <Route
          path="/proxy"
          element={
            <div>
              Proxy home
            </div>
          }
        />

        <Route
          path="/admin"
          element={
            <div>
              Admin home
            </div>
          }
        />

        <Route
          element={
            <RoleRoute
              allow={
                allow
              }
            />
          }
        >
          <Route
            path="/restricted"
            element={
              <div>
                Allowed role content
              </div>
            }
          />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

function renderPasswordChangeRoute({
  role =
    "Patient",

  isAuthenticated =
    true,

  mustChangePassword =
    true,
} = {}) {
  setAuth({
    role,
    isAuthenticated,
    mustChangePassword,
  });

  return render(
    <MemoryRouter
      initialEntries={[
        "/change-password",
      ]}
    >
      <Routes>
        <Route
          path="/login"
          element={
            <div>
              Login destination
            </div>
          }
        />

        <Route
          path="/patient"
          element={
            <div>
              Patient home
            </div>
          }
        />

        <Route
          path="/nurse"
          element={
            <div>
              Nurse home
            </div>
          }
        />

        <Route
          path="/proxy"
          element={
            <div>
              Proxy home
            </div>
          }
        />

        <Route
          path="/admin"
          element={
            <div>
              Admin home
            </div>
          }
        />

        <Route
          element={
            <ProtectedRoute />
          }
        >
          <Route
            element={
              <PasswordChangeRoute />
            }
          >
            <Route
              path="/change-password"
              element={
                <div>
                  Password change form
                </div>
              }
            />
          </Route>
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe(
  "ProtectedRoute",
  () => {
    beforeEach(() => {
      setAuth({
        isAuthenticated:
          false,

        isLoading:
          false,

        mustChangePassword:
          false,

        role:
          null,
      });
    });

    it(
      "redirects unauthenticated users to login",
      () => {
        renderProtectedRoute();

        expect(
          screen.getByText(
            "Login destination"
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "shows the session loading state while authentication is being checked",
      () => {
        setAuth({
          isAuthenticated:
            false,

          isLoading:
            true,

          role:
            null,
        });

        renderProtectedRoute();

        expect(
          screen.getByText(
            "Checking your session…"
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "renders protected content for an authenticated user",
      () => {
        setAuth({
          role:
            "Patient",
        });

        renderProtectedRoute();

        expect(
          screen.getByText(
            "Protected patient content"
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "forces temporary-password users to the password-change route",
      () => {
        setAuth({
          role:
            "Patient",

          mustChangePassword:
            true,
        });

        renderProtectedRoute();

        expect(
          screen.getByText(
            "Change password destination"
          )
        ).toBeInTheDocument();
      }
    );
  }
);

describe(
  "RoleRoute",
  () => {
    it(
      "renders the route when the current role is allowed",
      () => {
        renderRoleRoute({
          role:
            "Patient",

          allow: [
            "Patient",
          ],
        });

        expect(
          screen.getByText(
            "Allowed role content"
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "redirects a Nurse away from a Patient-only route",
      () => {
        renderRoleRoute({
          role:
            "Nurse",

          allow: [
            "Patient",
          ],
        });

        expect(
          screen.getByText(
            "Nurse home"
          )
        ).toBeInTheDocument();

        expect(
          screen.queryByText(
            "Allowed role content"
          )
        ).not
          .toBeInTheDocument();
      }
    );

    it(
      "redirects a Patient away from an Admin-only route",
      () => {
        renderRoleRoute({
          role:
            "Patient",

          allow: [
            "ClinicAdmin",
            "SuperAdmin",
          ],
        });

        expect(
          screen.getByText(
            "Patient home"
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "allows ClinicAdmin on shared Admin routes",
      () => {
        renderRoleRoute({
          role:
            "ClinicAdmin",

          allow: [
            "ClinicAdmin",
            "SuperAdmin",
          ],
        });

        expect(
          screen.getByText(
            "Allowed role content"
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "allows SuperAdmin on shared Admin routes",
      () => {
        renderRoleRoute({
          role:
            "SuperAdmin",

          allow: [
            "ClinicAdmin",
            "SuperAdmin",
          ],
        });

        expect(
          screen.getByText(
            "Allowed role content"
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "sends temporary-password users to password change before checking role access",
      () => {
        renderRoleRoute({
          role:
            "Nurse",

          allow: [
            "Nurse",
          ],

          mustChangePassword:
            true,
        });

        expect(
          screen.getByText(
            "Change password destination"
          )
        ).toBeInTheDocument();

        expect(
          screen.queryByText(
            "Allowed role content"
          )
        ).not
          .toBeInTheDocument();
      }
    );
  }
);

describe(
  "PasswordChangeRoute",
  () => {
    it(
      "allows a temporary-password user to access password change",
      () => {
        renderPasswordChangeRoute({
          role:
            "Nurse",

          mustChangePassword:
            true,
        });

        expect(
          screen.getByText(
            "Password change form"
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "redirects an unauthenticated user to login",
      () => {
        renderPasswordChangeRoute({
          isAuthenticated:
            false,

          role:
            null,

          mustChangePassword:
            false,
        });

        expect(
          screen.getByText(
            "Login destination"
          )
        ).toBeInTheDocument();
      }
    );

    it(
      "redirects a user who already changed their password back to their role home",
      () => {
        renderPasswordChangeRoute({
          role:
            "Nurse",

          mustChangePassword:
            false,
        });

        expect(
          screen.getByText(
            "Nurse home"
          )
        ).toBeInTheDocument();
      }
    );
  }
);

describe(
  "homePathForRole",
  () => {
    it.each([
      [
        "Patient",
        "/patient",
      ],

      [
        "Nurse",
        "/nurse",
      ],

      [
        "Proxy",
        "/proxy",
      ],

      [
        "ClinicAdmin",
        "/admin",
      ],

      [
        "SuperAdmin",
        "/admin",
      ],

      [
        undefined,
        "/login",
      ],
    ])(
      "maps %s to %s",
      (
        role,
        expectedPath
      ) => {
        expect(
          homePathForRole(
            role
          )
        ).toBe(
          expectedPath
        );
      }
    );
  }
);
