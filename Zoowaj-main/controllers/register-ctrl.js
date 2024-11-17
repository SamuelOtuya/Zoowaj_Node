import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const registerUser = async (req, res) => {
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

export default registerUser;
