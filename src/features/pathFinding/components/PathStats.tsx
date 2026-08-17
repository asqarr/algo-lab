import React from 'react';
import { usePathfindingStore } from '../store/usePathfindingStore';
import { Activity, Compass, Clock, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react'; 

interface StatCardProps {
  icon: LucideIcon;
  iconBgColor: string;
  iconTextColor: string;
  label: string;
  value: string | number;
  valueColor: string;
  customValueNode?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  iconBgColor,
  iconTextColor,
  label,
  value,
  valueColor,
  customValueNode,
}) => (
  <div className="group flex justify-between items-center p-3.5 bg-slate-900/70 hover:bg-slate-900/90 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-all duration-300 shadow-inner">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-xl ${iconBgColor} border border-slate-700/20 ${iconTextColor} group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-slate-400 text-xs font-medium">{label}</span>
    </div>
    {customValueNode || (
      <span className={`font-bold text-sm tracking-wide ${valueColor}`}>
        {value}
      </span>
    )}
  </div>
);

export const PathStats: React.FC = () => {
  const { pathLength, visitedNodesCount, executionTime, hasRun } = usePathfindingStore();

  const getEfficiencyBadge = () => {
    if (!hasRun) {
      return <span className="bg-slate-800/50 text-slate-400 border border-slate-700/50 px-2.5 py-0.5 rounded-lg text-sm font-bold">Pending</span>;
    }
    if (pathLength > 0) {
      return <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-0.5 rounded-lg text-sm font-bold">Optimal</span>;
    }
    return <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-0.5 rounded-lg text-sm font-bold">No Path</span>;
  };

  return (
    <div className="relative lg:col-span-1 p-6 bg-[#0b0f19]/90 rounded-3xl border border-slate-800/80 shadow-2xl flex flex-col gap-5 backdrop-blur-xl overflow-hidden">
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3.5 relative">
        <h3 className="text-xs font-bold tracking-wider uppercase text-slate-400 flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span>Path Statistics</span>
        </h3>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 font-medium">
          Live Stats
        </span>
      </div>

      <div className="flex flex-col gap-3 text-sm relative">
        <StatCard
          icon={Compass}
          iconBgColor="bg-amber-500/10"
          iconTextColor="text-amber-400"
          label="Path Length"
          value={pathLength > 0 ? `${pathLength} Steps` : "-- Steps"}
          valueColor="text-amber-400"
        />

        <StatCard
          icon={Activity}
          iconBgColor="bg-blue-500/10"
          iconTextColor="text-blue-400"
          label="Visited Nodes"
          value={visitedNodesCount > 0 ? visitedNodesCount : "-- Nodes"}
          valueColor="text-blue-400"
        />

        <StatCard
          icon={Clock}
          iconBgColor="bg-indigo-500/10"
          iconTextColor="text-indigo-400"
          label="Execution Time"
          value={executionTime !== "0.000s" ? executionTime : "-- s"}
          valueColor="text-indigo-400"
        />

        <StatCard
          icon={Zap}
          iconBgColor="bg-emerald-500/10"
          iconTextColor="text-emerald-400"
          label="Efficiency"
          value=""
          valueColor=""
          customValueNode={getEfficiencyBadge()}
        />
      </div>
    </div>
  );
};