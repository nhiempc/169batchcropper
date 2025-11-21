import { CropDimensions } from '../types';

export const calculateCropDimensions = (imgWidth: number, imgHeight: number): CropDimensions => {
  const targetRatio = 16 / 9;
  const currentRatio = imgWidth / imgHeight;

  let sWidth = imgWidth;
  let sHeight = imgHeight;
  let sx = 0;
  let sy = 0;

  if (currentRatio > targetRatio) {
    // Image is too wide, crop sides
    sWidth = imgHeight * targetRatio;
    sx = (imgWidth - sWidth) / 2;
  } else {
    // Image is too tall, crop top/bottom
    sHeight = imgWidth / targetRatio;
    sy = (imgHeight - sHeight) / 2;
  }

  return {
    sx,
    sy,
    sWidth,
    sHeight,
    dWidth: sWidth,
    dHeight: sHeight
  };
};

export const cropImageTo16by9 = (imageUrl: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      const { sx, sy, sWidth, sHeight, dWidth, dHeight } = calculateCropDimensions(img.width, img.height);

      canvas.width = dWidth;
      canvas.height = dHeight;

      // Draw the cropped portion
      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, dWidth, dHeight);

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas to Blob failed'));
        }
      }, 'image/jpeg', 0.95);
    };
    img.onerror = (err) => reject(err);
    img.src = imageUrl;
  });
};
