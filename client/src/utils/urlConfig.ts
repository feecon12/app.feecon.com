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
  GET_PROJECTS: string;
  PROJECTS: string;
  GET_ABOUT: string;
  ABOUT: string;
  GET_HOME: string;
  HOME: string;
  GET_SKILLS: string;
  SKILLS: string;
  UPLOAD_IMAGE: string;
  UPLOAD_RESUME: string;
  UPLOAD_FILE: string;
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
  GET_PROJECTS: `${BASE_URL}/api/projects`,
  PROJECTS: `${BASE_URL}/api/projects`,
  GET_ABOUT: `${BASE_URL}/api/about`,
  ABOUT: `${BASE_URL}/api/about`,
  GET_HOME: `${BASE_URL}/api/home`,
  HOME: `${BASE_URL}/api/home`,
  GET_SKILLS: `${BASE_URL}/api/skills`,
  SKILLS: `${BASE_URL}/api/skills`,
  UPLOAD_IMAGE: `${BASE_URL}/api/upload/image`,
  UPLOAD_RESUME: `${BASE_URL}/api/upload/resume`,
  UPLOAD_FILE: `${BASE_URL}/api/upload/file`,
};

export default urlConfig;
