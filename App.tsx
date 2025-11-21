import React, { useState, useCallback } from 'react';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { v4 as uuidv4 } from 'uuid';
import { Download, Trash2, Play, Loader2 } from 'lucide-react';
import Header from './components/Header';
import DropZone from './components/DropZone';
import ImageList from './components/ImageList';
import { ProcessedImage } from './types';
import { cropImageTo16by9 } from './utils/imageProcessing';

const App: React.FC = () => {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFilesSelected = useCallback((fileList: FileList | null) => {
    if (!fileList) return;

    const newImages: ProcessedImage[] = Array.from(fileList).map((file) => ({
      id: uuidv4(),
      originalFile: file,
      originalUrl: URL.createObjectURL(file),
      croppedUrl: null,
      croppedBlob: null,
      status: 'pending',
    }));

    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const handleClear = useCallback(() => {
    // Revoke object URLs to avoid memory leaks
    images.forEach((img) => {
      URL.revokeObjectURL(img.originalUrl);
      if (img.croppedUrl) URL.revokeObjectURL(img.croppedUrl);
    });
    setImages([]);
    setProgress(0);
  }, [images]);

  const processImages = async () => {
    setIsProcessing(true);
    setProgress(0);
    const total = images.filter(i => i.status !== 'done').length;
    let completed = 0;

    const updatedImages = [...images];

    // Process sequentially to keep UI responsive and track progress accurately
    for (let i = 0; i < updatedImages.length; i++) {
      if (updatedImages[i].status === 'done') continue;

      // Update status to processing
      updatedImages[i] = { ...updatedImages[i], status: 'processing' };
      setImages([...updatedImages]);

      try {
        const blob = await cropImageTo16by9(updatedImages[i].originalUrl);
        const url = URL.createObjectURL(blob);

        updatedImages[i] = {
          ...updatedImages[i],
          croppedBlob: blob,
          croppedUrl: url,
          status: 'done',
        };
      } catch (error) {
        console.error(`Failed to crop image ${updatedImages[i].originalFile.name}`, error);
        updatedImages[i] = { ...updatedImages[i], status: 'error' };
      }

      completed++;
      setProgress(Math.round((completed / total) * 100));
      setImages([...updatedImages]);
    }

    setIsProcessing(false);
  };

  const downloadZip = async () => {
    const zip = new JSZip();
    const folder = zip.folder("16-9-images");

    if (!folder) return;

    images.forEach((img) => {
      if (img.status === 'done' && img.croppedBlob) {
        // Keep original name
        folder.file(img.originalFile.name, img.croppedBlob);
      }
    });

    const content = await zip.generateAsync({ type: "blob" });
    // Handle file-saver import which might be a function or an object depending on the environment
    const save = (FileSaver as any).saveAs || FileSaver;
    save(content, "cropped_images_16_9.zip");
  };

  const pendingCount = images.filter(i => i.status === 'pending').length;
  const doneCount = images.filter(i => i.status === 'done').length;

  return (
    <div class="min-h-screen bg-gray-50 pb-20">
      <Header />

      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Actions Bar */}
        <div class="mb-8 flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
            <div>
                <h2 class="text-2xl font-bold text-gray-900">Upload & Process</h2>
                <p class="text-gray-500">Đã tải lên {images.length} ảnh.</p>
            </div>
            
            <div class="flex gap-3">
                 {images.length > 0 && (
                    <button
                        onClick={handleClear}
                        disabled={isProcessing}
                        class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Xóa tất cả
                    </button>
                )}
                
                {pendingCount > 0 && (
                    <button
                        onClick={processImages}
                        disabled={isProcessing}
                        class="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin"/> : <Play className="w-4 h-4 fill-current" />}
                        {isProcessing ? 'Đang xử lý...' : 'Bắt đầu Crop'}
                    </button>
                )}

                {doneCount > 0 && !isProcessing && pendingCount === 0 && (
                     <button
                        onClick={downloadZip}
                        class="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-sm transition-all active:scale-95 animate-pulse-subtle"
                    >
                        <Download className="w-4 h-4" />
                        Tải xuống ZIP ({doneCount})
                    </button>
                )}
            </div>
        </div>

        {/* Upload Area */}
        {images.length === 0 ? (
             <div class="max-w-2xl mx-auto mt-12">
                <DropZone onFilesSelected={handleFilesSelected} />
             </div>
        ) : (
             <div class="grid gap-6">
                 <div class="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div class="flex items-center gap-4 w-full">
                         <DropZone onFilesSelected={handleFilesSelected} />
                    </div>
                 </div>
                 
                 {isProcessing && (
                    <div class="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                        <div class="bg-primary h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                 )}

                 <ImageList images={images} />
             </div>
        )}

      </main>
    </div>
  );
};

export default App;