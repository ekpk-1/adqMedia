import { useState } from 'react';
import ImageModal from './ImageModal';
import { galleryImages } from '../constants/galleryImages';
import PropTypes from 'prop-types';

const GalleryImage = ({ src: initialSrc, alt: initialAlt, span, id: initialId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(initialSrc);
  const [currentAlt, setCurrentAlt] = useState(initialAlt);
  const [currentId, setCurrentId] = useState(initialId);

  const handleNext = () => {
    const currentIndex = galleryImages.findIndex(img => img.id === currentId);
    const nextIndex = (currentIndex + 1) % galleryImages.length;
    const nextImage = galleryImages[nextIndex];
    setCurrentSrc(nextImage.src);
    setCurrentAlt(nextImage.alt);
    setCurrentId(nextImage.id);
  };

  const handlePrev = () => {
    const currentIndex = galleryImages.findIndex(img => img.id === currentId);
    const prevIndex = currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1;
    const prevImage = galleryImages[prevIndex];
    setCurrentSrc(prevImage.src);
    setCurrentAlt(prevImage.alt);
    setCurrentId(prevImage.id);
  };

  return (
    <>
      <div 
        className={`${span} overflow-hidden cursor-zoom-in`}
        onClick={() => setIsModalOpen(true)}
      >
        <img 
          src={initialSrc} 
          alt={initialAlt}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-in-out"
        />
      </div>

      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageSrc={currentSrc}
        imageAlt={currentAlt}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </>
  );
};

GalleryImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  span: PropTypes.string,
  id: PropTypes.string.isRequired
};

export default GalleryImage 