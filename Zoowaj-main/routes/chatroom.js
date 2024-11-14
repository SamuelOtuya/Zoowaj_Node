import { Router } from "express";
import { catchErrors } from "../handlers/errorHandlers.js";
import { getAllChatrooms, createChatroom } from "../controllers/chatroomController.js";
import auth from "../middlewares/auth.js";

const router = Router();

router.get("/", auth, catchErrors(getAllChatrooms));
router.post("/", auth, catchErrors(createChatroom));

export default router;
