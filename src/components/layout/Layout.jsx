import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function Layout({ children }) {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const isAlbums = location.pathname.startsWith('/albums');
    const isFavorites = location.pathname === '/favoritas';
    const isFullScreen = isHome || isAlbums || isFavorites;

    return (
        <div className="min-h-[111.11vh] w-full bg-black text-white font-sans selection:bg-cyan-500/30 selection:text-white relative">
            {/* Navbar Overlay en Home y Albums para no ocupar espacio */}
            <div className={isFullScreen ? "fixed top-0 left-0 right-0 z-50 pointer-events-none" : "relative z-50"}>
                <div className="pointer-events-auto">
                    <Navbar />
                </div>
            </div>

            {/* Layout Main Container
                - Mobile (< lg): min-h-screen (crece con contenido), sin overflow-hidden (scrolleable)
                - Desktop (>= lg): h-screen (fijo), overflow-hidden (sin scroll)
             */}
            <main className={`${isFullScreen ? 'h-[111.11vh] lg:overflow-hidden p-0' : 'pt-0 pb-20 px-0 min-h-[85vh]'} relative z-10`}>
                <div className="w-full h-full">
                    {children || <Outlet />}
                </div>
            </main>

            {!isFullScreen && <Footer />}
        </div>
    );
}
