import React from 'react';
import { Bookmark } from '../types';
import { TrashIcon, QuranIcon } from './icons';

interface BookmarkViewProps {
  bookmarks: Bookmark[];
  onGoToAyah: (bookmark: Bookmark) => void;
  onRemoveBookmark: (ayahNumberGlobal: number) => void;
}

const BookmarkView: React.FC<BookmarkViewProps> = ({ bookmarks, onGoToAyah, onRemoveBookmark }) => {
  if (bookmarks.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-md mt-4">
        <QuranIcon className="w-16 h-16 mx-auto text-emerald-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700">لم تقم بحفظ أي آية بعد</h2>
        <p className="text-gray-500 mt-2">يمكنك حفظ الآيات للرجوع إليها لاحقًا من صفحة السورة.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
        <h2 className="text-3xl font-amiri font-bold text-emerald-800 text-center mb-6 border-b pb-4">الآيات المحفوظة</h2>
        <div className="space-y-4">
            {bookmarks.map((bookmark) => (
                <div key={bookmark.ayahNumberGlobal} className="p-4 rounded-lg border-r-4 border-emerald-500 bg-emerald-50/50 flex justify-between items-start gap-4 hover:shadow-md transition-shadow">
                    <div className="flex-grow cursor-pointer" onClick={() => onGoToAyah(bookmark)}>
                        <p className="text-2xl font-amiri leading-relaxed">{bookmark.text}</p>
                        <p className="text-sm text-emerald-700 font-bold mt-2">
                            {`سورة ${bookmark.surahName} - آية ${bookmark.ayahNumberInSurah}`}
                        </p>
                    </div>
                    <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveBookmark(bookmark.ayahNumberGlobal)
                        }}
                        className="p-2 rounded-full text-red-500 hover:bg-red-100 transition-colors flex-shrink-0"
                        aria-label="إزالة من المحفوظات"
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            ))}
        </div>
    </div>
  );
};

export default BookmarkView;
