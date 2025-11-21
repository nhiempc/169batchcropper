import React from 'react';
import { ProcessedImage } from '../types';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';

interface ImageListProps {
  images: ProcessedImage[];
}

const ImageList: React.FC<ImageListProps> = ({ images }) => {
  if (images.length === 0) return null;

  return (
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-8">
      {images.map((img) => (
        <div key={img.id} class="group relative aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          {/* Image Display */}
          <img
            src={img.croppedUrl || img.originalUrl}
            alt={img.originalFile.name}
            class={`w-full h-full object-cover transition-opacity duration-300 ${img.status === 'pending' ? 'opacity-50 grayscale' : 'opacity-100'}`}
          />

          {/* Status Overlay */}
          <div class="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
          
          {/* Status Icon */}
          <div class="absolute top-2 right-2">
            {img.status === 'processing' && (
              <div class="bg-white/90 p-1 rounded-full shadow-sm backdrop-blur-sm">
                <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
              </div>
            )}
            {img.status === 'done' && (
              <div class="bg-white/90 p-1 rounded-full shadow-sm backdrop-blur-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
            )}
            {img.status === 'error' && (
              <div class="bg-white/90 p-1 rounded-full shadow-sm backdrop-blur-sm">
                <AlertCircle className="w-4 h-4 text-red-500" />
              </div>
            )}
          </div>

          {/* Filename Badge */}
          <div class="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
             <p class="text-xs text-white truncate font-medium">{img.originalFile.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageList;
