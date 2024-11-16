import Chatroom from "../models/Chatroom.js";  // Import the Chatroom model

export const createChatroom = async (req, res) => {
  const { name } = req.body;

  // Validate that the chatroom name contains only alphabets and spaces
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(name)) throw "Chatroom name can contain only alphabets."; 

  // Check if the chatroom already exists with the given name
  const chatroomExists = await Chatroom.findOne({ name });
  if (chatroomExists) throw "Chatroom with that name already exists!";

  // Create a new Chatroom document
  const chatroom = new Chatroom({
    name,
  });

  // Save the new chatroom to the database
  await chatroom.save();

  res.json({
    message: "Chatroom created successfully!",
  });
};

export const getAllChatrooms = async (req, res) => {
  // Retrieve all chatrooms from the database
  const chatrooms = await Chatroom.find({});

  res.json(chatrooms);
};
