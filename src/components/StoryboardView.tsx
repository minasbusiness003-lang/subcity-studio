import { useState, useEffect } from "react";
import { StoryboardProject, VideoClip, VideoStyle } from "../types";
import { Sparkles, Play, Pause, Download, Edit, Check, AlertCircle, Copy, Sliders, Volume2, Film, RefreshCw, Layers } from "lucide-react";

interface StoryboardViewProps {
  project: StoryboardProject;
  isGenerating: boolean;
  onGenerateStoryboard: () => void;
  onUpdateClipPrompt: (clipId: string, text: string) => void;
  onUpdateMasterPrompt: (text: string) => void;
}

export default function StoryboardView({
  project,
  isGenerating,
  onGenerateStoryboard,
  onUpdateClipPrompt,
  onUpdateMasterPrompt,
}: StoryboardViewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePlaybackClip, setActivePlaybackClip] = useState<number>(1);
  const [playerProgress, setPlayerProgress] = useState(0); // 0 to 60 seconds
  const [copiedClipId, setCopiedClipId] = useState<string | null>(null);
  const [copiedMaster, setCopiedMaster] = useState(false);
  const [selectedClipIndex, setSelectedClipIndex] = useState<number>(0);
  const [customVolume, setCustomVolume] = useState(50);

  // Auto-player timeline tick: 60s package total, 15s per clip
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setPlayerProgress((prev) => {
          const nextVal = prev + 0.5;
          if (nextVal >= 60) {
            setIsPlaying(false);
            return 0;
          }
          // Determine active clip index based on 15-second steps
          const newClipNum = Math.floor(nextVal / 15) + 1;
          setActivePlaybackClip(newClipNum);
          setSelectedClipIndex(newClipNum - 1);
          return nextVal;
        });
      }, 500);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const jumpToClip = (index: number) => {
    setSelectedClipIndex(index);
    setActivePlaybackClip(index + 1);
    setPlayerProgress(index * 15);
  };

  const copyToClipboard = (text: string, id: string, isMaster = false) => {
    navigator.clipboard.writeText(text);
    if (isMaster) {
      setCopiedMaster(true);
      setTimeout(() => setCopiedMaster(false), 2000);
    } else {
      setCopiedClipId(id);
      setTimeout(() => setCopiedClipId(null), 2000);
    }
  };

  // Helper parser for simulated vector SVG components
  const parseSvgSeed = (seedStr: string) => {
    const defaultVal = { bg: "#0d0d11", stroke: "#22d3ee", secondary: "#3f3f46", text: "#a1a1aa" };
    if (!seedStr) return defaultVal;
    
    try {
      const parts = seedStr.split(";").reduce((acc: any, curr) => {
        const [k, v] = curr.split(":");
        if (k && v) acc[k.trim()] = v.trim();
        return acc;
      }, {});
      
      return {
        bg: parts.background || parts.sky || parts.night_streets || parts.slate_sky || "#0e0e16",
        stroke: parts.lasers || parts.master_crystal || parts.spotlight || parts.floating_island || "#a855f7",
        secondary: parts.fast_speed_lines || parts.circle_ring || parts.stars || parts.billboard_lights || "#e11d48",
        text: parts.character || parts.terrain || parts.mist || parts.fog || "#38bdf8"
      };
    } catch (e) {
      return defaultVal;
    }
  };

  const currentActiveClip = project.clips[selectedClipIndex] || project.clips[0];

  const handleDownloadStoryboard = () => {
    const rawTemplate = `
--------------------------------------------------
SUBCITY BOI WORLD STUDIO - IA STORYBOARD EXPORT
--------------------------------------------------
Project Title: ${project.projectName}
Creation Frame: ${new Date(project.createdAt).toUTCString()}
Dynamic Master Blueprint: ${project.masterPrompt}

==================================================
CLIP SEQUENCE OVERVIEW: (4x 15-Second Continuous Flow)
==================================================
${project.clips.map(clip => `
Clip #${clip.clipNumber} [Time: ${clip.timeStart}s - ${clip.timeEnd}s]
Title: ${clip.title}
Visual AI Prompt: ${clip.visualPrompt}
Camera Vector: ${clip.cameraPath}
Transition In: ${clip.transitionIn}
Sync Subtitles: ${clip.subtitles}
Energy Intensity: ${clip.motionIntensity}/10
Suggested SFX: ${clip.ambientCues}
Color Keys: ${clip.colorPalette.join(", ")}
`).join("\n")}
--------------------------------------------------
Generated via Subcity Boi World Studio (SaaS Core Platform)
`;
    const element = document.createElement("a");
    const file = new Blob([rawTemplate], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${project.projectName.toLowerCase().replace(/\s+/g, '_')}_storyboard.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Sound generator simulation bars
  const visualizerBars = Array.from({ length: 24 });

  return (
    <div className="bg-zinc-900 border border-zinc-805 rounded-xl p-6 shadow-xl shadow-black/10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-zinc-800/60">
        <div>
          <h2 className="font-sans font-semibold text-zinc-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>Step 4: Generate & Preview Storyboard</span>
          </h2>
          <p className="text-xs text-zinc-400">Synthesize reference camera motions and audio tempo to construct your sequence.</p>
        </div>

        {project.clips.length > 0 && (
          <button
            type="button"
            onClick={onGenerateStoryboard}
            className="px-4 py-1.5 text-xs font-mono font-medium border border-zinc-700 hover:border-cyan-500 rounded text-zinc-350 hover:text-cyan-400 flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-Generate Storyboard</span>
          </button>
        )}
      </div>

      {project.clips.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <div className="p-4 bg-zinc-950 text-indigo-400/80 rounded-full border border-zinc-850 shadow-inner mb-4 animate-bounce">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="font-sans font-medium text-zinc-200 text-sm">Awaiting Synthesis Input</h3>
          <p className="text-xs text-zinc-500 max-w-sm mt-1.5 leading-relaxed">
            Ensure you have entered a Music Track (Step 1), selected video Art Styles (Step 2), and uploaded Reference Videos (Step 3) to render the storyboard timeline.
          </p>
          <button
            type="button"
            disabled={isGenerating || project.styles.length === 0 || project.references.length === 0}
            onClick={onGenerateStoryboard}
            className={`mt-6 px-6 py-2 rounded-lg text-xs font-sans font-semibold flex items-center gap-2 transition-all ${
              isGenerating
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                : project.styles.length === 0 || project.references.length === 0
                ? "bg-zinc-800/40 text-zinc-650 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500 to-indigo-650 text-white hover:from-cyan-400 hover:to-indigo-550 shadow-lg shadow-cyan-950/30"
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-zinc-500 border-t-cyan-400 rounded-full animate-spin" />
                <span>Synthesizing Sequences...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Synthesize Consolidated AI Storyboard</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* MASTER INTEGRATED PROMPT BOX */}
          <div className="bg-zinc-950/80 border border-indigo-950/50 rounded-lg p-4 relative">
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Consolidated Synthesis Master Prompt</span>
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(project.masterPrompt, "master", true)}
                className="text-zinc-500 hover:text-zinc-300 p-1 rounded hover:bg-zinc-900 transition flex items-center gap-1 text-[10px] font-mono"
              >
                {copiedMaster ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedMaster ? "Copied" : "Copy Prompt"}</span>
              </button>
            </div>

            <textarea
              value={project.masterPrompt}
              onChange={(e) => onUpdateMasterPrompt(e.target.value)}
              rows={2}
              className="w-full text-xs font-sans text-zinc-350 bg-transparent border-0 resize-none p-0 focus:outline-none focus:ring-0 leading-relaxed font-medium"
              placeholder="Visual generator master prompt matrix..."
            />
          </div>

          {/* DYNAMIC PLAYER PREVIEW VIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-zinc-950/40 border border-zinc-850 rounded-xl p-5">
            {/* Visual Screen */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-zinc-850 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800/40 px-2 py-0.5 rounded-full font-mono uppercase font-semibold">
                      Sequenced Channel
                    </span>
                    <span className="text-xs font-semibold text-zinc-300 truncate max-w-[200px] sm:max-w-xs block">
                      {currentActiveClip.title}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">
                    {playerProgress.toFixed(1)}s / 60.0s
                  </span>
                </div>

                {/* Simulated Monitor with dynamic filters & SVG renderer */}
                <div className="aspect-video bg-zinc-950 rounded-lg border border-zinc-800/85 relative overflow-hidden group">
                  {/* Dynamic canvas backdrop drawing */}
                  <div 
                    className={`w-full h-full flex flex-col items-center justify-center p-6 transition-all duration-700 ${currentActiveClip.cssFilter}`}
                    style={{ backgroundColor: parseSvgSeed(currentActiveClip.svgFrameSeed).bg }}
                  >
                    {/* Artistic Vector Simulated Render */}
                    <svg viewBox="0 0 100 50" className="w-[85%] h-auto opacity-75">
                      <rect width="100" height="50" fill="transparent" />
                      {/* Generative horizon line */}
                      <path d="M 0,40 Q 30,35 60,40 T 100,45" fill="none" stroke={parseSvgSeed(currentActiveClip.svgFrameSeed).text} strokeWidth="0.5" />
                      {/* Generative cloud/moon shape */}
                      <circle cx="75" cy="15" r="8" fill="none" stroke={parseSvgSeed(currentActiveClip.svgFrameSeed).stroke} strokeWidth="0.4" strokeDasharray="1,1" className="animate-spin" style={{ animationDuration: '40s' }} />
                      
                      {/* Dynamic action sweeps or laser lines if Action/Sci-Fi is selected */}
                      {project.styles.some(s => s === VideoStyle.Action || s === VideoStyle.SciFi || s === VideoStyle.Cyberpunk) && (
                        <>
                          <line x1="10" y1="10" x2="90" y2="40" stroke={parseSvgSeed(currentActiveClip.svgFrameSeed).stroke} strokeWidth="0.85" strokeDasharray="5,2" />
                          <line x1="90" y1="10" x2="10" y2="40" stroke={parseSvgSeed(currentActiveClip.svgFrameSeed).secondary} strokeWidth="0.35" />
                        </>
                      )}

                      {/* Floating crystals for fantasy or retro */}
                      {project.styles.some(s => s === VideoStyle.Fantasy || s === VideoStyle.Anime || s === VideoStyle.Retro) && (
                        <>
                          <polygon points="50,15 54,23 50,30 46,23" fill="none" stroke={parseSvgSeed(currentActiveClip.svgFrameSeed).stroke} strokeWidth="0.6" className="animate-bounce" />
                          <polygon points="20,20 22,25 20,30 18,25" fill="none" stroke={parseSvgSeed(currentActiveClip.svgFrameSeed).secondary} strokeWidth="0.4" />
                          <polygon points="85,30 87,33 85,36 83,33" fill="none" stroke={parseSvgSeed(currentActiveClip.svgFrameSeed).stroke} strokeWidth="0.4" />
                        </>
                      )}

                      {/* Focus circles */}
                      <circle cx="50" cy="25" r="16" fill="none" stroke={parseSvgSeed(currentActiveClip.svgFrameSeed).text} strokeWidth="0.25" strokeDasharray="3,1" />
                      
                      {/* Cinematic target crosshair grids */}
                      <line x1="50" y1="5" x2="50" y2="45" stroke="#ffffff" strokeWidth="0.1" strokeOpacity="0.3" strokeDasharray="1,1" />
                      <line x1="10" y1="25" x2="90" y2="25" stroke="#ffffff" strokeWidth="0.1" strokeOpacity="0.3" strokeDasharray="1,1" />
                    </svg>

                    {/* Subtitle Telemetries Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 bg-black/75 backdrop-blur-sm border border-zinc-800 px-3 py-1.5 rounded text-center">
                      <p className="text-[11px] font-sans text-white/95 leading-normal italic">
                        {currentActiveClip.subtitles}
                      </p>
                    </div>

                    {/* Left overlay badge matching style */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      <span className="text-[8.5px] font-mono tracking-wider bg-black/60 px-2 py-0.5 rounded text-zinc-400 border border-zinc-800">
                        CLIP {currentActiveClip.clipNumber} • TRANSITION: {currentActiveClip.transitionIn.toUpperCase()}
                      </span>
                    </div>

                    {/* Right active player audio sync bar indicators */}
                    <div className="absolute bottom-3 right-3 flex items-end gap-0.5 h-6">
                      {visualizerBars.slice(0, 8).map((_, i) => (
                        <span 
                          key={i} 
                          className="w-0.75 bg-cyan-400 rounded-sm"
                          style={{ 
                            height: isPlaying ? `${Math.floor(Math.random() * 20) + 4}px` : "3px",
                            transition: 'height 150ms ease-out'
                          }} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Player Timeline Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between gap-4 text-xs font-mono text-zinc-500 mb-2">
                  <span>Start [0:00]</span>
                  <div className="flex items-center gap-1.5 text-cyan-400/80">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span className="text-[10px]">Audio Sync Active</span>
                  </div>
                  <span>End [1:00]</span>
                </div>

                <div className="relative h-1.5 bg-zinc-850 rounded-full overflow-hidden cursor-pointer">
                  {/* Major beat anchors / clips divisions */}
                  <div className="absolute left-[25%] top-0 bottom-0 w-0.5 bg-zinc-800" />
                  <div className="absolute left-[50%] top-0 bottom-0 w-0.5 bg-zinc-800" />
                  <div className="absolute left-[75%] top-0 bottom-0 w-0.5 bg-zinc-800" />

                  {/* Reactive bar fill */}
                  <div 
                    className="absolute h-full left-0 top-0 bg-gradient-to-r from-cyan-500 to-indigo-550 transition-all duration-300"
                    style={{ width: `${(playerProgress / 60) * 100}%` }}
                  />
                </div>

                {/* Player Controls Bar */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={togglePlayback}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        isPlaying 
                          ? "bg-red-500 hover:bg-red-400 text-white" 
                          : "bg-cyan-500 hover:bg-cyan-400 text-zinc-950"
                      }`}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-zinc-950 ml-0.5" />}
                    </button>

                    <div className="flex border border-zinc-800 rounded bg-zinc-950/60 p-0.5 text-[11px] font-mono">
                      {project.clips.map((clip, idx) => (
                        <button
                          key={clip.id}
                          type="button"
                          onClick={() => jumpToClip(idx)}
                          className={`px-2.5 py-1 rounded transition-colors ${
                            selectedClipIndex === idx 
                              ? "bg-zinc-800 text-cyan-300 font-semibold" 
                              : "text-zinc-500 hover:text-zinc-300"
                          }`}
                        >
                          C{clip.clipNumber}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadStoryboard}
                    className="px-4 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Script ({project.projectName.slice(0,10)})</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Variable Extraction Fine-Tuning Console */}
            <div className="lg:col-span-5 bg-zinc-950/25 border border-zinc-850 rounded-lg p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block border-b border-zinc-850 pb-2 mb-3 font-semibold">
                  CLIP {currentActiveClip.clipNumber} META PARAMETERS
                </span>

                <div className="space-y-4">
                  {/* Clip prompt and custom instruction edits */}
                  <div>
                    <span className="text-[10px] font-mono text-zinc-550 block mb-1">Visual Prompt</span>
                    <textarea
                      value={currentActiveClip.visualPrompt}
                      onChange={(e) => onUpdateClipPrompt(currentActiveClip.id, e.target.value)}
                      rows={4}
                      className="w-full text-[11px] font-sans text-zinc-300 bg-zinc-950 border border-zinc-850 rounded p-2 focus:outline-none focus:border-zinc-700"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-3.5">
                    {/* Motion Slider indicator */}
                    <div>
                      <span className="text-[10px] font-mono text-zinc-550 block mb-1">Motion Scale</span>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-zinc-850 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-cyan-400"
                            style={{ width: `${(currentActiveClip.motionIntensity / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono text-cyan-400 font-bold">{currentActiveClip.motionIntensity}/10</span>
                      </div>
                    </div>

                    {/* Camera track */}
                    <div>
                      <span className="text-[10px] font-mono text-zinc-550 block mb-0.5">3D Vector Camera</span>
                      <span className="text-xs font-sans font-medium text-zinc-200 line-clamp-1">
                        {currentActiveClip.cameraPath}
                      </span>
                    </div>

                    {/* Ambient triggers */}
                    <div className="col-span-2 border-t border-zinc-850/60 pt-3">
                      <span className="text-[10px] font-mono text-zinc-550 block mb-0.5">Atmospheric Audio Sync</span>
                      <p className="text-xs text-zinc-400 font-sans leading-snug">
                        {currentActiveClip.ambientCues}
                      </p>
                    </div>

                    {/* Color palette blocks */}
                    <div className="col-span-2">
                      <span className="text-[10px] font-mono text-zinc-550 block mb-1.5">Primary Target Palette</span>
                      <div className="flex items-center gap-2">
                        {currentActiveClip.colorPalette.map((hex, i) => (
                          <div key={i} className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-850 rounded px-2 py-1">
                            <span 
                              className="w-2.5 h-2.5 rounded-full border border-white/10" 
                              style={{ backgroundColor: hex }} 
                            />
                            <span className="text-[9.5px] font-mono text-zinc-400">{hex}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-850 flex items-center justify-between text-[11px] text-zinc-500 font-sans">
                <span className="flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-zinc-650" />
                  <span>Interactive Playground active</span>
                </span>
                <span className="text-zinc-400">Time Segment: {currentActiveClip.timeStart}s - {currentActiveClip.timeEnd}s</span>
              </div>
            </div>
          </div>

          {/* CHRONOLOGICAL TIMELINE ROWS FOR EXPANSION */}
          <div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-3 font-semibold">
              Chronological Sequence Map (60 Seconds Continuous Flow)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {project.clips.map((clip, idx) => (
                <div
                  key={clip.id}
                  onClick={() => jumpToClip(idx)}
                  className={`border rounded-lg p-3.5 text-left transition-all duration-300 cursor-pointer relative overflow-hidden group ${
                    selectedClipIndex === idx 
                      ? "border-cyan-500 bg-cyan-950/10 shadow-lg" 
                      : "border-zinc-850 bg-zinc-950/20 hover:border-zinc-800 hover:bg-zinc-950/50"
                  }`}
                >
                  <div className="absolute top-0 right-0 p-1">
                    <span className="text-[9px] font-mono text-zinc-550">
                      0:{clip.timeStart.toString().padStart(2, '0')} - 0:{clip.timeEnd.toString().padStart(2, '0')}
                    </span>
                  </div>

                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Clip #{clip.clipNumber}</p>
                  <h4 className={`text-xs font-semibold mb-1.5 truncate ${selectedClipIndex === idx ? "text-cyan-400" : "text-zinc-200"}`}>
                    {clip.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 line-clamp-3 leading-snug">
                    {clip.visualPrompt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
