import React from 'react';
import { Scissors, Layers } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-2">
            <div class="bg-primary/10 p-2 rounded-lg">
              <Scissors className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">16:9 Batch Cropper</h1>
              <p class="text-xs text-gray-500">Cắt ảnh tự động & đóng gói ZIP</p>
            </div>
          </div>
          <div class="flex items-center text-sm text-gray-500 gap-1">
             <Layers className="w-4 h-4" />
             <span>Auto-Center Crop</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
