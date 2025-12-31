import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Music, Heart, Info, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const closeMenu = () => setIsOpen(false);

    const links = [
        { to: '/', label: 'Inicio', icon: Home },
        { to: '/albums', label: 'Álbumes', icon: Music },
        { to: '/favoritas', label: 'Favoritas', icon: Heart },
        { to: '/info', label: 'Info', icon: Info },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent">
            <div className="w-full px-8 h-16 flex items-center justify-between">
                {/* Logo / Name */}
                <NavLink to="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img src="/humbe-logo.jpg" alt="Humbe" className="w-full h-full object-cover" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-white group-hover:text-primary transition-colors">Humbe</span>
                </NavLink>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) => cn(
                                "text-sm font-semibold tracking-wide transition-colors hover:text-white",
                                isActive ? "text-white" : "text-zinc-400"
                            )}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-white hover:bg-white/10 transition-colors">
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden overflow-hidden bg-black border-b border-white/10"
                    >
                        <div className="flex flex-col p-6 gap-2">
                            {links.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    onClick={closeMenu}
                                    className={({ isActive }) => cn(
                                        "flex items-center gap-6 p-4 transition-all duration-200 font-black text-xl uppercase tracking-widest border-l-4 border-transparent",
                                        isActive ? "bg-white/5 border-primary text-white" : "text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/20"
                                    )}
                                >
                                    <link.icon size={24} />
                                    <span>{link.label}</span>
                                </NavLink>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
