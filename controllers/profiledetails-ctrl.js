import { StatusCodes } from "http-status-codes";
import ExtraData from "../models/ProfileDetails.js";
import cloudinary from "../utils/cloudinary.js";

export const postProfileDetails = async (req, res) => {
  try {
    const { files, body } = req;

    if (!files || (!files.profilePhoto && !files.coverPhotos)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "No valid files uploaded" });
    }

    const profilePhoto = files.profilePhoto?.[0]; // Use optional chaining
    const coverPhotos = files.coverPhotos || [];

    let profilePhotoData = null;
    const coverPhotosData = [];

    if (profilePhoto) {
      try {
        const uploadResult = await cloudinary.uploader.upload(profilePhoto.path, {
          folder: "profile_photos",
        });
        profilePhotoData = {
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
        };
      } catch (error) {
        console.error("Profile photo upload failed:", error);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ msg: "Profile photo upload failed" });
      }
    }

    for (const photo of coverPhotos) {
      try {
        const uploadResult = await cloudinary.uploader.upload(photo.path, {
          folder: "cover_photos",
        });
        coverPhotosData.push({
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
        });
      } catch (error) {
        console.error("Cover photo upload failed:", error);
        // Continue processing other files instead of throwing an error
      }
    }

    const data = {
      ...body,
      profilePhoto: profilePhotoData,
      coverPhotos: coverPhotosData,
    };

    const savedData = await ExtraData.create(data);
    res.status(StatusCodes.CREATED).json({ savedData });
  } catch (error) {
    console.error("Error in postProfileDetails:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An error occurred processing your request" });
  }
};


export const getProfileDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!userId) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "User ID is required" });
    }

    // Fetch profile details
    const profile = await ExtraData.findOne({ userId });

    // Check if profile exists
    if (!profile) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Profile not found for the given User ID" });
    }

    // Send response
    res.status(StatusCodes.OK).json({ profile });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An error occurred while fetching the profile" });
  }
};

export const addLike = async (req, res) => {
  try {
    const { profileId } = req.params;
    const { userId } = req.body;

    const profile = await ExtraData.findOneAndUpdate(
      { _id: profileId, likes: { $ne: userId } }, // Check if userId is not already in likes
      { $push: { likes: userId } },
      { new: true } // Return the updated document
    );

    if (!profile) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "You have already liked this profile" });
    }

    res
      .status(StatusCodes.OK)
      .json({ msg: "Profile liked successfully", likes: profile.likes.length });
  } catch (error) {
    console.error("Error in addLike:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An error occurred while liking the profile" });
  }
};


export const removeLike = async (req, res) => {
  try {
    const { profileId } = req.params;
    const { userId } = req.body;

    const profile = await ExtraData.findById(profileId);

    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }

    profile.likes = profile.likes.filter((id) => id.toString() !== userId);
    await profile.save();

    res.status(200).json({ msg: "Like removed successfully", likes: profile.likes.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "An error occurred while removing the like" });
  }
};


export const addFavorite = async (req, res) => {
  try {
    const { profileId } = req.params;
    const { userId } = req.body; // ID of the user adding the profile to favorites

    const profile = await ExtraData.findById(profileId);

    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }

    // Check if user already favorited the profile
    if (profile.favorites.includes(userId)) {
      return res.status(400).json({ msg: "This profile is already in your favorites" });
    }

    profile.favorites.push(userId);
    await profile.save();

    res.status(200).json({ msg: "Profile added to favorites", favorites: profile.favorites.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "An error occurred while adding the profile to favorites" });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { profileId } = req.params;
    const { userId } = req.body;

    const profile = await ExtraData.findById(profileId);

    if (!profile) {
      return res.status(404).json({ msg: "Profile not found" });
    }

    profile.favorites = profile.favorites.filter((id) => id.toString() !== userId);
    await profile.save();

    res.status(200).json({ msg: "Profile removed from favorites", favorites: profile.favorites.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "An error occurred while removing the profile from favorites" });
  }
};