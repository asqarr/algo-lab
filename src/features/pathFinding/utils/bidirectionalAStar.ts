import type { NodeData } from "../types/node";

export interface BidirectionalResult {
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
  return neighbors.filter((n) => !n.isWall);
};

const heuristic = (nodeA: NodeData, nodeB: NodeData): number => {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
};

export const bidirectionalAStar = (
  grid: NodeData[][],
  startNodeCoords: { row: number; col: number },
  finishNodeCoords: { row: number; col: number }
): BidirectionalResult => {
  const rows = grid.length;
  const cols = grid[0].length;

  const gridCopy: NodeData[][] = grid.map((row) =>
    row.map((node) => ({ ...node, distance: Infinity, previousNode: null, isVisited: false }))
  );

  const startNode = gridCopy[startNodeCoords.row][startNodeCoords.col];
  const finishNode = gridCopy[finishNodeCoords.row][finishNodeCoords.col];

  const openSetStart: NodeData[] = [startNode];
  const openSetFinish: NodeData[] = [finishNode];

  const startMapPrev: { [key: string]: NodeData | null } = {};
  const finishMapPrev: { [key: string]: NodeData | null } = {};

  const getKey = (node: NodeData) => `${node.row}-${node.col}`;

  startMapPrev[getKey(startNode)] = null;
  finishMapPrev[getKey(finishNode)] = null;

  const visitedNodesInOrder: NodeData[] = [];
  let meetingNode: NodeData | null = null;

  const gScoresStart: { [key: string]: number } = { [getKey(startNode)]: 0 };
  const gScoresFinish: { [key: string]: number } = { [getKey(finishNode)]: 0 };

  const inOpenStart = new Set<string>([getKey(startNode)]);
  const inOpenFinish = new Set<string>([getKey(finishNode)]);

  const closedStart = new Set<string>();
  const closedFinish = new Set<string>();

  while (openSetStart.length > 0 && openSetFinish.length > 0) {
    openSetStart.sort((a, b) => {
      const fA = (gScoresStart[getKey(a)] ?? Infinity) + heuristic(a, finishNode);
      const fB = (gScoresStart[getKey(b)] ?? Infinity) + heuristic(b, finishNode);
      return fA - fB;
    });

    const currentStart = openSetStart.shift()!;
    const startKey = getKey(currentStart);
    inOpenStart.delete(startKey);
    closedStart.add(startKey);

    currentStart.isVisited = true;
    visitedNodesInOrder.push(currentStart);

    if (closedFinish.has(startKey)) {
      meetingNode = currentStart;
      break;
    }

    const neighborsStart = getNeighbors(gridCopy, currentStart.row, currentStart.col, rows, cols);
    for (const neighbor of neighborsStart) {
      const neighborKey = getKey(neighbor);
      if (closedStart.has(neighborKey)) continue;

      const tentativeG = (gScoresStart[startKey] ?? Infinity) + neighbor.weight;

      if (tentativeG < (gScoresStart[neighborKey] ?? Infinity)) {
        startMapPrev[neighborKey] = currentStart;
        gScoresStart[neighborKey] = tentativeG;

        if (!inOpenStart.has(neighborKey)) {
          inOpenStart.add(neighborKey);
          openSetStart.push(neighbor);
        }
      }
    }

    openSetFinish.sort((a, b) => {
      const fA = (gScoresFinish[getKey(a)] ?? Infinity) + heuristic(a, startNode);
      const fB = (gScoresFinish[getKey(b)] ?? Infinity) + heuristic(b, startNode);
      return fA - fB;
    });

    const currentFinish = openSetFinish.shift()!;
    const finishKey = getKey(currentFinish);
    inOpenFinish.delete(finishKey);
    closedFinish.add(finishKey);

    currentFinish.isVisited = true;
    visitedNodesInOrder.push(currentFinish);

    if (closedStart.has(finishKey)) {
      meetingNode = currentFinish;
      break;
    }

    const neighborsFinish = getNeighbors(gridCopy, currentFinish.row, currentFinish.col, rows, cols);
    for (const neighbor of neighborsFinish) {
      const neighborKey = getKey(neighbor);
      if (closedFinish.has(neighborKey)) continue;

      const tentativeG = (gScoresFinish[finishKey] ?? Infinity) + neighbor.weight;

      if (tentativeG < (gScoresFinish[neighborKey] ?? Infinity)) {
        finishMapPrev[neighborKey] = currentFinish;
        gScoresFinish[neighborKey] = tentativeG;

        if (!inOpenFinish.has(neighborKey)) {
          inOpenFinish.add(neighborKey);
          openSetFinish.push(neighbor);
        }
      }
    }
  }

  let nodesInShortestPath: NodeData[] = [];
  let pathFound = false;

  if (meetingNode) {
    pathFound = true;
    const meetingKey = getKey(meetingNode);

    const pathFromStart: NodeData[] = [];
    let curr: NodeData | null = meetingNode;
    while (curr !== null) {
      pathFromStart.unshift(curr);
      curr = startMapPrev[getKey(curr)];
    }

    const pathFromFinish: NodeData[] = [];
    curr = finishMapPrev[meetingKey];
    while (curr !== null) {
      pathFromFinish.push(curr);
      curr = finishMapPrev[getKey(curr)];
    }

    nodesInShortestPath = [...pathFromStart, ...pathFromFinish];
  }

  return {
    visitedNodesInOrder,
    nodesInShortestPath,
    pathFound,
  };
};