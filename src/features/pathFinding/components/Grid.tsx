import React, { useCallback } from "react";
import { usePathfindingStore } from "../store/usePathfindingStore";
import { Node } from "./Node";

export const Grid: React.FC = () => {
  const grid = usePathfindingStore((state) => state.grid);
  const mouseIsPressed = usePathfindingStore((state) => state.mouseIsPressed);
  const toolMode = usePathfindingStore((state) => state.toolMode);
  const setMouseIsPressed = usePathfindingStore((state) => state.setMouseIsPressed);
  const toggleWall = usePathfindingStore((state) => state.toggleWall);
  const toggleWeight = usePathfindingStore((state) => state.toggleWeight);

  const handleAction = useCallback((row: number, col: number) => {
    if (toolMode === "wall") {
      toggleWall(row, col);
    } else {
      toggleWeight(row, col);
    }
  }, [toolMode, toggleWall, toggleWeight]);

  const handleMouseDown = useCallback((row: number, col: number) => {
    handleAction(row, col);
    setMouseIsPressed(true);
  }, [handleAction, setMouseIsPressed]);

  const handleMouseEnter = useCallback((row: number, col: number) => {
    if (!mouseIsPressed) return;
    handleAction(row, col);
  }, [mouseIsPressed, handleAction]);

  const handleMouseUp = useCallback(() => {
    setMouseIsPressed(false);
  }, [setMouseIsPressed]);

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