import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows optional field
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId; // Password is required only if googleId is not present
      },
      select: false, // Exclude password from queries by default
    },
    subscribed: {
      type: Boolean,
      default: false,
    },
    extraData: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExtraData', // Reference to the ExtraData model
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user'
    },
  },
  { timestamps: true },
);

export default mongoose.model('User', userSchema);
