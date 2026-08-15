import React from 'react';
import { usePathfindingStore } from "../store/usePathfindingStore";

interface HeroSectionProps {
  isRunning: boolean;
  onRun: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ isRunning, onRun }) => {
  const { hasRun, resetGrid } = usePathfindingStore();

  return (
    <div className="flex flex-col items-center text-center my-8 px-4">
      <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
        Smart Pathfinding with <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500">Dijkstra</span>
      </h2>
      <p className="text-slate-400 text-sm md:text-base max-w-xl mb-6">
        Find the shortest and most optimal path between two points on the grid.
      </p>

      <button
        disabled={isRunning}
        onClick={hasRun ? resetGrid : onRun}
        className="relative px-8 py-3.5 font-bold text-white transition-all bg-linear-to-r from-blue-600 via-indigo-600 to-cyan-500 rounded-full hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/30 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer flex items-center gap-2"
      >
        <span>
          {isRunning ? "Running..." : hasRun ? "Replay" : "Run Dijkstra"}
        </span>
      </button>
    </div>
  );
};