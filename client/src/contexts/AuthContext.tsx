import { User } from "@/types";
import sessionUtils from "@/utils/sessionUtils";
import URL from "@/utils/urlConfig";
import axios from "axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { toast } from "react-toastify";

// Types
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}

interface LoginResponse {
  success: boolean;
  user: User;
  token?: string;
  message?: string;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  checkAuth: () => Promise<void>;
  getSession: () => { user: User | null; token: string | null };
  setSession: (user: User, token?: string) => void;
  clearSession: () => void;
}

interface SignupData {
  username: string;
  email: string;
  password: string;
  role?: string;
}

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token?: string | null } }
  | { type: "SET_USER"; payload: User | null }
  | { type: "LOGOUT" }
  | { type: "AUTH_ERROR" };

// API utilities
class AuthAPI {
  static handleError(error: any): never {
    const message =
      error.response?.data?.message || error.message || "An error occurred";
    throw new Error(message);
  }

  static async login(credentials: {
    email: string;
    password: string;
  }): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(URL.LOGIN, credentials, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  static async signup(userData: SignupData): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(URL.SIGNUP, userData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  static async logout(): Promise<void> {
    try {
      await axios.post(URL.LOGOUT, {}, { withCredentials: true });
    } catch (error) {
      // Log error but don't throw, as logout should work even if server is down
      console.error("Logout error:", error);
    }
  }

  static async checkAuth(): Promise<LoginResponse> {
    try {
      const response = await axios.get<LoginResponse>(URL.CHECK_AUTH, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  token: null,
};

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: "SET_LOADING" as const,
  LOGIN_SUCCESS: "LOGIN_SUCCESS" as const,
  LOGOUT: "LOGOUT" as const,
  SET_USER: "SET_USER" as const,
  AUTH_ERROR: "AUTH_ERROR" as const,
};

// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
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
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication on app load or hard refresh
  useEffect(() => {
    const initAuth = async () => {
      // 1. Get session from storage
      const session = sessionUtils.getUserSession();

      if (session.user) {
        try {
          // 2. Verify session with backend (/me endpoint)
          const response = await AuthAPI.checkAuth();
          if (response.success && response.user) {
            // 3. If valid, update context state
            dispatch({
              type: AUTH_ACTIONS.LOGIN_SUCCESS,
              payload: { user: response.user, token: session.token },
            });
          } else {
            // 4. If invalid, clear session and set auth error
            sessionUtils.clearUserSession();
            dispatch({ type: AUTH_ACTIONS.AUTH_ERROR });
          }
        } catch (error) {
          // 5. On error, clear session and set auth error
          console.error("Auth verification failed:", error);
          sessionUtils.clearUserSession();
          dispatch({ type: AUTH_ACTIONS.AUTH_ERROR });
        }
      } else {
        // 6. No session found, just stop loading
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
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
  const signup = async (userData: SignupData): Promise<void> => {
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
  const logout = async (): Promise<void> => {
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
  const updateUser = (userData: Partial<User>): void => {
    if (state.user) {
      const updatedUser = sessionUtils.updateUserSession(userData);
      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: updatedUser });
    }
  };

  // Check auth function
  const checkAuth = async (): Promise<void> => {
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

  const contextValue: AuthContextType = {
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
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
