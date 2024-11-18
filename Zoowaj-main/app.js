import express from "express";
import cors from "cors";
import userRoutes from "./routes/user-routes.js";
import messageRoutes from "./routes/message-routes.js";
import googleAuthRoutes from "./routes/google-auth-routes.js";
import passport from "./passport.js";

import { notFound, mongoseErrors, developmentErrors, productionErrors } from "./handlers/errorHandlers.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup Cross Origin
app.use(cors());

// Bring in the routes
app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/auth", googleAuthRoutes);

app.use(passport.initialize());

// Setup Error Handlers
app.use(notFound);
app.use(mongoseErrors);
if (process.env.ENV === "DEVELOPMENT") {
  app.use(developmentErrors);
} else {
  app.use(productionErrors);
}

export default app;
