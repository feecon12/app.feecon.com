/**------Module imports -----------------------*/
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { protectRoute } from "./controllers/authController";
import {
  authRouter,
  bookingRouter,
  messageRouter,
  productRouter,
  reviewRouter,
  userRouter,
} from "./routers";

dotenv.config();

const app = express();

/*--------Environment variables------------*/
const PORT = process.env.PORT || 5001;
const DB_URI = process.env.DB_URI as string;
const CLIENT_URL = process.env.CLIENT_URL;
const ENV = process.env.ENV;

/**-------Middlewares----------------------*/
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(
  cors({
    origin: CLIENT_URL, // Allows  server to accept requests from different origins
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Custom headers if needed
  })
);

/**-------Database connection strings------*/
mongoose
  .connect(DB_URI)
  .then(() => {
    console.log(`MongoDB connection in ${ENV} environment is established!`);
  })
  .catch((err: Error) => {
    console.log("Something went wrong with DB connection", err);
  });

/** ------------Routes---------------------*/
app.use("/api/contact", messageRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", protectRoute, userRouter);
app.use("/api/product", protectRoute, productRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/review", reviewRouter);

/**----Central Error Handling Middleware----*/
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  console.log(statusCode);
  res.status(statusCode).json({
    message: "Internal Server Error",
    error: err.message,
  });
});

/*------ Fallback middleware (When no route hits, this will be called)-----*/
app.use(function (req: Request, res: Response) {
  res.status(404).send("404 Not Found!");
});

/* -------Server connection string------- */
app.listen(PORT, () => {
  console.log(`Server is running in ${ENV} at http://localhost:${PORT}`);
});
