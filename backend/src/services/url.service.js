import { Url } from "../models/url.model.js";
import { generateShortCode } from "../utils/generateShortCode.js";
import { AppError } from "../utils/appError.js";

const MAX_GENERATION_ATTEMPTS = 5;

export const createShortUrl = async ({
  originalUrl,
  customAlias,
  expiresAt = null,
  userId = null,
}) => {
  const alias =
    typeof customAlias === "string" ? customAlias.trim() : "";

  // User provided a custom alias
  if (alias) {
    try {
      return await Url.create({
        originalUrl,
        shortCode: alias,
        expiresAt,
        user: userId,
      });
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError("This custom alias is already taken", 409);
      }

      throw error;
    }
  }

  // Generate a random Base62 code
  for (let attempt = 1; attempt <= MAX_GENERATION_ATTEMPTS; attempt += 1) {
    const shortCode = generateShortCode(7);

    try {
      return await Url.create({
        originalUrl,
        shortCode,
        expiresAt,
        user: userId,
      });
    } catch (error) {
      // Another request may have generated the same code
      if (error.code === 11000) {
        continue;
      }

      throw error;
    }
  }

  throw new AppError(
    "Unable to generate a unique short code. Please try again.",
    503
  );
};