import mongoose from "mongoose";

const profileDetailesSchema = new mongoose.Schema(
  {
    userId: { type: String },
    profilePhoto: {
      type: Object,
      img: {
        url: String,
        public_id: String,
      },
      default: "https://placeholder/400",
    },
    coverPhotos: [
      {
        url: { type: String },
        public_id: { type: String },
      },
    ],
    hobby: { type: String, default: "unknown" },
    about: {
      first_name: { type: String, required: "First name is required" },
      last_name: { type: String, required: "Last name is required" },
      username: { type: String, required: "Username is required", unique: true },
      phone_number: { type: String, required: "Phone number is required" },
      gender: { type: String, enum: ["Male", "Female"] },
      birthDate: { type: Date },
      height: { type: String },
      maritalStatus: {
        type: String,
        enum: ["Single", "Separated", "Divorced", "Widowed"],
      },
      tagline: { type: String, maxlength: 120 },
    },
    interests: [
      {
        type: String,
        enum: [
          "Photography",
          "Shopping",
          "Karaoke",
          "Yoga",
          "Cooking",
          "Tennis",
          "Running",
          "Swimming",
          "Art",
          "Travelling",
          "Extreme Sports",
          "Music",
          "Drinking",
          "Video Games",
        ],
      },
    ],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProfileData" }], // Tracks users who liked this profile
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProfileData" }], // Tracks users who marked this profile as favorite
  },
  { timestamps: true }
);

export default mongoose.model("ProfileData", profileDetailesSchema);
