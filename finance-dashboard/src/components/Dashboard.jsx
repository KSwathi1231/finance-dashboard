import SummaryCards from './SummaryCards';
import BalanceTrend from './BalanceTrend';
import SpendingBreakdown from './SpendingBreakdown';
import { useApp } from '../context/AppContext';
import { CATEGORY_COLORS } from '../data/mockData';

const fmt = (n) => '₹' + n.toLocaleString('en-IN');

export default function Dashboard() {
  const { transactions, role, setActivePage } = useApp();

  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div>
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome back — here's your financial overview
          </p>
        </div>

        {role === 'admin' && (
          <button
            className="btn btn-primary"
            onClick={() => setActivePage('transactions')}
          >
            + Add Transaction
          </button>
        )}
      </div>

      <div className="page-body">

        {/* SUMMARY */}
        <SummaryCards />

        {/* CHARTS */}
        <div className="charts-grid">
          <BalanceTrend />
          <SpendingBreakdown />
        </div>

        {/* RECENT TRANSACTIONS */}
        <div className="card">
          <div className="section-header-row">
            <div>
              <div className="chart-title">Recent Transactions</div>
              <div
                className="chart-subtitle"
                style={{ marginTop: 2 }}
              >
                Latest 5 entries
              </div>
            </div>

            <button
              className="btn btn-secondary"
              style={{ fontSize: 12, padding: '6px 12px' }}
              onClick={() => setActivePage('transactions')}
            >
              View All →
            </button>
          </div>

          {/* 🔥 EMPTY STATE (VERY IMPORTANT) */}
          {recent.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 0',
              color: 'var(--text-muted)'
            }}>
              <div style={{ fontSize: 16, marginBottom: 8 }}>
                No transactions yet
              </div>
              <div style={{ fontSize: 13 }}>
                Add your first transaction to see insights
              </div>
            </div>
          ) : (
            recent.map((tx, i) => (
              <div
                key={tx.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '11px 0',
                  borderTop:
                    i > 0 ? '1px solid var(--border)' : 'none',
                  transition: 'background 0.2s',
                  borderRadius: 8,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    'rgba(255,255,255,0.03)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    'transparent')
                }
              >
                {/* ICON */}
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    flexShrink: 0,
                    background: `${CATEGORY_COLORS[tx.category]}18`,
                    border: `1px solid ${CATEGORY_COLORS[tx.category]}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                  }}
                >
                  {tx.type === 'income' ? '💚' : '🔴'}
                </div>

                {/* DETAILS */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 500,
                      fontSize: 13,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {tx.description}
                  </div>

                  <div
                    style={{
                      fontSize: 11.5,
                      color: 'var(--text-muted)',
                      marginTop: 1,
                    }}
                  >
                    {tx.category} ·{' '}
                    {new Date(tx.date).toLocaleDateString(
                      'en-IN',
                      { day: '2-digit', month: 'short' }
                    )}
                  </div>
                </div>

                {/* AMOUNT */}
                <span className={`tx-amount ${tx.type}`}>
                  {tx.type === 'income' ? '+' : '-'}
                  {fmt(tx.amount)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}