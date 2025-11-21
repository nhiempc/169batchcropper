export interface ProcessedImage {
  id: string;
  originalFile: File;
  originalUrl: string;
  croppedUrl: string | null;
  croppedBlob: Blob | null;
  status: 'pending' | 'processing' | 'done' | 'error';
}

export interface CropDimensions {
  sx: number;
  sy: number;
  sWidth: number;
  sHeight: number;
  dWidth: number;
  dHeight: number;
}
