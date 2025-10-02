
import React from 'react';
import { SurahInfo } from '../types';
import { KaabaIcon } from './icons';

interface SurahListProps {
  surahs: SurahInfo[];
  onSelectSurah: (surahNumber: number) => void;
}

const SurahList: React.FC<SurahListProps> = ({ surahs, onSelectSurah }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {surahs.map((surah) => (
        <div
          key={surah.number}
          onClick={() => onSelectSurah(surah.number)}
          className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between cursor-pointer hover:shadow-xl hover:border-emerald-500 border-2 border-transparent transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center">
            <div className="bg-emerald-100 text-emerald-700 w-12 h-12 flex items-center justify-center rounded-md font-bold text-lg ml-4">
              {surah.number}
            </div>
            <div>
              <h2 className="text-xl font-bold text-emerald-800">{surah.name}</h2>
              <p className="text-sm text-gray-500">{surah.englishName}</p>
            </div>
          </div>
          <div className="text-left">
            <p className="text-sm text-gray-600">{`آيات: ${surah.numberOfAyahs}`}</p>
            <div className="flex items-center justify-end gap-1 text-xs text-gray-500 mt-1">
              <span>{surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</span>
              <KaabaIcon className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SurahList;
