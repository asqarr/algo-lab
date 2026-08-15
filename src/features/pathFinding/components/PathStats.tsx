import React from "react";
import { usePathfindingStore } from "../store/usePathfindingStore";

export const PathStats: React.FC = () => {
  const { pathLength, visitedNodesCount, executionTime, hasRun } =
    usePathfindingStore();

  return (
    <div className="lg:col-span-1 p-7 bg-[#0b0f19]/90 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-5">
      <h3 className="text-sm font-bold tracking-wide uppercase text-slate-400 border-b border-slate-800 pb-3">
        Path Statistics
      </h3>

      <div className="flex flex-col gap-3 text-sm">
        <div className="flex justify-between items-center p-3.5 bg-slate-900/60 rounded-xl border border-slate-800">
          <span className="text-slate-400">Path Length</span>
          <span className="font-bold text-amber-400">
            {pathLength > 0 ? `${pathLength} Steps` : "-- Steps"}
          </span>
        </div>

        <div className="flex justify-between items-center p-3.5 bg-slate-900/60 rounded-xl border border-slate-800">
          <span className="text-slate-400">Visited Nodes</span>
          <span className="font-bold text-blue-400">
            {visitedNodesCount > 0 ? visitedNodesCount : "-- Nodes"}
          </span>
        </div>

        <div className="flex justify-between items-center p-3.5 bg-slate-900/60 rounded-xl border border-slate-800">
          <span className="text-slate-400">Execution Time</span>
          <span className="font-bold text-indigo-400">
            {executionTime !== "0.000s" ? executionTime : "-- s"}
          </span>
        </div>

        <div className="flex justify-between items-center p-3.5 bg-slate-900/60 rounded-xl border border-slate-800">
          <span className="text-slate-400">Efficiency</span>
          <span
            className={`font-bold ${hasRun ? (pathLength > 0 ? "text-green-400" : "text-red-400") : "text-slate-500"}`}
          >
            {hasRun ? (pathLength > 0 ? "Optimal" : "No Path") : "Pending"}
          </span>
        </div>
      </div>
    </div>
  );
};
