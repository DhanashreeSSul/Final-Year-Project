import React from 'react';
import { X } from 'lucide-react';
export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal animate-in">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
