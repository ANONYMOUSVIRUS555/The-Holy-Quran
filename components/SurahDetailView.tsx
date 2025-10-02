import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SurahDetail, CombinedAyahData } from '../types';
import AyahView from './AyahView';
import TafsirModal from './TafsirModal';
import { PlayIcon, PauseIcon } from './icons';

interface SurahDetailViewProps {
  surah: SurahDetail;
  onBack: () => void;
  isAyahBookmarked: (ayahNumberGlobal: number) => boolean;
  onToggleBookmark: (surahName: string, ayah: CombinedAyahData) => void;
  scrollToAyah: number | null;
  onScrollComplete: () => void;
}

const SurahDetailView: React.FC<SurahDetailViewProps> = ({ surah, onBack, isAyahBookmarked, onToggleBookmark, scrollToAyah, onScrollComplete }) => {
  const [selectedTafsir, setSelectedTafsir] = useState<string | null>(null);
  const [currentAyahIndex, setCurrentAyahIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (scrollToAyah) {
      const element = document.getElementById(`ayah-${scrollToAyah}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('highlight-ayah');
        setTimeout(() => {
            element.classList.remove('highlight-ayah');
        }, 2500);
      }
      onScrollComplete();
    }
  }, [scrollToAyah, surah, onScrollComplete]);

  const playAyah = useCallback((index: number) => {
    if (index >= 0 && index < surah.ayahs.length) {
      setCurrentAyahIndex(index);
      setIsPlaying(true);
    } else {
      // Surah finished
      setCurrentAyahIndex(null);
      setIsPlaying(false);
    }
  }, [surah.ayahs.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (isPlaying && currentAyahIndex !== null && audio) {
      const ayah = surah.ayahs[currentAyahIndex];
      if (audio.src !== ayah.audio) {
        audio.src = ayah.audio;
      }
      audio.play().catch(e => console.error("Audio play failed:", e));
    } else if (!isPlaying && audio) {
      audio.pause();
    }
  }, [isPlaying, currentAyahIndex, surah.ayahs]);
  
  const handleAudioEnded = () => {
    if (currentAyahIndex !== null) {
      playAyah(currentAyahIndex + 1);
    }
  };

  const handlePlayPauseSurah = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      playAyah(currentAyahIndex !== null ? currentAyahIndex : 0);
    }
  };

  const handleSelectAyah = (index: number) => {
    if (currentAyahIndex === index && isPlaying) {
      setIsPlaying(false);
    } else {
      playAyah(index);
    }
  };


  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
      <audio ref={audioRef} onEnded={handleAudioEnded} />
      <div className="text-center mb-8 border-b-2 border-emerald-200 pb-6">
        <h2 className="text-4xl font-amiri font-bold text-emerald-800">{surah.name}</h2>
        <p className="text-gray-500">{surah.englishName}</p>
        {surah.number !== 1 && surah.number !== 9 && (
          <p className="text-2xl font-amiri mt-6">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        )}
         <button
            onClick={handlePlayPauseSurah}
            className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-full flex items-center justify-center gap-2 mx-auto hover:bg-emerald-700 transition-colors duration-300 shadow-md"
            aria-label={isPlaying ? 'إيقاف' : 'تشغيل السورة'}
        >
            {isPlaying ? <PauseIcon className="w-6 h-6"/> : <PlayIcon className="w-6 h-6"/>}
            <span>{isPlaying ? 'إيقاف مؤقت' : 'تشغيل السورة'}</span>
        </button>
      </div>

      <div className="space-y-6">
        {surah.ayahs.map((ayah, index) => (
          <AyahView
            key={ayah.number}
            ayah={ayah}
            isPlaying={currentAyahIndex === index && isPlaying}
            isBookmarked={isAyahBookmarked(ayah.number)}
            onPlay={() => handleSelectAyah(index)}
            onShowTafsir={() => setSelectedTafsir(ayah.tafsir)}
            onToggleBookmark={() => onToggleBookmark(surah.name, ayah)}
          />
        ))}
      </div>

      {selectedTafsir && (
        <TafsirModal tafsir={selectedTafsir} onClose={() => setSelectedTafsir(null)} />
      )}
    </div>
  );
};

export default SurahDetailView;