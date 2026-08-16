import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, X, Shield, Wand2, Play, Cpu } from "lucide-react";

export const FooterGuide: React.FC = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#0b0f19]/90 rounded-2xl border border-slate-800 text-xs text-slate-400">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800/80 shadow-inner backdrop-blur-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-sm shadow-emerald-500/80"></span>
            </span>
            <span className="text-slate-300 font-medium text-xs tracking-wide">
              Start Node
            </span>
          </div>

          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800/80 shadow-inner backdrop-blur-sm">
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
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500 shadow-sm shadow-blue-500/80"></span>
            </span>
            <span className="text-slate-300 font-medium text-xs tracking-wide">
              Draw Walls / Weights
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsHelpOpen(true)}
          className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer bg-amber-500/10 hover:bg-amber-500/20 px-3.5 py-1.5 rounded-xl border border-amber-500/20 shadow-lg shadow-amber-500/5"
        >
          <Lightbulb className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="font-semibold">Guide & Features</span>
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
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              onClick={() => setIsHelpOpen(false)}
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="relative w-full max-w-lg p-6 bg-[#0b0f19]/90 border border-slate-700/60 rounded-3xl shadow-2xl shadow-amber-500/10 backdrop-blur-xl text-slate-300 z-10"
            >
              <div className="flex justify-between items-center mb-5 border-b border-slate-800/80 pb-3.5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-inner">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-wide">Studio Guide & Features</h3>
                    <p className="text-xs text-slate-400">Everything you need to know about Pathfinding Studio</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsHelpOpen(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-3 text-sm leading-relaxed mb-6 text-slate-400 max-h-[60vh] overflow-y-auto pr-1">
                <p className="text-slate-300 text-xs sm:text-sm">
                  Welcome to <strong className="text-white">Pathfinding Studio</strong>! Use this interactive tool to visualize how different graph traversal algorithms find paths across grids.
                </p>

                <div className="grid grid-cols-1 gap-2.5 text-xs">
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 mt-1"></span>
                    <div>
                      <strong className="text-slate-200 block mb-0.5">Start & Finish Nodes</strong>
                      <span className="text-slate-400">The green node is the starting point, and the red node is your target destination.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                    <div className="p-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0 mt-0.5">
                      <Shield className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <strong className="text-slate-200 block mb-0.5">Walls (Obstacles)</strong>
                      <span className="text-slate-400">Completely impassable barriers. Algorithms must route around them.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                    <div className="p-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0 mt-0.5">
                      <Wand2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <strong className="text-slate-200 block mb-0.5">Weights / Swamps (5x)</strong>
                      <span className="text-slate-400">Difficult terrain nodes. Algorithms can pass through them, but at 5x higher traversal cost.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                    <div className="p-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0 mt-0.5">
                      <Cpu className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <strong className="text-slate-200 block mb-0.5">Algorithms & Random Mazes</strong>
                      <span className="text-slate-400">Switch tools between Walls and Weights, generate smart random mazes, and compare algorithm performances instantly!</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setIsHelpOpen(false)}
                  className="w-full py-3 font-bold text-white transition-all bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl hover:scale-[1.01] hover:shadow-lg hover:shadow-amber-500/25 active:scale-[0.98] cursor-pointer shadow-md"
                >
                  Got it, let's explore!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};