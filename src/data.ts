import { StreamChannel, WorldCupMatch, ChatMessage } from "./types";

export const CHANNELS: StreamChannel[] = [
  {
    id: "caze-tv-br",
    name: "Cazé TV BR (Main Stream HD)",
    url: "https://dfr80qz435crc.cloudfront.net/MNOP/Amagi/Caze/Caze_TV_BR/1080p-vtt/index.m3u8",
    description: "Cloudfront high-speed CDN streaming Cazé TV Brazil World Cup Coverage.",
    latency: 28,
    bitrate: "1080p @ 60fps",
    isHttps: true,
    category: "Main Broadcaster"
  },
  {
    id: "nyaler-23",
    name: "Server 2 (High Quality Feed)",
    url: "https://1nyaler.streamhostingcdn.top/stream/23/index.m3u8",
    description: "Alternative High Bandwidth server. Fast loading CDN mirror.",
    latency: 42,
    bitrate: "1080p",
    isHttps: true,
    category: "Server Alternates"
  },
  {
    id: "nyaler-32",
    name: "Server 3 (Alternate Stream)",
    url: "https://1nyaler.streamhostingcdn.top/stream/32/index.m3u8",
    description: "Backup stream server for high-load match peaks.",
    latency: 55,
    bitrate: "720p",
    isHttps: true,
    category: "Server Alternates"
  },
  {
    id: "ptv-sports",
    name: "PTV Sports World Cup Live",
    url: "https://tvsen5.aynaott.com/PtvSports/index.m3u8",
    description: "Live broadcasting feed directly from PTV Sports server.",
    latency: 89,
    bitrate: "1080p @ 30fps",
    isHttps: true,
    category: "Alternative Feeds"
  },
  {
    id: "mono-stream-http",
    name: "Server 1 (Mono Audio Feed)",
    url: "http://103.59.176.72:8083/live1/tracks-v1a1/mono.m3u8?token=123",
    description: "Direct IP HLS streaming server.",
    latency: 120,
    bitrate: "720p",
    isHttps: false,
    category: "Alternative Feeds"
  },
  {
    id: "raw-ts-feed",
    name: "Direct TV MPEG-TS Feed",
    url: "http://rgkkw.live/live/1Aoen7elp5/IgMJ60tmAa/130714.ts",
    description: "Direct TS packet stream link. Loaded as continuous transport stream.",
    latency: 180,
    bitrate: "Raw TS Stream",
    isHttps: false,
    category: "Alternative Feeds"
  }
];

export const WORLD_CUP_MATCHES: WorldCupMatch[] = [
  {
    id: "match-1",
    homeTeam: "Brazil",
    homeCode: "BRA",
    homeFlag: "🇧🇷",
    awayTeam: "France",
    awayCode: "FRA",
    awayFlag: "🇫🇷",
    homeScore: 2,
    awayScore: 1,
    status: "LIVE",
    time: "74'",
    group: "Quarter-Final",
    stadium: "Lusail Iconic Stadium, Qatar",
    stats: {
      possession: [54, 46],
      shotsOnTarget: [6, 4],
      shotsOffTarget: [8, 5],
      fouls: [12, 14],
      corners: [5, 3],
      yellowCards: [1, 2]
    }
  },
  {
    id: "match-2",
    homeTeam: "Argentina",
    homeCode: "ARG",
    homeFlag: "🇦🇷",
    awayTeam: "England",
    awayCode: "ENG",
    awayFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    homeScore: 1,
    awayScore: 1,
    status: "LIVE",
    time: "32'",
    group: "Quarter-Final",
    stadium: "Al Bayt Stadium, Qatar",
    stats: {
      possession: [48, 52],
      shotsOnTarget: [3, 3],
      shotsOffTarget: [4, 6],
      fouls: [8, 7],
      corners: [2, 4],
      yellowCards: [0, 1]
    }
  },
  {
    id: "match-3",
    homeTeam: "Spain",
    homeCode: "ESP",
    homeFlag: "🇪🇸",
    awayTeam: "Germany",
    awayCode: "GER",
    awayFlag: "🇩🇪",
    homeScore: 0,
    awayScore: 0,
    status: "UPCOMING",
    time: "Today 18:00 UTC",
    group: "Quarter-Final",
    stadium: "Education City Stadium, Qatar"
  },
  {
    id: "match-4",
    homeTeam: "Portugal",
    homeCode: "POR",
    homeFlag: "🇵🇹",
    awayTeam: "Morocco",
    awayCode: "MAR",
    awayFlag: "🇲🇦",
    homeScore: 3,
    awayScore: 0,
    status: "FINISHED",
    time: "FT",
    group: "Group Stage",
    stadium: "Al Thumama Stadium, Qatar",
    stats: {
      possession: [61, 39],
      shotsOnTarget: [9, 2],
      shotsOffTarget: [11, 4],
      fouls: [9, 15],
      corners: [8, 1],
      yellowCards: [1, 3]
    }
  }
];

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: "m-1",
    username: "NeymarFan_10",
    text: "BRAZIL IS COOKING! What a pass from Vinicius! 🇧🇷🔥🔥",
    time: "12:41",
    avatarColor: "bg-green-500"
  },
  {
    id: "m-2",
    username: "MbappeSpeedster",
    text: "Don't count France out yet, Mbappe is about to turn on the turbos! ⚡️🇫🇷",
    time: "12:42",
    avatarColor: "bg-blue-500"
  },
  {
    id: "m-3",
    username: "SystemBroadcast",
    text: "Goal Alert! Brazil 2 - 1 France (Neymar Jr. Pen 68')",
    time: "12:43",
    avatarColor: "bg-amber-600",
    isSystem: true
  },
  {
    id: "m-4",
    username: "RefereeRef",
    text: "Yellow card to Upamecano for that tackle. Completely justified.",
    time: "12:43",
    avatarColor: "bg-yellow-500",
    isModerator: true
  },
  {
    id: "m-5",
    username: "MessiGoat10",
    text: "Waiting for the Argentina England game to heat up! Leo is starting today!",
    time: "12:44",
    avatarColor: "bg-cyan-500"
  }
];
