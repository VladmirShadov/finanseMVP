import { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Sidebar, ViewType } from './components/Sidebar';
import { CategoryCard, formatCurrency } from './components/CategoryCard';
import { TransactionModal } from './components/TransactionModal';
import { CategoryModal } from './components/CategoryModal';
import { Analytics } from './components/Analytics';
import { Category, COLOR_PRESETS } from './types';
import { 
  Plus, 
  CalendarDays, 
  ArrowUpRight, 
  ArrowDownRight, 
  Coins, 
  Trash2, 
  Banknote,
  ChevronRight,
  Info
} from 'lucide-react';

function DashboardContent() {
  const [currentView, setCurrentView] = useState<ViewType>('income');
  
  // Modal states
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const [isCatModalOpen, setIsCatModalOpen] = useState(false);

  const {
    categories,
    transactions,
    currentYearMonth,
    nextMonth,
    prevMonth,
    addCategory,
    deleteCategory,
    addTransaction,
    deleteTransaction,
    updateAssetValue,
    getFilteredTransactions,
    getCategorySum,
  } = useFinance();

  // Handle transaction or asset value submit
  const handleTxSubmit = (data: { amount: number; date?: string; description?: string }) => {
    if (!selectedCategory) return;
    
    if (selectedCategory.type === 'asset') {
      updateAssetValue(selectedCategory.id, data.amount);
    } else {
      addTransaction(
        selectedCategory.id,
        data.amount,
        data.date || '',
        selectedCategory.type as 'income' | 'expense',
        data.description
      );
    }
  };

  // Handle custom category addition
  const handleCatSubmit = (name: string, colorId: string) => {
    // Determine category type based on current view
    const type = currentView === 'asset' ? 'asset' : currentView === 'income' ? 'income' : 'expense';
    addCategory(name, type, colorId);
  };

  // Filter categories to display based on active view
  const activeCategories = categories.filter((c) => c.type === currentView);

  // Filter transactions for listing based on active view
  const monthlyTransactions = currentView === 'asset' 
    ? [] 
    : getFilteredTransactions(currentView as 'income' | 'expense')
        .sort((a, b) => {
          const dateCompare = b.date.localeCompare(a.date);
          if (dateCompare !== 0) return dateCompare;
          // Extract numbers from id to sort same-day transactions (newer on top)
          const numA = parseInt(a.id.replace(/\D/g, '')) || 0;
          const numB = parseInt(b.id.replace(/\D/g, '')) || 0;
          return numB - numA;
        });

  // Sums for current view
  const currentTotalSum = activeCategories.reduce((sum, c) => sum + getCategorySum(c.id, c.type), 0);

  // Helper to get formatted Polish name for month
  const getPolishMonthName = (ym: string) => {
    const [year, month] = ym.split('-');
    const date = new Date(Number(year), Number(month) - 1, 1);
    const formatted = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50/50 dark:bg-black font-sans">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
      />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full space-y-8 overflow-y-auto">
        
        {currentView === 'analytics' ? (
          <Analytics />
        ) : (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* View Header with Optional Month Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-indigo-600 uppercase">
                  {currentView === 'income' ? 'Income' : currentView === 'expense' ? 'Expenses' : 'Assets'}
                </span>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight mt-0.5">
                  {currentView === 'income' ? 'Income Management' : currentView === 'expense' ? 'Expense Management' : 'Current Assets'}
                </h2>
                <p className="text-xs text-slate-400 dark:text-zinc-400 mt-0.5">
                  {currentView === 'asset' 
                    ? 'Enter and manage the value of your goods, investments, and savings' 
                    : 'Filter, register and analyze financial movements by category'
                  }
                </p>
              </div>

              {/* Show Month Selector only for monthly views (Income/Expense) */}
              {currentView !== 'asset' && (
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-800/50 p-1.5 rounded-xl border border-slate-100 dark:border-zinc-800 self-start sm:self-auto">
                  <button
                    onClick={prevMonth}
                    className="p-2 rounded-lg hover:bg-white dark:hover:bg-zinc-900 dark:hover:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:text-slate-800 hover:dark:text-white hover:shadow-xs transition-all cursor-pointer"
                    title="Previous month"
                  >
                    &larr;
                  </button>
                  <span className="px-4 text-sm font-bold text-slate-700 dark:text-zinc-200 w-44 text-center select-none flex items-center justify-center gap-2 whitespace-nowrap">
                    <CalendarDays className="w-4 h-4 text-slate-400 dark:text-zinc-400 shrink-0" />
                    {getPolishMonthName(currentYearMonth)}
                  </span>
                  <button
                    onClick={nextMonth}
                    className="p-2 rounded-lg hover:bg-white dark:hover:bg-zinc-900 dark:hover:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:text-slate-800 hover:dark:text-white hover:shadow-xs transition-all cursor-pointer"
                    title="Next month"
                  >
                    &rarr;
                  </button>
                </div>
              )}
            </div>

            {/* Total Balance Ribbon */}
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-4">
                <div className={`p-3.5 rounded-xl ${
                  currentView === 'income' 
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                    : currentView === 'expense' 
                      ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400' 
                      : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                }`}>
                  {currentView === 'income' ? (
                    <ArrowUpRight className="w-6 h-6" />
                  ) : currentView === 'expense' ? (
                    <ArrowDownRight className="w-6 h-6" />
                  ) : (
                    <Coins className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-400 uppercase tracking-wider">
                    {currentView === 'income' 
                      ? 'Total income in selected month' 
                      : currentView === 'expense' 
                        ? 'Total expenses in selected month' 
                        : 'Total value of registered assets'
                    }
                  </p>
                  <p className="text-2xl font-black text-slate-800 dark:text-white tracking-tight mt-0.5">
                    {formatCurrency(currentTotalSum)}
                  </p>
                </div>
              </div>

              {currentView === 'asset' && (
                <div className="relative group">
                  <div className="p-2 rounded-full hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <Info className="w-5 h-5 text-slate-400 dark:text-zinc-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <div className="absolute bottom-full right-0 mb-2 w-64 bg-slate-800 dark:bg-slate-700 text-white text-xs font-medium p-3 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 shadow-lg pointer-events-none">
                    Assets are indefinite and only show the current, overwritten state of funds.
                    <div className="absolute top-full right-3 -mt-1 w-2.5 h-2.5 bg-slate-800 dark:bg-slate-700 rotate-45"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Categories Grid */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-500 dark:text-zinc-300 tracking-wider uppercase">
                Tile categories ({activeCategories.length})
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {activeCategories.map((cat) => {
                  const sum = getCategorySum(cat.id, cat.type);
                  return (
                    <CategoryCard
                      key={cat.id}
                      category={cat}
                      sum={sum}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsTxModalOpen(true);
                      }}
                      onDelete={() => deleteCategory(cat.id)}
                    />
                  );
                })}

                {/* Create Category Trigger Card */}
                <button
                  onClick={() => setIsCatModalOpen(true)}
                  className="group flex flex-col items-center justify-center p-6 min-h-44 bg-slate-50 dark:bg-zinc-900/50 hover:bg-slate-100/70 dark:hover:bg-zinc-900 dark:hover:border-zinc-700 border-2 border-dashed border-slate-200 dark:border-zinc-800 hover:border-slate-300 rounded-2xl transition-all duration-300 cursor-pointer text-center space-y-3"
                >
                  <div className="p-3 bg-white dark:bg-zinc-900 text-slate-400 dark:text-zinc-400 group-hover:text-indigo-600 group-hover:bg-transparent rounded-xl shadow-sm dark:shadow-none group-hover:shadow-none group-hover:scale-105 transition-all">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700 dark:text-zinc-200">New category</p>
                    <p className="text-xs text-slate-400 dark:text-zinc-400 mt-0.5">Add a unique tile</p>
                  </div>
                </button>
              </div>
            </div>

            {/* List of Recent Transactions (Only for monthly views Income/Expense) */}
            {currentView !== 'asset' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-500 dark:text-zinc-300 tracking-wider uppercase">
                  List of transactions this month ({monthlyTransactions.length})
                </h3>

                {monthlyTransactions.length === 0 ? (
                  <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 p-12 text-center flex flex-col items-center justify-center space-y-3">
                    <div className="p-3.5 bg-slate-50 dark:bg-zinc-800/50 rounded-full text-slate-300">
                      <Banknote className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-600 dark:text-zinc-300">No operations registered</p>
                      <p className="text-xs text-slate-400 dark:text-zinc-400 mt-0.5">Click on a tile above to add your first transaction</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto overflow-y-auto max-h-[400px]">
                      <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-zinc-800/95 backdrop-blur-sm">
                          <tr className="border-b border-slate-100 dark:border-zinc-800 text-[10px] font-bold text-slate-400 dark:text-zinc-400 uppercase tracking-wider">
                            <th className="py-4 px-6">Category</th>
                            <th className="py-4 px-6">Date</th>
                            <th className="py-4 px-6">Description</th>
                            <th className="py-4 px-6 text-right">Amount</th>
                            <th className="py-4 px-6 text-center w-20">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-none text-sm font-medium text-slate-700 dark:text-zinc-200">
                          {monthlyTransactions.map((tx) => {
                            const cat = categories.find((c) => c.id === tx.categoryId);
                            const preset = cat 
                              ? COLOR_PRESETS.find((p) => p.id === cat.colorId) 
                              : COLOR_PRESETS[0];

                            return (
                              <tr key={tx.id} className=" transition-colors">
                                {/* Category Name */}
                                <td className="py-4 px-6">
                                  <div className="flex items-center gap-2.5">
                                    <span 
                                      className="w-3 h-3 rounded-full shrink-0" 
                                      style={{ backgroundColor: preset?.text }}
                                    />
                                    <span className="font-bold text-slate-800 dark:text-white">
                                      {cat ? cat.name : 'Unknown'}
                                    </span>
                                  </div>
                                </td>

                                {/* Transaction Date */}
                                <td className="py-4 px-6 text-slate-500 dark:text-zinc-300 text-xs font-mono">
                                  {tx.date}
                                </td>

                                {/* Description */}
                                <td className="py-4 px-6 text-slate-600 dark:text-zinc-300 italic">
                                  {tx.description || <span className="text-slate-300">-</span>}
                                </td>

                                {/* Amount */}
                                <td className={`py-4 px-6 text-right font-bold text-base ${
                                  tx.type === 'income' ? 'text-emerald-600' : 'text-slate-800 dark:text-white'
                                }`}>
                                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                                </td>

                                {/* Actions */}
                                <td className="py-4 px-6 text-center">
                                  <button
                                    onClick={() => {
                                      deleteTransaction(tx.id);
                                    }}
                                    className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 dark:text-zinc-400 hover:text-rose-600 transition-all cursor-pointer"
                                    title="Delete transaction"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Transaction & Asset Input Modal */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        category={selectedCategory}
        currentValue={selectedCategory ? getCategorySum(selectedCategory.id, selectedCategory.type) : 0}
        selectedYearMonth={currentYearMonth}
        onSubmit={handleTxSubmit}
      />

      {/* Category Creation Modal */}
      <CategoryModal
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
        type={currentView === 'asset' ? 'asset' : currentView === 'income' ? 'income' : 'expense'}
        onSubmit={handleCatSubmit}
      />
    </div>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <DashboardContent />
    </FinanceProvider>
  );
}
