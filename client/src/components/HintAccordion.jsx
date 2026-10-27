import React, { useState } from 'react';
import { HelpCircle, Lock, Unlock, AlertTriangle, Lightbulb } from 'lucide-react';

export default function HintAccordion({ hints, onRequestHint }) {
  const [confirmingHint, setConfirmingHint] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  const unrevealedExists = hints?.some(h => !h.revealed);

  const handleRequest = async () => {
    setIsRequesting(true);
    try {
      await onRequestHint();
      setConfirmingHint(false);
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="hints-list">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lightbulb size={18} color="var(--accent-cyan)" />
            Deductive Guidance & Hints
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Need insight? Hints provide investigative direction at a penalty of -10 points each.
          </p>
        </div>

        {unrevealedExists && !confirmingHint && (
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => setConfirmingHint(true)}
          >
            <HelpCircle size={14} />
            Unlock Next Hint (-10 Pts)
          </button>
        )}
      </div>

      {/* Confirmation Warning Box */}
      {confirmingHint && (
        <div className="card-glass animate-fade-in" style={{ padding: '16px 20px', borderColor: 'rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <AlertTriangle size={20} color="var(--accent-crimson)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '15px', color: '#fff', marginBottom: '4px' }}>Confirm Hint Deduction</h4>
              <p style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '12px' }}>
                Unlocking this hint will deduct <strong>10 points</strong> from your final score. Are you sure you want to proceed?
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-crimson btn-sm"
                  disabled={isRequesting}
                  onClick={handleRequest}
                >
                  {isRequesting ? 'Unlocking...' : 'Yes, Deduct 10 Pts & Reveal'}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setConfirmingHint(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hints Cards */}
      {hints && hints.map((hint, idx) => (
        <div key={hint.id || idx} className={`hint-item ${hint.revealed ? 'revealed' : ''}`}>
          <div className="hint-header">
            <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: hint.revealed ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
              Hint #{hint.order || idx + 1}
            </span>
            {hint.revealed ? (
              <span className="badge badge-cyan">
                <Unlock size={11} /> Unlocked (-10 pts)
              </span>
            ) : (
              <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                <Lock size={11} /> Locked
              </span>
            )}
          </div>

          <p className="hint-text" style={{ fontStyle: hint.revealed ? 'normal' : 'italic', color: hint.revealed ? '#fff' : 'var(--text-muted)' }}>
            {hint.revealed ? hint.text : 'Confidential analytical clue. Request this hint to unlock.'}
          </p>
        </div>
      ))}
    </div>
  );
}
