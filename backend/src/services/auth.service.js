import { User } from "../models/user.model.js";
import { AppError } from "../utils/appError.js";

export const registerUser = async ({
  name,
  email,
  password,
}) => {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.exists({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new AppError(
      "An account with this email already exists",
      409
    );
  }

  try {
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError(
        "An account with this email already exists",
        409
      );
    }

    throw error;
  }
};

export const loginUser = async ({
  email,
  password,
}) => {
  const normalizedEmail = email.trim().toLowerCase();

  // Password normally hidden hai, isliye explicitly select kiya
  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+password");

  if (!user) {
    throw new AppError(
      "Invalid email or password",
      401
    );
  }

  const isPasswordCorrect =
    await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new AppError(
      "Invalid email or password",
      401
    );
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
};