import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, X } from "lucide-react";

interface AlgorithmDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlgorithmDocsModal: React.FC<AlgorithmDocsModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-lg p-6 bg-[#0b0f19]/85 border border-slate-700/60 rounded-3xl shadow-2xl shadow-cyan-500/10 backdrop-blur-xl text-slate-300 z-10"
          >
            <div className="flex justify-between items-center mb-4 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Dijkstra Algorithm
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col gap-3 text-sm leading-relaxed mb-6 text-slate-400">
              <p>
                Dijkstra's algorithm is one of the most famous graph pathfinding
                algorithms used to find the shortest path between a source node
                and all other nodes.
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-slate-300 bg-slate-900/50 p-3.5 rounded-2xl border border-slate-800/60">
                <li>
                  Suitable for weighted graphs with non-negative edge weights
                </li>
                <li>Guarantees finding the shortest path</li>
                <li>Uses a priority queue for optimization</li>
              </ul>
            </div>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 font-bold text-white transition-all bg-linear-to-r from-blue-600 via-indigo-600 to-cyan-500 rounded-2xl hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/25 active:scale-[0.98] cursor-pointer"
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
