import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";

const loginUser = async (req, res) => {
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

export default loginUser;
