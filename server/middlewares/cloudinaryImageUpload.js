import cloudinary from "../config/cloudinary.config.js";

const cloudinaryImageUpload = async (req, res, next) => {
  const file = req.files;

  try {
    if (file) {
      const result = await cloudinary.uploader.upload(file.avatar.tempFilePath);
      req.user["avatar"] = {
        imageId: result.public_id,
        url: result.secure_url
      };
    }
    return next();
  } catch (error) {
    return next(error);
  }
};

export default cloudinaryImageUpload;
