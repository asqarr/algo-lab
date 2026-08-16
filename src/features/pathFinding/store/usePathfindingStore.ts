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
  toolMode: "wall" | "weight";
  visitedNodesCount: number;
  pathLength: number;
  executionTime: string;
  hasRun: boolean;
  isDialogOpen: boolean;
  dialogType: "success" | "noPath" | "noWalls" | "alreadyRun" | null;
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
  resetGrid: () => void;
  clearWalls: () => void;
  randomizeWalls: () => void;
  saveBoard: () => void;
  loadSavedBoard: () => boolean;
  setIsDialogOpen: (
    isOpen: boolean,
    type?: "success" | "noPath" | "noWalls" | "alreadyRun" | null,
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
    const newGrid = get().grid.map((r) =>
      r.map((node) => {
        if (
          node.row === row &&
          node.col === col &&
          !node.isStart &&
          !node.isFinish
        ) {
          return { ...node, isWall: !node.isWall, isWeight: false, weight: 1 };
        }
        return node;
      })
    );
    set({ grid: newGrid });
  },

  toggleWeight: (row, col) => {
    const newGrid = get().grid.map((r) =>
      r.map((node) => {
        if (
          node.row === row &&
          node.col === col &&
          !node.isStart &&
          !node.isFinish
        ) {
          const newIsWeight = !node.isWeight;
          return {
            ...node,
            isWeight: newIsWeight,
            weight: newIsWeight ? 5 : 1,
            isWall: false,
          };
        }
        return node;
      })
    );
    set({ grid: newGrid });
  },

  randomizeWalls: () => {
    const { toolMode } = get();
    const currentGrid = get().grid;
    
    const newGrid = new Array(currentGrid.length);
    for (let r = 0; r < currentGrid.length; r++) {
      const currentRow = new Array(currentGrid[r].length);
      for (let c = 0; c < currentGrid[r].length; c++) {
        const node = currentGrid[r][c];
        if (node.isStart || node.isFinish) {
          currentRow[c] = node;
          continue;
        }

        const isRandomActive = Math.random() < 0.25;

        if (toolMode === 'weight') {
          currentRow[c] = {
            ...node,
            isWall: false,
            isWeight: isRandomActive,
            weight: isRandomActive ? 5 : 1,
            isVisited: false,
            isShortestPath: false,
            distance: Infinity,
            previousNode: null,
          };
        } else {
          currentRow[c] = {
            ...node,
            isWall: isRandomActive,
            isWeight: false,
            weight: 1,
            isVisited: false,
            isShortestPath: false,
            distance: Infinity,
            previousNode: null,
          };
        }
      }
      newGrid[r] = currentRow;
    }

    set({ 
      grid: newGrid, 
      hasRun: false,
      visitedNodesCount: 0,
      pathLength: 0,
      executionTime: "0.000s"
    });
  },

  saveBoard: () => {
    const { grid } = get();
    try {
      localStorage.setItem('pathfinder_saved_grid', JSON.stringify(grid));
      console.info('Board state and walls successfully saved!');
    } catch (error) {
      console.error('Failed to save board state:', error);
    }
  },

  loadSavedBoard: () => {
    try {
      const savedData = localStorage.getItem('pathfinder_saved_grid');
      if (!savedData) {
        console.warn('No saved board found in localStorage.');
        return false;
      }

      const parsedGrid = JSON.parse(savedData);
      set({
        grid: parsedGrid,
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

    const grid = state.grid;
    const hasObstacles = grid.some((row) => row.some((node) => node.isWall || node.isWeight));

    if (!hasObstacles) {
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

    let algorithmFn = dijkstra;
    if (algorithm === 'aStar') algorithmFn = aStar;
    if (algorithm === 'bidirectional') algorithmFn = bidirectionalAStar;
    if (algorithm === 'jps') algorithmFn = jumpPointSearch;

    const { visitedNodesInOrder, nodesInShortestPath, pathFound } = algorithmFn(
      grid,
      startCoords,
      finishCoords
    );
    const gridCopy = grid.map((row) => row.map((node) => ({ ...node })));

    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      const node = visitedNodesInOrder[i];
      if (gridCopy[node.row] && gridCopy[node.row][node.col]) {
        gridCopy[node.row][node.col] = {
          ...gridCopy[node.row][node.col],
          isVisited: true,
        };
        
        if (i % 4 === 0 || i === visitedNodesInOrder.length - 1) {
          set({
            grid: [...gridCopy],
            visitedNodesCount: i + 1,
          });
          await new Promise((resolve) => setTimeout(resolve, 2));
        }
      }
    }

    let finalPathFound = false;
    if (pathFound && nodesInShortestPath.length > 1) {
      finalPathFound = true;
      for (const node of nodesInShortestPath) {
        if (gridCopy[node.row] && gridCopy[node.row][node.col]) {
          gridCopy[node.row][node.col] = {
            ...gridCopy[node.row][node.col],
            isShortestPath: true,
          };
          set({ grid: [...gridCopy] });
          await new Promise((resolve) => setTimeout(resolve, 10)); 
        }
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

  runBidirectional: async () => {
    await get().runAlgorithm('bidirectional');
  },

  runJPS: async () => {
    await get().runAlgorithm('jps');
  },

  runBenchmark: () => {
    const grid = get().grid;
    const hasObstacles = grid.some((row) => row.some((node) => node.isWall || node.isWeight));

    if (!hasObstacles) {
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