import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: 'Sender is required!',
      ref: 'User',
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: 'Recipient is required!',
      ref: 'User',
    },
    text: {
      type: String,
      required: 'Message text is required!',
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Message', messageSchema);