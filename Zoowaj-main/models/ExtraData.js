import mongoose from "mongoose";

const ExtraDataSchema = new mongoose.Schema({
  user_id: {
    type: String,
  },
  birth_date: {
    type: "string",
  },
  gender: {
    type: "string",
    enum: ["male", "female"],
  },
  hobby: {
    type: "string",
    default: "uknown",
  },
  cover_photo: {
    type: Object,
    img: {
      url: String,
      public_id: String,
    },
    default: "https://placeholder/400",
  },
});

export default mongoose.model("ExtraData", ExtraDataSchema);
