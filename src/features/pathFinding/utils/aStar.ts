import type { NodeData } from "../types/node";

export interface AStarResult {
  visitedNodesInOrder: NodeData[];
  nodesInShortestPath: NodeData[];
  pathFound: boolean;
}

const getNeighbors = (grid: NodeData[][], row: number, col: number, rows: number, cols: number): NodeData[] => {
  const neighbors: NodeData[] = [];
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < rows - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < cols - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter((n) => !n.isVisited && !n.isWall);
};

const heuristic = (node: NodeData, finishNode: NodeData): number => {
  return Math.abs(node.row - finishNode.row) + Math.abs(node.col - finishNode.col);
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
  
  const gridCopy: NodeData[][] = grid.map((row) => row.map((node) => ({ ...node, distance: Infinity })) );
  const startNode = gridCopy[startNodeCoords.row][startNodeCoords.col];
  const finishNode = gridCopy[finishNodeCoords.row][finishNodeCoords.col];

  startNode.distance = 0;
  const openSet: NodeData[] = [startNode];
  const visitedNodesInOrder: NodeData[] = [];
  let pathFound = false;

  const gScores: { [key: string]: number } = {};
  const fScores: { [key: string]: number } = {};

  const getKey = (r: number, c: number) => `${r}-${c}`;

  gScores[getKey(startNode.row, startNode.col)] = 0;
  fScores[getKey(startNode.row, startNode.col)] = heuristic(startNode, finishNode);

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
    if (gScores[getKey(currentNode.row, currentNode.col)] === Infinity) break;

    currentNode.isVisited = true;
    visitedNodesInOrder.push(currentNode);

    if (currentNode.row === finishNode.row && currentNode.col === finishNode.col) {
      pathFound = true;
      break;
    }

    const neighbors = getNeighbors(gridCopy, currentNode.row, currentNode.col, rows, cols);
    for (const neighbor of neighbors) {
      const target = gridCopy[neighbor.row][neighbor.col];
      const tentativeGScore = gScores[getKey(currentNode.row, currentNode.col)] + 1;

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

  let nodesInShortestPath: NodeData[] = [];
  if (pathFound) {
    nodesInShortestPath = getNodesInShortestPathOrder(gridCopy[finishNode.row][finishNode.col]);
  }

  return {
    visitedNodesInOrder,
    nodesInShortestPath,
    pathFound,
  };
};