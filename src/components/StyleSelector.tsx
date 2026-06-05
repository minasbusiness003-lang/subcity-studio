import { VideoStyle } from "../types";
import { Film, Check, Zap, Sparkles, Heart, Compass, Laptop, Camera, Clapperboard, RefreshCw } from "lucide-react";

interface StyleSelectorProps {
  selectedStyles: VideoStyle[];
  onChange: (styles: VideoStyle[]) => void;
}

interface StyleCardDetail {
  enumValue: VideoStyle;
  label: string;
  icon: any;
  description: string;
  bannerColor: string;
  badgeText: string;
}

export default function StyleSelector({ selectedStyles, onChange }: StyleSelectorProps) {
  const stylesList: StyleCardDetail[] = [
    {
      enumValue: VideoStyle.Anime,
      label: "Anime Spectacular",
      icon: Sparkles,
      description: "Hand-drawn 2D aesthetic, vibrant sky keys, high-contrast dynamic highlights, celestial particles.",
      bannerColor: "from-pink-500 via-rose-500 to-amber-400",
      badgeText: "2D Celeste"
    },
    {
      enumValue: VideoStyle.Realistic,
      label: "Hyper Realistic",
      icon: Camera,
      description: "Atmospheric lens flares, realistic depth of field, real-world physical shadow projection, pristine details.",
      bannerColor: "from-slate-700 via-zinc-800 to-neutral-900",
      badgeText: "8K Physics"
    },
    {
      enumValue: VideoStyle.LiveAction,
      label: "Cinematic Live-Action",
      icon: Clapperboard,
      description: "Arri Alexa gold standard look, subtle camera grains, professional organic anamorphic lenses.",
      bannerColor: "from-amber-600 via-yellow-700 to-indigo-950",
      badgeText: "Hollywood Master"
    },
    {
      enumValue: VideoStyle.Action,
      label: "High Intensity Action",
      icon: Zap,
      description: "Kinetic motion lines, fast particle debris, high adrenaline speed transitions, camera motion shockwaves.",
      bannerColor: "from-red-600 via-orange-500 to-yellow-500",
      badgeText: "Max Kinetic"
    },
    {
      enumValue: VideoStyle.Romance,
      label: "Dreamy Romance",
      icon: Heart,
      description: "Soft focus pastel shades, floating pollen/petals, golden sunset backlight, warming filters.",
      bannerColor: "from-pink-400 via-pink-300 to-rose-400",
      badgeText: "Golden Glow"
    },
    {
      enumValue: VideoStyle.SciFi,
      label: "Sci-Fi Space Opera",
      icon: Compass,
      description: "Nebula clusters, holographic UI widgets, massive spatial constructs, laser reflections, sleek hulls.",
      bannerColor: "from-cyan-600 via-blue-600 to-indigo-950",
      badgeText: "Interstellar Space"
    },
    {
      enumValue: VideoStyle.Cyberpunk,
      label: "Cyberpunk Dystopia",
      icon: Laptop,
      description: "Neon rains, towering skyscraper holograms, deep glowing pink/cyan streets, high reflection.",
      bannerColor: "from-purple-600 via-fuchsia-600 to-cyan-500",
      badgeText: "Subcity Neon"
    },
    {
      enumValue: VideoStyle.Fantasy,
      label: "Ethereal Fantasy",
      icon: Sparkles,
      description: "Floating islands, magical flora glow emission, mythic stellar cycles, ancient runic monoliths.",
      bannerColor: "from-indigo-600 via-purple-700 to-emerald-950",
      badgeText: "Mythic Dream"
    },
    {
      enumValue: VideoStyle.Retro,
      label: "Retro / Synthwave",
      icon: RefreshCw,
      description: "70s style granular movie stock, vintage grids, warm glowing neon sunrise horizons, chromatic aberrations.",
      bannerColor: "from-violet-700 via-fuchsia-850 to-pink-500",
      badgeText: "VHS Grain"
    },
    {
      enumValue: VideoStyle.Cinematic,
      label: "Cinematic Drama",
      icon: Film,
      description: "Mood drama shading, ultra deliberate film direction, widescreen ratio, atmospheric twilight fog.",
      bannerColor: "from-zinc-800 via-stone-800 to-neutral-950",
      badgeText: "Moody Focus"
    }
  ];

  const handleToggle = (style: VideoStyle) => {
    if (selectedStyles.includes(style)) {
      onChange(selectedStyles.filter((s) => s !== style));
    } else {
      onChange([...selectedStyles, style]);
    }
  };

  const handleSelectAll = () => {
    onChange([VideoStyle.Anime, VideoStyle.Realistic, VideoStyle.LiveAction, VideoStyle.Cinematic]);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl shadow-black/10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-950 text-indigo-400 rounded-md border border-indigo-900/40">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-sans font-semibold text-zinc-100">Step 2: Define Video Art Styles</h2>
            <p className="text-xs text-zinc-400">Multiple selection supported. Styles blend to construct your final visuals.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-[11px] font-mono text-cyan-400 bg-zinc-950/40 border border-zinc-800/80 px-2.5 py-1 rounded hover:bg-zinc-900 hover:text-cyan-300 transition"
          >
            Select Presets
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 transition"
          >
            Clear Selected
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
        {stylesList.map((st) => {
          const isSelected = selectedStyles.includes(st.enumValue);
          const IconComponent = st.icon;

          return (
            <div
              key={st.enumValue}
              onClick={() => handleToggle(st.enumValue)}
              className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-350 cursor-pointer ${
                isSelected
                  ? "border-indigo-500 bg-indigo-950/10 shadow-lg shadow-indigo-950/20"
                  : "border-zinc-800/80 bg-zinc-950/10 hover:border-zinc-700 hover:bg-zinc-950/35"
              }`}
            >
              {/* Top Banner Accent Line */}
              <div className={`h-1 bg-gradient-to-r ${st.bannerColor} w-full`} />

              <div className="p-4 flex gap-3.5 items-start">
                <div
                  className={`p-2.5 rounded-lg border shrink-0 transition-all ${
                    isSelected
                      ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
                      : "bg-zinc-900 text-zinc-400 border-zinc-800"
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-sans font-semibold text-xs text-zinc-200">
                      {st.label}
                    </span>
                    <span className="text-[9px] font-mono bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-400 uppercase tracking-widest border border-zinc-800/60">
                      {st.badgeText}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1.5 font-sans leading-relaxed">
                    {st.description}
                  </p>
                </div>

                {/* Selected Indicators */}
                <div className="absolute top-4 right-4">
                  <div
                    className={`w-5.5 h-5.5 rounded-full flex items-center justify-center border transition-all ${
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-500 shadow-sm"
                        : "bg-zinc-950/60 text-transparent border-zinc-800 hover:border-zinc-600"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedStyles.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 bg-zinc-950/60 border border-zinc-850 p-2.5 rounded-lg animate-fadeIn">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider pl-1 shrink-0">Blending Grid:</span>
          {selectedStyles.map((style) => (
            <span
              key={style}
              className="text-[10px] font-mono bg-indigo-950/50 text-indigo-300 border border-indigo-900/50 px-2 py-0.5 rounded-full"
            >
              {style}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
