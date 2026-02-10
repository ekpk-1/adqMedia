import { clients } from "../constants/clients";
import { Link } from "react-router-dom";

const CommercialPage = () => {
    return (
        <>
            <section className="min-h-screen bg-black py-24">
                <div className="container mx-auto px-8">
                    <h1 className="text-white text-heading-1 font-black text-xl xl:text-6xl lg:text-4xl md:text-3xl mt-10 mb-16">
                        Commercial Projects
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                        {clients.map((client) => (
                            <Link
                                key={client.slug}
                                to={`/commercial/${client.slug}`}
                                className="group relative overflow-hidden rounded-[16px] aspect-[9/16] cursor-pointer"
                                role="article"
                                aria-label={`View ${client.name} project`}
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        e.currentTarget.click();
                                    }
                                }}
                            >
                                <img
                                    src={client.thumbnail}
                                    alt={client.name}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-100 group-hover:opacity-90 transition-opacity duration-300" />
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h2 className="text-white text-2xl md:text-3xl lg:text-2xl/8">
                                        {client.name}
                                    </h2>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default CommercialPage;
