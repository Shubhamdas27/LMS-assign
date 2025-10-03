const cloudinary = require("cloudinary").v2;

/**
 * Cloudinary Configuration
 * For storing videos and documents
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload file to Cloudinary
 * @param {string} filePath - Local file path
 * @param {string} folder - Folder name in Cloudinary
 * @param {string} resourceType - 'image', 'video', 'raw', 'auto'
 */
const uploadToCloudinary = async (
  filePath,
  folder = "lms",
  resourceType = "auto"
) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: resourceType,
      timeout: 120000, // 2 minutes timeout for large files
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      duration: result.duration || null,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload file to Cloudinary");
  }
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Public ID of the file
 * @param {string} resourceType - 'image', 'video', 'raw'
 */
const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return true;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return false;
  }
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary,
};
