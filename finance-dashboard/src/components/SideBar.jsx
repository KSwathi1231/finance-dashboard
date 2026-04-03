import { useApp } from '../context/AppContext';

export default function SideBar() {
  const { activePage, setActivePage, role, setRole } = useApp();

  const navItems = [
    { id: 'dashboard',    label: 'Dashboard',    emoji: '📊' },
    { id: 'transactions', label: 'Transactions', emoji: '💳' },
    { id: 'insights',     label: 'Insights',     emoji: '💡' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">💰</div>
        <span className="sidebar-logo-text">FinanceIQ</span>
      </div>

      {navItems.map(({ id, label, emoji }) => (
        <button
          key={id}
          className={`nav-item ${activePage === id ? 'active' : ''}`}
          onClick={() => setActivePage(id)}
        >
          <span>{emoji}</span>
          {label}
        </button>
      ))}

      <div className="sidebar-bottom">
        <div className="role-switcher">
          <span className="role-label">Active Role</span>
          <select
            className="role-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="viewer">Viewer (User)</option>
            <option value="admin">Admin</option>
          </select>
          <div className={`role-badge ${role}`}>
            {role === 'admin' ? '🛡️ Full Access' : '👁️ Read Only'}
          </div>
        </div>
      </div>
    </aside>
  );
}