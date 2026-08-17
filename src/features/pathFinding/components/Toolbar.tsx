import React, { useState } from "react";
import { RotateCcw, Trash2, Shuffle, Sparkles } from "lucide-react";
import { usePathfindingStore } from "../store/usePathfindingStore";
import { AlgorithmSelectorModal } from "./AlgorithmSelectorModal";

export const Toolbar: React.FC = () => {
  const {
    clearWalls,
    randomizeWalls,
    runDijkstra,
    runAStar,
    runBidirectional,
    runJPS,
    loadSavedBoard, 
  } = usePathfindingStore();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectAlgorithm = (
    algorithm: "dijkstra" | "aStar" | "bidirectional" | "jps",
  ) => {
    if (algorithm === "dijkstra") runDijkstra();
    else if (algorithm === "aStar") runAStar();
    else if (algorithm === "bidirectional") runBidirectional();
    else if (algorithm === "jps") runJPS();
  };

  const handleReloadBoard = () => {
    const success = loadSavedBoard();
    if (success) {
      console.info("Saved map successfully loaded!");
    } else {
      console.warn("No saved map found to load.");
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 bg-[#0b0f19]/90 rounded-2xl border border-slate-800 shadow-xl my-4 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800/80 shadow-inner backdrop-blur-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-sm shadow-emerald-500/80"></span>
            </span>
            <span className="text-slate-300 font-medium text-xs tracking-wide">
              Start Node
            </span>
          </div>

          <div className="flex items-center gap-1 px-3.5 py-1 rounded-xl bg-slate-900/80 border border-slate-800/80 shadow-inner backdrop-blur-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 shadow-sm shadow-rose-500/80"></span>
            </span>
            <span className="text-slate-300 font-medium text-xs tracking-wide">
              Finish Node
            </span>
          </div>

          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800/80 shadow-inner backdrop-blur-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400 shadow-sm shadow-amber-400/80"></span>
            </span>
            <span className="text-slate-300 font-medium text-xs tracking-wide">
              Path Found
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={randomizeWalls}
            className="flex items-center gap-2 px-5 py-2.5 from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer shadow-lg shadow-indigo-600/25 border border-indigo-400/20"
            title="Generate Random Walls"
          >
            <Shuffle className="w-4 h-4 text-purple-300 animate-pulse" />
            <span>Random Maze</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer shadow-lg shadow-indigo-600/25 border border-indigo-400/20"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Select & Run Algorithm</span>
          </button>

          <div className="h-6 w-px bg-slate-700 mx-1"></div>

          <button
            onClick={clearWalls}
            className="group relative p-2.5 bg-slate-900/80 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center border border-slate-800 hover:border-rose-500/30 shadow-inner backdrop-blur-sm"
            title="Clear Walls"
          >
            <Trash2 className="w-4 h-4 text-rose-400 transition-transform duration-300 group-hover:scale-110" />
          </button>

          <button
            onClick={handleReloadBoard}
            className="group relative p-2.5 bg-slate-900/80 hover:bg-amber-500/10 text-slate-300 hover:text-amber-400 rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center border border-slate-800 hover:border-amber-500/30 shadow-inner backdrop-blur-sm"
            title="Load Saved Board"
          >
            <RotateCcw className="w-4 h-4 text-amber-400 transition-transform duration-300 group-hover:-rotate-90 group-hover:scale-110" />
          </button>
        </div>
      </div>

      <AlgorithmSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectAlgorithm={handleSelectAlgorithm}
      />
    </>
  );
};