import { useAuth } from "../../../hook/admin/auth/useAuth";
import { authStore } from "../../../stores/admin/authStore";
import { AppContext } from "./AppContext";

export const AppProvider = ({ children }) => {
  const { admin, setAdmin, isLogin } = useAuth();

  const login = (dataAdmin) => {
    authStore.set(dataAdmin);
    setAdmin(dataAdmin);
  };

  const logout = () => {
    authStore.clear();
    setAdmin(null);
  };

  return (
    <AppContext.Provider value={{ admin, setAdmin, login, logout, isLogin }}>
      {children}
    </AppContext.Provider>
  );
};
