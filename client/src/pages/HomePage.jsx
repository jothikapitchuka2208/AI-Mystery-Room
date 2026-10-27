import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle, 
  BrainCircuit, 
  FileSearch, 
  ArrowRight, 
  Award,
  Users,
  Lock
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="content-wrapper animate-fade-in">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="hero-pill">
          <Sparkles size={14} />
          <span>AI-Powered Mystery Deduction Engine</span>
        </div>

        <h1 className="hero-title">
          Step into the AI Mystery Room
        </h1>

        <p className="hero-subtitle">
          Unravel procedurally generated crimes crafted by Gemini AI. Interrogate suspects, 
          unearth forensic evidence, manage tactical hints, and name the true culprit before the trail goes cold.
        </p>

        <div className="hero-cta-group">
          <Link to="/create" className="btn btn-primary btn-lg">
            <Search size={18} />
            <span>Enter Investigation Room</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* 4-Step How It Works Grid */}
      <section style={{ margin: '50px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '26px', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            Detective Operational Protocol
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            Four steps from initial case briefing to final verdict
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-box" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-gold)' }}>
              <BrainCircuit size={24} />
            </div>
            <div className="rule-number">PHASE 01</div>
            <h3 className="feature-title">Generate or Select Case</h3>
            <p className="feature-desc">
              Choose your investigative tier (Easy, Medium, Hard) and propose custom premise or select a vintage mystery preset. Gemini weaves a watertight deductive puzzle.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
              <FileSearch size={24} />
            </div>
            <div className="rule-number">PHASE 02</div>
            <h3 className="feature-title">Examine Forensic Clues</h3>
            <p className="feature-desc">
              Scour crime scene locations to uncover physical evidence. Each discovered clue earns <strong>+5 points</strong> and breaks down suspect alibis.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
              <Users size={24} />
            </div>
            <div className="rule-number">PHASE 03</div>
            <h3 className="feature-title">Interrogate Suspects</h3>
            <p className="feature-desc">
              Cross-examine motives, demeanors, and testimony. Filter out red herrings and request tactical hints if stuck (costing <strong>-10 points</strong> each).
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-box" style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--accent-crimson)' }}>
              <ShieldCheck size={24} />
            </div>
            <div className="rule-number">PHASE 04</div>
            <h3 className="feature-title">File Accusation & Score</h3>
            <p className="feature-desc">
              Select the perpetrator and submit your deductive reasoning. The backend unlocks the truth, calculates your score, and reveals the full solution.
            </p>
          </div>
        </div>
      </section>

      {/* Rules & Scoring Matrix */}
      <section className="rules-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '22px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Award size={22} color="var(--accent-gold)" />
              Scoring Balance & Difficulty Matrix
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Strict server-verified scoring rules ensuring fair deduction
            </p>
          </div>
          <span className="badge badge-gold">Official Rulebook</span>
        </div>

        <div className="rules-grid">
          <div className="rule-item">
            <div className="rule-number">EASY CASE</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>100 Base Points</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              3 Suspects • 5 Clues • 2 Hints<br />
              <span style={{ color: 'var(--text-muted)' }}>Max Score: 125 pts</span>
            </div>
          </div>

          <div className="rule-item">
            <div className="rule-number">MEDIUM CASE</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>150 Base Points</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              4 Suspects • 7 Clues • 3 Hints<br />
              <span style={{ color: 'var(--text-muted)' }}>Max Score: 185 pts</span>
            </div>
          </div>

          <div className="rule-item">
            <div className="rule-number">HARD CASE</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>200 Base Points</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              5 Suspects • 9 Clues • 3 Hints<br />
              <span style={{ color: 'var(--text-muted)' }}>Max Score: 245 pts</span>
            </div>
          </div>

          <div className="rule-item" style={{ borderLeftColor: 'var(--accent-cyan)' }}>
            <div className="rule-number" style={{ color: 'var(--accent-cyan)' }}>MODIFIERS</div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
              <span style={{ color: 'var(--accent-emerald)' }}>+5</span> per Clue Discovered
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
              <span style={{ color: 'var(--accent-crimson)' }}>-10</span> per Hint Revealed
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Minimum score floor is 0 pts
            </div>
          </div>
        </div>
      </section>

      {/* Security & Anti-Cheat Note */}
      <section style={{ 
        marginTop: '36px', 
        padding: '20px 24px', 
        background: 'rgba(255,255,255,0.02)', 
        border: '1px solid var(--border-subtle)', 
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        <Lock size={20} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
        <div style={{ flex: 1, fontSize: '13px', color: 'var(--text-secondary)' }}>
          <strong style={{ color: '#fff' }}>Anti-Cheat Guarantee:</strong> The culprit identity and solution explanation are held securely on the backend server and never transmitted to your browser until an official accusation is submitted.
        </div>
        <Link to="/create" className="btn btn-primary btn-sm">
          <span>Start Case</span>
          <ArrowRight size={14} />
        </Link>
      </section>
    </div>
  );
}
