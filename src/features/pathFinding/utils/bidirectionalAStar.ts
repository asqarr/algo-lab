import type { NodeData } from "../types/node";

export interface BidirectionalResult {
  visitedNodesInOrder: NodeData[];
  nodesInShortestPath: NodeData[];
  pathFound: boolean;
}

const getKey = (node: NodeData): string => `${node.row}-${node.col}`;

const heuristic = (nodeA: NodeData, nodeB: NodeData): number => {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
};

const getNeighbors = (grid: NodeData[][], row: number, col: number, rows: number, cols: number): NodeData[] => {
  const neighbors: NodeData[] = [];
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < rows - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < cols - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter((n) => !n.isWall);
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

  const visitedNodesInOrder: NodeData[] = [];
  let meetingNode: NodeData | null = null;

  const forward = {
    openSet: [startNode],
    mapPrev: { [getKey(startNode)]: null as NodeData | null },
    gScores: { [getKey(startNode)]: 0 },
    inOpen: new Set<string>([getKey(startNode)]),
    closed: new Set<string>(),
    target: finishNode,
  };

  const backward = {
    openSet: [finishNode],
    mapPrev: { [getKey(finishNode)]: null as NodeData | null },
    gScores: { [getKey(finishNode)]: 0 },
    inOpen: new Set<string>([getKey(finishNode)]),
    closed: new Set<string>(),
    target: startNode,
  };

  const processStep = (currentSide: typeof forward, otherSide: typeof forward) => {
    currentSide.openSet.sort((a, b) => {
      const fA = (currentSide.gScores[getKey(a)] ?? Infinity) + heuristic(a, currentSide.target);
      const fB = (currentSide.gScores[getKey(b)] ?? Infinity) + heuristic(b, currentSide.target);
      return fA - fB;
    });

    const current = currentSide.openSet.shift()!;
    const currentKey = getKey(current);
    
    currentSide.inOpen.delete(currentKey);
    currentSide.closed.add(currentKey);

    current.isVisited = true;
    visitedNodesInOrder.push(current);

    if (otherSide.closed.has(currentKey)) {
      return current;
    }

    const neighbors = getNeighbors(gridCopy, current.row, current.col, rows, cols);
    for (const neighbor of neighbors) {
      const neighborKey = getKey(neighbor);
      if (currentSide.closed.has(neighborKey)) continue;

      const tentativeG = (currentSide.gScores[currentKey] ?? Infinity) + neighbor.weight;

      if (tentativeG < (currentSide.gScores[neighborKey] ?? Infinity)) {
        currentSide.mapPrev[neighborKey] = current;
        currentSide.gScores[neighborKey] = tentativeG;

        if (!currentSide.inOpen.has(neighborKey)) {
          currentSide.inOpen.add(neighborKey);
          currentSide.openSet.push(neighbor);
        }
      }
    }
    return null;
  };

  while (forward.openSet.length > 0 && backward.openSet.length > 0) {
    meetingNode = processStep(forward, backward);
    if (meetingNode) break;

    meetingNode = processStep(backward, forward);
    if (meetingNode) break;
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
      curr = forward.mapPrev[getKey(curr)];
    }

    const pathFromFinish: NodeData[] = [];
    curr = backward.mapPrev[meetingKey];
    while (curr !== null) {
      pathFromFinish.push(curr);
      curr = backward.mapPrev[getKey(curr)];
    }

    nodesInShortestPath = [...pathFromStart, ...pathFromFinish];
  }

  return {
    visitedNodesInOrder,
    nodesInShortestPath,
    pathFound,
  };
};