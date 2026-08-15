import { usePathfindingStore } from "../store/usePathfindingStore";

export const handleSaveBoard = () => {
  const { grid } = usePathfindingStore.getState();
  localStorage.setItem('pathfinder_saved_grid', JSON.stringify(grid));
  alert('Page state and walls successfully saved!');
};