import express from "express";
import registerUser from "../controllers/register-ctrl.js";
import postExtraData from "../controllers/profiledetails-ctrl.js";

const router = express.Router();

router.route("/register").post(registerUser);

router.route("/extra-data").post(postExtraData);

export default router;
