import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";

const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password, phone_number } = req.body;

    if (!first_name || !last_name || !email || !password || !phone_number) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Please fill in all fields to continue" });
    }

    const user = await User.findOne({ email: email });
    if (user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Email already exists" });
    }

    const newUser = await User.create({
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: password,
      phone_number: phone_number,
    });

    const token = await newUser.createJWT();

    newUser.password = undefined;

    return res.status(StatusCodes.CREATED).json({ user: newUser, token });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An error occurred processing your request" });
  }
};

export default registerUser;
