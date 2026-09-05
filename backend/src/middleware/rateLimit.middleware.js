import { rateLimit } from "express-rate-limit";

const createLimitHandler = (message) => {
  return (req, res) => {
    return res.status(429).json({
      success: false,
      message,
    });
  };
};

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: createLimitHandler(
    "Too many requests. Please try again after 15 minutes."
  ),
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: createLimitHandler(
    "Too many authentication attempts. Please try again after 15 minutes."
  ),
});