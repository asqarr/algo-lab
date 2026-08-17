import React, { useState } from "react";
import {
  Bookmark,
  BookOpen,
  Sparkles,
  Wand2,
  Shield,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { usePathfindingStore } from "../store/usePathfindingStore";

interface NavbarProps {
  onSave: () => void;
  onOpenDocs: () => void;
}

export const handleSaveBoard = () => {
  const { grid } = usePathfindingStore.getState();

  try {
    localStorage.setItem("pathfinder_saved_grid", JSON.stringify(grid));
    console.info("Board successfully saved!");
  } catch (error) {
    console.error("Failed to save board state:", error);
  }
};

export const SaveButton: React.FC = () => {
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const onSaveClick = () => {
    try {
      handleSaveBoard();
      showToast("Map successfully saved!", "success");
    } catch {
      showToast("Error saving map!", "error");
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={onSaveClick}
        className="group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer shadow-lg shadow-indigo-600/25 border border-indigo-400/20 active:scale-95"
      >
        <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 animate-pulse transition-transform duration-300 group-hover:scale-110" />
        <span className="hidden xs:inline">Save Page</span>
      </button>

      {toast && (
        <div className="absolute top-12 right-0 z-50 flex items-center flex-row-reverse gap-2.5 px-3 py-2 bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-300 whitespace-nowrap">
          {toast.type === "success" ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.6)]" />
          )}
          <span
            className={`text-[11px] font-bold tracking-wide ${
              toast.type === "success" ? "text-emerald-200" : "text-rose-200"
            }`}
          >
            {toast.message}
          </span>
        </div>
      )}
    </div>
  );
};

export const Navbar: React.FC<NavbarProps> = ({ onSave, onOpenDocs }) => {
  const { toolMode, setToolMode } = usePathfindingStore();

  return (
    <header className="w-full flex flex-col md:flex-row items-center justify-between px-3 sm:px-8 py-3.5 gap-3 bg-[#0b0f19]/90 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-50 shadow-2xl shadow-black/40">
      <div className="w-full md:w-auto flex items-center justify-between md:justify-start gap-3 group cursor-pointer">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/30 blur-xl rounded-full group-hover:bg-cyan-400/40 transition-all duration-300"></div>

            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-linear-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30 border border-white/10 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-pulse" />
            </div>
          </div>

          <div>
            <h1 className="text-sm sm:text-xl font-black tracking-wider text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-fuchsia-400 to-indigo-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              ALGO-VISUALIZER
            </h1>

            <p className="text-[9px] sm:text-[10px] text-cyan-400/90 font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase drop-shadow-[0_0_8px_rgba(34,211,238,0.25)]">
              Pathfinding Studio
            </p>
          </div>
        </div>

        <div className="flex md:hidden items-center bg-slate-950/80 border border-slate-800/80 rounded-xl p-1 gap-1">
          <button
            onClick={() => setToolMode("wall")}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
              toolMode === "wall"
                ? "from-blue-600 via-indigo-600 to-cyan-600 text-white shadow"
                : "text-slate-400"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setToolMode("weight")}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
              toolMode === "weight"
                ? "from-purple-600 via-fuchsia-600 to-pink-600 text-white shadow"
                : "text-slate-400"
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-2 sm:gap-3">
        <div className="hidden md:flex items-center bg-slate-950/80 border border-slate-800/80 rounded-2xl p-1.5 gap-1.5 shadow-inner backdrop-blur-md">
          <button
            onClick={() => setToolMode("wall")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
              toolMode === "wall"
                ? "from-blue-600 via-indigo-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/20 scale-[1.02]"
                : "text-slate-400 hover:text-white hover:bg-slate-900/60"
            }`}
          >
            <Shield
              className={`w-3.5 h-3.5 transition-transform duration-300 ${
                toolMode === "wall" ? "scale-110 text-cyan-300" : ""
              }`}
            />
            <span>Wall</span>
          </button>

          <button
            onClick={() => setToolMode("weight")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
              toolMode === "weight"
                ? "from-purple-600 via-fuchsia-600 to-pink-600 text-white shadow-lg shadow-fuchsia-500/25 scale-[1.02]"
                : "text-slate-400 hover:text-white hover:bg-slate-900/60"
            }`}
          >
            <Wand2
              className={`w-3.5 h-3.5 transition-transform duration-300 ${
                toolMode === "weight" ? "scale-110 text-fuchsia-300" : ""
              }`}
            />
            <span>Weight (5x)</span>
          </button>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <SaveButton />

          <button
            onClick={onOpenDocs}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer shadow-lg shadow-indigo-600/25 border border-indigo-400/20"
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 animate-pulse transition-transform duration-300 group-hover:scale-110" />
            <span className="text-xs sm:text-sm">Algorithm Docs</span>
          </button>
        </div>
      </div>
    </header>
  );
};