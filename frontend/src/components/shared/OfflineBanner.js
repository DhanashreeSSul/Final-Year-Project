import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNetwork } from '../../context/NetworkContext';
import { CloudOff, CheckCircle2, RefreshCw } from 'lucide-react';

export default function OfflineBanner() {
  const { isOnline } = useNetwork();
  const [showReconnected, setShowReconnected] = useState(false);
  const wasOfflineRef = useRef(false);

  useEffect(() => {
    if (!isOnline) {
      wasOfflineRef.current = true;
      setShowReconnected(false);
    } else if (wasOfflineRef.current) {
      // Just reconnected!
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
        wasOfflineRef.current = false;
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  const isVisible = !isOnline || showReconnected;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          role="alert"
          initial={{ y: -60, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -60, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 450, damping: 30 }}
          style={{
            position: 'fixed',
            top: '16px',
            left: 0,
            right: 0,
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            padding: '0 16px',
            pointerEvents: 'none'
          }}
        >
          <div
            style={{
              pointerEvents: 'auto',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 20px',
              borderRadius: 'var(--radius-full)',
              fontSize: '13px',
              fontWeight: '700',
              boxShadow: '0 10px 25px -4px rgba(31, 22, 48, 0.18)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              backgroundColor: showReconnected
                ? 'rgba(204, 251, 241, 0.95)'
                : 'rgba(254, 243, 199, 0.95)',
              border: showReconnected
                ? '1.5px solid var(--teal-500)'
                : '1.5px solid var(--secondary-500)',
              color: showReconnected ? 'var(--teal-800)' : 'var(--secondary-900)'
            }}
          >
            {showReconnected ? (
              <>
                <CheckCircle2 size={18} color="var(--teal-600)" />
                <span>Back online. Syncing verified opportunities...</span>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <RefreshCw size={14} color="var(--teal-600)" />
                </motion.div>
              </>
            ) : (
              <>
                <CloudOff size={18} color="var(--secondary-600)" />
                <span>You're offline. Changes will sync.</span>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  style={{
                    marginLeft: '4px',
                    background: 'rgba(245, 158, 11, 0.2)',
                    border: '1px solid var(--secondary-600)',
                    color: 'var(--secondary-900)',
                    borderRadius: 'var(--radius-full)',
                    padding: '3px 10px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: '800',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <RefreshCw size={11} /> Retry
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
