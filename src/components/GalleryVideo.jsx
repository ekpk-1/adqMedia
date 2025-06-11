import { useGalleryModal } from '../hooks/useGalleryModal';
import ImageModal from './ImageModal';
import PropTypes from 'prop-types';

const GalleryVideo = ({ src, alt, span, id, videos }) => {
  const videoIndex = videos.findIndex(vid => vid.id === id);
  const {
    currentItem,
    currentIndex,
    isModalOpen,
    handleOpen,
    handleClose,
    handleNext,
    handlePrev,
    totalItems
  } = useGalleryModal(videos, videoIndex);

  return (
    <>
      <div 
        className={`${span} relative group cursor-pointer overflow-hidden`}
        onClick={() => handleOpen(videoIndex)}
      >
        <video
          src={src}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          muted
          loop
          playsInline
          onMouseEnter={(e) => e.target.play()}
          onMouseLeave={(e) => e.target.pause()}
          aria-label={alt}
        />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-1" />
          </div>
        </div>
      </div>

      <ImageModal
        isOpen={isModalOpen}
        onClose={handleClose}
        item={currentItem}
        onNext={handleNext}
        onPrev={handlePrev}
        currentIndex={currentIndex}
        totalItems={totalItems}
      />
    </>
  );
};

GalleryVideo.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  span: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  videos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      src: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
      span: PropTypes.string.isRequired,
    })
  ).isRequired
};

export default GalleryVideo; 