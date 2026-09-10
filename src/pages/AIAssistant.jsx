import React, { useState, useEffect, useRef } from "react";
import { Bot, Check, ChevronRight } from "lucide-react";
import { GlassCard, ScreenHeader } from "../components/ui.jsx";
import { respond, WELCOME_MESSAGE, SUGGESTIONS } from "../features/ai/services/demoAssistant.js";

export default function AIAssistant() {
  const [messages, setMessages] = useState([{ role: "ai", text: WELCOME_MESSAGE }]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef(null);
  const suggestions = SUGGESTIONS;

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, thinking]);

  async function send(text) {
    const q = (text ?? input).trim();
    if (!q) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setThinking(true);
    const reply = await respond(q);
    setThinking(false);
    setMessages((m) => [...m, { role: "ai", ...reply }]);
  }

  return (
    <div className="pb-2 h-full flex flex-col">
      <ScreenHeader title="AI Assistant" right={<span className="text-[9px] px-2 py-0.5 rounded-full border border-amber-400/30 text-amber-400 bg-amber-400/10">DEMO MODE</span>} />
      <div className="flex-1 overflow-y-auto px-5 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "ai" ? (
              <div className="max-w-[85%]">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-5 h-5 rounded-md bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center"><Bot size={11} className="text-[#050b14]" /></div>
                  <span className="text-[10px] text-white/30">NEXUS AI</span>
                </div>
                <GlassCard className="p-3.5">
                  <p className="text-[13px] text-white/85 leading-relaxed">{m.text}</p>
                  {m.pid && (
                    <>
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        {[["P", m.pid.p], ["I", m.pid.i], ["D", m.pid.d]].map(([k, v]) => (
                          <div key={k} className="bg-white/5 rounded-lg py-2 text-center">
                            <div className="text-[10px] text-white/35">{k}</div>
                            <div className="text-base font-bold text-cyan-400">{v}</div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 space-y-1">
                        {(m.notes || []).map((s) => (
                          <div key={s} className="flex items-center gap-1.5 text-[12px] text-white/60"><Check size={12} className="text-emerald-400" /> {s}</div>
                        ))}
                      </div>
                    </>
                  )}
                </GlassCard>
              </div>
            ) : (
              <div className="max-w-[85%] bg-cyan-400 text-[#050b14] rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-[13px] font-medium">{m.text}</div>
            )}
          </div>
        ))}
        {thinking && (
          <div className="flex items-center gap-1.5 text-white/30 text-xs">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center"><Bot size={11} className="text-[#050b14]" /></div>
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </span>
          </div>
        )}
        <div ref={endRef} />
      </div>
      {messages.length < 3 && (
        <div className="px-5 flex gap-2 overflow-x-auto py-2">
          {suggestions.map((s) => (
            <button key={s} onClick={() => send(s)} className="text-[11px] whitespace-nowrap px-3 py-1.5 rounded-full border border-white/10 text-white/50 bg-white/5">{s}</button>
          ))}
        </div>
      )}
      <div className="px-5 pt-2 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="พิมพ์คำถามของคุณ..."
          className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-cyan-400/40"
        />
        <button onClick={() => send()} className="w-11 h-11 rounded-full bg-cyan-400 flex items-center justify-center shrink-0">
          <ChevronRight size={18} className="text-[#050b14]" />
        </button>
      </div>
    </div>
  );
}
