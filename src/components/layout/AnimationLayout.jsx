import { useLocation, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Layout as BaseLayout } from './Layout';

export function AnimationLayout() {
    const location = useLocation();

    // Scroll to top on route change to prevent "black screen" if previous page was scrolled down
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <BaseLayout>
            <AnimatePresence mode="wait">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                    className="w-full h-full"
                >
                    <Outlet />
                </motion.div>
            </AnimatePresence>
        </BaseLayout>
    );
}
