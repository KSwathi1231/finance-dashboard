export default function LandingPage({ onEnter }) {
  return (
    <div style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'var(--bg-base)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px 20px',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
    }}>

      {/* Background glow blobs */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%',
        transform: 'translateX(-50%)',
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(99,179,237,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', left: '20%',
        width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(159,122,234,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Logo */}
      <div style={{
        width: 72, height: 72,
        background: 'linear-gradient(135deg, #63B3ED, #9F7AEA)',
        borderRadius: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 36,
        marginBottom: 32,
        boxShadow: '0 8px 32px rgba(99,179,237,0.25)',
      }}>
        💰
      </div>

      {/* Brand name */}
      <div style={{
        fontSize: 22,
        fontWeight: 800,
        letterSpacing: 4,
        textTransform: 'uppercase',
        color: 'var(--accent)',
        marginBottom: 20,
        fontFamily: 'var(--font-display)',
        }}>
        FinanceIQ
    </div>

      {/* Big heading */}
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(28px, 4vw, 48px)',
        fontWeight: 700,
        letterSpacing: '-1px',
        lineHeight: 1.2,
        color: 'var(--text-primary)',
        marginBottom: 24,
        maxWidth: 600,
    }}>
        Know Where Every{' '}
        <span style={{
            background: 'linear-gradient(135deg, #63B3ED, #9F7AEA)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            }}>
            Rupee Goes.
        </span>
      </h1>

      {/* Caption */}
      <p style={{
        fontSize: 'clamp(16px, 2.5vw, 20px)',
        color: 'var(--text-secondary)',
        marginBottom: 48,
        maxWidth: 520,
        lineHeight: 1.7,
        fontWeight: 300,
      }}>
        Actionable Insights, Strategic Results.
        <br />
        Track, analyze and understand every rupee.
      </p>

      {/* CTA Button */}
      <button
        onClick={onEnter}
        style={{
          background: 'linear-gradient(135deg, #63B3ED, #9F7AEA)',
          color: '#0A0C10',
          border: 'none',
          borderRadius: 14,
          padding: '16px 48px',
          fontSize: 16,
          fontWeight: 700,
          fontFamily: 'var(--font-display)',
          cursor: 'pointer',
          letterSpacing: 0.5,
          boxShadow: '0 8px 32px rgba(99,179,237,0.3)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          marginBottom: 48,
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-3px)';
          e.target.style.boxShadow = '0 16px 40px rgba(99,179,237,0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 8px 32px rgba(99,179,237,0.3)';
        }}
      >
        Let's Analyze →
      </button>

      {/* 🔥 MINI PREVIEW (subtle, adds product feel) */}
        <div style={{
        display: 'flex',
        gap: 16,
        justifyContent: 'center',
        marginBottom: 36,
        flexWrap: 'wrap'
        }}>
        {[
            { label: "Balance", value: "₹2.2L" },
            { label: "Income", value: "₹3.3L", color: "#22c55e" },
            { label: "Expense", value: "₹1.06L", color: "#ef4444" },
        ].map((item) => (
            <div key={item.label} style={{
            background: 'rgba(255,255,255,0.03)',
            padding: '10px 16px',
            borderRadius: 10,
            minWidth: 100
            }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {item.label}
            </div>
            <div style={{
                fontWeight: 700,
                color: item.color || '#fff'
            }}>
                {item.value}
            </div>
            </div>
        ))}
        </div>

      {/* Stats row */}
      <div style={{
        display: 'flex',
        gap: 48,
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        {[
          { value: '38+', label: 'Transactions Tracked' },
          { value: '3',   label: 'Months of Data' },
          { value: '10',  label: 'Spending Categories' },
        ].map(({ value, label }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 32,
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-1px',
            }}>
              {value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}