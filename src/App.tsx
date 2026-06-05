import { useState, useEffect } from "react";
import { 
  MusicAnalysis, 
  VideoReferenceAnalysis, 
  StoryboardProject, 
  VideoStyle, 
  VideoClip,
  CreditTransaction,
  UserProfile 
} from "./types";
import Header from "./components/Header";
import MusicUploader from "./components/MusicUploader";
import StyleSelector from "./components/StyleSelector";
import VideoReferences from "./components/VideoReferences";
import StoryboardView from "./components/StoryboardView";
import YourStudio from "./components/YourStudio";
import AboutUs from "./components/AboutUs";
import Contact from "./components/Contact";
import { AlertCircle, PlusCircle, Trash2, FolderOpen, Video, Music, CheckCircle, Info, Sparkles, Wand2 } from "lucide-react";

export default function App() {
  const [apiStatus, setApiStatus] = useState<boolean>(false);
  const [projectName, setProjectName] = useState<string>("Cyberpunk Odyssey Mix");
  const [selectedStyles, setSelectedStyles] = useState<VideoStyle[]>([VideoStyle.Anime, VideoStyle.Cyberpunk]);
  
  // Navigation
  const [activeTab, setActiveTab] = useState<string>("Home");

  // Google User Session State - Loaded from local storage if existing
  const [user, setUser] = useState<UserProfile | null>(() => {
    const cached = localStorage.getItem("subcity_user");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Credit Tracking States
  const [remainingCredits, setRemainingCredits] = useState<number>(() => {
    const cached = localStorage.getItem("subcity_remaining_credits");
    return cached ? parseInt(cached, 10) : 75;
  });

  const [totalCredits, setTotalCredits] = useState<number>(() => {
    const cached = localStorage.getItem("subcity_total_credits");
    return cached ? parseInt(cached, 10) : 120;
  });

  const [usedCredits, setUsedCredits] = useState<number>(() => {
    const cached = localStorage.getItem("subcity_used_credits");
    return cached ? parseInt(cached, 10) : 45;
  });

  const [transactions, setTransactions] = useState<CreditTransaction[]>(() => {
    const cached = localStorage.getItem("subcity_transactions");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }
    return [
      {
        id: "tx_init_1",
        projectName: "Subcity Boi Neon Cyberpunk Grid",
        timestamp: new Date(Date.now() - 36000000).toISOString(),
        type: "analysis",
        description: "Dynamic soundwave audio analysis",
        amount: -15,
      },
      {
        id: "tx_init_2",
        projectName: "Subcity Boi Neon Cyberpunk Grid",
        timestamp: new Date(Date.now() - 18000000).toISOString(),
        type: "synthesis",
        description: "Cinematography reference dissection",
        amount: -15,
      },
      {
        id: "tx_init_3",
        projectName: "Subcity Boi Neon Cyberpunk Grid",
        timestamp: new Date(Date.now() - 9000000).toISOString(),
        type: "render",
        description: "Storyboard sequence render",
        amount: -15,
      },
    ];
  });

  // Track parameters
  const [trackName, setTrackName] = useState<string>("");
  const [lyrics, setLyrics] = useState<string>("");
  const [musicAnalysis, setMusicAnalysis] = useState<MusicAnalysis | undefined>(undefined);
  const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);


  // References
  const [references, setReferences] = useState<VideoReferenceAnalysis[]>([]);

  // Generated Projects
  const [projectsList, setProjectsList] = useState<StoryboardProject[]>([]);
  const [activeProject, setActiveProject] = useState<StoryboardProject | null>(null);

  // Load states
  const [isMusicAnalyzing, setIsMusicAnalyzing] = useState(false);
  const [isRefAnalyzing, setIsRefAnalyzing] = useState(false);
  const [isStoryboardGenerating, setIsStoryboardGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Persist credits and transactions context
  useEffect(() => {
    localStorage.setItem("subcity_remaining_credits", remainingCredits.toString());
  }, [remainingCredits]);

  useEffect(() => {
    localStorage.setItem("subcity_total_credits", totalCredits.toString());
  }, [totalCredits]);

  useEffect(() => {
    localStorage.setItem("subcity_used_credits", usedCredits.toString());
  }, [usedCredits]);

  useEffect(() => {
    localStorage.setItem("subcity_transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Handle Google Sign-in action
  const handleLogin = () => {
    const mockUser: UserProfile = {
      email: "minasbusiness003@gmail.com",
      displayName: "Minas Business",
      photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
      uid: "minas_business_user_001"
    };
    setUser(mockUser);
    localStorage.setItem("subcity_user", JSON.stringify(mockUser));
    setStatusMessage("Successfully signed up with Google as minasbusiness003@gmail.com! Welcomed to Subcity Boi World Studio.");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("subcity_user");
    setStatusMessage("Successfully signed out. Switched back to guest mode.");
  };

  const handleAddCredits = (amount: number) => {
    setTotalCredits(prev => prev + amount);
    setRemainingCredits(prev => prev + amount);
    
    const topUpTx: CreditTransaction = {
      id: `tx_${Date.now()}`,
      projectName: "Simulated Wallet Inflow",
      timestamp: new Date().toISOString(),
      type: "topup",
      description: "Google Pay Simulated Balance Top-up",
      amount: amount
    };
    setTransactions(prev => [...prev, topUpTx]);
    setStatusMessage(`Added +${amount} credits to your Subcity Boi active wallet.`);
  };

  // Perform startup checks and load cache from localStorage
  useEffect(() => {
    // 1. Fetch backend health to detect Gemini credentials
    const checkHealth = async () => {
      try {
        const response = await fetch("/api/health");
        const data = await response.json();
        setApiStatus(!!data.geminiConnected);
      } catch (e) {
        setApiStatus(false);
      }
    };
    checkHealth();

    // 2. Load projects cache or initialize with a premium simulation project
    const cachedProjects = localStorage.getItem("subcity_boi_projects");
    if (cachedProjects) {
      try {
        const parsed = JSON.parse(cachedProjects);
        if (parsed && parsed.length > 0) {
          setProjectsList(parsed);
          setActiveProject(parsed[0]);
          restoreProjectSettings(parsed[0]);
          return;
        }
      } catch (err) {
        console.error("Cache parsing error:", err);
      }
    }

    // Initialize with a beautiful built-in Cinematic Sandbox project to maximize initial presentation value
    initializeSampleProject();
  }, []);

  const initializeSampleProject = () => {
    const sampleProj: StoryboardProject = {
      id: "sample_project_id",
      projectName: "Subcity Boi Neon Cyberpunk Grid",
      styles: [VideoStyle.Anime, VideoStyle.Cyberpunk],
      musicDetails: {
        fileName: "Subcity Cyberpunk Neon Grid.wav",
        lyrics: "Red lasers reflect on wet concrete streets\nHolographic screens illuminate the skies\nWe run the grid under synthetic sheets\nNeon souls dancing to electric cries...",
        duration: 60
      },
      musicAnalysis: {
        pacing: "Fast Dynamic",
        tempo: 125,
        instrumentation: ["Strobe Sub Kick", "808 Claps", "Synthesizer Lead", "Glitch Plucks"],
        keyMood: "Cyberpunk Action / Cyber-Euphoric",
        energyCurve: "Starts with electronic plucks building to high velocity synthesizer strobe kicks, peak performance drops, smooth spatial fading synthesizer exit.",
        emotionalTriggers: ["Confidence", "Rebellion", "High Action"],
        suggestedTransitionSpeed: "Rapid whip panning cuts on kick drums",
        thematicSegments: [
          "0:00 - Intro: Cinematic ambient laser drones",
          "0:15 - Verse 1: Sharp kick drum kicks in",
          "0:30 - Chorus Peaks: Neon synth drops",
          "0:45 - Outro Bridge: Heavy synthesizer tones fading"
        ]
      },
      references: [
        {
          id: "ref_cyber_1",
          fileName: "Cyberpunk_Streets_Rain_Drone_8K.mp4",
          mimeType: "video/mp4",
          fileSizeLabel: "12.4 MB",
          motionDescription: "Floating drone lateral gliding, orbital sweeps",
          lightingStyle: "Neon lighting reflecting off dark wet pathways",
          transitionsStyle: "Whip pan cuts and geometric masks",
          cameraMovement: "Drone glide following lower horizon paths",
          editingStyle: "Highly saturated futuristic color grading",
          emotionsDetected: "Awe / High Tension",
          pacingStyle: "Accelerating speed cuts"
        }
      ],
      masterPrompt: "A continuous 60-second music video in high-fidelity Anime and Cyberpunk style, dynamically modulated on a 125 BPM tempo grid derived from song \"Subcity Cyberpunk Neon Grid.wav\". Storyboard flow blends reference cinematography with a customized visual storyline.",
      clips: [], // will synthesize on startup or on demand
      createdAt: new Date().toISOString()
    };

    // Synthesize mock clips for sample:
    const clipsList: VideoClip[] = [
      {
        id: "clip_sample_1",
        clipNumber: 1,
        timeStart: 0,
        timeEnd: 15,
        title: "I. The Digital Sunset Horizon",
        visualPrompt: "A gorgeous cyber-anime style illustration depicting towering dark megacity skyscrapers. Glowing holographic pink and cyan billboards loom over streets of rain-slicked concrete. Neon light refracts off wet water pools.",
        motionIntensity: 4,
        colorPalette: ["#120224", "#cc00aa", "#ff0055", "#00ff33"],
        lightingMood: "Vibrant high-contrast key lighting with flashing laser flares",
        cameraPath: "Slow sliding tracking camera pushing forwards",
        transitionIn: "Fade In (Start)",
        subtitles: "[Intro Ambient] \"Red lasers reflect on wet concrete streets\"",
        ambientCues: "Soft spatial ambient synth pads triggering quiet holographic ripples",
        frameDescription: "Gigantic neon fish holographic billboards glowing in anime style",
        cssFilter: "brightness-105 saturate-150 contrast-120",
        svgFrameSeed: "sky:#0b001a; lasers:cyan; circle_ring:magenta; character:gold"
      },
      {
        id: "clip_sample_2",
        clipNumber: 2,
        timeStart: 15,
        timeEnd: 30,
        title: "II. Strobe Grid Activation",
        visualPrompt: "Frenzied energetic zoom passing through floating computing grids. Dynamic fast speed-lines expand diagonally as cybernetic drones slice through skyscrapers, tracking laser guidance rays.",
        motionIntensity: 8,
        colorPalette: ["#021b18", "#00ffd0", "#ffffff", "#ff8800"],
        lightingMood: "Fast strobe pulse neon bursts",
        cameraPath: "Extreme kinetic tracking shot trailing high-speed flight paths",
        transitionIn: "Dynamic Whip-Cut",
        subtitles: "[Verse Section] \"Holographic screens illuminate the skies\"",
        ambientCues: "Triple hat rolls triggering high energy strobe light flares",
        frameDescription: "Speeding racing trails passing through geometric cyber lines",
        cssFilter: "hue-rotate-15 contrast-125 saturate-140",
        svgFrameSeed: "field:#050510; lasers:gold; fast_speed_lines:cyan; circle_ring:#ff0033"
      },
      {
        id: "clip_sample_3",
        clipNumber: 3,
        timeStart: 30,
        timeEnd: 45,
        title: "III. The Core Resonance Drop",
        visualPrompt: "A breathtaking core performance scene. Massive visual shockwave expanding outwards from a circular master crystal generator structure. Laser rings cascade and explode with particles, syncing with maximum sound peak.",
        motionIntensity: 10,
        colorPalette: ["#110000", "#ff0055", "#ffffff", "#e0f2fe"],
        lightingMood: "Cinematic volumetric blinding white spotlights",
        cameraPath: "360 degree high vertical rotating orbit sweep",
        transitionIn: "Lens Flare Dissolve",
        subtitles: "[Chorus Peak] \"We run the grid under synthetic sheets\"",
        ambientCues: "Wobble bass waves generating screen rumble motion lines",
        frameDescription: "High action massive core exploding with geometric lasers",
        cssFilter: "contrast-145 saturate-135 hue-rotate-320",
        svgFrameSeed: "cloud:#110022; main_blast:#00ffff; shockwave:#ff00aa; stars:white"
      },
      {
        id: "clip_sample_4",
        clipNumber: 4,
        timeStart: 45,
        timeEnd: 60,
        title: "IV. Neon Dawn Fade Out",
        visualPrompt: "A peaceful dark atmospheric exit. The rain stops, giving way to a starry deep indigo sky. Fading silhouette of the city grid reflecting soft ambient twilight rays as drone batteries slowly fade into passive low-power mode.",
        motionIntensity: 2,
        colorPalette: ["#030510", "#1a1a2e", "#778899", "#aabbcc"],
        lightingMood: "Soft low-contrast twilight backdrop light",
        cameraPath: "Slow mechanical backward crane exit dissolving inside black frames",
        transitionIn: "Soft Fade to Dark",
        subtitles: "[Outro Silence] \"Neon souls dancing to electric cries...\"",
        ambientCues: "Fading reverb trails filtering out bright light particles",
        frameDescription: "Quiet dark cityscape silhouettes under starry night skies",
        cssFilter: "brightness-85 contrast-95 saturate-75 grayscale-30",
        svgFrameSeed: "night_valley:#080811; distant_glow:#ff8800; slow_stars:white; fog:#222a3a"
      }
    ];

    sampleProj.clips = clipsList;
    setProjectsList([sampleProj]);
    setActiveProject(sampleProj);
    restoreProjectSettings(sampleProj);

    // Save initial load
    localStorage.setItem("subcity_boi_projects", JSON.stringify([sampleProj]));
  };

  const restoreProjectSettings = (proj: StoryboardProject) => {
    setProjectName(proj.projectName);
    setSelectedStyles(proj.styles);
    setTrackName(proj.musicDetails.fileName);
    setLyrics(proj.musicDetails.lyrics || "");
    setMusicAnalysis(proj.musicAnalysis);
    setReferences(proj.references);
  };

  const handleMusicAnalyzed = (fileName: string, songLyrics: string, analysis: MusicAnalysis, soundUrl?: string) => {
    setTrackName(fileName);
    setLyrics(songLyrics);
    setMusicAnalysis(analysis);
    if (soundUrl) setAudioUrl(soundUrl);

    // Auto-update active project
    if (activeProject) {
      const updated = {
        ...activeProject,
        musicDetails: {
          fileName,
          lyrics: songLyrics,
          duration: 60
        },
        musicAnalysis: analysis
      };
      updateProjectInList(updated);
    }
  };

  const handleReferencesAnalyzed = (refs: VideoReferenceAnalysis[]) => {
    setReferences(refs);

    // Auto-update active project
    if (activeProject) {
      const updated = {
        ...activeProject,
        references: refs
      };
      updateProjectInList(updated);
    }
  };

  const handleGenerateStoryboard = async () => {
    if (selectedStyles.length === 0) {
      setStatusMessage("Error: You must choose at least one Video Art Style first.");
      return;
    }
    if (references.length === 0) {
      setStatusMessage("Error: Please load or upload at least one Video Reference.");
      return;
    }

    // Check credits if logged in
    if (user && remainingCredits < 15) {
      setStatusMessage("Error: Insufficient credits. Visit Your Studio to top up your balance securely.");
      setActiveTab("Your Studio");
      return;
    }

    setIsStoryboardGenerating(true);
    setStatusMessage("Synthesizing references with music beat variables...");

    try {
      const payload = {
        styles: selectedStyles,
        musicDetails: {
          fileName: trackName || "Unknown Track",
          lyrics,
          duration: 60
        },
        musicAnalysis,
        references
      };

      const response = await fetch("/api/generate-storyboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Server synthesis error.");
      }

      const responseData = await response.json();

      const newProject: StoryboardProject = {
        id: activeProject?.id ? activeProject.id : `proj_${Date.now()}`,
        projectName: projectName || "My Visual Sync Project",
        styles: selectedStyles,
        musicDetails: {
          fileName: trackName,
          lyrics,
          duration: 60
        },
        musicAnalysis,
        references,
        masterPrompt: responseData.masterPrompt,
        clips: responseData.clips,
        createdAt: activeProject?.createdAt || new Date().toISOString()
      };

      // Subtraction of credits live
      if (user) {
        setRemainingCredits(prev => Math.max(0, prev - 15));
        setUsedCredits(prev => prev + 15);
        const synthTx: CreditTransaction = {
          id: `tx_${Date.now()}`,
          projectName: projectName || "My Visual Sync Project",
          timestamp: new Date().toISOString(),
          type: "synthesis",
          description: "MVM Storyboard Continuous Grid Render",
          amount: -15
        };
        setTransactions(prev => [...prev, synthTx]);
      }

      updateProjectInList(newProject);
      setStatusMessage("Storyboard synthesized successfully! Launching interactive sequence player.");
    } catch (err) {
      console.error(err);
      setStatusMessage("Platform Warning: Storyboard mapping computed with local fallback presets.");
    } finally {
      setIsStoryboardGenerating(false);
    }
  };


  const updateProjectInList = (updatedProj: StoryboardProject) => {
    setActiveProject(updatedProj);
    const updatedList = projectsList.map((p) => (p.id === updatedProj.id ? updatedProj : p));
    
    // In case this is a entirely new project not in list:
    if (!updatedList.some((p) => p.id === updatedProj.id)) {
      updatedList.push(updatedProj);
    }

    setProjectsList(updatedList);
    localStorage.setItem("subcity_boi_projects", JSON.stringify(updatedList));
  };

  const createNewEmptyProject = () => {
    const emptyProj: StoryboardProject = {
      id: `proj_${Date.now()}`,
      projectName: `Collaboration Mix #${projectsList.length + 1}`,
      styles: [],
      musicDetails: {
        fileName: "",
        lyrics: "",
        duration: 60
      },
      references: [],
      masterPrompt: "",
      clips: [],
      createdAt: new Date().toISOString()
    };

    const nextList = [...projectsList, emptyProj];
    setProjectsList(nextList);
    setActiveProject(emptyProj);
    
    // reset editor states
    setProjectName(emptyProj.projectName);
    setSelectedStyles([]);
    setTrackName("");
    setLyrics("");
    setMusicAnalysis(undefined);
    setReferences([]);
    setAudioUrl(undefined);

    localStorage.setItem("subcity_boi_projects", JSON.stringify(nextList));
    setStatusMessage("Initialized a clean, blank production workspace.");
  };

  const deleteProject = (id: string, e: any) => {
    e.stopPropagation();
    const nextList = projectsList.filter((p) => p.id !== id);
    setProjectsList(nextList);

    if (nextList.length > 0) {
      setActiveProject(nextList[0]);
      restoreProjectSettings(nextList[0]);
    } else {
      initializeSampleProject();
    }

    localStorage.setItem("subcity_boi_projects", JSON.stringify(nextList));
    setStatusMessage("Deleted project session completed successfully.");
  };

  const handleSelectProject = (proj: StoryboardProject) => {
    setActiveProject(proj);
    restoreProjectSettings(proj);
    setStatusMessage(`Restored workspace context for: ${proj.projectName}`);
  };

  const updateClipPrompt = (clipId: string, updatedPrompt: string) => {
    if (!activeProject) return;

    const modifiedClips = activeProject.clips.map((clip) => 
      clip.id === clipId ? { ...clip, visualPrompt: updatedPrompt } : clip
    );

    const updatedProj = { ...activeProject, clips: modifiedClips };
    updateProjectInList(updatedProj);
  };

  const updateMasterPromptText = (text: string) => {
    if (!activeProject) return;
    const updatedProj = { ...activeProject, masterPrompt: text };
    updateProjectInList(updatedProj);
  };

  const handleProjectNameChange = (newName: string) => {
    setProjectName(newName);
    if (activeProject) {
      const updated = { ...activeProject, projectName: newName };
      updateProjectInList(updated);
    }
  };

  return (
    <div id="app-root" className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-cyan-900 selection:text-cyan-200">
      <Header 
        apiStatus={apiStatus} 
        projectName={projectName} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        remainingCredits={remainingCredits}
      />

      {/* SUB-HEADER workspace navigation only visible on Home or Your Studio when relevant */}
      {activeTab === "Home" && (
        <div className="bg-zinc-900/40 border-b border-zinc-800/85 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest font-semibold block shrink-0">
              Active Project:
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => handleProjectNameChange(e.target.value)}
              className="text-sm font-sans font-semibold bg-zinc-950/60 border border-zinc-800 rounded px-3 py-1 text-zinc-200 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-650 max-w-[240px] truncate"
              placeholder="Odyssey Cinematic Mix..."
            />
          </div>

          {/* WORKSPACE PRESET SAVES BAR */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-zinc-550 mr-1 hidden sm:inline">SAVED SESSIONS:</span>
            
            <div className="flex items-center gap-1.5 flex-wrap">
              {projectsList.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleSelectProject(p)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs cursor-pointer border transition-all ${
                    activeProject?.id === p.id
                      ? "bg-zinc-800 text-cyan-400 border-zinc-700/80 font-medium"
                      : "bg-zinc-950/40 text-zinc-400 border-zinc-850 hover:bg-zinc-900 hover:text-zinc-200"
                  }`}
                >
                  <FolderOpen className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate max-w-[110px] sm:max-w-[140px] select-none">{p.projectName}</span>
                  
                  {projectsList.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => deleteProject(p.id, e)}
                      className="text-zinc-500 hover:text-red-400 pl-1 p-0.5"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={createNewEmptyProject}
                className="p-1 px-2.5 rounded bg-indigo-950/50 hover:bg-indigo-900 text-indigo-400 border border-indigo-900/60 text-xs font-semibold flex items-center gap-1 transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Mix</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* TAB dispatcher */}
        {activeTab === "Home" && (
          <div className="space-y-8 animate-fadeIn">
            {/* UPPER BANNER EXPLAINING FLOW */}
            <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-indigo-950/20 border border-zinc-850 p-5 rounded-xl flex flex-col md:flex-row gap-5 items-start md:items-center">
              <div className="p-3 bg-indigo-950/60 text-indigo-400 border border-indigo-900/45 rounded-lg shrink-0">
                <Video className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-1.5">
                    <span>The Storyboard Synthesis Workflow</span>
                    <span className="text-[10px] bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 px-2 py-0.5 rounded font-mono font-normal">SaaS Suite</span>
                  </h2>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans max-w-4xl">
                  Upload your soundtrack audio and load reference trailers. Our platform’s machine vision algorithms dissect complex cinematography values (handheld shakes, dynamic whip cuts, lighting hues) to generate precise storytelling matrices and four beautifully timed 15-second keyframe clips.
                </p>
              </div>
            </div>

            {/* THREE CORE INPUT SEGMENTS (STEP 1, 2, 3) */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
              
              {/* STEP 1: MUSIC EXCHANGER */}
              <MusicUploader 
                onAnalysisComplete={handleMusicAnalyzed}
                isAnalyzing={isMusicAnalyzing}
                currentTrackName={trackName}
              />

              {/* DYNAMIC MUSIC METRICS CARD */}
              {musicAnalysis && (
                <div className="bg-zinc-950/40 border border-cyan-950/40 p-5 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-6 animate-fadeIn">
                  <div className="border-r border-zinc-850/60 pr-4 space-y-1">
                    <span className="text-[9.5px] font-mono text-zinc-500 uppercase tracking-widest block font-semibold">Sonic Pacing Grid</span>
                    <span className="text-lg font-bold text-cyan-400 font-sans">{musicAnalysis.pacing}</span>
                    <p className="text-[11px] text-zinc-500">Grid timeline matched to {musicAnalysis.tempo} BPM.</p>
                  </div>

                  <div className="border-r border-zinc-850/60 pr-4 space-y-1">
                    <span className="text-[9.5px] font-mono text-zinc-500 uppercase tracking-widest block font-semibold">Dominant Key Mood</span>
                    <span className="text-lg font-bold text-zinc-200 font-sans leading-tight block">{musicAnalysis.keyMood}</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {musicAnalysis.emotionalTriggers.map((trig, idx) => (
                        <span key={idx} className="text-[9px] bg-zinc-900 text-zinc-400 px-1.5 py-0.5 rounded font-mono">
                          {trig}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-r border-zinc-850/60 pr-4 space-y-1.5 md:col-span-2">
                    <span className="text-[9.5px] font-mono text-zinc-500 uppercase tracking-widest block font-semibold">Energy Progression Cycle</span>
                    <p className="text-xs text-zinc-350 leading-relaxed font-medium">
                      {musicAnalysis.energyCurve}
                    </p>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      Sync cue: <span className="text-cyan-400/80">{musicAnalysis.suggestedTransitionSpeed}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: STYLES DICTIONARY */}
              <StyleSelector 
                selectedStyles={selectedStyles}
                onChange={setSelectedStyles}
              />

              {/* STEP 3: SCREENPLAY REFERENCE ARCHIVES */}
              <VideoReferences 
                references={references}
                onReferencesAnalyzed={handleReferencesAnalyzed}
                isAnalyzing={isRefAnalyzing}
              />

            </div>

            {/* WORKSPACE PREPARATION HEALTH-CHECK COMPONENT */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-lg">
              <div className="space-y-1">
                <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                  <span>Mix Status Check</span>
                </h3>
                
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-sans mt-2">
                  <span className="flex items-center gap-1 text-zinc-300">
                    <span className={`w-2 h-2 rounded-full ${trackName ? "bg-emerald-400" : "bg-zinc-700"}`} />
                    <span>Track: {trackName ? <span className="text-emerald-400 font-medium truncate max-w-[120px] inline-block pt-1 align-top">{trackName}</span> : "Awaiting Upload"}</span>
                  </span>
                  <span className="flex items-center gap-1 text-zinc-300">
                    <span className={`w-2 h-2 rounded-full ${selectedStyles.length > 0 ? "bg-emerald-400" : "bg-zinc-700"}`} />
                    <span>Styles: {selectedStyles.length > 0 ? <span className="text-emerald-400 font-semibold">{selectedStyles.length} Selected</span> : "Awaiting Selection"}</span>
                  </span>
                  <span className="flex items-center gap-1 text-zinc-300">
                    <span className={`w-2 h-2 rounded-full ${references.length > 0 ? "bg-emerald-400" : "bg-zinc-700"}`} />
                    <span>Cinematography: {references.length > 0 ? <span className="text-emerald-400 font-semibold">{references.length} Extracted</span> : "Awaiting References"}</span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled={isStoryboardGenerating || selectedStyles.length === 0 || references.length === 0}
                onClick={handleGenerateStoryboard}
                className={`px-6 py-3 rounded-lg text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                  isStoryboardGenerating
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    : selectedStyles.length === 0 || references.length === 0
                    ? "bg-zinc-800/40 text-zinc-650 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-950/40 hover:-translate-y-0.5"
                }`}
              >
                {isStoryboardGenerating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-zinc-500 border-t-cyan-400 rounded-full animate-spin" />
                    <span>Synthesizing Continuities...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 text-white" />
                    <span>Synthesize Storyboard Grid</span>
                  </>
                )}
              </button>
            </div>

            {/* STEP 4: GENERATED STORYBOARD PACKAGE DISPLAY */}
            {activeProject && (
              <StoryboardView 
                project={activeProject}
                isGenerating={isStoryboardGenerating}
                onGenerateStoryboard={handleGenerateStoryboard}
                onUpdateClipPrompt={updateClipPrompt}
                onUpdateMasterPrompt={updateMasterPromptText}
              />
            )}
          </div>
        )}

        {activeTab === "Your Studio" && (
          <YourStudio
            user={user}
            onLogin={handleLogin}
            projects={projectsList}
            activeProject={activeProject}
            onSelectProject={(proj) => {
              handleSelectProject(proj);
              setActiveTab("Home");
            }}
            onDeleteProject={deleteProject}
            transactions={transactions}
            onAddCredits={handleAddCredits}
            remainingCredits={remainingCredits}
            totalCredits={totalCredits}
            usedCredits={usedCredits}
          />
        )}

        {activeTab === "About Us" && (
          <AboutUs />
        )}

        {activeTab === "Contact" && (
          <Contact user={user} />
        )}

        {/* LOG MESSAGES SYSTEM FOOTER */}
        {statusMessage && (
          <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-4 flex items-start gap-3 text-xs leading-relaxed max-w-4xl mx-auto shadow-inner animate-fadeIn">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="font-mono">
              <span className="text-zinc-500 uppercase font-semibold mr-1.5">[Workspace Alert]:</span>
              <span className="text-zinc-300">{statusMessage}</span>
            </div>
          </div>
        )}

      </main>

      <footer className="border-t border-zinc-900 bg-zinc-950 mt-16 py-8 px-6 text-center text-xs text-zinc-500 font-sans">
        <p>© 2026 Subcity Boi World Studio. Built on Google AI Studio.</p>
        <p className="mt-1.5 font-mono text-[10px] text-zinc-650">Continuous 4x15s Cinematic Timeline Grid Renderer Pipeline</p>
      </footer>
    </div>
  );
}

