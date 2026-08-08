import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, FileText } from 'lucide-react';
import { Category, COLOR_PRESETS } from '../types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  currentValue?: number; // Prefilled for assets or existing calculations
  selectedYearMonth: string; // YYYY-MM
  onSubmit: (data: { amount: number; date?: string; description?: string }) => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  category,
  currentValue = 0,
  selectedYearMonth,
  onSubmit,
}) => {
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    if (category) {
      if (category.type === 'asset') {
        setAmount(currentValue > 0 ? currentValue.toString() : '');
      } else {
        setAmount('');
        setDescription('');
        
        // Calculate initial date: current day if it matches selected month, else 1st of the month
        const today = new Date();
        const todayYearMonth = today.toISOString().slice(0, 7); // "YYYY-MM"
        if (todayYearMonth === selectedYearMonth) {
          setDate(today.toISOString().split('T')[0]);
        } else {
          setDate(`${selectedYearMonth}-01`);
        }
      }
    }
  }, [category, currentValue, selectedYearMonth, isOpen]);

  if (!isOpen || !category) return null;

  const colorPreset = COLOR_PRESETS.find((p) => p.id === category.colorId) || COLOR_PRESETS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      alert('Wprowadź poprawną kwotę.');
      return;
    }

    if (category.type === 'asset') {
      onSubmit({ amount: parsedAmount });
    } else {
      if (!date) {
        alert('Proszę wybrać datę.');
        return;
      }
      onSubmit({
        amount: parsedAmount,
        date,
        description: description.trim(),
      });
    }
    onClose();
  };

  const isAsset = category.type === 'asset';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity duration-300">
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 transform transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="p-5 flex justify-between items-center text-white"
          style={{ backgroundColor: colorPreset.text }}
        >
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase opacity-80">
              {category.type === 'income' ? 'Dodaj Przychód' : category.type === 'expense' ? 'Dodaj Wydatek' : 'Aktualizacja Zasobu'}
            </span>
            <h2 className="text-xl font-bold tracking-tight mt-0.5">{category.name}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Amount input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-slate-400" />
              {isAsset ? 'Nowa wartość zasobu' : 'Kwota'}
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-all pr-12"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                zł
              </span>
            </div>
          </div>

          {!isAsset && (
            <>
              {/* Date Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Data transakcji
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>

              {/* Description Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Opis (opcjonalny)
                </label>
                <input
                  type="text"
                  placeholder="np. Zakupy, premia za projekt"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </>
          )}

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-98 cursor-pointer"
              style={{ backgroundColor: colorPreset.text }}
            >
              {isAsset ? 'Uaktualnij' : 'Zapisz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
