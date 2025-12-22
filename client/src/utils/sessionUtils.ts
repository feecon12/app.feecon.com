import { User } from "@/types";

interface SessionData {
  user: User | null;
  token: string | null;
  loginTime: string | null;
}

interface SessionInfo {
  isActive: boolean;
  user: User | null;
  loginTime: string | null;
  sessionAge: number | null;
}

// Session storage utilities
export const sessionUtils = {
  // Set user session data
  setUserSession: (userData: User, token: string | null = null): void => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("user", JSON.stringify(userData)); // Backup in localStorage

        if (token) {
          sessionStorage.setItem("auth_token", token);
          localStorage.setItem("auth_token", token);
        }

        // Set login timestamp
        sessionStorage.setItem("login_time", new Date().toISOString());
        localStorage.setItem("login_time", new Date().toISOString());
      } catch (error) {
        console.error("Error setting user session:", error);
      }
    }
  },

  // Get user session data
  getUserSession: (): SessionData => {
    if (typeof window !== "undefined") {
      try {
        // Try sessionStorage first, then localStorage as backup
        let userData =
          sessionStorage.getItem("user") || localStorage.getItem("user");
        let token =
          sessionStorage.getItem("auth_token") ||
          localStorage.getItem("auth_token");
        let loginTime =
          sessionStorage.getItem("login_time") ||
          localStorage.getItem("login_time");

        return {
          user: userData ? JSON.parse(userData) : null,
          token: token || null,
          loginTime: loginTime || null,
        };
      } catch (error) {
        console.error("Error getting user session:", error);
        return { user: null, token: null, loginTime: null };
      }
    }
    return { user: null, token: null, loginTime: null };
  },

  // Clear user session
  clearUserSession: (): void => {
    if (typeof window !== "undefined") {
      try {
        // Clear from both sessionStorage and localStorage
        const keysToRemove = ["user", "auth_token", "login_time"];

        keysToRemove.forEach((key) => {
          sessionStorage.removeItem(key);
          localStorage.removeItem(key);
        });
      } catch (error) {
        console.error("Error clearing user session:", error);
      }
    }
  },

  // Check if session exists
  hasActiveSession: (): boolean => {
    const session = sessionUtils.getUserSession();
    return !!session.user;
  },

  // Check if session is expired (optional - for future use)
  isSessionExpired: (maxAge: number = 24 * 60 * 60 * 1000): boolean => {
    // Default 24 hours
    const session = sessionUtils.getUserSession();

    if (!session.loginTime) return false;

    const loginTime = new Date(session.loginTime);
    const currentTime = new Date();
    const sessionAge = currentTime.getTime() - loginTime.getTime();

    return sessionAge > maxAge;
  },

  // Update user data in session
  updateUserSession: (updates: Partial<User>): User | null => {
    const session = sessionUtils.getUserSession();
    if (session.user) {
      const updatedUser = { ...session.user, ...updates };
      sessionUtils.setUserSession(updatedUser, session.token);
      return updatedUser;
    }
    return null;
  },

  // Get session info
  getSessionInfo: (): SessionInfo => {
    const session = sessionUtils.getUserSession();

    if (!session.user) {
      return {
        isActive: false,
        user: null,
        loginTime: null,
        sessionAge: null,
      };
    }

    let sessionAge: number | null = null;
    if (session.loginTime) {
      const loginTime = new Date(session.loginTime);
      const currentTime = new Date();
      sessionAge = currentTime.getTime() - loginTime.getTime();
    }

    return {
      isActive: true,
      user: session.user,
      loginTime: session.loginTime,
      sessionAge,
    };
  },
};

export default sessionUtils;
