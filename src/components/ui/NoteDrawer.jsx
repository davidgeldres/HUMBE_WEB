import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './Button';

export function NoteDrawer({ isOpen, onClose, initialNote = '', onSave, title }) {
    const [note, setNote] = useState(initialNote);

    useEffect(() => {
        setNote(initialNote);
    }, [initialNote, isOpen]);

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
                        className="fixed top-24 bottom-6 right-6 w-full md:w-[450px] bg-zinc-900 border border-white/10 rounded-2xl p-6 z-[70] shadow-2xl outline-none"
                    >


                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-heading font-bold text-white">
                                Nota para "{title}"
                            </h3>
                            <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white bg-zinc-800 rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        <textarea
                            className="w-full h-40 bg-zinc-800/50 border border-white/10 rounded-2xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500 resize-none mb-6"
                            placeholder="Escribe algo especial sobre esta canción..."
                            maxLength={150}
                            value={note || ''}
                            onChange={(e) => setNote(e.target.value)}
                        />

                        <div className="flex justify-end gap-2 text-xs text-zinc-500 mb-6">
                            {(note || '').length}/150
                        </div>

                        <Button
                            variant="primary"
                            className="w-full py-4 text-lg bg-white text-black hover:bg-zinc-200"
                            onClick={() => {
                                onSave(note);
                                onClose();
                            }}
                        >
                            Guardar Nota
                        </Button>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
