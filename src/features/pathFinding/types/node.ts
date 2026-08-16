export interface NodeData {
  row: number;
  col: number;          
  isStart: boolean;     
  isFinish: boolean; 
  distance: number;     
  weight: number;
  isVisited: boolean;   
  isWall: boolean;      
  isWeight: boolean;
  isShortestPath?: boolean;
  previousNode: NodeData | null;
}