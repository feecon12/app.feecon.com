import sessionUtils from "@/utils/sessionUtils";
import URL from "@/utils/urlConfig";
import axios from "axios";
import { createContext, useContext, useEffect, useReducer } from "react";
import { toast } from "react-toastify";

// API utilities
class AuthAPI {
  static handleError(error) {
    const message =
      error.response?.data?.message || error.message || "An error occurred";
    throw new Error(message);
  }

  static async login(credentials) {
    try {
      const response = await axios.post(URL.LOGIN, credentials, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  static async signup(userData) {
    try {
      const response = await axios.post(URL.SIGNUP, userData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  static async logout() {
    try {
      await axios.post(URL.LOGOUT, {}, { withCredentials: true });
    } catch (error) {
      // Log error but don't throw, as logout should work even if server is down
      console.error("Logout error:", error);
    }
  }

  static async checkAuth() {
    try {
      const response = await axios.get(URL.CHECK_AUTH, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
}

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  token: null,
};

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGOUT: "LOGOUT",
  SET_USER: "SET_USER",
  AUTH_ERROR: "AUTH_ERROR",
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token || null,
        isAuthenticated: true,
        isLoading: false,
      };
    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        isLoading: false,
      };
    case AUTH_ACTIONS.AUTH_ERROR:
      return {
        ...initialState,
        isLoading: false,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from session storage
  useEffect(() => {
    const initAuth = async () => {
      const session = sessionUtils.getUserSession();

      if (session.user && session.token) {
        try {
          // Verify the session with the server
          const response = await AuthAPI.checkAuth();
          if (response.success && response.user) {
            dispatch({
              type: AUTH_ACTIONS.LOGIN_SUCCESS,
              payload: { user: response.user, token: session.token },
            });
          } else {
            sessionUtils.clearUserSession();
            dispatch({ type: AUTH_ACTIONS.AUTH_ERROR });
          }
        } catch (error) {
          console.error("Auth verification failed:", error);
          sessionUtils.clearUserSession();
          dispatch({ type: AUTH_ACTIONS.AUTH_ERROR });
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await AuthAPI.login({ email, password });
      if (response.success && response.user) {
        sessionUtils.setUserSession(response.user, response.token);
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user: response.user, token: response.token },
        });
        toast.success(response.message || "Login successful!");
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      toast.error(message);
      dispatch({ type: AUTH_ACTIONS.AUTH_ERROR });
      throw error;
    }
  };

  // Signup function
  const signup = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await AuthAPI.signup(userData);
      if (response.success && response.user) {
        sessionUtils.setUserSession(response.user, response.token);
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user: response.user, token: response.token },
        });
        toast.success(response.message || "Account created successfully!");
      } else {
        throw new Error(response.message || "Signup failed");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Signup failed";
      toast.error(message);
      dispatch({ type: AUTH_ACTIONS.AUTH_ERROR });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await AuthAPI.logout();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      sessionUtils.clearUserSession();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      toast.success("Logged out successfully");
    }
  };

  // Update user function
  const updateUser = (userData) => {
    if (state.user) {
      const updatedUser = sessionUtils.updateUserSession(userData);
      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: updatedUser });
    }
  };

  // Check auth function
  const checkAuth = async () => {
    try {
      const response = await AuthAPI.checkAuth();
      if (response.success && response.user) {
        dispatch({ type: AUTH_ACTIONS.SET_USER, payload: response.user });
      } else {
        throw new Error("Authentication check failed");
      }
    } catch (error) {
      sessionUtils.clearUserSession();
      dispatch({ type: AUTH_ACTIONS.AUTH_ERROR });
      throw error;
    }
  };

  // Session management functions
  const getSession = sessionUtils.getUserSession;
  const setSession = sessionUtils.setUserSession;
  const clearSession = sessionUtils.clearUserSession;

  const contextValue = {
    ...state,
    login,
    signup,
    logout,
    updateUser,
    checkAuth,
    getSession,
    setSession,
    clearSession,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
