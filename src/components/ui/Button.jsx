import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export function Button({ className, variant = 'primary', size = 'md', children, ...props }) {
    const variants = {
        primary: 'bg-white text-black hover:bg-zinc-200 shadow-lg shadow-white/10 border border-transparent',
        secondary: 'bg-white text-black hover:bg-gray-200 border border-transparent',
        outline: 'bg-transparent border-2 border-white text-white hover:bg-white hover:text-black',
        ghost: 'bg-transparent hover:bg-white/10 text-white',
    };

    const sizes = {
        sm: 'px-4 py-2 text-xs font-bold uppercase tracking-widest',
        md: 'px-8 py-4 text-sm font-black uppercase tracking-[0.2em]',
        lg: 'px-10 py-5 text-base font-black uppercase tracking-[0.25em]',
        icon: 'p-3'
    };

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.02 }}
            className={cn(
                'rounded-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {/* Glitch/shine effect on hover */}
            {variant === 'primary' && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:animate-[shimmer_0.5s_infinite]" />
            )}
            <span className="relative z-10 flex items-center gap-2">{children}</span>
        </motion.button>
    );
}
