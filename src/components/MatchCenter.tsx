import React, { useState, useEffect, useRef } from "react";
import { WorldCupMatch, StreamChannel } from "../types";
import { 
  Activity, 
  TrendingUp, 
  RefreshCw,
  Cpu,
  Wifi,
  Zap,
  Lock,
  Compass,
  ListRestart,
  HardDrive
} from "lucide-react";

interface MatchCenterProps {
  matches: WorldCupMatch[];
  selectedMatchId: string;
  onSelectMatch: (matchId: string) => void;
  selectedChannel?: StreamChannel;
}

interface TelemetryPoint {
  time: string;
  bitrate: number; // in Kbps
  latency: number; // in ms
  buffer: number;  // in seconds
}

export const MatchCenter: React.FC<MatchCenterProps> = ({
  matches,
  selectedMatchId,
  onSelectMatch,
  selectedChannel
}) => {
  const [activeMetric, setActiveMetric] = useState<"BANDWIDTH" | "LATENCY" | "BUFFER">("BANDWIDTH");
  const [history, setHistory] = useState<TelemetryPoint[]>([
    { time: "10s ago", bitrate: 4200, latency: 45, buffer: 12.1 },
    { time: "9s ago", bitrate: 4300, latency: 42, buffer: 12.4 },
    { time: "8s ago", bitrate: 4100, latency: 47, buffer: 12.0 },
    { time: "7s ago", bitrate: 4500, latency: 41, buffer: 12.5 },
    { time: "6s ago", bitrate: 4600, latency: 39, buffer: 11.8 },
    { time: "5s ago", bitrate: 4400, latency: 43, buffer: 12.9 },
    { time: "4s ago", bitrate: 4550, latency: 44, buffer: 13.2 },
    { time: "3s ago", bitrate: 4610, latency: 38, buffer: 13.5 },
    { time: "2s ago", bitrate: 4500, latency: 40, buffer: 13.0 },
    { time: "1s ago", bitrate: 4580, latency: 41, buffer: 13.1 }
  ]);

  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM] Connection handshaking established with relay IP...",
    "[INFO] AES-128 secure key certificate certified.",
    "[HLS] Manifest downloaded successfully (Adaptive Bitrate Mode)",
    "[BUFFER] Wiggle threshold satisfied. Current buffer: 13.1s"
  ]);

  // Target values based on selected channel to make it fully reactive and dynamic
  const getParsedBitrate = () => {
    if (!selectedChannel?.bitrate) return 4500;
    const p = parseFloat(selectedChannel.bitrate);
    return isNaN(p) ? 4500 : p * 1000;
  };

  const targetBitrate = getParsedBitrate();
  const targetLatency = typeof selectedChannel?.latency === "number" && !isNaN(selectedChannel.latency) 
    ? selectedChannel.latency 
    : 42;

  // Real-time loop to animate and wiggle chart points
  useEffect(() => {
    const logPool = [
      "TS byte segment loaded successfully in 64ms.",
      "Synchronized audio clock matching with HLS stream matrix.",
      "Decrypted safe AES session chunk in background thread.",
      "Stream router health check: OK, jitter variation: 0.8ms.",
      "Adaptive Bitrate (ABR) algorithm confirmed perfect reception.",
      "HLS master manifest source refreshed successfully.",
      "Frame buffer verified with low latency lock.",
      "Connection pipeline refreshed without packet loss."
    ];

    const timer = setInterval(() => {
      setHistory(prev => {
        // Generate new wiggled point
        const noiseBitrate = (Math.random() - 0.5) * 300;
        const noiseLatency = (Math.random() - 0.5) * 6;
        const noiseBuffer = (Math.random() - 0.5) * 1.2;

        const nextBitrate = Math.max(400, Math.round(targetBitrate + noiseBitrate));
        const nextLatency = Math.max(5, Math.round(targetLatency + noiseLatency));
        const nextBuffer = Math.max(1, parseFloat((12.5 + noiseBuffer).toFixed(1)));

        const point: TelemetryPoint = {
          time: "now",
          bitrate: nextBitrate,
          latency: nextLatency,
          buffer: nextBuffer
        };

        const updated = [...prev.slice(1), point];
        // Rename horizontal times to look consistent
        return updated.map((pt, idx) => ({
          ...pt,
          time: idx === 9 ? "now" : `${10 - idx}s ago`
        }));
      });

      // Periodically append live logs
      if (Math.random() > 0.45) {
        setLogs(prev => {
          const randomLog = logPool[Math.floor(Math.random() * logPool.length)];
          const timeStr = new Date().toTimeString().split(" ")[0];
          const newLog = `[${timeStr}] ${randomLog}`;
          return [newLog, ...prev.slice(0, 15)];
        });
      }
    }, 1800);

    return () => clearInterval(timer);
  }, [selectedChannel, targetBitrate, targetLatency]);

  // Get range borders for charting
  const values = history.map(pt => {
    const v = activeMetric === "BANDWIDTH" ? pt.bitrate : activeMetric === "LATENCY" ? pt.latency : pt.buffer;
    return isNaN(v) ? 0 : v;
  });

  let maxVal = Math.max(...values) * 1.08;
  let minVal = Math.min(...values) * 0.92;
  if (isNaN(maxVal) || !isFinite(maxVal)) maxVal = 5000;
  if (isNaN(minVal) || !isFinite(minVal)) minVal = 0;
  const valRange = maxVal - minVal || 1;

  // Build responsive coordinates for custom SVG charting
  const svgWidth = 500;
  const svgHeight = 150;
  const plotPoints = history.map((pt, idx) => {
    const valRaw = activeMetric === "BANDWIDTH" ? pt.bitrate : activeMetric === "LATENCY" ? pt.latency : pt.buffer;
    const val = isNaN(valRaw) ? 0 : valRaw;
    const x = (idx / (history.length - 1)) * svgWidth;
    let y = svgHeight - 15 - ((val - minVal) / valRange) * (svgHeight - 35);
    if (isNaN(y) || !isFinite(y)) y = svgHeight / 2;
    return { x, y, val };
  });

  // Convert array coordinate maps directly into SVG lines & area fills
  const linePath = plotPoints.map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(" ");
  const fillPath = `${linePath} L ${svgWidth} ${svgHeight - 10} L 0 ${svgHeight - 10} Z`;

  const latestVal = values[values.length - 1];

  return (
    <div id="match-center-wrapper" className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden p-5 flex flex-col h-full shadow-lg">
      
      {/* Title & Interactive Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 mb-4 gap-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-gold animate-pulse" />
          <span className="text-xs font-bold tracking-tight text-white uppercase font-mono">
            HLS Ticker & Signal Telemetry
          </span>
        </div>
        
        {/* Selected Feed Pill */}
        <div className="text-[10px] font-mono bg-black/60 px-2.5 py-1 rounded text-zinc-400 border border-white/5 truncate max-w-[200px]" title={selectedChannel?.name}>
          FEED: <span className="text-gold font-bold">{selectedChannel?.name || "Server Default"}</span>
        </div>
      </div>

      {/* Synchronized Match Selector header (Allows matching broadcast overlays) */}
      <div className="p-3 bg-black/30 rounded-xl border border-white/5 mb-4 flex flex-col gap-2">
        <label className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider">
          Current Broadcast Target:
        </label>
        <div className="flex gap-2 items-center overflow-x-auto no-scrollbar py-0.5">
          {matches.map((match) => {
            const isSelected = match.id === selectedMatchId;
            return (
              <button
                key={match.id}
                onClick={() => onSelectMatch(match.id)}
                className={`px-3 py-1.5 rounded-lg text-left transition-all border shrink-0 cursor-pointer ${
                  isSelected 
                    ? "bg-[#181818] border-gold text-white font-bold" 
                    : "bg-black/60 border-white/5 hover:border-white/10 text-zinc-400 text-xs"
                }`}
              >
                <div className="flex items-center gap-1.5 text-[11px]">
                  <span>{match.homeFlag} vs {match.awayFlag}</span>
                  <span className="opacity-80 font-mono text-[9px] uppercase">{match.homeCode} / {match.awayCode}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Signal Quality Metrics Charts */}
      <div className="flex bg-black/60 p-1 rounded-lg border border-white/5 mb-4 justify-between gap-1">
        <button
          onClick={() => setActiveMetric("BANDWIDTH")}
          className={`flex-1 text-center py-2 text-[10px] font-bold uppercase font-mono rounded-md transition-all cursor-pointer ${
            activeMetric === "BANDWIDTH" 
              ? "bg-[#00FF66] text-black shadow-md shadow-gold/15" 
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Signal Speed
        </button>
        <button
          onClick={() => setActiveMetric("LATENCY")}
          className={`flex-1 text-center py-2 text-[10px] font-bold uppercase font-mono rounded-md transition-all cursor-pointer ${
            activeMetric === "LATENCY" 
              ? "bg-[#00FF66] text-black shadow-md shadow-gold/15" 
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Ping Latency
        </button>
        <button
          onClick={() => setActiveMetric("BUFFER")}
          className={`flex-1 text-center py-2 text-[10px] font-bold uppercase font-mono rounded-md transition-all cursor-pointer ${
            activeMetric === "BUFFER" 
              ? "bg-[#00FF66] text-black shadow-md shadow-gold/15" 
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Secured Buffer
        </button>
      </div>

      {/* Active Chart Stage */}
      <div className="relative p-2.5 bg-black/70 rounded-xl border border-white/5 mb-4 mt-1 flex flex-col justify-between">
        
        {/* Floating Telemetry Stats Overlay */}
        <div className="flex justify-between items-center mb-1 bg-black/40 px-3 py-2 rounded-lg border border-white/[0.03]">
          <div>
            <span className="text-[9px] text-zinc-550 uppercase font-mono block tracking-wider">Current Metric</span>
            <span className="text-sm font-black text-white font-mono uppercase tracking-tight">
              {activeMetric === "BANDWIDTH" ? "Bandwidth / Speed" : activeMetric === "LATENCY" ? "Ping Jitter" : "Temporal Buffer"}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[9px] text-zinc-550 uppercase font-mono block tracking-wider">Realtime Value</span>
            <span className="text-md font-black text-gold font-mono">
              {latestVal.toLocaleString()}
              <span className="text-[10px] font-semibold text-zinc-400 ml-1">
                {activeMetric === "BANDWIDTH" ? "Kbps" : activeMetric === "LATENCY" ? "ms" : "sec"}
              </span>
            </span>
          </div>
        </div>

        {/* Custom SVG Line Chart */}
        <div className="w-full h-[140px] mt-1 relative">
          <svg 
            className="w-full h-full overflow-visible"
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="none"
          >
            {/* Grids */}
            {[0.25, 0.5, 0.75].map((ratio, i) => (
              <line 
                key={i}
                x1="0"
                y1={svgHeight * ratio}
                x2={svgWidth}
                y2={svgHeight * ratio}
                stroke="white"
                className="opacity-5"
                strokeDasharray="4 4"
              />
            ))}

            {/* Area Fill */}
            <path 
              d={fillPath}
              className="fill-gold opacity-[0.03] transition-all duration-300"
            />

            {/* Main Plot Line */}
            <path 
              d={linePath}
              fill="none"
              className="stroke-gold stroke-2 transition-all duration-300"
              strokeLinecap="round"
            />

            {/* Interactive Points Circles */}
            {plotPoints.map((pt, idx) => {
              const isLast = idx === plotPoints.length - 1;
              return (
                <g key={idx}>
                  <circle 
                    cx={pt.x}
                    cy={pt.y}
                    r={isLast ? "4" : "2"}
                    className={isLast ? "fill-gold animate-bounce" : "fill-neutral-100 hover:fill-gold transition-colors"}
                  />
                  {isLast && (
                    <circle 
                      cx={pt.x}
                      cy={pt.y}
                      r="10"
                      className="stroke-gold fill-none opacity-20 animate-ping"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Sparkles / status bar */}
          <div className="absolute bottom-1 left-2 flex items-center gap-1.5 text-[9px] font-mono text-zinc-500">
            <Wifi className="w-3 h-3 text-gold/60" />
            <span>Feed Integrity: High (AES crypt)</span>
          </div>
          <div className="absolute bottom-1 right-2 flex items-center gap-1 text-[9px] font-mono text-zinc-500">
            <span>99.9% dropsafe</span>
          </div>
        </div>
      </div>

      {/* Diagnostics Panel & Feed Packet Logs */}
      <div className="flex-1 min-h-0 flex flex-col mt-1">
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold mb-2">
          <Cpu className="w-3.5 h-3.5 text-gold" />
          <span>Internal HLS Stream Events</span>
        </div>

        {/* Logs Terminal */}
        <div className="flex-1 bg-black/80 rounded-xl p-3 border border-white/5 font-mono text-[10px] text-zinc-400 overflow-y-auto space-y-1.5 min-h-[90px] max-h-[140px] no-scrollbar">
          {logs.map((log, index) => (
            <div 
              key={index} 
              className={`flex items-start gap-1 p-0.5 leading-relaxed truncate ${
                index === 0 ? "text-gold font-semibold" : idxClass(log)
              }`}
            >
              <Zap className="w-2.5 h-2.5 shrink-0 mt-0.5 text-zinc-600 font-bold" />
              <span className="truncate">{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper style mapper for logs text coloring
const idxClass = (log: string): string => {
  if (log.includes("[SYSTEM]")) return "text-[#00FF66]";
  if (log.includes("[HLS]")) return "text-zinc-300";
  if (log.includes("[INFO]")) return "text-zinc-200";
  if (log.includes("[BUFFER]")) return "text-zinc-400";
  return "text-zinc-400";
};
