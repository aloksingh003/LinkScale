import jwt from "jsonwebtoken";
import { AppError } from "./appError.js";

export const generateAuthToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new AppError(
      "JWT_SECRET is missing from environment variables",
      500
    );
  }

  return jwt.sign(
    {
      sub: userId.toString(),
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

export const getAuthCookieOptions = () => {
  const expiryDays =
    Number.parseInt(
      process.env.COOKIE_EXPIRES_IN_DAYS,
      10
    ) || 7;

  const isProduction =
    process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    expires: new Date(
      Date.now() + expiryDays * 24 * 60 * 60 * 1000
    ),
    path: "/",
  };
};