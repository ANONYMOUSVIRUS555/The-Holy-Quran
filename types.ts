export interface SurahInfo {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface ApiAyah {
  number: number;
  audio?: string;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
}

export interface SurahEdition {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
  revelationType: string;
  ayahs: ApiAyah[];
  edition: {
    identifier: string;
    language: string;
    name: string;
    englishName: string;
    format: string;
    type: string;
  };
}

export interface CombinedAyahData {
  number: number;
  numberInSurah: number;
  text: string;
  audio: string;
  tafsir: string;
}

export interface SurahDetail {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
  revelationType: string;
  ayahs: CombinedAyahData[];
}

export interface Bookmark {
  surahNumber: number;
  surahName: string;
  ayahNumberInSurah: number;
  text: string;
  ayahNumberGlobal: number; // For a stable, unique key
}
