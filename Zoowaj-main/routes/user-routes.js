import express from "express";
import registerUser from "../controllers/register-ctrl.js";
import postExtraData from "../controllers/profiledetails-ctrl.js";
import loginUser from "../controllers/login-ctrl.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").posy(loginUser);
router.route("/extra-data").post(postExtraData);

export default router;
