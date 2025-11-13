import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "../layouts/Layout";
import ServicesPage from "../pages/ServicesPage";
import ShowcasePage from "../pages/ShowcasePage";
import CommercialPage from "../pages/CommercialPage";
import { AnimatePresence } from "framer-motion";
import AboutMePage from "../pages/AboutMePage";

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Layout />}>
                    <Route index element={<ShowcasePage />} />
                    <Route path="services" element={<ServicesPage />} />
                    <Route path="showcase" element={<ShowcasePage />} />
                    <Route path="commercial" element={<CommercialPage />} />
                    <Route path="about" element={<AboutMePage />} />
                </Route>
            </Routes>
        </AnimatePresence>
    );
}

export default AnimatedRoutes;
