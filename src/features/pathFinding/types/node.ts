export interface NodeData {
  row: number;
  col: number;          
  isStart: boolean;     
  isFinish: boolean; 
  distance: number;     
  isVisited: boolean;   
  isWall: boolean;      
  isShortestPath?: boolean;
  previousNode: NodeData | null;
}