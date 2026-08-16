import { useState } from "react";
import { Grid } from "./features/pathFinding/components/Grid";
import { Navbar } from "./features/pathFinding/components/Navbar";
import { HeroSection } from "./features/pathFinding/components/HeroSection";
import { Toolbar } from "./features/pathFinding/components/Toolbar";
import { PathStats } from "./features/pathFinding/components/PathStats";
import { FooterGuide } from "./features/pathFinding/components/FooterGuide";
import { AlgorithmDocsModal } from "./features/pathFinding/components/AlgorithmDocsModal";
import { usePathfindingStore } from "./features/pathFinding/store/usePathfindingStore";
import { handleSaveBoard } from "./features/pathFinding/utils/saveUtils"; // ایمپورت مستقیم تابع ذخیره
import { PathDialog } from "./features/pathFinding/components/PathDialog";

function App() {
  const runDijkstra = usePathfindingStore((state) => state.runDijkstra);
  const [isRunning, setIsRunning] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    await runDijkstra();
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-[#070913] text-white flex flex-col items-center selection:bg-blue-500 selection:text-white pb-10">
      <Navbar onSave={handleSaveBoard} onOpenDocs={() => setIsDocsOpen(true)} />

      <HeroSection isRunning={isRunning} onRun={handleRun} />

      <div className="w-full max-w-7xl px-4 flex flex-col gap-4">
        <Toolbar />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3 p-3 bg-[#0b0f19]/70 rounded-2xl shadow-2xl backdrop-blur-md border border-slate-800/80 flex items-center justify-center overflow-x-auto">
            <Grid />
          </div>

          <PathStats />
        </div>

        <FooterGuide />
      </div>

      <AlgorithmDocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />
      <PathDialog />
    </div>
  );
}

export default App;
