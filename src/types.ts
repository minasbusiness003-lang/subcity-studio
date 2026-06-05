export enum VideoStyle {
  Anime = "Anime",
  Realistic = "Realistic",
  LiveAction = "Live-Action",
  Action = "Action",
  Romance = "Romance",
  SciFi = "Sci-Fi",
  Cyberpunk = "Cyberpunk",
  Fantasy = "Fantasy",
  Retro = "Retro / Vintage",
  Cinematic = "Cinematic"
}

export interface MusicAnalysis {
  pacing: string; // Fast, Medium, Slow, Dynamic
  tempo: number; // BPM estimate
  instrumentation: string[];
  keyMood: string;
  energyCurve: string; // Description of energy shifts
  emotionalTriggers: string[];
  suggestedTransitionSpeed: string; // e.g., "rapid crosscuts on snare hits"
  thematicSegments: string[];
}

export interface VideoReferenceAnalysis {
  id: string;
  fileName: string;
  mimeType: string;
  fileSizeLabel: string;
  motionDescription: string;
  emotionsDetected: string;
  pacingStyle: string;
  lightingStyle: string;
  transitionsStyle: string;
  cameraMovement: string;
  editingStyle: string;
}

export interface VideoClip {
  id: string;
  clipNumber: number; // 1 to 4
  timeStart: number; // in seconds
  timeEnd: number; // in seconds
  title: string;
  visualPrompt: string;
  motionIntensity: number; // 1-10 scale
  colorPalette: string[];
  lightingMood: string;
  cameraPath: string; // Description like "Slow zoom to close-up"
  transitionIn: string; // Cut, Dissolve, Wipe, Zoom-in
  subtitles: string;
  ambientCues: string; // SFX advice matching music
  // Representing simulated frame animations or images
  frameDescription: string;
  cssFilter: string; // CSS Filter representation for simulated preview style
  svgFrameSeed: string; // Dynamic path seed or generative instruction for canvas
}

export interface StoryboardProject {
  id: string;
  projectName: string;
  styles: VideoStyle[];
  musicDetails: {
    fileName: string;
    lyrics?: string;
    duration: number; // in seconds
  };
  musicAnalysis?: MusicAnalysis;
  references: VideoReferenceAnalysis[];
  masterPrompt: string;
  clips: VideoClip[];
  createdAt: string;
}

export interface CreditTransaction {
  id: string;
  projectName: string;
  timestamp: string;
  type: "synthesis" | "render" | "analysis" | "topup";
  description: string;
  amount: number; // e.g. -15 or +100
}

export interface UserProfile {
  email: string;
  displayName: string;
  photoURL: string;
  uid: string;
}

