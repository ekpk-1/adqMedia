import { commercialImages } from '../constants/commercialImages';
import GalleryImage from '../components/GalleryImage';
import { commercialImages2 } from '../constants/commercialImages2';

const CommercialPage = () => {
  return (
    <>
      
      <section className="min-h-screen bg-black py-24">
        <div className="container mx-auto px-8">
              <h1 className="text-white text-heading-1 font-black text-xl xl:text-6xl lg:text-4xl md:text-3xl mt-10 mb-16">
                Commercial Projects
              </h1>
          <div className="grid grid-cols-12 gap-4 lg:gap-8 grid-flow-dense my-10 mb-20 max-sm:my-6">
            <div className="col-span-4 max-sm:col-span-12">
              <h2 className="text-white text-heading-2 font-black text-xl xl:text-5xl lg:text-4xl md:text-3xl">
                Acostar Logistics
              </h2>
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
          <div className="grid grid-cols-12 gap-4 lg:gap-8 grid-flow-dense my-10">
            <div className="col-span-4 max-sm:col-span-12">
              <h2 className="text-white text-heading-2 font-black text-xl xl:text-5xl lg:text-4xl md:text-3xl">
                Day Ones Studio
              </h2>
            </div>
            {commercialImages2.map((image) => (
                <GalleryImage 
                  key={image.id}
                  {...image}
                  images={commercialImages2}
                />
              ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default CommercialPage;