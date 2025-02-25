import video from '../assets/0006bgvid.mp4'
import { galleryImages } from '../constants/galleryImages';
import GalleryImage from '../components/GalleryImage';

const ShowcasePage = () => {
  return (
    <>
    <div className="h-screen text-white flex justify-center items-center text-heading-1 font-black">
      <video 
        src={video} 
        autoPlay 
        muted 
        loop 
        playsInline
        disablePictureInPicture
        className="absolute inset-0 object-cover w-full h-full z-0 pointer-events-none" 
        style={{ 
          WebkitUserSelect: 'none',
          msUserSelect: 'none',
          userSelect: 'none',
        }}
      />
      <div className="absolute inset-0 bg-black/50 z-[1]"></div>
      </div>
      <section className="min-h-screen bg-black py-24">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-12 gap-8 grid-flow-dense">
            {galleryImages.map((image) => (
              <GalleryImage 
                key={image.id}
                {...image}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default ShowcasePage