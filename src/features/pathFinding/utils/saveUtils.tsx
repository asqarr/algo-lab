import React, { useState } from "react";
import { usePathfindingStore } from "../store/usePathfindingStore";
import { BookmarkCheck, Download, CheckCircle2, AlertCircle } from "lucide-react";

export const handleSaveBoard = (): void => {
  const { grid } = usePathfindingStore.getState();
  try {
    localStorage.setItem("pathfinder_saved_grid", JSON.stringify(grid));
    console.info("Board successfully saved!");
  } catch (error) {
    console.error("Failed to save board state:", error);
  }
};

export const handleLoadBoard = (): boolean => {
  try {
    const savedData = localStorage.getItem("pathfinder_saved_grid");
    if (!savedData) {
      console.warn("No saved board found.");
      return false;
    }

    const parsedGrid = JSON.parse(savedData);
    usePathfindingStore.setState({
      grid: parsedGrid,
      hasRun: false,
      visitedNodesCount: 0,
      pathLength: 0,
      executionTime: "0.000s",
      isDialogOpen: false,
      dialogType: null,
    });
    
    return true;
  } catch (error) {
    console.error("Failed to load board state:", error);
    return false;
  }
};

export const BoardActionButtons: React.FC = () => {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

const onSaveClick = () => {
    handleSaveBoard();
    showToast("Board successfully saved!", "success");
  };

  const onLoadClick = () => {
    const success = handleLoadBoard();
    if (success) {
      showToast("Board successfully loaded!", "success");
    } else {
      showToast("No saved board found!", "error");
    }
  };

  return (
    <div className="relative flex items-center gap-3.5">
      <button
        onClick={onSaveClick}
        className="group relative flex items-center gap-2.5 px-4 py-2 bg-slate-950/70 hover:bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400/80 rounded-xl text-xs font-bold text-cyan-300 transition-all duration-300 shadow-lg shadow-cyan-950/40 hover:shadow-cyan-500/25 cursor-pointer active:scale-95 backdrop-blur-xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-linear-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <BookmarkCheck className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
        <span className="tracking-wide">Save Board</span>
      </button>

      <button
        onClick={onLoadClick}
        className="group relative flex items-center gap-2.5 px-4 py-2 bg-slate-950/70 hover:bg-slate-900/90 border border-fuchsia-500/30 hover:border-fuchsia-400/80 rounded-xl text-xs font-bold text-fuchsia-300 transition-all duration-300 shadow-lg shadow-fuchsia-950/40 hover:shadow-fuchsia-500/25 cursor-pointer active:scale-95 backdrop-blur-xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-linear-to-r from-fuchsia-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <Download className="w-4 h-4 text-fuchsia-400 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(232,121,249,0.5)]" />
        <span className="tracking-wide">Load Board</span>
      </button>

      {toast && (
        <div className="absolute top-12 right-0 z-50 flex items-center gap-2.5 px-4 py-2.5 bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-300 whitespace-nowrap">
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.6)]" />
          )}
          <span
            className={`text-xs font-bold tracking-wide ${
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