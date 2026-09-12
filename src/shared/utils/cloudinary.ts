import { ENV } from '@/src/core/config/env';
import { AppError } from '@/src/core/api/errors';

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
}

/**
 * Upload thẳng 1 file ảnh lên Cloudinary từ client qua unsigned upload preset — không đi qua
 * backend Go. Cần NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME/NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET (xem .env.example).
 */
export async function uploadImageToCloudinary(
  file: File,
  onProgress?: (percent: number) => void
): Promise<CloudinaryUploadResult> {
  if (!ENV.CLOUDINARY_CLOUD_NAME || !ENV.CLOUDINARY_UPLOAD_PRESET) {
    throw new AppError(
      'Chưa cấu hình Cloudinary (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME / NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET).',
      0,
      'CLOUDINARY_NOT_CONFIGURED'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', ENV.CLOUDINARY_UPLOAD_PRESET);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(
      'POST',
      `https://api.cloudinary.com/v1_1/${ENV.CLOUDINARY_CLOUD_NAME}/image/upload`
    );

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText) as CloudinaryUploadResult);
      } else {
        reject(
          new AppError('Tải ảnh lên thất bại. Vui lòng thử lại.', xhr.status, 'CLOUDINARY_UPLOAD_FAILED')
        );
      }
    };

    xhr.onerror = () => {
      reject(new AppError('Không thể kết nối để tải ảnh lên.', 0, 'NETWORK_ERROR'));
    };

    xhr.send(formData);
  });
}
