import React from "react";
import { usePathfindingStore } from "../store/usePathfindingStore";

export const BenchmarkModal: React.FC = () => {
  const { benchmarkResults, runBenchmark } = usePathfindingStore();

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-slate-900 rounded-xl border border-slate-700 shadow-xl text-white my-4">
      <div className="flex justify-between items-center w-full">
        <h3 className="text-lg font-bold">📊 Performance Benchmark & Analytics</h3>
        <button
          onClick={runBenchmark}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold transition"
        >
          Run Instant Benchmark
        </button>
      </div>

      {benchmarkResults.dijkstra && benchmarkResults.aStar ? (
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400">
                <th className="py-2 px-3">Algorithm</th>
                <th className="py-2 px-3">Execution Time</th>
                <th className="py-2 px-3">Visited Nodes</th>
                <th className="py-2 px-3">Path Length</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-800 hover:bg-slate-800/50">
                <td className="py-2 px-3 font-medium text-blue-400">Dijkstra</td>
                <td className="py-2 px-3">{benchmarkResults.dijkstra.time}</td>
                <td className="py-2 px-3">{benchmarkResults.dijkstra.visitedCount}</td>
                <td className="py-2 px-3">{benchmarkResults.dijkstra.pathLength}</td>
              </tr>
              <tr className="hover:bg-slate-800/50">
                <td className="py-2 px-3 font-medium text-emerald-400">A* Search</td>
                <td className="py-2 px-3">{benchmarkResults.aStar.time}</td>
                <td className="py-2 px-3">{benchmarkResults.aStar.visitedCount}</td>
                <td className="py-2 px-3">{benchmarkResults.aStar.pathLength}</td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs text-slate-400 mt-3">
            💡 Scientific Note: A* utilizes a heuristic function to explore significantly fewer nodes while maintaining optimal pathfinding.
          </p>
        </div>
      ) : (
        <p className="text-sm text-slate-400 text-center py-2">
          Create some walls on the grid and click "Run Instant Benchmark".
        </p>
      )}
    </div>
  );
};