import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Shield, 
  HelpCircle, 
  Search, 
  FileText, 
  BrainCircuit, 
  AlertCircle,
  Lightbulb
} from 'lucide-react';
import { createCase } from '../services/api';
import LoadingDossier from '../components/LoadingDossier';

const PRESET_IDEAS = [
  {
    title: 'Victorian Manor Poisoning',
    premise: 'Lord Alistair was found poisoned in his locked study with a shattered pocket watch frozen at 10:42 PM.'
  },
  {
    title: 'Silicon Valley Mainframe Sabotage',
    premise: 'A lead quantum security architect was incapacitated and encrypted hardware tokens stolen during an executive launch party.'
  },
  {
    title: 'The Midnight Louvre Diamond Heist',
    premise: 'The priceless Sunburst Diamond was swapped with lead glass inside a high-security vault during the midnight watch.'
  },
  {
    title: 'Orient Express Alpine Homicide',
    premise: 'A reclusive billionaire antiquities dealer was murdered inside a locked sleeping compartment while the train was stalled in an alpine snowdrift.'
  }
];

export default function CreateCasePage({ onCaseCreated }) {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState('Medium');
  const [premise, setPremise] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePresetClick = (presetPremise) => {
    setPremise(presetPremise);
    setError('');
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const newCase = await createCase({
        premise: premise.trim() || 'A high-stakes locked room crime at midnight',
        difficulty
      });

      if (onCaseCreated) {
        onCaseCreated(newCase);
      }

      const caseId = newCase._id || newCase.id;
      navigate(`/case/${caseId}`);
    } catch (err) {
      setError(err.message || 'Failed to generate mystery case. Please try again.');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingDossier title={`Generating ${difficulty} Mystery Case`} />;
  }

  return (
    <div className="create-page-container animate-fade-in">
      <div className="section-header">
        <div className="hero-pill" style={{ marginBottom: '16px' }}>
          <Sparkles size={13} />
          <span>Case Dossier Generator</span>
        </div>
        <h1>Design Your Investigation</h1>
        <p>Configure case complexity and propose a mystery premise or pick an inspiration preset.</p>
      </div>

      {error && (
        <div style={{
          padding: '14px 18px',
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid var(--accent-crimson)',
          borderRadius: 'var(--radius-md)',
          color: '#fca5a5',
          fontSize: '14px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <AlertCircle size={18} color="var(--accent-crimson)" style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleGenerate}>
        {/* Difficulty Selection */}
        <div className="difficulty-selector">
          <label className="difficulty-label">1. Choose Difficulty Tier:</label>
          <div className="difficulty-grid">
            {/* Easy */}
            <div
              className={`diff-card ${difficulty === 'Easy' ? 'active' : ''}`}
              onClick={() => setDifficulty('Easy')}
            >
              <div className="diff-card-header">
                <span className="diff-title">Easy Case</span>
                <span className="badge badge-emerald">Novice</span>
              </div>
              <div className="diff-points">100 Base Points</div>
              <ul className="diff-stats" style={{ marginTop: '10px' }}>
                <li><Search size={13} color="var(--accent-emerald)" /> 3 Suspects</li>
                <li><FileText size={13} color="var(--accent-emerald)" /> 5 Forensic Clues</li>
                <li><HelpCircle size={13} color="var(--accent-cyan)" /> 2 Tactical Hints</li>
              </ul>
            </div>

            {/* Medium */}
            <div
              className={`diff-card ${difficulty === 'Medium' ? 'active' : ''}`}
              onClick={() => setDifficulty('Medium')}
            >
              <div className="diff-card-header">
                <span className="diff-title">Medium Case</span>
                <span className="badge badge-gold">Inspector</span>
              </div>
              <div className="diff-points">150 Base Points</div>
              <ul className="diff-stats" style={{ marginTop: '10px' }}>
                <li><Search size={13} color="var(--accent-gold)" /> 4 Suspects</li>
                <li><FileText size={13} color="var(--accent-gold)" /> 7 Forensic Clues</li>
                <li><HelpCircle size={13} color="var(--accent-cyan)" /> 3 Tactical Hints</li>
              </ul>
            </div>

            {/* Hard */}
            <div
              className={`diff-card ${difficulty === 'Hard' ? 'active' : ''}`}
              onClick={() => setDifficulty('Hard')}
            >
              <div className="diff-card-header">
                <span className="diff-title">Hard Case</span>
                <span className="badge badge-crimson">Chief Detective</span>
              </div>
              <div className="diff-points">200 Base Points</div>
              <ul className="diff-stats" style={{ marginTop: '10px' }}>
                <li><Search size={13} color="var(--accent-crimson)" /> 5 Suspects</li>
                <li><FileText size={13} color="var(--accent-crimson)" /> 9 Forensic Clues</li>
                <li><HelpCircle size={13} color="var(--accent-cyan)" /> 3 Tactical Hints</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Custom Premise Input */}
        <div className="form-group">
          <div className="form-label">
            <span>2. Propose Mystery Premise:</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {premise.length} characters (leave blank for default)
            </span>
          </div>

          <textarea
            className="premise-textarea"
            placeholder="Describe the setting, crime, or atmosphere (e.g. A poisoned champagne flute at an opulent opera gala, or an antique pocket watch found shattered beside a locked vault)..."
            value={premise}
            onChange={(e) => setPremise(e.target.value)}
          />

          {/* Preset Inspiration Chips */}
          <div className="presets-container">
            <div className="presets-label">
              <Lightbulb size={12} style={{ display: 'inline', marginRight: '4px' }} />
              Quick Inspiration Presets (Click to load):
            </div>
            <div className="presets-chips">
              {PRESET_IDEAS.map((idea, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="preset-chip"
                  onClick={() => handlePresetClick(idea.premise)}
                >
                  {idea.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ textAlign: 'center', marginTop: '36px' }}>
          <button type="submit" className="btn btn-primary btn-lg" style={{ minWidth: '260px' }}>
            <BrainCircuit size={18} />
            <span>Generate Mystery Dossier</span>
          </button>
        </div>
      </form>
    </div>
  );
}
