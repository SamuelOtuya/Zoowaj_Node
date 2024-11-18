import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: "User is required!",
      ref: "User",
    },
    recepient: {
      type: mongoose.Schema.Types.ObjectId,
      required: "Recepient is required!",
      ref: "User",
    },
    message: {
      type: String, // Encrypted message content
      required: "Message is required!",
    },
    encryptedKey: {
      type: String, // Optional: Encrypted AES key (if using hybrid encryption)
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
