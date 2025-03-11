import { commercialImages } from '../constants/commercialImages';
import GalleryImage from '../components/GalleryImage';

const CommercialPage = () => {
  return (
    <>
      <div className="h-screen text-white flex justify-center items-center text-heading-1 font-black">
        <h1 className="text-white">
          Commercial Projects
        </h1>
      </div>
      
      <section className="min-h-screen bg-black py-24">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-12 gap-8 grid-flow-dense">
            {commercialImages.map((image) => (
              <GalleryImage 
                key={image.id}
                {...image}
                images={commercialImages}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default CommercialPage;