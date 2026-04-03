import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, CATEGORY_COLORS } from '../data/mockData';
import TransactionModal from './TransactionModal';

const fmt = (n) => '₹' + n.toLocaleString('en-IN');

const MONTHS = [
  { value: 'all',     label: 'All Months' },
  { value: '2026-01', label: 'Jan 2026'   },
  { value: '2026-02', label: 'Feb 2026'   },
  { value: '2026-03', label: 'Mar 2026'   },
];

export default function Transactions() {
  const { filteredTransactions, filters, setFilters, role, deleteTransaction } = useApp();

  const [sortKey, setSortKey] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [modal, setModal] = useState(null);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const sorted = [...filteredTransactions].sort((a, b) => {
    let va = a[sortKey], vb = b[sortKey];
    if (sortKey === 'amount') {
      va = +va;
      vb = +vb;
    }
    if (va < vb) return sortDir === 'asc' ? -1 : 1;
    if (va > vb) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const ThBtn = ({ k, label }) => (
    <th onClick={() => handleSort(k)} style={{ cursor: 'pointer' }}>
      {label} {sortKey === k ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
    </th>
  );

  return (
    <div>
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">
            {sorted.length === 0
              ? "No records found"
              : `${sorted.length} transaction${sorted.length > 1 ? 's' : ''} found`}
          </p>
        </div>

        {role === 'admin' && (
          <button className="btn btn-primary" onClick={() => setModal('add')}>
            + Add Transaction
          </button>
        )}
      </div>

      <div className="page-body">
        <div className="card">

          {/* FILTERS */}
          <div className="tx-filters">
            <div className="search-box">
              <span>🔍</span>
              <input
                placeholder="Search transactions..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, search: e.target.value }))
                }
              />
            </div>

            <select
              className="filter-select"
              value={filters.type}
              onChange={(e) =>
                setFilters((f) => ({ ...f, type: e.target.value }))
              }
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <select
              className="filter-select"
              value={filters.category}
              onChange={(e) =>
                setFilters((f) => ({ ...f, category: e.target.value }))
              }
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <select
              className="filter-select"
              value={filters.month}
              onChange={(e) =>
                setFilters((f) => ({ ...f, month: e.target.value }))
              }
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* 🔥 EMPTY STATE */}
          {sorted.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '50px 0',
              color: 'var(--text-muted)'
            }}>
              <div style={{ fontSize: 18, marginBottom: 8 }}>
                🔍 No transactions found
              </div>

              {filters.search ? (
                <div style={{ fontSize: 13, marginBottom: 12 }}>
                  No results for "<b>{filters.search}</b>"
                </div>
              ) : (
                <div style={{ fontSize: 13, marginBottom: 12 }}>
                  Try adjusting filters or add a transaction
                </div>
              )}

              {/* RESET FILTERS */}
              <button
                className="btn btn-secondary"
                onClick={() =>
                  setFilters({
                    search: '',
                    type: 'all',
                    category: 'all',
                    month: 'all',
                  })
                }
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="tx-table-wrap">
              <table className="tx-table">
                <thead>
                  <tr>
                    <ThBtn k="date" label="Date" />
                    <ThBtn k="description" label="Description" />
                    <th>Category</th>
                    <th>Type</th>
                    <ThBtn k="amount" label="Amount" />
                    {role === 'admin' && <th>Actions</th>}
                  </tr>
                </thead>

                <tbody>
                  {sorted.map((tx) => (
                    <tr
                      key={tx.id}
                      style={{ transition: 'background 0.2s' }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          'rgba(255,255,255,0.03)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          'transparent')
                      }
                    >
                      <td>
                        <span className="tx-date">
                          {new Date(tx.date).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </td>

                      <td>
                        <span className="tx-desc">{tx.description}</span>
                      </td>

                      <td>
                        <span className="category-pill">
                          <span
                            className="cat-dot"
                            style={{
                              background:
                                CATEGORY_COLORS[tx.category] || '#8892A4',
                            }}
                          />
                          {tx.category}
                        </span>
                      </td>

                      <td>
                        <span className={`type-badge ${tx.type}`}>
                          {tx.type}
                        </span>
                      </td>

                      <td>
                        <span className={`tx-amount ${tx.type}`}>
                          {tx.type === 'income' ? '+' : '-'}
                          {fmt(tx.amount)}
                        </span>
                      </td>

                      {role === 'admin' && (
                        <td>
                          <div className="tx-actions">
                            <button
                              className="icon-btn"
                              onClick={() => setModal(tx)}
                            >
                              ✏️
                            </button>
                            <button
                              className="icon-btn danger"
                              onClick={() => deleteTransaction(tx.id)}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {modal && (
        <TransactionModal
          existing={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}