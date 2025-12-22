import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

// Custom hook for authentication checks
export const useAuthCheck = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  return {
    isAuthenticated,
    isLoading,
    user,
    isLoggedIn: isAuthenticated && !!user,
  };
};

// Custom hook for requiring authentication
export const useRequireAuth = (redirectTo: string = "/login") => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo, router]);

  return { isAuthenticated, isLoading };
};

interface UserInfo {
  username: string;
  email: string;
  role: string;
  id: string;
}

// Custom hook for session management
export const useSession = () => {
  const {
    user,
    isAuthenticated,
    logout,
    updateUser,
    getSession,
    setSession,
    clearSession,
  } = useAuth();

  const getUserRole = (): string | null => user?.role || null;

  const isAdmin = (): boolean => user?.role === "admin";

  const isUser = (): boolean => user?.role === "user";

  const getUserInfo = (): UserInfo => ({
    username: user?.username || "",
    email: user?.email || "",
    role: user?.role || "",
    id: user?._id || "",
  });

  return {
    user,
    isAuthenticated,
    logout,
    updateUser,
    getSession,
    setSession,
    clearSession,
    getUserRole,
    isAdmin,
    isUser,
    getUserInfo,
  };
};
