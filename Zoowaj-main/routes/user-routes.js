import express from "express";
import { registerUser , loginUser} from "../controllers/user-ctrl.js";
import postExtraData from "../controllers/profiledetails-ctrl.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/extra-data").post(postExtraData);

export default router;
