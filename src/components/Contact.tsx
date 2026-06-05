import { useState, FormEvent } from "react";
import { UserProfile } from "../types";
import { 
  Mail, 
  Send, 
  CheckCircle, 
  MapPin, 
  Phone, 
  MessageSquare,
  Globe,
  Twitter,
  Instagram,
  FileCode,
  Sparkles
} from "lucide-react";

interface ContactProps {
  user: UserProfile | null;
}

export default function Contact({ user }: ContactProps) {
  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    inquiryType: "sponsorship",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: FormEvent) => {

    e.preventDefault();
    if (!formData.message.trim()) return;

    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      // Reset only message
      setFormData(prev => ({ ...prev, message: "" }));
    }, 1200);
  };

  return (
    <div id="contact-page" className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 py-6 animate-fadeIn">
      
      {/* SUPPORT & COLLECTIVE CHANNELS COLUMN */}
      <div className="md:col-span-2 space-y-6">
        <div className="space-y-2">
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">CONTACT SUITE</span>
          <h2 className="text-xl font-bold text-white tracking-tight">Connect with the Collective</h2>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            Need custom cinematic sequences, tailored beats, enterprise API integrations, or high-definition bespoke music video storyboard synthesis? Send our operators a transmission wire.
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-start gap-3 text-xs">
            <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-cyan-400">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <span className="text-zinc-550 font-mono block text-[10px] uppercase font-bold">VIRTUAL DISPATCH</span>
              <span className="text-zinc-200">operators@subcityboi.world</span>
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs">
            <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-indigo-400">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-zinc-550 font-mono block text-[10px] uppercase font-bold">CREATIVE BASE</span>
              <span className="text-zinc-200">Subcity Hypergrid Sector-029</span>
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs">
            <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-purple-400">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <span className="text-zinc-550 font-mono block text-[10px] uppercase font-bold">SECURE CHANNEL</span>
              <span className="text-zinc-200">+1 (888) SUBCITY-BOI</span>
            </div>
          </div>
        </div>

        {/* SOCIAL CHANNELS ACCENT */}
        <div className="pt-6 border-t border-zinc-900 space-y-3">
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">CYBERSPACE DIRECTORIES</span>
          <div className="flex gap-2">
            <a 
              href="#twitter" 
              className="p-2 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-cyan-400 border border-zinc-850 hover:border-cyan-950 transition-colors"
              title="Operator Twitter Wire"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a 
              href="#instagram" 
              className="p-2 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-cyan-400 border border-zinc-850 hover:border-cyan-950 transition-colors"
              title="Visual Portfolio"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a 
              href="#web" 
              className="p-2 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-cyan-400 border border-zinc-850 hover:border-cyan-950 transition-colors"
              title="Official Collective Portal"
            >
              <Globe className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* FORM FILL BOX */}
      <div className="md:col-span-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
          
          <div className="border-b border-zinc-800/80 pb-4">
            <h3 className="text-sm font-mono text-zinc-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>TRANSMIT WIRE DISPATCH</span>
            </h3>
          </div>

          {submitted ? (
            <div className="py-8 space-y-4 text-center animate-fadeIn">
              <div className="mx-auto w-12 h-12 bg-emerald-500/10 border border-emerald-500/40 rounded-full flex items-center justify-center text-emerald-400">
                <CheckCircle className="w-6 h-6 animate-bounce" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-zinc-150">Transmission Transmitted Successfully!</h4>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-md mx-auto">
                  Your inquiry message was serialized and dispatched. Our production operators will reach back to <strong className="text-cyan-400 font-semibold">{formData.email || "your inbox"}</strong> shortly!
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="px-4 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold"
              >
                Send Another Dispatch
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider font-semibold block">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Jane Matrix"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-3.5 py-2.5 text-zinc-200 outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider font-semibold block">Email Inbox</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g., model@sector.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-3.5 py-2.5 text-zinc-200 outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider font-semibold block">Inquiry Category</label>
                <select
                  value={formData.inquiryType}
                  onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-3.5 py-2.5 text-zinc-300 outline-none focus:border-cyan-500 font-mono uppercase"
                >
                  <option value="sponsorship">Custom Storyboard Production</option>
                  <option value="api">Enterprise API / Model Licensing</option>
                  <option value="collab">Undrgrnd Artist Collaboration</option>
                  <option value="bug">Platform Troubleshooting Support</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider font-semibold block">Transmission Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your creative vision, requirements, timeline details, or budget variables..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-3.5 py-2.5 text-zinc-200 outline-none focus:border-cyan-500 resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className={`w-full py-3 rounded-lg font-bold font-sans tracking-widest uppercase flex items-center justify-center gap-2 transition-all ${
                  sending 
                    ? "bg-zinc-800 text-zinc-500 cursor-wait" 
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg active:translate-y-0.5 cursor-pointer"
                }`}
              >
                {sending ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-zinc-500 border-t-white rounded-full animate-spin" />
                    <span>Serializing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Dispatch Transmission</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* SECURITY NOTE FOOTER */}
          <div className="pt-2 flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
            <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-ping" />
            <span>Encrypted using studio terminal SSL signatures</span>
          </div>
          
        </div>
      </div>

    </div>
  );
}
