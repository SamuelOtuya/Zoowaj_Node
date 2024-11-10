import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";

// routes imports
import UserRoutes from "../routes/user-routes.js";

dotenv.config();

const app = express();

const server = http.createServer(app);
const io = new Server(server);

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome");
});

// routes
app.use("/api/v1/auth", UserRoutes);

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
