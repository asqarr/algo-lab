import { create } from "zustand";
import type { NodeData } from "../types/node";
import { dijkstra } from "../utils/dijkstra";
import { aStar } from "../utils/aStar";

let ROWS = 13;
let COLS = 37;

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
        isVisited: false,
        isWall: false,
        isShortestPath: false,
        previousNode: null,
      });
    }
    grid.push(currentRow);
  }
  return grid;
};

interface BenchmarkResultData {
  time: string;
  visitedCount: number;
  pathLength: number;
}

interface PathfindingState {
  grid: NodeData[][];
  mouseIsPressed: boolean;
  visitedNodesCount: number;
  pathLength: number;
  executionTime: string;
  hasRun: boolean;
  isDialogOpen: boolean;
  dialogType: "success" | "noPath" | "noWalls" | null;
  benchmarkResults: {
    dijkstra: BenchmarkResultData | null;
    aStar: BenchmarkResultData | null;
  };
  setMouseIsPressed: (pressed: boolean) => void;
  toggleWall: (row: number, col: number) => void;
  runAlgorithm: (algorithm: 'dijkstra' | 'aStar') => Promise<void>;
  runDijkstra: () => Promise<void>;
  runAStar: () => Promise<void>;
  runBenchmark: () => void;
  resetGrid: () => void;
  clearWalls: () => void;
  randomizeWalls: () => void;
  setIsDialogOpen: (
    isOpen: boolean,
    type?: "success" | "noPath" | "noWalls" | null,
  ) => void;
}

export const usePathfindingStore = create<PathfindingState>((set, get) => ({
  randomizeWalls: () => {
  const newGrid = get().grid.map((row) =>
    row.map((node) => {
      if (node.isStart || node.isFinish) return node;
      
      const isWall = Math.random() < 0.25; 
      return { ...node, isWall, isVisited: false, isShortestPath: false };
    })
  );
  set({ grid: newGrid, hasRun: false });
},
  grid: createInitialGrid(),
  mouseIsPressed: false,
  visitedNodesCount: 0,
  pathLength: 0,
  executionTime: "0.000s",
  hasRun: false,
  isDialogOpen: false,
  dialogType: null,
  benchmarkResults: { dijkstra: null, aStar: null },

  setMouseIsPressed: (pressed) => set({ mouseIsPressed: pressed }),
  setIsDialogOpen: (isOpen, type = null) =>
    set({ isDialogOpen: isOpen, dialogType: type }),

  toggleWall: (row, col) => {
    const newGrid = get().grid.map((r) =>
      r.map((node) => {
        if (
          node.row === row &&
          node.col === col &&
          !node.isStart &&
          !node.isFinish
        ) {
          return { ...node, isWall: !node.isWall };
        }
        return node;
      }),
    );
    set({ grid: newGrid });
  },

  runAlgorithm: async (algorithm) => {
    const grid = get().grid;
    const hasWalls = grid.some((row) => row.some((node) => node.isWall));

    if (!hasWalls) {
      set({ isDialogOpen: true, dialogType: "noWalls" });
      return;
    }

    const startTime = performance.now();

    let startCoords = { row: 0, col: 0 };
    let finishCoords = { row: 0, col: 0 };

    grid.forEach((row, rIdx) => {
      row.forEach((node, cIdx) => {
        if (node.isStart) startCoords = { row: rIdx, col: cIdx };
        if (node.isFinish) finishCoords = { row: rIdx, col: cIdx };
      });
    });

    const algorithmFn = algorithm === 'dijkstra' ? dijkstra : aStar;
    const { visitedNodesInOrder, nodesInShortestPath, pathFound } = algorithmFn(
      grid,
      startCoords,
      finishCoords,
    );
    const gridCopy = grid.map((row) => row.map((node) => ({ ...node })));

    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      const node = visitedNodesInOrder[i];
      gridCopy[node.row][node.col].isVisited = true;
      set({
        grid: [...gridCopy],
        visitedNodesCount: i + 1,
      });
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    let finalPathFound = false;
    if (pathFound && nodesInShortestPath.length > 1) {
      finalPathFound = true;
      for (const node of nodesInShortestPath) {
        gridCopy[node.row][node.col].isShortestPath = true;
        set({ grid: [...gridCopy] });
        await new Promise((resolve) => setTimeout(resolve, 30));
      }
    }

    const endTime = performance.now();
    const totalTime = ((endTime - startTime) / 1000).toFixed(3) + "s";

    set({
      grid: [...gridCopy],
      pathLength: finalPathFound ? nodesInShortestPath.length - 1 : 0,
      executionTime: totalTime,
      hasRun: true,
      isDialogOpen: true,
      dialogType: finalPathFound ? "success" : "noPath",
    });

    if (finalPathFound) {
      setTimeout(() => {
        const currentState = get();
        if (currentState.dialogType === "success") {
          set({ isDialogOpen: false, dialogType: null });
        }
      }, 2000);
    }
  },

  runDijkstra: async () => {
    await get().runAlgorithm('dijkstra');
  },

  runAStar: async () => {
    await get().runAlgorithm('aStar');
  },

  runBenchmark: () => {
    const grid = get().grid;
    const hasWalls = grid.some((row) => row.some((node) => node.isWall));

    if (!hasWalls) {
      set({ isDialogOpen: true, dialogType: "noWalls" });
      return;
    }

    let startCoords = { row: 0, col: 0 };
    let finishCoords = { row: 0, col: 0 };

    grid.forEach((row, rIdx) => {
      row.forEach((node, cIdx) => {
        if (node.isStart) startCoords = { row: rIdx, col: cIdx };
        if (node.isFinish) finishCoords = { row: rIdx, col: cIdx };
      });
    });

    const t1Start = performance.now();
    const dRes = dijkstra(grid, startCoords, finishCoords);
    const t1End = performance.now();

    const t2Start = performance.now();
    const aRes = aStar(grid, startCoords, finishCoords);
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
          pathLength: aRes.pathFound ? aRes.nodesInShortestPath.length - 1: 0,
        },
      },
    });
  },

  resetGrid: () =>
    set({
      grid: createInitialGrid(),
      visitedNodesCount: 0,
      pathLength: 0,
      executionTime: "0.000s",
      hasRun: false,
      isDialogOpen: false,
      dialogType: null,
      benchmarkResults: { dijkstra: null, aStar: null },
    }),

  clearWalls: () => {
    const newGrid = get().grid.map((row) =>
      row.map((node) => ({
        ...node,
        isWall: false,
        isVisited: false,
        isShortestPath: false,
        distance: Infinity,
        previousNode: null,
      })),
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