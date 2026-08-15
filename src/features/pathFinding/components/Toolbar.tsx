import React from 'react';
import { RotateCcw, Trash2 } from 'lucide-react';
import { usePathfindingStore } from '../store/usePathfindingStore';

export const Toolbar: React.FC = () => {
  const { resetGrid, clearWalls } = usePathfindingStore();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#0b0f19]/90 rounded-2xl border border-slate-800 shadow-xl">
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500 inline-block shadow-sm shadow-green-500/50"></span>
          <span className="text-slate-300 font-medium">Start Node</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block shadow-sm shadow-red-500/50"></span>
          <span className="text-slate-300 font-medium">Finish Node</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-400 inline-block shadow-sm shadow-amber-400/50"></span>
          <span className="text-slate-300 font-medium">Path Found</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-slate-400">
        <button 
          onClick={resetGrid} 
          className="p-2.5 hover:bg-slate-800 hover:text-white rounded-xl transition-colors cursor-pointer flex items-center justify-center" 
          title="Reset Board"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button 
          onClick={clearWalls} 
          className="p-2.5 hover:bg-slate-800 hover:text-white rounded-xl transition-colors cursor-pointer flex items-center justify-center" 
          title="Clear Walls"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};