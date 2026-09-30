import React, { useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Lightbox({
  isOpen,
  currentWork,
  items,
  onClose,
  onNavigate,
  lang,
  content = {},
}) {
  const isRTL = lang === 'ar';

  const currentIndex = items.findIndex((item) => item.id === currentWork?.id);
  const totalItems = items.length;

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(items[currentIndex - 1]);
    } else {
      onNavigate(items[totalItems - 1]); // Loop around
    }
  }, [currentIndex, items, onNavigate, totalItems]);

  const handleNext = useCallback(() => {
    if (currentIndex < totalItems - 1) {
      onNavigate(items[currentIndex + 1]);
    } else {
      onNavigate(items[0]); // Loop around
    }
  }, [currentIndex, items, onNavigate, totalItems]);

  const closeBtnRef = useRef(null);
  const prevBtnRef = useRef(null);
  const nextBtnRef = useRef(null);

  // Keyboard navigation, focus trapping, and scroll locking
  useEffect(() => {
    if (!isOpen) return;

    const previousActiveElement = document.activeElement;

    // Focus close button upon opening
    const timer = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 40);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (isRTL) handlePrev();
        else handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (isRTL) handleNext();
        else handlePrev();
      } else if (e.key === 'Tab') {
        // Focus trapping within lightbox controls
        const focusableElements = [
          closeBtnRef.current,
          prevBtnRef.current,
          nextBtnRef.current,
        ].filter(Boolean);

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus();
      }
    };
  }, [isOpen, onClose, handleNext, handlePrev, isRTL]);

  // Touch swipe support for mobile
  const [touchStart, setTouchStart] = React.useState(null);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 45;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        // Swiped left
        if (isRTL) handlePrev();
        else handleNext();
      } else {
        // Swiped right
        if (isRTL) handleNext();
        else handlePrev();
      }
    }
    setTouchStart(null);
  };

  if (!isOpen || !currentWork) return null;

  const formattedIndex = String(currentIndex + 1).padStart(2, '0');
  const formattedTotal = String(totalItems).padStart(2, '0');

  return (
    <div
      id="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={currentWork.title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/90 backdrop-blur-xl transition-all duration-300 animate-in fade-in"
      onClick={onClose}
    >
      {/* Stage Container */}
      <div
        className="relative w-full h-full max-w-6xl p-4 sm:p-6 md:p-8 flex flex-col justify-between z-10"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Top Control Bar: Index/Category & Close Button */}
        <div className="flex items-center justify-between text-white pt-1">
          {/* Index & Factual Metadata Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/10 border border-white/20 text-white/90 select-none">
            <span className="font-mono text-[#60A5FA] font-bold">
              {formattedIndex} / {formattedTotal}
            </span>
            <span className="text-white/20">·</span>
            <span className="text-white/80 text-[11px] truncate max-w-[200px] sm:max-w-xs">
              {currentWork.category}
            </span>
          </div>

          {/* Close Action */}
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="p-2.5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA] active:scale-95"
            aria-label={content?.close || (isRTL ? 'إغلاق' : 'Close')}
          >
            <X size={18} />
          </button>
        </div>

        {/* Center Optical Stage: Artwork & Lateral Navigation Controls */}
        <div className="relative flex-1 flex items-center justify-center my-2 sm:my-4 overflow-hidden">
          {/* Previous Button */}
          <button
            ref={prevBtnRef}
            type="button"
            onClick={handlePrev}
            className="absolute start-2 sm:start-4 z-20 glass-dark-control p-3 sm:p-3.5 text-[#FAF8F5]/80 hover:text-white rounded-full transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-95 shadow-md"
            aria-label={content?.prev || (isRTL ? 'السابق' : 'Previous')}
          >
            {isRTL ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
          </button>

          {/* Artwork Stage Container */}
          <div className="relative max-w-full max-h-[62vh] sm:max-h-[68vh] md:max-h-[72vh] flex items-center justify-center p-1 sm:p-2 rounded-2xl bg-[#131714]/60 border border-white/10 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.7)]">
            <img
              src={currentWork?.image}
              alt={currentWork?.title || ''}
              className={`max-w-full max-h-[60vh] sm:max-h-[66vh] md:max-h-[70vh] object-contain rounded-xl transition-all duration-300 ${
                currentWork?.aspectRatio === 'vertical' ? 'aspect-[3/4]' : 'aspect-square'
              }`}
            />
          </div>

          {/* Next Button */}
          <button
            ref={nextBtnRef}
            type="button"
            onClick={handleNext}
            className="absolute end-2 sm:end-4 z-20 glass-dark-control p-3 sm:p-3.5 text-[#FAF8F5]/80 hover:text-white rounded-full transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-95 shadow-md"
            aria-label={content?.next || (isRTL ? 'التالي' : 'Next')}
          >
            {isRTL ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
          </button>
        </div>

        {/* Bottom Editorial Caption */}
        <div className="text-center text-[#FAF8F5] px-4 max-w-2xl mx-auto pb-1 select-none">
          <h4
            className={`text-base sm:text-lg md:text-xl font-bold tracking-tight text-white ${
              isRTL ? 'font-display-ar' : 'font-display-en'
            }`}
          >
            {currentWork.title}
          </h4>
          <p className="text-xs sm:text-sm text-[#FAF8F5]/70 mt-1 leading-relaxed font-normal">
            {currentWork.description}
          </p>
        </div>
      </div>
    </div>
  );
}
