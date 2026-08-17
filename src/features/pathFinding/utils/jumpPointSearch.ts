import type { NodeData } from "../types/node";

export interface JPSResult {
  visitedNodesInOrder: NodeData[];
  nodesInShortestPath: NodeData[];
  pathFound: boolean;
}

const getKey = (r: number, c: number): string => `${r}-${c}`;

const heuristic = (nodeA: { row: number; col: number }, nodeB: { row: number; col: number }): number => {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
};

export const jumpPointSearch = (
  grid: NodeData[][],
  startNodeCoords: { row: number; col: number },
  finishNodeCoords: { row: number; col: number }
): JPSResult => {
  const rows = grid.length;
  const cols = grid[0].length;

  const gridCopy: NodeData[][] = grid.map((row) =>
    row.map((node) => ({ ...node, distance: Infinity, previousNode: null }))
  );

  const startNode = gridCopy[startNodeCoords.row][startNodeCoords.col];
  const finishNode = gridCopy[finishNodeCoords.row][finishNodeCoords.col];

  const gScores: Record<string, number> = { [getKey(startNode.row, startNode.col)]: 0 };
  const fScores: Record<string, number> = { [getKey(startNode.row, startNode.col)]: heuristic(startNode, finishNode) };

  const openSet: NodeData[] = [startNode];
  const visitedNodesInOrder: NodeData[] = [];
  const visitedSet = new Set<string>();

  const isWalkable = (r: number, c: number): boolean => {
    return r >= 0 && r < rows && c >= 0 && c < cols && !gridCopy[r][c].isWall;
  };

  const jump = (r: number, c: number, dx: number, dy: number): { row: number; col: number } | null => {
    const nextR = r + dx;
    const nextC = c + dy;

    if (!isWalkable(nextR, nextC)) return null;

    const nextNode = gridCopy[nextR][nextC];
    visitedNodesInOrder.push(nextNode);
    const nextKey = getKey(nextR, nextC);
    if (!visitedSet.has(nextKey)) {
      visitedSet.add(nextKey);
    }

    if (nextR === finishNode.row && nextC === finishNode.col) {
      return { row: nextR, col: nextC };
    }

    if (dx !== 0 && dy !== 0) {
      if ((isWalkable(nextR - dx, nextC + dy) && !isWalkable(nextR - dx, nextC)) ||
          (isWalkable(nextR + dx, nextC - dy) && !isWalkable(nextR, nextC - dy))) {
        return { row: nextR, col: nextC };
      }
      if (jump(nextR, nextC, dx, 0) || jump(nextR, nextC, 0, dy)) {
        return { row: nextR, col: nextC };
      }
    } else {
      if (dx !== 0) {
        if ((isWalkable(nextR + dx, nextC + 1) && !isWalkable(nextR, nextC + 1)) ||
            (isWalkable(nextR + dx, nextC - 1) && !isWalkable(nextR, nextC - 1))) {
          return { row: nextR, col: nextC };
        }
      } else {
        if ((isWalkable(nextR + 1, nextC + dy) && !isWalkable(nextR + 1, nextC)) ||
            (isWalkable(nextR - 1, nextC + dy) && !isWalkable(nextR - 1, nextC))) {
          return { row: nextR, col: nextC };
        }
      }
    }

    if (isWalkable(nextR + dx, nextC + dy)) {
      return jump(nextR, nextC, dx, dy);
    }

    return null;
  };

  const getPrunedNeighbors = (node: NodeData): { row: number; col: number }[] => {
    const neighbors: { row: number; col: number }[] = [];
    const { row, col } = node;
    const parent = node.previousNode;

    if (parent) {
      const px = parent.row;
      const py = parent.col;
      const dx = Math.sign(row - px);
      const dy = Math.sign(col - py);

      if (dx !== 0 && dy !== 0) {
        if (isWalkable(row + dx, col)) neighbors.push({ row: row + dx, col });
        if (isWalkable(row, col + dy)) neighbors.push({ row, col: col + dy });
        if (isWalkable(row + dx, col + dy)) neighbors.push({ row: row + dx, col: col + dy });
        if (!isWalkable(row - dx, col) && isWalkable(row - dx, col + dy)) neighbors.push({ row: row - dx, col: col + dy });
        if (!isWalkable(row, col - dy) && isWalkable(row + dx, col - dy)) neighbors.push({ row: row + dx, col: col - dy });
      } else {
        if (dx !== 0) {
          if (isWalkable(row + dx, col)) neighbors.push({ row: row + dx, col });
          if (!isWalkable(row, col + 1) && isWalkable(row + dx, col + 1)) neighbors.push({ row: row + dx, col: col + 1 });
          if (!isWalkable(row, col - 1) && isWalkable(row + dx, col - 1)) neighbors.push({ row: row + dx, col: col - 1 });
        } else {
          if (isWalkable(row, col + dy)) neighbors.push({ row, col: col + dy });
          if (!isWalkable(row + 1, col) && isWalkable(row + 1, col + dy)) neighbors.push({ row: row + 1, col: col + dy });
          if (!isWalkable(row - 1, col) && isWalkable(row - 1, col + dy)) neighbors.push({ row: row - 1, col: col + dy });
        }
      }
    } else {
      const dirs = [[0,1], [0,-1], [1,0], [-1,0], [1,1], [1,-1], [-1,1], [-1,-1]];
      for (const [dx, dy] of dirs) {
        if (isWalkable(row + dx, col + dy)) {
          neighbors.push({ row: row + dx, col: col + dy });
        }
      }
    }
    return neighbors;
  };

  const identifySuccessors = (node: NodeData): NodeData[] => {
    const successors: NodeData[] = [];
    const neighbors = getPrunedNeighbors(node);

    for (const nb of neighbors) {
      const jumpPoint = jump(node.row, node.col, nb.row - node.row, nb.col - node.col);
      if (jumpPoint) {
        successors.push(gridCopy[jumpPoint.row][jumpPoint.col]);
      }
    }
    return successors;
  };

  let pathFound = false;

  while (openSet.length > 0) {
    openSet.sort((a, b) => {
      const fA = fScores[getKey(a.row, a.col)] ?? Infinity;
      const fB = fScores[getKey(b.row, b.col)] ?? Infinity;
      return fA - fB;
    });

    const currentNode = openSet.shift()!;
    currentNode.isVisited = true;

    if (currentNode.row === finishNode.row && currentNode.col === finishNode.col) {
      pathFound = true;
      break;
    }

    const successors = identifySuccessors(currentNode);
    for (const s of successors) {
      const sKey = getKey(s.row, s.col);
      const tentativeG = (gScores[getKey(currentNode.row, currentNode.col)] ?? Infinity) + s.weight * heuristic(currentNode, s);

      if (tentativeG < (gScores[sKey] ?? Infinity)) {
        s.previousNode = currentNode;
        gScores[sKey] = tentativeG;
        fScores[sKey] = tentativeG + heuristic(s, finishNode);

        if (!openSet.some((n) => n.row === s.row && n.col === s.col)) {
          openSet.push(s);
        }
      }
    }
  }

  let nodesInShortestPath: NodeData[] = [];
  if (pathFound) {
    let curr: NodeData | null = finishNode;
    while (curr !== null) {
      nodesInShortestPath.unshift(curr);
      curr = curr.previousNode;
    }
  }

  return {
    visitedNodesInOrder,
    nodesInShortestPath,
    pathFound,
  };
};