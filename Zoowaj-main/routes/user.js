import { Router } from "express";
import { catchErrors } from "../handlers/errorHandlers.js";
import { register, login } from "../controllers/userController.js";

const router = Router();

router.post("/login", catchErrors(login));
router.post("/register", catchErrors(register));

export default router;
