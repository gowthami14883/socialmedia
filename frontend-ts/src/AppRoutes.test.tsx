import AppRoutes from "./AppRoutes";
import { renderWithRouter } from "./test/renderWithRouter";

jest.mock("./page/home", () => () => <div>Home Page</div>);
jest.mock("./page/login", () => () => <div>Login Page</div>);
jest.mock("./page/registration", () => () => <div>Register Page</div>);
jest.mock("./page/profile", () => () => <div>Profile Page</div>);
jest.mock("./page/chat", () => () => <div>Chat Page</div>);
jest.mock("./page/dashboard", () => () => <div>Dashboard Shell</div>);

describe("AppRoutes", () => {
  it("renders the home route", () => {
    const { getByText } = renderWithRouter(<AppRoutes />, ["/"]);

    expect(getByText("Home Page")).toBeInTheDocument();
  });

  it("renders the login route", () => {
    const { getByText } = renderWithRouter(<AppRoutes />, ["/login"]);

    expect(getByText("Login Page")).toBeInTheDocument();
  });

  it("renders the register route", () => {
    const { getByText } = renderWithRouter(<AppRoutes />, ["/register"]);

    expect(getByText("Register Page")).toBeInTheDocument();
  });

  it("renders the dashboard route", () => {
    const { getByText } = renderWithRouter(<AppRoutes />, ["/dashboard"]);

    expect(getByText("Dashboard Shell")).toBeInTheDocument();
  });
});
