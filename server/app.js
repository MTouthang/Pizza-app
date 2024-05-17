import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error.middleware.js";
import authRoute from "./routes/auth.route.js";
import productRoute from "./routes/product.route.js";
import userRoute from "./routes/user.route.js";
import cartRoute from "./routes/cart.route.js";
import orderRoute from "./routes/order.route.js";
import fileUpload from "express-fileupload";

const app = express();

// built-in middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// third party middlewares
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://pizza-app-alpha-pink.vercel.app",
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// user route api
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/order", orderRoute);

// health-check
app.get("/ping", (_req, res) => {
  console.log("pong");
  res.send("Pong");
});

// custom Error middleware
app.use(errorMiddleware);

// default catch all route - 404
app.all("*", (_req, res) => {
  res.send("OOps!!! 404 Not Found");
});

export default app;
