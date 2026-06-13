import React, { useState } from "react";
import { 
  Trophy, 
  Search, 
  Award, 
  TrendingUp, 
  Info, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  Sparkles,
  Zap,
  Target,
  ShieldCheck,
  RefreshCw,
  Globe,
  ChevronUp,
  ChevronDown
} from "lucide-react";

interface StandingTeam {
  position: number;
  team: string;
  flag: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
  form: ("W" | "D" | "L")[];
}

export interface FifaRankTeam {
  rank: number;
  team: string;
  flag: string;
  points: number;
  change: number;
  confederation: string;
}

const STANDINGS_DATA: Record<string, StandingTeam[]> = {
  A: [
    { position: 1, team: "Mexico", flag: "🇲🇽", played: 3, won: 2, drawn: 1, lost: 0, gf: 6, ga: 2, gd: 4, pts: 7, form: ["W", "D", "W"] },
    { position: 2, team: "Czechia", flag: "🇨🇿", played: 3, won: 2, drawn: 0, lost: 1, gf: 4, ga: 3, gd: 1, pts: 6, form: ["L", "W", "W"] },
    { position: 3, team: "South Korea", flag: "🇰🇷", played: 3, won: 1, drawn: 1, lost: 1, gf: 3, ga: 3, gd: 0, pts: 4, form: ["W", "D", "L"] },
    { position: 4, team: "New Zealand", flag: "🇳🇿", played: 3, won: 1, drawn: 0, lost: 2, gf: 2, ga: 4, gd: -2, pts: 3, form: ["L", "L", "W"] },
    { position: 5, team: "Iran", flag: "🇮🇷", played: 3, won: 0, drawn: 2, lost: 1, gf: 2, ga: 3, gd: -1, pts: 2, form: ["D", "D", "L"] },
    { position: 6, team: "South Africa", flag: "🇿🇦", played: 3, won: 0, drawn: 0, lost: 3, gf: 1, ga: 5, gd: -4, pts: 0, form: ["L", "L", "L"] },
  ],
  B: [
    { position: 1, team: "USA", flag: "🇺🇸", played: 3, won: 2, drawn: 1, lost: 0, gf: 7, ga: 2, gd: 5, pts: 7, form: ["W", "W", "D"] },
    { position: 2, team: "Canada", flag: "🇨🇦", played: 3, won: 2, drawn: 0, lost: 1, gf: 5, ga: 3, gd: 2, pts: 6, form: ["W", "L", "W"] },
    { position: 3, team: "Switzerland", flag: "🇨🇭", played: 3, won: 1, drawn: 1, lost: 1, gf: 4, ga: 4, gd: 0, pts: 4, form: ["D", "W", "L"] },
    { position: 4, team: "Australia", flag: "🇦🇺", played: 3, won: 1, drawn: 0, lost: 2, gf: 3, ga: 5, gd: -2, pts: 3, form: ["L", "W", "L"] },
    { position: 5, team: "Qatar", flag: "🇶🇦", played: 3, won: 0, drawn: 2, lost: 1, gf: 2, ga: 4, gd: -2, pts: 2, form: ["D", "L", "D"] },
    { position: 6, team: "Bosnia & Herz.", flag: "🇧🇦", played: 3, won: 0, drawn: 1, lost: 2, gf: 1, ga: 6, gd: -5, pts: 1, form: ["L", "D", "L"] },
  ],
  C: [
    { position: 1, team: "Brazil", flag: "🇧🇷", played: 3, won: 3, drawn: 0, lost: 0, gf: 9, ga: 1, gd: 8, pts: 9, form: ["W", "W", "W"] },
    { position: 2, team: "Morocco", flag: "🇲🇦", played: 3, won: 2, drawn: 0, lost: 1, gf: 5, ga: 3, gd: 2, pts: 6, form: ["W", "W", "L"] },
    { position: 3, team: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", played: 3, won: 1, drawn: 0, lost: 2, gf: 3, ga: 6, gd: -3, pts: 3, form: ["L", "L", "W"] },
    { position: 4, team: "Haiti", flag: "🇭🇹", played: 3, won: 0, drawn: 0, lost: 3, gf: 1, ga: 8, gd: -7, pts: 0, form: ["L", "L", "L"] },
  ],
  D: [
    { position: 1, team: "Turkey", flag: "🇹🇷", played: 3, won: 2, drawn: 1, lost: 0, gf: 5, ga: 2, gd: 3, pts: 7, form: ["W", "D", "W"] },
    { position: 2, team: "USA", flag: "🇺🇸", played: 3, won: 1, drawn: 2, lost: 0, gf: 4, ga: 2, gd: 2, pts: 5, form: ["D", "W", "D"] },
    { position: 3, team: "Paraguay", flag: "🇵🇾", played: 3, won: 1, drawn: 0, lost: 2, gf: 3, ga: 5, gd: -2, pts: 3, form: ["L", "L", "W"] },
    { position: 4, team: "Australia", flag: "🇦🇺", played: 3, won: 0, drawn: 1, lost: 2, gf: 2, ga: 5, gd: -3, pts: 1, form: ["D", "L", "L"] },
  ],
  E: [
    { position: 1, team: "Germany", flag: "🇩🇪", played: 3, won: 2, drawn: 1, lost: 0, gf: 6, ga: 2, gd: 4, pts: 7, form: ["W", "D", "W"] },
    { position: 2, team: "Ecuador", flag: "🇪🇨", played: 3, won: 2, drawn: 0, lost: 1, gf: 5, ga: 3, gd: 2, pts: 6, form: ["W", "L", "W"] },
    { position: 3, team: "Ivory Coast", flag: "🇨🇮", played: 3, won: 1, drawn: 1, lost: 1, gf: 4, ga: 4, gd: 0, pts: 4, form: ["D", "W", "L"] },
    { position: 4, team: "Curacao", flag: "🇨🇼", played: 3, won: 0, drawn: 0, lost: 3, gf: 1, ga: 7, gd: -6, pts: 0, form: ["L", "L", "L"] },
  ],
  F: [
    { position: 1, team: "Netherlands", flag: "🇳🇱", played: 3, won: 2, drawn: 1, lost: 0, gf: 7, ga: 2, gd: 5, pts: 7, form: ["W", "W", "D"] },
    { position: 2, team: "Japan", flag: "🇯🇵", played: 3, won: 2, drawn: 0, lost: 1, gf: 4, ga: 3, gd: 1, pts: 6, form: ["W", "L", "W"] },
    { position: 3, team: "Sweden", flag: "🇸🇪", played: 3, won: 1, drawn: 1, lost: 1, gf: 3, ga: 3, gd: 0, pts: 4, form: ["L", "D", "W"] },
    { position: 4, team: "Tunisia", flag: "🇹🇳", played: 3, won: 0, drawn: 0, lost: 3, gf: 1, ga: 7, gd: -6, pts: 0, form: ["L", "L", "L"] },
  ],
  G: [
    { position: 1, team: "Belgium", flag: "🇧🇪", played: 3, won: 2, drawn: 1, lost: 0, gf: 6, ga: 2, gd: 4, pts: 7, form: ["W", "D", "W"] },
    { position: 2, team: "Egypt", flag: "🇪🇬", played: 3, won: 1, drawn: 2, lost: 0, gf: 4, ga: 3, gd: 1, pts: 5, form: ["D", "W", "D"] },
    { position: 3, team: "Iran", flag: "🇮🇷", played: 3, won: 1, drawn: 0, lost: 2, gf: 3, ga: 5, gd: -2, pts: 3, form: ["L", "L", "W"] },
    { position: 4, team: "New Zealand", flag: "🇳🇿", played: 3, won: 0, drawn: 1, lost: 2, gf: 2, ga: 5, gd: -3, pts: 1, form: ["D", "L", "L"] },
  ],
  H: [
    { position: 1, team: "Spain", flag: "🇪🇸", played: 3, won: 2, drawn: 1, lost: 0, gf: 8, ga: 3, gd: 5, pts: 7, form: ["W", "W", "D"] },
    { position: 2, team: "Uruguay", flag: "🇺🇾", played: 3, won: 2, drawn: 0, lost: 1, gf: 5, ga: 4, gd: 1, pts: 6, form: ["L", "W", "W"] },
    { position: 3, team: "Saudi Arabia", flag: "🇸🇦", played: 3, won: 1, drawn: 1, lost: 1, gf: 3, ga: 3, gd: 0, pts: 4, form: ["W", "D", "L"] },
    { position: 4, team: "Cape Verde", flag: "🇨🇻", played: 3, won: 0, drawn: 0, lost: 3, gf: 2, ga: 8, gd: -6, pts: 0, form: ["L", "L", "L"] },
  ],
  I: [
    { position: 1, team: "France", flag: "🇫🇷", played: 3, won: 2, drawn: 1, lost: 0, gf: 7, ga: 2, gd: 5, pts: 7, form: ["W", "D", "W"] },
    { position: 2, team: "Norway", flag: "🇳🇴", played: 3, won: 2, drawn: 0, lost: 1, gf: 5, ga: 4, gd: 1, pts: 6, form: ["W", "L", "W"] },
    { position: 3, team: "Senegal", flag: "🇸🇳", played: 3, won: 1, drawn: 1, lost: 1, gf: 3, ga: 3, gd: 0, pts: 4, form: ["D", "W", "L"] },
    { position: 4, team: "Iraq", flag: "🇮🇶", played: 3, won: 0, drawn: 0, lost: 3, gf: 1, ga: 7, gd: -6, pts: 0, form: ["L", "L", "L"] },
  ],
  J: [
    { position: 1, team: "Argentina", flag: "🇦🇷", played: 3, won: 3, drawn: 0, lost: 0, gf: 8, ga: 1, gd: 7, pts: 9, form: ["W", "W", "W"] },
    { position: 2, team: "Algeria", flag: "🇩🇿", played: 3, won: 1, drawn: 1, lost: 1, gf: 4, ga: 4, gd: 0, pts: 4, form: ["D", "L", "W"] },
    { position: 3, team: "Austria", flag: "🇦🇹", played: 3, won: 1, drawn: 1, lost: 1, gf: 3, ga: 4, gd: -1, pts: 4, form: ["W", "D", "L"] },
    { position: 4, team: "Jordan", flag: "🇯🇴", played: 3, won: 0, drawn: 0, lost: 3, gf: 1, ga: 7, gd: -6, pts: 0, form: ["L", "L", "L"] },
  ],
  K: [
    { position: 1, team: "Portugal", flag: "🇵🇹", played: 3, won: 2, drawn: 1, lost: 0, gf: 6, ga: 2, gd: 4, pts: 7, form: ["W", "D", "W"] },
    { position: 2, team: "Colombia", flag: "🇨🇴", played: 3, won: 2, drawn: 0, lost: 1, gf: 5, ga: 3, gd: 2, pts: 6, form: ["W", "L", "W"] },
    { position: 3, team: "Uzbekistan", flag: "🇺🇿", played: 3, won: 1, drawn: 1, lost: 1, gf: 3, ga: 3, gd: 0, pts: 4, form: ["D", "W", "L"] },
    { position: 4, team: "DR Congo", flag: "🇨🇩", played: 3, won: 0, drawn: 0, lost: 3, gf: 1, ga: 7, gd: -6, pts: 0, form: ["L", "L", "L"] },
  ],
  L: [
    { position: 1, team: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", played: 3, won: 2, drawn: 1, lost: 0, gf: 8, ga: 2, gd: 6, pts: 7, form: ["W", "W", "D"] },
    { position: 2, team: "Croatia", flag: "🇭🇷", played: 3, won: 2, drawn: 0, lost: 1, gf: 4, ga: 3, gd: 1, pts: 6, form: ["L", "W", "W"] },
    { position: 3, team: "Ghana", flag: "🇬🇭", played: 3, won: 1, drawn: 1, lost: 1, gf: 3, ga: 4, gd: -1, pts: 4, form: ["W", "D", "L"] },
    { position: 4, team: "Panama", flag: "🇵🇦", played: 3, won: 0, drawn: 0, lost: 3, gf: 1, ga: 7, gd: -6, pts: 0, form: ["L", "L", "L"] },
  ]
};

const INITIAL_FIFA_RANKINGS: FifaRankTeam[] = [
  { rank: 1, team: "Argentina", flag: "🇦🇷", points: 1858, change: 0, confederation: "CONMEBOL" },
  { rank: 2, team: "France", flag: "🇫🇷", points: 1840, change: 0, confederation: "UEFA" },
  { rank: 3, team: "Belgium", flag: "🇧🇪", points: 1795, change: 0, confederation: "UEFA" },
  { rank: 4, team: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", points: 1794, change: 0, confederation: "UEFA" },
  { rank: 5, team: "Brazil", flag: "🇧🇷", points: 1788, change: 0, confederation: "CONMEBOL" },
  { rank: 6, team: "Portugal", flag: "🇵🇹", points: 1748, change: 1, confederation: "UEFA" },
  { rank: 7, team: "Netherlands", flag: "🇳🇱", points: 1742, change: -1, confederation: "UEFA" },
  { rank: 8, team: "Spain", flag: "🇪🇸", points: 1729, change: 1, confederation: "UEFA" },
  { rank: 9, team: "Italy", flag: "🇮🇹", points: 1724, change: -1, confederation: "UEFA" },
  { rank: 10, team: "Croatia", flag: "🇭🇷", points: 1721, change: 0, confederation: "UEFA" },
  { rank: 11, team: "USA", flag: "🇺🇸", points: 1681, change: 1, confederation: "CONCACAF" },
  { rank: 12, team: "Colombia", flag: "🇨🇴", points: 1669, change: 2, confederation: "CONMEBOL" },
  { rank: 13, team: "Morocco", flag: "🇲🇦", points: 1661, change: -2, confederation: "CAF" },
  { rank: 14, team: "Mexico", flag: "🇲🇽", points: 1658, change: -1, confederation: "CONCACAF" },
  { rank: 15, team: "Uruguay", flag: "🇺🇾", points: 1655, change: 0, confederation: "CONMEBOL" },
  { rank: 16, team: "Germany", flag: "🇩🇪", points: 1644, change: 1, confederation: "UEFA" },
  { rank: 17, team: "Senegal", flag: "🇸🇳", points: 1623, change: -1, confederation: "CAF" },
  { rank: 18, team: "Japan", flag: "🇯🇵", points: 1621, change: 0, confederation: "AFC" },
  { rank: 19, team: "Switzerland", flag: "🇨🇭", points: 1617, change: 0, confederation: "UEFA" },
  { rank: 20, team: "Iran", flag: "🇮🇷", points: 1611, change: 1, confederation: "AFC" },
  { rank: 21, team: "Denmark", flag: "🇩🇰", points: 1602, change: -1, confederation: "UEFA" },
  { rank: 22, team: "Ukraine", flag: "🇺🇦", points: 1565, change: 0, confederation: "UEFA" },
  { rank: 23, team: "South Korea", flag: "🇰🇷", points: 1562, change: 1, confederation: "AFC" },
  { rank: 24, team: "Australia", flag: "🇦🇺", points: 1559, change: -1, confederation: "AFC" },
  { rank: 25, team: "Sweden", flag: "🇸🇪", points: 1552, change: 0, confederation: "UEFA" },
  { rank: 26, team: "Turkey", flag: "🇹🇷", points: 1545, change: 2, confederation: "UEFA" },
  { rank: 27, team: "Wales", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", points: 1538, change: -1, confederation: "UEFA" },
  { rank: 28, team: "Ecuador", flag: "🇪🇨", points: 1535, change: 1, confederation: "CONMEBOL" },
  { rank: 29, team: "Poland", flag: "🇵🇱", points: 1528, change: -2, confederation: "UEFA" },
  { rank: 30, team: "Hungary", flag: "🇭🇺", points: 1522, change: 0, confederation: "UEFA" }
];

const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

export const StandingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"groups" | "fifa-rankings">("groups");
  const [activeGroup, setActiveGroup] = useState<string>("C"); // default to Grand Stage Group C which has Brazil
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [standings, setStandings] = useState<Record<string, StandingTeam[]>>(STANDINGS_DATA);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState<boolean>(false);

  // FIFA World Rankings States
  const [fifaRankings, setFifaRankings] = useState<FifaRankTeam[]>(INITIAL_FIFA_RANKINGS);
  const [fifaLastSynced, setFifaLastSynced] = useState<string | null>(null);
  const [isSyncingFifa, setIsSyncingFifa] = useState<boolean>(false);
  const [fifaSyncError, setFifaSyncError] = useState<string | null>(null);
  const [isFifaRateLimited, setIsFifaRateLimited] = useState<boolean>(false);

  const fetchLiveStandings = async () => {
    setIsSyncing(true);
    setSyncError(null);
    setIsRateLimited(false);
    try {
      const res = await fetch("/api/standings");
      if (!res.ok) {
        throw new Error(`HTTP Error Status: ${res.status}`);
      }
      const data = await res.json();
      
      if (data.isRateLimited) {
        setIsRateLimited(true);
      }

      if (data.status === "success" && Array.isArray(data.groupsList)) {
        const parsedRecord: Record<string, StandingTeam[]> = {};
        data.groupsList.forEach((group: any) => {
          if (group.groupName && Array.isArray(group.teams)) {
            parsedRecord[group.groupName] = group.teams.map((t: any) => ({
              position: Number(t.position),
              team: String(t.team),
              flag: String(t.flag || "🏳️"),
              played: Number(t.played),
              won: Number(t.won),
              drawn: Number(t.drawn),
              lost: Number(t.lost),
              gf: Number(t.gf),
              ga: Number(t.ga),
              gd: Number(t.gd),
              pts: Number(t.pts),
              form: Array.isArray(t.form) ? t.form : []
            }));
          }
        });
        setStandings(prev => ({ ...prev, ...parsedRecord }));
        setLastSynced(data.lastUpdated || new Date().toLocaleTimeString());
      } else {
        throw new Error(data.message || "Invalid format received.");
      }
    } catch (err: any) {
      console.error("Live sync failed:", err);
      setSyncError(err.message || "Connection timed out.");
    } finally {
      setIsSyncing(false);
    }
  };

  const fetchLiveFifaRankings = async () => {
    setIsSyncingFifa(true);
    setFifaSyncError(null);
    setIsFifaRateLimited(false);
    try {
      const res = await fetch("/api/fifa-rankings");
      if (!res.ok) {
        throw new Error(`HTTP Error Status: ${res.status}`);
      }
      const data = await res.json();
      
      if (data.isRateLimited) {
        setIsFifaRateLimited(true);
      }

      if (data.status === "success" && Array.isArray(data.rankings)) {
        setFifaRankings(data.rankings.map((r: any) => ({
          rank: Number(r.rank),
          team: String(r.team),
          flag: String(r.flag || "🏳️"),
          points: Number(r.points),
          change: Number(r.change || 0),
          confederation: String(r.confederation || "UEFA")
        })));
        setFifaLastSynced(data.lastUpdated || new Date().toLocaleTimeString());
      } else {
        throw new Error(data.message || "Invalid format received.");
      }
    } catch (err: any) {
      console.error("FIFA live sync failed:", err);
      setFifaSyncError(err.message || "Connection timed out.");
    } finally {
      setIsSyncingFifa(false);
    }
  };

  React.useEffect(() => {
    fetchLiveStandings();
    fetchLiveFifaRankings();
  }, []);

  // Quick statistics calculated on dynamic standings state
  const allTeams: StandingTeam[] = Object.values(standings).flat() as StandingTeam[];
  const sortedByPoints = [...allTeams].sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
  const bestAttack = [...allTeams].sort((a, b) => b.gf - a.gf).slice(0, 5);
  const bestDefense = [...allTeams].sort((a, b) => a.ga - b.ga || b.pts - a.pts).slice(0, 5);

  const filteredTeams = searchQuery.trim()
    ? allTeams.filter(t => t.team.toLowerCase().includes(searchQuery.toLowerCase()))
    : standings[activeGroup] || [];

  // FIFA World Rankings computed indicators
  const filteredFifaRankings = searchQuery.trim()
    ? fifaRankings.filter(t => t.team.toLowerCase().includes(searchQuery.toLowerCase()))
    : fifaRankings;

  // Confederation Leaders (lowest rank / highest position in each confederation)
  const confs = Array.from(new Set(fifaRankings.map(r => r.confederation)));
  const confederationLeaders = confs.map(conf => {
    const teamsInConf = fifaRankings.filter(r => r.confederation === conf);
    const sorted = [...teamsInConf].sort((a, b) => a.rank - b.rank);
    return sorted[0];
  }).filter(Boolean).sort((a, b) => a.rank - b.rank).slice(0, 5);

  // Top Climbers: teams with positive position shifts
  const topClimbers = [...fifaRankings]
    .filter(r => r.change > 0)
    .sort((a, b) => b.change - a.change)
    .slice(0, 5);

  return (
    <div className="text-slate-200 selection:bg-green-500/30 selection:text-green-200 animate-fadeIn bg-[#0B0E14] min-h-screen p-4 md:p-6">
      
      {/* Sofascore Navigation Tab Switcher */}
      <div className="flex border-b border-white/5 mb-6">
        <button
          id="tab-groups-btn"
          onClick={() => { setActiveTab("groups"); setSearchQuery(""); }}
          className={`px-6 py-3 font-semibold text-xs md:text-sm uppercase tracking-wider transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === "groups"
              ? "border-[#00FF66] text-[#00FF66] bg-[#00FF66]/5 font-extrabold"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Trophy className="w-4 h-4" />
          Groups & Pools
        </button>
        <button
          id="tab-fifa-btn"
          onClick={() => { setActiveTab("fifa-rankings"); setSearchQuery(""); }}
          className={`px-6 py-3 font-semibold text-xs md:text-sm uppercase tracking-wider transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
            activeTab === "fifa-rankings"
              ? "border-[#00FF66] text-[#00FF66] bg-[#00FF66]/5 font-extrabold"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Globe className="w-4 h-4" />
          FIFA Live Rankings (Sofascore)
        </button>
      </div>

      {/* Subheader Dashboard Metrics */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-black/40 border border-green-500/10 p-5 rounded-2xl mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="heading-font text-base font-bold text-white flex items-center gap-2">
              {activeTab === "groups" ? (
                <>
                  <Trophy className="w-4.5 h-4.5 text-[#00FF66]" />
                  Cup Standings Hub
                </>
              ) : (
                <>
                  <Globe className="w-4.5 h-4.5 text-[#00FF66]" />
                  FIFA World Leaderboard
                </>
              )}
            </h2>
            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              (activeTab === "groups" ? isSyncing : isSyncingFifa) 
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse" 
                : (activeTab === "groups" ? lastSynced : fifaLastSynced) 
                ? "bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/20" 
                : "bg-zinc-500/10 text-zinc-400 border border-white/5"
            }`}>
              {(activeTab === "groups" ? isSyncing : isSyncingFifa) ? "Syncing Web..." : (activeTab === "groups" ? lastSynced : fifaLastSynced) ? "Live Internet Sync" : "Local Baseline"}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {activeTab === "groups" 
              ? "Realtime 2026 World Cup standings synchronized with current results across the web."
              : "Sourced with live positions, points, rating shifts & rankings statistics matching Sofascore's feed."
            }
          </p>
          {(activeTab === "groups" ? lastSynced : fifaLastSynced) && (
            <p className="text-[10px] text-[#00FF66] font-mono mt-1 opacity-80 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-[#00FF66] inline-block animate-ping"></span>
              Synchronized with internet source at: <span className="font-bold underline">{activeTab === "groups" ? lastSynced : fifaLastSynced}</span>
            </p>
          )}
          {(activeTab === "groups" ? isRateLimited : isFifaRateLimited) && (
            <p className="text-[10px] text-amber-400 font-mono mt-1 flex items-center gap-1 bg-amber-500/10 px-2 py-1.5 rounded-lg border border-amber-500/20 max-w-md">
              <span>⚡ API rate limit reached. Displaying optimized server-cached results to keep search active.</span>
            </p>
          )}
          {(activeTab === "groups" ? syncError : fifaSyncError) && (
            <p className="text-[10px] text-rose-400 font-mono mt-1 flex items-center gap-1">
              <span>⚠ Live Sync Timeout ({activeTab === "groups" ? syncError : fifaSyncError}). Displaying local simulation.</span>
            </p>
          )}
        </div>

        {/* Global Stats Bulletins & Sync Actions */}
        <div className="flex flex-wrap items-center gap-3 justify-start lg:justify-end w-full lg:w-auto">
          <button
            id="sync-results-btn"
            onClick={activeTab === "groups" ? fetchLiveStandings : fetchLiveFifaRankings}
            disabled={activeTab === "groups" ? isSyncing : isSyncingFifa}
            className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 disabled:opacity-50 ${
              (activeTab === "groups" ? isSyncing : isSyncingFifa) 
                ? "bg-zinc-950 border-white/5 text-zinc-500" 
                : "bg-neutral-900 border-green-500/20 hover:border-green-500/40 text-white hover:text-[#00FF66]"
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${(activeTab === "groups" ? isSyncing : isSyncingFifa) ? "animate-spin text-amber-400" : "text-[#00FF66]"}`} />
            <span>{(activeTab === "groups" ? isSyncing : isSyncingFifa) ? "Syncing..." : "Sync Live Results"}</span>
          </button>

          <div className="bg-neutral-900/90 border border-green-500/10 px-3 py-2 rounded-xl text-center min-w-[100px]">
            <span className="text-[9px] text-slate-500 block uppercase tracking-widest font-bold">Total Nations</span>
            <span className="mono-font text-xs text-[#00FF66] font-bold">
              {activeTab === "groups" ? allTeams.length : fifaRankings.length} Teams
            </span>
          </div>
          <div className="bg-neutral-900/90 border border-green-500/10 px-3 py-2 rounded-xl text-center min-w-[100px]">
            <span className="text-[9px] text-slate-500 block uppercase tracking-widest font-bold">Sourced From</span>
            <span className="mono-font text-xs text-white font-bold">
              {activeTab === "groups" ? "WC Pools" : "Sofascore"}
            </span>
          </div>
        </div>
      </div>

      {/* Group Controls HUD console */}
      <section className="bg-neutral-950/65 border border-green-500/10 rounded-2xl p-5 mb-6 neon-border-glow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Tactical Group Badge Buttons or FIFA Info */}
          <div className="flex-1">
            {activeTab === "groups" ? (
              <>
                <span className="text-[10px] mono-font text-[#00FF66] uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FF66] animate-pulse"></span> Select Group
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {GROUPS.map((gObj) => {
                    const isSelected = activeGroup === gObj && !searchQuery.trim();
                    return (
                      <button
                        key={gObj}
                        onClick={() => {
                          setActiveGroup(gObj);
                          setSearchQuery(""); // Clear search to show specific group
                        }}
                        className={`h-8 w-11 flex items-center justify-center text-[11px] mono-font rounded-md border font-bold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#00FF66] border-[#00FF66] text-black shadow-md shadow-green-500/15"
                            : "text-slate-400 border-white/5 bg-black/40 hover:border-white/10 hover:text-white"
                        }`}
                      >
                        GP_{gObj}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-3 bg-black/40 border border-white/5 p-2 rounded-xl">
                  <div className="bg-[#00FF66]/10 p-1.5 rounded-lg">
                    <Trophy className="w-4 h-4 text-[#00FF66]" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-zinc-500 block font-mono">Leader</span>
                    <span className="text-xs font-bold text-zinc-100 flex items-center gap-1">
                      🇦🇷 Argentina <span className="text-[9px] text-zinc-500 font-mono">(#1)</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-black/40 border border-white/5 p-2 rounded-xl font-sans">
                  <div className="bg-[#00FF66]/10 p-1.5 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-[#00FF66]" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-zinc-500 block font-mono">Top Climber (+2)</span>
                    <span className="text-xs font-bold text-zinc-100">
                      🇨🇴 Colombia
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-400 py-1 max-w-sm hidden lg:block leading-relaxed">
                  The <span className="text-[#00FF66] font-bold">FIFA Men's World Ranking</span> is a ranking system for national teams. Rankings are calculated based on international match points earned.
                </div>
              </div>
            )}
          </div>

          {/* Standings Filter Search bar */}
          <div className="w-full md:w-80 shrink-0">
            <span className="text-[10px] mono-font text-slate-400 uppercase tracking-widest mb-2.5 block">
              Search Any Nation
            </span>
            <div className="relative">
              <input
                type="text"
                placeholder={activeTab === "groups" ? "Type team name (e.g. Brazil)..." : "Type country name..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black border border-green-500/20 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#00FF66] focus:border-[#00FF66]/60 transition-all font-medium"
              />
              <Search className="absolute left-3 top-2.5 text-green-500/40 w-4 h-4" />
            </div>
          </div>

        </div>
      </section>

      {/* Layout Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20 items-start">
        
        {/* Main Column (8 columns span) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-neutral-900/40 border border-green-500/10 rounded-2xl overflow-hidden shadow-2xl">
            
            {/* Table Header */}
            <div className="p-4 border-b border-white/5 bg-black/30 flex justify-between items-center flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#00FF66] animate-pulse" />
                <h3 className="heading-font text-sm font-bold uppercase tracking-wider text-white">
                  {activeTab === "groups" ? (
                    searchQuery.trim() ? "Search results from all pools" : `Tournament Group ${activeGroup}`
                  ) : (
                    searchQuery.trim() ? `Search rankings matching "${searchQuery}"` : "FIFA Men's World Rankings Feed"
                  )}
                </h3>
              </div>
              <span className="mono-font text-[10px] bg-green-500/10 text-[#00FF66] px-2 py-0.5 rounded border border-green-500/20">
                LIVE UPDATE
              </span>
            </div>

            {/* Table Rendering Conditionally */}
            {activeTab === "groups" ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-black/20 text-zinc-400 font-mono text-[10px] tracking-wider">
                      <th className="py-3 px-4 text-center w-12">#</th>
                      <th className="py-3 px-2">TEAM</th>
                      <th className="py-3 px-3 text-center">MP</th>
                      <th className="py-3 px-3 text-center">W</th>
                      <th className="py-3 px-3 text-center">D</th>
                      <th className="py-3 px-3 text-center">L</th>
                      <th className="py-3 px-3 text-center hidden sm:table-cell">GF</th>
                      <th className="py-3 px-3 text-center hidden sm:table-cell">GA</th>
                      <th className="py-3 px-3 text-center">GD</th>
                      <th className="py-3 px-3 text-center font-bold text-white">PTS</th>
                      <th className="py-3 px-4 text-center">FORM</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans font-medium">
                    {filteredTeams.map((t, idx) => {
                      const isGroupLeader = t.position === 1;
                      const isQualified = t.position <= 2;
                      const isThirdPlayoff = t.position === 3;
                      
                      return (
                        <tr 
                          key={`${t.team}-${idx}`} 
                          className="hover:bg-neutral-950/60 transition-colors group"
                        >
                          {/* Position Indicator */}
                          <td className="py-3.5 px-4 text-center">
                            <span className={`inline-flex items-center justify-center w-5.5 h-5.5 rounded-md text-[10px] font-bold ${
                              isGroupLeader 
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                                : isQualified 
                                ? "bg-green-500/10 text-[#00FF66] border border-green-500/20"
                                : isThirdPlayoff
                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                : "bg-zinc-800/20 text-zinc-500 border border-white/5"
                            }`}>
                              {t.position}
                            </span>
                          </td>

                          {/* Team with Flag */}
                          <td className="py-3.5 px-2 font-semibold text-zinc-100">
                            <div className="flex items-center gap-2.5">
                              <span className="text-lg leading-none" role="img" aria-label={t.team}>{t.flag}</span>
                              <span className="group-hover:text-[#00FF66] transition-colors">{t.team}</span>
                              {isGroupLeader && (
                                <Award className="w-3.5 h-3.5 text-amber-400 shrink-0 select-none animate-pulse" />
                              )}
                            </div>
                          </td>

                          {/* Played */}
                          <td className="py-3.5 px-3 text-center text-zinc-300 font-mono">{t.played}</td>

                          {/* Won */}
                          <td className="py-3.5 px-3 text-center text-zinc-300 font-mono">{t.won}</td>

                          {/* Drawn */}
                          <td className="py-3.5 px-3 text-center text-zinc-300 font-mono">{t.drawn}</td>

                          {/* Lost */}
                          <td className="py-3.5 px-3 text-center text-zinc-300 font-mono">{t.lost}</td>

                          {/* Goals For */}
                          <td className="py-3.5 px-3 text-center text-zinc-500 font-mono hidden sm:table-cell">{t.gf}</td>

                          {/* Goals Against */}
                          <td className="py-3.5 px-3 text-center text-zinc-500 font-mono hidden sm:table-cell">{t.ga}</td>

                          {/* Goal Diff */}
                          <td className={`py-3.5 px-3 text-center font-mono ${t.gd > 0 ? "text-green-400" : t.gd < 0 ? "text-rose-400" : "text-zinc-500"}`}>
                            {t.gd > 0 ? `+${t.gd}` : t.gd}
                          </td>

                          {/* Points */}
                          <td className="py-3.5 px-3 text-center font-bold text-white bg-white/2 max-w-[45px] font-mono">{t.pts}</td>

                          {/* Form Dots */}
                          <td className="py-3.5 px-4 font-sans">
                            <div className="flex items-center justify-center gap-1">
                              {t.form.map((f, fIdx) => (
                                <span 
                                  key={fIdx} 
                                  className={`w-2.5 h-2.5 rounded-full flex items-center justify-center text-[6px] font-bold text-black select-none ${
                                    f === "W" 
                                      ? "bg-[#00FF66] shadow-sm shadow-green-500/25" 
                                      : f === "D" 
                                      ? "bg-zinc-400" 
                                      : "bg-rose-500"
                                  }`}
                                  title={f === "W" ? "Won" : f === "D" ? "Drew" : "Lost"}
                                >
                                  {f}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredTeams.length === 0 && (
                      <tr>
                        <td colSpan={11} className="py-12 text-center text-zinc-500 font-sans">
                          <AlertCircle className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                          <h4 className="font-bold text-sm text-zinc-400">NO TEAMS MATCHING "{searchQuery}"</h4>
                          <p className="text-xs text-zinc-600 mt-1">Check keyword spelling or explore a different group tab.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              /* FIFA MEN'S WORLD RANKINGS TABLE */
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-black/20 text-zinc-400 font-mono text-[10px] tracking-wider">
                      <th className="py-3 px-4 text-center w-14">RANK</th>
                      <th className="py-3 px-2">COUNTRY</th>
                      <th className="py-3 px-3 text-center">POINTS</th>
                      <th className="py-3 px-3 text-center hidden md:table-cell">CONFEDERATION</th>
                      <th className="py-3 px-4 text-center hidden sm:table-cell">POSITION SHIFT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans font-medium">
                    {filteredFifaRankings.map((r, idx) => {
                      const isTop3 = r.rank <= 3;
                      return (
                        <tr 
                          key={`${r.team}-${idx}`}
                          className="hover:bg-neutral-950/60 transition-colors group"
                        >
                          {/* Rank */}
                          <td className="py-3.5 px-4 text-center">
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-[10px] font-bold ${
                              r.rank === 1 
                                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20" 
                                : r.rank === 2
                                ? "bg-slate-300 text-black font-semibold"
                                : r.rank === 3
                                ? "bg-amber-700/80 text-white"
                                : "bg-neutral-800/40 text-slate-400 border border-white/5"
                            }`}>
                              {r.rank}
                            </span>
                          </td>

                          {/* Country Name & Flag */}
                          <td className="py-3.5 px-2 font-semibold text-zinc-100">
                            <div className="flex items-center gap-2.5">
                              <span className="text-lg leading-none" role="img" aria-label={r.team}>{r.flag}</span>
                              <span className="group-hover:text-[#00FF66] transition-colors">{r.team}</span>
                              {r.rank === 1 && (
                                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold ml-1 font-mono tracking-wider">
                                  World #1
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Points */}
                          <td className="py-3.5 px-3 text-center text-zinc-200 font-mono font-bold">
                            {r.points}
                          </td>

                          {/* Confederation */}
                          <td className="py-3.5 px-3 text-center hidden md:table-cell">
                            <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-zinc-800/40 text-zinc-400 font-mono border border-white/5 uppercase">
                              {r.confederation}
                            </span>
                          </td>

                          {/* Shift Rate indicator */}
                          <td className="py-3.5 px-4 text-center hidden sm:table-cell">
                            <div className="flex items-center justify-center gap-1 min-h-[1.5rem]">
                              {r.change > 0 ? (
                                <span className="inline-flex items-center gap-0.5 text-xs text-emerald-400 font-bold font-mono">
                                  <ChevronUp className="w-3.5 h-3.5 stroke-[2.5]" />
                                  +{r.change}
                                </span>
                              ) : r.change < 0 ? (
                                <span className="inline-flex items-center gap-0.5 text-xs text-rose-500 font-bold font-mono">
                                  <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
                                  {r.change}
                                </span>
                              ) : (
                                <span className="text-zinc-500 font-bold font-mono text-[10px]">— No change</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredFifaRankings.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-zinc-500 font-sans">
                          <AlertCircle className="w-8 h-8 text-zinc-650 mx-auto mb-2" />
                          <h4 className="font-bold text-sm text-zinc-400">NO COUNTRIES MATCHING "{searchQuery}"</h4>
                          <p className="text-xs text-zinc-600 mt-1">Check keyword spelling or clear search input to view the leaderboard.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Table Footer bracket qualifiers details */}
            {activeTab === "groups" ? (
              <div className="p-4 border-t border-white/5 bg-black/40 text-[11px] text-zinc-405 grid grid-cols-1 md:grid-cols-2 gap-3 leading-relaxed">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded bg-green-500" />
                    <span className="text-zinc-300 font-semibold uppercase tracking-wider text-[9px] font-mono">Top 2 Nations (1st & 2nd Place)</span>
                  </div>
                  <p className="text-zinc-500 pl-4">
                    Advance directly to the 2026 World Cup Round of 32 knockout bracket.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded bg-blue-500" />
                    <span className="text-zinc-300 font-semibold uppercase tracking-wider text-[9px] font-mono">3rd Place Contenders</span>
                  </div>
                  <p className="text-zinc-500 pl-4">
                    The best 8 third-placement countries across all 12 groups will also advance to the Round of 32.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 border-t border-white/5 bg-black/40 text-[11px] text-zinc-405 leading-relaxed flex items-center gap-2.5 font-sans">
                <Info className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-zinc-500">
                  Ranking calculations match Sofascore Formulae. Positions are synced via full-text internet scrapers that pull the global standings.
                </span>
              </div>
            )}

          </div>
        </div>

        {/* Sidebar Highlight Widgets (4 columns span) */}
        <div className="lg:col-span-4 space-y-6">
          
          {activeTab === "groups" ? (
            <>
              {/* Top offensive attack leaders */}
              <div className="bg-neutral-900/40 border border-green-500/10 rounded-2xl p-4 shadow-xl">
                <h4 className="heading-font text-xs font-bold uppercase tracking-wider mb-3 text-white flex items-center gap-1.5">
                  <Target className="text-[#00FF66] w-4 h-4" />
                  Top Scoring Attack Pools
                </h4>
                <div className="space-y-2.5">
                  {bestAttack.map((t, idx) => (
                    <div 
                      key={`attack-${t.team}-${idx}`}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/5"
                    >
                      <div className="flex items-center gap-2 text-xs">
                        <span className="mono-font text-[10px] text-zinc-500 font-bold w-4">{idx + 1}.</span>
                        <span className="text-base">{t.flag}</span>
                        <span className="font-semibold text-zinc-200">{t.team}</span>
                      </div>
                      <span className="mono-font text-xs font-extrabold text-[#00FF66] bg-green-500/5 px-2 py-0.5 rounded border border-green-500/10">
                        {t.gf} Goals
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top defense leaders / Solid defense */}
              <div className="bg-neutral-900/40 border border-green-500/10 rounded-2xl p-4 shadow-xl">
                <h4 className="heading-font text-xs font-bold uppercase tracking-wider mb-3 text-white flex items-center gap-1.5">
                  <ShieldCheck className="text-amber-400 w-4 h-4 animate-pulse" />
                  Most Solid Defenses
                </h4>
                <div className="space-y-2.5">
                  {bestDefense.map((t, idx) => (
                    <div 
                      key={`defense-${t.team}-${idx}`}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/5"
                    >
                      <div className="flex items-center gap-2 text-xs">
                        <span className="mono-font text-[10px] text-zinc-500 font-bold w-4">{idx + 1}.</span>
                        <span className="text-base">{t.flag}</span>
                        <span className="font-semibold text-zinc-200">{t.team}</span>
                      </div>
                      <span className="mono-font text-xs font-extrabold text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10 text-amber-400">
                        {t.ga} Conceded
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* FIFA SIDEBAR: Confederation Kings */}
              <div className="bg-neutral-900/40 border border-green-500/10 rounded-2xl p-4 shadow-xl">
                <h4 className="heading-font text-xs font-bold uppercase tracking-wider mb-3 text-white flex items-center gap-1.5">
                  <Award className="text-amber-400 w-4 h-4" />
                  Confederation Kings
                </h4>
                <p className="text-[10px] text-zinc-500 mb-3 leading-relaxed">
                  The highest ranking nations representing each of the global confederations.
                </p>
                <div className="space-y-2.5">
                  {confederationLeaders.map((t, idx) => (
                    <div 
                      key={`conf-leader-${t.team}-${idx}`}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/5"
                    >
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-base">{t.flag}</span>
                        <div>
                          <span className="font-semibold text-zinc-200 block">{t.team}</span>
                          <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wide">
                            {t.confederation}
                          </span>
                        </div>
                      </div>
                      <span className="mono-font text-xs font-extrabold text-[#00FF66] bg-green-500/5 px-2 py-0.5 rounded border border-green-500/10">
                        Rank #{t.rank}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* FIFA SIDEBAR: Top Climbers */}
              <div className="bg-neutral-900/40 border border-green-500/10 rounded-2xl p-4 shadow-xl">
                <h4 className="heading-font text-xs font-bold uppercase tracking-wider mb-3 text-white flex items-center gap-1.5">
                  <TrendingUp className="text-[#00FF66] w-4 h-4 animate-bounce" />
                  Fastest Climbers
                </h4>
                <p className="text-[10px] text-zinc-500 mb-3 leading-relaxed">
                  Teams making the biggest positive rank shifts on Sofascore this window.
                </p>
                <div className="space-y-2.5">
                  {topClimbers.length > 0 ? (
                    topClimbers.map((t, idx) => (
                      <div 
                        key={`climber-${t.team}-${idx}`}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/5"
                      >
                        <div className="flex items-center gap-2 text-xs">
                          <span className="mono-font text-[10px] text-zinc-500 font-bold w-4">#{idx + 1}</span>
                          <span className="text-base">{t.flag}</span>
                          <div>
                            <span className="font-semibold text-zinc-200 block">{t.team}</span>
                            <span className="text-[9px] text-zinc-500 font-mono">
                              Global Rank #{t.rank}
                            </span>
                          </div>
                        </div>
                        <span className="mono-font text-xs font-extrabold text-emerald-400 bg-emerald-500/5 px-2.5 py-0.5 rounded border border-emerald-500/10 flex items-center gap-0.5">
                          <ChevronUp className="w-3 h-3 stroke-[2.5]" />
                          +{t.change}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-3 text-xs text-zinc-500">
                      No rank climbing changes recorded this window.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

        </div>

      </div>

    </div>
  );
};
