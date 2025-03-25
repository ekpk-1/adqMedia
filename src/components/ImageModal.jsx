import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { useSwipeable } from 'react-swipeable';

const ImageModal = memo(({ 
  isOpen, 
  onClose, 
  imageSrc, 
  imageAlt, 
  onNext, 
  onPrev, 
  currentIndex,
  totalImages 
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight') onNext();
    if (e.key === 'ArrowLeft') onPrev();
  }, [onClose, onNext, onPrev]);

  const handlers = useSwipeable({
    onSwipedLeft: onNext,
    onSwipedRight: onPrev,
    onSwiping: () => setIsDragging(true),
    onSwiped: () => setIsDragging(false),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
    trackTouch: true,
    delta: 50,
    swipeDuration: 300,
    rotationAngle: 0
  });

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 z-20 max-sm:z-[60]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-black/90"
        />

        {/* Exit Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[70] bg-black/50 p-3 hover:bg-white/10 rounded-full transition-colors duration-300 cursor-pointer"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="white"
            className="w-6 h-6"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Navigation Arrows */}
        <div className="absolute inset-0 flex items-center justify-between px-4 z-[60] max-sm:hidden">
          <button
            onClick={onPrev}
            className="bg-black/50 p-4 hover:bg-white/10 rounded-full transition-colors duration-300 cursor-pointer"
            aria-label="Previous image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="white"
              className="w-8 h-8"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          <button
            onClick={onNext}
            className="bg-black/50 p-4 hover:bg-white/10 rounded-full transition-colors duration-300 cursor-pointer"
            aria-label="Next image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="white"
              className="w-8 h-8"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>

        {/* Image Container */}
        <div
          {...handlers}
          className="absolute inset-0 flex items-center justify-center p-8 cursor-pointer"
        >
          <img
            src={imageSrc}
            alt={imageAlt}
            className={`max-w-full max-h-full w-auto h-auto object-contain select-none z-[60] ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            draggable="false"
          />
        </div>

        {/* Dots Navigation */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-[70] max-sm:hidden">
          {[...Array(totalImages)].map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                currentIndex === index ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Image ${index + 1} of ${totalImages}`}
            />
          ))}
        </div>
      </div>
    </AnimatePresence>
  );
});

ImageModal.displayName = 'ImageModal';

ImageModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  imageSrc: PropTypes.string.isRequired,
  imageAlt: PropTypes.string.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  currentIndex: PropTypes.number.isRequired,
  totalImages: PropTypes.number.isRequired
};

export default ImageModal; 