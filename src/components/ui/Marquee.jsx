import { cn } from '../../lib/utils';

export function Marquee({ children, className, reverse = false }) {
    return (
        <div className={cn("relative flex overflow-hidden w-full select-none", className)}>
            <div className={cn("flex min-w-full shrink-0 items-center justify-around gap-10 animate-marquee", reverse && "animate-marquee-reverse")}>
                {children}
                {children}
            </div>
            <div aria-hidden="true" className={cn("flex min-w-full shrink-0 items-center justify-around gap-10 animate-marquee absolute top-0 left-full", reverse && "animate-marquee-reverse")}>
                {children}
                {children}
            </div>
        </div>
    );
}
