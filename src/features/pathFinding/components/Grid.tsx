import React, { useCallback, useEffect, useRef } from "react";
import { usePathfindingStore } from "../store/usePathfindingStore";
import { Node } from "./Node";

export const Grid: React.FC = () => {
  const grid = usePathfindingStore((state) => state.grid);
  const toolMode = usePathfindingStore((state) => state.toolMode);
  const toggleWall = usePathfindingStore((state) => state.toggleWall);
  const toggleWeight = usePathfindingStore((state) => state.toggleWeight);

  const isMouseDownRef = useRef(false);
  const targetStateRef = useRef<boolean | null>(null);

  const handleMouseDown = useCallback((row: number, col: number) => {
    isMouseDownRef.current = true;
    const node = grid[row]?.[col];
    if (!node || node.isStart || node.isFinish) return;

    if (toolMode === "wall") {
      targetStateRef.current = !node.isWall;
      toggleWall(row, col);
    } else {
      targetStateRef.current = !node.isWeight;
      toggleWeight(row, col);
    }
  }, [grid, toolMode, toggleWall, toggleWeight]);

  const handleMouseEnter = useCallback((row: number, col: number) => {
    if (!isMouseDownRef.current) return;
    const node = grid[row]?.[col];
    if (!node || node.isStart || node.isFinish) return;

    if (toolMode === "wall") {
      if (node.isWall !== targetStateRef.current) {
        toggleWall(row, col);
      }
    } else {
      if (node.isWeight !== targetStateRef.current) {
        toggleWeight(row, col);
      }
    }
  }, [grid, toolMode, toggleWall, toggleWeight]);

  const handleMouseUp = useCallback(() => {
    isMouseDownRef.current = false;
    targetStateRef.current = null;
  }, []);

  useEffect(() => {
    const onGlobalMouseUp = () => {
      isMouseDownRef.current = false;
      targetStateRef.current = null;
    };

    window.addEventListener("mouseup", onGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", onGlobalMouseUp);
    };
  }, []);

  return (
    <div
      className="p-0.5 bg-[#070913]/80 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-md border border-slate-800/80 flex flex-col items-center justify-center select-none"
      onMouseUp={handleMouseUp}
    >
      <div className="flex flex-col rounded-xl overflow-hidden border border-slate-800/50 bg-[#070913]">
        {grid.map((row, rowIdx) => (
          <div key={rowIdx} className="flex">
            {row.map((node, nodeIdx) => (
              <Node
                key={`${rowIdx}-${nodeIdx}`}
                node={node}
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
                onMouseUp={handleMouseUp}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};