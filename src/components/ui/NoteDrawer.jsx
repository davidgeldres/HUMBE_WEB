import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
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
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-zinc-900 border-l border-white/10 px-6 pt-6 pb-10 z-[70] shadow-2xl outline-none flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-6 pt-20">
                            <h3 className="text-xl font-bold text-white">
                                Nota para "{title}"
                            </h3>
                            <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white bg-zinc-800 rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto min-h-0 flex flex-col">
                            <textarea
                                className="w-full h-32 bg-zinc-800/50 border border-white/10 rounded-2xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500 resize-none mb-8 shrink-0"
                                placeholder="Escribe algo especial sobre esta canción..."
                                maxLength={150}
                                value={note || ''}
                                onChange={(e) => setNote(e.target.value)}
                            />

                            {/* Media List */}
                            {mediaList.length > 0 && (
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    {mediaList.map((item, index) => (
                                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-zinc-800 border border-white/10 group">
                                            {item.type === 'image' ? (
                                                <img src={item.url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <video src={item.url} className="w-full h-full object-cover" />
                                            )}
                                            <button
                                                onClick={() => removeMedia(index)}
                                                className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between shrink-0">
                            <label className="cursor-pointer p-3 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors">
                                <input
                                    type="file"
                                    accept="image/*,video/*"
                                    className="hidden"
                                    onChange={handleFileSelect}
                                />
                                <ImageIcon size={20} />
                            </label>

                            <Button
                                variant="primary"
                                className="flex-1 ml-4 py-3 bg-white text-black hover:bg-zinc-200 font-bold"
                                onClick={() => {
                                    onSave(note, mediaList);
                                    onClose();
                                }}
                            >
                                GUARDAR NOTA
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Helper icon import if missing
import { Image as ImageIcon } from 'lucide-react';
