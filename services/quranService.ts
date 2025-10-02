
import { SurahInfo, SurahDetail, SurahEdition } from '../types';

const API_BASE_URL = 'https://api.alquran.cloud/v1';

export const getSurahList = async (): Promise<SurahInfo[]> => {
  const response = await fetch(`${API_BASE_URL}/meta`);
  if (!response.ok) {
    throw new Error('Failed to fetch Surah list');
  }
  const data = await response.json();
  return data.data.surahs.references;
};

export const getSurahDetail = async (surahNumber: number): Promise<SurahDetail> => {
  const editions = 'quran-uthmani,ar.alafasy,ar.muyassar';
  const response = await fetch(`${API_BASE_URL}/surah/${surahNumber}/editions/${editions}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch details for Surah ${surahNumber}`);
  }
  const data = await response.json();
  const editionsData: SurahEdition[] = data.data;

  const textEdition = editionsData[0];
  const audioEdition = editionsData[1];
  const tafsirEdition = editionsData[2];

  const combinedAyahs = textEdition.ayahs.map((textAyah, index) => {
    return {
      number: textAyah.number,
      numberInSurah: textAyah.numberInSurah,
      text: textAyah.text,
      audio: audioEdition.ayahs[index].audio || '',
      tafsir: tafsirEdition.ayahs[index].text,
    };
  });

  return {
    number: textEdition.number,
    name: textEdition.name,
    englishName: textEdition.englishName,
    numberOfAyahs: textEdition.numberOfAyahs,
    revelationType: textEdition.revelationType,
    ayahs: combinedAyahs,
  };
};
