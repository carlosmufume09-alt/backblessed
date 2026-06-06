/**
 * Script de teste Cloudinary — upload, metadados e transformação.
 * Executar: node scripts/cloudinary-onboarding.js
 */
require('dotenv').config();
const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const DEMO_IMAGE_URL =
  'https://res.cloudinary.com/demo/image/upload/sample.jpg';

async function main() {
  console.log('1. Fazendo upload da imagem demo...\n');

  const uploadResult = await cloudinary.uploader.upload(DEMO_IMAGE_URL, {
    folder: 'shells-fashion-test'
  });

  console.log('Secure URL:', uploadResult.secure_url);
  console.log('Public ID:', uploadResult.public_id);
  console.log('');

  console.log('2. Buscando metadados...\n');

  const details = await cloudinary.api.resource(uploadResult.public_id);

  console.log('Width:', details.width);
  console.log('Height:', details.height);
  console.log('Format:', details.format);
  console.log('Bytes:', details.bytes);
  console.log('');

  // f_auto + q_auto
  const transformedUrl = cloudinary.url(uploadResult.public_id, {
    fetch_format: 'auto',
    quality: 'auto',
    secure: true
  });

  console.log(
    'Done! Click link below to see optimized version of the image. Check the size and the format.'
  );
  console.log('Transformed URL:', transformedUrl);
}

main().catch((err) => {
  console.error('Erro:', err.message || err);
  process.exit(1);
});
