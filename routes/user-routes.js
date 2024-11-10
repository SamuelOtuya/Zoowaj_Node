import express from "express";
import registerUser from "../conrollers/register-ctrl.js";
import postExtraData from "../conrollers/extradata-ctrl.js";

const router = express.Router();

router.route("/register").post(registerUser);

router.route("/extra-data").post(postExtraData);

export default router;
