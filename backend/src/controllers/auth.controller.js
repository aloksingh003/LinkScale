import {
  registerUser,
  loginUser,
} from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/appError.js";
import {
  generateAuthToken,
  getAuthCookieOptions,
} from "../utils/authToken.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,72}$/;

export const register = asyncHandler(
  async (req, res) => {
    const {
      name,
      email,
      password,
      passwordConfirm,
    } = req.body || {};

    if (!name || !email || !password || !passwordConfirm) {
      throw new AppError(
        "Name, email, password and password confirmation are required",
        400
      );
    }

    if (
      typeof name !== "string" ||
      name.trim().length < 2 ||
      name.trim().length > 50
    ) {
      throw new AppError(
        "Name must contain between 2 and 50 characters",
        400
      );
    }

    if (
      typeof email !== "string" ||
      !EMAIL_PATTERN.test(email.trim())
    ) {
      throw new AppError(
        "Please provide a valid email address",
        400
      );
    }

    if (
      typeof password !== "string" ||
      !PASSWORD_PATTERN.test(password)
    ) {
      throw new AppError(
        "Password must contain 8-72 characters with uppercase, lowercase and number",
        400
      );
    }

    if (password !== passwordConfirm) {
      throw new AppError(
        "Password and password confirmation do not match",
        400
      );
    }

    const user = await registerUser({
      name,
      email,
      password,
    });

    const token = generateAuthToken(user.id);

    res.cookie(
      "accessToken",
      token,
      getAuthCookieOptions()
    );

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        user,
      },
    });
  }
);

export const login = asyncHandler(
  async (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
      throw new AppError(
        "Email and password are required",
        400
      );
    }

    if (
      typeof email !== "string" ||
      !EMAIL_PATTERN.test(email.trim())
    ) {
      throw new AppError(
        "Please provide a valid email address",
        400
      );
    }

    if (typeof password !== "string") {
      throw new AppError(
        "Password must be a string",
        400
      );
    }

    const user = await loginUser({
      email,
      password,
    });

    const token = generateAuthToken(user.id);

    res.cookie(
      "accessToken",
      token,
      getAuthCookieOptions()
    );

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        user,
      },
    });
  }
);

export const getCurrentUser = asyncHandler(
  async (req, res) => {
    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          createdAt: req.user.createdAt,
        },
      },
    });
  }
);

export const logout = asyncHandler(
  async (req, res) => {
    const clearCookieOptions =
      getAuthCookieOptions();

    delete clearCookieOptions.expires;

    res.clearCookie(
      "accessToken",
      clearCookieOptions
    );

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  }
);