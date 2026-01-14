import React from "react";

export const ResponsiveMetricCard = ({ download, upload, ping }) => {
  return (
    <div className="w-full max-w-4xl mx-auto 
      bg-slate-800/40 backdrop-blur-sm 
      rounded-xl md:rounded-2xl 
      border border-slate-700/50 
      p-4 sm:p-5 md:p-6 
      shadow-lg
      min-h-[220px]"
    >
      <h3 className="text-center font-bold text-white mb-4"
        style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}
      >
        Speed Test Results
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Download */}
        <MetricBox
          icon="⬇️"
          label="Download"
          value={download.toFixed(1)}
          unit="Mbps"
          gradient="from-blue-500/10 to-cyan-500/10"
          border="border-blue-500/20"
        />

        {/* Upload */}
        <MetricBox
          icon="⬆️"
          label="Upload"
          value={upload.toFixed(1)}
          unit="Mbps"
          gradient="from-green-500/10 to-emerald-500/10"
          border="border-green-500/20"
        />

        {/* Ping */}
        <MetricBox
          icon="⚡"
          label="Ping"
          value={ping}
          unit="ms"
          gradient="from-purple-500/10 to-pink-500/10"
          border="border-purple-500/20"
        />

      </div>
    </div>
  );
};

const MetricBox = ({ icon, label, value, unit, gradient, border }) => {
  return (
    <div
      className={`
        ${gradient} ${border}
        border rounded-lg
        p-3 sm:p-4
        flex flex-col items-center justify-center
        aspect-[4/3]
      `}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl sm:text-2xl">{icon}</span>
        <span className="uppercase tracking-wider text-gray-300 font-semibold"
          style={{ fontSize: "clamp(0.7rem, 1.8vw, 0.9rem)" }}
        >
          {label}
        </span>
      </div>

      <div className="flex items-baseline">
        <span
          className="font-black text-white"
          style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)" }}
        >
          {value}
        </span>
        <span className="ml-1 font-bold text-gray-400 text-sm">
          {unit}
        </span>
      </div>
    </div>
  );
};

export default ResponsiveMetricCard;
