import { Heart, FileText, Trash2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { humbeData } from '../data/humbeData';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { NoteDrawer } from '../components/ui/NoteDrawer';
import { cn } from '../lib/utils';

export function Favorites() {
    const { favorites = [], toggleFavorite, notes = {}, saveNote } = useAppContext();
    const [activeNoteSong, setActiveNoteSong] = useState(null);

    // Defensive check: ensure data exists
    if (!humbeData) return <div className="p-20 text-white">Error: Datos no cargados</div>;

    const favSongs = useMemo(() => {
        const allSongs = humbeData.flatMap(album =>
            (album.songs || []).map(song => ({ ...song, album: album }))
        );
        const safeFavorites = Array.isArray(favorites) ? favorites : [];
        return allSongs.filter(song => safeFavorites.includes(song.id));
    }, [favorites]);

    return (
        <div className="pt-32 h-full bg-black px-8 overflow-y-auto">
            <header className="border-b border-zinc-800 pb-6 mb-8 flex items-end justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-1">Mis Favoritas</h2>
                    <p className="text-zinc-500 text-sm">Colección personal</p>
                </div>
                <span className="text-zinc-500 text-xs font-medium bg-zinc-900 px-3 py-1 rounded-full">{favSongs.length} canciones</span>
            </header>

            {favSongs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-center opacity-50">
                    <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
                        <Heart size={24} className="text-zinc-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Tu colección está vacía</h3>
                    <p className="text-zinc-500 text-sm mb-6 max-w-md mx-auto">Agrega canciones a tus favoritas para crear tu propia biblioteca de Humbe.</p>
                    <Link to="/albums">
                        <Button className="bg-white text-black hover:bg-zinc-200">Explorar Catálogo</Button>
                    </Link>
                </div>
            ) : (
                <div className="bg-zinc-900/30 rounded-lg overflow-hidden border border-white/5">
                    {/* Header */}
                    <div className="grid grid-cols-[auto_1fr_auto] gap-4 p-4 border-b border-white/5 text-zinc-500 text-xs uppercase tracking-wider font-semibold">
                        <span className="w-12 text-center">Album</span>
                        <span>Título</span>
                        <span className="pr-4">Acciones</span>
                    </div>

                    <div className="divide-y divide-white/5">
                        {favSongs.map((song) => (
                            <div
                                key={song.id}
                                className="group grid grid-cols-[auto_1fr_auto] gap-4 p-3 items-center hover:bg-white/5 transition-colors"
                            >
                                <div className="w-12 h-12 rounded overflow-hidden bg-zinc-800">
                                    <img src={song.album.cover} className="w-full h-full object-cover" />
                                </div>

                                <div>
                                    <div className="font-bold text-zinc-200 text-sm group-hover:text-white transition-colors">
                                        {song.title}
                                    </div>
                                    <div className="text-xs text-zinc-500 mt-0.5">{song.album.title}</div>
                                </div>

                                <div className="flex items-center gap-2 pr-2">
                                    <button
                                        onClick={() => setActiveNoteSong(song)}
                                        className={cn(
                                            "p-2 rounded-full hover:bg-white/10 transition-colors",
                                            notes[song.id] ? "text-primary" : "text-zinc-500 hover:text-white"
                                        )}
                                        title={notes[song.id] ? "Ver nota" : "Agregar nota"}
                                    >
                                        <FileText size={16} />
                                    </button>
                                    <button
                                        onClick={() => toggleFavorite(song.id)}
                                        className="p-2 rounded-full hover:bg-red-500/10 text-primary hover:text-red-500 transition-colors"
                                        title="Eliminar de favoritos"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <NoteDrawer
                isOpen={!!activeNoteSong}
                onClose={() => setActiveNoteSong(null)}
                title={activeNoteSong?.title}
                initialNote={activeNoteSong ? (typeof notes[activeNoteSong.id] === 'object' ? notes[activeNoteSong.id]?.text || '' : notes[activeNoteSong.id] || '') : ''}
                initialAttachments={activeNoteSong && notes[activeNoteSong.id]?.attachments ? notes[activeNoteSong.id].attachments : []}
                onSave={(text, attachments) => activeNoteSong && saveNote(activeNoteSong.id, text, attachments)}
            />
        </div>
    );
}
