import { clsx } from "clsx";

export function MetricCard({ label, value, unit, icon: Icon, active, className }) {
  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-2xl p-6 border transition-all duration-300",
        active
          ? "bg-primary/5 border-primary/50 shadow-[0_0_30px_-10px_hsl(var(--primary)/0.3)]"
          : "bg-card/40 border-border/50 hover:border-border",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <span className={clsx("text-sm font-medium uppercase tracking-wider", active ? "text-primary" : "text-muted-foreground")}>
          {label}
        </span>
        <div className={clsx("p-2 rounded-lg", active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-mono font-bold tracking-tight text-foreground">
          {value}
        </span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>

      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
      )}
    </div>
  );
}
