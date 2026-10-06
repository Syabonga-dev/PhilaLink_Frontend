import {
  fireEvent,
  render,
  screen,
  waitFor,
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

const mocks =
  vi.hoisted(() => {
    class MockApiError
      extends Error {
      constructor(
        message,
        {
          status,
          errors,
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
      }
    }

    return {
      login:
        vi.fn(),

      toastSuccess:
        vi.fn(),

      toastError:
        vi.fn(),

      googleUrl:
        vi.fn(),

      ApiError:
        MockApiError,
    };
  });

vi.mock(
  "../../context/AuthContext.jsx",
  () => ({
    useAuth:
      () => ({
        login:
          mocks.login,
      }),
  })
);

vi.mock(
  "../../components/ui/Toast.jsx",
  () => ({
    useToast:
      () => ({
        success:
          mocks.toastSuccess,

        error:
          mocks.toastError,
      }),
  })
);

vi.mock(
  "../../services/api/client.js",
  () => ({
    ApiError:
      mocks.ApiError,

    API_BASE_URL:
      "https://philalink.test",
  })
);

vi.mock(
  "../../services/api/auth.js",
  () => ({
    authApi: {
      getGoogleLoginUrl:
        mocks.googleUrl,
    },
  })
);

vi.mock(
  "../../components/layout/NavigationBar.jsx",
  () => ({
    default:
      () => (
        <div
          data-testid="navigation"
        />
      ),
  })
);

vi.mock(
  "../../components/ui/Input.jsx",
  () => ({
    default:
      ({
        label,
        name,
        type =
          "text",
        value,
        onChange,
        error,
        placeholder,
        endAdornment,
      }) => (
        <label>
          <span>
            {label}
          </span>

          <input
            aria-label={
              label
            }
            name={name}
            type={type}
            value={
              value
            }
            onChange={
              onChange
            }
            placeholder={
              placeholder
            }
          />

          {
            endAdornment
          }

          {error ? (
            <span>
              {error}
            </span>
          ) : null}
        </label>
      ),
  })
);

vi.mock(
  "../../components/ui/Button.jsx",
  () => ({
    default:
      ({
        children,
        loading,
        ...props
      }) => (
        <button
          {...props}
        >
          {children}
        </button>
      ),
  })
);

import LoginPage
  from "./LoginPage.jsx";

function renderLogin(
  initialEntry =
    "/login"
) {
  return render(
    <MemoryRouter
      initialEntries={[
        initialEntry,
      ]}
    >
      <Routes>
        <Route
          path="/login"
          element={
            <LoginPage />
          }
        />

        <Route
          path="/patient"
          element={
            <div>
              Patient destination
            </div>
          }
        />

        <Route
          path="/nurse"
          element={
            <div>
              Nurse destination
            </div>
          }
        />

        <Route
          path="/nurse/patients"
          element={
            <div>
              Requested destination
            </div>
          }
        />

        <Route
          path="/proxy"
          element={
            <div>
              Proxy destination
            </div>
          }
        />

        <Route
          path="/admin"
          element={
            <div>
              Admin destination
            </div>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

function fillLogin({
  idNumber =
    "9001015000000",

  password =
    "Password1!",
} = {}) {
  fireEvent.change(
    screen.getByLabelText(
      "ID number"
    ),
    {
      target: {
        value:
          idNumber,
      },
    }
  );

  fireEvent.change(
    screen.getByLabelText(
      "Password"
    ),
    {
      target: {
        value:
          password,
      },
    }
  );
}

describe(
  "LoginPage",
  () => {
    beforeEach(() => {
      mocks.login
        .mockReset();

      mocks.toastSuccess
        .mockReset();

      mocks.toastError
        .mockReset();

      mocks.googleUrl
        .mockReset();

      mocks.googleUrl
        .mockReturnValue(
          "https://philalink.test/api/auth/google-login"
        );
    });

    it(
      "rejects an invalid SA ID before calling login",
      () => {
        renderLogin();

        fillLogin({
          idNumber:
            "12345",
        });

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Log in",
            }
          )
        );

        expect(
          screen.getByText(
            "ID must be 13 digits and contain numbers only."
          )
        ).toBeInTheDocument();

        expect(
          mocks.login
        ).not
          .toHaveBeenCalled();
      }
    );

    it(
      "logs in and sends the user to their role home",
      async () => {
        mocks.login
          .mockResolvedValue({
            id:
              "nurse-1",

            fullName:
              "Nurse One",

            role:
              "Nurse",

            mustChangePassword:
              false,
          });

        renderLogin();

        fillLogin();

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Log in",
            }
          )
        );

        await waitFor(() => {
          expect(
            mocks.login
          ).toHaveBeenCalledWith({
            idNumber:
              "9001015000000",

            password:
              "Password1!",
          });
        });

        expect(
          await screen
            .findByText(
              "Nurse destination"
            )
        ).toBeInTheDocument();

        expect(
          mocks.toastSuccess
        ).toHaveBeenCalledWith(
          "Welcome back, Nurse One."
        );
      }
    );

    it(
      "returns the user to the protected page they originally requested",
      async () => {
        mocks.login
          .mockResolvedValue({
            id:
              "nurse-1",

            fullName:
              "Nurse One",

            role:
              "Nurse",
          });

        renderLogin({
          pathname:
            "/login",

          state: {
            from: {
              pathname:
                "/nurse/patients",
            },
          },
        });

        fillLogin();

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Log in",
            }
          )
        );

        expect(
          await screen
            .findByText(
              "Requested destination"
            )
        ).toBeInTheDocument();
      }
    );

    it(
      "shows the safe credential error for a 401 login response",
      async () => {
        mocks.login
          .mockRejectedValue(
            new mocks.ApiError(
              "Backend authentication detail",
              {
                status:
                  401,
              }
            )
          );

        renderLogin();

        fillLogin();

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Log in",
            }
          )
        );

        await waitFor(() => {
          expect(
            mocks.toastError
          ).toHaveBeenCalledWith(
            "Incorrect ID number or password."
          );
        });
      }
    );

    it(
      "shows a generic error for unexpected failures",
      async () => {
        mocks.login
          .mockRejectedValue(
            new Error(
              "Unexpected failure"
            )
          );

        renderLogin();

        fillLogin();

        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Log in",
            }
          )
        );

        await waitFor(() => {
          expect(
            mocks.toastError
          ).toHaveBeenCalledWith(
            "Something went wrong. Please try again."
          );
        });
      }
    );
  }
);
