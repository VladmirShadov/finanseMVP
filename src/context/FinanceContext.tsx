import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Category, Transaction, AssetsValues, COLOR_PRESETS } from '../types';

interface FinanceContextType {
  categories: Category[];
  transactions: Transaction[];
  assetsValues: AssetsValues;
  currentYearMonth: string; // Format: "YYYY-MM"
  setYearMonth: (ym: string) => void;
  nextMonth: () => void;
  prevMonth: () => void;
  addCategory: (name: string, type: 'income' | 'expense' | 'asset', colorId: string) => void;
  deleteCategory: (id: string) => void;
  addTransaction: (categoryId: string, amount: number, date: string, type: 'income' | 'expense', description?: string) => void;
  deleteTransaction: (id: string) => void;
  updateAssetValue: (categoryId: string, amount: number) => void;
  getFilteredTransactions: (type: 'income' | 'expense') => Transaction[];
  getCategorySum: (categoryId: string, type: 'income' | 'expense' | 'asset') => number;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// Initial default categories
const DEFAULT_CATEGORIES: Category[] = [
  // Expenses
  { id: 'cat-rent', name: 'Rent', type: 'expense', colorId: 'violet', isCustom: false },
  { id: 'cat-food', name: 'Food', type: 'expense', colorId: 'amber', isCustom: false },
  { id: 'cat-fun', name: 'Entertainment', type: 'expense', colorId: 'rose', isCustom: false },
  
  // Income
  { id: 'cat-salary', name: 'Salary', type: 'income', colorId: 'emerald', isCustom: false },
  { id: 'cat-bonus', name: 'Bonus', type: 'income', colorId: 'teal', isCustom: false },
  
  // Assets
  { id: 'cat-home', name: 'Home', type: 'asset', colorId: 'blue', isCustom: false },
  { id: 'cat-car', name: 'Car', type: 'asset', colorId: 'violet', isCustom: false },
  { id: 'cat-savings', name: 'Savings', type: 'asset', colorId: 'emerald', isCustom: false },
];

// Initial default transactions for a polished first load experience
const DEFAULT_TRANSACTIONS: Transaction[] = [
  { id: 't-1', categoryId: 'cat-salary', amount: 8500, date: '2026-07-10', type: 'income', description: 'Base Salary' },
  { id: 't-2', categoryId: 'cat-bonus', amount: 1500, date: '2026-07-11', type: 'income', description: 'Quarterly Bonus' },
  { id: 't-3', categoryId: 'cat-rent', amount: 2800, date: '2026-07-01', type: 'expense', description: 'Rent for July' },
  { id: 't-4', categoryId: 'cat-food', amount: 650, date: '2026-07-05', type: 'expense', description: 'Groceries week 1' },
  { id: 't-5', categoryId: 'cat-fun', amount: 240, date: '2026-07-08', type: 'expense', description: 'Cinema and restaurant' },
  { id: 't-6', categoryId: 'cat-food', amount: 350, date: '2026-07-11', type: 'expense', description: 'Dinner with friends' },
];

const DEFAULT_ASSETS_VALUES: AssetsValues = {
  'cat-home': 450000,
  'cat-car': 35000,
  'cat-savings': 12000,
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from localStorage with defaults as fallback
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('fin_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('fin_transactions');
    return saved ? JSON.parse(saved) : DEFAULT_TRANSACTIONS;
  });

  const [assetsValues, setAssetsValues] = useState<AssetsValues>(() => {
    const saved = localStorage.getItem('fin_assets_values');
    return saved ? JSON.parse(saved) : DEFAULT_ASSETS_VALUES;
  });

  // Current selected month, default to actual current month if not saved in session
  const [currentYearMonth, setCurrentYearMonth] = useState<string>(() => {
    const saved = sessionStorage.getItem('fin_current_month');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return saved;
      }
    }
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  });

  // Save states to localStorage when they change
  useEffect(() => {
    localStorage.setItem('fin_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('fin_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('fin_assets_values', JSON.stringify(assetsValues));
  }, [assetsValues]);

  useEffect(() => {
    sessionStorage.setItem('fin_current_month', JSON.stringify(currentYearMonth));
  }, [currentYearMonth]);

  // Month navigation helpers
  const setYearMonth = useCallback((ym: string) => {
    setCurrentYearMonth(ym);
  }, []);

  const lastMonthChange = useRef<number>(0);

  const nextMonth = useCallback(() => {
    const now = Date.now();
    if (now - lastMonthChange.current < 200) return;
    lastMonthChange.current = now;

    setCurrentYearMonth((prev) => {
      const [year, month] = prev.split('-').map(Number);
      let newYear = year;
      let newMonth = month + 1;
      if (newMonth > 12) {
        newMonth = 1;
        newYear += 1;
      }
      return `${newYear}-${newMonth.toString().padStart(2, '0')}`;
    });
  }, []);

  const prevMonth = useCallback(() => {
    const now = Date.now();
    if (now - lastMonthChange.current < 200) return;
    lastMonthChange.current = now;

    setCurrentYearMonth((prev) => {
      const [year, month] = prev.split('-').map(Number);
      let newYear = year;
      let newMonth = month - 1;
      if (newMonth < 1) {
        newMonth = 12;
        newYear -= 1;
      }
      return `${newYear}-${newMonth.toString().padStart(2, '0')}`;
    });
  }, []);

  // Categories operations
  const addCategory = (name: string, type: 'income' | 'expense' | 'asset', colorId: string) => {
    const newCategory: Category = {
      id: `cat-custom-${Date.now()}`,
      name,
      type,
      colorId,
      isCustom: true,
    };
    setCategories((prev) => [...prev, newCategory]);
    
    // If it's an asset, set its initial value to 0
    if (type === 'asset') {
      setAssetsValues((prev) => ({
        ...prev,
        [newCategory.id]: 0,
      }));
    }
  };

  const deleteCategory = (id: string) => {
    // Allow deleting any category
    const category = categories.find((c) => c.id === id);
    if (!category) return;

    setCategories((prev) => prev.filter((c) => c.id !== id));
    
    // Clean up associated transactions
    setTransactions((prev) => prev.filter((t) => t.categoryId !== id));

    // Clean up asset value if it was an asset
    if (category.type === 'asset') {
      setAssetsValues((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  // Transactions operations
  const addTransaction = (
    categoryId: string,
    amount: number,
    date: string,
    type: 'income' | 'expense',
    description?: string
  ) => {
    const newTransaction: Transaction = {
      id: `trans-${Date.now()}`,
      categoryId,
      amount,
      date,
      type,
      description: description || undefined,
    };
    setTransactions((prev) => [...prev, newTransaction]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Assets operations
  const updateAssetValue = (categoryId: string, amount: number) => {
    setAssetsValues((prev) => ({
      ...prev,
      [categoryId]: amount,
    }));
  };

  // Filter transactions for current month and selected type
  const getFilteredTransactions = (type: 'income' | 'expense') => {
    return transactions.filter(
      (t) => t.type === type && t.date.startsWith(currentYearMonth)
    );
  };

  // Calculate sum for a specific category in current month or as absolute value for assets
  const getCategorySum = (categoryId: string, type: 'income' | 'expense' | 'asset') => {
    if (type === 'asset') {
      return assetsValues[categoryId] || 0;
    }

    return transactions
      .filter((t) => t.categoryId === categoryId && t.date.startsWith(currentYearMonth))
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <FinanceContext.Provider
      value={{
        categories,
        transactions,
        assetsValues,
        currentYearMonth,
        setYearMonth,
        nextMonth,
        prevMonth,
        addCategory,
        deleteCategory,
        addTransaction,
        deleteTransaction,
        updateAssetValue,
        getFilteredTransactions,
        getCategorySum,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
