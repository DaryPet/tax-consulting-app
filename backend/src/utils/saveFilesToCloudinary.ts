import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

export const saveFileToCloudinary = async (
  file: Express.Multer.File,
  originalName: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file || !file.buffer) {
      return reject(new Error('Missing file buffer to upload to Cloudinary'));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'taxDocuments',
        public_id: originalName.split('.')[0],
        resource_type: 'raw',
      },
      (error, result) => {
        if (error) {
          console.error('Error while uploading to Cloudinary:', error);
          return reject(error);
        }
        if (result) {
          console.log(
            'Successfully uploaded to Cloudinary:',
            result.secure_url,
          );
          return resolve(result.secure_url);
        }
      },
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};
