import type { NodeData } from "../types/node";

export interface DijkstraResult {
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

const getNodesInShortestPathOrder = (finishNode: NodeData): NodeData[] => {
  const nodesInShortestPathOrder: NodeData[] = [];
  let currentNode: NodeData | null = finishNode;
  
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  
  return nodesInShortestPathOrder;
};

export const dijkstra = (
  grid: NodeData[][],
  startNodeCoords: { row: number; col: number },
  finishNodeCoords: { row: number; col: number }
): DijkstraResult => {
  const rows = grid.length;
  const cols = grid[0].length;
  
  const gridCopy: NodeData[][] = grid.map((row) => row.map((node) => ({ ...node })));
  const startNode = gridCopy[startNodeCoords.row][startNodeCoords.col];
  const finishNode = gridCopy[finishNodeCoords.row][finishNodeCoords.col];

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

    if (closestNode.row === finishNode.row && closestNode.col === finishNode.col) {
      pathFound = true;
      break;
    }

    const neighbors = getNeighbors(gridCopy, closestNode.row, closestNode.col, rows, cols);
    for (const neighbor of neighbors) {
      const target = gridCopy[neighbor.row][neighbor.col];
      const newDistance = closestNode.distance + target.weight;
      
      if (newDistance < target.distance) {
        target.distance = newDistance;
        target.previousNode = closestNode;
      }
    }
  }

  const nodesInShortestPath = pathFound ? getNodesInShortestPathOrder(finishNode) : [];

  return {
    visitedNodesInOrder,
    nodesInShortestPath,
    pathFound,
  };
};