import { acostarImages } from "../constants/acostarImages";
import GalleryImage from "../components/GalleryImage";
import { dayonestudioImages } from "../constants/dayonestudioImages";
import { pakenhamcarcoImages } from "../constants/pakenhamcarcoImages";

const CommercialPage = () => {
    return (
        <>
            <section className="min-h-screen bg-black py-24">
                <div className="container mx-auto px-8">
                    <h1 className="text-white text-heading-1 font-black text-xl xl:text-6xl lg:text-4xl md:text-3xl mt-10 mb-16">
                        Commercial Projects
                    </h1>
                    <div className="grid grid-cols-12 gap-4 lg:gap-8 grid-flow-dense my-10">
                        <div className="col-span-4 max-sm:col-span-12">
                            <h2 className="text-white text-heading-2 font-black text-xl xl:text-5xl lg:text-4xl md:text-3xl">
                                Pakenham Carco
                            </h2>
                        </div>
                        {pakenhamcarcoImages.map((image) => (
                            <GalleryImage
                                key={image.id}
                                {...image}
                                images={pakenhamcarcoImages}
                            />
                        ))}
                    </div>
                    <div className="grid grid-cols-12 gap-4 lg:gap-8 grid-flow-dense my-10 mb-20 max-sm:my-6">
                        <div className="col-span-4 max-sm:col-span-12">
                            <h2 className="text-white text-heading-2 font-black text-xl xl:text-5xl lg:text-4xl md:text-3xl">
                                Acostar Logistics
                            </h2>
                            {/* some commerical work flavour text */}
                            <p></p>
                        </div>
                        {acostarImages.map((image) => (
                            <GalleryImage
                                key={image.id}
                                {...image}
                                images={acostarImages}
                            />
                        ))}
                    </div>
                    <div className="grid grid-cols-12 gap-4 lg:gap-8 grid-flow-dense my-10">
                        <div className="col-span-4 max-sm:col-span-12">
                            <h2 className="text-white text-heading-2 font-black text-xl xl:text-5xl lg:text-4xl md:text-3xl">
                                Day Ones Studio
                            </h2>
                        </div>
                        {dayonestudioImages.map((image) => (
                            <GalleryImage
                                key={image.id}
                                {...image}
                                images={dayonestudioImages}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default CommercialPage;
