import axios from "axios";
import { createContext, useContext, useEffect, useReducer } from "react";
import { toast } from "react-toastify";
import URL from "../utils/urlConfig";

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
        token: action.payload.token,
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

  // Session storage helpers
  const setSession = (userData, token) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("user", JSON.stringify(userData));
      if (token) {
        sessionStorage.setItem("token", token);
      }
    }
  };

  const getSession = () => {
    if (typeof window !== "undefined") {
      const user = sessionStorage.getItem("user");
      const token = sessionStorage.getItem("token");
      return {
        user: user ? JSON.parse(user) : null,
        token: token || null,
      };
    }
    return { user: null, token: null };
  };

  const clearSession = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
      localStorage.removeItem("user"); // Clear any localStorage as well
      localStorage.removeItem("token");
    }
  };

  // Initialize auth state from session storage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const session = getSession();
        if (session.user) {
          dispatch({
            type: AUTH_ACTIONS.SET_USER,
            payload: session.user,
          });
        } else {
          dispatch({
            type: AUTH_ACTIONS.SET_LOADING,
            payload: false,
          });
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        dispatch({
          type: AUTH_ACTIONS.AUTH_ERROR,
        });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

      const response = await axios.post(
        URL.LOGIN,
        { email, password },
        {
          withCredentials: true, // Important: Include cookies in requests
        }
      );

      if (response.status === 200) {
        const userData = response.data.user || response.data.data;

        // Store user data in session storage (for UI)
        // The JWT token is automatically stored in HTTP-only cookie by backend
        setSession(userData);

        // Update state
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: userData,
            token: null, // We don't store token client-side (it's in HTTP-only cookie)
          },
        });

        return { success: true, data: response.data };
      }
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.AUTH_ERROR });
      throw error;
    }
  }; // Logout function
  const logout = async () => {
    try {
      // Call backend logout if needed
      await axios.post(URL.LOGOUT);
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Clear session regardless of API success
      clearSession();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      toast.success("Logged out successfully");
    }
  };

  // Check authentication status
  const checkAuth = () => {
    const session = getSession();
    return !!session.user;
  };

  // Update user data
  const updateUser = (userData) => {
    setSession(userData);
    dispatch({
      type: AUTH_ACTIONS.SET_USER,
      payload: userData,
    });
  };

  const value = {
    // State
    ...state,

    // Actions
    login,
    logout,
    checkAuth,
    updateUser,

    // Utilities
    setSession,
    getSession,
    clearSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
