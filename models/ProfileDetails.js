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

    about: {
      first_name: { type: String, required: "Firt name is required" },
      last_name: { type: String, required: "Last name is required" },
      username: { type: String, required: "Username is required", unique: true },
      phone_number: { type: String, required: "Phone number is required" },
      gender: { type: String, enum: ["Male", "Female"] },
      birthDate: { type: Date, required: "Birth date is required" },
      height: { type: String },
      maritalStatus: {
        type: String,
        enum: ["Single", "Seperated", "Divorced", "Widowed"],
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

    religiosity: {
      muslimSect: { type: String, enum: ["Sunni", "Shia", "Other"], required: true },
      isConvert: { type: String, enum: ["Yes", "No"], required: true },
      religiousPractice: { type: String, enum: ["Strict", "Moderate", "Liberal"], required: true },
      doYouPray: { type: String, enum: ["Regularly", "Occasionally", "Rarely"], required: true },
      diet: { type: String, enum: ["Halal", "Halal and Non-Halal", "Vegan", "Vegetarian"], required: true },
      doYouSmoke: { type: String, enum: ["Yes", "No", "Occasionally"], required: true },
      hasTattoos: { type: String, enum: ["Yes", "No"], required: true },
    },

    marriageIntentions: {
      lookingToMarry: { type: String, enum: ["Within 1 year", "1-2 years", "2-3 years", "3-5 years"], required: true },
      willingToRelocate: { type: String, enum: ["Yes", "No", "Maybe"], required: true },
      wantsChildren: { type: String, enum: ["Yes", "No", "Maybe"], required: true },
      livingArrangments: { type: String, enum: ["Living alone", "Living with family", "Living with roommates"], required: true },
      iceBreaker: { type: String, maxlength: 120 },
    },

    languageAndEthnicity: {
      languages: { type: String, enum: ["English", "Arabic", "Urdu", "Bengali", "Other"], required: true },
      ethnicGroup: { type: String, enum: ["Asian", "Black", "Hispanic", "Middle Eastern", "White", "Other"], required: true },
      ethnicOrigin: { type: String, enum: ["Indian", "Pakistani", "Bangladeshi", "Arab", "Turkish", "Other"], required: true },
      biography: { type: String, maxlength: 500 },
    },

    educationAndCareer: {
      profession: { type: String, enum: ["Doctor", "Engineer", "Teacher", "Business", "Other"], required: true },
      education: { type: String, enum: [ "High School", "Bachelor's", "Master's", "PhD", "Other"], required: true },
      jobTitle: { type: String, enum: ["Manager", "Developer", "Designer", "Analyst", "Other"], required: true },
    },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProfileData" }], // Tracks users who liked this profile
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProfileData" }], // Tracks users who marked this profile as favorite
  },
  { timestamps: true },
);

// Example Mongoose validation middleware
profileDetailesSchema.pre("validate", function (next) {
  if (Array.isArray(this.interests)) {
    this.interests = [...new Set(this.interests)];
  }
  next();
});


export default mongoose.model("ProfileData", profileDetailesSchema);
