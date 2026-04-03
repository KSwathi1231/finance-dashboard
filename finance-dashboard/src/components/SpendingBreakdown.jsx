import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../context/AppContext';
import { CATEGORY_COLORS } from '../data/mockData';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:10, padding:'10px 14px', fontSize:12 }}>
      <p style={{ color:'var(--text-secondary)', marginBottom:3 }}>{d.name}</p>
      <p style={{ color:d.payload.fill, fontFamily:'var(--font-display)', fontWeight:700 }}>
        ₹{d.value.toLocaleString('en-IN')}
      </p>
    </div>
  );
};

export default function SpendingBreakdown() {
  const { transactions } = useApp();
  const byCategory = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => { acc[t.category] = (acc[t.category]||0) + t.amount; return acc; }, {});

  const data  = Object.entries(byCategory)
    .map(([name,value]) => ({ name, value, fill: CATEGORY_COLORS[name]||'#8892A4' }))
    .sort((a,b) => b.value - a.value).slice(0,6);
  const total = data.reduce((s,d) => s+d.value, 0);

  return (
    <div className="card">
      <div className="chart-header">
        <div>
          <div className="chart-title">Spending Breakdown</div>
          <div className="chart-subtitle">By category</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={75}
            paddingAngle={3} dataKey="value" strokeWidth={0}>
            {data.map((entry,i) => <Cell key={i} fill={entry.fill}/>)}
          </Pie>
          <Tooltip content={<CustomTooltip/>}/>
        </PieChart>
      </ResponsiveContainer>
      <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:10 }}>
        {data.map((d) => (
          <div key={d.name} style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ width:8, height:8, borderRadius:'50%', background:d.fill, flexShrink:0 }}/>
            <span style={{ flex:1, fontSize:12, color:'var(--text-secondary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{d.name}</span>
            <span style={{ fontSize:12, fontFamily:'var(--font-display)', fontWeight:600 }}>
              {Math.round((d.value/total)*100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}