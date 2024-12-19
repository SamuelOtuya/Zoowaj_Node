import {
  BadRequestError,
  InternalServerError,
} from '../errors/application-error.js';
import logger from '../logger/logger.js';
import CloudinaryService from './cloudinary.service.js';

export default class MediaService {
  static uploadProfilePhoto = async (profilePhotoPath) => {
    try {
      const { url, public_id } = await CloudinaryService.upload(
        profilePhotoPath,
        'profile_photos',
      );

      return {
        url,
        public_id,
      };
    } catch (error) {
      logger.error('Profile photo upload failed:', error);
      throw new InternalServerError('Profile photo upload failed');
    }
  };

  static uploadCoverPhotos = async (coverPhotos) => {
    if (!Array.isArray(coverPhotos) || coverPhotos.length === 0) {
      throw new BadRequestError('No cover photos provided for upload.');
    }

    const coverPhotosArray = [];
    const uploadErrors = [];

    for (const photo of coverPhotos) {
      try {
        // Assuming 'photo' contains the necessary data (e.g., file path or buffer)
        const { url, public_id } = await CloudinaryService.upload(
          photo.path,
          'cover_photos',
        );
        coverPhotosArray.push({
          url,
          public_id,
        });
      } catch (error) {
        logger.error('Cover photo upload failed:', error);
        uploadErrors.push({ photo, error: error.message }); // Collect errors related to specific photos
      }
    }

    if (uploadErrors.length > 0) {
      logger.warn(
        `Some cover photos failed to upload: ${JSON.stringify(uploadErrors)}`,
      );
      throw new InternalServerError('Some cover photos failed to upload.');
    }

    return coverPhotosArray; // Return successfully uploaded photos
  };
}
