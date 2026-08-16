import React from 'react';
import { usePathfindingStore } from "../store/usePathfindingStore";
import { Play, RotateCcw, Loader2, Sparkles, Swords } from 'lucide-react';

interface HeroSectionProps {
  isRunning: boolean;
  onRun: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ isRunning, onRun }) => {
  const { hasRun, resetGrid, runDuel } = usePathfindingStore();

  return (
    <div className="relative flex flex-col items-center text-center my-8 px-4 py-6 max-w-4xl mx-auto">
      
      <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/80 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.15)] mb-4 backdrop-blur-md">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span className="text-[11px] font-bold text-cyan-200 tracking-widest uppercase">Interactive Pathfinding Studio</span>
      </div>

      <h2 className="relative text-2xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 text-white drop-shadow-md">
        Smart Routing with <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-fuchsia-400 to-indigo-400 drop-shadow-[0_0_20px_rgba(168,85,247,0.3)]">A* Search</span>
      </h2>

      <p className="relative text-slate-400 text-xs sm:text-sm md:text-base max-w-xl mb-8 leading-relaxed font-medium">
        Visualize advanced graph traversal and pathfinding algorithms in real-time. Find optimal routes through walls and weighted terrain effortlessly.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          disabled={isRunning}
          onClick={hasRun ? resetGrid : onRun}
        className="group flex items-center gap-2 px-5 py-2.5 bg-liner-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer shadow-lg shadow-indigo-600/25 border border-indigo-400/20 active:scale-95"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-cyan-200" />
              <span>Processing Algorithm...</span>
            </>
          ) : hasRun ? (
            <>
              <RotateCcw className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-90 text-cyan-200" />
              <span>Replay Board</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current transition-transform duration-300 group-hover:scale-110 text-cyan-200" />
              <span>Run Algorithm</span>
            </>
          )}
        </button>

        <button
          disabled={isRunning}
          onClick={runDuel}
        className="group flex items-center gap-2 px-5 py-2.5 bg-liner-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer shadow-lg shadow-indigo-600/25 border border-indigo-400/20 active:scale-95"
        >
          <Swords className="w-4 h-4 text-indigo-200 transition-transform duration-300 group-hover:rotate-12" />
          <span>Run Duel Mode</span>
        </button>
      </div>

    </div>
  );
};