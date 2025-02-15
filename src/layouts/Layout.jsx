import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion, useIsPresent } from "framer-motion";
import CamCorners from "../components/CamCorners";

export default function Layout() {
  const isPresent = useIsPresent();

  return (
    <div className="bg-black">
      <CamCorners />
      <Navbar />
      <Outlet />
      {/* Camera shutter transition effect */}
      <motion.div
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 1, ease: [0.83, 0, 0.17, 1] }}
        style={{ originY: isPresent ? 1 : 0 }}
        className="fixed top-0 left-0 h-screen w-screen bg-white flex justify-center items-center text-black z-50"
      >
        <a className='text-black font-bold text-5xl relative hover:text-red-400 transition-all duration-300 font-bebas-neue'>
            ADQ 
            <span className='absolute -top-3 -right-4 w-2.5 h-2.5 bg-red-400 rounded-full'></span>
        </a>
        <CamCorners />
      </motion.div>
    </div>
  );
}
