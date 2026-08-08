import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Coins, 
  PieChart as ChartIcon,
  DollarSign,
  Sun,
  Moon,
  LogOut
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export type ViewType = 'income' | 'expense' | 'asset' | 'analytics';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onExit?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, onExit }) => {
  const { isDark, toggle } = useTheme();

  const menuItems = [
    {
      id: 'income' as ViewType,
      label: 'Przychody',
      icon: ArrowUpRight,
      color: 'text-slate-400 dark:text-zinc-400 dark:text-zinc-400 dark:text-zinc-300',
    },
    {
      id: 'expense' as ViewType,
      label: 'Wydatki',
      icon: ArrowDownRight,
      color: 'text-slate-400 dark:text-zinc-400 dark:text-zinc-400 dark:text-zinc-300',
    },
    {
      id: 'asset' as ViewType,
      label: 'Zasoby',
      icon: Coins,
      color: 'text-slate-400 dark:text-zinc-400 dark:text-zinc-400 dark:text-zinc-300',
    },
    {
      id: 'analytics' as ViewType,
      label: 'Podsumowanie',
      icon: ChartIcon,
      color: 'text-slate-400 dark:text-zinc-400 dark:text-zinc-400 dark:text-zinc-300',
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-white dark:bg-zinc-950 border-b md:border-b-0 md:border-r border-slate-200 dark:border-zinc-800 flex flex-col shrink-0 transition-colors">
      {/* Branding Header */}
      <div className="p-6 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <DollarSign className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 dark:text-white dark:text-white tracking-tight text-xl flex items-center gap-1">
              Finanse<span className="text-indigo-600 dark:text-indigo-400">MVP</span>
            </h1>
          </div>
        </div>
        
        <button
          onClick={toggle}
          className="p-2 rounded-lg text-slate-400 dark:text-zinc-400 hover:text-slate-600 dark:hover:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          title="Przełącz motyw"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation menu */}
      <nav className="p-4 flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible scrollbar-none w-full">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer whitespace-nowrap border-0 ${
                isActive 
                  ? 'bg-slate-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 font-semibold' 
                  : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-slate-800 dark:hover:text-zinc-200'
              }`}
            >
              <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : item.color}`} />
              <span>{item.label}</span>
            </button>
          );
        })}

        <div className="md:mt-auto pt-4 border-t border-slate-100 dark:border-zinc-800 md:w-full mt-0 md:pt-4">
          <button
            onClick={onExit}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer whitespace-nowrap border-0 text-slate-500 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-slate-800 dark:hover:text-zinc-200"
          >
            <LogOut className="w-4.5 h-4.5 shrink-0 text-slate-400 dark:text-zinc-400" />
            <span>Wyjście</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};
