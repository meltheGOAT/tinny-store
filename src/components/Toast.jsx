import React from 'react';
import { CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function Toast() {
  const { toast } = useStore();

  if (!toast.show) return null;

  return (
    <div className="toast-container">
      <div className={`toast ${toast.show ? 'show' : ''}`}>
        {toast.type === 'success' && <CheckCircle2 size={18} style={{ color: 'var(--gold-primary)' }} />}
        {toast.type === 'error' && <AlertCircle size={18} style={{ color: 'var(--accent-rose)' }} />}
        {toast.type === 'info' && <Sparkles size={18} style={{ color: 'var(--gold-primary)' }} />}
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
