# Personal Finance Dashboard (Zarządzanie Finansami Osobistymi)

A modern, responsive, and intuitive Personal Finance Management application built with React, TypeScript, and Vite. This application helps you track your income, expenses, and current assets effortlessly, providing clear insights into your financial health.

## ✨ Features

- **Dashboard Views**: Dedicated views for Income, Expenses, and Assets.
- **Transaction Management**: Add, list, and delete transactions per category.
- **Custom Categories**: Create custom categories and assign unique colors for better visual organization.
- **Monthly Tracking**: Navigate between months to review your financial history.
- **Assets Tracking**: Keep track of the current value of your investments, savings, and physical assets.
- **Analytics**: Built-in analytics dashboard to visualize your financial data.
- **Modern UI**: Clean and beautiful interface with Dark Mode support, built with Tailwind CSS and Lucide React icons.

## 🛠️ Technology Stack

- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: React Context (`FinanceContext`)

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Navigate to the project directory:
   ```bash
   cd zarządzanie-finansami-osobistymi2
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit the URL displayed in your terminal (typically `http://localhost:3000` or `http://localhost:5173`) to view the app.

## 📁 Project Structure

- `src/components/`: Reusable UI components (Sidebar, Modals, Cards, Analytics).
- `src/context/`: Contains the `FinanceContext` for global state management of transactions, categories, and assets.
- `src/types.ts`: TypeScript interfaces and type definitions, including color presets.
- `src/App.tsx`: Main application component handling routing and dashboard layout.
