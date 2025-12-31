import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { humbeData } from '../data/humbeData';

// Componente de Fondo de Agujero Negro - Estilo Interstellar/Fuego
// Ahora diseñado para ocupar toda la pantalla con una presencia más sutil pero masiva
const BlackHoleBackground = () => {
    return (
        <div className="fixed inset-0 overflow-hidden z-0 bg-[#020617] flex items-center justify-center pointer-events-none">

            {/* Capa de estrellas de fondo */}
            <div className="absolute inset-0 z-0 opacity-70">
                {[...Array(80)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-blue-100 rounded-full"
                        style={{
                            width: Math.random() * 2 + 'px',
                            height: Math.random() * 2 + 'px',
                            top: Math.random() * 100 + '%',
                            left: Math.random() * 100 + '%',
                            opacity: Math.random() * 0.8 + 0.2,
                            willChange: 'transform, opacity',
                            animation: `twinkle ${Math.random() * 4 + 2}s infinite`
                        }}
                    />
                ))}
            </div>

            {/* El Agujero Negro / Galaxia */}
            <div className="relative w-[180vh] h-[180vh] flex items-center justify-center opacity-90 translate-y-24 md:translate-x-1/4 filter blur-[1px]">

                {/* 1. Base Galáctica (Nebulosa) */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                    className="absolute w-full h-[60%] opacity-30 mix-blend-screen"
                    style={{
                        background: 'conic-gradient(transparent 0deg, #1e3a8a 50deg, transparent 100deg, #0f172a 180deg, transparent 240deg, #172554 300deg, transparent 360deg)',
                        filter: 'blur(100px)',
                        borderRadius: '60% 40% 60% 40% / 50% 50% 50% 50%',
                        transform: 'rotate(45deg)',
                        willChange: 'transform'
                    }}
                />

                {/* 2. NUEVO: Líneas de Acreción Giratorias (Speed Lines) */}
                {/* Generamos varios anillos elípticos con bordes brillantes que rotan */}
                <div className="absolute inset-0 flex items-center justify-center rotate-12"> {/* Contenedor inclinado para perspectiva */}
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                            transition={{ duration: 30 + i * 5, repeat: Infinity, ease: "linear" }}
                            className={`absolute rounded-[50%] border border-cyan-400/20 mix-blend-screen shadow-[0_0_15px_rgba(6,182,212,0.1)]`}
                            style={{
                                width: `${40 + i * 8}%`,  // Anillos concéntricos progresivos
                                height: `${20 + i * 4}%`, // Altura menor para efecto elíptico (perspectiva)
                                borderTopColor: `rgba(6, 182, 212, ${0.4 - i * 0.03})`, // Brillo variable
                                borderBottomColor: `rgba(59, 130, 246, ${0.4 - i * 0.03})`,
                                borderLeftColor: 'transparent', // Bordes cortados para efecto de "líneas en movimiento"
                                borderRightColor: 'transparent',
                                borderWidth: '1px',
                                willChange: 'transform'
                            }}
                        />
                    ))}

                    {/* Anillos extra finos y rápidos para detalle "High Tech" */}
                    {[...Array(4)].map((_, i) => (
                        <motion.div
                            key={`fast-${i}`}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 15 + i * 2, repeat: Infinity, ease: "linear" }}
                            className="absolute rounded-[50%] border-t border-b border-white/30"
                            style={{
                                width: `${55 + i * 12}%`,
                                height: `${28 + i * 6}%`,
                                borderWidth: '0.5px',
                                opacity: 0.5
                            }}
                        />
                    ))}
                </div>

                {/* 3. Núcleo Oscuro */}
                <div className="absolute w-[30%] h-[15%] bg-black rounded-[50%] z-10 shadow-[0_0_90px_rgba(2,6,23,1)] rotate-12" />

                {/* 4. Anillo de Energía Central */}
                <div className="absolute w-[32%] h-[16%] rounded-[50%] border border-blue-400/50 z-20 blur-[2px] rotate-12 shadow-[0_0_40px_rgba(59,130,246,0.5)]" />
            </div>

            <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#020617]/40 to-[#020617] z-20" />
        </div>
    );
};

const AnimatedText = ({ text, className }) => (
    <div className={`flex overflow-hidden ${className}`}>
        {text.split('').map((char, index) => (
            <motion.span
                key={index}
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.05, ease: [0.33, 1, 0.68, 1] }}
                className="inline-block"
            >
                {char === ' ' ? '\u00A0' : char}
            </motion.span>
        ))}
    </div>
);

export function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen lg:h-screen w-full text-white font-sans relative selection:bg-cyan-500/30 bg-[#020617] overflow-x-hidden overflow-y-auto lg:overflow-y-hidden">

            <BlackHoleBackground />

            {/* Contenido Principal */}
            <div className="relative z-10 min-h-screen lg:h-full flex flex-col px-6 md:px-12 lg:px-24 py-6 md:py-8 lg:justify-center lg:pt-32">

                {/* Grid Layout Principal */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative min-h-0">

                    {/* COLUMNA IZQUIERDA: Imagen del Artista */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="lg:col-span-5 relative z-10 w-full max-w-md lg:max-w-none mx-auto lg:h-full lg:max-h-[70vh] flex flex-col justify-center"
                    >
                        {/* Contenedor de Imagen */}
                        <div className="relative w-full aspect-[3/4] max-h-full rounded-2xl overflow-hidden border border-white/5 shadow-2xl group mx-auto lg:mx-0">
                            <img
                                src="/humbe-artist.jpg"
                                alt="Humbe Portrait"
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />


                        </div>
                    </motion.div>

                    {/* COLUMNA DERECHA: Contenido y Lista Scrollable */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="lg:col-span-7 flex flex-col justify-center relative z-20 pl-0 lg:pl-12 lg:h-full mt-8 lg:mt-0"
                    >

                        <div className="flex flex-col justify-center text-center lg:text-left">
                            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white mb-4 md:mb-6">
                                Humbe
                            </h1>

                            <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-transparent mb-6 md:mb-8 mx-auto lg:mx-0" />

                            <p className="text-base md:text-lg text-zinc-300 leading-relaxed max-w-xl mb-8 font-light mx-auto lg:mx-0">
                                Bienvenida, Karla. Este rincón nace de los álbumes de Humbe, tu artista favorito, creado para que cada canción te abrace y cada melodía hable por lo que a veces el corazón no sabe decir. Disfruta de la música.
                            </p>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-2 md:gap-3 mb-8 md:mb-10">
                                {["Pop Alternativo", "R&B", "Indie", "Cantautor"].map((tag) => (
                                    <span key={tag} className="px-3 py-1.5 text-[10px] md:text-xs uppercase tracking-widest border border-zinc-700/50 bg-zinc-900/30 rounded-lg text-zinc-400 hover:border-cyan-500/50 hover:text-white transition-colors cursor-default">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row items-center lg:items-center justify-center lg:justify-start gap-4 md:gap-6">
                                <Button onClick={() => navigate('/albums')} className="bg-white text-black hover:bg-zinc-200 px-8 py-3 md:px-10 md:py-4 rounded-full font-bold tracking-widest text-xs md:text-sm flex items-center gap-3 transition-transform hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.15)]">
                                    <Play size={18} fill="currentColor" /> REPRODUCIR
                                </Button>
                            </div>
                        </div>


                        {/* Estadísticas */}
                        <div className="flex mt-aut lg:mt-6 pt-8 border-t border-white/5 gap-12 justify-center lg:justify-start pb-12">
                            <div>
                                <div className="text-3xl font-light text-white mb-1">2.5M</div>
                                <div className="text-[10px] uppercase tracking-widest text-zinc-500">Oyentes Mensuales</div>
                            </div>
                            <div>
                                <div className="text-3xl font-light text-white mb-1">#1</div>
                                <div className="text-[10px] uppercase tracking-widest text-zinc-500">Tendencias México</div>
                            </div>
                        </div>

                    </motion.div>
                </div>
            </div>

        </div>
    );
}
