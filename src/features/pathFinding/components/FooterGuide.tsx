import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, X } from 'lucide-react';

export const FooterGuide: React.FC = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center justify-around gap-4 p-4 bg-[#0b0f19]/90 rounded-2xl border border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400"></span>
          <span>Click to select start point</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-400"></span>
          <span>Click to select finish point</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
          <span>Drag mouse to draw walls</span>
        </div>
        
        <button
          onClick={() => setIsHelpOpen(true)}
          className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-xl border border-amber-500/20"
        >
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span className="font-medium">Need Help</span>
        </button>
      </div>

      <AnimatePresence>
        {isHelpOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setIsHelpOpen(false)}
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="relative w-full max-w-md p-6 bg-[#0b0f19]/85 border border-slate-700/60 rounded-3xl shadow-2xl shadow-amber-500/10 backdrop-blur-xl text-slate-300 z-10"
            >
              <div className="flex justify-between items-center mb-4 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">How to Use</h3>
                </div>
                <button 
                  onClick={() => setIsHelpOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-3 text-sm leading-relaxed mb-6 text-slate-400">
                <p className="text-slate-300">
                  Welcome to the Pathfinding Visualizer! Here is a quick guide on how to interact with the grid:
                </p>
                <ul className="space-y-2.5 bg-slate-900/50 p-3.5 rounded-2xl border border-slate-800/60 text-xs">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 shrink-0"></span>
                    <span><strong>Start Point:</strong> The green node where the algorithm begins.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400 shrink-0"></span>
                    <span><strong>Finish Point:</strong> The red node you want to reach.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0"></span>
                    <span><strong>Walls:</strong> Click and drag across the grid to draw obstacles.</span>
                  </li>
                </ul>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setIsHelpOpen(false)}
                  className="w-full py-3 font-bold text-white transition-all bg-linear-to-r from-amber-500 to-orange-500 rounded-2xl hover:scale-[1.02] hover:shadow-lg hover:shadow-amber-500/25 active:scale-[0.98] cursor-pointer"
                >
                  Got it, thanks!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};