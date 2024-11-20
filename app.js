import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user-routes.js';
import messageRoutes from './routes/message-routes.js';
import googleAuthRoutes from './routes/google-auth-routes.js';
import passport from './passport.js';

import {
  notFound,
  mongoseErrors,
  developmentErrors,
  productionErrors,
} from './errors/errorHandlers.js';
import { errorHandler, handle404Error } from './middlewares/errorHandler.js';
import requestLogger from './utils/requestLogger.js';

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
app.use(notFound);
app.use(mongoseErrors);
if (process.env.ENV === 'DEVELOPMENT') {
  app.use(developmentErrors);
} else {
  app.use(productionErrors);
}
// Handle undefined routes
app.use(handle404Error);
app.use(errorHandler);

export default app;
