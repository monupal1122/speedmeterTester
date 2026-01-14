import React, { useState, useEffect } from 'react';
import ResponsiveMetricCard from './ResponsiveMetricCard';

export const SpeedGauge = ({ value, max = 100, label = "Mbps", active = false }) => {
  const radius = 140;
  const stroke = 16;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const arcLength = circumference * 0.75;

  const safeValue = Math.min(value, max);
  const percent = safeValue / max;
  const strokeDashoffset = arcLength - percent * arcLength;

  const getColor = () => {
    if (percent < 0.3) return ['#EF4444', '#DC2626', '#B91C1C'];
    if (percent < 0.6) return ['#F59E0B', '#D97706', '#B45309'];
    return ['#10B981', '#059669', '#047857'];
  };

  const colors = getColor();

  return (
    <div className="relative flex flex-col items-center justify-center w-80 h-80 mx-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-full blur-3xl opacity-60" />
      
      <div className="relative w-full h-full flex items-center justify-center">
        <svg
          height="100%"
          width="100%"
          viewBox="0 0 320 320"
          className="transform rotate-[135deg] drop-shadow-2xl"
        >
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors[0]} stopOpacity="0.6" />
              <stop offset="50%" stopColor={colors[1]} stopOpacity="0.9" />
              <stop offset="100%" stopColor={colors[2]} stopOpacity="1" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="centerGlow">
              <stop offset="0%" stopColor={colors[0]} stopOpacity="0.4" />
              <stop offset="100%" stopColor={colors[0]} stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle
            cx="160"
            cy="160"
            r="140"
            fill="url(#centerGlow)"
          />

          <circle
            stroke="rgba(100, 100, 100, 0.15)"
            strokeWidth={stroke + 2}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
            fill="transparent"
            r={normalizedRadius}
            cx="160"
            cy="160"
          />

          <circle
            stroke="url(#gaugeGradient)"
            strokeWidth={stroke}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            r={normalizedRadius}
            cx="160"
            cy="160"
            filter={active ? "url(#glow)" : undefined}
            style={{
              transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />

          {[...Array(11)].map((_, i) => {
            const angle = -135 + (i * 27);
            const rad = (angle * Math.PI) / 180;
            const tickRadius = normalizedRadius - 5;
            const length = i % 2 === 0 ? 18 : 10;
            
            return (
              <line
                key={i}
                x1={160 + tickRadius * Math.cos(rad)}
                y1={160 + tickRadius * Math.sin(rad)}
                x2={160 + (tickRadius - length) * Math.cos(rad)}
                y2={160 + (tickRadius - length) * Math.sin(rad)}
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth={i % 2 === 0 ? 3 : 2}
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <div className="flex items-baseline gap-1 mb-1">
            <span
              className="text-4xl md:text-5xl font-black leading-none tracking-tighter drop-shadow-lg transition-all duration-500"
              style={{ color: colors[0] }}
            >
              {value.toFixed(1)}
            </span>
          </div>
          <span className="text-sm text-gray-400 font-bold uppercase tracking-[0.3em] mb-2">
            {label}
          </span>
          <span className="text-xs text-gray-500 font-semibold">
            Mbps
          </span>
        </div>
      </div>
    </div>
  );
};



export const StartButton = ({ onClick, disabled }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative w-48 h-48 rounded-full bg-slate-900 border-4 border-slate-700 hover:border-cyan-500/50 transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
      style={{
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 0.2s ease'
      }}
    >
      <div 
        className="absolute -inset-4 rounded-full border border-cyan-500/20 transition-all duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'scale(1.1)' : 'scale(1)'
        }}
      />
      <div 
        className="absolute -inset-8 rounded-full border border-cyan-500/10 transition-all duration-700 delay-75"
        style={{
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'scale(1.25)' : 'scale(1)'
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <span className="text-4xl font-black tracking-tighter text-white group-hover:text-cyan-400 transition-colors duration-300">
          GO
        </span>
        <span className="text-xs uppercase tracking-widest text-gray-500 mt-1 group-hover:text-white transition-colors">
          Start Test
        </span>
      </div>

      <div 
        className="absolute inset-2 rounded-full bg-gradient-to-tr from-slate-800/50 to-transparent transition-opacity duration-300"
        style={{ opacity: isHovered ? 0 : 1 }}
      />
      <div 
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/10 via-transparent to-transparent transition-opacity duration-300"
        style={{ opacity: isHovered ? 1 : 0 }}
      />
    </button>
  );
};

export default function App() {
  const [testStarted, setTestStarted] = useState(false);
  const [testing, setTesting] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [ping, setPing] = useState(0);
  const [jitter, setJitter] = useState(0);
  const [progress, setProgress] = useState(0);
  const [testComplete, setTestComplete] = useState(false);

  const simulateSpeedTest = () => {
    setTestStarted(true);
    setTesting(true);
    setTestComplete(false);
    setProgress(0);
    setDownloadSpeed(0);
    setUploadSpeed(0);
    setPing(0);
    setJitter(0);

    // Simulate ping test
    setTimeout(() => {
      let pingValue = 0;
      const pingInterval = setInterval(() => {
        pingValue += Math.random() * 8;
        if (pingValue >= 15 + Math.random() * 20) {
          clearInterval(pingInterval);
          setPing(Math.round(pingValue));
        } else {
          setPing(Math.round(pingValue));
        }
      }, 100);
    }, 500);

    // Simulate download test
    setTimeout(() => {
      let dlSpeed = 0;
      const dlInterval = setInterval(() => {
        dlSpeed += Math.random() * 12;
        setProgress(Math.min((dlSpeed / 100) * 50, 50));
        if (dlSpeed >= 85 + Math.random() * 15) {
          clearInterval(dlInterval);
          setDownloadSpeed(parseFloat(dlSpeed.toFixed(1)));
        } else {
          setDownloadSpeed(parseFloat(dlSpeed.toFixed(1)));
        }
      }, 100);
    }, 1500);

    // Simulate upload test
    setTimeout(() => {
      let ulSpeed = 0;
      const ulInterval = setInterval(() => {
        ulSpeed += Math.random() * 8;
        setProgress(50 + Math.min((ulSpeed / 50) * 40, 40));
        if (ulSpeed >= 40 + Math.random() * 15) {
          clearInterval(ulInterval);
          setUploadSpeed(parseFloat(ulSpeed.toFixed(1)));
        } else {
          setUploadSpeed(parseFloat(ulSpeed.toFixed(1)));
        }
      }, 100);
    }, 3500);

    // Simulate jitter calculation
    setTimeout(() => {
      setJitter(Math.round(Math.random() * 5 + 2));
      setProgress(100);
      setTesting(false);
      setTestComplete(true);
    }, 5500);
  };

  const handleReset = () => {
    setTestStarted(false);
    setTestComplete(false);
    setDownloadSpeed(0);
    setUploadSpeed(0);
    setPing(0);
    setJitter(0);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex flex-col items-center justify-center p-6 md:p-8 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent" />
      
      <div className="relative z-10 text-center mb-8">
        <h1 className="text-5xl md:text-7xl font-black text-white mb-3 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400">
            Speed Test
          </span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl font-medium">
          {testing ? 'Testing your connection...' : testComplete ? 'Test complete!' : 'Check your internet performance'}
        </p>
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        {!testStarted ? (
          <div className="relative w-full min-h-[500px] flex flex-col items-center justify-center">
            <StartButton onClick={simulateSpeedTest} disabled={testing} />
          </div>
        ) : (
          <>
            <div className="mb-8">
              <SpeedGauge 
                value={downloadSpeed} 
                max={100} 
                label="DOWNLOAD" 
                active={testing}
              />
            </div>

            {testing && (
              <div className="mb-8">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-full h-3 overflow-hidden border border-slate-700/50">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-center text-gray-400 text-sm mt-2 font-medium">
                  {progress < 50 ? 'Testing download speed...' : progress < 90 ? 'Testing upload speed...' : 'Finalizing...'}
                </p>
              </div>
            )}

            <ResponsiveMetricCard download={downloadSpeed} upload={uploadSpeed} ping={ping} />

            {testComplete && (
              <div className="text-center space-y-4">
                <div className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl backdrop-blur-sm">
                  <p className="text-green-400 font-bold text-lg">
                    ✓ Your connection is {downloadSpeed > 50 ? 'excellent' : downloadSpeed > 25 ? 'good' : 'moderate'}
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Perfect for {downloadSpeed > 50 ? '4K streaming, gaming, and video calls' : downloadSpeed > 25 ? 'HD streaming and browsing' : 'basic browsing and emails'}
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 hover:from-blue-600 hover:via-cyan-600 hover:to-teal-600 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-cyan-500/50"
                >
                  🔄 Test Again
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}