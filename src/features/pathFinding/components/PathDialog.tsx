import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathfindingStore } from "../store/usePathfindingStore";
import {
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Trophy,
  Zap,
  Clock,
  Activity,
  X,
  Award,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface DuelStatRowProps {
  icon: LucideIcon;
  iconColor: string;
  label: string;
  value: string | number;
  textColor: string;
}

const DuelStatRow: React.FC<DuelStatRowProps> = ({
  icon: Icon,
  iconColor,
  label,
  value,
  textColor,
}) => (
  <div className="flex items-center justify-between text-xs sm:text-sm">
    <span className="text-slate-400 flex items-center gap-1.5">
      <Icon className={`w-4 h-4 ${iconColor}`} /> {label}:
    </span>
    <span className={`font-bold ${textColor}`}>{value}</span>
  </div>
);

export const PathDialog: React.FC = () => {
  const {
    isDialogOpen,
    dialogType,
    resetGrid,
    setIsDialogOpen,
    benchmarkResults,
  } = usePathfindingStore();

  const isSuccess = dialogType === "success";
  const isAlreadyRun = dialogType === "alreadyRun";
  const isNoWalls = dialogType === "noWalls";
  const isDuel = dialogType === "duel";

  const getDialogContent = () => {
    switch (dialogType) {
      case "success":
        return {
          title: "Path Successfully Found!",
          message:
            "The shortest route has been successfully calculated and displayed with optimal accuracy.",
        };
      case "noWalls":
        return {
          title: "No Walls Drawn",
          message:
            "Please draw some walls or obstacles on the grid before running the pathfinding algorithm!",
          buttonText: "Got it",
        };
      case "alreadyRun":
        return {
          title: "Board Already Visited",
          message:
            "Please reset the board before running a new algorithm to ensure accurate and clean results.",
          buttonText: "Reset Board",
        };
      default:
        return {
          title: "No Path Found",
          message:
            "The destination is completely blocked by walls. The algorithm couldn't find a valid route to the target.",
          buttonText: "Try Again",
        };
    }
  };

  const content = getDialogContent();

  const handleAction = () => {
    if (isNoWalls || isDuel) {
      setIsDialogOpen(false, null);
    } else {
      resetGrid();
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            style={{ willChange: "opacity" }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
            onClick={
              isSuccess || isDuel
                ? () => setIsDialogOpen(false, null)
                : handleAction
            }
          />

          {isDuel ? (
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{ willChange: "transform, opacity" }}
              className="relative w-full max-w-2xl bg-slate-950 border border-teal-500/40 rounded-3xl shadow-2xl p-6 sm:p-8 text-white overflow-hidden z-10"
            >
              <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-teal-600/25 border border-teal-500/50 rounded-2xl text-teal-300">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-teal-300 to-emerald-400">
                      Algorithm Duel Analysis
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      Specialized performance comparison between Dijkstra (Blue)
                      and A* Search (Emerald)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDialogOpen(false, null)}
                  className="p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {benchmarkResults.dijkstra && benchmarkResults.aStar && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                  <div className="bg-blue-950/30 border border-blue-500/30 rounded-2xl p-4 sm:p-5 relative">
                    <div className="absolute top-3 right-3 text-blue-400 font-bold text-xs px-2 py-0.5 bg-blue-500/20 rounded-md">
                      Dijkstra
                    </div>
                    <div className="space-y-3 mt-4">
                      <DuelStatRow
                        icon={Clock}
                        iconColor="text-blue-400"
                        label="Execution Time"
                        value={benchmarkResults.dijkstra.time}
                        textColor="text-blue-300"
                      />
                      <DuelStatRow
                        icon={Activity}
                        iconColor="text-blue-400"
                        label="Nodes Visited"
                        value={`${benchmarkResults.dijkstra.visitedCount} nodes`}
                        textColor="text-blue-300"
                      />
                      <DuelStatRow
                        icon={Zap}
                        iconColor="text-blue-400"
                        label="Path Length"
                        value={`${benchmarkResults.dijkstra.pathLength} steps`}
                        textColor="text-blue-300"
                      />
                    </div>
                  </div>

                  <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 relative">
                    <div className="absolute top-3 right-3 text-emerald-400 font-bold text-xs px-2 py-0.5 bg-emerald-500/20 rounded-md">
                      A* Search
                    </div>
                    <div className="space-y-3 mt-4">
                      <DuelStatRow
                        icon={Clock}
                        iconColor="text-emerald-400"
                        label="Execution Time"
                        value={benchmarkResults.aStar.time}
                        textColor="text-emerald-300"
                      />
                      <DuelStatRow
                        icon={Activity}
                        iconColor="text-emerald-400"
                        label="Nodes Visited"
                        value={`${benchmarkResults.aStar.visitedCount} nodes`}
                        textColor="text-emerald-300"
                      />
                      <DuelStatRow
                        icon={Zap}
                        iconColor="text-emerald-400"
                        label="Path Length"
                        value={`${benchmarkResults.aStar.pathLength} steps`}
                        textColor="text-emerald-300"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-start gap-3 mb-6 text-left">
                <Award className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <span className="font-bold text-white">
                    Scientific Conclusion:
                  </span>{" "}
                  Utilizing a heuristic function, the{" "}
                  <span className="text-emerald-400 font-bold">A*</span>{" "}
                  algorithm achieved a more optimal performance than Dijkstra in
                  this scenario by exploring fewer nodes and efficiently
                  optimizing the path.
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setIsDialogOpen(false, null)}
                  className="px-6 py-3 bg-linear-to-r from-blue-600 via-teal-600 to-emerald-600 hover:opacity-95 text-white font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  Confirm and View Board
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{ willChange: "transform, opacity" }}
              className={`relative w-full max-w-md p-7 overflow-hidden text-center bg-slate-950 border ${
                isSuccess
                  ? "border-emerald-500/30"
                  : isAlreadyRun
                    ? "border-teal-500/30"
                    : "border-rose-500/30"
              } rounded-3xl shadow-2xl z-10`}
            >
              <div className="relative mx-auto mb-5 w-16 h-16 flex items-center justify-center">
                <div
                  className={`relative flex items-center justify-center w-16 h-16 rounded-2xl border ${
                    isSuccess
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : isAlreadyRun
                        ? "bg-teal-500/10 border-teal-500/30 text-teal-300"
                        : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                  }`}
                >
                  {isSuccess ? (
                    <CheckCircle2 className="w-9 h-9" />
                  ) : isAlreadyRun ? (
                    <RefreshCw className="w-8 h-8 animate-spin" />
                  ) : (
                    <AlertCircle className="w-8 h-8" />
                  )}
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 tracking-wide">
                {content.title}
              </h3>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed px-2">
                {content.message}
              </p>

              {!isSuccess && (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleAction}
                    className={`w-full py-3.5 px-6 font-semibold text-white transition-all duration-200 rounded-2xl shadow-lg cursor-pointer ${
                      isAlreadyRun
                        ? "bg-linear-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500"
                        : "bg-linear-to-r from-rose-600 to-teal-600 hover:from-rose-500 hover:to-teal-500"
                    }`}
                  >
                    {content.buttonText}
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
};
