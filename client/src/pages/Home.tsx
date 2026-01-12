import { useSpeedTest, useHistory } from "@/hooks/use-speed-test";
import { SpeedGauge } from "@/components/SpeedGauge";
import { MetricCard } from "@/components/MetricCard";
import { StartButton } from "@/components/StartButton";
import { ArrowDown, ArrowUp, Activity, History, Wifi } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";

export default function Home() {
  const { state, metrics, runTest, reset } = useSpeedTest();
  const { data: history } = useHistory();

  const isTesting = state === "ping" || state === "download" || state === "upload";
  const isComplete = state === "complete";

  // Determine what to show in the big gauge
  const getGaugeValue = () => {
    if (state === "download") return metrics.download;
    if (state === "upload") return metrics.upload;
    if (state === "ping") return metrics.ping;
    return 0;
  };

  const getGaugeLabel = () => {
    if (state === "ping") return "Ping (ms)";
    if (state === "download") return "Download";
    if (state === "upload") return "Upload";
    return "Ready";
  };

  const getGaugeMax = () => {
    if (state === "ping") return 200;
    return 100; // 100 Mbps max for visualization scaling
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-8 flex flex-col items-center max-w-7xl mx-auto">
      {/* Header */}
      <header className="w-full flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
            <Wifi className="text-black w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
              SPEED<span className="text-primary">RUNNER</span>
            </h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              Network Diagnostic Tool
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
          <span>Server: Automatic</span>
          <div className="w-1 h-1 rounded-full bg-border" />
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Connected
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full flex-1 flex flex-col items-center justify-start gap-12">
        
        {/* State Transition Area */}
        <div className="relative w-full min-h-[500px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {state === "idle" ? (
              <motion.div
                key="start"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-8"
              >
                <StartButton onClick={runTest} />
                <p className="text-muted-foreground text-center max-w-md">
                  Click GO to start measuring your connection speed, latency, and jitter.
                </p>
              </motion.div>
            ) : isTesting ? (
              <motion.div
                key="gauge"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-2xl flex flex-col items-center"
              >
                <SpeedGauge 
                  value={getGaugeValue()} 
                  max={getGaugeMax()} 
                  label={getGaugeLabel()} 
                  active={true}
                />
                <div className="w-full max-w-md mt-8 h-1 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${metrics.progress}%` }}
                    transition={{ type: "tween", ease: "linear" }}
                  />
                </div>
                <div className="mt-2 text-sm text-primary font-mono uppercase tracking-wider">
                  {state === "ping" && "Measuring Latency..."}
                  {state === "download" && "Testing Download Speed..."}
                  {state === "upload" && "Testing Upload Speed..."}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-4xl flex flex-col items-center gap-8"
              >
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-display font-bold mb-2">Test Complete</h2>
                  <p className="text-muted-foreground">Results saved to history</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                  <MetricCard
                    label="Ping"
                    value={metrics.ping.toFixed(0)}
                    unit="ms"
                    icon={Activity}
                    className="md:scale-105"
                    active
                  />
                  <MetricCard
                    label="Download"
                    value={metrics.download.toFixed(1)}
                    unit="Mbps"
                    icon={ArrowDown}
                    active
                  />
                  <MetricCard
                    label="Upload"
                    value={metrics.upload.toFixed(1)}
                    unit="Mbps"
                    icon={ArrowUp}
                    active
                  />
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={runTest}
                    className="px-8 py-3 rounded-full bg-primary text-black font-bold hover:bg-primary/90 transition-colors"
                  >
                    Test Again
                  </button>
                  <button
                    onClick={reset}
                    className="px-8 py-3 rounded-full border border-border hover:bg-muted transition-colors"
                  >
                    Back to Home
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Live Metrics Grid (Always Visible during test) */}
        <AnimatePresence>
          {isTesting && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="grid grid-cols-3 gap-4 md:gap-8 w-full max-w-3xl"
            >
              <MetricCard
                label="Ping"
                value={metrics.ping > 0 ? metrics.ping.toFixed(0) : "-"}
                unit="ms"
                icon={Activity}
                active={state === "ping"}
              />
              <MetricCard
                label="Download"
                value={metrics.download > 0 ? metrics.download.toFixed(1) : "-"}
                unit="Mbps"
                icon={ArrowDown}
                active={state === "download"}
              />
              <MetricCard
                label="Upload"
                value={metrics.upload > 0 ? metrics.upload.toFixed(1) : "-"}
                unit="Mbps"
                icon={ArrowUp}
                active={state === "upload"}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* History Section */}
        {history && history.length > 0 && state === "idle" && (
          <div className="w-full max-w-5xl mt-12 glass-panel rounded-2xl p-8">
            <div className="flex items-center gap-2 mb-8">
              <History className="text-primary w-5 h-5" />
              <h3 className="text-xl font-bold">Recent History</h3>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history.slice(-10)}> {/* Show last 10 */}
                  <defs>
                    <linearGradient id="colorDl" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorUl" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis 
                    dataKey="createdAt" 
                    tickFormatter={(val) => format(new Date(val), 'MMM d')}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    unit=" Mbps"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                    labelFormatter={(val) => format(new Date(val), 'PP pp')}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="downloadSpeed" 
                    name="Download"
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorDl)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="uploadSpeed" 
                    name="Upload"
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorUl)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
