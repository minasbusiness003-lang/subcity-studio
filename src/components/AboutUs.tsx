import { Quote, Sparkles, Terminal, Heart, Zap, Globe, Cpu } from "lucide-react";

export default function AboutUs() {
  return (
    <div id="about-us-page" className="max-w-4xl mx-auto space-y-12 py-6 animate-fadeIn">
      {/* HERO STATEMENT GRAPHIC */}
      <div className="relative py-12 px-6 overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 text-center space-y-6 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/5 via-cyan-500/5 to-transparent pointer-events-none" />
        
        {/* Aesthetic accents */}
        <div className="absolute top-4 left-6 text-zinc-850 font-mono text-[9px] select-none tracking-widest uppercase">
          01 // ESTABLISHED 2026
        </div>
        <div className="absolute bottom-4 right-6 text-zinc-850 font-mono text-[9px] select-none tracking-widest uppercase">
          4x15s GRID FLOW SYNTHESIS
        </div>

        <div className="inline-flex p-3 bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 rounded-2xl">
          <Terminal className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-4 max-w-2xl mx-auto">
          <h2 className="text-sm font-semibold tracking-wider text-cyan-400 uppercase font-mono">
            SUBCITY BOI WORLD STUDIO
          </h2>
          <p className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-relaxed">
            Subcity Boi World Studio is your creative space for bringing artistic and innovative ideas to life and transforming them into complete professional works of art.
          </p>
        </div>
      </div>

      {/* CORE PHILOSOPHY QUOTE PANEL */}
      <div className="bg-gradient-to-r from-cyan-950/20 via-indigo-950/20 to-zinc-950 border border-cyan-900/30 rounded-2xl p-8 sm:p-10 relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 text-cyan-500/5 transform rotate-12">
          <Quote className="w-48 h-48" />
        </div>

        <div className="max-w-2xl space-y-4">
          <div className="flex items-center gap-2 text-cyan-400">
            <Quote className="w-5 h-5" />
            <span className="text-xs font-bold font-mono tracking-widest uppercase">STUDIO CREATIVE MANIFESTO</span>
          </div>
          
          <blockquote className="text-2xl sm:text-3xl font-serif italic text-zinc-100 leading-snug tracking-wide">
            "When you lose your mind, that's where creativity begins."
          </blockquote>
          
          <div className="pt-2 flex items-center gap-2">
            <div className="w-6 h-0.5 bg-cyan-500" />
            <p className="text-xs text-zinc-400 font-mono uppercase tracking-widest">SUBCITY BOI COLLECTIVE</p>
          </div>
        </div>
      </div>

      {/* THREE BENTO ACCENTS TO REINFORCE PROFESSIONALISM */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-950 border border-zinc-850 p-6 rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-550/10 text-cyan-400 flex items-center justify-center border border-cyan-800/40">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-zinc-100">Machine Vision Coherence</h4>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            Our platform reads reference trailers frame-by-frame to align cinematography characteristics smoothly with your custom audio cues.
          </p>
        </div>

        <div className="bg-zinc-950 border border-zinc-850 p-6 rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-550/10 text-indigo-400 flex items-center justify-center border border-indigo-800/40">
            <Globe className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-zinc-100">Subcity Culture Hub</h4>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            Deep-seated underground electronic synth designs paired custom cyber-anime visuals to create a truly bespoke cyber-reality workspace.
          </p>
        </div>

        <div className="bg-zinc-950 border border-zinc-850 p-6 rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-purple-550/10 text-purple-400 flex items-center justify-center border border-purple-800/40">
            <Cpu className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-zinc-100">Neural-Grid Renders</h4>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            We render exact visual color spaces, pacing grids, ambient visual directions, and dynamic subtitles, creating cinematic blueprints.
          </p>
        </div>
      </div>
    </div>
  );
}
