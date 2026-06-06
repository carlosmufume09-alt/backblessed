const cloudinary = require('../config/cloudinary');

const UPLOAD_FOLDER = 'shells-fashion';

const uploadFromBuffer = (buffer, originalname) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: UPLOAD_FOLDER,
        resource_type: 'image',
        public_id: `product-${Date.now()}`
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

const getImageDetails = async (publicId) => {
  return cloudinary.api.resource(publicId, { resource_type: 'image' });
};

const getOptimizedUrl = (publicId) => {
  // f_auto: escolhe automaticamente o melhor formato (WebP, AVIF, etc.)
  // q_auto: ajusta a qualidade automaticamente para menor tamanho
  return cloudinary.url(publicId, {
    fetch_format: 'auto',
    quality: 'auto',
    secure: true
  });
};

const deleteByUrl = async (imageUrl) => {
  if (!imageUrl || !imageUrl.includes('res.cloudinary.com')) {
    return;
  }

  const publicId = cloudinary.utils.public_id_from_url(imageUrl);
  if (!publicId) return;

  await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
};

module.exports = {
  uploadFromBuffer,
  getImageDetails,
  getOptimizedUrl,
  deleteByUrl
};
