import React from 'react';
import { usePathfindingStore } from '../store/usePathfindingStore';
import { Activity, Compass, Clock, Zap } from 'lucide-react';

export const PathStats: React.FC = () => {
  const { pathLength, visitedNodesCount, executionTime, hasRun } =
    usePathfindingStore();

  return (
    <div className="relative lg:col-span-1 p-6 bg-[#0b0f19]/90 rounded-3xl border border-slate-800/80 shadow-2xl flex flex-col gap-5 backdrop-blur-xl overflow-hidden">
      
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full"></div>
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3.5 relative">
        <h3 className="text-xs font-bold tracking-wider uppercase text-slate-400 flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span>Path Statistics</span>
        </h3>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 font-medium">
          Live Stats
        </span>
      </div>

      <div className="flex flex-col gap-3 text-sm relative">
        <div className="group flex justify-between items-center p-3.5 bg-slate-900/70 hover:bg-slate-900/90 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-all duration-300 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform duration-300">
              <Compass className="w-4 h-4" />
            </div>
            <span className="text-slate-400 text-xs font-medium">Path Length</span>
          </div>
          <span className="font-bold text-amber-400 text-sm tracking-wide">
            {pathLength > 0 ? `${pathLength} Steps` : "-- Steps"}
          </span>
        </div>

        <div className="group flex justify-between items-center p-3.5 bg-slate-900/70 hover:bg-slate-900/90 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-all duration-300 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform duration-300">
              <Activity className="w-4 h-4" />
            </div>
            <span className="text-slate-400 text-xs font-medium">Visited Nodes</span>
          </div>
          <span className="font-bold text-blue-400 text-sm tracking-wide">
            {visitedNodesCount > 0 ? visitedNodesCount : "-- Nodes"}
          </span>
        </div>

        <div className="group flex justify-between items-center p-3.5 bg-slate-900/70 hover:bg-slate-900/90 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-all duration-300 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform duration-300">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-slate-400 text-xs font-medium">Execution Time</span>
          </div>
          <span className="font-bold text-indigo-400 text-sm tracking-wide">
            {executionTime !== "0.000s" ? executionTime : "-- s"}
          </span>
        </div>

        <div className="group flex justify-between items-center p-3.5 bg-slate-900/70 hover:bg-slate-900/90 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-all duration-300 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-slate-400 text-xs font-medium">Efficiency</span>
          </div>
          <span
            className={`font-bold text-sm tracking-wide px-2.5 py-0.5 rounded-lg border ${
              hasRun 
                ? (pathLength > 0 
                    ? "bg-green-500/10 text-green-400 border-green-500/20" 
                    : "bg-red-500/10 text-red-400 border-red-500/20") 
                : "bg-slate-800/50 text-slate-400 border-slate-700/50"
            }`}
          >
            {hasRun ? (pathLength > 0 ? "Optimal" : "No Path") : "Pending"}
          </span>
        </div>

      </div>
    </div>
  );
};