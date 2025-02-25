const GalleryImage = ({ src, alt, span }) => {
  return (
    <div className={`${span} overflow-hidden`}>
      <img 
        src={src} 
        alt={alt}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-in-out"
      />
    </div>
  )
}

export default GalleryImage 