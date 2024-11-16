import sha256 from "js-sha256";
import jwt from "jsonwebtoken";
import User from "../models/User.js";  // Import the User model

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate email format
  const emailRegex = /@gmail.com|@yahoo.com|@hotmail.com|@live.com/;
  if (!emailRegex.test(email)) throw "Email is not supported from your domain."; 

  // Validate password length
  if (password.length < 6) throw "Password must be at least 6 characters long.";  

  // Check if user already exists
  const userExists = await User.findOne({
    email,
  });

  if (userExists) throw "User with the same email already exists.";

  // Hash the password before saving
  const user = new User({
    name,
    email,
    password: sha256(password + process.env.SALT),
  });

  // Save user to the database
  await user.save();

  res.json({
    message: `User [${name}] registered successfully!`,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists with the given email and password
  const user = await User.findOne({
    email,
    password: sha256(password + process.env.SALT),  // Compare hashed password
  });

  if (!user) throw "Email and Password did not match.";

  // Create a JWT token for the user
  const token = await jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: '1h' });

  res.json({
    message: "User logged in successfully!",
    token,
  });
};
