import React, { memo } from "react";
import type { NodeData } from "../types/node";
import { Zap } from "lucide-react";

interface NodeProps {
  node: NodeData;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
}

export const Node: React.FC<NodeProps> = memo(({
  node,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) => {
  const { row, col, isStart, isFinish, isWall, isWeight, isVisited, isShortestPath } =
    node;

  return (
    <div
      id={`node-${row}-${col}`}
      className={`w-6 h-6 inline-flex items-center justify-center border transition-all duration-300 ease-out cursor-pointer select-none relative overflow-hidden ${
        isStart
          ? "bg-gradient-to-tr from-emerald-600 to-green-400 border-green-300 scale-110 shadow-[0_0_20px_rgba(34,197,94,0.8)] rounded-lg z-20 animate-bounce"
          : isFinish
            ? "bg-gradient-to-tr from-rose-600 to-red-500 border-red-300 scale-110 shadow-[0_0_20px_rgba(239,68,68,0.8)] rounded-lg z-20 animate-pulse"
            : isShortestPath
              ? "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 border-amber-200 shadow-[0_0_18px_rgba(251,191,36,0.9)] scale-105 rounded-md z-10 animate-[pulse_1s_ease-in-out_infinite]"
              : isWall
                ? "bg-gradient-to-br from-slate-700 to-slate-900 border-slate-500/80 shadow-[0_0_10px_rgba(148,163,184,0.3)] scale-95 rounded-md"
                : isWeight
                  ? "bg-purple-900/60 border-purple-500/60 shadow-[0_0_12px_rgba(168,85,247,0.6)] rounded-md hover:scale-105"
                  : isVisited
                    ? "bg-cyan-500/30 border-cyan-400/40 shadow-[0_0_8px_rgba(6,182,212,0.3)] rounded-sm animate-[fadeIn_0.4s_ease-out]"
                    : "bg-[#070913] border-slate-900/60 hover:border-cyan-500/30 hover:bg-slate-900/50"
      }`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={onMouseUp}
    >
      {isWeight && (
        <Zap className="w-3.5 h-3.5 text-fuchsia-300 drop-shadow-[0_0_5px_rgba(217,70,239,0.8)] animate-pulse" />
      )}
      
      {!isStart && !isFinish && !isWall && !isWeight && !isVisited && !isShortestPath && (
        <span className="w-1 h-1 rounded-full bg-slate-800 inline-block transition-colors duration-300"></span>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.node.isStart === nextProps.node.isStart &&
    prevProps.node.isFinish === nextProps.node.isFinish &&
    prevProps.node.isWall === nextProps.node.isWall &&
    prevProps.node.isWeight === nextProps.node.isWeight &&
    prevProps.node.isVisited === nextProps.node.isVisited &&
    prevProps.node.isShortestPath === nextProps.node.isShortestPath
  );
});

Node.displayName = "Node";