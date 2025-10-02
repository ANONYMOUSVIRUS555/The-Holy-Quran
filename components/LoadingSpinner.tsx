
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="text-emerald-700 text-lg">...جاري التحميل</p>
    </div>
  );
};

export default LoadingSpinner;
