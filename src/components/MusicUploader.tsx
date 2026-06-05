import { useState, useRef, ChangeEvent } from "react";
import { Music, Upload, FileAudio, Play, Pause, AlertCircle, FileText, Sparkles, ChevronRight, Sliders, Check } from "lucide-react";
import { MusicAnalysis } from "../types";

interface MusicUploaderProps {
  onAnalysisComplete: (fileName: string, lyrics: string, analysis: MusicAnalysis, audioUrl?: string) => void;
  isAnalyzing: boolean;
  currentTrackName?: string;
  onSelectEmbeddedTrack?: (title: string, audioUrl: string) => void;
}

interface PresetTrack {
  id: string;
  title: string;
  genre: string;
  tempo: number;
  duration: string;
  lyrics: string;
  url: string; // fallback synthetic path
}

export default function MusicUploader({ onAnalysisComplete, isAnalyzing, currentTrackName }: MusicUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [lyrics, setLyrics] = useState("");
  const [userGenreGuess, setUserGenreGuess] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Curated premium preset studio tracks to lower friction & maximize user playground engagement
  const presets: PresetTrack[] = [
    {
      id: "preset_1",
      title: "Subcity Cyberpunk Neon Grid.wav",
      genre: "Synthwave / Dark Electro",
      tempo: 125,
      duration: "01:00",
      lyrics: "Red lasers reflect on wet concrete streets\nHolographic screens illuminate the skies\nWe run the grid under synthetic sheets\nNeon souls dancing to electric cries...",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
      id: "preset_2",
      title: "Blooming Sakura Rain.mp3",
      genre: "Anime Lofi Chill",
      tempo: 85,
      duration: "01:00",
      lyrics: "Petals soft falling like crystal drops of rain\nWhispered echoes in the silent tea garden arcade\nTime holds its breath, washing off the persistent pain\nSoft pastel colors on canvas and screens displayed...",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
      id: "preset_3",
      title: "Volcanic Crimson Adrenaline.wav",
      genre: "High-Voltage Rock / Action Metal",
      tempo: 142,
      duration: "01:00",
      lyrics: "Molten rock rising from dark volcanic deeps\nLightning shattering mountain peak domes\nAdrenaline spikes as the seismic tremor leaps\nCrashing waves under fire-painted chrome...",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
    },
    {
      id: "preset_4",
      title: "Nebula Dreams Deep Space.wav",
      genre: "Ethereal Cinematic Sci-Fi",
      tempo: 100,
      duration: "01:00",
      lyrics: "Distant galaxies circling ancient stellar rings\nHolographic stars illuminating cosmic deeps\nTime bends back on gravitational string strings\nAs the quantum spacecraft silently leaps...",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
    }
  ];

  const handleDrag = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("audio/")) {
        setUploadedFile(file);
        setSelectedPreset(null);
        setStatusMessage(`Successfully loaded local track: ${file.name}`);
      } else {
        setStatusMessage("Error: Only audio files (.mp3, .wav, .aac, .m4a, or similar) are accepted");
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setSelectedPreset(null);
      setStatusMessage(`Ready: ${file.name}`);
    }
  };

  const selectPreset = (preset: PresetTrack) => {
    setSelectedPreset(preset.id);
    setUploadedFile(null);
    setLyrics(preset.lyrics);
    setUserGenreGuess(preset.genre);
    setStatusMessage(`Selected Studio Track: ${preset.title}`);
  };

  const triggerAnalysis = async () => {
    let name = "";
    let songLyrics = lyrics;

    if (uploadedFile) {
      name = uploadedFile.name;
    } else if (selectedPreset) {
      const preset = presets.find(p => p.id === selectedPreset);
      name = preset ? preset.title : "Preset_Track.wav";
    } else {
      setStatusMessage("Please select a built-in track or upload your own song first.");
      return;
    }

    try {
      setStatusMessage("Dispatching song metadata to Gemini Core API...");
      const response = await fetch("/api/analyze-music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: name,
          lyrics: songLyrics,
          userGenreGuess
        })
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with the analysis server.");
      }

      const data = await response.json();
      
      // Pass back to parent
      // Note: we can use a standard royalty-free MP3 stream for simulation
      const matchedPreset = presets.find(p => p.id === selectedPreset);
      onAnalysisComplete(name, songLyrics, data, matchedPreset?.url);
      setStatusMessage("Track analyzed in depth. Proceed to visual style settings.");
    } catch (err: any) {
      console.error(err);
      setStatusMessage("Engine Error: Could not synchronize analysis.");
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl shadow-black/10">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-cyan-950 text-cyan-400 rounded-md border border-cyan-900/40">
          <Music className="w-4 h-4" />
        </div>
        <div>
          <h2 className="font-sans font-semibold text-zinc-100">Step 1: Upload & Analyze Music Track</h2>
          <p className="text-xs text-zinc-400">Audio parameters define the visual timeline grid, drop beats, and transitions.</p>
        </div>
      </div>

      {/* DRAG-AND-DROP CONTAINER */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
          dragActive
            ? "border-cyan-400 bg-cyan-950/20"
            : uploadedFile
            ? "border-emerald-500/60 bg-emerald-950/10"
            : "border-zinc-800 bg-zinc-950/40 hover:border-zinc-700 hover:bg-zinc-950/70"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="audio/*"
          className="hidden"
        />
        
        {uploadedFile ? (
          <div className="flex flex-col items-center gap-2 animate-fadeIn">
            <div className="p-3 bg-emerald-950 text-emerald-400 rounded-full border border-emerald-800/40">
              <FileAudio className="w-8 h-8" />
            </div>
            <p className="text-sm font-medium text-emerald-300 font-sans max-w-full truncate px-4">
              {uploadedFile.name}
            </p>
            <p className="text-[11px] text-zinc-400 font-mono">
              {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB • Audio Type Detected
            </p>
            <span className="text-[10px] text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-md mt-1">
              Click to replace
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-zinc-900 text-zinc-400 rounded-full border border-zinc-800">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm text-zinc-300 font-medium font-sans">
              Drag & drop audio track here, or <span className="text-cyan-400 hover:underline">browse files</span>
            </p>
            <p className="text-xs text-zinc-500">
              Supports MP3, WAV, AAC, M4A, FLAC (Max 25MB)
            </p>
          </div>
        )}
      </div>

      {/* SAMPLE PLAYGROUND PRESETS BAR */}
      <div className="mt-5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest block">
            Or Choose Studio Production Sample
          </label>
          <span className="text-[10px] font-mono text-cyan-500">Quick Sandbox</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {presets.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => selectPreset(p)}
              className={`p-3 rounded-lg border text-left flex items-start gap-3 transition-all ${
                selectedPreset === p.id
                  ? "border-cyan-500 bg-cyan-950/20 shadow-sm"
                  : "border-zinc-800/60 bg-zinc-950/30 hover:border-zinc-800 hover:bg-zinc-900/50"
              }`}
            >
              <div className={`p-1.5 rounded-md self-center ${selectedPreset === p.id ? "bg-cyan-950 text-cyan-400" : "bg-zinc-900 text-zinc-400"}`}>
                <FileAudio className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <p className={`text-xs font-medium font-sans truncate ${selectedPreset === p.id ? "text-cyan-300" : "text-zinc-300"}`}>
                  {p.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-zinc-500 font-mono">
                  <span>{p.genre}</span>
                  <span>•</span>
                  <span>{p.tempo} BPM</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* PARAMETERS SECTION: LYRICS & GENRE OVERRIDE */}
      <div className="mt-5 border-t border-zinc-800/60 pt-4">
        <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-2">
          Optional Music Aesthetics
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-3.5">
          <div>
            <label className="text-[11px] text-zinc-400 block mb-1">Estimated Genre/Sonic Style</label>
            <input
              type="text"
              value={userGenreGuess}
              onChange={(e) => setUserGenreGuess(e.target.value)}
              placeholder="e.g. Dreamy Chillhop, Gothic Tech Beats"
              className="w-full text-xs font-sans bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-zinc-200 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600"
            />
          </div>
          <div>
            <label className="text-[11px] text-zinc-400 block mb-1">Lyrics Content (Highly Recommended)</label>
            <div className="text-[10px] text-zinc-500 block mb-1">Helps Gemini map narrative scenes chronologically</div>
          </div>
        </div>

        <div>
          <textarea
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            rows={2}
            placeholder="Paste your track's lyrics or structural breakdown (e.g., Intro - 0:15 / Verse - 0:30 Drop / Outro)..."
            className="w-full text-xs font-sans bg-zinc-950 border border-zinc-800 rounded-md p-3 text-zinc-200 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600 placeholder:text-zinc-600"
          />
        </div>
      </div>

      {/* TRIGGER ACTION */}
      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Sliders className="w-3.5 h-3.5 text-zinc-600" />
          <span>Formulating semantic audio sync values...</span>
        </div>
        
        <button
          type="button"
          disabled={isAnalyzing || (!uploadedFile && !selectedPreset)}
          onClick={triggerAnalysis}
          className={`px-5 py-2 rounded-lg text-xs font-sans font-semibold flex items-center gap-2 transition-all ${
            isAnalyzing
              ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              : !uploadedFile && !selectedPreset
              ? "bg-zinc-800/40 text-zinc-650 cursor-not-allowed"
              : "bg-cyan-500 text-zinc-950 hover:bg-cyan-400 shadow-lg shadow-cyan-950/40"
          }`}
        >
          {isAnalyzing ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-zinc-600 border-t-cyan-400 rounded-full animate-spin" />
              <span>Analyzing Track beat waves...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Analyze & Register Track</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* FEEDBACK STATUS */}
      {statusMessage && (
        <div className="mt-4 flex items-start gap-2 bg-zinc-950/80 border border-zinc-800/80 rounded-md p-3 text-[11px] font-mono leading-relaxed">
          <AlertCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
          <span className="text-zinc-300">{statusMessage}</span>
        </div>
      )}
    </div>
  );
}
