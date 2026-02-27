import Users from "../../pages/admin/User";
import CreateUser from "../../pages/admin/User/Create";

const routeUser = {
  path: "users",
  children: [
    {
      index: true,
      element: <Users />,
    },
    {
      path: "create",
      element: <CreateUser />,
    },
  ],
};

export default routeUser;
