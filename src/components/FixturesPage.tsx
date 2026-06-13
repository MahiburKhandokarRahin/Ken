import React, { useState, useEffect } from "react";
import { 
  CalendarDays, 
  Search, 
  LayoutGrid, 
  Star, 
  ShieldAlert, 
  MapPin 
} from "lucide-react";

interface FixtureMatch {
  date: string;
  day: string;
  timeBDT: string;
  group: string;
  team1: string;
  team2: string;
  venue: string;
}

const FIXTURES_DATA: FixtureMatch[] = [
  // JUN 12
  { date: "JUN 12", day: "SAT", timeBDT: "01:00 AM", group: "A", team1: "🇲🇽 Mexico", team2: "🇿🇦 South Africa", venue: "Mexico City" },
  { date: "JUN 12", day: "SAT", timeBDT: "08:00 AM", group: "A", team1: "🇰🇷 South Korea", team2: "🇨🇿 Czechia", venue: "Guadalajara" },
  // JUN 13
  { date: "JUN 13", day: "SAT", timeBDT: "01:00 AM", group: "B", team1: "🇨🇦 Canada", team2: "🇧🇦 Bosnia & Herz.", venue: "Toronto" },
  { date: "JUN 13", day: "SAT", timeBDT: "07:00 AM", group: "D", team1: "🇺🇸 USA", team2: "🇵🇾 Paraguay", venue: "Los Angeles" },
  // JUN 14
  { date: "JUN 14", day: "SUN", timeBDT: "01:00 AM", group: "B", team1: "🇶🇦 Qatar", team2: "🇨🇭 Switzerland", venue: "San Francisco" },
  { date: "JUN 14", day: "SUN", timeBDT: "04:00 AM", group: "C", team1: "🇧🇷 Brazil", team2: "🇲🇦 Morocco", venue: "New York NJ" },
  { date: "JUN 14", day: "SUN", timeBDT: "07:00 AM", group: "C", team1: "🇭🇹 Haiti", team2: "🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scotland", venue: "Boston" },
  { date: "JUN 14", day: "SUN", timeBDT: "10:00 AM", group: "D", team1: "🇦🇺 Australia", team2: "🇹🇷 Turkey", venue: "Vancouver" },
  { date: "JUN 14", day: "SUN", timeBDT: "11:00 PM", group: "E", team1: "🇩🇪 Germany", team2: "🇨🇼 Curacao", venue: "Houston" },
  // JUN 16 MON
  { date: "JUN 16", day: "MON", timeBDT: "02:00 AM", group: "F", team1: "🇳🇱 Netherlands", team2: "🇯🇵 Japan", venue: "Dallas" },
  { date: "JUN 16", day: "MON", timeBDT: "05:00 AM", group: "E", team1: "🇨🇮 Ivory Coast", team2: "🇪🇨 Ecuador", venue: "Philadelphia" },
  { date: "JUN 16", day: "MON", timeBDT: "08:00 AM", group: "F", team1: "🇸🇪 Sweden", team2: "🇹🇳 Tunisia", venue: "Monterrey" },
  { date: "JUN 16", day: "MON", timeBDT: "10:00 PM", group: "H", team1: "🇪🇸 Spain", team2: "🇨🇻 Cape Verde", venue: "Atlanta" },
  // JUN 16 TUE
  { date: "JUN 16", day: "TUE", timeBDT: "01:00 AM", group: "G", team1: "🇧🇪 Belgium", team2: "🇪🇬 Egypt", venue: "Seattle" },
  { date: "JUN 16", day: "TUE", timeBDT: "04:00 AM", group: "H", team1: "🇸🇦 Saudi Arabia", team2: "🇺🇾 Uruguay", venue: "Miami" },
  { date: "JUN 16", day: "TUE", timeBDT: "07:00 AM", group: "A", team1: "🇮🇷 Iran", team2: "🇳🇿 New Zealand", venue: "Los Angeles" },
  // JUN 17
  { date: "JUN 17", day: "WED", timeBDT: "01:00 AM", group: "I", team1: "🇫🇷 France", team2: "🇸🇳 Senegal", venue: "New York NJ" },
  { date: "JUN 17", day: "WED", timeBDT: "04:00 AM", group: "I", team1: "🇮🇶 Iraq", team2: "🇳🇴 Norway", venue: "Boston" },
  { date: "JUN 17", day: "WED", timeBDT: "07:00 AM", group: "J", team1: "🇦🇷 Argentina", team2: "🇩🇿 Algeria", venue: "Kansas City" },
  { date: "JUN 17", day: "WED", timeBDT: "10:00 AM", group: "J", team1: "🇦🇹 Austria", team2: "🇯🇴 Jordan", venue: "San Francisco" },
  { date: "JUN 17", day: "WED", timeBDT: "11:00 PM", group: "K", team1: "🇵🇹 Portugal", team2: "🇨🇩 DR Congo", venue: "Houston" },
  // JUN 18
  { date: "JUN 18", day: "THU", timeBDT: "02:00 AM", group: "L", team1: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 England", team2: "🇭🇷 Croatia", venue: "Dallas" },
  { date: "JUN 18", day: "THU", timeBDT: "08:00 AM", group: "E", team1: "🇬🇭 Ghana", team2: "🇵🇦 Panama", venue: "Toronto" },
  { date: "JUN 18", day: "THU", timeBDT: "08:00 AM", group: "K", team1: "🇺🇿 Uzbekistan", team2: "🇨🇴 Colombia", venue: "Mexico City" },
  { date: "JUN 18", day: "THU", timeBDT: "10:00 PM", group: "A", team1: "🇨🇿 Czechia", team2: "🇿🇦 South Africa", venue: "Atlanta" },
  // JUN 19
  { date: "JUN 19", day: "FRI", timeBDT: "01:00 AM", group: "B", team1: "🇨🇭 Switzerland", team2: "🇧🇦 Bosnia & Herz.", venue: "Los Angeles" },
  { date: "JUN 19", day: "FRI", timeBDT: "04:00 AM", group: "B", team1: "🇨🇦 Canada", team2: "🇶🇦 Qatar", venue: "Vancouver" },
  { date: "JUN 19", day: "FRI", timeBDT: "07:00 AM", group: "A", team1: "🇲🇽 Mexico", team2: "🇰🇷 South Korea", venue: "Guadalajara" },
  // JUN 20
  { date: "JUN 20", day: "SAT", timeBDT: "01:00 AM", group: "B", team1: "🇺🇸 USA", team2: "🇦🇺 Australia", venue: "Seattle" },
  { date: "JUN 20", day: "SAT", timeBDT: "04:00 AM", group: "C", team1: "🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scotland", team2: "🇲🇦 Morocco", venue: "Boston" },
  { date: "JUN 20", day: "SAT", timeBDT: "07:00 AM", group: "C", team1: "🇧🇷 Brazil", team2: "🇭🇹 Haiti", venue: "Philadelphia" },
  { date: "JUN 20", day: "SAT", timeBDT: "10:00 AM", group: "D", team1: "🇹🇷 Turkey", team2: "🇵🇾 Paraguay", venue: "San Francisco" },
  { date: "JUN 20", day: "SAT", timeBDT: "11:00 PM", group: "F", team1: "🇳🇱 Netherlands", team2: "🇸🇪 Sweden", venue: "Houston" },
  // JUN 21
  { date: "JUN 21", day: "SUN", timeBDT: "02:00 AM", group: "E", team1: "🇩🇪 Germany", team2: "🇨🇮 Ivory Coast", venue: "Toronto" },
  { date: "JUN 21", day: "SUN", timeBDT: "06:00 AM", group: "E", team1: "🇪🇨 Ecuador", team2: "🇨🇼 Curacao", venue: "Kansas City" },
  { date: "JUN 21", day: "SUN", timeBDT: "10:00 AM", group: "F", team1: "🇹🇳 Tunisia", team2: "🇯🇵 Japan", venue: "Monterrey" },
  { date: "JUN 21", day: "SUN", timeBDT: "10:00 PM", group: "H", team1: "🇪🇸 Spain", team2: "🇸🇦 Saudi Arabia", venue: "Atlanta" },
  
  // COLUMN 2 START (JUN 22)
  { date: "JUN 22", day: "MON", timeBDT: "01:00 AM", group: "G", team1: "🇧🇪 Belgium", team2: "🇮🇷 Iran", venue: "Los Angeles" },
  { date: "JUN 22", day: "MON", timeBDT: "06:00 AM", group: "H", team1: "🇺🇾 Uruguay", team2: "🇨🇻 Cape Verde", venue: "Miami" },
  { date: "JUN 22", day: "MON", timeBDT: "07:00 AM", group: "G", team1: "🇳🇿 New Zealand", team2: "🇪🇬 Egypt", venue: "Vancouver" },
  { date: "JUN 22", day: "MON", timeBDT: "11:00 PM", group: "J", team1: "🇦🇷 Argentina", team2: "🇦🇹 Austria", venue: "Dallas" },
  // JUN 23
  { date: "JUN 23", day: "TUE", timeBDT: "03:00 AM", group: "I", team1: "🇫🇷 France", team2: "🇮🇷 Iran", venue: "Philadelphia" },
  { date: "JUN 23", day: "TUE", timeBDT: "06:00 AM", group: "I", team1: "🇳🇴 Norway", team2: "🇸🇳 Senegal", venue: "New York NJ" },
  { date: "JUN 23", day: "TUE", timeBDT: "08:00 AM", group: "J", team1: "🇯🇴 Jordan", team2: "🇩🇿 Algeria", venue: "San Francisco" },
  { date: "JUN 23", day: "TUE", timeBDT: "11:00 PM", group: "K", team1: "🇵🇹 Portugal", team2: "🇺🇿 Uzbekistan", venue: "Houston" },
  // JUN 24
  { date: "JUN 24", day: "WED", timeBDT: "02:00 AM", group: "L", team1: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 England", team2: "🇭🇷 Croatia", venue: "Boston" },
  { date: "JUN 24", day: "WED", timeBDT: "05:00 AM", group: "L", team1: "🇵🇦 Panama", team2: "🇭🇷 Croatia", venue: "Toronto" },
  { date: "JUN 24", day: "WED", timeBDT: "08:00 AM", group: "A", team1: "🇨🇴 Colombia", team2: "🇨🇩 DR Congo", venue: "Guadalajara" },
  // JUN 25
  { date: "JUN 25", day: "THU", timeBDT: "01:00 AM", group: "B", team1: "🇨🇭 Switzerland", team2: "🇨🇦 Canada", venue: "Vancouver" },
  { date: "JUN 25", day: "THU", timeBDT: "01:00 AM", group: "B", team1: "🇧🇦 Bosnia & Herz.", team2: "🇶🇦 Qatar", venue: "Seattle" },
  { date: "JUN 25", day: "THU", timeBDT: "04:00 AM", group: "C", team1: "🇲🇦 Morocco", team2: "🇭🇹 Haiti", venue: "Atlanta" },
  { date: "JUN 25", day: "THU", timeBDT: "06:00 AM", group: "C", team1: "🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scotland", team2: "🇧🇷 Brazil", venue: "Miami" },
  { date: "JUN 25", day: "THU", timeBDT: "07:00 AM", group: "A", team1: "🇿🇦 South Africa", team2: "🇰🇷 South Korea", venue: "Monterrey" },
  { date: "JUN 25", day: "THU", timeBDT: "07:00 AM", group: "A", team1: "🇨🇿 Czechia", team2: "🇲🇽 Mexico", venue: "Mexico City" },
  // JUN 26
  { date: "JUN 26", day: "FRI", timeBDT: "02:00 AM", group: "E", team1: "🇨🇼 Curacao", team2: "🇨🇮 Ivory Coast", venue: "Philadelphia" },
  { date: "JUN 26", day: "FRI", timeBDT: "02:00 AM", group: "F", team1: "🇪🇨 Ecuador", team2: "🇩🇪 Germany", venue: "New York NJ" },
  { date: "JUN 26", day: "FRI", timeBDT: "06:00 AM", group: "F", team1: "🇹🇳 Tunisia", team2: "🇳🇱 Netherlands", venue: "Kansas City" },
  { date: "JUN 26", day: "FRI", timeBDT: "06:00 AM", group: "F", team1: "🇯🇵 Japan", team2: "🇸🇪 Sweden", venue: "Dallas" },
  { date: "JUN 26", day: "FRI", timeBDT: "06:00 AM", group: "D", team1: "🇹🇷 Turkey", team2: "🇺🇸 USA", venue: "Los Angeles" },
  { date: "JUN 26", day: "FRI", timeBDT: "08:00 AM", group: "D", team1: "🇵🇾 Paraguay", team2: "🇦🇺 Australia", venue: "San Francisco" },
  // JUN 27
  { date: "JUN 27", day: "SAT", timeBDT: "01:00 AM", group: "I", team1: "🇳🇴 Norway", team2: "🇫🇷 France", venue: "Boston" },
  { date: "JUN 27", day: "SAT", timeBDT: "01:00 AM", group: "I", team1: "🇸🇳 Senegal", team2: "🇮🇶 Iraq", venue: "Toronto" },
  { date: "JUN 27", day: "SAT", timeBDT: "06:00 AM", group: "H", team1: "🇨🇻 Cape Verde", team2: "🇸🇦 Saudi Arabia", venue: "Houston" },
  { date: "JUN 27", day: "SAT", timeBDT: "06:00 AM", group: "H", team1: "🇺🇾 Uruguay", team2: "🇪🇸 Spain", venue: "Guadalajara" },
  { date: "JUN 27", day: "SAT", timeBDT: "09:00 AM", group: "G", team1: "🇳🇿 New Zealand", team2: "🇧🇪 Belgium", venue: "Vancouver" },
  { date: "JUN 27", day: "SAT", timeBDT: "08:00 AM", group: "G", team1: "🇪🇬 Egypt", team2: "🇮🇷 Iran", venue: "Seattle" },
  // JUN 28
  { date: "JUN 28", day: "SUN", timeBDT: "03:00 AM", group: "L", team1: "🇵🇦 Panama", team2: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 England", venue: "New York NJ" },
  { date: "JUN 28", day: "SUN", timeBDT: "02:00 AM", group: "L", team1: "🇭🇷 Croatia", team2: "🇬🇭 Ghana", venue: "Philadelphia" },
  { date: "JUN 28", day: "SUN", timeBDT: "08:30 AM", group: "K", team1: "🇨🇴 Colombia", team2: "🇵🇹 Portugal", venue: "Miami" },
  { date: "JUN 28", day: "SUN", timeBDT: "05:30 AM", group: "K", team1: "🇨🇩 DR Congo", team2: "🇺🇿 Uzbekistan", venue: "Atlanta" },
  { date: "JUN 28", day: "SUN", timeBDT: "06:30 AM", group: "J", team1: "🇩🇿 Algeria", team2: "🇦🇹 Austria", venue: "Kansas City" },
  { date: "JUN 28", day: "SUN", timeBDT: "08:00 AM", group: "J", team1: "🇯🇴 Jordan", team2: "🇦🇷 Argentina", venue: "Dallas" }
];

const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

const groupColors: Record<string, { text: string; border: string; circle: string }> = {
  A: { text: "text-pink-400", border: "border-pink-500/20", circle: "bg-pink-500" },
  B: { text: "text-purple-400", border: "border-purple-500/20", circle: "bg-purple-500" },
  C: { text: "text-lime-400", border: "border-lime-500/20", circle: "bg-lime-500" },
  D: { text: "text-teal-400", border: "border-teal-500/20", circle: "bg-teal-500" },
  E: { text: "text-blue-400", border: "border-blue-500/20", circle: "bg-blue-500" },
  F: { text: "text-green-400", border: "border-green-500/20", circle: "bg-green-500" },
  G: { text: "text-indigo-400", border: "border-indigo-500/20", circle: "bg-indigo-500" },
  H: { text: "text-rose-400", border: "border-rose-500/20", circle: "bg-rose-500" },
  I: { text: "text-cyan-400", border: "border-cyan-500/20", circle: "bg-cyan-500" },
  J: { text: "text-violet-400", border: "border-violet-500/20", circle: "bg-violet-500" },
  K: { text: "text-fuchsia-400", border: "border-fuchsia-500/20", circle: "bg-fuchsia-500" },
  L: { text: "text-orange-400", border: "border-orange-500/20", circle: "bg-orange-500" }
};

export const FixturesPage: React.FC = () => {
  const [currentTimezone, setCurrentTimezone] = useState<"BDT" | "LOCAL">("BDT");
  const [currentGroupFilter, setCurrentGroupFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem("fowc2026_favs");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [countdownText, setCountdownText] = useState<string>("Loading...");

  // BDT (UTC+6) conversion to browser local timezone
  const convertBDTToLocal = (dateStr: string, timeStr: string) => {
    try {
      const monthMap: Record<string, number> = { "JUN": 5 };
      const parts = dateStr.split(" ");
      const day = parseInt(parts[1] || "12");
      const monthStr = parts[0] || "JUN";
      const month = monthMap[monthStr] !== undefined ? monthMap[monthStr] : 5;
      
      const timeParts = timeStr.split(" ");
      const timeClock = timeParts[0] || "01:00";
      const modifier = timeParts[1] || "AM";
      
      const clockParts = timeClock.split(":");
      let hours = parseInt(clockParts[0] || "0");
      const minutes = parseInt(clockParts[1] || "0");
      
      if (hours === 12) hours = 0;
      if (modifier === "PM") hours += 12;

      // BDT has +6 hours offset. So to get UTC we subtract 6 hours.
      const bdtDate = new Date(Date.UTC(2026, month, day, hours - 6, minutes));
      
      const options: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit", hour12: true };
      const localTimeStr = bdtDate.toLocaleTimeString([], options);
      const localDateStr = bdtDate.toLocaleDateString([], { month: "short", day: "2-digit", weekday: "short" }).toUpperCase();
      
      return { date: localDateStr, time: localTimeStr };
    } catch (e) {
      return { date: dateStr, time: timeStr };
    }
  };

  // Countdown timer to tournament kickoff (UTC: June 11, 2026 at 19:00:00)
  useEffect(() => {
    const targetDate = new Date(Date.UTC(2026, 5, 11, 19, 0, 0)).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference < 0) {
        setCountdownText("TOURNAMENT ALIVE");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setCountdownText(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(interval);
  }, []);

  // Update localStorage when favorites list changes
  useEffect(() => {
    localStorage.setItem("fowc2026_favs", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (matchIndex: number) => {
    setFavorites(prev => {
      if (prev.includes(matchIndex)) {
        return prev.filter(idx => idx !== matchIndex);
      } else {
        return [...prev, matchIndex];
      }
    });
  };

  // Filter the fixture list
  const filteredFixtures = FIXTURES_DATA.map((m, idx) => ({ ...m, originalIndex: idx })).filter(m => {
    // Group filter choice
    if (currentGroupFilter !== "ALL" && m.group !== currentGroupFilter) {
      return false;
    }

    // Search query logic
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = `${m.team1} ${m.team2} ${m.venue} ${m.group}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }

    // Starred filter logic
    if (showFavoritesOnly && !favorites.includes(m.originalIndex)) {
      return false;
    }

    return true;
  });

  // Group filtered results into temporary date keys
  const dateGroups: Record<string, Array<FixtureMatch & { originalIndex: number; parsedTime: string }>> = {};

  filteredFixtures.forEach(m => {
    let displayDate = m.date;
    let displayDay = m.day;
    let parsedTime = m.timeBDT;

    if (currentTimezone === "LOCAL") {
      const converted = convertBDTToLocal(m.date, m.timeBDT);
      displayDate = converted.date;
      parsedTime = converted.time;
      displayDay = "";
    }

    const key = displayDate + (displayDay ? ` ${displayDay}` : "");
    if (!dateGroups[key]) {
      dateGroups[key] = [];
    }
    dateGroups[key].push({ ...m, parsedTime });
  });

  const dateKeys = Object.keys(dateGroups);

  // Divide keys alternatively between two columns to support the grid column look!
  const leftColumnKeys = dateKeys.filter((_, idx) => idx % 2 === 0);
  const rightColumnKeys = dateKeys.filter((_, idx) => idx % 2 !== 0);

  return (
    <div className="text-slate-200 selection:bg-green-500/30 selection:text-green-200">
      
      {/* Subheader Dashboard Details */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/40 border border-green-500/10 p-4 rounded-2xl mb-6">
        <div>
          <h2 className="heading-font text-base font-bold text-white flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-[#00FF66]" />
            Tournament Schedule Center
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access the full 64 group stage matches across Canada, Mexico, & USA.
          </p>
        </div>
        
        {/* Right Time zone widgets matched with BDT (Bangladesh Time) vs Countdown */}
        <div className="flex flex-wrap items-center gap-3 justify-end w-full sm:w-auto">
          <div className="bg-neutral-900/90 border border-green-500/10 px-3 py-1.5 rounded-lg text-center min-w-[130px]">
            <span className="text-[9px] text-slate-500 block uppercase tracking-widest font-bold">Bangladesh Time</span>
            <span className="mono-font text-xs text-[#00FF66] font-bold">BDT (UTC +6)</span>
          </div>
          <div className="bg-neutral-900/90 border border-green-500/20 px-3 py-1.5 rounded-lg text-center min-w-[130px]">
            <span className="text-[9px] text-[#00FF66] block uppercase tracking-widest font-bold">Countdown to Kickoff</span>
            <span className="mono-font text-xs text-white font-bold">{countdownText}</span>
          </div>
        </div>
      </div>

      {/* Controls, Search & Filter Terminal background matches the HTML look */}
      <section className="bg-neutral-950/60 border border-green-500/10 rounded-2xl p-5 backdrop-blur-md neon-border-glow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          
          {/* Search Box with HUD look */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search by team, group, or city..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black border border-green-500/20 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#00FF66] focus:border-[#00FF66]/60 transition-all font-medium"
            />
            <Search className="absolute left-3 top-2.5 text-green-500/40 w-4 h-4" />
          </div>
          
          {/* High-quality Selection Zone Format selectors */}
          <div className="flex items-center justify-between md:justify-end gap-2.5">
            <span className="text-[9px] mono-font text-slate-400 uppercase tracking-widest">Select Zone Format:</span>
            <div className="bg-black/80 border border-green-500/15 p-1 rounded-lg flex gap-1">
              <button 
                onClick={() => setCurrentTimezone("BDT")} 
                className={`px-3 py-1.5 text-[10px] mono-font font-bold rounded transition-all cursor-pointer ${
                  currentTimezone === "BDT" 
                    ? "bg-[#00FF66] text-black shadow-md shadow-green-500/15" 
                    : "text-slate-400 hover:text-slate-100"
                }`}
              >
                BDT (+6)
              </button>
              <button 
                onClick={() => setCurrentTimezone("LOCAL")} 
                className={`px-3 py-1.5 text-[10px] mono-font font-bold rounded transition-all cursor-pointer ${
                  currentTimezone === "LOCAL" 
                    ? "bg-[#00FF66] text-black shadow-md shadow-green-500/15" 
                    : "text-slate-400 hover:text-slate-100"
                }`}
              >
                LOCAL TIME
              </button>
            </div>
          </div>
        </div>

        {/* Tactical Group Badges Filter */}
        <div className="mt-5 border-t border-green-500/10 pt-4">
          <div className="text-[10px] mono-font text-[#00FF66] uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Filter by Tournament Group
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button 
              onClick={() => setCurrentGroupFilter("ALL")} 
              className={`px-2.5 py-1 text-[11px] mono-font rounded-md border transition-all cursor-pointer ${
                currentGroupFilter === "ALL"
                  ? "bg-[#00FF66] border-[#00FF66] text-black font-semibold"
                  : "text-slate-400 border-green-500/10 bg-black/40 hover:text-white"
              }`}
            >
              ALL_GROUPS
            </button>
            {GROUPS.map(g => {
              const colorConfig = groupColors[g] || { circle: "bg-green-500" };
              const isSelected = currentGroupFilter === g;
              return (
                <button
                  key={g}
                  onClick={() => setCurrentGroupFilter(g)}
                  className={`px-2.5 py-1 text-[11px] mono-font rounded-md border transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? "bg-[#00FF66] border-[#00FF66] text-black font-semibold"
                      : "text-slate-400 border-green-500/10 bg-black/40 hover:text-white"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${colorConfig.circle}`}></span> GROUP_{g}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Match List Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="heading-font text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wide">
          <LayoutGrid className="text-[#00FF66] w-4 h-4" />
          <span>Fixture Database Matrix</span>
          <span className="text-[10px] mono-font bg-green-500/10 border border-green-500/30 text-[#00FF66] px-2 py-0.5 rounded-md">
            {filteredFixtures.length} MATCHES LOADED
          </span>
        </h2>

        {/* Filter Starred Button */}
        <button 
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)} 
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
            showFavoritesOnly 
              ? "border-[#00FF66]/50 bg-green-500/10 text-green-300 shadow-lg shadow-green-500/5"
              : "border-green-500/20 bg-black/40 hover:bg-neutral-900 text-[#00FF66]"
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${showFavoritesOnly ? "fill-[#00FF66] text-[#00FF66]" : "text-[#00FF66]"}`} />
          <span className="mono-font text-[10px]">STARRED ONLY ({favorites.length})</span>
        </button>
      </div>

      {/* Empty State */}
      {filteredFixtures.length === 0 && (
        <div className="text-center py-12 bg-neutral-950/40 border border-dashed border-green-500/20 rounded-2xl">
          <ShieldAlert className="w-10 h-10 text-green-500/40 mx-auto mb-3 animate-bounce" />
          <h3 className="heading-font text-sm font-bold text-slate-300 uppercase">NO ALIGNED CHANNELS</h3>
          <p className="text-xs text-slate-500 mt-1">Refine your active group filters or matching search parameter query.</p>
        </div>
      )}

      {/* Two-Column Balanced Layout of Fixtures */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
        
        {/* Left Side Column of Fixtures */}
        <div className="space-y-4">
          {leftColumnKeys.map((dateKey) => {
            const matchesInside = dateGroups[dateKey] || [];
            return (
              <div 
                key={dateKey} 
                className="bg-neutral-900/40 border border-green-500/10 rounded-2xl p-4 space-y-3 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-green-500/20"
              >
                <div className="flex items-center justify-between border-b border-green-500/5 pb-2">
                  <span className="mono-font text-xs font-bold text-[#00FF66] tracking-widest">{dateKey}</span>
                  <span className="text-[9px] text-slate-500 mono-font">{matchesInside.length} MATCHES</span>
                </div>
                
                <div className="space-y-2.5">
                  {matchesInside.map((m) => {
                    const isFav = favorites.includes(m.originalIndex);
                    const colorStyle = groupColors[m.group] || { text: "text-green-400", bg: "bg-green-500" };
                    return (
                      <div 
                        key={m.originalIndex}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-black/40 border border-green-500/5 hover:border-green-500/30 hover:bg-neutral-950/85 transition-all group"
                      >
                        {/* Group and match timing */}
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <span 
                            className={`text-[9px] font-extrabold px-2 py-0.5 rounded bg-black border border-green-500/20 ${colorStyle.text}`}
                            title={`Group ${m.group}`}
                          >
                            GRP_{m.group}
                          </span>
                          <span className="mono-font text-xs font-semibold text-green-300">
                            {m.parsedTime}
                          </span>
                        </div>

                        {/* Central Match Flags Coupling */}
                        <div className="flex-1 grid grid-cols-[1fr_auto_1fr] items-center gap-2.5 text-xs font-semibold w-full sm:w-auto text-center font-sans">
                          <div className="text-right truncate text-slate-100" title={m.team1}>
                            {m.team1}
                          </div>
                          <span className="text-[10px] mono-font text-[#00FF66]/80 px-1 bg-neutral-950 border border-green-500/10 rounded">VS</span>
                          <div className="text-left truncate text-slate-100" title={m.team2}>
                            {m.team2}
                          </div>
                        </div>

                        {/* Venue location & Star trigger */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t sm:border-t-0 border-green-500/5 pt-2 sm:pt-0 shrink-0">
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-sans">
                            <MapPin className="w-3.5 h-3.5 text-green-500/50" />
                            <span className="truncate max-w-[110px]" title={m.venue}>{m.venue}</span>
                          </div>
                          
                          <button 
                            onClick={() => toggleFavorite(m.originalIndex)} 
                            className="p-1 rounded hover:bg-neutral-950 transition-all text-slate-600 hover:text-green-400 cursor-pointer"
                          >
                            <Star className={`w-3.5 h-3.5 ${isFav ? "fill-[#00FF66] text-[#00FF66]" : "text-slate-650"}`} />
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side Column of Fixtures */}
        <div className="space-y-4">
          {rightColumnKeys.map((dateKey) => {
            const matchesInside = dateGroups[dateKey] || [];
            return (
              <div 
                key={dateKey} 
                className="bg-neutral-900/40 border border-green-500/10 rounded-2xl p-4 space-y-3 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-green-500/20"
              >
                <div className="flex items-center justify-between border-b border-green-500/5 pb-2">
                  <span className="mono-font text-xs font-bold text-[#00FF66] tracking-widest">{dateKey}</span>
                  <span className="text-[9px] text-slate-500 mono-font">{matchesInside.length} MATCHES</span>
                </div>
                
                <div className="space-y-2.5">
                  {matchesInside.map((m) => {
                    const isFav = favorites.includes(m.originalIndex);
                    const colorStyle = groupColors[m.group] || { text: "text-green-400", bg: "bg-green-500" };
                    return (
                      <div 
                        key={m.originalIndex}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-black/40 border border-green-500/5 hover:border-green-500/30 hover:bg-neutral-950/85 transition-all group"
                      >
                        {/* Group and match timing */}
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <span 
                            className={`text-[9px] font-extrabold px-2 py-0.5 rounded bg-black border border-green-500/20 ${colorStyle.text}`}
                            title={`Group ${m.group}`}
                          >
                            GRP_{m.group}
                          </span>
                          <span className="mono-font text-xs font-semibold text-green-300">
                            {m.parsedTime}
                          </span>
                        </div>

                        {/* Central Match Flags Coupling */}
                        <div className="flex-1 grid grid-cols-[1fr_auto_1fr] items-center gap-2.5 text-xs font-semibold w-full sm:w-auto text-center font-sans">
                          <div className="text-right truncate text-slate-100" title={m.team1}>
                            {m.team1}
                          </div>
                          <span className="text-[10px] mono-font text-[#00FF66]/80 px-1 bg-neutral-950 border border-green-500/10 rounded">VS</span>
                          <div className="text-left truncate text-slate-100" title={m.team2}>
                            {m.team2}
                          </div>
                        </div>

                        {/* Venue location & Star trigger */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t sm:border-t-0 border-green-500/5 pt-2 sm:pt-0 shrink-0">
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-sans">
                            <MapPin className="w-3.5 h-3.5 text-green-500/50" />
                            <span className="truncate max-w-[110px]" title={m.venue}>{m.venue}</span>
                          </div>
                          
                          <button 
                            onClick={() => toggleFavorite(m.originalIndex)} 
                            className="p-1 rounded hover:bg-neutral-950 transition-all text-slate-600 hover:text-green-400 cursor-pointer"
                          >
                            <Star className={`w-3.5 h-3.5 ${isFav ? "fill-[#00FF66] text-[#00FF66]" : "text-slate-650"}`} />
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
