import { useState } from "react";
import { authStore } from "../../../stores/admin/authStore";

export const useAuth = () => {
  const [admin, setAdmin] = useState(() => authStore.getAdmin());

  return {
    admin,
    setAdmin,
    isLogin: admin !== null,
  };
};
