import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Please provide both email and password to continue" });
    }

    // Find user and include password explicitly
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      console.log(`User with email ${email} not found`);
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Invalid email or password" });
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log("Password mismatch");
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Invalid email or password" });
    }

    // Generate JWT and respond
    const token = user.createJWT();
    const { password: _, ...userWithoutPassword } = user.toObject();

    return res.status(StatusCodes.OK).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An error occurred processing your request" });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Please fill in all fields to continue" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Email already exists" });
    }

    // Create user (password will be hashed by the pre-save hook)
    const newUser = await User.create({ email, password });

    // Generate JWT and respond
    const token = newUser.createJWT();
    const { password: _, ...userWithoutPassword } = newUser.toObject();

    return res.status(StatusCodes.CREATED).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error("Registration error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An error occurred processing your request" });
  }
};