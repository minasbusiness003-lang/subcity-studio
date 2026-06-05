import { useState } from "react";
import { StoryboardProject, CreditTransaction, UserProfile } from "../types";
import { 
  Film, 
  Coins, 
  History, 
  PlusCircle, 
  ArrowRight, 
  Play, 
  Trash2, 
  Sparkles, 
  Key, 
  Clock, 
  Music,
  CheckCircle,
  HelpCircle,
  UserCheck
} from "lucide-react";

interface YourStudioProps {
  user: UserProfile | null;
  onLogin: () => void;
  projects: StoryboardProject[];
  activeProject: StoryboardProject | null;
  onSelectProject: (proj: StoryboardProject) => void;
  onDeleteProject: (id: string, e: any) => void;
  transactions: CreditTransaction[];
  onAddCredits: (amount: number) => void;
  remainingCredits: number;
  totalCredits: number;
  usedCredits: number;
}

export default function YourStudio({
  user,
  onLogin,
  projects,
  activeProject,
  onSelectProject,
  onDeleteProject,
  transactions,
  onAddCredits,
  remainingCredits,
  totalCredits,
  usedCredits,
}: YourStudioProps) {
  const [topUpActive, setTopUpActive] = useState(false);
  const [topUpSuccess, setTopUpSuccess] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(50);

  const triggerTopUp = () => {
    onAddCredits(selectedAmount);
    setTopUpSuccess(true);
    setTimeout(() => {
      setTopUpSuccess(false);
      setTopUpActive(false);
    }, 2000);
  };

  if (!user) {
    return (
      <div id="studio-logged-out" className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 text-center max-w-2xl mx-auto my-12 space-y-6">
        <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-cyan-500/10 to-indigo-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center text-cyan-400">
          <Film className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white tracking-tight">Your Custom Creative Studio Workspace</h2>
          <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            Register or sign up using your Google account to unlock cloud persistence, credit usage logs, and secure storage for all your synthesized storyboard sequences.
          </p>
        </div>
        
        <button
          onClick={onLogin}
          className="mx-auto px-6 py-3 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-sans font-bold text-sm flex items-center gap-2.5 shadow-xl transition-all hover:-translate-y-0.5 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
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
          <span>Sign In with Google</span>
        </button>
      </div>
    );
  }

  return (
    <div id="studio-dashboard" className="space-y-8 animate-fadeIn">
      {/* HEADER HERO PANEL */}
      <div className="bg-gradient-to-r from-zinc-900/60 via-zinc-900 to-cyan-950/15 border border-zinc-800 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user.photoURL}
            alt={user.displayName}
            className="w-14 h-14 rounded-full border-2 border-cyan-400 object-cover shadow-inner"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{user.displayName}’s Master Suite</h2>
              <span className="text-[10px] bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded font-mono">Verified Studio Creator</span>
            </div>
            <p className="text-xs text-zinc-400 font-mono">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block">Production Tier</span>
            <span className="text-sm font-semibold text-zinc-200">Unlimited Synthesis VIP</span>
          </div>
          <button
            onClick={() => setTopUpActive(!topUpActive)}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-sans font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Credits</span>
          </button>
        </div>
      </div>

      {/* TOP-UP PANEL DRAWER */}
      {topUpActive && (
        <div className="bg-zinc-900 border border-cyan-500/30 p-5 rounded-2xl space-y-4 animate-slideDown">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-cyan-400" />
                <span>Simulate Google Pay Credit Top-up</span>
              </h3>
              <p className="text-xs text-zinc-400">Select credit tier package to increase available production pools instantaneously.</p>
            </div>
            <button 
              onClick={() => setTopUpActive(false)} 
              className="text-zinc-400 hover:text-white text-xs px-2 py-1"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[25, 50, 100].map((num) => (
              <button
                key={num}
                onClick={() => setSelectedAmount(num)}
                className={`p-3 rounded-lg border text-center transition-all ${
                  selectedAmount === num
                    ? "bg-cyan-950/60 border-cyan-500 text-cyan-300"
                    : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                }`}
              >
                <div className="text-base font-bold">+{num}</div>
                <div className="text-[10px] font-mono mt-0.5">${(num * 0.15).toFixed(2)} USD</div>
              </button>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={triggerTopUp}
              disabled={topUpSuccess}
              className={`px-5 py-2 rounded-lg text-xs font-bold font-sans tracking-wide flex items-center gap-2 ${
                topUpSuccess 
                  ? "bg-emerald-600 text-white" 
                  : "bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white"
              }`}
            >
              {topUpSuccess ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Success! Credits Added</span>
                </>
              ) : (
                <>
                  <span>Top Up Using Simulated Wallet</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* METRIC COUNTER ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-zinc-950/65 border border-zinc-850 p-5 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-semibold block">Total Pool acquired</span>
          <span className="text-3xl font-extrabold text-zinc-150 block">{totalCredits}</span>
          <span className="text-[10px] text-zinc-500 font-mono">Historical credit flow</span>
        </div>

        <div className="bg-zinc-950/65 border border-zinc-850 p-5 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-semibold block">Remaining Credits</span>
          <span className="text-3xl font-extrabold text-cyan-400 block">{remainingCredits}</span>
          <span className="text-[10px] text-cyan-500/70 font-mono">Available for instant renders</span>
        </div>

        <div className="bg-zinc-950/65 border border-zinc-850 p-5 rounded-xl space-y-1">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-semibold block">Used Credits</span>
          <span className="text-3xl font-extrabold text-zinc-400 block">{usedCredits}</span>
          <span className="text-[10px] text-zinc-500 font-mono">Consumables tracking record</span>
        </div>

        <div className="bg-zinc-950/65 border border-zinc-850 p-5 rounded-xl flex flex-col justify-between p-5 space-y-1.5">
          <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-semibold block">Service Consumption Ratio</span>
          <div className="space-y-1">
            <div className="w-full bg-zinc-900 rounded-full h-2">
              <div 
                className="bg-indigo-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (usedCredits / (totalCredits || 1)) * 100)}%` }} 
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-zinc-400">
              <span>{Math.round((usedCredits / (totalCredits || 1)) * 100)}% Used</span>
              <span>{remainingCredits} Free</span>
            </div>
          </div>
        </div>
      </div>

      {/* RENDER VAULT & HISTORIES SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* VAULT: USER GENERATED VIDEO MIXES */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Film className="w-4 h-4 text-cyan-400" />
              <span>Storyboard Media Vault ({projects.length})</span>
            </h3>
            <span className="text-[11px] text-zinc-400 font-mono">Click cards to load workspace</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((proj) => {
              const isActive = activeProject?.id === proj.id;
              return (
                <div
                  key={proj.id}
                  onClick={() => onSelectProject(proj)}
                  className={`border rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${
                    isActive 
                      ? "bg-zinc-900/90 border-cyan-500 shadow-md shadow-cyan-950/20 ring-1 ring-cyan-500/20" 
                      : "bg-zinc-950/40 border-zinc-850 hover:bg-zinc-900/60 hover:border-zinc-700"
                  }`}
                >
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-zinc-100 line-clamp-1">{proj.projectName}</h4>
                        <span className="text-[10px] text-zinc-500 font-mono block">
                          Created {new Date(proj.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {isActive && (
                        <span className="text-[9px] bg-cyan-950 text-cyan-400 border border-cyan-800/60 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                          Active
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5 text-xs text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <Music className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="truncate">{proj.musicDetails.fileName || "No Track Linked"}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {proj.styles.map((st, idx) => (
                          <span key={idx} className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded font-mono">
                            {st}
                          </span>
                        ))}
                      </div>
                    </div>

                    {proj.clips && proj.clips.length > 0 ? (
                      <div className="grid grid-cols-4 gap-1 pt-2 border-t border-zinc-900">
                        {proj.clips.map((clip, idx) => (
                          <div 
                            key={idx} 
                            style={{ background: clip.colorPalette?.[0] || "#27272a" }} 
                            className="h-6 rounded-md opacity-70 hover:opacity-100 transition-opacity border border-zinc-950" 
                            title={clip.title}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-zinc-550 italic pt-2">No clips generated yet. Synthesize to complete!</p>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {proj.clips?.length || 0} Segment Clips
                      </span>
                      {projects.length > 1 && (
                        <button
                          onClick={(e) => onDeleteProject(proj.id, e)}
                          className="p-1.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-red-400 z-10 transition-colors"
                          title="Delete Project Session"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* LOG HISTORY: CREDIT TRANSACTIONS */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Credit Usage History</h3>
          </div>

          <div className="bg-zinc-950 border border-zinc-850 rounded-xl overflow-hidden">
            <div className="max-h-[350px] overflow-y-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-900 bg-zinc-900/40 text-zinc-500 font-mono">
                    <th className="p-3">Activity description</th>
                    <th className="p-3 text-right">Credit cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {transactions.slice().reverse().map((t) => (
                    <tr key={t.id} className="hover:bg-zinc-900/30 transition-all">
                      <td className="p-3">
                        <div className="font-semibold text-zinc-300">{t.description}</div>
                        <div className="text-[10px] text-zinc-500 font-mono truncate max-w-[170px]" title={t.projectName}>
                          {t.projectName}
                        </div>
                      </td>
                      <td className={`p-3 text-right font-mono font-bold ${t.amount < 0 ? "text-red-400" : "text-emerald-400"}`}>
                        {t.amount > 0 ? `+${t.amount}` : t.amount}
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={2} className="p-8 text-center text-zinc-500 italic">
                        No transactions registered yet. Try synthesizing a project Mix.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="bg-zinc-900/20 p-3 border-t border-zinc-900 text-center text-[11px] font-mono text-zinc-500">
              Rate: 1 Full Synthesis = 15 Credits
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
