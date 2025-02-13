import video from '../assets/0006bgvid.mp4'

const ShowcasePage = () => {
  return (
    <>
    <div className="h-screen text-white flex justify-center items-center text-heading-1 font-black">
      <video src={video} autoPlay muted loop className="absolute inset-0 object-cover w-full h-full z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-black/50 z-[1]"></div>
      <h1 className="relative z-[2] text-white">
        This is the Showcase Page
      </h1>
      </div>
      <section className="h-screen bg-black">
        
      </section>
    </>
  )
}

export default ShowcasePage