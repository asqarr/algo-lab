import React from 'react';

interface NavbarProps {
  onSave: () => void;
  onOpenDocs: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSave, onOpenDocs }) => {
  return (
    <header className="w-full flex items-center justify-between px-8 py-5 bg-[#0b0f19]/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-linear-to-r from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <span className="font-black text-lg">A</span>
        </div>
        <h1 className="text-xl font-extrabold tracking-wider text-transparent bg-clip-text bg-linear-to-r from-white via-slate-200 to-cyan-400">
          ALGO-VISUALIZER
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={onSave}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition-all cursor-pointer"
        >
          <span>Save Page</span>
        </button>
        
        <button 
          onClick={onOpenDocs}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
        >
          <span>Algorithm Docs</span>
        </button>
      </div>
    </header>
  );
};