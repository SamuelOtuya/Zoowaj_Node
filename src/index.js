/* eslint-disable no-undef */
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { createServer } from 'http';
import setupSocket from './socket.js';
import app from './app.js';
import logger from './logger/logger.js';

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => logger.info('MongoDB Connected!'))
  .catch((err) => logger.error('Mongoose Connection ERROR: ' + err.message));

// Create HTTP server and set up Socket.io
const server = createServer(app);
setupSocket(server);

// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});
