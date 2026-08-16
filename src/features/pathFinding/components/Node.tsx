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
  const { 
    row, 
    col, 
    isStart, 
    isFinish, 
    isWall, 
    isWeight, 
    isVisited, 
    isShortestPath,
    dijkstraVisited,
    aStarVisited,
    dijkstraPath,
    aStarPath
  } = node;

const getNodeStyle = () => {
    if (isStart) return "bg-emerald-500 rounded-md z-20 shadow-lg shadow-emerald-500/50";
    if (isFinish) return "bg-rose-500 rounded-md z-20 shadow-lg shadow-rose-500/50";
    if (isWall) return "bg-slate-700 rounded-sm scale-95";
    if (isWeight) return "bg-purple-600/80 rounded-sm";
    
    // ترکیب دقیق آبی و سبز (رنگ فیروزه‌ای درخشان برای مسیر مشترک دو الگوریتم)
    if (dijkstraPath && aStarPath) return "bg-teal-300 rounded-sm z-10 shadow-[0_0_12px_rgba(45,212,191,0.8)]";
    
    if (dijkstraPath) return "bg-blue-400 rounded-sm z-10";
    if (aStarPath) return "bg-emerald-400 rounded-sm z-10";

    // تلاقی مناطق بازدیدشده
    if (dijkstraVisited && aStarVisited) return "bg-fuchsia-600 rounded-sm shadow-[0_0_10px_rgba(217,70,239,0.8)] z-10";
    
    if (dijkstraVisited) return "bg-blue-600/70 rounded-sm";
    if (aStarVisited) return "bg-emerald-600/70 rounded-sm";
    if (isShortestPath) return "bg-amber-400 rounded-sm z-10";
    if (isVisited) return "bg-cyan-500/30 rounded-sm";

    return "bg-[#070913] hover:bg-slate-800/40";
  };

  return (
    <div
      id={`node-${row}-${col}`}
      className={`w-6 h-6 inline-flex items-center justify-center border border-slate-900/40 cursor-pointer select-none relative overflow-hidden transition-colors duration-75 ${getNodeStyle()}`}
      onMouseDown={(e) => {
        e.preventDefault(); 
        onMouseDown(row, col);
      }}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={onMouseUp}
    >
      {isWeight && (
        <Zap className="w-3 h-3 text-fuchsia-200 pointer-events-none" />
      )}
      
      {!isStart && !isFinish && !isWall && !isWeight && !isVisited && !isShortestPath && !dijkstraVisited && !aStarVisited && (
        <span className="w-1 h-1 rounded-full bg-slate-800/80 pointer-events-none"></span>
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
    prevProps.node.isShortestPath === nextProps.node.isShortestPath &&
    prevProps.node.dijkstraVisited === nextProps.node.dijkstraVisited &&
    prevProps.node.aStarVisited === nextProps.node.aStarVisited &&
    prevProps.node.dijkstraPath === nextProps.node.dijkstraPath &&
    prevProps.node.aStarPath === nextProps.node.aStarPath
  );
});

Node.displayName = "Node";