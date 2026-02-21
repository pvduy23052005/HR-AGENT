import ClientLogin from "../../pages/client/Auth/Login";
import ClientForgotPassword from "../../pages/client/Auth/ForgotPassword";

const routeClientAuth = {
  path: "auth",
  children: [
    {
      path: "login",
      element: <ClientLogin />,
    },
    {
      path: "forgot-password",
      element: <ClientForgotPassword />,
    },
  ],
};

export default routeClientAuth;
