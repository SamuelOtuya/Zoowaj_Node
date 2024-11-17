import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password fields
    if (!email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Please provide both email and password to continue" });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Invalid email or password" });
    }

    // Verify the provided password using bcrypt
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = user.createJWT();

    // Exclude sensitive fields (like password) from the response
    const { password: _, ...userWithoutPassword } = user.toObject();

    return res.status(StatusCodes.OK).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An error occurred processing your request" });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, username, email, password, phone_number } = req.body;

    // Validate all required fields
    if (!first_name || !last_name || !username || !email || !password || !phone_number) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Please fill in all fields to continue" });
    }

    // Check if the email already exists
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Email already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user with the hashed password
    const newUser = await User.create({
      first_name,
      last_name,
      username,
      email,
      password: hashedPassword, // Save the hashed password
      phone_number,
    });

    // Generate a JWT token
    const token = await newUser.createJWT();

    // Exclude the password from the response
    newUser.password = undefined;

    return res.status(StatusCodes.CREATED).json({ user: newUser, token });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An error occurred processing your request" });
  }
};