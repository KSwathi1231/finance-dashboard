import { useApp } from '../context/AppContext';

const fmt = (n) => '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });

export default function SummaryCards() {
  const { summary } = useApp();
  const cards = [
    { cls: 'balance', label: 'Total Balance', amount: summary.balance, icon: '💰', sub: 'Net of all income & expenses' },
    { cls: 'income',  label: 'Total Income',  amount: summary.income,  icon: '📈', sub: 'All credits received' },
    { cls: 'expense', label: 'Total Expenses',amount: summary.expenses,icon: '📉', sub: 'All debits made' },
  ];
  return (
    <div className="summary-grid">
      {cards.map(({ cls, label, amount, icon, sub }) => (
        <div key={cls} className={`summary-card ${cls}`}>
          <div className="summary-card-icon">{icon}</div>
          <div className="summary-card-label">{label}</div>
          <div className="summary-card-amount">{fmt(amount)}</div>
          <div className="summary-card-sub">{sub}</div>
        </div>
      ))}
    </div>
  );
}