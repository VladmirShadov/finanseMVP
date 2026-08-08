export type CategoryType = 'income' | 'expense' | 'asset';

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  colorId: string; // Reference to one of our preset colors
  isCustom?: boolean;
}

export interface Transaction {
  id: string;
  categoryId: string;
  amount: number;
  date: string; // YYYY-MM-DD
  type: 'income' | 'expense';
  description?: string;
}

export interface AssetsValues {
  [categoryId: string]: number; // currentAmount
}

export interface ColorPreset {
  id: string;
  name: string;
  bg: string;     // e.g. '#E0F2FE'
  text: string;   // e.g. '#0369A1'
  border: string; // e.g. '#BAE6FD'
  hover: string;  // e.g. '#F0F9FF'
}

export const COLOR_PRESETS: ColorPreset[] = [
  {
    id: 'blue',
    name: 'Light Blue',
    bg: '#E0F2FE',
    text: '#0369A1',
    border: '#BAE6FD',
    hover: '#F0F9FF',
  },
  {
    id: 'emerald',
    name: 'Emerald',
    bg: '#D1FAE5',
    text: '#047857',
    border: '#A7F3D0',
    hover: '#ECFDF5',
  },
  {
    id: 'violet',
    name: 'Violet',
    bg: '#EDE9FE',
    text: '#6D28D9',
    border: '#DDD6FE',
    hover: '#F5F3FF',
  },
  {
    id: 'amber',
    name: 'Amber',
    bg: '#FEF3C7',
    text: '#B45309',
    border: '#FDE68A',
    hover: '#FFFDF2',
  },
  {
    id: 'rose',
    name: 'Rose',
    bg: '#FFE4E6',
    text: '#BE123C',
    border: '#FECDD3',
    hover: '#FFF5F5',
  },
  {
    id: 'teal',
    name: 'Teal',
    bg: '#CCFBF1',
    text: '#0F766E',
    border: '#99F6E4',
    hover: '#F0FDFA',
  },
  {
    id: 'pink',
    name: 'Pink',
    bg: '#FCE7F3',
    text: '#BE185D',
    border: '#FBCFE8',
    hover: '#FDF2F8',
  },
  {
    id: 'indigo',
    name: 'Indigo',
    bg: '#E0E7FF',
    text: '#4338CA',
    border: '#C7D2FE',
    hover: '#EEF2FF',
  },
  {
    id: 'cyan',
    name: 'Cyan',
    bg: '#CFFAFE',
    text: '#0E7490',
    border: '#A5F3FC',
    hover: '#ECFEFF',
  },
  {
    id: 'orange',
    name: 'Orange',
    bg: '#FFEDD5',
    text: '#C2410C',
    border: '#FED7AA',
    hover: '#FFF7ED',
  },
];
