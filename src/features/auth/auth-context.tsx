import { createContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { authService } from "../../services/auth.service";
import type { AuthUser } from "../../types/auth";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  login: () => undefined,
  logout: () => undefined,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      return;
    }

    authService
      .me()
      .then((currentUser) => setUser(currentUser))
      .catch(() => localStorage.removeItem("authToken"))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login: (token: string, currentUser: AuthUser) => {
        localStorage.setItem("authToken", token);
        setUser(currentUser);
      },
      logout: () => {
        localStorage.removeItem("authToken");
        setUser(null);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
