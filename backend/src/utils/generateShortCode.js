import { randomInt } from "node:crypto";

const BASE62_CHARACTERS =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const generateShortCode = (length = 7) => {
  if (
    !Number.isInteger(length) ||
    length < 4 ||
    length > 30
  ) {
    throw new Error(
      "Short-code length must be between 4 and 30"
    );
  }

  let shortCode = "";

  for (
    let index = 0;
    index < length;
    index += 1
  ) {
    const randomIndex = randomInt(
      0,
      BASE62_CHARACTERS.length
    );

    shortCode += BASE62_CHARACTERS[randomIndex];
  }

  return shortCode;
};