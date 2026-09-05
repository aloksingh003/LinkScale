import assert from "node:assert/strict";
import test from "node:test";

import { AppError } from "../src/utils/appError.js";
import { generateShortCode } from "../src/utils/generateShortCode.js";

test("generateShortCode creates a seven-character code by default", () => {
  const shortCode = generateShortCode();

  assert.equal(shortCode.length, 7);
  assert.match(shortCode, /^[a-zA-Z0-9]+$/);
});

test("generateShortCode supports valid custom lengths", () => {
  const minimumLengthCode = generateShortCode(4);
  const maximumLengthCode = generateShortCode(30);

  assert.equal(minimumLengthCode.length, 4);
  assert.equal(maximumLengthCode.length, 30);
});

test("generateShortCode rejects invalid lengths", () => {
  const invalidLengths = [3, 31, 7.5, "7"];

  for (const invalidLength of invalidLengths) {
    assert.throws(
      () => generateShortCode(invalidLength),
      {
        message:
          "Short-code length must be between 4 and 30",
      }
    );
  }
});

test("AppError stores supplied error information", () => {
  const details = {
    field: "email",
  };

  const error = new AppError(
    "Invalid request",
    400,
    details
  );

  assert.equal(error.name, "AppError");
  assert.equal(error.message, "Invalid request");
  assert.equal(error.statusCode, 400);
  assert.deepEqual(error.details, details);
  assert.equal(error.isOperational, true);
});

test("AppError uses status 500 by default", () => {
  const error = new AppError("Unexpected error");

  assert.equal(error.statusCode, 500);
  assert.equal(error.details, null);
});