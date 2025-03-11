import { useImageGallery } from '../hooks/useImageGallery';
import ImageModal from './ImageModal';
import PropTypes from 'prop-types';

const GalleryImage = ({ src, alt, span, id, images }) => {
  const imageIndex = images.findIndex(img => img.id === id);
  const {
    currentImage,
    currentIndex,
    isModalOpen,
    handleOpen,
    handleClose,
    handleNext,
    handlePrev,
    totalImages
  } = useImageGallery(images, imageIndex);

  return (
    <>
      <div 
        className={`${span} overflow-hidden cursor-zoom-in`}
        onClick={() => handleOpen(imageIndex)}
      >
        <img 
          src={src} 
          alt={alt}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-in-out"
        />
      </div>

      <ImageModal
        isOpen={isModalOpen}
        onClose={handleClose}
        imageSrc={currentImage.src}
        imageAlt={currentImage.alt}
        onNext={handleNext}
        onPrev={handlePrev}
        currentIndex={currentIndex}
        totalImages={totalImages}
      />
    </>
  );
};

GalleryImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  span: PropTypes.string,
  id: PropTypes.number.isRequired,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      src: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
      span: PropTypes.string.isRequired,
    })
  ).isRequired
};

export default GalleryImage; 