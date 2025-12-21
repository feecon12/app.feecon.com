const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface UrlConfig {
  LOGIN: string;
  SIGNUP: string;
  LOGOUT: string;
  FORGOT_PASSWORD: string;
  RESET_PASSWORD: string;
  GET_PRODUCTS: string;
  GET_CATEGORIES: string;
  SEND_MESSAGE: string;
  GENERATE_AI_TEXT: string;
  CHECK_AUTH: string;
}

const urlConfig: UrlConfig = {
  LOGIN: `${BASE_URL}/api/auth/login`,
  SIGNUP: `${BASE_URL}/api/auth/signup`,
  LOGOUT: `${BASE_URL}/api/auth/logout`,
  FORGOT_PASSWORD: `${BASE_URL}/api/auth/forgotPassword`,
  RESET_PASSWORD: `${BASE_URL}/api/auth/resetPassword`,
  GET_PRODUCTS: `${BASE_URL}/api/product`,
  GET_CATEGORIES: `${BASE_URL}/api/product/categories`,
  SEND_MESSAGE: `${BASE_URL}/api/contact`,
  GENERATE_AI_TEXT: `${BASE_URL}/api/generate`,
  CHECK_AUTH: `${BASE_URL}/api/auth/me`,
};

export default urlConfig;
