import React from 'react';
import { RotateCcw, Trash2, Play, BarChart2, Shuffle } from 'lucide-react';
import { usePathfindingStore } from '../store/usePathfindingStore';

export const Toolbar: React.FC = () => {
  const { 
    resetGrid, 
    clearWalls, 
    randomizeWalls, 
    runDijkstra, 
    runAStar 
  } = usePathfindingStore();

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 bg-[#0b0f19]/90 rounded-2xl border border-slate-800 shadow-xl my-4">
      <div className="flex flex-wrap items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-green-500 inline-block shadow-sm shadow-green-500/50"></span>
          <span className="text-slate-300 font-medium">Start Node</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-red-500 inline-block shadow-sm shadow-red-500/50"></span>
          <span className="text-slate-300 font-medium">Finish Node</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-amber-400 inline-block shadow-sm shadow-amber-400/50"></span>
          <span className="text-slate-300 font-medium">Path Found</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={randomizeWalls}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium transition-colors cursor-pointer border border-slate-700/50 shadow-sm"
          title="Generate Random Walls"
        >
          <Shuffle className="w-4 h-4 text-purple-400" />
          <span>Random Maze</span>
        </button>

        <button
          onClick={runDijkstra}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer shadow-md shadow-blue-600/20"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Dijkstra</span>
        </button>

        <button
          onClick={runAStar}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer shadow-md shadow-emerald-600/20"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>A* Search</span>
        </button>

        <div className="h-6 w-px bg-slate-700 mx-1"></div>

        <button 
          onClick={clearWalls} 
          className="p-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer flex items-center justify-center border border-slate-700/50" 
          title="Clear Walls"
        >
          <Trash2 className="w-4 h-4 text-rose-400" />
        </button>

        <button 
          onClick={resetGrid} 
          className="p-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer flex items-center justify-center border border-slate-700/50" 
          title="Reset Board"
        >
          <RotateCcw className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    </div>
  );
};