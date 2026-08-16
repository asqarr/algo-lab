import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathfindingStore } from "../store/usePathfindingStore";
import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";

export const PathDialog: React.FC = () => {
  const { isDialogOpen, dialogType, resetGrid, setIsDialogOpen } =
    usePathfindingStore();

  const isSuccess = dialogType === "success";
  const isAlreadyRun = dialogType === "alreadyRun";

  const getDialogContent = () => {
    if (dialogType === "success") {
      return {
        title: "Path Successfully Found!",
        message:
          "The shortest route has been successfully calculated and displayed with optimal accuracy.",
      };
    }
    if (dialogType === "noWalls") {
      return {
        title: "No Walls Drawn",
        message:
          "Please draw some walls or obstacles on the grid before running the pathfinding algorithm!",
        buttonText: "Got it",
      };
    }
    if (dialogType === "alreadyRun") {
      return {
        title: "Board Already Visited",
        message:
          "Please reset the board before running a new algorithm to ensure accurate and clean results.",
        buttonText: "Reset Board",
      };
    }
    return {
      title: "No Path Found",
      message:
        "The destination is completely blocked by walls. The algorithm couldn't find a valid route to the target.",
      buttonText: "Try Again",
    };
  };

  const content = getDialogContent();

  const handleAction = () => {
    if (dialogType === "noWalls") {
      setIsDialogOpen(false, null);
    } else {
      resetGrid(); 
    }
  };

  return (
    <AnimatePresence>
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-[#030712]/80 backdrop-blur-xl"
            onClick={isSuccess ? () => setIsDialogOpen(false, null) : handleAction}
          />

          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 25 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 25 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className={`relative w-full max-w-md p-7 overflow-hidden text-center bg-slate-950/90 border ${
              isSuccess
                ? "border-emerald-500/30 shadow-emerald-500/10"
                : isAlreadyRun
                ? "border-amber-500/30 shadow-amber-500/10"
                : "border-rose-500/30 shadow-rose-500/10"
            } rounded-3xl shadow-2xl backdrop-blur-2xl z-10`}
          >
            <div className="relative mx-auto mb-5 w-16 h-16 flex items-center justify-center">
              <div
                className={`absolute inset-0 rounded-2xl blur-xl opacity-40 animate-pulse ${
                  isSuccess
                    ? "bg-emerald-500"
                    : isAlreadyRun
                    ? "bg-amber-500"
                    : "bg-rose-500"
                }`}
              />
              <div
                className={`relative flex items-center justify-center w-16 h-16 rounded-2xl border ${
                  isSuccess
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : isAlreadyRun
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                } shadow-inner`}
              >
                {isSuccess ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 250, damping: 12, delay: 0.1 }}
                  >
                    <CheckCircle2 className="w-9 h-9" />
                  </motion.div>
                ) : isAlreadyRun ? (
                  <RefreshCw className="w-8 h-8 animate-spin" />
                ) : (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 250, damping: 12, delay: 0.1 }}
                  >
                    <AlertCircle className="w-8 h-8" />
                  </motion.div>
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
                  className={`w-full py-3.5 px-6 font-semibold text-white transition-all duration-300 rounded-2xl shadow-lg active:scale-[0.98] cursor-pointer ${
                    isAlreadyRun
                      ? "bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 shadow-amber-600/25 border border-amber-400/20"
                      : "bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 shadow-rose-600/25 border border-rose-400/20"
                  }`}
                >
                  {content.buttonText}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};