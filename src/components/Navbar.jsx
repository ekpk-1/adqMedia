import { Link } from 'react-router'
import { motion } from 'motion/react'

const Navbar = () => {
  return (
    <header className= 'w-full py-6 sm:px-16 px-5 flex justify-between items-center bg-black/50 z-20 fixed top-0 left-0 right-0 max-sm:bg-black/0'>
        <nav className='Container flex w-full screen-max-width items-center'>
            <div className=''>
                <a href='' className='text-white font-medium text-4xl relative hover:text-red-400 transition-all duration-300 font-bebas-neue'>
                    ADQ 
                    <span className='absolute -top-2 -right-3 w-2 h-2 bg-red-400 rounded-full'></span>
                </a>
            </div>

            <div className='flex flex-1 justify-center max-sm:hidden'>
                    <div className="px-5 text-medium cursor-pointer text-white hover:text-red-400 transition-all duration-300 uppercase">
                        <Link to="/">Home</Link>
                    </div>
                    <div className="px-5 text-medium cursor-pointer text-white hover:text-red-400 transition-all duration-300 uppercase">
                        <Link to="showcase">Showcase</Link>
                    </div>
                    <div className="px-5 text-medium cursor-pointer text-white hover:text-red-400 transition-all duration-300 uppercase">
                        <Link to="services">Services</Link>
                    </div>
            </div>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className='flex items-center gap-2 rounded-full bg-white px-4 py-2 hover:bg-red-400 transition-color duration-300 transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) max-sm:hidden'
            >
                <span className='text-black font-medium'>Get in touch</span>
            </motion.button>
        </nav>
    </header>
  )
}

export default Navbar;