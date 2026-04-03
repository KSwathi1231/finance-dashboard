import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../context/AppContext';

const MONTHS     = ['Jan 2026','Feb 2026','Mar 2026'];
const MONTH_KEYS = ['2026-01','2026-02','2026-03'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:10, padding:'10px 14px', fontSize:12 }}>
      <p style={{ color:'var(--text-secondary)', marginBottom:4 }}>{label}</p>
      <p style={{ color:'var(--accent)', fontFamily:'var(--font-display)', fontWeight:700 }}>
        ₹{payload[0].value.toLocaleString('en-IN')}
      </p>
    </div>
  );
};

export default function BalanceTrend() {
  const { transactions } = useApp();
  const data = MONTH_KEYS.map((key, i) => {
    const txs    = transactions.filter((t) => t.date.startsWith(key));
    const income  = txs.filter((t) => t.type==='income' ).reduce((s,t)=>s+t.amount,0);
    const expense = txs.filter((t) => t.type==='expense').reduce((s,t)=>s+t.amount,0);
    return { month: MONTHS[i], income, expense, net: income - expense };
  });

  return (
    <div className="card">
      <div className="chart-header">
        <div>
          <div className="chart-title">Balance Trend</div>
          <div className="chart-subtitle">Monthly net balance over time</div>
        </div>
        <div style={{ display:'flex', gap:14 }}>
          {[{color:'var(--accent)',label:'Net'},{color:'var(--green)',label:'Income'},{color:'var(--red)',label:'Expense'}].map(({color,label})=>(
            <div key={label} style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'var(--text-secondary)' }}>
              <span style={{ width:8, height:8, borderRadius:'50%', background:color, display:'inline-block' }}/>
              {label}
            </div>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top:5, right:5, left:0, bottom:0 }}>
          <defs>
            <linearGradient id="gradNet"     x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="var(--accent)" stopOpacity={0.25}/>
              <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="gradIncome"  x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="var(--green)" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="var(--green)" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="gradExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="var(--red)" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="var(--red)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false}/>
          <XAxis dataKey="month" tick={{ fill:'var(--text-muted)', fontSize:11 }} axisLine={false} tickLine={false}/>
          <YAxis tick={{ fill:'var(--text-muted)', fontSize:11 }} axisLine={false} tickLine={false}
            tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`}/>
          <Tooltip content={<CustomTooltip/>}/>
          <Area type="monotone" dataKey="income"  stroke="var(--green)" strokeWidth={2}   fill="url(#gradIncome)"  dot={false}/>
          <Area type="monotone" dataKey="expense" stroke="var(--red)"   strokeWidth={2}   fill="url(#gradExpense)" dot={false}/>
          <Area type="monotone" dataKey="net"     stroke="var(--accent)"strokeWidth={2.5} fill="url(#gradNet)"
            dot={{ fill:'var(--accent)', strokeWidth:0, r:4 }} activeDot={{ r:6, fill:'var(--accent)' }}/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}