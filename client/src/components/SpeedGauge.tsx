import { motion } from "framer-motion";

interface SpeedGaugeProps {
  value: number; // Current speed value
  max?: number;
  label?: string;
  active?: boolean;
}

export function SpeedGauge({ value, max = 100, label = "Mbps", active = false }: SpeedGaugeProps) {
  // SVG Calculations
  const radius = 120;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  // We want a 240 degree arc (leaving bottom open)
  // 240/360 = 0.666... of circumference visible
  const arcLength = circumference * 0.75; 
  
  // Calculate offset based on value
  // Ensure value doesn't exceed max for visual
  const safeValue = Math.min(value, max);
  const percent = safeValue / max;
  const strokeDashoffset = arcLength - percent * arcLength;

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-[400px] aspect-square mx-auto">
      {/* Container for SVG */}
      <div className="relative w-full h-full flex items-center justify-center">
        <svg
          height="100%"
          width="100%"
          viewBox="0 0 300 300"
          className="transform rotate-[135deg] transition-all duration-500"
        >
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="1" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Track */}
          <circle
            stroke="hsl(var(--muted))"
            strokeWidth={stroke}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
            fill="transparent"
            r={normalizedRadius}
            cx="150"
            cy="150"
          />

          {/* Active Progress */}
          <motion.circle
            initial={{ strokeDashoffset: arcLength }}
            animate={{ strokeDashoffset }}
            transition={{ type: "spring", stiffness: 60, damping: 20 }}
            stroke="url(#gaugeGradient)"
            strokeWidth={stroke}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
            fill="transparent"
            r={normalizedRadius}
            cx="150"
            cy="150"
            filter={active ? "url(#glow)" : undefined}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-muted-foreground font-display text-lg uppercase tracking-widest mb-2"
          >
            {label}
          </motion.div>
          <div className="flex items-baseline">
            <span className="text-7xl md:text-8xl font-mono font-bold tracking-tighter text-foreground tabular-nums">
              {value.toFixed(1)}
            </span>
          </div>
          <div className="text-sm font-medium text-muted-foreground mt-2">Mbps</div>
        </div>
      </div>
    </div>
  );
}
