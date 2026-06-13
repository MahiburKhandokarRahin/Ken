import { useState, useEffect } from "react";
import { CHANNELS, WORLD_CUP_MATCHES, INITIAL_CHAT } from "./data";
import { StreamChannel, WorldCupMatch, ChatMessage } from "./types";
import { HLSPlayer } from "./components/HLSPlayer";
import { MatchCenter } from "./components/MatchCenter";
import { FanLounge } from "./components/FanLounge";
import { FixturesPage } from "./components/FixturesPage";
import { StandingsPage } from "./components/StandingsPage";
import { 
  Tv, 
  HelpCircle, 
  Share2, 
  Globe, 
  Activity, 
  Radio, 
  ExternalLink, 
  ShieldAlert,
  Sliders,
  Sparkles,
  Info
} from "lucide-react";

const FAN_USERNAMES = [
  "Ronaldo_Siuuu", "KanteSmile", "WorldCupWhiz", "Albiceleste_9", "OusmaneTwist",
  "HarryKane_Kane", "SambaKings", "TikiTakaWizard", "KroosControl", "LeBleuArmy",
  "YellowCanary", "DeBruyneVision", "SalahKing", "SonnyExpress", "ModricMagic"
];

const FAN_MESSAGES = [
  "This referee needs glasses! What an absolute shocker. 🟥",
  "Is anyone else experiencing 0 latency? Cazé TV stream is so smooth!",
  "What a phenomenal tackle! Pure world-class defending. 🏆",
  "VAMOS BRASIL! Off to the semi-finals for sure 🇧🇷✨",
  "Mbappe is just cheat code status... the speed is absolute insanity! 🇫🇷",
  "Can you guys believe the atmosphere in the stadium? Unreal.",
  "Which server is best? Server 2 feels extremely fast for me.",
  "Unbelievable save! Keeper is having the game of his life!",
  "Is VAR checking that? Looked like a handball to me 🖥️",
  "Argentina looks unstoppable this half. Messi is dictating everything.",
  "This tournament is mathematically the best World Cup of the decade!",
  "My heart cannot take this penalty tension... 😂⚽"
];

const AVATAR_COLORS = [
  "bg-blue-600", "bg-emerald-600", "bg-purple-600", "bg-rose-600", "bg-amber-600",
  "bg-indigo-600", "bg-pink-600", "bg-cyan-600", "bg-teal-600", "bg-violet-600"
];

export default function App() {
  const [channels] = useState<StreamChannel[]>(CHANNELS);
  const [brokenChannelIds, setBrokenChannelIds] = useState<string[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<StreamChannel>(CHANNELS[0]);
  const [matches, setMatches] = useState<WorldCupMatch[]>(WORLD_CUP_MATCHES);
  const [selectedMatchId, setSelectedMatchId] = useState<string>("match-1");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  
  const handleChannelError = (channelId: string) => {
    setBrokenChannelIds(prev => {
      if (!prev.includes(channelId)) {
        const updated = [...prev, channelId];
        const remaining = channels.filter(ch => !updated.includes(ch.id));
        if (remaining.length > 0 && selectedChannel.id === channelId) {
          setSelectedChannel(remaining[0]);
        }
        return updated;
      }
      return prev;
    });
  };

  // Active tab state ("home" | "matches" | "standings")
  const [activeTab, setActiveTab] = useState<"home" | "matches" | "standings">("home");

  // Helper dynamic time string getter
  const getFormattedTime = () => {
    const now = new Date();
    return now.toTimeString().substring(0, 5);
  };

  // Add a standard chat message
  const handleSendMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      username: "You",
      text: text,
      time: getFormattedTime(),
      avatarColor: "bg-emerald-500",
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  // Add system / live commentator broadcast
  const addSystemMessage = (text: string) => {
    const systemMsg: ChatMessage = {
      id: `sys-${Date.now()}`,
      username: "SystemBroadcast",
      text: text,
      time: getFormattedTime(),
      avatarColor: "bg-amber-600",
      isSystem: true
    };
    setChatMessages(prev => [...prev, systemMsg]);
  };

  // Goal Simulator
  const handleSimulateGoal = (matchId: string, team: "home" | "away") => {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id === matchId) {
          const nextHome = team === "home" ? m.homeScore + 1 : m.homeScore;
          const nextAway = team === "away" ? m.awayScore + 1 : m.awayScore;
          
          // Randomly select a player scorer name based on typical squad
          const squadHome = m.homeCode === "BRA" ? ["Neymar Jr.", "Vinicius Jr.", "Richarlison", "Casemiro", "Rodrygo"] : ["Messi", "Martinez", "Di Maria", "De Paul", "Alvarez"];
          const squadAway = m.awayCode === "FRA" ? ["Mbappé", "Giroud", "Griezmann", "Dembélé", "Hernandez"] : ["Kane", "Saka", "Bellingham", "Foden", "Rashford"];
          const scorerList = team === "home" ? squadHome : squadAway;
          const randomScorer = scorerList[Math.floor(Math.random() * scorerList.length)];

          // Trigger commentary
          const commentary = `⚽ GOAL ALERT! ${team === "home" ? m.homeFlag : m.awayFlag} ${team === "home" ? m.homeTeam : m.awayTeam} SCORES! Amazing strike by ${randomScorer}! Match status: ${nextHome} - ${nextAway} (${m.time}) 🎉`;
          addSystemMessage(commentary);

          // Update stats
          let updatedStats = m.stats;
          if (updatedStats) {
            updatedStats = {
              ...updatedStats,
              shotsOnTarget: [
                team === "home" ? updatedStats.shotsOnTarget[0] + 1 : updatedStats.shotsOnTarget[0],
                team === "away" ? updatedStats.shotsOnTarget[1] + 1 : updatedStats.shotsOnTarget[1]
              ]
            };
          }

          return {
            ...m,
            homeScore: nextHome,
            awayScore: nextAway,
            stats: updatedStats
          };
        }
        return m;
      })
    );
  };

  // Simulate other stats (foul, corners, shots)
  const handleSimulateEvent = (matchId: string, eventType: "foul" | "corner" | "shot") => {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id === matchId && m.stats) {
          const isHomeEvent = Math.random() > 0.45; // random assignment of team
          const teamName = isHomeEvent ? m.homeTeam : m.awayTeam;
          const teamFlag = isHomeEvent ? m.homeFlag : m.awayFlag;
          
          let nextStats = { ...m.stats };
          let comment = "";

          if (eventType === "shot") {
            const index = isHomeEvent ? 0 : 1;
            const onTarget = Math.random() > 0.4;
            if (onTarget) {
              nextStats.shotsOnTarget[index] += 1;
              comment = `🎯 SHOT ON TARGET! Strong effort by ${teamFlag} ${teamName} is tipped away by the keeper!`;
            } else {
              nextStats.shotsOffTarget[index] += 1;
              comment = `🥅 SHOT OFF TARGET! A wild curling shot from ${teamFlag} ${teamName} flies wide of the post!`;
            }
          } else if (eventType === "foul") {
            const index = isHomeEvent ? 0 : 1;
            nextStats.fouls[index] += 1;
            const cardDraw = Math.random() > 0.85;
            if (cardDraw) {
              nextStats.yellowCards[index] += 1;
              comment = `🟥 YELLOW CARD! ${teamFlag} ${teamName} defender slides hard and receives a caution from the referee!`;
            } else {
              comment = `⚠️ FOUL! Free kick awarded to the opponent after a rough contact tackle by ${teamFlag} ${teamName}.`;
            }
          } else if (eventType === "corner") {
            const index = isHomeEvent ? 0 : 1;
            nextStats.corners[index] += 1;
            comment = `🚩 CORNER FLAGGED! Clear block rewards ${teamFlag} ${teamName} with an offensive set-piece corner.`;
          }

          addSystemMessage(comment);

          return {
            ...m,
            stats: nextStats
          };
        }
        return m;
      })
    );
  };

  // Generate simulated fan active chat every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomUsername = FAN_USERNAMES[Math.floor(Math.random() * FAN_USERNAMES.length)];
      const randomMessage = FAN_MESSAGES[Math.floor(Math.random() * FAN_MESSAGES.length)];
      const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

      const newSimMessage: ChatMessage = {
        id: `s-${Date.now()}`,
        username: randomUsername,
        text: randomMessage,
        time: getFormattedTime(),
        avatarColor: randomColor
      };

      setChatMessages(prev => {
        // Keep chat queue at max 40 items to prevent client lag
        const slice = prev.length > 40 ? prev.slice(prev.length - 30) : prev;
        return [...slice, newSimMessage];
      });
    }, 7500);

    return () => clearInterval(interval);
  }, []);

  // Quick helper to jump channel via controls
  const handlePrevChannel = () => {
    const currentIndex = channels.findIndex(c => c.id === selectedChannel.id);
    const prevIndex = (currentIndex - 1 + channels.length) % channels.length;
    setSelectedChannel(channels[prevIndex]);
  };

  const handleNextChannel = () => {
    const currentIndex = channels.findIndex(c => c.id === selectedChannel.id);
    const nextIndex = (currentIndex + 1) % channels.length;
    setSelectedChannel(channels[nextIndex]);
  };

  // Share platform copy action (never share/expose direct stream URLs)
  const [copied, setCopied] = useState(false);
  const handleShareClick = () => {
    navigator.clipboard.writeText("https://kenstreaming.vercel.app/");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="world-cup-app-container" className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col font-sans select-none relative overflow-x-hidden">
      
      {/* Visual background ambient glow elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full pointer-events-none select-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gold/2 blur-[100px] rounded-full pointer-events-none select-none" />

      {/* Top Navigation */}
      <header className="h-16 px-4 md:px-8 border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-4">
          
          {/* Logo & Category Links */}
          <div className="flex items-center gap-6 md:gap-8">
            <div className="text-xl md:text-2xl font-black tracking-tighter text-[#00FF66] flex items-center gap-1.5 uppercase font-display">
              KEN <span className="text-white">STREAMING</span>
            </div>
            
            <div className="hidden md:flex gap-6 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <button 
                onClick={() => setActiveTab("home")}
                className={`cursor-pointer transition-colors ${activeTab === "home" ? "text-[#00FF66] border-b-2 border-[#00FF66] pb-1" : "hover:text-white"}`}
              >
                Home
              </button>
              <button 
                onClick={() => setActiveTab("matches")}
                className={`cursor-pointer transition-colors ${activeTab === "matches" ? "text-[#00FF66] border-b-2 border-[#00FF66] pb-1" : "hover:text-white"}`}
              >
                Matches
              </button>
              <button 
                onClick={() => setActiveTab("standings")}
                className={`cursor-pointer transition-colors ${activeTab === "standings" ? "text-[#00FF66] border-b-2 border-[#00FF66] pb-1" : "hover:text-white"}`}
              >
                Standings
              </button>
            </div>
          </div>

          {/* Action Items */}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              id="share-link-btn"
              onClick={handleShareClick}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00FF66] text-black hover:bg-gold-hover active:scale-95 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? "Copied Link!" : "Share stream"}</span>
            </button>

            <span className="hidden lg:flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono bg-zinc-950 px-3 py-1.5 rounded-lg border border-white/5">
              <Globe className="w-3.5 h-3.5 text-gold" />
              <span>UTC TIME 2026</span>
            </span>

            <div className="hidden sm:flex items-center px-2.5 py-1 bg-red-600 rounded text-[10px] font-extrabold tracking-widest uppercase animate-pulse">
              Live Now
            </div>
          </div>

        </div>
      </header>

      {/* Main Container Layout */}
      <main className="max-w-7xl mx-auto p-4 md:p-6 w-full flex-1">
        {activeTab === "matches" ? (
          <FixturesPage />
        ) : activeTab === "standings" ? (
          <StandingsPage />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
            
            {/* Left Side: Video Player, Stream Selectors, Help Guidelines (8/12 widths) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* HLS Video Display Applet */}
          <section id="live-player-section" className="w-full">
            <HLSPlayer 
              channel={selectedChannel} 
              onPrevChannel={handlePrevChannel}
              onNextChannel={handleNextChannel}
              onChannelError={handleChannelError}
            />
          </section>

          {/* Stream Selector Deck */}
          <section id="channel-selectors-section" className="p-5 bg-[#111] border border-white/5 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl pointer-events-none rounded-full" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/5 gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gold font-display flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-gold animate-pulse" />
                  Select Live Broadcast Servers
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Choose from any HLS feeds provided by our World Cup relay IPs.
                </p>
              </div>
              <span className="text-[10px] bg-black/60 px-2.5 py-1 rounded-md text-zinc-500 font-mono tracking-widest uppercase border border-white/5">
                {channels.length} FEEDS ACTIVE
              </span>
            </div>

            {/* Channels Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {channels.map((ch) => {
                const isSelected = ch.id === selectedChannel.id;
                return (
                  <button
                    id={`chan-card-${ch.id}`}
                    key={ch.id}
                    onClick={() => setSelectedChannel(ch)}
                    className={`p-3.5 rounded-xl text-left transition-all border flex flex-col justify-between h-[115px] select-none cursor-pointer ${
                      isSelected 
                        ? "bg-[#111] border-l-4 border-l-gold border-y-white/5 border-r-white/5 text-white shadow-lg shadow-gold/5 scale-[1.01]" 
                        : "bg-black/40 border-white/5 hover:border-white/10 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2.5 mb-1.5">
                        <span className={`text-xs font-bold truncate tracking-tight ${isSelected ? "text-gold" : "text-zinc-200"}`}>{ch.name}</span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-gold animate-ping shrink-0" />
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-500 line-clamp-2 leading-relaxed">
                        {ch.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-zinc-950 pt-2 text-[9px] font-mono font-medium tracking-wide">
                      <span className={isSelected ? "text-gold" : "text-zinc-500"}>
                        {ch.bitrate}
                      </span>
                      <span className="text-zinc-500">
                        {ch.latency}ms ping
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>



        </div>

        {/* Right Side: Match Center & Live Chat (4/12 widths, stackable) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Match statistics and scoreboard center */}
          <div className="lg:h-[45%] flex-none">
            <MatchCenter 
              matches={matches} 
              selectedMatchId={selectedMatchId}
              onSelectMatch={setSelectedMatchId}
              selectedChannel={selectedChannel}
            />
          </div>

          {/* Social Twitch-style Fan Lounge Chat */}
          <div className="lg:h-[50%] min-h-[480px] flex-grow">
            <FanLounge 
              chatMessages={chatMessages} 
              onSendMessage={handleSendMessage}
            />
          </div>

        </div>

          </div>
        )}
      </main>

      {/* Footer credits and information */}
      <footer className="mt-12 py-10 bg-black/60 border-t border-white/5 text-center text-xs text-zinc-500 select-none">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px]">
          <div className="flex items-center gap-1.5">
            <Tv className="w-3.5 h-3.5 text-gold" />
            <span>© 2026 WORLD CUP HLS TV LAYER • POWERED BY RELAY IPs</span>
          </div>
          <div className="text-zinc-600">
            <span>SUPPORTED PLAYER STANDARDS: HLSv4 • TS PACKETS • AES-128 DECRYPTION</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
