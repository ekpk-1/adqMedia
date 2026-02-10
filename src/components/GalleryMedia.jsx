import { useImageGallery } from "../hooks/useImageGallery";
import ImageModal from "./ImageModal";
import PropTypes from "prop-types";

const GalleryMedia = ({ src, alt, span, id, media, type, poster }) => {
    const mediaIndex = media.findIndex((item) => item.id === id);
    const {
        currentImage,
        currentIndex,
        isModalOpen,
        handleOpen,
        handleClose,
        handleNext,
        handlePrev,
        totalImages,
    } = useImageGallery(media, mediaIndex);

    const isVideo = type === "video";

    return (
        <>
            <div
                className={`${span} overflow-hidden cursor-zoom-in relative ${isVideo ? "group" : ""}`}
                onClick={() => handleOpen(mediaIndex)}
                role="button"
                tabIndex={0}
                aria-label={`View ${isVideo ? "video" : "image"}: ${alt}`}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleOpen(mediaIndex);
                    }
                }}
            >
                {isVideo ? (
                    <>
                        <video
                            src={src}
                            poster={poster}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            muted
                            loop
                            playsInline
                            onMouseEnter={(e) => e.target.play()}
                            onMouseLeave={(e) => e.target.pause()}
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                                <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-1" />
                            </div>
                        </div>
                    </>
                ) : (
                    <img
                        src={src}
                        alt={alt}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-in-out cursor-pointer"
                    />
                )}
            </div>

            <ImageModal
                isOpen={isModalOpen}
                onClose={handleClose}
                item={currentImage}
                onNext={handleNext}
                onPrev={handlePrev}
                currentIndex={currentIndex}
                totalItems={totalImages}
            />
        </>
    );
};

GalleryMedia.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    span: PropTypes.string,
    id: PropTypes.number.isRequired,
    type: PropTypes.oneOf(["image", "video"]).isRequired,
    media: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            type: PropTypes.string.isRequired,
            src: PropTypes.string.isRequired,
            alt: PropTypes.string.isRequired,
            span: PropTypes.string.isRequired,
        }),
    ).isRequired,
};

export default GalleryMedia;
