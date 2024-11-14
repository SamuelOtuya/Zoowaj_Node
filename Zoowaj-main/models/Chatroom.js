import mongoose from "mongoose";

const chatroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Name is required!",
  },
});

const Chatroom = mongoose.model("Chatroom", chatroomSchema);

export default Chatroom;