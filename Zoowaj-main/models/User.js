import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: "First name is required!",
  },
  lastName: {
    type: String,
    required: "Last name is required!",
  },
  email: {
    type: String,
    required: "Email is required!",
  },
  password: {
    type: String,
    required: "Password is required!",
  },
  phoneNumber: {
    type: String,
    required: "Phone number is required!",
  }
}, { timestamps: true, });

const User = mongoose.model("User", userSchema);

export default User;

