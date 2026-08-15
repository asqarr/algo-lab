import React from "react";
import { usePathfindingStore } from "../store/usePathfindingStore";
import { Node } from "./Node";

export const Grid: React.FC = () => {
  const { grid, mouseIsPressed, setMouseIsPressed, toggleWall } =
    usePathfindingStore();

  const handleMouseDown = (row: number, col: number) => {
    toggleWall(row, col);
    setMouseIsPressed(true);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!mouseIsPressed) return;
    toggleWall(row, col);
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
  };

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
                key={nodeIdx}
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
