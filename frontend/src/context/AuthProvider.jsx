import { useEffect, useState } from "react";
import api from "../services/api.js";
import { AuthContext } from "./AuthContext.js";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCurrentUser = async () => {
      try {
        const response = await api.get("/auth/me");

        if (isMounted) {
          setUser(response.data.data.user);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsAuthLoading(false);
        }
      }
    };

    loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  const authValue = {
    user,
    setUser,
    isAuthLoading,
    logout,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;