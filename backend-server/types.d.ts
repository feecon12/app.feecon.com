declare module "helmet";
declare module "express-rate-limit";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: string;
    }
  }
}
