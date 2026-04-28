import { cn } from "@/lib/utils";
import { HTMLMotionProps, motion } from "framer-motion";
import { forwardRef } from "react";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-foreground shadow-premium hover:opacity-90 active:scale-95 transition-all',
      secondary: 'bg-secondary text-foreground hover:bg-secondary/80',
      outline: 'bg-transparent border border-foreground/20 text-foreground hover:bg-foreground/5',
      ghost: 'bg-transparent text-foreground/60 hover:text-foreground hover:bg-foreground/5',
    };

    const sizes = {
      sm: 'px-4 py-2 text-[10px] tracking-[0.15em]',
      md: 'px-6 py-3 text-[11px] tracking-[0.2em]',
      lg: 'px-10 py-4 text-xs tracking-[0.25em]',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.01, y: -1 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={cn(
          "inline-flex items-center justify-center transition-all duration-300 font-sans font-semibold uppercase disabled:opacity-50 disabled:cursor-not-allowed rounded-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
