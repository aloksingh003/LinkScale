import {
  createShortUrl,
  resolveShortUrl,
  getUrlDetailsByShortCode,
  getPaginatedUrls,
  updateUrlByShortCode,
  deactivateUrlByShortCode,
} from "../services/url.service.js";
import { AppError } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const CUSTOM_ALIAS_PATTERN = /^[a-zA-Z0-9_-]{4,30}$/;

const validateAndNormalizeUrl = (urlValue) => {
  if (typeof urlValue !== "string" || !urlValue.trim()) {
    throw new AppError("Original URL is required", 400);
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(urlValue.trim());
  } catch {
    throw new AppError("Please provide a valid URL", 400);
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new AppError("Only HTTP and HTTPS URLs are allowed", 400);
  }

  return parsedUrl.toString();
};

const validateExpiryDate = (expiryValue) => {
  if (!expiryValue) {
    return null;
  }

  const expiryDate = new Date(expiryValue);

  if (
    Number.isNaN(expiryDate.getTime()) ||
    expiryDate.getTime() <= Date.now()
  ) {
    throw new AppError(
      "Expiry date must be a valid future date",
      400
    );
  }

  return expiryDate;
};

export const createUrl = asyncHandler(async (req, res) => {
  const { originalUrl, customAlias, expiresAt } = req.body;

  const normalizedOriginalUrl =
    validateAndNormalizeUrl(originalUrl);

  const normalizedExpiryDate =
    validateExpiryDate(expiresAt);

  let normalizedAlias = null;

  if (customAlias) {
    if (
      typeof customAlias !== "string" ||
      !CUSTOM_ALIAS_PATTERN.test(customAlias.trim())
    ) {
      throw new AppError(
        "Custom alias must contain 4-30 letters, numbers, hyphens or underscores",
        400
      );
    }

    normalizedAlias = customAlias.trim();
  }

 const url = await createShortUrl({
  originalUrl: normalizedOriginalUrl,
  customAlias: normalizedAlias,
  expiresAt: normalizedExpiryDate,
  userId: req.user._id,
});

  const baseUrl =
    process.env.BASE_URL ||
    `${req.protocol}://${req.get("host")}`;

  return res.status(201).json({
    success: true,
    message: "Short URL created successfully",
    data: {
      id: url._id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      shortUrl: `${baseUrl}/${url.shortCode}`,
      clicks: url.clicks,
      isActive: url.isActive,
      expiresAt: url.expiresAt,
      createdAt: url.createdAt,
    },
  });
});

export const redirectToOriginalUrl = asyncHandler(
  async (req, res) => {
    const { shortCode } = req.params;

    const originalUrl = await resolveShortUrl(shortCode);

    return res.redirect(302, originalUrl);
  }
);

export const getUrlDetails = asyncHandler(
  async (req, res) => {
    const { shortCode } = req.params;

    const url = await getUrlDetailsByShortCode(shortCode);

    const baseUrl =
      process.env.BASE_URL ||
      `${req.protocol}://${req.get("host")}`;

    return res.status(200).json({
      success: true,
      data: {
        id: url._id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl: `${baseUrl}/${url.shortCode}`,
        clicks: url.clicks,
        isActive: url.isActive,
        expiresAt: url.expiresAt,
        lastAccessedAt: url.lastAccessedAt,
        createdAt: url.createdAt,
        updatedAt: url.updatedAt,
      },
    });
  }
);

export const getUrls = asyncHandler(async (req, res) => {
  const result = await getPaginatedUrls({
  page: req.query.page,
  limit: req.query.limit,
  userId: req.user._id,
  });

  const baseUrl =
    process.env.BASE_URL ||
    `${req.protocol}://${req.get("host")}`;

  return res.status(200).json({
    success: true,
    data: {
      urls: result.urls.map((url) => ({
        id: url._id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl: `${baseUrl}/${url.shortCode}`,
        clicks: url.clicks,
        isActive: url.isActive,
        expiresAt: url.expiresAt,
        lastAccessedAt: url.lastAccessedAt,
        createdAt: url.createdAt,
        updatedAt: url.updatedAt,
      })),
      pagination: result.pagination,
    },
  });
});

export const updateUrl = asyncHandler(async (req, res) => {
  const { shortCode } = req.params;
  const requestBody = req.body || {};
  const updates = {};

  if (
    Object.prototype.hasOwnProperty.call(
      requestBody,
      "isActive"
    )
  ) {
    if (typeof requestBody.isActive !== "boolean") {
      throw new AppError(
        "isActive must be either true or false",
        400
      );
    }

    updates.isActive = requestBody.isActive;
  }

  if (
    Object.prototype.hasOwnProperty.call(
      requestBody,
      "expiresAt"
    )
  ) {
    updates.expiresAt =
      requestBody.expiresAt === null ||
      requestBody.expiresAt === ""
        ? null
        : validateExpiryDate(requestBody.expiresAt);
  }

  if (Object.keys(updates).length === 0) {
    throw new AppError(
      "Provide isActive or expiresAt to update",
      400
    );
  }

  const url = await updateUrlByShortCode(
    shortCode,
    updates
  );

  return res.status(200).json({
    success: true,
    message: "Short URL updated successfully",
    data: {
      id: url._id,
      shortCode: url.shortCode,
      isActive: url.isActive,
      expiresAt: url.expiresAt,
      updatedAt: url.updatedAt,
    },
  });
});

export const deactivateUrl = asyncHandler(
  async (req, res) => {
    const { shortCode } = req.params;

    const url = await deactivateUrlByShortCode(
      shortCode
    );

    return res.status(200).json({
      success: true,
      message: "Short URL deactivated successfully",
      data: {
        id: url._id,
        shortCode: url.shortCode,
        isActive: url.isActive,
      },
    });
  }
);