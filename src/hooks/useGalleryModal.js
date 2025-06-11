import { useState } from 'react';

export const useGalleryModal = (items, initialIndex = 0) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const currentItem = items[currentIndex];

  const handleOpen = (index) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return {
    currentItem,
    currentIndex,
    isModalOpen,
    handleOpen,
    handleClose,
    handleNext,
    handlePrev,
    totalItems: items.length
  };
}; 