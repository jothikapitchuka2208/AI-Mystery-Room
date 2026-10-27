import React, { useState } from 'react';
import { User, MessageSquare, AlertCircle, Clock, ShieldAlert } from 'lucide-react';

export default function SuspectCard({ suspect, onSelectAccuse }) {
  const [showDialogue, setShowDialogue] = useState(false);

  return (
    <div className="suspect-card">
      <div className="suspect-header">
        <div className="suspect-avatar">
          <User size={26} />
        </div>
        <div>
          <h3 className="suspect-name">{suspect.name}</h3>
          <div className="suspect-role">{suspect.role}</div>
        </div>
      </div>

      <div className="suspect-details">
        {/* Demeanor */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Demeanor:</span>
          <span className="badge badge-purple" style={{ fontSize: '11px', padding: '2px 8px' }}>
            {suspect.demeanor || 'Guarded'}
          </span>
        </div>

        {/* Alibi */}
        <div className="detail-row">
          <span className="detail-label">
            <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Reported Alibi:
          </span>
          <p style={{ color: '#cbd5e1' }}>{suspect.alibi}</p>
        </div>

        {/* Motive */}
        <div className="detail-row">
          <span className="detail-label">
            <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Suspected Motive:
          </span>
          <p style={{ color: '#e2e8f0' }}>{suspect.motive}</p>
        </div>

        {/* Interrogation Dialogue (if toggled) */}
        {showDialogue && suspect.dialogue && (
          <div className="suspect-quote-box animate-fade-in">
            <div style={{ fontSize: '11px', color: 'var(--accent-gold)', fontWeight: 600, marginBottom: '4px' }}>
              Interrogation Statement:
            </div>
            "{suspect.dialogue}"
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '18px' }}>
        {suspect.dialogue && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            style={{ flex: 1 }}
            onClick={() => setShowDialogue(!showDialogue)}
          >
            <MessageSquare size={14} />
            {showDialogue ? 'Hide Statement' : 'Interrogate'}
          </button>
        )}

        {onSelectAccuse && (
          <button
            type="button"
            className="btn btn-crimson btn-sm"
            onClick={() => onSelectAccuse(suspect.id)}
          >
            <ShieldAlert size={14} />
            Accuse
          </button>
        )}
      </div>
    </div>
  );
}
