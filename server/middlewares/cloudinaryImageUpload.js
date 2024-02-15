import cloudinary from "cloudinary";

function cloudinaryImageUpload(image) {
  return async (req, res, next) => {
    const file = req.files;
    // incase user is not login yet (new user)
    req.user = req.user || {};

    try {
      if (file) {
        const result = await cloudinary.uploader.upload(
          file[image].tempFilePath
        );
        req.user[image] = {
          imageId: result.public_id,
          url: result.secure_url
        };
      }
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

export default cloudinaryImageUpload;
