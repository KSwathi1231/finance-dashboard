import { useState, useEffect } from 'react';
import { CATEGORIES } from '../data/mockData';
import { useApp } from '../context/AppContext';

const empty = { description: '', amount: '', category: CATEGORIES[0], type: 'expense', date: '' };

export default function TransactionModal({ existing, onClose }) {
  const { addTransaction, editTransaction } = useApp();
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (existing) setForm({ ...existing, amount: String(existing.amount) });
    else setForm({ ...empty, date: new Date().toISOString().slice(0, 10) });
  }, [existing]);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.description.trim() || !form.amount || !form.date) return;
    const tx = { ...form, amount: parseFloat(form.amount) };
    if (existing) editTransaction(existing.id, tx);
    else addTransaction(tx);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <h2 className="modal-title" style={{ margin: 0 }}>
            {existing ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <input className="form-input" placeholder="e.g. Swiggy Order"
            value={form.description} onChange={(e) => set('description', e.target.value)} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Amount (₹)</label>
            <input className="form-input" type="number" placeholder="0.00" min="0"
              value={form.amount} onChange={(e) => set('amount', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input className="form-input" type="date"
              value={form.date} onChange={(e) => set('date', e.target.value)} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Type</label>
            <select className="form-select" value={form.type} onChange={(e) => set('type', e.target.value)}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={form.category} onChange={(e) => set('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {existing ? 'Save Changes' : 'Add Transaction'}
          </button>
        </div>
      </div>
    </div>
  );
}