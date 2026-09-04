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
        throw new AppError(
          "This custom alias is already taken",
          409
        );
      }

      throw error;
    }
  }

  for (
    let attempt = 1;
    attempt <= MAX_GENERATION_ATTEMPTS;
    attempt += 1
  ) {
    const shortCode = generateShortCode(7);

    try {
      return await Url.create({
        originalUrl,
        shortCode,
        expiresAt,
        user: userId,
      });
    } catch (error) {
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

export const resolveShortUrl = async (shortCode) => {
  const currentTime = new Date();

  const url = await Url.findOneAndUpdate(
    {
      shortCode,
      isActive: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: currentTime } },
      ],
    },
    {
      $inc: { clicks: 1 },
      $set: { lastAccessedAt: currentTime },
    },
    {
      new: true,
    }
  );

  if (url) {
    return url.originalUrl;
  }

  const unavailableUrl = await Url.findOne({ shortCode })
    .select("isActive expiresAt")
    .lean();

  if (!unavailableUrl) {
    throw new AppError("Short URL was not found", 404);
  }

  if (!unavailableUrl.isActive) {
    throw new AppError(
      "This short URL has been disabled",
      410
    );
  }

  if (
    unavailableUrl.expiresAt &&
    unavailableUrl.expiresAt.getTime() <=
      currentTime.getTime()
  ) {
    throw new AppError("This short URL has expired", 410);
  }

  throw new AppError("Short URL is unavailable", 404);
};

export const getUrlDetailsByShortCode = async (
  shortCode,
  userId
) => {
  const url = await Url.findOne({
    shortCode,
    user: userId,
  }).lean();

  if (!url) {
    throw new AppError("Short URL was not found", 404);
  }

  return url;
};

export const getPaginatedUrls = async ({
  page = 1,
  limit = 10,
  userId,
}) => {
  const parsedPage = Number.parseInt(page, 10);
  const parsedLimit = Number.parseInt(limit, 10);

  const currentPage =
    Number.isNaN(parsedPage) || parsedPage < 1
      ? 1
      : parsedPage;

  const pageSize =
    Number.isNaN(parsedLimit) || parsedLimit < 1
      ? 10
      : Math.min(parsedLimit, 100);

  const skip = (currentPage - 1) * pageSize;
  const filter = { user: userId };

  const [urls, totalUrls] = await Promise.all([
    Url.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean(),

    Url.countDocuments(filter),
  ]);

  return {
    urls,
    pagination: {
      currentPage,
      pageSize,
      totalUrls,
      totalPages: Math.ceil(totalUrls / pageSize),
    },
  };
};

export const updateUrlByShortCode = async (
  shortCode,
  updates
) => {
  const url = await Url.findOneAndUpdate(
    { shortCode },
    { $set: updates },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!url) {
    throw new AppError("Short URL was not found", 404);
  }

  return url;
};

export const deactivateUrlByShortCode = async (
  shortCode
) => {
  const url = await Url.findOneAndUpdate(
    { shortCode },
    {
      $set: {
        isActive: false,
      },
    },
    {
      new: true,
    }
  );

  if (!url) {
    throw new AppError("Short URL was not found", 404);
  }

  return url;
};