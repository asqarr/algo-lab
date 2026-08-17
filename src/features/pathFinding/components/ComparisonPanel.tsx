import React from "react";
import { motion } from "framer-motion";
import { usePathfindingStore } from "../store/usePathfindingStore";
import { Zap, Target, Clock, Award, Activity } from "lucide-react";

export const ComparisonPanel: React.FC = () => {
  const { benchmarkResults } = usePathfindingStore();
  
  if (!benchmarkResults.dijkstra || !benchmarkResults.aStar) return null;

  const dTime = parseFloat(benchmarkResults.dijkstra.time);
  const aTime = parseFloat(benchmarkResults.aStar.time);
  const dVisited = benchmarkResults.dijkstra.visitedCount;
  const aVisited = benchmarkResults.aStar.visitedCount;

  const isDijkstraWinner = dTime < aTime;
  const winnerName = isDijkstraWinner ? "DIJKSTRA" : "A* SEARCH";

  const getTechnicalInsight = () => {
    if (dVisited < aVisited && isDijkstraWinner) {
      return "Dijkstra demonstrated superior performance in this topology, processing fewer nodes and achieving faster execution overhead due to optimal weight balancing.";
    } else if (!isDijkstraWinner && aVisited < dVisited) {
      return "A* Search outperformed Dijkstra by leveraging heuristic directionality, significantly reducing the search space and minimizing node exploration density.";
    } else {
      return "Both algorithms exhibited comparable convergence rates, though heuristic-based routing provided a more directed traversal across weighted obstacles.";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="fixed inset-x-3 top-20 sm:inset-x-auto sm:right-6 sm:top-24 w-auto sm:w-96 bg-slate-950/85 backdrop-blur-2xl border border-white/10 p-4 sm:p-6 rounded-3xl shadow-2xl z-40 overflow-hidden max-h-[85vh] overflow-y-auto my-auto"
    >
      <div className="absolute -right-12 -top-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4 sm:mb-5 relative z-10">
        <h2 className="text-white font-bold text-base sm:text-lg flex items-center gap-2 sm:gap-2.5">
          <div className="p-1.5 sm:p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400">
            <Zap size={16} className="sm:w-4.5 sm:h-4.5" />
          </div>
          Duel Benchmark HUD
        </h2>
        <span className="text-[9px] sm:text-[10px] font-mono px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white/5 border border-white/10 text-slate-400">
          PARALLEL ENGINE
        </span>
      </div>
      
      <div className="space-y-2.5 sm:space-y-3 relative z-10 mb-4 sm:mb-5">
        {[ 
          { name: "Dijkstra", data: benchmarkResults.dijkstra, color: "from-blue-600/20 border-blue-500/30 text-blue-400" }, 
          { name: "A* Search", data: benchmarkResults.aStar, color: "from-purple-600/20 border-purple-500/30 text-purple-400" } 
        ].map((algo) => (
          <div key={algo.name} className={`bg-linear-to-r ${algo.color} p-3.5 sm:p-4 rounded-2xl border backdrop-blur-md`}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-white font-semibold text-xs sm:text-sm">{algo.name}</h3>
              <span className="text-[10px] sm:text-[11px] font-mono text-slate-300">{algo.data.pathLength} steps path</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] sm:text-xs text-slate-300">
              <div className="flex items-center gap-1.5 bg-black/30 px-2 sm:px-2.5 py-1.5 rounded-xl border border-white/5">
                <Clock size={12} className="sm:w-3.25 sm:h-3.25 text-slate-400 shrink-0" /> 
                <span className="font-mono truncate">{algo.data.time}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/30 px-2 sm:px-2.5 py-1.5 rounded-xl border border-white/5">
                <Target size={12} className="sm:w-3.25 sm:h-3.25 text-slate-400 shrink-0" /> 
                <span className="font-mono truncate">{algo.data.visitedCount} nodes</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10 bg-white/3 border border-white/10 p-3.5 sm:p-4 rounded-2xl mb-4 sm:mb-5">
        <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-indigo-300 mb-1.5">
          <Activity size={13} className="sm:w-3.5 sm:h-3.5" />
          Algorithmic Analysis Insight
        </div>
        <p className="text-slate-400 text-[11px] sm:text-xs leading-relaxed">
          {getTechnicalInsight()}
        </p>
      </div>
      
      <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-1.5 sm:gap-2 text-emerald-400 text-[11px] sm:text-xs font-semibold">
          <Award size={14} className="sm:w-4 sm:h-4" />
          OPTIMAL CHOICE
        </div>
        <span className="text-[11px] sm:text-xs font-bold font-mono px-2.5 sm:px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-full tracking-wider">
          {winnerName}
        </span>
      </div>
    </motion.div>
  );
};