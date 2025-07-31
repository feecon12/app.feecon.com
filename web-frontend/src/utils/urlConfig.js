const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

console.log("BASE_URL from env:", BASE_URL); // Debug log

const urlConfig = {
  LOGIN: `${BASE_URL}/api/auth/login`,
  SIGNUP: `${BASE_URL}/api/auth/signup`,
  LOGOUT: `${BASE_URL}/api/auth/logout`,
  FORGOT_PASSWORD: `${BASE_URL}/api/auth/forgotPassword`,
  RESET_PASSWORD: `${BASE_URL}/api/auth/resetPassword`,
  GET_PRODUCTS: `${BASE_URL}/api/product`,
  GET_CATEGORIES: `${BASE_URL}/api/product/categories`,
  SEND_MESSAGE: `${BASE_URL}/api/contact`,
};

console.log("RESET_PASSWORD URL:", urlConfig.RESET_PASSWORD); // Debug log

export default urlConfig;
