import { create } from "zustand";
import type { NodeData } from "../types/node";
import { dijkstra } from "../utils/dijkstra";
import { aStar } from "../utils/aStar";
import { bidirectionalAStar } from "../utils/bidirectionalAStar";
import { jumpPointSearch } from "../utils/jumpPointSearch";

const ROWS = 15;
const COLS = 37;

const START_NODE_ROW = Math.floor(ROWS / 2);
const START_NODE_COL = 3;
const FINISH_NODE_ROW = Math.floor(ROWS / 2);
const FINISH_NODE_COL = COLS - 4;

const createInitialGrid = (): NodeData[][] => {
  const grid: NodeData[][] = [];
  for (let row = 0; row < ROWS; row++) {
    const currentRow: NodeData[] = [];
    for (let col = 0; col < COLS; col++) {
      currentRow.push({
        row,
        col,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
        distance: Infinity,
        weight: 1,
        isVisited: false,
        isWall: false,
        isWeight: false,
        isShortestPath: false,
        previousNode: null,
        dijkstraVisited: false,
        aStarVisited: false,
        dijkstraPath: false,
        aStarPath: false,
      });
    }
    grid.push(currentRow);
  }
  return grid;
};

const getGridMetrics = (grid: NodeData[][]) => {
  let startCoords = { row: 0, col: 0 };
  let finishCoords = { row: 0, col: 0 };
  let hasObstacles = false;

  grid.forEach((row, rIdx) => {
    row.forEach((node, cIdx) => {
      if (node.isWall || node.isWeight) hasObstacles = true;
      if (node.isStart) startCoords = { row: rIdx, col: cIdx };
      if (node.isFinish) finishCoords = { row: rIdx, col: cIdx };
    });
  });

  return { startCoords, finishCoords, hasObstacles };
};

interface BenchmarkResultData {
  time: string;
  visitedCount: number;
  pathLength: number;
}

interface PathfindingState {
  grid: NodeData[][];
  mouseIsPressed: boolean;
  toolMode: "wall" | "weight";
  visitedNodesCount: number;
  pathLength: number;
  executionTime: string;
  hasRun: boolean;
  isDialogOpen: boolean;
  dialogType: "success" | "noPath" | "noWalls" | "alreadyRun" | "duel" | null;
  benchmarkResults: {
    dijkstra: BenchmarkResultData | null;
    aStar: BenchmarkResultData | null;
  };
  setMouseIsPressed: (pressed: boolean) => void;
  setToolMode: (mode: "wall" | "weight") => void;
  toggleWall: (row: number, col: number) => void;
  toggleWeight: (row: number, col: number) => void;
  runAlgorithm: (algorithm: 'dijkstra' | 'aStar' | 'bidirectional' | 'jps') => Promise<void>;
  runDijkstra: () => Promise<void>;
  runAStar: () => Promise<void>;
  runBidirectional: () => Promise<void>;
  runJPS: () => Promise<void>;
  runBenchmark: () => void;
  runDuel: () => Promise<void>;
  resetGrid: () => void;
  clearWalls: () => void;
  randomizeWalls: () => void;
  saveBoard: () => void;
  loadSavedBoard: () => boolean;
  setIsDialogOpen: (
    isOpen: boolean,
    type?: "success" | "noPath" | "noWalls" | "alreadyRun" | "duel" | null,
  ) => void;
}

export const usePathfindingStore = create<PathfindingState>((set, get) => ({
  grid: createInitialGrid(),
  mouseIsPressed: false,
  toolMode: "wall",
  visitedNodesCount: 0,
  pathLength: 0,
  executionTime: "0.000s",
  hasRun: false,
  isDialogOpen: false,
  dialogType: null,
  benchmarkResults: { dijkstra: null, aStar: null },

  setMouseIsPressed: (pressed) => set({ mouseIsPressed: pressed }),
  setToolMode: (mode) => set({ toolMode: mode }),
  setIsDialogOpen: (isOpen, type = null) =>
    set({ isDialogOpen: isOpen, dialogType: type }),

  toggleWall: (row, col) => {
    const grid = get().grid;
    const node = grid[row]?.[col];
    if (!node || node.isStart || node.isFinish) return;

    const newGrid = grid.map((r, rIdx) => 
      r.map((n, cIdx) => {
        if (rIdx === row && cIdx === col) {
          return { ...n, isWall: !n.isWall, isWeight: false, weight: 1 };
        }
        return n;
      })
    );
    set({ grid: newGrid });
  },

  toggleWeight: (row, col) => {
    const grid = get().grid;
    const node = grid[row]?.[col];
    if (!node || node.isStart || node.isFinish) return;

    const newIsWeight = !node.isWeight;
    const newGrid = grid.map((r, rIdx) => 
      r.map((n, cIdx) => {
        if (rIdx === row && cIdx === col) {
          return {
            ...n,
            isWeight: newIsWeight,
            weight: newIsWeight ? 5 : 1,
            isWall: false,
          };
        }
        return n;
      })
    );
    set({ grid: newGrid });
  },

  randomizeWalls: () => {
    const { toolMode, grid } = get();
    
    const newGrid = grid.map((row) =>
      row.map((node) => {
        if (node.isStart || node.isFinish) return node;
        const isRandomActive = Math.random() < 0.25;

        return {
          ...node,
          isWall: toolMode === 'wall' ? isRandomActive : false,
          isWeight: toolMode === 'weight' ? isRandomActive : false,
          weight: toolMode === 'weight' && isRandomActive ? 5 : 1,
          isVisited: false,
          isShortestPath: false,
          distance: Infinity,
          previousNode: null,
          dijkstraVisited: false,
          aStarVisited: false,
          dijkstraPath: false,
          aStarPath: false,
        };
      })
    );

    set({ 
      grid: newGrid, 
      hasRun: false,
      visitedNodesCount: 0,
      pathLength: 0,
      executionTime: "0.000s"
    });
  },

  saveBoard: () => {
    try {
      localStorage.setItem('pathfinder_saved_grid', JSON.stringify(get().grid));
    } catch (error) {
      console.error('Failed to save board state:', error);
    }
  },

  loadSavedBoard: () => {
    try {
      const savedData = localStorage.getItem('pathfinder_saved_grid');
      if (!savedData) return false;

      set({
        grid: JSON.parse(savedData),
        hasRun: false,
        visitedNodesCount: 0,
        pathLength: 0,
        executionTime: "0.000s",
        isDialogOpen: false,
        dialogType: null,
      });
      return true;
    } catch (error) {
      console.error('Failed to load board state:', error);
      return false;
    }
  },

  runAlgorithm: async (algorithm) => {
    const state = get();
    if (state.hasRun) {
      set({ isDialogOpen: true, dialogType: "alreadyRun" });
      return;
    }

    const { startCoords, finishCoords, hasObstacles } = getGridMetrics(state.grid);
    if (!hasObstacles) {
      set({ isDialogOpen: true, dialogType: "noWalls" });
      return;
    }

    const startTime = performance.now();

    const algorithmMap = {
      dijkstra,
      aStar,
      bidirectional: bidirectionalAStar,
      jps: jumpPointSearch,
    };

    const algorithmFn = algorithmMap[algorithm] || dijkstra;
    const { visitedNodesInOrder, nodesInShortestPath, pathFound } = algorithmFn(
      state.grid,
      startCoords,
      finishCoords
    );

    const gridCopy = state.grid.map((row) => row.map((node) => ({ ...node })));

    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      const node = visitedNodesInOrder[i];
      if (gridCopy[node.row]?.[node.col]) {
        gridCopy[node.row][node.col].isVisited = true;
        
        if (i % 8 === 0 || i === visitedNodesInOrder.length - 1) {
          set({
            grid: gridCopy.map(row => [...row]),
            visitedNodesCount: i + 1,
          });
          await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 1)));
        }
      }
    }

    let finalPathFound = false;
    if (pathFound && nodesInShortestPath.length > 1) {
      finalPathFound = true;
      for (const node of nodesInShortestPath) {
        if (gridCopy[node.row]?.[node.col]) {
          gridCopy[node.row][node.col].isShortestPath = true;
          set({ grid: gridCopy.map(row => [...row]) });
          await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 5))); 
        }
      }
    }

    const endTime = performance.now();
    const totalTime = ((endTime - startTime) / 1000).toFixed(3) + "s";

    set({
      grid: gridCopy.map(row => [...row]),
      pathLength: finalPathFound ? nodesInShortestPath.length - 1 : 0,
      executionTime: totalTime,
      hasRun: true,
      isDialogOpen: true,
      dialogType: finalPathFound ? "success" : "noPath",
    });

    if (finalPathFound) {
      setTimeout(() => {
        if (get().dialogType === "success") {
          set({ isDialogOpen: false, dialogType: null });
        }
      }, 2000);
    }
  },

  runDijkstra: async () => get().runAlgorithm('dijkstra'),
  runAStar: async () => get().runAlgorithm('aStar'),
  runBidirectional: async () => get().runAlgorithm('bidirectional'),
  runJPS: async () => get().runAlgorithm('jps'),

  runBenchmark: () => {
    const { startCoords, finishCoords, hasObstacles } = getGridMetrics(get().grid);
    if (!hasObstacles) {
      set({ isDialogOpen: true, dialogType: "noWalls" });
      return;
    }

    const t1Start = performance.now();
    const dRes = dijkstra(get().grid, startCoords, finishCoords);
    const t1End = performance.now();

    const t2Start = performance.now();
    const aRes = aStar(get().grid, startCoords, finishCoords);
    const t2End = performance.now();

    set({
      benchmarkResults: {
        dijkstra: {
          time: (t1End - t1Start).toFixed(2) + " ms",
          visitedCount: dRes.visitedNodesInOrder.length,
          pathLength: dRes.pathFound ? dRes.nodesInShortestPath.length - 1 : 0,
        },
        aStar: {
          time: (t2End - t2Start).toFixed(2) + " ms",
          visitedCount: aRes.visitedNodesInOrder.length,
          pathLength: aRes.pathFound ? aRes.nodesInShortestPath.length - 1 : 0,
        },
      },
    });
  },

  runDuel: async () => {
    const { startCoords, finishCoords, hasObstacles } = getGridMetrics(get().grid);
    if (!hasObstacles) {
      set({ isDialogOpen: true, dialogType: "noWalls" });
      return;
    }

    const t1Start = performance.now();
    const dRes = dijkstra(get().grid, startCoords, finishCoords);
    const t1End = performance.now();

    const t2Start = performance.now();
    const aRes = aStar(get().grid, startCoords, finishCoords);
    const t2End = performance.now();

    const gridCopy = get().grid.map((row) => row.map((node) => ({ ...node })));

    dRes.visitedNodesInOrder.forEach((node) => {
      if (gridCopy[node.row]?.[node.col]) gridCopy[node.row][node.col].dijkstraVisited = true;
    });
    if (dRes.pathFound) {
      dRes.nodesInShortestPath.forEach((node) => {
        if (gridCopy[node.row]?.[node.col]) gridCopy[node.row][node.col].dijkstraPath = true;
      });
    }

    aRes.visitedNodesInOrder.forEach((node) => {
      if (gridCopy[node.row]?.[node.col]) gridCopy[node.row][node.col].aStarVisited = true;
    });
    if (aRes.pathFound) {
      aRes.nodesInShortestPath.forEach((node) => {
        if (gridCopy[node.row]?.[node.col]) gridCopy[node.row][node.col].aStarPath = true;
      });
    }

    set({
      grid: gridCopy,
      hasRun: true,
      isDialogOpen: true,
      dialogType: "duel",
      benchmarkResults: {
        dijkstra: {
          time: (t1End - t1Start).toFixed(2) + " ms",
          visitedCount: dRes.visitedNodesInOrder.length,
          pathLength: dRes.pathFound ? dRes.nodesInShortestPath.length - 1 : 0,
        },
        aStar: {
          time: (t2End - t2Start).toFixed(2) + " ms",
          visitedCount: aRes.visitedNodesInOrder.length,
          pathLength: aRes.pathFound ? aRes.nodesInShortestPath.length - 1 : 0,
        },
      },
    });
  },

  resetGrid: () => {
    set({
      grid: createInitialGrid(),
      visitedNodesCount: 0,
      pathLength: 0,
      executionTime: "0.000s",
      hasRun: false,
      isDialogOpen: false,
      dialogType: null,
      benchmarkResults: { dijkstra: null, aStar: null },
    });
  },

  clearWalls: () => {
    const newGrid = get().grid.map((row) =>
      row.map((node) => ({
        ...node,
        isWall: false,
        isWeight: false,
        weight: 1,
        isVisited: false,
        isShortestPath: false,
        distance: Infinity,
        previousNode: null,
        dijkstraVisited: false,
        aStarVisited: false,
        dijkstraPath: false,
        aStarPath: false,
      }))
    );
    set({
      grid: newGrid,
      visitedNodesCount: 0,
      pathLength: 0,
      executionTime: "0.000s",
      hasRun: false,
      isDialogOpen: false,
      dialogType: null,
      benchmarkResults: { dijkstra: null, aStar: null },
    });
  },
}));