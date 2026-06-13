export interface StreamChannel {
  id: string;
  name: string;
  url: string;
  description: string;
  latency: number; // in ms
  bitrate: string;
  isHttps: boolean;
  category: "Main Broadcaster" | "Server Alternates" | "Alternative Feeds";
}

export interface MatchStats {
  possession: [number, number]; // [home, away]
  shotsOnTarget: [number, number];
  shotsOffTarget: [number, number];
  fouls: [number, number];
  corners: [number, number];
  yellowCards: [number, number];
}

export interface WorldCupMatch {
  id: string;
  homeTeam: string;
  homeCode: string; // e.g., BRA
  homeFlag: string; // Emoji
  awayTeam: string;
  awayCode: string; // e.g., FRA
  awayFlag: string; // Emoji
  homeScore: number;
  awayScore: number;
  status: "LIVE" | "UPCOMING" | "FINISHED";
  time: string; // e.g., "74'" or "Tomorrow 18:00"
  group: string; // Group A, Quarter-Final
  stadium: string;
  stats?: MatchStats;
}

export interface ChatMessage {
  id: string;
  username: string;
  text: string;
  time: string;
  avatarColor: string;
  isModerator?: boolean;
  isSystem?: boolean;
}
