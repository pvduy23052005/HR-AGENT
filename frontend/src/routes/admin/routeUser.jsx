import Users from "../../pages/admin/User";
import CreateUser from "../../pages/admin/User/Create";
import EditUser from "../../pages/admin/User/Edit";
import SearchUser from "../../pages/admin/User/Search";

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
    {
      path: "edit/:id",
      element: <EditUser />,
    },
    {
      path: "search/:email",
      element: <SearchUser />,
    },
  ],
};

export default routeUser;
