import mongoose from "mongoose";

const profileDetailesSchema = new mongoose.Schema({
  userId: { type: String },
  coverPhoto: {
    type: Object,
    img: {
      url: String,
      public_id: String,
    },
    default: "https://placeholder/400",
  },
  firstName: { type: String },
  lastName: { type: String },
  gender: { type: String, enum: ['Male', 'Female'] },
  birthDate: { type: Date },
  phoneNumber: { type: String },
  height: { type: String },
  maritalStatus: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed'] },
  tagline: { type: String, maxlength: 120 },
  hobby: { type: String, default: 'uknown' },

  interests: [{
    type: String,
    enum: [
      'Photography',
      'Shopping',
      'Karaoke',
      'Yoga',
      'Cooking',
      'Tennis',
      'Running',
      'Swimming',
      'Art',
      'Travelling',
      'Extreme Sports',
      'Music',
      'Drinking',
      'Video Games',
    ],
    validate: {
      validator: function(interests) {
        // Ensure no duplicate interests
        return new Set(interests).size === interests.length;
      },
      message: 'Duplicate interests are not allowed'
    } 
  }],

  religiosity: {
    muslimSect: { type: String, enum: ['Sunni', 'Shia', 'Other'], required: true },
    isConvert: { type: String, enum: ['Yes', 'No'], required: true },
    religiousPractice: { type: String, enum: ['Strict', 'Moderate', 'Liberal'], required: true },
    doYouPray: { type: String, enum: ['Regularly', 'Occasionally', 'Rarely'], required: true },
    diet: { type: String, enum: ['Halal', 'Vegetarian', 'Vegan', 'Non-Vegetarian'], required: true },
    doYouSmoke: { type: String, enum: ['Yes', 'No'], required: true },
    hasTattoos: { type: String, enum: ['Yes', 'No'], required: true },
  },

  marriageIntentions: {
    lookingToMarry: { type: Boolean, required: true },
    willingToRelocate: { type: Boolean, required: true },
    wantsChildren: { type: Boolean, required: true },
    livingArrangments: { type: String, enum: [''] },
    iceBreaker: { type: String, maxlength: 120 },
  },

  languageAndEthnicity: {
    languages: { type: [String], required: true },
    ethnicGroup: { type: String, required: true },
    ethnicOrigin: { type: String, required: true },
    biography: { type: String, maxlength: 500 },
  },

  educationAndCareer: {
    profession: { type: String, required: true },
    education: { type: String, enum: ['Primary/Elementary', 'High School', 'Bachelor\'s', 'Master\'s', 'PhD'], required: true },
    jobTitle: { type: String, required: true },
  },
}, { timestamps: true });

export default mongoose.model("ProfileData", profileDetailesSchema);
