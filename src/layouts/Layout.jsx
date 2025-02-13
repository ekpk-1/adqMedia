import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import { motion, useIsPresent } from "framer-motion";
import CamCorners from "../components/CamCorners";

export default function Layout() {
  const isPresent = useIsPresent();

  return (
    <div className="bg-black">
      <CamCorners />
      <Navbar />
      <Outlet />
      {/* Putting the motion div here will add the page transitions for all routes */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        exit={{ scaleX: 1 }}
        transition={{ duration: 1, ease: [0.83, 0, 0.17, 1] }}
        style={{ originX: isPresent ? 0 : 1 }}
        className="fixed top-0 left-0 h-screen w-screen bg-white flex justify-center items-center text-black z-50"
      >
        <a className='text-black font-bold text-5xl relative hover:text-red-400 transition-all duration-300'>
            ADQ 
            <span className='absolute -top-2 -right-3 w-4 h-4 bg-red-400 rounded-full'></span>
        </a>
        <CamCorners />
      </motion.div>
    </div>
  );
}
