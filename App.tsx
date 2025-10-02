import React, { useState, useEffect, useCallback } from 'react';
import { getSurahList, getSurahDetail } from './services/quranService';
import { SurahInfo, SurahDetail as SurahDetailType, CombinedAyahData, Bookmark } from './types';
import SurahList from './components/SurahList';
import SurahDetailView from './components/SurahDetailView';
import LoadingSpinner from './components/LoadingSpinner';
import BookmarkView from './components/BookmarkView';
import { QuranIcon, BookmarkListIcon } from './components/icons';

const App: React.FC = () => {
  const [surahs, setSurahs] = useState<SurahInfo[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<SurahDetailType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [view, setView] = useState<'main' | 'bookmarks'>('main');
  const [scrollToAyah, setScrollToAyah] = useState<number | null>(null);

  useEffect(() => {
    try {
      const storedBookmarks = localStorage.getItem('quran-bookmarks');
      if (storedBookmarks) {
        setBookmarks(JSON.parse(storedBookmarks));
      }
    } catch (e) {
      console.error("Failed to load bookmarks from localStorage", e);
      setBookmarks([]);
    }
  }, []);

  useEffect(() => {
    try {
        localStorage.setItem('quran-bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
        console.error("Failed to save bookmarks to localStorage", e);
    }
  }, [bookmarks]);

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        setIsLoading(true);
        const surahList = await getSurahList();
        setSurahs(surahList);
      } catch (err) {
        setError('حدث خطأ أثناء تحميل قائمة السور. يرجى المحاولة مرة أخرى.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSurahs();
  }, []);

  const handleSelectSurah = useCallback(async (surahNumber: number) => {
    if (isLoadingDetail) return;
    try {
      setIsLoadingDetail(true);
      setError(null);
      const surahDetail = await getSurahDetail(surahNumber);
      setSelectedSurah(surahDetail);
      setView('main');
    } catch (err) {
      setError('حدث خطأ أثناء تحميل بيانات السورة. يرجى المحاولة مرة أخرى.');
      console.error(err);
    } finally {
      setIsLoadingDetail(false);
    }
  }, [isLoadingDetail]);

  const handleGoBack = () => {
    setSelectedSurah(null);
    setError(null);
    setView('main');
  };

  const handleShowBookmarks = () => {
    setView('bookmarks');
    setSelectedSurah(null);
  };
  
  const isAyahBookmarked = (ayahNumberGlobal: number) => {
    return bookmarks.some(b => b.ayahNumberGlobal === ayahNumberGlobal);
  };

  const handleToggleBookmark = (surahName: string, ayah: CombinedAyahData) => {
    setBookmarks(prev => {
        if (isAyahBookmarked(ayah.number)) {
            return prev.filter(b => b.ayahNumberGlobal !== ayah.number);
        } else {
            if (!selectedSurah) return prev;
            const newBookmark: Bookmark = {
                surahNumber: selectedSurah.number,
                surahName: surahName,
                ayahNumberInSurah: ayah.numberInSurah,
                text: ayah.text,
                ayahNumberGlobal: ayah.number,
            };
            return [...prev, newBookmark].sort((a,b) => a.ayahNumberGlobal - b.ayahNumberGlobal);
        }
    });
  };

  const handleRemoveBookmark = (ayahNumberGlobal: number) => {
    setBookmarks(prev => prev.filter(b => b.ayahNumberGlobal !== ayahNumberGlobal));
  };

  const handleGoToAyah = async (bookmark: Bookmark) => {
    setView('main');
    if (selectedSurah?.number === bookmark.surahNumber) {
        setScrollToAyah(bookmark.ayahNumberInSurah);
    } else {
        await handleSelectSurah(bookmark.surahNumber);
        setScrollToAyah(bookmark.ayahNumberInSurah);
    }
  };
  
  const handleScrollComplete = () => {
    setScrollToAyah(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
    }

    if (error && !isLoadingDetail) {
      return (
        <div className="text-center p-8">
          <p className="text-red-500 text-lg">{error}</p>
          <button
            onClick={handleGoBack}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition"
          >
            العودة
          </button>
        </div>
      );
    }
    
    if (view === 'bookmarks') {
      return <BookmarkView bookmarks={bookmarks} onGoToAyah={handleGoToAyah} onRemoveBookmark={handleRemoveBookmark} />;
    }

    if (isLoadingDetail) {
        return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
    }

    if (selectedSurah) {
      return <SurahDetailView 
        surah={selectedSurah} 
        onBack={handleGoBack}
        isAyahBookmarked={isAyahBookmarked}
        onToggleBookmark={handleToggleBookmark}
        scrollToAyah={scrollToAyah}
        onScrollComplete={handleScrollComplete}
      />;
    }

    return <SurahList surahs={surahs} onSelectSurah={handleSelectSurah} />;
  };

  return (
    <div className="min-h-screen bg-emerald-50 text-gray-800">
      <header className="bg-emerald-700 text-white shadow-md sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <QuranIcon className="w-8 h-8"/>
            <h1 className="text-2xl font-bold font-amiri">القرآن الكريم</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
                onClick={handleShowBookmarks}
                className="text-white hover:bg-emerald-600 rounded-full p-2 transition-colors duration-200"
                aria-label="الآيات المحفوظة"
            >
                <BookmarkListIcon className="w-6 h-6" />
            </button>
             {(selectedSurah || view === 'bookmarks') && (
                 <button
                 onClick={handleGoBack}
                 className="text-white hover:bg-emerald-600 rounded-full p-2 transition-colors duration-200"
                 aria-label="العودة إلى قائمة السور"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 12h14" />
                 </svg>
               </button>
            )}
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;