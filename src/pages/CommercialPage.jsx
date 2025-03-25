import { commercialImages } from '../constants/commercialImages';
import GalleryImage from '../components/GalleryImage';

const CommercialPage = () => {
  return (
    <>
      
      <section className="min-h-screen bg-black py-24">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-12 gap-4 lg:gap-8 grid-flow-dense">
            <div className="col-span-4 max-sm:col-span-12">
              <h1 className="text-white text-heading-1 font-black text-xl xl:text-6xl lg:text-4xl md:text-3xl">
                Commercial Projects
              </h1>
              {/* some commerical work flavour text */}
              <p></p>
            </div>
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