import { createContext, useContext, useState, useMemo } from 'react';
import { mockTransactions } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [role, setRole] = useState('viewer');
  const [filters, setFilters] = useState({
    search: '', type: 'all', category: 'all', month: 'all',
  });
  const [activePage, setActivePage] = useState('dashboard');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch =
        t.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.category.toLowerCase().includes(filters.search.toLowerCase());
      const matchType     = filters.type     === 'all' || t.type     === filters.type;
      const matchCategory = filters.category === 'all' || t.category === filters.category;
      const matchMonth    = filters.month    === 'all' || t.date.startsWith(filters.month);
      return matchSearch && matchType && matchCategory && matchMonth;
    });
  }, [transactions, filters]);

  const addTransaction    = (tx) => setTransactions((p) => [{ ...tx, id: Date.now() }, ...p]);
  const editTransaction   = (id, u) => setTransactions((p) => p.map((t) => t.id === id ? { ...t, ...u } : t));
  const deleteTransaction = (id)    => setTransactions((p) => p.filter((t) => t.id !== id));

  const summary = useMemo(() => {
    const income   = transactions.filter((t) => t.type === 'income' ).reduce((s,t) => s+t.amount, 0);
    const expenses = transactions.filter((t) => t.type === 'expense').reduce((s,t) => s+t.amount, 0);
    return { income, expenses, balance: income - expenses };
  }, [transactions]);

  return (
    <AppContext.Provider value={{
      transactions, filteredTransactions,
      filters, setFilters,
      role, setRole,
      activePage, setActivePage,
      addTransaction, editTransaction, deleteTransaction,
      summary,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);