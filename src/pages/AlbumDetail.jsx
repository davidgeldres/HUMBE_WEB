import { useParams, Navigate, Link } from 'react-router-dom';
import { useState, useEffect, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, FileText, Play, ArrowLeft, Image as ImageIcon, Save, Disc, Music, SkipForward, SkipBack, X, Trash2, Edit2 } from 'lucide-react';
import { humbeData } from '../data/humbeData';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { SpotifyPlayer } from '../components/SpotifyPlayer';
import { cn } from '../lib/utils';

const ALBUM_THEMES = {
    'dueno-del-cielo': {
        blob1: 'bg-cyan-400/20',
        blob2: 'bg-white/10',
        icon: 'text-cyan-500',
        activeText: 'text-cyan-400',
        bar: 'bg-cyan-500',
        barSecondary: 'bg-cyan-400',
        button: 'bg-cyan-900/40 text-cyan-400 hover:bg-cyan-900/60 border-cyan-500/20',
        selection: 'selection:bg-cyan-500/30',
        starColor: '34, 211, 238'
    },
    'armagedon': {
        blob1: 'bg-orange-600/20',
        blob2: 'bg-red-600/10',
        icon: 'text-orange-500',
        activeText: 'text-orange-400',
        bar: 'bg-orange-500',
        barSecondary: 'bg-orange-400',
        button: 'bg-orange-900/40 text-orange-400 hover:bg-orange-900/60 border-orange-500/20',
        selection: 'selection:bg-orange-500/30',
        starColor: '249, 115, 22'
    },
    'esencia': {
        blob1: 'bg-[rgba(107,90,0,0.2)]',
        blob2: 'bg-[rgba(107,90,0,0.1)]',
        icon: 'text-[rgb(107,90,0)]',
        activeText: 'text-[rgb(107,90,0)]',
        bar: 'bg-[rgb(107,90,0)]',
        barSecondary: 'bg-[rgb(107,90,0)]',
        button: 'bg-[rgba(107,90,0,0.2)] text-[rgb(107,90,0)] hover:bg-[rgba(107,90,0,0.4)] border-[rgba(107,90,0,0.2)]',
        selection: 'selection:bg-[rgba(107,90,0,0.3)]',
        starColor: '107, 90, 0'
    },
    'aurora': {
        blob1: 'bg-[rgba(111,58,70,0.4)]',
        blob2: 'bg-[rgba(111,58,70,0.2)]',
        icon: 'text-[rgb(111,58,70)]',
        activeText: 'text-[rgb(111,58,70)]',
        bar: 'bg-[rgb(111,58,70)]',
        barSecondary: 'bg-[rgb(111,58,70)]',
        button: 'bg-[rgba(111,58,70,0.2)] text-[rgb(111,58,70)] hover:bg-[rgba(111,58,70,0.4)] border-[rgba(111,58,70,0.2)]',
        selection: 'selection:bg-[rgba(111,58,70,0.3)]',
        starColor: '111, 58, 70'
    },
    'entropia': {
        blob1: 'bg-[rgba(14,106,99,0.4)]',
        blob2: 'bg-[rgba(14,106,99,0.2)]',
        icon: 'text-[rgb(14,106,99)]',
        activeText: 'text-[rgb(14,106,99)]',
        bar: 'bg-[rgb(14,106,99)]',
        barSecondary: 'bg-[rgb(14,106,99)]',
        button: 'bg-[rgba(14,106,99,0.2)] text-[rgb(14,106,99)] hover:bg-[rgba(14,106,99,0.4)] border-[rgba(14,106,99,0.2)]',
        selection: 'selection:bg-[rgba(14,106,99,0.3)]',
        starColor: '14, 106, 99'
    },
    'default': {
        blob1: 'bg-blue-500/20',
        blob2: 'bg-purple-600/10',
        icon: 'text-blue-500',
        activeText: 'text-blue-400',
        bar: 'bg-blue-500',
        barSecondary: 'bg-blue-400',
        button: 'bg-blue-900/40 text-blue-400 hover:bg-blue-900/60 border-blue-500/20',
        selection: 'selection:bg-blue-500/30',
        starColor: '59, 130, 246'
    }
};

export function AlbumDetail() {
    const { id } = useParams();
    const { favorites, toggleFavorite, notes, saveNote } = useAppContext();

    // State
    const [playingSong, setPlayingSong] = useState(null);
    const [activeNoteSong, setActiveNoteSong] = useState(null);
    const [noteText, setNoteText] = useState('');
    const [mediaList, setMediaList] = useState([]); // Array of { url, type, caption }
    const [viewingIndex, setViewingIndex] = useState(null); // Index of media open in lightbox
    const [isCaptionLocked, setIsCaptionLocked] = useState(false);
    const [embedController, setEmbedController] = useState(null);
    const [isSpotifyApiReady, setIsSpotifyApiReady] = useState(false);

    // Spotify IFrame API Loading
    useEffect(() => {
        const scriptId = 'spotify-player-api';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://open.spotify.com/embed/iframe-api/v1';
            script.async = true;
            document.body.appendChild(script);
        }

        window.onSpotifyIframeApiReady = (IFrameAPI) => {
            window.SpotifyIFrameAPI = IFrameAPI;
            setIsSpotifyApiReady(true);
        };

        // Check if already ready
        if (window.SpotifyIFrameAPI) {
            setIsSpotifyApiReady(true);
        }
    }, []);

    const normalizeStr = (str) => {
        if (!str) return '';
        return str.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim()
            .replace(/\s+/g, '-');
    };

    const album = humbeData.find(a => normalizeStr(a.id) === normalizeStr(id));
    const theme = (album ? ALBUM_THEMES[album.id] : null) || ALBUM_THEMES['default'];

    const handleSongClick = (song) => {
        if (!song) return;

        // If it's already the playing song, just ensure playback
        if (playingSong === song.id) {
            if (embedController) embedController.play();
            return;
        }

        // Prepare for new song
        // setEmbedController(null); // Don't nullify, component handles ref updates
        setActiveNoteSong(song);
        setPlayingSong(song.id);
    };

    const handleNextSong = () => {
        if (!album || !playingSong) return;
        const currentIndex = album.songs.findIndex(s => s.id === playingSong);
        const nextSong = album.songs[currentIndex + 1];
        if (nextSong) {
            handleSongClick(nextSong);
        }
    };

    const handlePrevSong = () => {
        if (!album || !playingSong) return;
        const currentIndex = album.songs.findIndex(s => s.id === playingSong);
        const prevSong = album.songs[currentIndex - 1];
        if (prevSong) {
            handleSongClick(prevSong);
        }
    };

    const handleSaveNote = () => {
        if (activeNoteSong) {
            saveNote(activeNoteSong.id, noteText, mediaList);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const type = file.type.startsWith('image/') ? 'image' : 'video';
        const reader = new FileReader();

        reader.onloadend = () => {
            setMediaList(prev => [...prev, { url: reader.result, type, caption: '' }]);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const removeMedia = (index) => {
        setMediaList(prev => prev.filter((_, i) => i !== index));
        if (viewingIndex === index) setViewingIndex(null);
    };

    const updateMediaCaption = (index, caption) => {
        setMediaList(prev => {
            const newList = [...prev];
            newList[index] = { ...newList[index], caption };
            return newList;
        });
    };

    // Use reduced stars count for performance
    const [stars] = useState(() => Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        top: Math.random() * 100 + '%',
        left: Math.random() * 100 + '%',
        size: Math.random() * 3 + 1 + 'px', // Slightly smaller
        duration: Math.random() * 4 + 2 + 's',
        delay: Math.random() * 2 + 's'
    })));

    // Sync note text and media when active song changes
    useEffect(() => {
        if (activeNoteSong) {
            const savedNote = notes[activeNoteSong.id];
            if (typeof savedNote === 'object' && savedNote !== null) {
                setNoteText(savedNote.text || '');
                if (savedNote.attachments) {
                    setMediaList(savedNote.attachments);
                } else if (savedNote.media) {
                    // Migrate legacy single media to array
                    setMediaList([{ url: savedNote.media, type: savedNote.mediaType || 'image', caption: '' }]);
                } else {
                    setMediaList([]);
                }
            } else {
                // Legacy string support
                setNoteText(savedNote || '');
                setMediaList([]);
            }
        }
    }, [activeNoteSong, notes]);

    // Safe theme color fallback
    const starColor = theme.starColor || '255, 255, 255';

    if (!album) return <Navigate to="/albums" />;

    return (
        <div className={`h-[111.11vh] bg-[#020202] text-zinc-100 pt-32 px-4 md:px-8 lg:px-12 pb-10 font-sans overflow-y-auto lg:overflow-hidden relative no-scrollbar ${theme.selection}`}>

            {/* Background Ambience (Animated) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {stars.map(star => (
                    <motion.div
                        key={star.id}
                        animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.1, 1] }}
                        transition={{ duration: parseFloat(star.duration), repeat: Infinity, delay: parseFloat(star.delay), ease: "easeInOut" }}
                        className="absolute rounded-full"
                        style={{
                            top: star.top,
                            left: star.left,
                            width: star.size,
                            height: star.size,
                            backgroundColor: `rgb(${starColor})`,
                            boxShadow: `0 0 8px 1px rgba(${starColor}, 0.4)`,
                            willChange: 'opacity, transform'
                        }}
                    />
                ))}
            </div>

            <div className="max-w-[1400px] mx-auto z-10 relative h-full">

                {/* 3-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 h-auto lg:h-[calc(100vh-96px)]">

                    {/* COL 1: Navigation */}
                    <div className="lg:col-span-1 pt-2">
                        <Link to="/albums" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors" title="Volver a Álbumes">
                            <ArrowLeft size={20} />
                        </Link>
                    </div>

                    {/* COL 2: Song List (Center) */}
                    <div className="lg:col-span-7 flex flex-col h-full bg-[#0a0a12]/50 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm">
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                <Disc className={theme.icon} size={20} />
                                {album.title}
                            </h2>
                            <span className="text-xs font-mono text-zinc-500">{album.songs.length} Canciones</span>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <tbody>
                                    {album.songs.map((song) => {
                                        const isFav = favorites.includes(song.id);
                                        const isActive = activeNoteSong?.id === song.id;

                                        return (
                                            <Fragment key={song.id}>
                                                <tr
                                                    onClick={() => handleSongClick(song)}
                                                    className={cn(
                                                        "group transition-all duration-300 cursor-pointer border-b border-white/5 rounded-r-xl relative overflow-hidden",
                                                        isActive
                                                            ? "bg-gradient-to-r from-white/10 to-transparent border-l-4 " + theme.barSecondary.replace('bg-', 'border-')
                                                            : "hover:bg-white/[0.04] border-l-4 border-l-transparent"
                                                    )}
                                                >
                                                    {/* Status Icon */}
                                                    <td className="p-4 w-12 text-center text-zinc-500 relative hidden md:table-cell">
                                                        {playingSong === song.id ? (
                                                            <div className="flex gap-[2px] h-3 items-end justify-center w-full">
                                                                <span className={`w-[2px] h-3 ${theme.barSecondary || 'bg-white'} animate-[music-bar_0.5s_ease-in-out_infinite]`} />
                                                                <span className={`w-[2px] h-2 ${theme.barSecondary || 'bg-white'} animate-[music-bar_0.5s_ease-in-out_0.1s_infinite]`} />
                                                                <span className={`w-[2px] h-4 ${theme.barSecondary || 'bg-white'} animate-[music-bar_0.5s_ease-in-out_0.2s_infinite]`} />
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <span className={cn("transition-all", isActive ? "hidden" : "group-hover:hidden")}>
                                                                    <span className="text-xs font-mono opacity-50">{(song.duration || '0:00').split(':')[0]}:{(song.duration || '0:00').split(':')[1]}</span>
                                                                </span>
                                                                <span className={cn("hidden text-white", isActive ? "inline-block" : "group-hover:inline-block")}>
                                                                    <Play size={16} fill="currentColor" />
                                                                </span>
                                                            </>
                                                        )}
                                                    </td>

                                                    {/* Title & Player Card */}
                                                    <td className="p-2 md:p-4">
                                                        <div className="flex flex-col gap-2">
                                                            <div className={cn("font-medium text-base transition-colors px-2 md:px-0", playingSong === song.id ? theme.activeText : "text-zinc-200 group-hover:text-white")}>
                                                                {song.title}
                                                            </div>

                                                            {/* Spotify Card - Stable Inline Version */}
                                                            <AnimatePresence>
                                                                {isActive && (
                                                                    <motion.div
                                                                        initial={{ opacity: 0, y: -10, height: 0 }}
                                                                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                                                                        exit={{ opacity: 0, y: -10, height: 0 }}
                                                                        className="overflow-hidden mt-1"
                                                                    >
                                                                        <div className="group/player rounded-2xl overflow-hidden bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-2xl border border-white/10 w-full shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center justify-center h-[80px] transition-all duration-500 hover:border-white/20 hover:shadow-[0_8px_40px_rgba(0,0,0,0.6)] gap-1 md:gap-3 relative">
                                                                            {/* Shine Effect */}
                                                                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover/player:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                                                            {/* Prev Button */}
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    e.stopPropagation();
                                                                                    handlePrevSong();
                                                                                }}
                                                                                className="hidden md:block p-1.5 md:p-3 text-white/60 hover:text-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all rounded-full disabled:opacity-30 active:scale-95 flex-shrink-0 z-10"
                                                                                disabled={album.songs.findIndex(s => s.id === song.id) === 0}
                                                                                title="Canción anterior"
                                                                            >
                                                                                <SkipBack className="w-4 h-4 md:w-6 md:h-6 fill-current" />
                                                                            </button>

                                                                            {song.spotifyEmbedUrl && (
                                                                                <div className="flex-grow h-full w-full z-10 relative">
                                                                                    <SpotifyPlayer
                                                                                        song={song}
                                                                                        isApiReady={isSpotifyApiReady}
                                                                                        onNext={handleNextSong}
                                                                                        onControllerReady={setEmbedController}
                                                                                    />
                                                                                </div>
                                                                            )}

                                                                            {/* Next Button */}
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.preventDefault();
                                                                                    e.stopPropagation();
                                                                                    handleNextSong();
                                                                                }}
                                                                                className="hidden md:block p-1.5 md:p-3 text-white/60 hover:text-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all rounded-full disabled:opacity-30 active:scale-95 flex-shrink-0 z-10"
                                                                                disabled={album.songs.findIndex(s => s.id === song.id) === album.songs.length - 1}
                                                                                title="Siguiente canción"
                                                                            >
                                                                                <SkipForward className="w-4 h-4 md:w-6 md:h-6 fill-current" />
                                                                            </button>
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    </td>

                                                    {/* Explicit Tag */}
                                                    <td className="p-4 w-8 hidden md:table-cell">
                                                        {song.explicit && (
                                                            <span className="flex items-center justify-center w-4 h-4 text-[9px] border border-zinc-600 text-zinc-400 rounded-[2px]" title="Explicit">E</span>
                                                        )}
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="p-4 w-24 text-right hidden md:table-cell">
                                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={(e) => { e.stopPropagation(); toggleFavorite(song.id); }}
                                                                className={cn("transition-colors", isFav ? "text-red-500" : "text-zinc-500 hover:text-white")}
                                                            >
                                                                <Heart size={16} fill={isFav ? "currentColor" : "none"} />
                                                            </motion.button>
                                                        </div>
                                                    </td>

                                                    {/* Duration */}
                                                    <td className="p-4 w-16 text-right font-mono text-xs text-zinc-500 hidden md:table-cell">
                                                        {song.duration}
                                                    </td>
                                                </tr>
                                            </Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>


                    {/* COL 3: Album & Notes (Right) */}
                    <div className="lg:col-span-4 flex flex-col h-full gap-6">

                        {/* Note Editor Area */}
                        <div className="flex-1 bg-[#121216] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col relative overflow-hidden">
                            <AnimatePresence mode="wait">
                                {!activeNoteSong ? (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex-1 flex flex-col items-center justify-center text-zinc-600 space-y-3 p-4"
                                    >
                                        <FileText size={40} className="opacity-20" />
                                        <p className="text-sm font-medium">Selecciona una canción para crear...</p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key={activeNoteSong.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex flex-col h-full"
                                    >
                                        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
                                            <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center shrink-0">
                                                {playingSong === activeNoteSong.id ? (
                                                    <div className="flex gap-1 h-3 items-end">
                                                        <span className={`w-1 h-3 ${theme.bar || 'bg-white'} animate-[music-bar_0.5s_ease-in-out_infinite]`} />
                                                        <span className={`w-1 h-2 ${theme.bar || 'bg-white'} animate-[music-bar_0.5s_ease-in-out_0.1s_infinite]`} />
                                                    </div>
                                                ) : (
                                                    <Music size={16} className="text-zinc-500" />
                                                )}
                                            </div>
                                            <div className="overflow-hidden">
                                                <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-0.5">Editando Nota</div>
                                                <div className="text-white font-medium truncate">{activeNoteSong.title}</div>
                                            </div>
                                        </div>

                                        <div className="flex-1 flex flex-col min-h-0 mb-4">
                                            <textarea
                                                value={noteText}
                                                onChange={(e) => setNoteText(e.target.value)}
                                                placeholder="Escribe tus pensamientos, recuerdos o letras aquí..."
                                                className="w-full bg-transparent resize-none focus:outline-none text-zinc-300 placeholder:text-zinc-700 text-sm leading-relaxed h-[60px] shrink-0 border-b border-white/5 pb-2 mb-2"
                                            />

                                            {mediaList.length > 0 && (
                                                <div className="flex-1 max-h-[50vh] overflow-y-auto pr-2">
                                                    <div className="flex flex-wrap gap-2 pb-2">
                                                        {mediaList.map((item, index) => (
                                                            <div
                                                                key={index}
                                                                onClick={() => {
                                                                    setViewingIndex(index);
                                                                    setIsCaptionLocked(!!item.caption);
                                                                }}
                                                                className="relative h-[200px] w-auto rounded-xl overflow-hidden group/media border border-white/10 bg-black/20 cursor-zoom-in"
                                                            >
                                                                {item.type === 'image' ? (
                                                                    <img src={item.url} alt={`Attachment ${index + 1}`} className="h-full w-auto object-contain" />
                                                                ) : (
                                                                    <video src={item.url} className="h-full w-auto" />
                                                                )}
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        removeMedia(index);
                                                                    }}
                                                                    className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500/80 text-white rounded-full backdrop-blur-md transition-colors opacity-0 group-hover/media:opacity-100"
                                                                >
                                                                    <span className="sr-only">Eliminar</span>
                                                                    <X size={14} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>



                                        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                                            <label className="cursor-pointer">
                                                <input
                                                    type="file"
                                                    accept="image/*,video/*"
                                                    className="hidden"
                                                    onChange={handleFileSelect}
                                                />
                                                <motion.div
                                                    whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="p-2 text-zinc-500 rounded-lg transition-colors"
                                                    title="Agregar Imagen o Video"
                                                >
                                                    <ImageIcon size={18} />
                                                </motion.div>
                                            </label>
                                            <Button
                                                onClick={handleSaveNote}
                                                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 border shadow-none ${theme.button}`}
                                            >
                                                <Save size={14} /> GUARDAR
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                    </div>
                </div>
            </div>

            {/* Lightbox Modal (Portal-like placement) */}
            <AnimatePresence>
                {viewingIndex !== null && mediaList[viewingIndex] && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-10"
                        onClick={() => setViewingIndex(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-5xl max-h-[85vh] flex flex-col bg-[#121216] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                        >
                            {/* Media Display - Centered */}
                            <div className="flex-1 bg-black flex items-center justify-center relative min-h-[40vh] overflow-hidden">
                                {mediaList[viewingIndex].type === 'image' ? (
                                    <img src={mediaList[viewingIndex].url} alt="Full screen" className="max-w-full max-h-[75vh] object-contain" />
                                ) : (
                                    <video src={mediaList[viewingIndex].url} controls className="max-w-full max-h-[75vh]" />
                                )}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setViewingIndex(null);
                                    }}
                                    className="absolute top-8 right-8 p-2 bg-transparent text-white/80 hover:text-white hover:bg-white/10 border border-white/0 hover:border-white/10 rounded-full transition-all z-50 cursor-pointer drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Caption Editor - Below */}
                            <div className="w-full p-6 flex flex-col bg-[#18181b] border-t border-white/10 shrink-0">
                                <h3 className="text-sm font-bold text-zinc-400 mb-3 uppercase tracking-wider text-center">Tu Recuerdo</h3>
                                <textarea
                                    readOnly={isCaptionLocked}
                                    value={mediaList[viewingIndex].caption || ''}
                                    onChange={(e) => updateMediaCaption(viewingIndex, e.target.value)}
                                    placeholder={isCaptionLocked ? "Este recuerdo ya está guardado." : "Escribe un mensaje especial para esta foto..."}
                                    className={`w-full bg-white/5 rounded-xl p-3 resize-none focus:outline-none text-sm leading-relaxed text-center transition-opacity ${isCaptionLocked ? 'text-zinc-400 cursor-default focus:bg-white/5' : 'text-zinc-200 focus:bg-white/10'}`}
                                    rows={2}
                                    autoFocus={!isCaptionLocked}
                                />
                                <div className="mt-4 flex justify-center gap-3">
                                    <button
                                        onClick={() => removeMedia(viewingIndex)}
                                        className="px-4 py-2 rounded-full text-xs font-bold bg-white/5 text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-colors flex items-center gap-2"
                                        title="Eliminar este recuerdo"
                                    >
                                        <Trash2 size={14} />
                                    </button>

                                    {isCaptionLocked && (
                                        <button
                                            onClick={() => setIsCaptionLocked(false)}
                                            className="px-4 py-2 rounded-full text-xs font-bold bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2"
                                            title="Editar mensaje"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                    )}

                                    <Button
                                        onClick={() => {
                                            if (!isCaptionLocked) {
                                                handleSaveNote();
                                            }
                                            setViewingIndex(null);
                                        }}
                                        className={`px-8 py-2 rounded-full text-xs font-bold shadow-none ${theme.button}`}
                                    >
                                        {isCaptionLocked ? "CERRAR" : "LISTO, GUARDAR"}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}
