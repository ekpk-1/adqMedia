import ContactForm from "../components/ContactForm";
import socialMediaImage from "/gallery/servicePage/DSC08553.webp";
import preSaleCarImage from "/gallery/servicePage/DSC08745.webp";

const ServicesPage = () => {
    return (
        <>
            <section className="min-h-screen bg-black py-24">
                <div className="container mx-auto px-8 mt-12 text-white max-sm:mt-6">
                    <div className="space-y-12 lg:gap-12">
                        <h2 className="text-4xl font-black mb-8">Services</h2>
                        {/* Pre Sale Car Photography Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
                            <div>
                                <h3 className="text-2xl font-bold mb-6">
                                    Pre Sale Car Photography
                                </h3>

                                <div className="">
                                    <p className="text-lg mb-6">
                                        If you are looking for professional
                                        photos to help sell your car, you came
                                        to the right place! We offer a
                                        comprehensive photography service to
                                        help sell your car.
                                    </p>
                                    <h3 className="text-xl font-bold mb-3">
                                        Deliverables
                                    </h3>
                                    <p className="text-lg mb-6">
                                        Every car will have 50+ shots to ensure
                                        that no details are missed. We will
                                        provide you with a comprehensive set of
                                        photos to help sell your car.
                                    </p>

                                    <h3 className="text-xl font-bold mb-3">
                                        Location
                                    </h3>
                                    <p className="text-lg mb-6">
                                        We can photoshoot wherever is most
                                        convenient for you, whether at your home
                                        or a nice location closeby.
                                    </p>
                                </div>
                            </div>
                            <div className="">
                                <img
                                    src={preSaleCarImage}
                                    alt="Pre Sale Car Photography"
                                    className="w-full h-full object-cover top rounded-[16px]"
                                />
                            </div>
                        </div>
                        {/* Pre Sale Car Photography Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
                            <div>
                                <h3 className="text-2xl font-bold mb-6">
                                    Social Media Package
                                </h3>

                                <div className="">
                                    <p className="text-lg mb-6">
                                        Looking to enhance your automotive
                                        social media presence? We offer content
                                        that you can utilise for paid
                                        advertisement or organic reach.
                                    </p>
                                    <h3 className="text-xl font-bold mb-3">
                                        Video Examples
                                    </h3>
                                    <ul className="text-lg mb-6">
                                        <li>- Sales video</li>
                                        <li>- Customer&apos;s car showcase</li>
                                        <li>- Before and after showcase</li>
                                        <li>- Installation video</li>
                                    </ul>
                                    <h3 className="text-xl font-bold mb-3">
                                        Deliverables
                                    </h3>
                                    <p className="text-lg mb-6">
                                        We will provide you with 20+ Photos and
                                        1 Video reel for your social media.
                                    </p>

                                    <h3 className="text-xl font-bold mb-3">
                                        Location
                                    </h3>
                                    <p className="text-lg mb-6">
                                        We will come to your workshop, garage or
                                        warehouse, offering convenience at your
                                        door.
                                    </p>
                                </div>
                            </div>
                            <div className="">
                                <img
                                    src={socialMediaImage}
                                    alt="Pre Sale Car Photography"
                                    className="w-full h-full object-cover top rounded-[16px]"
                                />
                            </div>
                        </div>
                        <ContactForm />
                    </div>
                </div>
            </section>
        </>
    );
};

export default ServicesPage;
