import React from 'react';
import { useNetwork } from '../../context/NetworkContext';
import { WifiOff, RefreshCw } from 'lucide-react';

export default function OfflineBanner() {
  const { isOnline } = useNetwork();

  if (isOnline) return null;

  return (
    <div className="offline-banner" role="alert">
      <WifiOff size={18} />
      <span>
        You are currently offline. Your saved opportunities and offline data remain accessible.
      </span>
      <button
        onClick={() => window.location.reload()}
        style={{
          background: 'none',
          border: '1px solid var(--accent-600)',
          color: 'var(--accent-700)',
          borderRadius: '6px',
          padding: '2px 8px',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '12px',
          fontWeight: '600'
        }}
      >
        <RefreshCw size={12} /> Retry
      </button>
    </div>
  );
}
