import React, { useCallback, useState } from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';

interface DropZoneProps {
  onFilesSelected: (files: FileList | null) => void;
}

const DropZone: React.FC<DropZoneProps> = ({ onFilesSelected }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  }, [onFilesSelected]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
    }
  }, [onFilesSelected]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      class={`relative border-2 border-dashed rounded-xl p-10 transition-all duration-200 ease-in-out text-center cursor-pointer
        ${isDragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-gray-300 hover:border-primary/50 hover:bg-gray-50 bg-white'}
      `}
    >
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleInputChange}
        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div class="flex flex-col items-center justify-center gap-4 pointer-events-none">
        <div class={`p-4 rounded-full ${isDragging ? 'bg-primary/20' : 'bg-gray-100'}`}>
          {isDragging ? (
            <UploadCloud className="w-8 h-8 text-primary animate-bounce" />
          ) : (
            <ImageIcon className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <div>
          <p class="text-lg font-semibold text-gray-700">
            {isDragging ? 'Thả ảnh vào đây' : 'Kéo thả ảnh hoặc click để tải lên'}
          </p>
          <p class="text-sm text-gray-500 mt-1">Hỗ trợ JPG, PNG, WEBP (Không giới hạn số lượng)</p>
        </div>
      </div>
    </div>
  );
};

export default DropZone;
