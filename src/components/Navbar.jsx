import { Link } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.5,
        ease: [0.83, 0, 0.17, 1]
      }
    },
    open: {
      opacity: 1,
      x: "0%",
      transition: {
        duration: 0.5,
        ease: [0.83, 0, 0.17, 1]
      }
    }
  }

  const linkVariants = {
    closed: {
      opacity: 0,
      y: 50
    },
    open: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.25 + (i * 0.1),
        duration: 0.5,
        ease: [0.83, 0, 0.17, 1]
      }
    })
  }

  return (
    <>
      <header className= 'w-full py-6 sm:px-16 px-5 flex justify-between items-center bg-black/50 z-20 fixed top-0 left-0 right-0 max-sm:bg-black/0 max-sm:z-40'>
        <nav className='Container flex w-full screen-max-width items-center max-sm:justify-between'>
            <div className='max-sm:mt-2 max-sm:ml-1'>
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
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className='hover:bg-red-100 transition-color duration-300 transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) bg-red-400 rounded-full w-10 h-10 flex-col justify-center items-center hidden max-sm:flex relative mr-1'
              >
                <span className={`ease-in-out-circ absolute h-[2px] w-7 rounded-full bg-white transition-all duration-300 2xl:w-9 
                  ${isOpen ? 'translate-y-0 rotate-45' : '-translate-y-1 rotate-0'}`}>
                </span>
                <span className={`ease-in-out-circ absolute h-[2px] w-7 rounded-full bg-white transition-all duration-300 2xl:w-9 
                  ${isOpen ? 'translate-y-0 -rotate-45' : 'translate-y-1 rotate-0'}`}>
                </span>
              </motion.button>  
        </nav>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 bg-black/50 z-30 flex flex-col justify-center items-center"
          >
            {/* <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-5 hover:bg-red-100 transition-color duration-300 bg-red-400 rounded-full w-10 h-10 flex justify-center items-center"
            >
              <span className="rotate-45 h-[2px] w-7 absolute bg-white"></span>
              <span className="-rotate-45 h-[2px] w-7 absolute bg-white"></span>
            </motion.button> */}

            <nav className="flex flex-col items-center gap-8">
              {['Home', 'Showcase', 'Services'].map((item, i) => (
                <motion.div
                  custom={i}
                  variants={linkVariants}
                  key={item}
                  className="overflow-hidden"
                >
                  <Link
                    to={item === 'Home' ? '/' : item.toLowerCase()}
                    onClick={() => setIsOpen(false)}
                    className="text-4xl font-bebas-neue text-white hover:text-red-400 transition-all duration-300"
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.button
              variants={linkVariants}
              custom={4}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="mt-12 rounded-full bg-white px-8 py-3 hover:bg-red-400 transition-colors duration-300"
            >
              <span className="text-black font-medium">Get in touch</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar;