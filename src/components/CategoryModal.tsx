import React, { useState, useEffect } from 'react';
import { X, Tag } from 'lucide-react';
import { COLOR_PRESETS, CategoryType } from '../types';
import { useTheme } from '../hooks/useTheme';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: CategoryType;
  onSubmit: (name: string, colorId: string) => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  type,
  onSubmit,
}) => {
  const [name, setName] = useState<string>('');
  const [selectedColorId, setSelectedColorId] = useState<string>(COLOR_PRESETS[0].id);
  const { isDark } = useTheme();

  useEffect(() => {
    if (isOpen) {
      setName('');
      setSelectedColorId(COLOR_PRESETS[0].id);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a category name.');
      return;
    }
    onSubmit(name.trim(), selectedColorId);
    onClose();
  };

  const typeLabels = {
    income: 'Income',
    expense: 'Expense',
    asset: 'Asset',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity duration-300">
      <div 
        className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden border border-slate-100 dark:border-zinc-800 transform transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 flex justify-between items-center border-b border-slate-50 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-zinc-400">
              New Category
            </span>
            <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-white">
              Add {typeLabels[type]}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:bg-zinc-800 dark:hover:bg-slate-700 transition-colors text-slate-400 dark:text-zinc-400 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Category Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-zinc-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-400" />
              Category Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Coffee, Transport, Subscriptions"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-slate-700 dark:text-zinc-200 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-800 transition-all"
            />
          </div>

          {/* Color Palette Selector */}
          <div>
            <label className="block mb-3 text-xs font-semibold text-slate-500 dark:text-zinc-300">
              Select a pastel color
            </label>
            <div className="grid grid-cols-5 gap-3">
              {COLOR_PRESETS.map((preset) => {
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedColorId(preset.id)}
                    style={{ backgroundColor: preset.bg, borderColor: preset.border }}
                    className={`aspect-square rounded-xl border-2 transition-all duration-200 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 ${
                      selectedColorId === preset.id 
                        ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-zinc-950 scale-105' 
                        : 'opacity-85 hover:opacity-100'
                    }`}
                    title={preset.name}
                  >
                    <span 
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: preset.text }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-50 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm font-semibold text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white shadow-md bg-indigo-600 hover:bg-indigo-700 transition-all active:scale-98 cursor-pointer"
            >
              Create category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
