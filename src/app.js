import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import devRoutes from './routes/dev.route.js';
import messageRoutes from './routes/message.route.js';
import googleAuthRoutes from './routes/google-auth.route.js';
import passport from './utils/passport.js';
import fs from 'fs';

import requestLogger from './utils/requestLogger.js';
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Setup Cross Origin
app.use(cors());

const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Apply request logging middleware
app.use(requestLogger);

// Bring in the routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/dev', devRoutes);
app.use('/api/v1/message', messageRoutes);
app.use('/api/v1/auth', googleAuthRoutes);

app.use(passport.initialize());

// Setup Error Handlers
app.use(errorHandler);

export default app;
