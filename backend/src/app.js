import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import urlRoutes from "./routes/url.routes.js";
import { redirectToOriginalUrl } from "./controllers/url.controller.js";
import {
  errorHandler,
  notFound,
} from "./middleware/error.middleware.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin:
      process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/api/v1/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "LinkScale API is running",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/urls", urlRoutes);

app.get("/:shortCode", redirectToOriginalUrl);

app.use(notFound);
app.use(errorHandler);

export default app;