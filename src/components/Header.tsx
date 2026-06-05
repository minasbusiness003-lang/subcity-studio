import { Sparkles, Music, Video, Terminal, Cpu, Home, Film, Info, Mail, LogIn, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { UserProfile } from "../types";

interface HeaderProps {
  apiStatus: boolean;
  projectName: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile | null;
  onLogin: () => void;
  onLogout: () => void;
  remainingCredits: number;
}

export default function Header({
  apiStatus,
  projectName,
  activeTab,
  setActiveTab,
  user,
  onLogin,
  onLogout,
  remainingCredits,
}: HeaderProps) {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.getUTCHours().toString().padStart(2, "0") +
          ":" +
          now.getUTCMinutes().toString().padStart(2, "0") +
          ":" +
          now.getUTCSeconds().toString().padStart(2, "0") +
          " UTC"
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="border-b border-zinc-800 bg-zinc-950 px-4 sm:px-6 py-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      {/* Brand & Left Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        <div 
          onClick={() => setActiveTab("Home")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="p-2.5 bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 rounded-lg text-white shadow-lg shadow-cyan-950/20 group-hover:scale-105 transition-transform">
            <Terminal className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-sans font-bold text-lg tracking-tight text-white bg-clip-text">
                SUBCITY BOI
              </h1>
              <span className="text-[10px] font-mono bg-cyan-950/60 text-cyan-400 border border-cyan-800/60 px-1.5 py-0.2 rounded uppercase tracking-widest font-semibold">
                SaaS
              </span>
            </div>
            <p className="text-[10px] text-zinc-550 font-mono tracking-wide">
              WORLD STUDIO
            </p>
          </div>
        </div>

        {/* TOP-LEFT NAVIGATION MENU */}
        <nav id="top-left-navigation" className="flex items-center gap-1 sm:border-l sm:border-zinc-800 sm:pl-6 overflow-x-auto py-1">
          <button
            id="nav-home"
            onClick={() => setActiveTab("Home")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "Home"
                ? "bg-zinc-900 text-cyan-400 font-semibold border-b border-cyan-400/30"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          <button
            id="nav-studio"
            onClick={() => setActiveTab("Your Studio")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "Your Studio"
                ? "bg-zinc-900 text-cyan-400 font-semibold border-b border-cyan-400/30"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Your Studio</span>
          </button>

          <button
            id="nav-about-us"
            onClick={() => setActiveTab("About Us")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "About Us"
                ? "bg-zinc-900 text-cyan-400 font-semibold border-b border-cyan-400/30"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>About Us</span>
          </button>

          <button
            id="nav-contact"
            onClick={() => setActiveTab("Contact")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === "Contact"
                ? "bg-zinc-900 text-cyan-400 font-semibold border-b border-cyan-400/30"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact</span>
          </button>
        </nav>
      </div>

      {/* TOP-RIGHT SECTION */}
      <div className="flex items-center flex-wrap gap-3 self-end md:self-auto text-xs">
        {/* API Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 bg-zinc-900/60 px-2.5 py-1 rounded border border-zinc-850">
          <span className={`w-1.5 h-1.5 rounded-full ${apiStatus ? "bg-emerald-400" : "bg-amber-400"}`} />
          <span className="text-[10px] text-zinc-400 font-mono">Gemini 3.5</span>
        </div>

        {/* Live system clock */}
        <div className="hidden sm:flex flex-col items-end px-3 border-r border-zinc-800 text-right">
          <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">Clock</span>
          <span className="text-[11px] text-zinc-300 font-mono">{currentTime}</span>
        </div>

        {/* GOOGLE SIGN UP / LOG IN STATUS */}
        <div id="auth-section" className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-3 bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-zinc-800">
              <div className="flex flex-col text-right">
                <span className="text-[11px] text-zinc-200 font-semibold truncate max-w-[120px]">
                  {user.displayName}
                </span>
                <span className="text-[10px] text-cyan-400 font-mono font-medium">
                  {remainingCredits} Credits
                </span>
              </div>
              <img
                src={user.photoURL}
                alt={user.displayName}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full border border-cyan-500/40 object-cover"
              />
              <button
                onClick={onLogout}
                title="Sign Out"
                className="p-1 text-zinc-500 hover:text-red-400 hover:bg-zinc-800/60 rounded transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              id="google-sign-in-btn"
              onClick={onLogin}
              className="px-3.5 py-2 rounded-lg bg-white hover:bg-zinc-100 text-zinc-950 font-sans font-bold text-xs flex items-center gap-2 shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              {/* Google Stylized Icon color matched */}
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
              <span>Sign Up with Google</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

