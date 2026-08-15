import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathfindingStore } from "../store/usePathfindingStore";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export const PathDialog: React.FC = () => {
  const { isDialogOpen, dialogType, resetGrid, setIsDialogOpen } =
    usePathfindingStore();

  const isSuccess = dialogType === "success";

  const getDialogContent = () => {
    if (dialogType === "success") {
      return {
        title: "Path Successfully Found!",
        message:
          "The shortest route has been successfully calculated and displayed.",
        buttonText: "",
      };
    }
    if (dialogType === "noWalls") {
      return {
        title: "No Walls Drawn",
        message:
          "Please draw some walls or obstacles on the grid before running the algorithm!",
        buttonText: "Got it",
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
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={isSuccess ? undefined : handleAction}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-md p-6 overflow-hidden text-center bg-[#0b0f19]/80 border border-slate-700/60 rounded-3xl shadow-2xl shadow-cyan-500/10 backdrop-blur-xl z-10"
          >
            <div
              className={`flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-2xl border ${
                isSuccess
                  ? "bg-green-500/10 border-green-500/20 text-green-400"
                  : "bg-red-500/10 border-red-500/20 text-red-400"
              }`}
            >
              {isSuccess ? (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="flex items-center justify-center"
                >
                  <CheckCircle2 className="w-8 h-8" />
                </motion.div>
              ) : (
                <AlertCircle className="w-7 h-7" />
              )}
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              {content.title}
            </h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              {content.message}
            </p>

            {!isSuccess && (
              <button
                onClick={handleAction}
                className="w-full py-3.5 px-6 font-bold text-white transition-all bg-linear-to-r from-blue-600 via-indigo-600 to-cyan-500 rounded-2xl hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/25 active:scale-[0.98] cursor-pointer"
              >
                {content.buttonText}
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
