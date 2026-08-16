import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  X,
  Cpu,
  Zap,
  GitCommit,
  FastForward,
  CheckCircle2,
} from "lucide-react";

interface AlgorithmDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlgorithmDocsModal: React.FC<AlgorithmDocsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<
    "dijkstra" | "aStar" | "bidirectional" | "jps"
  >("dijkstra");

  const docsData = {
    dijkstra: {
      name: "Dijkstra's Algorithm",
      badge: "Classic & Guaranteed",
      color: "text-blue-400",
      bgBadge: "bg-blue-500/10 border-blue-500/20 text-blue-400",
      icon: <Cpu className="w-5 h-5 text-blue-400" />,
      description:
        "The father of pathfinding algorithms. It explores all possible directions uniformly from the starting node until it reaches the target.",
      features: [
        "Guarantees the absolute shortest path",
        "Suitable for weighted and unweighted grids",
        "Explores uniformly in all directions (can be slow on large grids)",
      ],
      timeComplexity: "O(V + E log V)",
    },
    aStar: {
      name: "A* Search",
      badge: "Smart & Balanced",
      color: "text-emerald-400",
      bgBadge: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
      icon: <Zap className="w-5 h-5 text-emerald-400" />,
      description:
        "One of the most successful pathfinding algorithms. It uses heuristics (estimated distance to target) to guide its search directly towards the goal.",
      features: [
        "Significantly faster than Dijkstra",
        "Guarantees the shortest path (with admissible heuristic)",
        "Industry standard for games and navigation systems",
      ],
      timeComplexity: "O(E)",
    },
    bidirectional: {
      name: "Bidirectional A*",
      badge: "Dual Wave Speedup",
      color: "text-purple-400",
      bgBadge: "bg-purple-500/10 border-purple-500/20 text-purple-400",
      icon: <GitCommit className="w-5 h-5 text-purple-400" />,
      description:
        "Runs two simultaneous searches: one forward from the start node and one backward from the finish node, meeting somewhere in the middle.",
      features: [
        "Cuts search time drastically when waves collide",
        "Maintains optimal path discovery",
        "Greatly reduces visited node overhead",
      ],
      timeComplexity: "O(b^(d/2))",
    },
    jps: {
      name: "Jump Point Search (JPS)",
      badge: "Ultra Fast / Pro",
      color: "text-amber-400",
      bgBadge: "bg-amber-500/10 border-amber-500/20 text-amber-400",
      icon: <FastForward className="w-5 h-5 text-amber-400" />,
      description:
        'An optimized version of A* for uniform grids. It skips symmetric paths by "jumping" over straight lines to identify key nodes instantly.',
      features: [
        "Lightning fast execution speed",
        "Eliminates symmetrical path redundancies",
        "Optimized specifically for grid-based environments",
      ],
      timeComplexity: "O(k log n)",
    },
  };

  const current = docsData[activeTab];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
            className="relative w-full max-w-2xl bg-[#0b0f19] border border-slate-800/80 rounded-3xl shadow-2xl p-6 md:p-7 overflow-hidden z-10 text-slate-300"
          >
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-32 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full"></div>

            <div className="relative flex justify-between items-center mb-5 border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-inner">
                  <BookOpen className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-wide">
                    Algorithm Documentation
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Explore how each pathfinding strategy works
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 rounded-2xl transition-all duration-200 cursor-pointer border border-slate-800 shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
              {(Object.keys(docsData) as Array<keyof typeof docsData>).map(
                (key) => {
                  const item = docsData[key];
                  const isActive = activeTab === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer border ${
                        isActive
                          ? "bg-slate-800 text-white border-slate-700 shadow-md shadow-black/40 scale-[1.02]"
                          : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border-slate-800/80 hover:bg-slate-900"
                      }`}
                    >
                      {item.icon}
                      <span className="truncate">
                        {item.name.split(" ")[0]}
                      </span>
                    </button>
                  );
                },
              )}
            </div>

            <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 mb-6 shadow-inner space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h4 className="text-lg font-bold text-white flex items-center gap-2.5">
                  {current.icon}
                  {current.name}
                </h4>
                <span
                  className={`text-xs px-3 py-1 rounded-full border font-medium ${current.bgBadge}`}
                >
                  {current.badge}
                </span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {current.description}
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
                  Key Characteristics:
                </span>
                <ul className="space-y-1.5">
                  {current.features.map((feat, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-xs text-slate-300"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                <span className="text-slate-400 font-medium">
                  Time Complexity:
                </span>
                <span className="font-mono text-cyan-400 font-bold bg-slate-950/60 px-3 py-1 rounded-lg border border-slate-800/50">
                  {current.timeComplexity}
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-7 py-3 font-bold text-white transition-all duration-300 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 active:scale-95 cursor-pointer border border-white/10"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
