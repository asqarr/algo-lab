import React from "react";
import { usePathfindingStore } from "../store/usePathfindingStore";

export const BenchmarkModal: React.FC = () => {
  const { benchmarkResults, runBenchmark } = usePathfindingStore();

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-900 rounded-2xl sm:rounded-xl border border-slate-700 shadow-xl text-white my-3 sm:my-4 w-full max-w-xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-3 sm:gap-0">
        <h3 className="text-base sm:text-lg font-bold">📊 Performance Benchmark & Analytics</h3>
        <button
          onClick={runBenchmark}
          className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl sm:rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer shadow-lg shrink-0"
        >
          Run Instant Benchmark
        </button>
      </div>

      {benchmarkResults.dijkstra && benchmarkResults.aStar ? (
        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[320px]">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400">
                <th className="py-2 px-2 sm:px-3">Algorithm</th>
                <th className="py-2 px-2 sm:px-3">Execution Time</th>
                <th className="py-2 px-2 sm:px-3">Visited Nodes</th>
                <th className="py-2 px-2 sm:px-3">Path Length</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-800 hover:bg-slate-800/50">
                <td className="py-2.5 px-2 sm:px-3 font-medium text-blue-400">Dijkstra</td>
                <td className="py-2.5 px-2 sm:px-3 font-mono">{benchmarkResults.dijkstra.time}</td>
                <td className="py-2.5 px-2 sm:px-3 font-mono">{benchmarkResults.dijkstra.visitedCount}</td>
                <td className="py-2.5 px-2 sm:px-3 font-mono">{benchmarkResults.dijkstra.pathLength}</td>
              </tr>
              <tr className="hover:bg-slate-800/50">
                <td className="py-2.5 px-2 sm:px-3 font-medium text-emerald-400">A* Search</td>
                <td className="py-2.5 px-2 sm:px-3 font-mono">{benchmarkResults.aStar.time}</td>
                <td className="py-2.5 px-2 sm:px-3 font-mono">{benchmarkResults.aStar.visitedCount}</td>
                <td className="py-2.5 px-2 sm:px-3 font-mono">{benchmarkResults.aStar.pathLength}</td>
              </tr>
            </tbody>
          </table>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-3 leading-relaxed">
            💡 Scientific Note: A* utilizes a heuristic function to explore significantly fewer nodes while maintaining optimal pathfinding.
          </p>
        </div>
      ) : (
        <p className="text-xs sm:text-sm text-slate-400 text-center py-2 px-2">
          Create some walls on the grid and click "Run Instant Benchmark".
        </p>
      )}
    </div>
  );
};