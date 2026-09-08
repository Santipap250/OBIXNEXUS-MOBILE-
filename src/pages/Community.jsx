import React, { useState } from "react";
import { Plus, Heart, MessageCircle, Eye, Share2 } from "lucide-react";
import { GlassCard, ScreenHeader } from "../components/ui.jsx";
import { seedPosts } from "../data/seed.js";

export default function Community() {
  const [posts, setPosts] = useState(seedPosts.map((p) => ({ ...p, liked: false })));
  function toggleLike(id) {
    setPosts((ps) => ps.map((p) => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  }
  return (
    <div className="pb-4">
      <ScreenHeader title="Community" right={<button className="w-8 h-8 rounded-full bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400"><Plus size={16} /></button>} />
      <div className="px-5">
        <div className="text-[11px] text-white/35 mb-3">เนื้อหาตัวอย่าง — เรียกดูได้โดยไม่ต้องเข้าสู่ระบบ</div>
        <div className="flex gap-2 mb-4 overflow-x-auto -mx-5 px-5">
          {["ทั้งหมด", "Preset", "Build", "Blackbox", "Tuning"].map((c, i) => (
            <button key={c} className={`text-xs px-3.5 py-1.5 rounded-full whitespace-nowrap border ${i === 0 ? "bg-white text-[#050b14] border-white font-semibold" : "border-white/10 text-white/50"}`}>{c}</button>
          ))}
        </div>
        <div className="space-y-3">
          {posts.map((p) => (
            <GlassCard key={p.id} className="p-4">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-[11px] font-bold text-[#050b14]">{p.user[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold text-white flex items-center gap-1.5">
                    {p.user}
                    {p.tag && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-400/15 text-cyan-400">{p.tag}</span>}
                  </div>
                </div>
              </div>
              <div className="text-[13px] font-semibold text-white mb-1">{p.title}</div>
              <p className="text-[12px] text-white/45 leading-relaxed mb-3">{p.desc}</p>
              <div className="flex items-center gap-4 text-white/40 text-[11px]">
                <button onClick={() => toggleLike(p.id)} className={`flex items-center gap-1 ${p.liked ? "text-pink-400" : ""}`}>
                  <Heart size={14} fill={p.liked ? "currentColor" : "none"} /> {p.likes}
                </button>
                <span className="flex items-center gap-1"><MessageCircle size={14} /> {p.comments}</span>
                <span className="flex items-center gap-1"><Eye size={14} /> {p.views >= 1000 ? (p.views / 1000).toFixed(1) + "k" : p.views}</span>
                <button className="ml-auto"><Share2 size={14} /></button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
