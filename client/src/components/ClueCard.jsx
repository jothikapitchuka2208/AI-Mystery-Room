import React, { useState } from 'react';
import { Search, MapPin, CheckCircle2, Lock, Sparkles } from 'lucide-react';

export default function ClueCard({ clue, onDiscover, index }) {
  const [isDiscovering, setIsDiscovering] = useState(false);

  const handleDiscover = async () => {
    if (clue.discovered || isDiscovering) return;
    setIsDiscovering(true);
    try {
      await onDiscover(clue.id);
    } finally {
      setIsDiscovering(false);
    }
  };

  if (!clue.discovered) {
    return (
      <div 
        className="clue-card unsearched card-interactive"
        onClick={handleDiscover}
        role="button"
        tabIndex={0}
      >
        <div>
          <div className="clue-location">
            <MapPin size={13} color="var(--accent-gold)" />
            <span>{clue.location || 'Crime Scene'}</span>
          </div>
          <h4 className="clue-title" style={{ color: '#94a3b8' }}>
            Evidence #{index + 1}: Unsearched
          </h4>
          <p className="clue-desc" style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
            Forensic trace detected in this area. Search this location to uncover crucial evidence.
          </p>
        </div>

        <div className="clue-footer">
          <span className="badge badge-gold" style={{ fontSize: '11px' }}>
            <Sparkles size={11} />
            +5 Points
          </span>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={isDiscovering}
            onClick={(e) => {
              e.stopPropagation();
              handleDiscover();
            }}
          >
            <Search size={13} />
            {isDiscovering ? 'Analyzing...' : 'Search Location'}
          </button>
        </div>
      </div>
    );
  }

  // Discovered state
  return (
    <div className="clue-card discovered animate-fade-in">
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div className="clue-location">
            <MapPin size={13} color="var(--accent-emerald)" />
            <span>{clue.location}</span>
          </div>
          <span className="badge badge-emerald">
            <CheckCircle2 size={12} />
            Discovered (+5 pts)
          </span>
        </div>

        <h4 className="clue-title" style={{ color: '#fff' }}>{clue.title}</h4>
        <p className="clue-desc">{clue.description}</p>
      </div>

      <div className="clue-footer">
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          Forensics Verified
        </span>
      </div>
    </div>
  );
}
