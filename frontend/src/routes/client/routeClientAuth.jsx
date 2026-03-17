import LayoutClientlogin from "../../layouts/client/layoutClientlogin";
import ClientLogin from "../../pages/client/Auth/Login";
import ClientForgotPassword from "../../pages/client/Auth/ForgotPassword";

const routeClientAuth = {
  path: "",
  element: <LayoutClientlogin />,
  children: [
    {
      path: "",
      element: <ClientLogin />,
    },
    {
      path: "/auth/forgot-password",
      element: <ClientForgotPassword />,
    },
  ],
};

export default routeClientAuth;
