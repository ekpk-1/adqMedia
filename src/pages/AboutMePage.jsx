import ContactForm from "../components/ContactForm";

const AboutMePage = () => {
    return (
        <>
            <section className="min-h-screen bg-black py-24">
                <div className="container mx-auto px-8 mt-12 text-white max-sm:mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* About Section */}
                        <div>
                            <h2 className="text-4xl font-black mb-8">
                                About Me
                            </h2>
                            <h3 className="text-2xl font-bold mb-6">
                                Alex Quach
                            </h3>

                            <div className="space-y-6">
                                <p className="text-lg">
                                    Alex is a professional car photographer and
                                    videographer based in Melbourne Australia.
                                    Fuelled by a strong passion for cars. I
                                    began my career in automotive photography
                                    and videography as a freelance creator mid
                                    2024. I have gained extensive experience
                                    with my own professional camera and
                                    equipment, enabling me to approach each
                                    project with the tools and expertise
                                    required to consistently deliver high
                                    quality results.
                                </p>

                                <p className="text-lg">
                                    Additionally, I have gained professional
                                    experience as a dealership photographer
                                    producing high quality photos for 500+ new
                                    and used vehicle listings. I have worked
                                    closely with multiple companies elevating
                                    their online presence in social media.
                                </p>

                                <p className="text-lg">
                                    My passion for luxury and performance cars
                                    serves as both inspiration and the
                                    foundation of my freelance work and I aspire
                                    to further cultivate this interest
                                    throughout my professional career.
                                </p>
                            </div>
                        </div>
                        <ContactForm colSpan="col-span-1" />
                    </div>
                </div>
            </section>
        </>
    );
};

export default AboutMePage;
