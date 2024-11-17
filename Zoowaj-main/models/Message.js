import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  user: {
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
    type: String,
    required: "Message is required!",
  },
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);

export default Message;
