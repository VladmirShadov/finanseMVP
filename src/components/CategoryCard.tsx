import React from 'react';
import { Trash2 } from 'lucide-react';
import { Category, COLOR_PRESETS } from '../types';
import { useTheme } from '../hooks/useTheme';

interface CategoryCardProps {
  category: Category;
  sum: number;
  onClick: () => void;
  onDelete?: () => void;
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  sum,
  onClick,
  onDelete,
}) => {
  const { isDark } = useTheme();
  
  // Find color preset or default to first one
  const colorPreset = COLOR_PRESETS.find((p) => p.id === category.colorId) || COLOR_PRESETS[0];

  // Map category types to specific Polish names and styles
  const typeBadgeStyles = {
    income: {
      label: 'Przychód',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    },
    expense: {
      label: 'Wydatek',
      bg: 'bg-rose-50 text-rose-700 border-rose-100',
    },
    asset: {
      label: 'Zasób',
      bg: 'bg-blue-50 text-blue-700 border-blue-100',
    },
  };

  const badgeInfo = typeBadgeStyles[category.type];

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5"
      style={{
        borderLeft: `5px solid ${colorPreset.text}`,
        borderColor: colorPreset.border,
        backgroundColor: colorPreset.bg,
      }}
    >
      {/* Category Header Meta (Badge & Trash) */}
      <div className="flex justify-between items-center gap-3">
        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase border ${badgeInfo.bg}`}>
          {badgeInfo.label}
        </span>
        
        {onDelete ? (
          <button
            onClick={(e) => {
              e.stopPropagation(); // Avoid triggering card click
              onDelete();
            }}
            className="p-1.5 rounded-lg transition-colors duration-150 text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
            title="Usuń kategorię"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        ) : (
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colorPreset.text }} />
        )}
      </div>

      {/* Category Name & Sum/Value */}
      <div className="mt-6 space-y-1">
        <h3 className="font-bold text-slate-800 tracking-tight text-sm truncate">
          {category.name}
        </h3>
        <p className="text-xl font-bold text-slate-950 font-mono tracking-tight">
          {formatCurrency(sum)}
        </p>
      </div>

      {/* Footer Info Label */}
      <div className="mt-3 pt-2.5 flex items-center justify-between text-[10px] text-slate-400 font-medium uppercase tracking-wider">
        <span>{category.type === 'asset' ? 'Wartość' : 'W tym miesiącu'}</span>
        {category.isCustom && <span className="text-indigo-500 font-semibold normal-case">Własny</span>}
      </div>
    </div>
  );
};
