import React, { useEffect, useState } from 'react';
import { Play, X, Zap, Cpu, GitCommit, FastForward, Sparkles } from 'lucide-react';

interface AlgorithmSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAlgorithm: (algorithm: 'dijkstra' | 'aStar' | 'bidirectional' | 'jps') => void;
}

export const AlgorithmSelectorModal: React.FC<AlgorithmSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectAlgorithm,
}) => {
  const [show, setShow] = useState(isOpen);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => {
          setAnimateIn(true);
        });
        return () => cancelAnimationFrame(raf2);
      });
      return () => cancelAnimationFrame(raf1);
    } else {
      setAnimateIn(false);
      const timer = setTimeout(() => {
        setShow(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!show) return null;

  const algorithms = [
    {
      id: 'dijkstra' as const,
      name: "Dijkstra's Algorithm",
      badge: 'Classic & Guaranteed',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-sm shadow-blue-500/10',
      btnBg: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/25',
      icon: <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 animate-pulse" />,
      description: 'The father of pathfinding algorithms. Explores all directions uniformly to guarantee the absolute shortest path.',
      feature: 'Complete & optimal, but relatively slow'
    },
    {
      id: 'aStar' as const,
      name: 'A* Search',
      badge: 'Smart & Balanced',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-sm shadow-emerald-500/10',
      btnBg: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/25',
      icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 animate-pulse" />,
      description: 'Combines Dijkstra with a heuristic. Estimates distance to the target, leading the search directly and much faster.',
      feature: 'Efficient, intelligent & industry standard'
    },
    {
      id: 'bidirectional' as const,
      name: 'Bidirectional A*',
      badge: 'Dual Wave Speedup',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-sm shadow-purple-500/10',
      btnBg: 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 shadow-purple-600/25',
      icon: <GitCommit className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 animate-pulse" />,
      description: 'Runs two simultaneous searches—one from the start and one from the finish—meeting in the middle to cut search time.',
      feature: 'Twice as fast when waves collide'
    },
    {
      id: 'jps' as const,
      name: 'Jump Point Search (JPS)',
      badge: 'Ultra Fast / Pro',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-sm shadow-amber-400/10',
      btnBg: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-600/25',
      icon: <FastForward className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-pulse" />,
      description: 'An optimization for uniform grids. It "skips" over straight lines and jumps directly to key nodes to minimize overhead.',
      feature: 'Lightning fast with directional line jumping'
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-xl transition-opacity duration-300 ease-out ${
          animateIn ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      <div
        className={`relative w-full max-w-2xl bg-[#0b0f19] border border-slate-800/80 rounded-3xl shadow-2xl p-4 sm:p-7 overflow-hidden z-10 transition-all duration-300 ease-out transform my-auto max-h-[90vh] flex flex-col ${
          animateIn
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-6'
        }`}
      >
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-32 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full"></div>

        <div className="relative flex items-center justify-between pb-3 sm:pb-5 mb-3 sm:mb-5 border-b border-slate-800/80 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 shadow-inner">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-bold text-white tracking-wide">Select Pathfinding Algorithm</h3>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Choose an algorithm below to visualize its search strategy</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 sm:p-2.5 text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 rounded-2xl transition-all duration-200 cursor-pointer border border-slate-800 shadow-sm"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="relative grid grid-cols-1 gap-3 overflow-y-auto pr-1 custom-scrollbar">
          {algorithms.map((algo) => (
            <div
              key={algo.id}
              className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-900/90 transition-all duration-300 hover:shadow-xl hover:shadow-black/40"
            >
              <div className="flex items-start gap-3 w-full sm:w-auto">
                <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-800/80 border border-slate-700/50 shadow-inner mt-0.5 sm:mt-0 group-hover:scale-105 transition-transform duration-300 shrink-0">
                  {algo.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-white text-sm sm:text-base tracking-wide truncate">{algo.name}</h4>
                    <span className={`text-[10px] sm:text-[11px] px-2 sm:px-2.5 py-0.5 rounded-full border font-medium ${algo.badgeColor}`}>
                      {algo.badge}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-400 mt-1 leading-relaxed">{algo.description}</p>
                  <div className="flex items-center gap-1.5 mt-2 text-[10px] sm:text-[11px] text-slate-300 font-medium bg-slate-950/40 px-2 sm:px-2.5 py-1 rounded-lg w-fit border border-slate-800/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400 shrink-0"></span>
                    <span className="truncate">Feature: {algo.feature}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectAlgorithm(algo.id);
                  onClose();
                }}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer shadow-lg shrink-0 border border-white/10 active:scale-95 ${algo.btnBg}`}
              >
                <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                <span>Run</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(71, 85, 105, 0.6) rgba(15, 23, 42, 0.4);
          -webkit-overflow-scrolling: touch;
          will-change: transform;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.4);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.6);
          border-radius: 8px;
          transition: background 0.3s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.9);
        }
      `}</style>
    </div>
  );
};