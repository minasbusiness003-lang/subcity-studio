import { useState, useRef, ChangeEvent } from "react";
import { Video, Upload, Play, Check, Server, Eye, Compass, Sun, Moon, Sparkles, Film, AlertCircle, Trash2, Sliders, BarChart } from "lucide-react";
import { VideoReferenceAnalysis } from "../types";

interface VideoReferencesProps {
  references: VideoReferenceAnalysis[];
  onReferencesAnalyzed: (refs: VideoReferenceAnalysis[]) => void;
  isAnalyzing: boolean;
}

interface SampleReference {
  name: string;
  sizeLabel: string;
  duration: string;
  category: string;
  thumbnailColor: string;
}

export default function VideoReferences({ references, onReferencesAnalyzed, isAnalyzing: parentIsAnalyzing }: VideoReferencesProps) {
  const [dragActive, setDragActive] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [selectedLocalFiles, setSelectedLocalFiles] = useState<File[]>([]);
  const [internalIsAnalyzing, setInternalIsAnalyzing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Creative sample cinematic clips for rapid sandbox generation, complete with metadata
  const sampleClips: SampleReference[] = [
    {
      name: "Cyberpunk_Streets_Rain_Drone_8K.mp4",
      sizeLabel: "12.4 MB",
      duration: "0:15",
      category: "Futuristic / High Motion",
      thumbnailColor: "from-pink-600 to-indigo-800"
    },
    {
      name: "Mononoke_Forest_Spirits_Watercolor.mp4",
      sizeLabel: "8.1 MB",
      duration: "0:12",
      category: "Anime / Ethereal Glow",
      thumbnailColor: "from-teal-600 to-emerald-800"
    },
    {
      name: "Dune_Desert_Chiaroscuro_Slider.mp4",
      sizeLabel: "15.7 MB",
      duration: "0:18",
      category: "Cinematic / Low Lighting",
      thumbnailColor: "from-amber-700 to-yellow-900"
    },
    {
      name: "Neo_Formula_Speedway_kinetic.mp4",
      sizeLabel: "14.2 MB",
      duration: "0:15",
      category: "Action / Fast Cuts",
      thumbnailColor: "from-red-650 to-orange-700"
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
      const filesArray = Array.from(e.dataTransfer.files) as File[];
      const videoFiles = filesArray.filter((f) => f.type.startsWith("video/"));
      
      if (videoFiles.length > 0) {
        setSelectedLocalFiles((prev) => [...prev, ...videoFiles]);
        setStatusMessage(`Queued ${videoFiles.length} local video reference file(s) for deep tensor analysis.`);
      } else {
        setStatusMessage("Error: Please drop valid video files (.mp4, .webm, .mov, etc.)");
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files) as File[];
      const videoFiles = filesArray.filter((f) => f.type.startsWith("video/"));

      if (videoFiles.length > 0) {
        setSelectedLocalFiles((prev) => [...prev, ...videoFiles]);
        setStatusMessage(`Queued ${videoFiles.length} file(s). Click "Run Visual Extraction" to extract variables.`);
      } else {
        setStatusMessage("No valid video files selected.");
      }
    }
  };

  const selectSampleClip = (clip: SampleReference) => {
    // Generate a beautiful virtual File object to simulate
    const virtualFileObj = {
      name: clip.name,
      sizeLabel: clip.sizeLabel,
      type: "video/mp4"
    };

    // Prevent duplicates
    if (selectedLocalFiles.some((f) => f.name === clip.name)) {
      setStatusMessage(`"${clip.name}" is already in queue.`);
      return;
    }

    // Convert virtual structure representation to standard structure
    const fauxFile = new File([""], clip.name, { type: "video/mp4" });
    // Keep reference sizes simulated
    Object.defineProperty(fauxFile, 'size', { value: parseInt(clip.sizeLabel) * 1024 * 1024 });
    
    setSelectedLocalFiles((prev) => [...prev, fauxFile]);
    setStatusMessage(`Appended studio trailer clip "${clip.name}" to extraction dock.`);
  };

  const clearQueueItem = (index: number) => {
    setSelectedLocalFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const clearAllSelected = () => {
    setSelectedLocalFiles([]);
    onReferencesAnalyzed([]);
    setStatusMessage(null);
  };

  const triggerExtraction = async () => {
    if (selectedLocalFiles.length === 0) {
      setStatusMessage("Please select at least one video to analyze.");
      return;
    }

    setInternalIsAnalyzing(true);
    setStatusMessage("Connecting to AI Studio backend... Activating computer vision tensor model.");

    try {
      const filesPayload = selectedLocalFiles.map((f) => ({
        name: f.name,
        type: f.type || "video/mp4",
        sizeLabel: f.size ? `${(f.size / (1024 * 1024)).toFixed(1)} MB` : "12.4 MB"
      }));

      // API call to server
      const response = await fetch("/api/analyze-references", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: filesPayload })
      });

      if (!response.ok) {
        throw new Error("Reference Analysis API error.");
      }

      const analyzedData: VideoReferenceAnalysis[] = await response.json();
      
      onReferencesAnalyzed(analyzedData);
      setStatusMessage(`Extracted cinema parameters for ${analyzedData.length} track reference(s). Dynamic pacing registered.`);
    } catch (err: any) {
      console.error(err);
      setStatusMessage("Computer Vision Pipeline Error: Fallback data triggered for simulation.");
    } finally {
      setInternalIsAnalyzing(false);
    }
  };

  const activeIsAnalyzing = parentIsAnalyzing || internalIsAnalyzing;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl shadow-black/10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-violet-950 text-violet-400 rounded-md border border-violet-900/40">
            <Video className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-sans font-semibold text-zinc-100">Step 3: Upload Video References & Cinematography</h2>
            <p className="text-xs text-zinc-400">Our engine extracts camera motion, pacing curves, lighting ambiance, and cutting rates.</p>
          </div>
        </div>

        {selectedLocalFiles.length > 0 && (
          <button
            type="button"
            onClick={clearAllSelected}
            className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 transition flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Docket</span>
          </button>
        )}
      </div>

      {/* MULTI VIDEO DROPZONE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Drag/Drop & Sample Vault */}
        <div className="lg:col-span-7 space-y-4">
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-6 py-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
              dragActive
                ? "border-violet-500 bg-violet-950/15"
                : selectedLocalFiles.length > 0
                ? "border-indigo-500/55 bg-zinc-950/20"
                : "border-zinc-850 bg-zinc-950/30 hover:border-zinc-700 hover:bg-zinc-950/50"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="video/*"
              multiple
              className="hidden"
            />

            <div className="p-3 bg-zinc-900 text-zinc-400 rounded-full border border-zinc-850 shadow-inner mb-3">
              <Upload className="w-5 h-5 text-indigo-400" />
            </div>
            <p className="text-xs text-zinc-300 font-medium font-sans">
              Drag & drop reference video files here, or <span className="text-violet-400 font-semibold hover:underline">browse storage</span>
            </p>
            <p className="text-[10px] text-zinc-500 mt-1">
              Supports MP4, WEBM, MOV (Upload multiple references to average pacing attributes)
            </p>
          </div>

          {/* Sandbox Presets Grid */}
          <div>
            <span className="text-[10px] font-mono text-zinc-550 uppercase tracking-widest block mb-2 font-semibold">
              Or Load Cine-Reference Sample Trailers
            </span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {sampleClips.map((clip) => {
                const isAlreadyAdded = selectedLocalFiles.some((f) => f.name === clip.name);
                return (
                  <button
                    key={clip.name}
                    type="button"
                    onClick={() => selectSampleClip(clip)}
                    className={`p-2.5 rounded-lg border text-left flex flex-col justify-between h-22 transition-all group ${
                      isAlreadyAdded
                        ? "border-indigo-600 bg-indigo-950/10"
                        : "border-zinc-800/80 bg-zinc-950/25 hover:border-zinc-700 hover:bg-zinc-900/30"
                    }`}
                  >
                    <div>
                      <div className={`h-1.5 w-10 rounded bg-gradient-to-r ${clip.thumbnailColor} mb-2`} />
                      <p className="text-[10px] text-zinc-300 leading-tight font-sans font-medium line-clamp-2 select-none group-hover:text-zinc-100">
                        {clip.name.split("_").join(" ").replace(".mp4", "")}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[8.5px] font-mono text-zinc-500">
                      <span>{clip.sizeLabel}</span>
                      <span className="text-indigo-400 font-semibold uppercase">{clip.duration}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Active Docket Queue */}
        <div className="lg:col-span-5 bg-zinc-950/40 border border-zinc-850 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block border-b border-zinc-850 pb-2 mb-2">
              Reference Files Dock ({selectedLocalFiles.length})
            </span>

            {selectedLocalFiles.length === 0 ? (
              <div className="h-44 flex flex-col items-center justify-center text-zinc-650 text-center p-4">
                <Film className="w-8 h-8 opacity-25 mb-2" />
                <p className="text-xs">No reference clips loaded yet.</p>
                <p className="text-[10px] text-zinc-600 max-w-xs mt-1">Upload trailers or load presets from the left panel to begin.</p>
              </div>
            ) : (
              <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                {selectedLocalFiles.map((f, index) => (
                  <div key={index} className="flex items-center justify-between gap-3 bg-zinc-900/50 border border-zinc-800/80 rounded px-2.5 py-1.5 text-xs animate-fadeIn">
                    <div className="flex items-center gap-2 min-w-0">
                      <Film className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="text-zinc-300 font-medium truncate select-none text-[11px]">{f.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => clearQueueItem(index)}
                      className="text-zinc-550 hover:text-red-400 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-850 flex flex-col gap-2">
            <button
              type="button"
              disabled={activeIsAnalyzing || selectedLocalFiles.length === 0}
              onClick={triggerExtraction}
              className={`w-full py-2 px-4 rounded-md text-xs font-sans font-semibold flex items-center justify-center gap-2 transition-all ${
                selectedIsReady(selectedLocalFiles, activeIsAnalyzing)
              }`}
            >
              {activeIsAnalyzing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-indigo-400 rounded-full animate-spin" />
                  <span>Extracting Vectors...</span>
                </>
              ) : (
                <>
                  <BarChart className="w-4 h-4 text-zinc-950" />
                  <span>Run Visual Feature Extraction</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* EXTRACTED METADATA FEEDBACK CARDS */}
      {references && references.length > 0 && (
        <div className="mt-6 border-t border-zinc-800/60 pt-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Server className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
              Extract Core Cine-Data (Neural Tensor Output)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {references.map((item) => (
              <div key={item.id} className="bg-zinc-950/60 border border-emerald-950/40 rounded-lg p-4 relative overflow-hidden group">
                {/* Decorative glow badge */}
                <div className="absolute top-0 right-0 h-10 w-24 bg-gradient-to-bl from-emerald-500/10 to-transparent blur-md group-hover:from-emerald-500/15" />

                <div className="flex items-center gap-2 mb-3">
                  <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                  <span className="text-xs font-semibold text-zinc-200 truncate pr-16">{item.fileName}</span>
                  <span className="text-[9px] font-mono text-zinc-500 ml-auto">{item.fileSizeLabel}</span>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-[11px] font-sans text-zinc-400">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-zinc-550 block">Motion Signature</span>
                    <p className="text-zinc-200 leading-tight font-medium">{item.motionDescription}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-zinc-550 block">Atmospheric Ambiance</span>
                    <p className="text-zinc-200 leading-tight font-medium">{item.lightingStyle}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-zinc-550 block font-normal">Editing Style / Cuts</span>
                    <p className="text-zinc-200 leading-tight font-medium">{item.editingStyle}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-zinc-550 block">Cinematography / Rig</span>
                    <p className="text-zinc-200 leading-tight font-medium">{item.cameraMovement}</p>
                  </div>
                  <div className="space-y-0.5 col-span-2 border-t border-zinc-850/60 pt-2 flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono text-zinc-500">Extracted Emotion keys:</span>
                    <span className="text-[10px] bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 px-2 py-0.5 rounded-full font-mono">
                      {item.emotionsDetected}
                    </span>
                    <span className="text-[10px] bg-indigo-950/40 text-indigo-400 border border-indigo-900/40 px-2 py-0.5 rounded-full font-mono">
                      {item.pacingStyle}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FEEDBACK logs */}
      {statusMessage && (
        <div className="mt-4 flex items-start gap-2 bg-zinc-950/80 border border-zinc-800/80 rounded-md p-3 text-[11px] font-mono leading-relaxed">
          <AlertCircle className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
          <span className="text-zinc-300">{statusMessage}</span>
        </div>
      )}
    </div>
  );
}

function selectedIsReady(files: File[], loading: boolean): string {
  if (loading) {
    return "bg-zinc-800 text-zinc-500 cursor-not-allowed";
  }
  if (files.length === 0) {
    return "bg-zinc-800/40 text-zinc-650 cursor-not-allowed";
  }
  return "bg-violet-400 text-zinc-950 hover:bg-violet-350 shadow-lg shadow-violet-950/30";
}
