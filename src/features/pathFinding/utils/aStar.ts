import type { NodeData } from "../types/node";

export interface AStarResult {
  visitedNodesInOrder: NodeData[];
  nodesInShortestPath: NodeData[];
  pathFound: boolean;
}

const getKey = (r: number, c: number): string => `${r}-${c}`;

const heuristic = (node: NodeData, finishNode: NodeData): number => {
  return Math.abs(node.row - finishNode.row) + Math.abs(node.col - finishNode.col);
};

const getNeighbors = (grid: NodeData[][], row: number, col: number, rows: number, cols: number): NodeData[] => {
  const neighbors: NodeData[] = [];
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < rows - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < cols - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter((n) => !n.isWall);
};

const getNodesInShortestPathOrder = (finishNode: NodeData): NodeData[] => {
  const nodesInShortestPathOrder: NodeData[] = [];
  let currentNode: NodeData | null = finishNode;
  
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  
  return nodesInShortestPathOrder;
};

export const aStar = (
  grid: NodeData[][],
  startNodeCoords: { row: number; col: number },
  finishNodeCoords: { row: number; col: number }
): AStarResult => {
  const rows = grid.length;
  const cols = grid[0].length;
  
  const gridCopy: NodeData[][] = grid.map((row) =>
    row.map((node) => ({ ...node, distance: Infinity, previousNode: null, isVisited: false }))
  );

  const startNode = gridCopy[startNodeCoords.row][startNodeCoords.col];
  const finishNode = gridCopy[finishNodeCoords.row][finishNodeCoords.col];

  startNode.distance = 0;
  const openSet: NodeData[] = [startNode];
  const visitedNodesInOrder: NodeData[] = [];
  
  const gScores: Record<string, number> = {};
  const fScores: Record<string, number> = {};

  const startKey = getKey(startNode.row, startNode.col);
  gScores[startKey] = 0;
  fScores[startKey] = heuristic(startNode, finishNode);

  while (openSet.length > 0) {
    openSet.sort((a, b) => {
      const fA = fScores[getKey(a.row, a.col)] ?? Infinity;
      const fB = fScores[getKey(b.row, b.col)] ?? Infinity;
      if (fA === fB) {
        return heuristic(a, finishNode) - heuristic(b, finishNode);
      }
      return fA - fB;
    });

    const currentNode = openSet.shift()!;

    if (currentNode.isWall) continue;
    
    const currentKey = getKey(currentNode.row, currentNode.col);
    if (gScores[currentKey] === Infinity) break;

    currentNode.isVisited = true;
    visitedNodesInOrder.push(currentNode);

    if (currentNode.row === finishNode.row && currentNode.col === finishNode.col) {
      break;
    }

    const neighbors = getNeighbors(gridCopy, currentNode.row, currentNode.col, rows, cols);
    
    for (const neighbor of neighbors) {
      const target = gridCopy[neighbor.row][neighbor.col];
      const tentativeGScore = (gScores[currentKey] ?? Infinity) + target.weight;
      const neighborKey = getKey(target.row, target.col);

      if (tentativeGScore < (gScores[neighborKey] ?? Infinity)) {
        target.previousNode = currentNode;
        gScores[neighborKey] = tentativeGScore;
        fScores[neighborKey] = tentativeGScore + heuristic(target, finishNode);

        if (!openSet.some((n) => n.row === target.row && n.col === target.col)) {
          openSet.push(target);
        }
      }
    }
  }

  const pathFound = finishNode.previousNode !== null || (startNode.row === finishNode.row && startNode.col === finishNode.col);
  const nodesInShortestPath = pathFound ? getNodesInShortestPathOrder(finishNode) : [];

  return {
    visitedNodesInOrder,
    nodesInShortestPath,
    pathFound,
  };
};