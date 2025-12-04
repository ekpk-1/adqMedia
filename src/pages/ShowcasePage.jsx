import { useState } from "react";
import video from "../assets/0006bgvid.mp4";
import { galleryImages } from "../constants/galleryImages";
import { galleryVideos } from "../constants/galleryVideos";
import GalleryImage from "../components/GalleryImage";
import GalleryVideo from "../components/GalleryVideo";

const ShowcasePage = () => {
    const [activeTab, setActiveTab] = useState("photos");

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
                        WebkitUserSelect: "none",
                        msUserSelect: "none",
                        userSelect: "none",
                    }}
                />
                <div className="absolute inset-0 bg-black/50 z-[1]"></div>
            </div>
            <section className="min-h-screen bg-black py-12">
                <div className="container mx-auto w-full  px-8">
                    <div className="flex justify-center mb-12 w-full">
                        <div className="inline-flex rounded-lg bg-white/10 p-1">
                            <button
                                onClick={() => setActiveTab("photos")}
                                className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                                    activeTab === "photos"
                                        ? "bg-white text-black"
                                        : "text-white hover:bg-white/10"
                                }`}
                            >
                                Photos
                            </button>
                            <button
                                onClick={() => setActiveTab("videos")}
                                className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                                    activeTab === "videos"
                                        ? "bg-white text-black"
                                        : "text-white hover:bg-white/10"
                                }`}
                            >
                                Videos
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-12 gap-8 max-sm:gap-4 w-full">
                        {activeTab === "photos"
                            ? galleryImages.map((image, index) => (
                                  <GalleryImage
                                      key={index}
                                      {...image}
                                      id={index}
                                      images={galleryImages.map((img, idx) => ({
                                          ...img,
                                          id: idx,
                                      }))}
                                  />
                              ))
                            : galleryVideos.map((video) => (
                                  <GalleryVideo
                                      key={video.id}
                                      {...video}
                                      videos={galleryVideos}
                                  />
                              ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default ShowcasePage;
