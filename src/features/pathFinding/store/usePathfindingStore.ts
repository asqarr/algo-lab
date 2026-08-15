import { create } from "zustand";
import type { NodeData } from "../types/node";

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

const getNeighbors = (grid: NodeData[][], row: number, col: number) => {
  const neighbors = [];
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < ROWS - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < COLS - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter((n) => !n.isVisited && !n.isWall);
};

const getNodesInShortestPathOrder = (finishNode: NodeData) => {
  const nodesInShortestPathOrder: NodeData[] = [];
  let currentNode: NodeData | null = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
};

interface PathfindingState {
  grid: NodeData[][];
  mouseIsPressed: boolean;
  visitedNodesCount: number;
  pathLength: number;
  executionTime: string;
  hasRun: boolean;
  isDialogOpen: boolean;
  dialogType: 'success' | 'noPath' | 'noWalls' | null;
  setMouseIsPressed: (pressed: boolean) => void;
  toggleWall: (row: number, col: number) => void;
  runDijkstra: () => Promise<void>;
  resetGrid: () => void;
  clearWalls: () => void;
  setIsDialogOpen: (isOpen: boolean, type?: 'success' | 'noPath' | 'noWalls' | null) => void;
}

export const usePathfindingStore = create<PathfindingState>((set, get) => ({
  grid: createInitialGrid(),
  mouseIsPressed: false,
  visitedNodesCount: 0,
  pathLength: 0,
  executionTime: "0.000s",
  hasRun: false,
  isDialogOpen: false,
  dialogType: null,

  setMouseIsPressed: (pressed) => set({ mouseIsPressed: pressed }),
  setIsDialogOpen: (isOpen, type = null) => set({ isDialogOpen: isOpen, dialogType: type }),

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

  runDijkstra: async () => {
    const grid = get().grid;
    
    const hasWalls = grid.some((row) => row.some((node) => node.isWall));

    if (!hasWalls) {
      set({ isDialogOpen: true, dialogType: 'noWalls' });
      return;
    }

    const startTime = performance.now();
    const gridCopy = grid.map((row) => row.map((node) => ({ ...node })));
    const startNode = gridCopy.flat().find((n) => n.isStart)!;
    const finishNode = gridCopy.flat().find((n) => n.isFinish)!;

    startNode.distance = 0;
    const unvisitedNodes = gridCopy.flat();
    const visitedNodesInOrder: NodeData[] = [];
    let pathFound = false;

    while (unvisitedNodes.length > 0) {
      unvisitedNodes.sort((a, b) => a.distance - b.distance);
      const closestNode = unvisitedNodes.shift()!;

      if (closestNode.isWall) continue;
      if (closestNode.distance === Infinity) break;

      closestNode.isVisited = true;
      visitedNodesInOrder.push(closestNode);

      set({
        grid: [...gridCopy],
        visitedNodesCount: visitedNodesInOrder.length,
      });
      await new Promise((resolve) => setTimeout(resolve, 10));

      if (
        closestNode.row === finishNode.row &&
        closestNode.col === finishNode.col
      ) {
        pathFound = true;
        break;
      }

      const neighbors = getNeighbors(gridCopy, closestNode.row, closestNode.col);
      for (const neighbor of neighbors) {
        const target = gridCopy[neighbor.row][neighbor.col];
        target.distance = closestNode.distance + 1;
        target.previousNode = closestNode;
      }
    }

    let nodesInShortestPath: NodeData[] = [];
    if (pathFound) {
      nodesInShortestPath = getNodesInShortestPathOrder(
        gridCopy[finishNode.row][finishNode.col],
      );
      for (const node of nodesInShortestPath) {
        gridCopy[node.row][node.col].isShortestPath = true;
        set({ grid: [...gridCopy] });
        await new Promise((resolve) => setTimeout(resolve, 30));
      }
    }

    const endTime = performance.now();
    const totalTime = ((endTime - startTime) / 1000).toFixed(3) + "s";

    const finalPathFound = pathFound && nodesInShortestPath.length > 1;

    set({
      grid: [...gridCopy],
      pathLength: finalPathFound ? nodesInShortestPath.length - 1 : 0,
      executionTime: totalTime,
      hasRun: true,
      isDialogOpen: true,
      dialogType: finalPathFound ? 'success' : 'noPath',
    });

    // اگر مسیر با موفقیت پیدا شد، بعد از ۲ ثانیه دیالوگ خودکار بسته شود
    if (finalPathFound) {
      setTimeout(() => {
        const currentState = get();
        if (currentState.dialogType === 'success') {
          set({ isDialogOpen: false, dialogType: null });
        }
      }, 2000);
    }
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
    });
  },
}));