import React from "react";
import type { NodeData } from "../types/node";

interface NodeProps {
  node: NodeData;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
}

export const Node: React.FC<NodeProps> = ({
  node,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) => {
  const { row, col, isStart, isFinish, isWall, isVisited, isShortestPath } =
    node;

  return (
    <div
      id={`node-${row}-${col}`}
      className={`w-6 h-6 inline-flex items-center justify-center border border-slate-800/60 transition-all duration-300 ease-out cursor-pointer select-none
        ${
          isStart
            ? "bg-green-500 scale-110 shadow-[0_0_15px_rgba(34,197,94,0.7)] rounded-md z-10"
            : isFinish
              ? "bg-red-500 scale-110 shadow-[0_0_15px_rgba(239,68,68,0.7)] rounded-md z-10"
              : isShortestPath
                ? "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)] animate-[pulse_1s_ease-in-out_infinite] z-10"
                : isWall
                  ? "bg-slate-950 border-slate-800 scale-95 rounded-sm"
                  : isVisited
                    ? "bg-cyan-500/40 border-cyan-500/30 animate-[grow_0.5s_ease-out]"
                    : "bg-[#0b0f19]"
        }`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={onMouseUp}
    >
      {!isStart && !isFinish && !isWall && !isVisited && !isShortestPath && (
        <span className="w-1 h-1 rounded-full bg-blue-500/60 inline-block"></span>
      )}
    </div>
  );
};
