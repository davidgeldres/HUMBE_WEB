import { motion } from 'framer-motion';

export function About() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex flex-col justify-center max-w-lg mx-auto text-center space-y-8"
        >
            <h2 className="text-3xl font-bold font-heading">Sobre la página</h2>
            <div className="p-6 bg-zinc-900/50 rounded-2xl border border-white/5 space-y-4 text-zinc-300 leading-relaxed">
                <p>
                    Este espacio es solo para ti, Karla. Aquí puedes recorrer la discografía de <strong>Humbe</strong>, guardar tus canciones favoritas y dejar notitas con lo que cada canción te hace sentir.
                </p>
                <p>
                    Inspirado en la vibra visual de Entropía y Esencia, pero pensado especialmente para ti.
                </p>
            </div>

            <div className="pt-4 border-t border-white/5">
                <p className="text-zinc-500 text-sm">Versión 1.0.0</p>
                <p className="text-zinc-600 text-xs mt-1">Con mucho Dav ❤️ para k &lt;3.</p>
            </div>
        </motion.div>
    );
}
