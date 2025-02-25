import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "../layouts/Layout";
import ServicesPage from "../pages/ServicesPage";
import ShowcasePage from "../pages/ShowcasePage";
import { AnimatePresence } from "framer-motion";

function AnimatedRoutes() {
    // Need useLocation for framer motion to know which page is current
    const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Layout />}>
            <Route index element={<ShowcasePage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="showcase" element={<ShowcasePage />} />
          </Route>
        </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
