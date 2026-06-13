import React, { useState, useEffect, useRef } from "react";
import { ChatMessage } from "../types";
import { MessageSquare, Send, Users, Shield, Star, Smile, Zap } from "lucide-react";

interface FanLoungeProps {
  chatMessages: ChatMessage[];
  onSendMessage: (text: string) => void;
}

export const FanLounge: React.FC<FanLoungeProps> = ({
  chatMessages,
  onSendMessage
}) => {
  const [inputText, setInputText] = useState("");
  const chatLogRef = useRef<HTMLDivElement | null>(null);

  // Limit auto-scrolling to the specific chat log container to prevent jumping/scrolling the entire page!
  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTo({
        top: chatLogRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [chatMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText("");
  };

  // Quick Emoji reactions
  const handleEmojiClick = (emoji: string) => {
    onSendMessage(emoji);
  };

  return (
    <div id="fan-lounge-box" className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden flex flex-col h-[480px] lg:h-full shadow-lg">
      
      {/* Header and counter */}
      <div className="p-4 bg-[#0a0a0a] border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-gold animate-pulse" />
          <h3 className="text-zinc-150 font-bold uppercase text-xs tracking-tight">
            Live Fan Lounge
          </h3>
        </div>
        <div className="flex items-center gap-1 bg-gold/10 px-2.5 py-0.5 rounded border border-gold/20">
          <Users className="w-3 h-3 text-gold" />
          <span className="text-[10px] font-mono text-gold font-bold tracking-widest">
            184,951 LIVE
          </span>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div ref={chatLogRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 text-sm">
        {chatMessages.map((msg) => {
          if (msg.isSystem) {
            return (
              <div 
                key={msg.id} 
                className="p-2 py-2.5 bg-amber-950/20 border border-amber-900/15 rounded-lg text-xs font-semibold text-amber-400 flex items-center gap-2 animate-fadeIn"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-bounce shrink-0" />
                <span className="leading-tight">{msg.text}</span>
              </div>
            );
          }

          return (
            <div key={msg.id} className="flex items-start gap-2.5 group animate-fadeIn">
              {/* Profile Avatar Dot */}
              <div className={`w-7 h-7 rounded-full ${msg.avatarColor} text-white flex items-center justify-center font-bold text-[10px] uppercase shrink-0`}>
                {msg.username.charAt(0)}
              </div>

              {/* Message Payload */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* Badges */}
                  {msg.isModerator && (
                    <span className="px-1 py-0.5 bg-rose-600 text-white rounded text-[8px] font-extrabold uppercase flex items-center gap-0.5 tracking-wider font-mono">
                      <Shield className="w-2 h-2 fill-current" />
                      MOD
                    </span>
                  )}
                  {msg.username === "You" && (
                    <span className="px-1 py-0.5 bg-gold text-black rounded text-[8px] font-extrabold uppercase tracking-wider font-mono">
                      YOU
                    </span>
                  )}

                  {/* Username */}
                  <span className={`text-xs font-extrabold truncate ${msg.username === "You" ? "text-gold" : "text-zinc-300"}`}>
                    {msg.username}
                  </span>

                  {/* Timestamp */}
                  <span className="text-[9px] text-zinc-600 font-mono">{msg.time}</span>
                </div>

                {/* Message Body */}
                <p className="text-xs text-zinc-200 mt-1 leading-relaxed break-words font-sans selection:bg-gold/20">
                  {msg.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick emoji click answers */}
      <div className="px-3 py-2 bg-black/60 border-t border-white/5 flex items-center justify-between gap-1 overflow-x-auto select-none no-scrollbar">
        <span className="text-[10px] text-zinc-650 font-bold uppercase tracking-wider whitespace-nowrap mr-2">
          Reaction Board:
        </span>
        <div className="flex items-center gap-1.5">
          {[
            { tag: "⚽ GOAL!", emo: "⚽ GOAL!" },
            { tag: "🇧🇷 BRAZIL", emo: "🇧🇷🇧🇷🇧🇷" },
            { tag: "🇫🇷 FRANCE", emo: "🇫🇷🇫🇷🇫🇷" },
            { tag: "🇦🇷 MESSI", emo: "🐐🇦🇷🐐" },
            { tag: "📣 NOOO!", emo: "🟥 WHAT? REF!" },
            { tag: "🔥 OMG", emo: "🔥🔥🔥" }
          ].map((entry, index) => (
            <button
              id={`emoji-reaction-${index}`}
              key={index}
              onClick={() => handleEmojiClick(entry.emo)}
              className="px-2 py-1 bg-[#161616] hover:bg-[#222] border border-white/5 hover:border-gold/20 rounded-md text-[10px] text-zinc-350 font-bold active:scale-95 transition-all whitespace-nowrap cursor-pointer"
            >
              {entry.tag}
            </button>
          ))}
        </div>
      </div>

      {/* Text input submission */}
      <form onSubmit={handleSubmit} className="p-3 bg-[#0a0a0a] border-t border-white/5 flex items-center gap-2">
        <input
          id="chat-text-input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Send a live cheer to stadium stream..."
          maxLength={150}
          className="flex-1 bg-zinc-950 text-xs text-zinc-100 rounded-lg py-2.5 px-3 border border-white/5 focus:outline-none focus:border-gold/60 placeholder-zinc-600 transition-colors"
        />
        <button
          id="chat-send-btn"
          type="submit"
          className="p-2.5 bg-gold hover:bg-gold-hover active:scale-95 rounded-lg text-black font-bold transition-all shrink-0 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5 fill-current" />
        </button>
      </form>
    </div>
  );
};
