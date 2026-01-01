import { motion, AnimatePresence } from 'framer-motion';
import { X, Music, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './Button';

export function NoteDrawer({ isOpen, onClose, initialNote = '', initialAttachments = [], onSave, title }) {
    const [note, setNote] = useState(initialNote);
    const [mediaList, setMediaList] = useState(initialAttachments || []);
    const [viewingIndex, setViewingIndex] = useState(null);

    useEffect(() => {
        setNote(initialNote);
        setMediaList(initialAttachments || []);
    }, [initialNote, initialAttachments, isOpen]);

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

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-[450px] bg-[#121216] border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col relative shadow-2xl overflow-hidden max-h-[90vh]"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center shrink-0">
                                        <Music size={16} className="text-zinc-500" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-0.5">Editando Nota</div>
                                        <div className="text-white font-medium truncate max-w-[200px]">{title}</div>
                                    </div>
                                </div>
                                <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white bg-zinc-800/50 rounded-full hover:bg-zinc-800 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto min-h-0 flex flex-col no-scrollbar">
                                <textarea
                                    className="w-full h-32 bg-transparent border-b border-white/5 resize-none text-zinc-300 placeholder:text-zinc-700 focus:outline-none text-sm leading-relaxed mb-6 shrink-0"
                                    placeholder="Escribe tus pensamientos, recuerdos o letras aquí..."
                                    maxLength={150}
                                    value={note || ''}
                                    onChange={(e) => setNote(e.target.value)}
                                />

                                {/* Media List */}
                                {mediaList.length > 0 && (
                                    <div className="grid grid-cols-2 gap-4 mb-2">
                                        {mediaList.map((item, index) => (
                                            <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-zinc-800/50 border border-white/10 group">
                                                {item.type === 'image' ? (
                                                    <img src={item.url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <video src={item.url} className="w-full h-full object-cover" />
                                                )}
                                                <button
                                                    onClick={() => removeMedia(index)}
                                                    className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/80"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between shrink-0">
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
                                        title="Agregar Imagen"
                                    >
                                        <ImageIcon size={18} />
                                    </motion.div>
                                </label>

                                <Button
                                    variant="primary"
                                    className="px-6 py-2 rounded-lg text-xs font-bold bg-[#1e293b]/50 text-cyan-400 hover:bg-[#1e293b] border border-cyan-500/20"
                                    onClick={() => {
                                        onSave(note, mediaList);
                                        onClose();
                                    }}
                                >
                                    GUARDAR
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
