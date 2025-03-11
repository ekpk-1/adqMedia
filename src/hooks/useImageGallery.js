import { useState } from 'react';

export const useImageGallery = (images, initialIndex = 0) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const currentImage = images[currentIndex];

  const handleOpen = (index) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return {
    currentImage,
    currentIndex,
    isModalOpen,
    handleOpen,
    handleClose,
    handleNext,
    handlePrev,
    totalImages: images.length
  };
}; 