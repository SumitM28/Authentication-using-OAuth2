import createError from "../utils/Error.js";
import { comparePassword, hashPassword } from "../utils/authUtils.js";
import JWT from "jsonwebtoken";
import User from "../models/User.js";
import joi from "joi";

// register controller
export const registerController = async (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
  });
  try {
    const { email, password } = await schema.validateAsync(req.body);

    // Check if user already exists with the same email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createError(409, "Already Registered Please Login"));
    }

    // Hash the password before storing it in the database
    const hashedPassword = await hashPassword(password);

    // Save the new user to the database
    const newUser = new User({
      email,
      password: hashedPassword,
      loginMethod: "email",
    });
    await newUser.save();

    res.status(201).send({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    return next(createError(error.status, error.message));
  }
};

// login controller
export const loginController = async (req, res, next) => {
  try {
    const schema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().required(),
    });
    const { email, password } = await schema.validateAsync(req.body);

    // Check if the user exists with the provided email
    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(404, "User not found"));
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      return next(createError(401, "Invalid credentials"));
    }

    // Generate a JWT token with user's data
    const token = await JWT.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).send({
      success: true,
      message: "Login successfully",
      user,
      token,
    });
  } catch (error) {
    return next(createError(error.status, error.message));
  }
};

export const protectRouteController = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).send({
      success: true,
      user,
      message: "User found successfully",
    });
  } catch (error) {
    return next(createError(500, "Server error"));
  }
};
