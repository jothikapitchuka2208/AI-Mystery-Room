import React, { useState, useEffect } from 'react';
import { Search, BrainCircuit, Shield } from 'lucide-react';

const LOADING_MESSAGES = [
  'Consulting Gemini AI case engine...',
  'Constructing atmospheric crime scene...',
  'Generating suspect backgrounds & conflicting alibis...',
  'Planting forensic clues and deductive traces...',
  'Sealing the culprit identity in encrypted archives...',
  'Preparing your detective dossier...'
];

export default function LoadingDossier({ title = 'Generating Mystery Case' }) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="loading-box animate-fade-in">
      <div className="loader-spinner-wrapper">
        <div className="radar-circle"></div>
        <Search size={28} color="var(--accent-gold)" />
      </div>

      <h3 className="loader-title">{title}</h3>
      <p className="loader-desc" style={{ minHeight: '24px', transition: 'all 0.3s ease' }}>
        {LOADING_MESSAGES[msgIndex]}
      </p>

      <div style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '6px', 
        marginTop: '20px', 
        padding: '4px 12px', 
        borderRadius: '999px', 
        background: 'rgba(245, 158, 11, 0.1)', 
        border: '1px solid rgba(245, 158, 11, 0.2)',
        fontSize: '12px',
        color: 'var(--accent-gold)',
        fontFamily: 'var(--font-mono)'
      }}>
        <BrainCircuit size={13} />
        Gemini 2.5 Deductive Synthesis
      </div>
    </div>
  );
}
