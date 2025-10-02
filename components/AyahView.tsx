import React from 'react';
import { CombinedAyahData } from '../types';
import { PlayIcon, PauseIcon, BookIcon, BookmarkIcon, BookmarkFilledIcon } from './icons';

interface AyahViewProps {
  ayah: CombinedAyahData;
  isPlaying: boolean;
  isBookmarked: boolean;
  onPlay: () => void;
  onShowTafsir: () => void;
  onToggleBookmark: () => void;
}

const AyahView: React.FC<AyahViewProps> = ({ ayah, isPlaying, isBookmarked, onPlay, onShowTafsir, onToggleBookmark }) => {
  return (
    <div id={`ayah-${ayah.numberInSurah}`} className={`p-4 rounded-lg border-r-4 transition-all duration-300 ${isPlaying ? 'bg-emerald-100 border-emerald-500' : 'bg-transparent border-transparent'}`}>
      <div className="flex justify-between items-start">
        <p className="text-3xl font-amiri leading-loose text-right w-full">
          {ayah.text}
          <span className="text-xl text-emerald-600 font-sans font-bold select-none">
            &nbsp;({ayah.numberInSurah})&nbsp;
          </span>
        </p>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <button
          onClick={onPlay}
          className="p-2 rounded-full text-emerald-700 hover:bg-emerald-200 transition-colors"
          aria-label={isPlaying ? 'إيقاف' : 'تشغيل الآية'}
        >
          {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
        </button>
        <button
          onClick={onShowTafsir}
          className="p-2 rounded-full text-emerald-700 hover:bg-emerald-200 transition-colors"
          aria-label="عرض التفسير"
        >
          <BookIcon className="w-5 h-5" />
        </button>
        <button
          onClick={onToggleBookmark}
          className="p-2 rounded-full text-emerald-700 hover:bg-emerald-200 transition-colors"
          aria-label={isBookmarked ? 'إزالة من المحفوظات' : 'حفظ الآية'}
        >
          {isBookmarked ? <BookmarkFilledIcon className="w-5 h-5" /> : <BookmarkIcon className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

export default AyahView;