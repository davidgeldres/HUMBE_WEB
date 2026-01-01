import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function Layout({ children }) {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const isAlbums = location.pathname.startsWith('/albums');
    const isInfo = location.pathname === '/info';
    const isFavorites = location.pathname === '/favoritas';
    const isFullScreen = isHome || isAlbums || isFavorites;

    return (
        <div className="min-h-[111.11vh] w-full bg-black text-white font-sans selection:bg-cyan-500/30 selection:text-white relative">
            {/* Navbar Overlay - Always Fixed to prevent layout jumps */}
            <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
                <div className="pointer-events-auto">
                    <Navbar />
                </div>
            </div>

            {/* Layout Main Container */}
            <main className={`${isFullScreen ? 'h-[111.11vh] lg:overflow-hidden p-0' : 'flex-1 pt-24 pb-20 px-0 min-h-[85vh] flex flex-col'} relative z-10`}>
                <div className="w-full h-full flex-1 flex flex-col">
                    {children || <Outlet />}
                </div>
            </main>

            {!isFullScreen && !isInfo && <Footer />}
        </div>
    );
}
