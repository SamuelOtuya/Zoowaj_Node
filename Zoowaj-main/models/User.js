import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: "Firt name is required" },
  last_name: { type: String, required: "Last name is required" },
  username: { type: String, required: "Username is required", unique: true },
  email: { type: String, required: "Email is required", unique: true },
  password: { type: String, required: "Password is required" },
  phone_number: { type: String, required: "Phone number is required" },
});

// JWT creation
userSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, username: this.username },
    process.env.JWT_SECRET, // Add your secret to .env
    { expiresIn: "1h" }
  );
};

// Password comparison method (optional, for login functionality)
userSchema.methods.comparePassword = async function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

export default mongoose.model("User", userSchema);