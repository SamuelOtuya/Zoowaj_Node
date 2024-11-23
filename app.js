import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user-routes.js';
import messageRoutes from './routes/message-routes.js';
import googleAuthRoutes from './routes/google-auth-routes.js';
import passport from './utils/passport.js';

import requestLogger from './utils/requestLogger.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup Cross Origin
app.use(cors());

// Apply request logging middleware
app.use(requestLogger);

// Bring in the routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/message', messageRoutes);
app.use('/api/v1/auth', googleAuthRoutes);

app.use(passport.initialize());

// Setup Error Handlers
app.use(errorHandler);

export default app;
