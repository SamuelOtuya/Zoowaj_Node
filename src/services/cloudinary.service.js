import cloudinary from '../utils/cloudinary.js';

export default class CloudinaryService {
  /**
   * Uploads an image to Cloudinary.
   * @param {string} filePath - Path to the image file to upload.
   * @param {Object} options - Additional options for Cloudinary upload.
   * @returns {Promise<Object>} - The result of the upload.
   */
  static async upload(filePath, folder) {
    try {
      const uploadResult = await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: 'auto', // Automatically detect file type
      });
      const url = uploadResult.secure_url;
      const public_id = uploadResult.public_id;
      return { url, public_id };
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      throw new Error('Failed to upload image');
    }
  }

  /**
   * Deletes an image from Cloudinary.
   * @param {string} publicId - The public ID of the image to delete.
   * @returns {Promise<Object>} - The result of the deletion.
   */
  static async deleteImage(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      throw new Error('Failed to delete image');
    }
  }
}
