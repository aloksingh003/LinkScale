import { AppError } from "../utils/appError.js";

export const notFound = (req, res, next) => {
  next(
    new AppError(
      `Route ${req.method} ${req.originalUrl} was not found`,
      404
    )
  );
};

export const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal server error";

  if (error.code === 11000) {
    statusCode = 409;
    message = "A record with this value already exists";
  }

  if (error.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(error.errors)
      .map((validationError) => validationError.message)
      .join(", ");
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(error.details && { details: error.details }),
    ...(process.env.NODE_ENV === "development" && {
      stack: error.stack,
    }),
  });
};