/**------Module imports -----------------------*/
const express = require("express");
const app = express();

require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const {
  messageRouter,
  userRouter,
  authRouter,
  bookingRouter,
  productRouter,
  reviewRouter,
} = require("./routers");
const { protectRoute } = require("./controllers/authController");
const cookieParser = require("cookie-parser");

/**---------------------------------------- */

/*--------Environment variables------------*/
const PORT = process.env.PORT || 5001;
const DB_URI = process.env.DB_URI;
const CLIENT_URL = process.env.CLIENT_URL;
const ENV = process.env.ENV;
/*----------------------------------------*/

/**-------Middlewares----------------------*/
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(
  cors({
    origin: CLIENT_URL, // Allows  server to accept requests from different origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Custom headers if needed
  })
);
/**----------------------------------------*/

/**-------Database connection strings------*/
mongoose
  .connect(DB_URI)
  .then(() => {
    console.log(`MongoDB connection in ${ENV} environment is established!`);
  })
  .catch((err) => {
    console.log("Something went wrong with DB connection", err);
  });
/*------------------------------------------*/

/** ------------Routes---------------------*/
app.use("/api/contact", messageRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", protectRoute, userRouter);
app.use("/api/product", protectRoute, productRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/review", reviewRouter);
/** ---------------------------------------*/

/**----Central Error Handling Middleware----*/
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.log(statusCode);
  res.status(statusCode).json({
    message: "Internal Server Error",
    error: err.message,
  });
});
/** ---------------------------------------*/

/*------ Fallback middleware (When no route hits, this will be called)-----*/
app.use(function (req, res) {
  res.status(404).send("404 Not Found!");
});

/* -------Server connection string------- */
app.listen(PORT, () => {
  console.log(`Server is running in ${ENV} at http://localhost:${PORT}`);
});

/* -------------------------------------------------------------Ends----------------------------------------------------------------------------------------*/
