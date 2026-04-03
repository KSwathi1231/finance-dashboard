import React, { useState } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import Sidebar from './components/SideBar'
import Dashboard from './components/Dashboard'
import Transactions from './components/Transactions'
import Insights from './components/Insights'
import LandingPage from './components/LandingPage'
import './index.css'

function AppContent({ onLogout }) {
  const { activePage } = useApp()
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">

        {/* Top bar with logout */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '16px 30px 0',
        }}>
          <button
            onClick={onLogout}
            style={{
              background: 'rgba(252,129,129,0.1)',
              border: '1px solid rgba(252,129,129,0.25)',
              borderRadius: 10,
              color: '#FC8181',
              padding: '8px 18px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(252,129,129,0.2)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(252,129,129,0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            🚪 Logout
          </button>
        </div>

        {activePage === 'dashboard'    && <Dashboard />}
        {activePage === 'transactions' && <Transactions />}
        {activePage === 'insights'     && <Insights />}
      </main>
    </div>
  )
}

export default function App() {
  const [showDashboard, setShowDashboard] = useState(() => {
  return localStorage.getItem("showDashboard") === "true";
});

  if (!showDashboard) {
    return (
      <AppProvider>
        <LandingPage onEnter={() => {
          localStorage.setItem("showDashboard", "true");
          setShowDashboard(true);
        }} />
      </AppProvider>
    )
  }

  return (
    <AppProvider>
      <AppContent onLogout={() => {
        localStorage.removeItem("showDashboard");
        setShowDashboard(false);
      }} />
    </AppProvider>
  )
}