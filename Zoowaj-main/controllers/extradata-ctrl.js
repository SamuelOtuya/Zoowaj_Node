import { StatusCodes } from "http-status-codes";
import ExtraData from "../models/ExtraData.js";

const postExtraData = async (req, res) => {
  try {
    const data = req.body;

    if (Object.keys(data) === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "No data provided" });
    }

    const savedData = await ExtraData.create(data);

    res.status(StatusCodes.OK).json({ savedData });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An error occurred processing your request" });
  }
};

export default postExtraData;
