import { StatusCodes } from "http-status-codes";
import ExtraData from "../models/ProfileDetails.js";
import cloudinary from "../utils/cloudinary.js";

const postExtraData = async (req, res) => {
  try {
    const { files, body } = req;

    if (!files || Object.keys(files).length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "No files uploaded" });
    }

    const profilePhoto = files.profilePhoto ? files.profilePhoto[0] : null;
    const coverPhotos = files.coverPhotos || [];

    // Upload profile photo to Cloudinary
    let profilePhotoData = null;
    if (profilePhoto) {
      const uploadResult = await cloudinary.uploader.upload(profilePhoto.path, {
        folder: "profile_photos",
      });
      profilePhotoData = { url: uploadResult.secure_url, public_id: uploadResult.public_id };
    }

    // Upload cover photos to Cloudinary
    const coverPhotosData = [];
    for (const photo of coverPhotos) {
      const uploadResult = await cloudinary.uploader.upload(photo.path, {
        folder: "cover_photos",
      });
      coverPhotosData.push({ url: uploadResult.secure_url, public_id: uploadResult.public_id });
    }

    // Prepare the document to save
    const data = {
      ...body,
      profilePhoto: profilePhotoData,
      coverPhotos: coverPhotosData,
    };

    const savedData = await ExtraData.create(data);

    res.status(StatusCodes.OK).json({ savedData });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An error occurred processing your request" });
  }
};

export default postExtraData;
