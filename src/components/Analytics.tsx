import React, { useState } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { COLOR_PRESETS } from '../types';
import { formatCurrency } from './CategoryCard';
import { 
  TrendingUp, 
  TrendingDown, 
  Scale, 
  ShieldCheck,
  CalendarDays
} from 'lucide-react';

export const Analytics: React.FC = () => {
  const [chartView, setChartView] = useState<'expense' | 'income'>('expense');
  
  const { 
    categories, 
    transactions, 
    assetsValues, 
    currentYearMonth,
    getCategorySum,
    nextMonth,
    prevMonth
  } = useFinance();

  // Helper to get formatted Polish name for month
  const getPolishMonthName = (ym: string) => {
    const [year, month] = ym.split('-');
    const date = new Date(Number(year), Number(month) - 1, 1);
    const formatted = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  // Calculations for Metric Cards
  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');
  const assetCategories = categories.filter(c => c.type === 'asset');

  const totalIncome = incomeCategories.reduce((sum, c) => sum + getCategorySum(c.id, 'income'), 0);
  const totalExpenses = expenseCategories.reduce((sum, c) => sum + getCategorySum(c.id, 'expense'), 0);
  const balance = totalIncome - totalExpenses;
  
  const totalAssets = assetCategories.reduce((sum, c) => sum + (assetsValues[c.id] || 0), 0);

  // Pie Chart Data
  const activeCategories = chartView === 'expense' ? expenseCategories : incomeCategories;
  
  const pieData = activeCategories
    .map(c => {
      const sum = getCategorySum(c.id, chartView);
      const preset = COLOR_PRESETS.find(p => p.id === c.colorId) || COLOR_PRESETS[0];
      return {
        name: c.name,
        value: sum,
        color: preset.text,
        bg: preset.bg,
      };
    })
    .filter(item => item.value > 0);

  const totalPieValue = pieData.reduce((sum, item) => sum + item.value, 0);

  // Bar Chart Data (Income vs Expenses)
  const barData = [
    {
      name: 'Month',
      'Income': totalIncome,
      'Expenses': totalExpenses,
    }
  ];

  // Custom tooltips for nice styling
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-zinc-900 p-3.5 rounded-xl shadow-md border border-slate-200 dark:border-zinc-800 text-sm font-semibold text-slate-800 dark:text-white">
          <p className="text-xs font-medium text-slate-400 dark:text-zinc-400 mb-1">{payload[0].name}</p>
          <p className="text-indigo-600 font-bold">{formatCurrency(payload[0].value)}</p>
          {payload[0].payload.percent && (
            <p className="text-[10px] text-slate-500 dark:text-zinc-300 font-medium mt-0.5">
              Share: {(payload[0].payload.percent * 100).toFixed(1)}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Month Selector header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Financial Analytics</h2>
          <p className="text-xs text-slate-400 dark:text-zinc-400 mt-0.5">Automatic summaries and expense ratios</p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-1 rounded-xl border border-slate-200 dark:border-zinc-800 self-start sm:self-auto">
          <button
            onClick={prevMonth}
            className="p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/50 text-slate-600 dark:text-zinc-300 hover:text-slate-800 dark:text-white transition-all cursor-pointer"
            title="Previous month"
          >
            &larr;
          </button>
          <span className="px-3 text-xs font-bold text-slate-700 dark:text-zinc-200 dark:text-zinc-100 w-40 text-center select-none flex items-center justify-center gap-2 whitespace-nowrap">
            <CalendarDays className="w-4 h-4 text-slate-400 dark:text-zinc-400 shrink-0" />
            {getPolishMonthName(currentYearMonth)}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/50 text-slate-600 dark:text-zinc-300 hover:text-slate-800 dark:text-white transition-all cursor-pointer"
            title="Next month"
          >
            &rarr;
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Przychody */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-zinc-400 uppercase">
              Total Income
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-3">
            {formatCurrency(totalIncome)}
          </p>
        </div>

        {/* Wydatki */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-zinc-400 uppercase">
              Total Expenses
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-3">
            {formatCurrency(totalExpenses)}
          </p>
        </div>

        {/* Bilans */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-zinc-400 uppercase">
              Monthly Balance
            </span>
          </div>
          <p className={`text-2xl font-bold tracking-tight mt-3 ${balance >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
            {balance >= 0 ? '+' : ''}{formatCurrency(balance)}
          </p>
        </div>

        {/* Całkowity Majątek */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-zinc-400 uppercase">
              Total Assets
            </span>
          </div>
          <p className="text-2xl font-bold text-indigo-600 tracking-tight mt-3">
            {formatCurrency(totalAssets)}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* PieChart */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 flex flex-col justify-between">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white tracking-tight text-sm uppercase">Structure of {chartView === 'expense' ? 'expenses' : 'income'}</h3>
              <p className="text-xs text-slate-400 dark:text-zinc-400 mt-0.5">Percentage breakdown by category</p>
            </div>
            
            <div className="flex bg-slate-100 dark:bg-zinc-800 dark:bg-slate-700 p-1 rounded-lg">
              <button
                onClick={() => setChartView('expense')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  chartView === 'expense' 
                    ? 'bg-white dark:bg-zinc-900 text-slate-800 dark:text-white shadow-sm' 
                    : 'text-slate-500 dark:text-zinc-300 hover:text-slate-700 dark:text-zinc-200'
                }`}
              >
                Expenses
              </button>
              <button
                onClick={() => setChartView('income')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  chartView === 'income' 
                    ? 'bg-white dark:bg-zinc-900 text-slate-800 dark:text-white shadow-sm' 
                    : 'text-slate-500 dark:text-zinc-300 hover:text-slate-700 dark:text-zinc-200'
                }`}
              >
                Income
              </button>
            </div>
          </div>

          {pieData.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 dark:border-zinc-800">
              {chartView === 'expense' ? (
                <TrendingDown className="w-8 h-8 text-slate-300 dark:text-slate-600 dark:text-zinc-300 mb-2" />
              ) : (
                <TrendingUp className="w-8 h-8 text-slate-300 dark:text-slate-600 dark:text-zinc-300 mb-2" />
              )}
              <p className="text-xs font-semibold text-slate-500 dark:text-zinc-300">
                No recorded {chartView === 'expense' ? 'expenses' : 'income'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-full sm:w-1/2 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie stroke="transparent"
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legends list */}
              <div className="w-full sm:w-1/2 space-y-2 max-h-56 overflow-y-auto pr-2 scrollbar-thin text-xs">
                {pieData.map((item, index) => {
                  const percentage = ((item.value / totalPieValue) * 100).toFixed(1);
                  return (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <div className="flex items-center gap-2 truncate">
                        <span 
                          className="w-2.5 h-2.5 rounded-full shrink-0" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-semibold text-slate-700 dark:text-zinc-200 dark:text-zinc-100 truncate">{item.name}</span>
                      </div>
                      <div className="text-right shrink-0 pl-2">
                        <p className="font-bold text-slate-800 dark:text-white">{formatCurrency(item.value)}</p>
                        <p className="text-[10px] text-slate-400 dark:text-zinc-400">{percentage}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* BarChart */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-slate-200 dark:border-zinc-800 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-bold text-slate-800 dark:text-white tracking-tight text-sm uppercase">Budget Comparison</h3>
            <p className="text-xs text-slate-400 dark:text-zinc-400 mt-0.5">Income and expenses overview</p>
          </div>

          {totalIncome === 0 && totalExpenses === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 dark:border-zinc-800">
              <TrendingUp className="w-8 h-8 text-slate-300 dark:text-slate-600 dark:text-zinc-300 mb-2" />
              <p className="text-xs font-semibold text-slate-500 dark:text-zinc-300">No data for comparison</p>
            </div>
          ) : (
            <div className="w-full h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                  barGap={10}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="name" 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fill: '#64748B', fontSize: 11, fontWeight: 500 }}
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fill: '#64748B', fontSize: 10, fontWeight: 500 }}
                    tickFormatter={(val) => `${val} zł`}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0, 0, 0, 0.02)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white dark:bg-zinc-900 p-3 rounded-xl shadow-md border border-slate-200 dark:border-zinc-800 space-y-1 text-xs font-semibold">
                            <p className="text-slate-800 dark:text-white font-bold border-b border-slate-100 dark:border-zinc-800 pb-1">Monthly Summary</p>
                            {payload.map((p, idx) => (
                              <div key={idx} className="flex items-center gap-4 justify-between">
                                <span className="flex items-center gap-1.5 text-slate-500 dark:text-zinc-300">
                                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                                  {p.name}:
                                </span>
                                <span className="font-bold text-slate-800 dark:text-white">{formatCurrency(p.value as number)}</span>
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend 
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ paddingTop: '10px', fontSize: '11px', fontWeight: 500 }}
                  />
                  <Bar dataKey="Income" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={45} />
                  <Bar dataKey="Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
