import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { humbeData } from '../data/humbeData';

export function Albums() {
    // Featured: Latest (First)
    const latestAlbum = humbeData[0];
    // Grid: The rest (Fits 2x2 nicely)
    const discography = humbeData.slice(1);

    return (
        <div className="w-full h-[111.11vh] bg-[#020617] text-white flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative no-scrollbar">

            {/* LEFT PANEL: Latest Release (Hero) */}
            <div className="relative w-full lg:w-[55%] min-h-[50vh] lg:h-full flex flex-col justify-center p-6 lg:p-12 overflow-hidden group shrink-0">

                {/* --- STARS & DEEP SPACE BACKGROUND --- */}
                <div className="absolute inset-0 bg-[#000000] z-0" />
                {/* Darker Deep Space Base Layer - mostly black with subtle deep blue hint */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_#0f172a_0%,_#020617_50%,_#000000_90%)] opacity-80 z-0" />

                {/* Stars - Increased count for "starry" feel */}
                <div className="absolute inset-0 z-10 w-full h-full opacity-80">
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
                    {[...Array(400)].map((_, i) => (
                        <div key={i} className="absolute bg-white rounded-full shadow-[0_0_4px_rgba(255,255,255,0.8)] animate-pulse"
                            style={{
                                top: Math.random() * 100 + '%',
                                left: Math.random() * 100 + '%',
                                width: Math.random() < 0.9 ? Math.random() < 0.5 ? '1px' : '2px' : '3px', // Mix of 1px, 2px, and some 3px bright stars
                                height: Math.random() < 0.9 ? Math.random() < 0.5 ? '1px' : '2px' : '3px',
                                opacity: Math.random() * 0.5 + 0.5, // Brighter base opacity (0.5 to 1.0)
                                animationDuration: Math.random() * 2 + 0.5 + 's'
                            }}
                        />
                    ))}
                </div>

                {/* Content Z-Index */}
                {/* Content Z-Index */}
                <div className="relative z-20 flex flex-col justify-center h-full max-w-5xl px-4 lg:px-0 mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col md:flex-row items-center gap-8 lg:gap-16"
                    >
                        {/* 3D Album Cover Card */}
                        <motion.div
                            className="relative shrink-0 group perspective-1000"
                            whileHover={{ scale: 1.05, rotateY: 5, rotateX: 5 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <div className="w-56 md:w-72 lg:w-96 aspect-square rounded-2xl shadow-2xl overflow-hidden border border-white/10 relative z-10 transition-shadow duration-500 hover:shadow-[0_30px_70px_rgba(255,255,255,0.1)]">
                                <img src={latestAlbum.cover} alt={latestAlbum.title} className="w-full h-full object-cover" />
                                {/* Gloss effect */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            </div>
                        </motion.div>

                        {/* Text Content */}
                        <div className="flex flex-col text-center md:text-left space-y-6 lg:space-y-8 relative">
                            {/* Subtle Watermark - Removed as requested */}


                            {/* Super-title */}
                            <div className="flex items-center justify-center md:justify-start gap-4">
                                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_15px_#22d3ee]" />
                                <span className="text-xs font-bold uppercase tracking-[0.4em] text-cyan-400 drop-shadow-sm">
                                    Nuevo Lanzamiento
                                </span>
                            </div>

                            {/* Main Title - Massive & Editorial */}
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/60 tracking-tighter leading-[0.9] drop-shadow-2xl">
                                {latestAlbum.title}
                            </h1>

                            {/* Metadata & Actions */}
                            <div className="space-y-8">
                                <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-3 text-sm text-zinc-300 font-medium tracking-wide uppercase">
                                    <span className="flex items-center gap-2">
                                        Humbe
                                    </span>
                                    <span className="w-px h-4 bg-white/20" />
                                    <span className="flex items-center gap-2">
                                        {latestAlbum.year}
                                    </span>
                                    <span className="w-px h-4 bg-white/20" />
                                    <span className="flex items-center gap-2">
                                        {latestAlbum.songs.length} canciones
                                    </span>
                                </div>
                                <Link to="/albums/dueno-del-cielo" className="inline-block">
                                    <button className="group relative px-10 py-4 bg-white text-black rounded-full font-bold tracking-widest text-xs overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]">
                                        <div className="relative flex items-center gap-3 transition-colors duration-300">
                                            <Play size={18} fill="currentColor" />
                                            ESCUCHAR AHORA
                                        </div>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* RIGHT PANEL: Discography Grid */}
            <div className="w-full lg:w-[45%] h-auto lg:h-full bg-[#05050a] lg:bg-[#05050a]/90 backdrop-blur-xl border-t lg:border-t-0 lg:border-l border-white/5 p-4 md:p-6 lg:p-4 flex flex-col z-20 pb-20 lg:pb-4">
                <div className="flex items-center gap-4 mb-4 pt-4 lg:pt-20 shrink-0">
                    <h3 className="text-xl font-bold text-white tracking-tight border-l-4 border-cyan-500 pl-4">
                        Discografía
                    </h3>
                </div>

                {/* Grid Container needs min-h-0 to allow scrolling/sizing within flex parent */}
                <div className="flex-1 min-h-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 lg:grid-rows-2 gap-3 lg:gap-2 h-auto lg:h-full">
                    {discography.map((album, index) => (
                        <Link
                            to={`/albums/${album.id}`}
                            key={album.id}
                            className="group relative rounded-xl overflow-hidden bg-white/5 border border-white/5 hover:border-white/20 transition-all duration-500 hover:shadow-2xl flex flex-col h-64 lg:h-full w-full"
                        >
                            {/* Image Container - flex-1 expands it to fill available space */}
                            <div className="flex-1 relative overflow-hidden w-full h-full">
                                <img
                                    src={album.cover}
                                    alt={album.title}
                                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${album.id === 'esencia' ? 'object-top' : 'object-center'
                                        }`}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center text-black shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300">
                                        <Play size={20} fill="currentColor" className="ml-1" />
                                    </div>
                                </div>
                            </div>

                            {/* Info Container - Fixed height dependent on content */}
                            <div className="relative p-3 z-10 bg-black/40 backdrop-blur-md border-t border-white/5 shrink-0">
                                <h4 className="font-bold text-white text-sm md:text-base truncate mb-1 group-hover:text-cyan-400 transition-colors">
                                    {album.title}
                                </h4>
                                <div className="flex flex-col gap-0.5 text-[10px] md:text-xs text-zinc-400">
                                    <span className="font-medium">Humbe</span>
                                    <span>{album.year} • {album.songs.length} canciones</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
