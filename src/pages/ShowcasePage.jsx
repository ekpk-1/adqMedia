import video from '../assets/0006bgvid.mp4'

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
        <div className="container mx-auto">
          <div className="grid grid-cols-4 lg:grid-cols-12 gap-4 md:gap-8">
            {/* Featured Image - Full Width */}
            <div className="col-span-4 lg:col-span-12 aspect-[16/9] overflow-hidden">
              <img 
                src="https://dummyimage.com/600x400/d6d6d6/000000.jpg&text=placeholder" 
                alt="Gallery 1"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-in-out"
              />
            </div>
            
            {/* Two Column Layout */}
            <div className="col-span-4 lg:col-span-8 aspect-[4/3] overflow-hidden">
              <img 
                src="https://dummyimage.com/600x400/d6d6d6/000000.jpg&text=placeholder" 
                alt="Gallery 2"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-in-out"
              />
            </div>
            <div className="col-span-4 lg:col-span-4 aspect-[3/4] overflow-hidden">
              <img 
                src="https://dummyimage.com/600x400/d6d6d6/000000.jpg&text=placeholder" 
                alt="Gallery 3"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-in-out"
              />
            </div>
            
            {/* Three Column Layout */}
            <div className="col-span-4 aspect-square overflow-hidden">
              <img 
                src="https://dummyimage.com/600x400/d6d6d6/000000.jpg&text=placeholder" 
                alt="Gallery 4"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-in-out"
              />
            </div>
            <div className="col-span-4 aspect-square overflow-hidden">
              <img 
                src="https://dummyimage.com/600x400/d6d6d6/000000.jpg&text=placeholder" 
                alt="Gallery 5"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-in-out"
              />
            </div>
            <div className="col-span-4 aspect-square overflow-hidden">
              <img 
                src="https://dummyimage.com/600x400/d6d6d6/000000.jpg&text=placeholder" 
                alt="Gallery 6"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-in-out"
              />
            </div>
            
            {/* Four Column Layout */}
            <div className="col-span-3 aspect-square overflow-hidden">
              <img 
                src="https://dummyimage.com/600x400/d6d6d6/000000.jpg&text=placeholder" 
                alt="Gallery 4"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-in-out"
              />
            </div>
            <div className="col-span-3 aspect-square overflow-hidden">
              <img 
                src="https://dummyimage.com/600x400/d6d6d6/000000.jpg&text=placeholder" 
                alt="Gallery 5"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-in-out"
              />
            </div>
            <div className="col-span-3 aspect-square overflow-hidden">
              <img 
                src="https://dummyimage.com/600x400/d6d6d6/000000.jpg&text=placeholder" 
                alt="Gallery 6"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-in-out"
              />
            </div>
            <div className="col-span-3 aspect-square overflow-hidden">
              <img 
                src="https://dummyimage.com/600x400/d6d6d6/000000.jpg&text=placeholder" 
                alt="Gallery 6"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-in-out"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ShowcasePage