import React from 'react';
import { Award, Search, HelpCircle, Shield } from 'lucide-react';

export default function ScoreHUD({ caseData, currentScore }) {
  if (!caseData) return null;

  const discoveredCount = caseData.clues?.filter(c => c.discovered)?.length || 0;
  const totalClues = caseData.clues?.length || 0;
  const hintsCount = caseData.hints?.filter(h => h.revealed)?.length || 0;
  const totalHints = caseData.hints?.length || 0;

  const totalScore = currentScore?.total ?? caseData.score?.total ?? 0;
  const basePoints = currentScore?.basePoints ?? caseData.score?.basePoints ?? 0;
  const cluesPoints = currentScore?.cluesPoints ?? caseData.score?.cluesPoints ?? 0;
  const hintsPenalty = currentScore?.hintsPenalty ?? caseData.score?.hintsPenalty ?? 0;

  return (
    <div className="card-glass" style={{ padding: '16px 20px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          {/* Total Score display */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '42px', 
              height: '42px', 
              borderRadius: '10px', 
              background: 'rgba(245, 158, 11, 0.15)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'var(--accent-gold)' 
            }}>
              <Award size={24} />
            </div>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>
                Detective Score
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-gold)', textShadow: '0 0 10px rgba(245,158,11,0.4)' }}>
                {totalScore} <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>pts</span>
              </div>
            </div>
          </div>

          {/* Clues Counter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={16} color="var(--accent-emerald)" />
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Clues Found:</span>
            <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: discoveredCount > 0 ? 'var(--accent-emerald)' : '#fff' }}>
              {discoveredCount}/{totalClues}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>(+{discoveredCount * 5} pts)</span>
          </div>

          {/* Hints Counter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={16} color="var(--accent-cyan)" />
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Hints Used:</span>
            <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: hintsCount > 0 ? 'var(--accent-crimson)' : '#fff' }}>
              {hintsCount}/{totalHints}
            </span>
            {hintsCount > 0 && (
              <span style={{ fontSize: '11px', color: 'var(--accent-crimson)' }}>(-{hintsCount * 10} pts)</span>
            )}
          </div>
        </div>

        {/* Difficulty Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Difficulty:</span>
          <span className={`badge badge-${caseData.difficulty === 'Easy' ? 'emerald' : caseData.difficulty === 'Medium' ? 'gold' : 'crimson'}`}>
            <Shield size={12} />
            {caseData.difficulty}
          </span>
        </div>
      </div>
    </div>
  );
}
