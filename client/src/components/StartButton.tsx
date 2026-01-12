import { motion } from "framer-motion";

interface StartButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function StartButton({ onClick, disabled }: StartButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className="group relative w-48 h-48 rounded-full bg-background border-4 border-muted hover:border-primary/50 transition-colors duration-300 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {/* Outer Glow Ring */}
      <div className="absolute -inset-4 rounded-full border border-primary/20 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
      <div className="absolute -inset-8 rounded-full border border-primary/10 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700 delay-75" />
      
      {/* Button Content */}
      <div className="relative z-10 flex flex-col items-center">
        <span className="text-4xl font-display font-black tracking-tighter text-foreground group-hover:text-primary transition-colors duration-300">
          GO
        </span>
        <span className="text-xs uppercase tracking-widest text-muted-foreground mt-1 group-hover:text-foreground transition-colors">
          Start Test
        </span>
      </div>

      {/* Background Gradient on Hover */}
      <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-muted/50 to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-300" />
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.button>
  );
}
