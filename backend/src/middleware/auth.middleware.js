import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";
import { AppError } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(
  async (req, res, next) => {
    let token = req.cookies.accessToken;

    // Bearer token support for Postman/mobile clients
    const authorizationHeader =
      req.headers.authorization;

    if (
      !token &&
      authorizationHeader?.startsWith("Bearer ")
    ) {
      token = authorizationHeader.split(" ")[1];
    }

    if (!token) {
      throw new AppError(
        "Please log in to access this resource",
        401
      );
    }

    let decodedToken;

    try {
      decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET
      );
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new AppError(
          "Your login session has expired",
          401
        );
      }

      throw new AppError(
        "Invalid authentication token",
        401
      );
    }

    const user = await User.findById(
      decodedToken.sub
    );

    if (!user) {
      throw new AppError(
        "The user belonging to this token no longer exists",
        401
      );
    }

    // Make authenticated user available to next controller
    req.user = user;

    next();
  }
);