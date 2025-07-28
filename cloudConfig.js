const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET,
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'swiftRooms_DEV',
      allowedFormats:["png","jpg","jpeg"],
      public_id: (req, file) => {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000);
        return `image_${timestamp}_${random}`;
      }      
    },
  });

  module.exports={
    cloudinary,
    storage,
  }