import { useParams, useNavigate, Link } from "react-router-dom";
import { clients } from "../constants/clients";
import GalleryMedia from "../components/GalleryMedia";

const ClientDetailPage = () => {
    const { clientSlug } = useParams();
    const navigate = useNavigate();

    const client = clients.find((c) => c.slug === clientSlug);

    if (!client) {
        return (
            <section className="min-h-screen bg-black py-24 flex items-center justify-center">
                <div className="container mx-auto px-8 text-center">
                    <h1 className="text-white text-4xl font-black mb-8">
                        Client Not Found
                    </h1>
                    <p className="text-white/70 text-lg mb-8">
                        The client project you&apos;re looking for doesn&apos;t
                        exist.
                    </p>
                    <Link
                        to="/commercial"
                        className="inline-block bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-white/90 transition-colors duration-300 cursor-pointer"
                    >
                        Back to Commercial Projects
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="min-h-screen bg-black py-24">
                <div className="container mx-auto px-8">
                    <button
                        onClick={() => navigate("/commercial")}
                        className="group flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300 mb-8 cursor-pointer"
                        aria-label="Back to commercial projects"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 19.5L8.25 12l7.5-7.5"
                            />
                        </svg>
                        <span className="font-semibold">
                            Back to Commercial Projects
                        </span>
                    </button>

                    <h1 className="text-white text-heading-1 font-black text-xl xl:text-6xl lg:text-4xl md:text-3xl mt-10 mb-16">
                        {client.name}
                    </h1>

                    <div className="grid grid-cols-12 gap-4 lg:gap-8 grid-flow-dense my-10">
                        {client.media.map((item) => (
                            <GalleryMedia
                                key={item.id}
                                {...item}
                                media={client.media}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default ClientDetailPage;
