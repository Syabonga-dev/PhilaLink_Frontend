import {
  act,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import {
  MemoryRouter,
  useLocation,
} from "react-router-dom";

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

/*
 * All external authentication dependencies are mocked.
 *
 * These tests exercise AuthProvider itself rather than making
 * real HTTP requests or writing real authentication state.
 */
const mocks =
  vi.hoisted(() => {
    class MockApiError
      extends Error {
      constructor(
        message,
        {
          status,
          errors,
          isNetworkError =
            false,
        } = {}
      ) {
        super(message);

        this.name =
          "ApiError";

        this.status =
          status;

        this.errors =
          errors ??
          null;

        this.isNetworkError =
          isNetworkError;
      }
    }

    return {
      authLogin:
        vi.fn(),

      authGetMe:
        vi.fn(),

      authChangePassword:
        vi.fn(),

      authRegisterPatient:
        vi.fn(),

      authVerifyPhone:
        vi.fn(),

      tokenGetToken:
        vi.fn(),

      tokenGetUser:
        vi.fn(),

      tokenSetSession:
        vi.fn(),

      tokenSetUser:
        vi.fn(),

      tokenClear:
        vi.fn(),

      registerUnauthorizedHandler:
        vi.fn(),

      unauthorizedHandler:
        null,

      ApiError:
        MockApiError,
    };
  });

vi.mock(
  "../services/api/auth.js",
  () => ({
    authApi: {
      login:
        mocks.authLogin,

      getMe:
        mocks.authGetMe,

      changePassword:
        mocks.authChangePassword,

      registerPatient:
        mocks.authRegisterPatient,

      verifyPhone:
        mocks.authVerifyPhone,
    },
  })
);

vi.mock(
  "../services/api/client.js",
  () => ({
    tokenStore: {
      getToken:
        mocks.tokenGetToken,

      getUser:
        mocks.tokenGetUser,

      setSession:
        mocks.tokenSetSession,

      setUser:
        mocks.tokenSetUser,

      clear:
        mocks.tokenClear,
    },

    registerUnauthorizedHandler:
      mocks.registerUnauthorizedHandler,

    ApiError:
      mocks.ApiError,
  })
);

import {
  AuthProvider,
  useAuth,
} from "./AuthContext.jsx";

let latestAuth =
  null;

function AuthProbe() {
  latestAuth =
    useAuth();

  const location =
    useLocation();

  return (
    <div>
      <div
        data-testid="authenticated"
      >
        {String(
          latestAuth
            .isAuthenticated
        )}
      </div>

      <div
        data-testid="loading"
      >
        {String(
          latestAuth
            .isLoading
        )}
      </div>

      <div
        data-testid="role"
      >
        {latestAuth.role ??
          ""}
      </div>

      <div
        data-testid="must-change-password"
      >
        {String(
          latestAuth
            .mustChangePassword
        )}
      </div>

      <div
        data-testid="user-name"
      >
        {latestAuth.user
          ?.fullName ??
          ""}
      </div>

      <div
        data-testid="pathname"
      >
        {location.pathname}
      </div>
    </div>
  );
}

function renderAuth(
  initialPath =
    "/patient"
) {
  return render(
    <MemoryRouter
      initialEntries={[
        initialPath,
      ]}
    >
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    </MemoryRouter>
  );
}

async function
  waitForBootstrap() {
  await waitFor(() => {
    expect(
      screen.getByTestId(
        "loading"
      )
    ).toHaveTextContent(
      "false"
    );
  });
}

function patientUser(
  overrides = {}
) {
  return {
    id:
      "patient-user-id",

    fullName:
      "Patient One",

    role:
      "Patient",

    mustChangePassword:
      false,

    ...overrides,
  };
}

describe(
  "AuthProvider bootstrap",
  () => {
    beforeEach(() => {
      latestAuth =
        null;

      mocks
        .authLogin
        .mockReset();

      mocks
        .authGetMe
        .mockReset();

      mocks
        .authChangePassword
        .mockReset();

      mocks
        .authRegisterPatient
        .mockReset();

      mocks
        .authVerifyPhone
        .mockReset();

      mocks
        .tokenGetToken
        .mockReset();

      mocks
        .tokenGetUser
        .mockReset();

      mocks
        .tokenSetSession
        .mockReset();

      mocks
        .tokenSetUser
        .mockReset();

      mocks
        .tokenClear
        .mockReset();

      mocks
        .registerUnauthorizedHandler
        .mockReset();

      mocks
        .tokenGetToken
        .mockReturnValue(
          null
        );

      mocks
        .tokenGetUser
        .mockReturnValue(
          null
        );

      mocks
        .registerUnauthorizedHandler
        .mockImplementation(
          handler => {
            mocks
              .unauthorizedHandler =
              handler;
          }
        );

      mocks
        .unauthorizedHandler =
        null;
    });

    it(
      "starts unauthenticated when there is no stored token",
      async () => {
        renderAuth();

        await waitForBootstrap();

        expect(
          mocks.tokenClear
        ).toHaveBeenCalled();

        expect(
          mocks.authGetMe
        ).not
          .toHaveBeenCalled();

        expect(
          screen.getByTestId(
            "authenticated"
          )
        ).toHaveTextContent(
          "false"
        );

        expect(
          screen.getByTestId(
            "role"
          )
        ).toHaveTextContent(
          ""
        );
      }
    );

    it(
      "validates a stored token with the backend and refreshes cached user information",
      async () => {
        const cachedUser =
          patientUser({
            fullName:
              "Cached Patient",
          });

        const serverUser =
          patientUser({
            fullName:
              "Current Patient",
          });

        mocks
          .tokenGetToken
          .mockReturnValue(
            "existing-token"
          );

        mocks
          .tokenGetUser
          .mockReturnValue(
            cachedUser
          );

        mocks
          .authGetMe
          .mockResolvedValue(
            serverUser
          );

        renderAuth();

        await waitFor(() => {
          expect(
            screen.getByTestId(
              "authenticated"
            )
          ).toHaveTextContent(
            "true"
          );
        });

        expect(
          mocks.authGetMe
        ).toHaveBeenCalledTimes(
          1
        );

        expect(
          mocks.tokenSetUser
        ).toHaveBeenCalledWith(
          serverUser
        );

        expect(
          screen.getByTestId(
            "user-name"
          )
        ).toHaveTextContent(
          "Current Patient"
        );

        expect(
          screen.getByTestId(
            "role"
          )
        ).toHaveTextContent(
          "Patient"
        );
      }
    );

    it(
      "keeps the cached authenticated session when backend validation fails transiently",
      async () => {
        const cachedUser =
          patientUser({
            fullName:
              "Cached Patient",
          });

        mocks
          .tokenGetToken
          .mockReturnValue(
            "existing-token"
          );

        mocks
          .tokenGetUser
          .mockReturnValue(
            cachedUser
          );

        mocks
          .authGetMe
          .mockRejectedValue(
            new Error(
              "Backend temporarily unavailable"
            )
          );

        renderAuth();

        await waitFor(() => {
          expect(
            screen.getByTestId(
              "authenticated"
            )
          ).toHaveTextContent(
            "true"
          );
        });

        expect(
          screen.getByTestId(
            "user-name"
          )
        ).toHaveTextContent(
          "Cached Patient"
        );

        /*
         * A Render cold start/network/server failure must not
         * destroy the locally cached session.
         */
        expect(
          mocks.tokenClear
        ).not
          .toHaveBeenCalled();
      }
    );

    it(
      "clears the stored session when backend validation returns 401",
      async () => {
        const cachedUser =
          patientUser();

        mocks
          .tokenGetToken
          .mockReturnValue(
            "expired-token"
          );

        mocks
          .tokenGetUser
          .mockReturnValue(
            cachedUser
          );

        mocks
          .authGetMe
          .mockRejectedValue(
            new mocks.ApiError(
              "Session expired",
              {
                status:
                  401,
              }
            )
          );

        renderAuth();

        await waitForBootstrap();

        expect(
          mocks.tokenClear
        ).toHaveBeenCalled();

        expect(
          screen.getByTestId(
            "authenticated"
          )
        ).toHaveTextContent(
          "false"
        );

        expect(
          screen.getByTestId(
            "user-name"
          )
        ).toHaveTextContent(
          ""
        );
      }
    );

    it(
      "does not build an authenticated UI when a token exists but no user can be confirmed",
      async () => {
        mocks
          .tokenGetToken
          .mockReturnValue(
            "existing-token"
          );

        mocks
          .tokenGetUser
          .mockReturnValue(
            null
          );

        mocks
          .authGetMe
          .mockRejectedValue(
            new Error(
              "Temporary backend failure"
            )
          );

        renderAuth();

        await waitForBootstrap();

        expect(
          screen.getByTestId(
            "authenticated"
          )
        ).toHaveTextContent(
          "false"
        );

        /*
         * AuthContext intentionally preserves the token in this
         * transient-error case rather than deleting it.
         */
        expect(
          mocks.tokenClear
        ).not
          .toHaveBeenCalled();
      }
    );
  }
);

describe(
  "AuthProvider authentication actions",
  () => {
    beforeEach(() => {
      latestAuth =
        null;

      mocks
        .authLogin
        .mockReset();

      mocks
        .authGetMe
        .mockReset();

      mocks
        .authChangePassword
        .mockReset();

      mocks
        .tokenGetToken
        .mockReset();

      mocks
        .tokenGetUser
        .mockReset();

      mocks
        .tokenSetSession
        .mockReset();

      mocks
        .tokenSetUser
        .mockReset();

      mocks
        .tokenClear
        .mockReset();

      mocks
        .registerUnauthorizedHandler
        .mockReset();

      mocks
        .tokenGetToken
        .mockReturnValue(
          null
        );

      mocks
        .tokenGetUser
        .mockReturnValue(
          null
        );

      mocks
        .registerUnauthorizedHandler
        .mockImplementation(
          handler => {
            mocks
              .unauthorizedHandler =
              handler;
          }
        );

      mocks
        .unauthorizedHandler =
        null;
    });

    it(
      "stores the token and user after successful login",
      async () => {
        const loggedInUser =
          patientUser();

        mocks
          .authLogin
          .mockResolvedValue({
            token:
              "new-login-token",

            user:
              loggedInUser,
          });

        renderAuth(
          "/login"
        );

        await waitForBootstrap();

        let returnedUser;

        await act(
          async () => {
            returnedUser =
              await latestAuth
                .login({
                  idNumber:
                    "9001015000000",

                  password:
                    "Password1!",
                });
          }
        );

        expect(
          mocks.authLogin
        ).toHaveBeenCalledWith({
          idNumber:
            "9001015000000",

          password:
            "Password1!",
        });

        expect(
          mocks.tokenSetSession
        ).toHaveBeenCalledWith({
          token:
            "new-login-token",

          user:
            loggedInUser,
        });

        expect(
          returnedUser
        ).toEqual(
          loggedInUser
        );

        expect(
          screen.getByTestId(
            "authenticated"
          )
        ).toHaveTextContent(
          "true"
        );

        expect(
          screen.getByTestId(
            "role"
          )
        ).toHaveTextContent(
          "Patient"
        );
      }
    );

    it(
      "exposes forced-password state immediately after temporary-password login",
      async () => {
        const workforceUser = {
          id:
            "nurse-user-id",

          fullName:
            "Nurse One",

          role:
            "Nurse",

          mustChangePassword:
            true,
        };

        mocks
          .authLogin
          .mockResolvedValue({
            token:
              "temporary-login-token",

            user:
              workforceUser,
          });

        renderAuth(
          "/login"
        );

        await waitForBootstrap();

        await act(
          async () => {
            await latestAuth
              .login({
                idNumber:
                  "9001015000001",

                password:
                  "Temporary1!",
              });
          }
        );

        expect(
          screen.getByTestId(
            "authenticated"
          )
        ).toHaveTextContent(
          "true"
        );

        expect(
          screen.getByTestId(
            "role"
          )
        ).toHaveTextContent(
          "Nurse"
        );

        expect(
          screen.getByTestId(
            "must-change-password"
          )
        ).toHaveTextContent(
          "true"
        );
      }
    );

    it(
      "replaces the session after mandatory password change",
      async () => {
        const temporaryUser = {
          id:
            "nurse-user-id",

          fullName:
            "Nurse One",

          role:
            "Nurse",

          mustChangePassword:
            true,
        };

        const completedUser = {
          ...temporaryUser,

          mustChangePassword:
            false,
        };

        mocks
          .tokenGetToken
          .mockReturnValue(
            "temporary-token"
          );

        mocks
          .tokenGetUser
          .mockReturnValue(
            temporaryUser
          );

        mocks
          .authGetMe
          .mockResolvedValue(
            temporaryUser
          );

        mocks
          .authChangePassword
          .mockResolvedValue({
            token:
              "replacement-token",

            user:
              completedUser,
          });

        renderAuth(
          "/change-password"
        );

        await waitFor(() => {
          expect(
            screen.getByTestId(
              "authenticated"
            )
          ).toHaveTextContent(
            "true"
          );
        });

        expect(
          screen.getByTestId(
            "must-change-password"
          )
        ).toHaveTextContent(
          "true"
        );

        let returnedUser;

        await act(
          async () => {
            returnedUser =
              await latestAuth
                .changePassword({
                  currentPassword:
                    "Temporary1!",

                  newPassword:
                    "Permanent1!",

                  confirmNewPassword:
                    "Permanent1!",
                });
          }
        );

        expect(
          mocks.authChangePassword
        ).toHaveBeenCalledWith({
          currentPassword:
            "Temporary1!",

          newPassword:
            "Permanent1!",

          confirmNewPassword:
            "Permanent1!",
        });

        expect(
          mocks.tokenSetSession
        ).toHaveBeenCalledWith({
          token:
            "replacement-token",

          user:
            completedUser,
        });

        expect(
          returnedUser
        ).toEqual(
          completedUser
        );

        expect(
          screen.getByTestId(
            "must-change-password"
          )
        ).toHaveTextContent(
          "false"
        );

        expect(
          screen.getByTestId(
            "authenticated"
          )
        ).toHaveTextContent(
          "true"
        );
      }
    );

    it(
      "clears the session when the global unauthorized handler fires",
      async () => {
        const currentUser =
          patientUser();

        mocks
          .tokenGetToken
          .mockReturnValue(
            "existing-token"
          );

        mocks
          .tokenGetUser
          .mockReturnValue(
            currentUser
          );

        mocks
          .authGetMe
          .mockResolvedValue(
            currentUser
          );

        renderAuth(
          "/patient"
        );

        await waitFor(() => {
          expect(
            screen.getByTestId(
              "authenticated"
            )
          ).toHaveTextContent(
            "true"
          );
        });

        expect(
          mocks
            .unauthorizedHandler
        ).toEqual(
          expect.any(
            Function
          )
        );

        act(() => {
          mocks
            .unauthorizedHandler();
        });

        expect(
          mocks.tokenClear
        ).toHaveBeenCalled();

        expect(
          screen.getByTestId(
            "authenticated"
          )
        ).toHaveTextContent(
          "false"
        );

        expect(
          screen.getByTestId(
            "pathname"
          )
        ).toHaveTextContent(
          "/login"
        );
      }
    );

    it(
      "clears authentication and navigates to login on logout",
      async () => {
        const currentUser =
          patientUser();

        mocks
          .tokenGetToken
          .mockReturnValue(
            "existing-token"
          );

        mocks
          .tokenGetUser
          .mockReturnValue(
            currentUser
          );

        mocks
          .authGetMe
          .mockResolvedValue(
            currentUser
          );

        renderAuth(
          "/patient"
        );

        await waitFor(() => {
          expect(
            screen.getByTestId(
              "authenticated"
            )
          ).toHaveTextContent(
            "true"
          );
        });

        act(() => {
          latestAuth
            .logout();
        });

        expect(
          mocks.tokenClear
        ).toHaveBeenCalled();

        expect(
          screen.getByTestId(
            "authenticated"
          )
        ).toHaveTextContent(
          "false"
        );

        expect(
          screen.getByTestId(
            "pathname"
          )
        ).toHaveTextContent(
          "/login"
        );
      }
    );
  }
);
