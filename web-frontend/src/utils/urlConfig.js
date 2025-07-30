const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const urlConfig = {
  LOGIN: `${BASE_URL}/api/auth/login`,
  SIGNUP: `${BASE_URL}/api/auth/signup`,
  LOGOUT: `${BASE_URL}/api/auth/logout`,
  FORGET_PASSWORD: `${BASE_URL}/api/auth/forgetPssword`,
  RESET_PASSWORD: `${BASE_URL}/api/auth/resetPassword`,
  GET_PRODUCTS: `${BASE_URL}/api/product`,
  GET_CATEGORIES: `${BASE_URL}/api/product/categories`,
  SEND_MESSAGE: `${BASE_URL}/api/contact`,
};

export default urlConfig;
