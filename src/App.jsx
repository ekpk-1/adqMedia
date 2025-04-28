import { BrowserRouter } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import AnimatedRoutes from "./components/AnimatedRoutes";
import { HelmetProvider } from 'react-helmet-async';

export default function App() {

  return (
    <HelmetProvider>
      {/* Preloader logic */}
      <AnimatePresence mode="wait">
      </AnimatePresence>

      <BrowserRouter>
        {/* Putting all the page components into a animated routes so we can use useLocation */}
        <AnimatedRoutes />
      </BrowserRouter>
    </HelmetProvider>
  );
}
