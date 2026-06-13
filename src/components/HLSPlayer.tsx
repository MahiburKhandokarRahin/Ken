import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Tv, 
  AlertTriangle, 
  ExternalLink, 
  RefreshCw, 
  ShieldAlert, 
  Compass, 
  Info,
  CheckCircle2,
  ListRestart
} from "lucide-react";
import { StreamChannel } from "../types";

interface HLSPlayerProps {
  channel: StreamChannel;
  onPrevChannel?: () => void;
  onNextChannel?: () => void;
  onChannelError?: (channelId: string) => void;
}

export const HLSPlayer: React.FC<HLSPlayerProps> = ({ 
  channel,
  onPrevChannel,
  onNextChannel,
  onChannelError
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const networkRetryCount = useRef(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [resolution, setResolution] = useState<string>("Detecting...");
  const [fallbackLoading, setFallbackLoading] = useState(false);

  // Re-initialize player state whenever the channel changes
  useEffect(() => {
    setErrorDetails(null);
    setResolution("Detecting...");
    setIsBuffering(true);
    setIsPlaying(false);
    networkRetryCount.current = 0;

    const video = videoRef.current;
    if (!video) return;

    // Destroy existing Hls instance if any safely
    if (hlsRef.current) {
      try {
        hlsRef.current.detachMedia();
        hlsRef.current.destroy();
      } catch (e) {}
      hlsRef.current = null;
    }

    const { url } = channel;

    // Handle standard HLS stream (.m3u8) using hls.js
    if (url.endsWith(".m3u8") || url.includes(".m3u8")) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          maxMaxBufferLength: 10,
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 10,
        });

        hlsRef.current = hls;
        hls.loadSource(url);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
          setIsBuffering(false);
          setErrorDetails(null);
          
          // Get the highest resolution level if available
          if (data.levels && data.levels.length > 0) {
            const highest = data.levels[data.levels.length - 1];
            setResolution(`${highest.width}x${highest.height} HD`);
          } else {
            setResolution("Auto Bitrate");
          }

          // Try to autoplay (might fail due to browser policies unless muted)
          video.play()
            .then(() => setIsPlaying(true))
            .catch((err) => {
              // Fail silently, user has to click play
              setIsPlaying(false);
              if (err && err.name !== "AbortError") {
                console.warn("Autoplay was blocked or prevented:", err);
              }
            });
        });

        hls.on(Hls.Events.ERROR, (_, data) => {
          console.warn("HLS Error:", data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                if (networkRetryCount.current < 3) {
                  networkRetryCount.current += 1;
                  console.warn(`HLS Network Error: Recovery attempt ${networkRetryCount.current} of 3...`);
                  hls.startLoad();
                } else {
                  console.warn("HLS Network Error: Active recovery limit reached.");
                  setErrorDetails(
                    `Temporary network slowdown. Please select an alternative stable stream.`
                  );
                  setIsBuffering(false);
                  if (onChannelError) onChannelError(channel.id);
                  if (hlsRef.current) {
                    try {
                      hlsRef.current.detachMedia();
                      hlsRef.current.destroy();
                    } catch (e) {}
                    hlsRef.current = null;
                  }
                }
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.warn("HLS Media Error: Trying to recover elements...");
                try {
                  hls.recoverMediaError();
                } catch (err) {
                  console.warn("Recover media error failed:", err);
                }
                break;
              default:
                setErrorDetails(
                  `Match feed unreachable. The stream has experienced a technical checkout issue in this browser environment.`
                );
                setIsBuffering(false);
                if (onChannelError) onChannelError(channel.id);
                if (hlsRef.current) {
                  try {
                    hlsRef.current.detachMedia();
                    hlsRef.current.destroy();
                  } catch (e) {}
                  hlsRef.current = null;
                }
                break;
            }
          }
        });

        hls.on(Hls.Events.FRAG_BUFFERED, () => {
          setIsBuffering(false);
        });

        // Set volume
        video.volume = volume;
        video.muted = isMuted;

      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Native HLS support (Safari)
        video.src = url;
        video.addEventListener("loadedmetadata", () => {
          setIsBuffering(false);
          setResolution("Native HLS (HD)");
          video.play()
            .then(() => setIsPlaying(true))
            .catch((err) => {
              setIsPlaying(false);
              if (err && err.name !== "AbortError") {
                console.warn("Native autoplay blocked:", err);
              }
            });
        });
        
        video.addEventListener("error", () => {
          setErrorDetails("Failed to play current stream natively.");
          setIsBuffering(false);
          if (onChannelError) onChannelError(channel.id);
        });
      } else {
        setErrorDetails("Your browser does not support HLS streaming. Please use an alternative browser.");
        setIsBuffering(false);
        if (onChannelError) onChannelError(channel.id);
      }
    } else {
      // Direct raw stream (.ts) or other formats (simulate loading or play directly)
      video.src = url;
      setIsBuffering(false);
      setResolution("Raw Transport Link");
      video.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          if (err && err.name !== "AbortError") {
            setErrorDetails("This transport feed cannot be rendered directly in default HTML5 player widgets.");
            if (onChannelError) onChannelError(channel.id);
          }
        });
    }

    // Set volume states on media
    video.volume = volume;
    video.muted = isMuted;

    return () => {
      if (video) {
        try {
          video.pause();
          video.src = "";
          video.removeAttribute("src");
          video.load();
        } catch (e) {}
      }
      if (hlsRef.current) {
        try {
          hlsRef.current.detachMedia();
          hlsRef.current.destroy();
        } catch (e) {}
        hlsRef.current = null;
      }
    };
  }, [channel]);

  // Handle Play/Pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          setIsPlaying(false);
          if (err && err.name !== "AbortError") {
            console.warn("Playback failed to start:", err);
          }
        });
    }
  };

  // Handle Volume Change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (videoRef.current) {
      videoRef.current.muted = nextMute;
    }
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(err => console.warn("Fullscreen permission or layout restriction:", err));
    } else {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(err => console.warn("Exit fullscreen failed:", err));
    }
  };

  // Watch for external fullscreen exit events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Reload current stream link
  const reloadStream = () => {
    setFallbackLoading(true);
    setErrorDetails(null);
    setIsBuffering(true);
    networkRetryCount.current = 0;

    setTimeout(() => {
      setFallbackLoading(false);
      // Touch state to re-trigger HLS stream reload
      const video = videoRef.current;
      if (video) {
        if (hlsRef.current) {
          try {
            hlsRef.current.detachMedia();
            hlsRef.current.destroy();
          } catch (e) {}
          hlsRef.current = null;
        }
        
        const hls = new Hls({
          maxMaxBufferLength: 10,
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 10,
        });

        hlsRef.current = hls;
        hls.loadSource(channel.url);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsBuffering(false);
          video.play()
            .then(() => setIsPlaying(true))
            .catch((err) => {
              setIsPlaying(false);
              if (err && err.name !== "AbortError") {
                console.warn("Reconnect autoplay blocked:", err);
              }
            });
        });

        hls.on(Hls.Events.ERROR, (_, data) => {
          console.warn("HLS Reconnect Error:", data);
          if (data.fatal) {
            setErrorDetails(
              `Match feed unreachable. Connection lost.`
            );
            setIsBuffering(false);
            if (onChannelError) onChannelError(channel.id);
            if (hlsRef.current) {
              try {
                hlsRef.current.detachMedia();
                hlsRef.current.destroy();
              } catch (e) {}
              hlsRef.current = null;
            }
          }
        });
      }
    }, 1200);
  };

  // Check if it's an insecure HTTP loading in safe environment
  const isMixedContent = !channel.isHttps && window.location.protocol === "https:";

  return (
    <div 
      id="video-player-root"
      ref={containerRef} 
      className="relative group w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/90"
    >
      {/* Actual video element */}
      <video
        id="hls-video-element"
        ref={videoRef}
        className="w-full h-full cursor-pointer object-contain"
        onClick={togglePlay}
        playsInline
      />

      {/* Screen tint/overlay for theater look */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity duration-300" />

      {/* Buffering Indicator */}
      {isBuffering && !errorDetails && (
        <div id="video-buffering-overlay" className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505]/85 backdrop-blur-sm">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-gold/10 border-t-gold animate-spin" />
            <Tv className="w-6 h-6 text-gold absolute" />
          </div>
          <p className="mt-4 text-gold font-mono tracking-wider animate-pulse text-xs uppercase font-bold">
            TUNING FEED • RETRIEVING LIVE CHUNKS
          </p>
          <p className="text-[10px] text-zinc-500 mt-1 max-w-xs text-center px-4">
            Securing stream routing for {channel.name}...
          </p>
        </div>
      )}



      {/* Error or Feed Broken Overlay */}
      {errorDetails && (
        <div id="video-error-overlay" className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/95 p-6 text-center z-10 animate-fadeIn">
          <div className="p-3 bg-rose-500/10 rounded-full border border-rose-500/20 mb-4 animate-bounce text-rose-500">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h4 className="text-base font-semibold text-rose-100 tracking-tight">Stream Connection Interrupted</h4>
          <p className="text-[11px] text-zinc-400 mt-2 max-w-md px-4 leading-relaxed font-sans">
            Secure stream transmission has encountered an issue. Please retry reconnecting or switch to another live broadcast channel.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              id="reload-stream-btn"
              onClick={reloadStream}
              disabled={fallbackLoading}
              className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold-hover text-black font-bold text-xs rounded-lg transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${fallbackLoading ? "animate-spin" : ""}`} />
              {fallbackLoading ? "Reconnecting..." : "Force Reconnect"}
            </button>
          </div>
        </div>
      )}

      {/* Streaming Watermark */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-sm pointer-events-none select-none border border-white/10">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF66]"></span>
        </span>
        <span className="text-[9px] font-mono tracking-widest text-[#00FF66] uppercase font-bold">
          LIVE • BROADCAST
        </span>
      </div>

      {/* Big Play Overlay (Centered) */}
      {!isPlaying && !isBuffering && !errorDetails && (
        <button
          id="center-play-button"
          onClick={togglePlay}
          className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-gold/90 text-black flex items-center justify-center shadow-lg shadow-gold/20 hover:scale-110 active:scale-95 transition-all z-10"
        >
          <Play className="w-8 h-8 fill-current ml-1" />
        </button>
      )}

      {/* Custom Bottom Control Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent transition-transform duration-300 transform translate-y-12 group-hover:translate-y-0 select-none z-20">
        
        {/* Seek/Status progress track bar (simulated visual for live streams) */}
        <div className="w-full h-1 bg-zinc-850 rounded-full mb-4 overflow-hidden relative">
          <div className="absolute top-0 left-0 bottom-0 bg-gold animate-pulse w-[100%]" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Play/Pause Button */}
            <button
              id="ctrl-play-pause"
              onClick={togglePlay}
              className="p-1.5 text-zinc-300 hover:text-gold transition-colors"
              title={isPlaying ? "Pause Match" : "Play Match"}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            {/* Previous Channel Option */}
            {onPrevChannel && (
              <button
                id="ctrl-prev-channel"
                onClick={onPrevChannel}
                className="text-zinc-500 hover:text-gold transition-colors text-xs font-mono px-1.5 py-0.5 rounded border border-white/5 hover:border-gold/20"
                title="Previous Channel"
              >
                ◀ BACK
              </button>
            )}

            {/* Next Channel Option */}
            {onNextChannel && (
              <button
                id="ctrl-next-channel"
                onClick={onNextChannel}
                className="text-zinc-500 hover:text-gold transition-colors text-xs font-mono px-1.5 py-0.5 rounded border border-white/5 hover:border-gold/20"
                title="Next Channel"
              >
                NEXT ▶
              </button>
            )}

            {/* Volume Control */}
            <div className="flex items-center gap-2 ml-2 group/volume">
              <button
                id="ctrl-mute-toggle"
                onClick={toggleMute}
                className="p-1.5 text-zinc-300 hover:text-gold transition-colors"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                id="ctrl-volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 md:w-20 h-1 accent-gold bg-zinc-805 rounded-lg appearance-none cursor-pointer group-hover/volume:w-24 transition-all duration-300"
              />
            </div>

            {/* Feed Status tag */}
            <span className="hidden md:inline-flex items-center gap-1.5 ml-2 text-[10px] font-mono text-zinc-400">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span>LIVE FEED</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Stream Stats Info */}
            <div className="hidden sm:flex flex-col text-right font-mono text-[10px]">
              <span className="text-zinc-300 font-medium truncate max-w-[120px]">{channel.name}</span>
              <span className="text-gold text-[9px]">{resolution} • {channel.latency}ms latency</span>
            </div>

            {/* Fullscreen Toggle */}
            <button
              id="ctrl-fullscreen"
              onClick={toggleFullscreen}
              className="p-1.5 text-zinc-300 hover:text-gold transition-colors"
              title="Toggle Fullscreen"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
