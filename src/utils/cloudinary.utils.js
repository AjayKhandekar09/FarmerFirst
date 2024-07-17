import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'dvkaiwnzs',
  api_key: '391146242865275',
  api_secret: '9E6jsfKlorlIBzGJzhpYvWzWJzg',
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });

    // File has been uploaded
    console.log('File has been uploaded:', response.url);

    // Ensure the file exists before attempting to delete it
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log('File deleted successfully');
    } else {
      console.warn(`File already deleted or moved: ${localFilePath}`);
    }

    return response;
  } catch (error) {
    console.error('Cloudinary error:', error);

    // Ensure the file exists before attempting to delete it in case of error
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log('File deleted successfully after error');
    } else {
      console.warn(`File already deleted or moved after error: ${localFilePath}`);
    }

    return null;
  }
};

export { uploadOnCloudinary };
