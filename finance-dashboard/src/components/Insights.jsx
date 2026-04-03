import { useApp } from '../context/AppContext';
import { CATEGORY_COLORS } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const fmt = (n) => '₹' + n.toLocaleString('en-IN');
const MONTH_KEYS   = ['2026-01', '2026-02', '2026-03'];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar'];

export default function Insights() {
  const { transactions } = useApp();

  const catTotals = transactions.filter((t) => t.type === 'expense')
    .reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + t.amount; return acc; }, {});
  const topCat = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];

  const monthly = MONTH_KEYS.map((key, i) => {
    const txs     = transactions.filter((t) => t.date.startsWith(key));
    const income  = txs.filter((t) => t.type === 'income' ).reduce((s, t) => s + t.amount, 0);
    const expense = txs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { month: MONTH_LABELS[i], income, expense, saved: income - expense };
  });

  const lastMonth  = monthly[monthly.length - 2];
  const thisMonth  = monthly[monthly.length - 1];
  const expDiff    = thisMonth.expense - lastMonth.expense;
  const expDiffPct = lastMonth.expense > 0 ? ((expDiff / lastMonth.expense) * 100).toFixed(1) : 0;
  const avgDaily   = (thisMonth.expense / 31).toFixed(0);
  const totalIncome  = transactions.filter((t) => t.type === 'income' ).reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const savingsRate  = totalIncome > 0 ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1) : 0;
  const maxExpense   = Math.max(...monthly.map((m) => m.expense));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', fontSize: 12 }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>{label}</p>
        {payload.map((p) => (
          <p key={p.dataKey} style={{ color: p.dataKey === 'income' ? 'var(--green)' : 'var(--red)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
            {p.dataKey.charAt(0).toUpperCase() + p.dataKey.slice(1)}: {fmt(p.value)}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Insights</h1>
          <p className="page-subtitle">Smart observations from your financial data</p>
        </div>
      </div>

      <div className="page-body">
        <div className="insights-grid" style={{ marginBottom: 20 }}>

          <div className="insight-card">
            <div className="insight-label">📉 Highest Spending Category</div>
            {topCat && <>
              <div className="insight-value" style={{ color: CATEGORY_COLORS[topCat[0]] || 'var(--red)' }}>{topCat[0]}</div>
              <div className="insight-desc">{fmt(topCat[1])} spent in total</div>
              <div style={{ marginTop: 12, height: 5, background: 'var(--bg-elevated)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: CATEGORY_COLORS[topCat[0]] || 'var(--red)', borderRadius: 99 }} />
              </div>
            </>}
          </div>

          <div className="insight-card">
            <div className="insight-label">🐷 Overall Savings Rate</div>
            <div className="insight-value" style={{ color: parseFloat(savingsRate) > 0 ? 'var(--green)' : 'var(--red)' }}>
              {savingsRate}%
            </div>
            <div className="insight-desc">of total income saved</div>
            <div style={{ marginTop: 12, height: 5, background: 'var(--bg-elevated)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(Math.max(savingsRate, 0), 100)}%`, height: '100%', background: 'var(--green)', borderRadius: 99 }} />
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-label">📅 Month-over-Month Expenses</div>
            <div className="insight-value" style={{ color: expDiff > 0 ? 'var(--red)' : 'var(--green)' }}>
              {expDiff > 0 ? '↑' : '↓'} {Math.abs(expDiffPct)}%
            </div>
            <div className="insight-desc">
              {expDiff > 0 ? 'increase' : 'decrease'} vs previous month ({fmt(Math.abs(expDiff))})
            </div>
            <div className="month-row" style={{ marginTop: 14 }}>
              {[lastMonth, thisMonth].map((m, i) => (
                <div key={i} className="month-bar-wrap">
                  <div className="month-bar-top">
                    <span>{MONTH_LABELS[MONTH_LABELS.length - 2 + i]} Expense</span>
                    <span style={{ color: 'var(--red)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>{fmt(m.expense)}</span>
                  </div>
                  <div className="month-bar-track">
                    <div className="month-bar-fill" style={{ width: `${(m.expense / maxExpense) * 100}%`, background: 'var(--red)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-label">📊 Average Daily Spend (Mar)</div>
            <div className="insight-value" style={{ color: 'var(--yellow)' }}>{fmt(parseInt(avgDaily))}</div>
            <div className="insight-desc">per day estimated this month</div>
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>Top categories this month</div>
              {Object.entries(
                transactions.filter((t) => t.type === 'expense' && t.date.startsWith('2026-03'))
                  .reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + t.amount; return acc; }, {})
              ).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([cat, amt]) => (
                <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: CATEGORY_COLORS[cat] || '#8892A4', flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 11.5, color: 'var(--text-secondary)' }}>{cat}</span>
                  <span style={{ fontSize: 12, fontFamily: 'var(--font-display)', fontWeight: 600 }}>{fmt(amt)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Monthly Income vs Expenses</div>
              <div className="chart-subtitle">Side-by-side comparison</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthly} margin={{ top: 5, right: 10, left: 0, bottom: 5 }} barCategoryGap="30%">
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income"  fill="var(--green)" radius={[5, 5, 0, 0]} opacity={0.85} />
              <Bar dataKey="expense" fill="var(--red)"   radius={[5, 5, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 20, marginTop: 12, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
            {monthly.map((m) => (
              <div key={m.month} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{m.month} Saved</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: m.saved >= 0 ? 'var(--green)' : 'var(--red)' }}>
                  {m.saved >= 0 ? '+' : ''}{fmt(m.saved)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}