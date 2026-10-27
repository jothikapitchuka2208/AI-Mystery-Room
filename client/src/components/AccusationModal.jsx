import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, User, X, Check } from 'lucide-react';

export default function AccusationModal({
  isOpen,
  onClose,
  suspects,
  preselectedSuspectId,
  onSubmitAccusation,
  difficulty
}) {
  const [selectedId, setSelectedId] = useState(preselectedSuspectId || '');
  const [reasoning, setReasoning] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const basePoints = difficulty === 'Easy' ? 100 : difficulty === 'Medium' ? 150 : 200;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedId) {
      setError('Please select a suspect to accuse.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      await onSubmitAccusation(selectedId, reasoning);
    } catch (err) {
      setError(err.message || 'Failed to submit accusation');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-10px' }}>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            style={{ padding: '6px' }}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-header">
          <div className="modal-title">
            <ShieldAlert size={26} color="var(--accent-crimson)" />
            <span>File Official Accusation</span>
          </div>
          <p className="modal-subtitle">
            Review the evidence, name your primary suspect, and state your final deduction.
          </p>
        </div>

        {error && (
          <div style={{ 
            padding: '10px 14px', 
            background: 'rgba(239, 68, 68, 0.15)', 
            border: '1px solid var(--accent-crimson)', 
            borderRadius: '8px', 
            color: '#fca5a5', 
            fontSize: '13px', 
            marginBottom: '16px' 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Suspect Lineup Selection */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#e2e8f0', marginBottom: '10px' }}>
              Select Culprit from Lineup:
            </label>
            <div className="suspect-lineup-grid">
              {suspects.map((suspect) => {
                const isSelected = selectedId === suspect.id;
                return (
                  <div
                    key={suspect.id}
                    className={`suspect-radio-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedId(suspect.id);
                      setError('');
                    }}
                  >
                    <div style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '8px', 
                      background: isSelected ? 'var(--accent-crimson)' : 'rgba(255,255,255,0.06)', 
                      margin: '0 auto 8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isSelected ? '#fff' : 'var(--text-secondary)'
                    }}>
                      <User size={18} />
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>
                      {suspect.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {suspect.role}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detective's Reasoning Statement */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px' }}>
              Detective's Deductive Reasoning (Optional):
            </label>
            <textarea
              className="reasoning-textarea"
              placeholder="State how the evidence disproved this suspect's alibi or connected their motive/means to the crime scene..."
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
            />
          </div>

          {/* Irreversible Warning Box */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: '10px', 
            padding: '12px 14px', 
            background: 'rgba(245, 158, 11, 0.08)', 
            border: '1px solid rgba(245, 158, 11, 0.25)', 
            borderRadius: '8px', 
            marginBottom: '24px' 
          }}>
            <AlertTriangle size={18} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.5 }}>
              <strong>Case Closure Notice:</strong> Submitting an accusation is final. If correct, you will earn{' '}
              <strong style={{ color: 'var(--accent-gold)' }}>+{basePoints} base points</strong>. If incorrect, base points will be 0.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Resume Investigation
            </button>
            <button
              type="submit"
              className="btn btn-crimson"
              disabled={isSubmitting || !selectedId}
            >
              <ShieldAlert size={16} />
              {isSubmitting ? 'Evaluating Verdict...' : 'Submit Official Accusation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
