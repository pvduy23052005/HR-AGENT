import ClientLogin from "../../pages/client/Auth/Login";
import ClientForgotPassword from "../../pages/client/Auth/ForgotPassword";

const routeClientAuth = {
  path: "",
  children: [
    {
      path: "",
      element: <ClientLogin />,
    },
    {
      path: "/login/forgot",
      element: <ClientForgotPassword />,
    },
  ],
};

export default routeClientAuth;
