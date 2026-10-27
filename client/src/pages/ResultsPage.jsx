import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  Award, 
  RotateCcw, 
  ShieldCheck, 
  ShieldAlert, 
  FileText, 
  User, 
  KeyRound, 
  AlertCircle,
  HelpCircle,
  Search,
  Sparkles
} from 'lucide-react';
import { getCaseResult } from '../services/api';
import LoadingDossier from '../components/LoadingDossier';

export default function ResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [resultData, setResultData] = useState(location.state?.verdictData || null);
  const [isLoading, setIsLoading] = useState(!resultData);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchResult() {
      if (resultData) {
        if (resultData.isCorrect) {
          triggerConfetti();
        }
        return;
      }

      setIsLoading(true);
      setError('');
      try {
        const data = await getCaseResult(id);
        setResultData(data);
        if (data.isCorrect) {
          triggerConfetti();
        }
      } catch (err) {
        setError(err.message || 'Failed to retrieve case verdict');
      } finally {
        setIsLoading(false);
      }
    }

    fetchResult();
  }, [id, resultData]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 350);
    } catch (e) {
      // safe fallback if canvas not available
    }
  };

  if (isLoading) {
    return <LoadingDossier title="Unsealing Case Verdict..." />;
  }

  if (error || !resultData) {
    return (
      <div className="content-wrapper animate-fade-in" style={{ paddingTop: '60px', textAlign: 'center' }}>
        <div className="card-glass" style={{ maxWidth: '500px', margin: '0 auto', padding: '36px' }}>
          <AlertCircle size={36} color="var(--accent-crimson)" style={{ marginBottom: '16px' }} />
          <h2 style={{ marginBottom: '10px' }}>Verdict Unavailable</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
            {error || 'This case has not yet concluded with an accusation.'}
          </p>
          <Link to={`/case/${id}`} className="btn btn-primary">
            Return to Case Investigation
          </Link>
        </div>
      </div>
    );
  }

  const { isCorrect, verdict, score, solution, accusation, accused, culprit } = resultData;
  const accusedName = accused || accusation?.accusedSuspectName || 'Unknown Suspect';
  const culpritName = culprit || solution?.culpritName || 'Classified';

  return (
    <div className="results-container animate-fade-in">
      {/* Verdict Banner */}
      <section className={`verdict-banner ${isCorrect ? 'solved' : 'failed'}`}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
          {isCorrect ? (
            <div style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              background: 'rgba(16, 185, 129, 0.2)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'var(--accent-emerald)',
              border: '2px solid var(--accent-emerald)'
            }}>
              <CheckCircle2 size={36} />
            </div>
          ) : (
            <div style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              background: 'rgba(239, 68, 68, 0.2)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'var(--accent-crimson)',
              border: '2px solid var(--accent-crimson)'
            }}>
              <XCircle size={36} />
            </div>
          )}
        </div>

        <h1 className="verdict-heading" style={{ color: isCorrect ? 'var(--accent-emerald)' : 'var(--accent-crimson)' }}>
          {verdict || (isCorrect ? 'CASE CLOSED - GUILTY' : 'COLD CASE - WRONGFUL ACCUSATION')}
        </h1>

        <p style={{ fontSize: '16px', color: '#e2e8f0', maxWidth: '600px', margin: '0 auto' }}>
          {isCorrect ? (
            <>
              Masterful deduction, Detective. You correctly identified <strong>{culpritName}</strong> as the true perpetrator of this crime.
            </>
          ) : (
            <>
              You formally accused <strong>{accusedName}</strong>, but the true culprit was <strong>{culpritName}</strong>. The perpetrator slipped away into the night.
            </>
          )}
        </p>
      </section>

      {/* Score Breakdown Card */}
      <section className="score-breakdown-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={20} color="var(--accent-gold)" />
            <span>Detective Performance & Score Breakdown</span>
          </h3>
          <span className="badge badge-gold">Official Scorecard</span>
        </div>

        <div className="breakdown-row">
          <span style={{ color: 'var(--text-secondary)' }}>
            Base Points ({isCorrect ? 'Correct Accusation' : 'Incorrect Accusation'}):
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: isCorrect ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
            {score?.basePoints > 0 ? `+${score?.basePoints}` : '0'} pts
          </span>
        </div>

        <div className="breakdown-row">
          <span style={{ color: 'var(--text-secondary)' }}>
            Forensic Clues Discovered Bonus:
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-emerald)' }}>
            +{score?.cluesPoints || 0} pts
          </span>
        </div>

        <div className="breakdown-row">
          <span style={{ color: 'var(--text-secondary)' }}>
            Tactical Hints Deduction Penalty:
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: score?.hintsPenalty > 0 ? 'var(--accent-crimson)' : 'var(--text-muted)' }}>
            -{score?.hintsPenalty || 0} pts
          </span>
        </div>

        <div className="breakdown-row" style={{ marginTop: '8px' }}>
          <span style={{ fontSize: '18px', color: '#fff' }}>Final Total Score:</span>
          <span style={{ fontSize: '26px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent-gold)', textShadow: '0 0 10px rgba(245,158,11,0.4)' }}>
            {score?.total || 0} <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>pts</span>
          </span>
        </div>
      </section>

      {/* Full Solution Dossier */}
      {solution && (
        <section className="solution-dossier">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <KeyRound size={22} color="var(--accent-gold)" />
            <h2 style={{ fontSize: '22px' }}>Unsealed Case Solution</h2>
          </div>

          <div className="solution-grid">
            <div className="solution-item">
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--accent-crimson)', fontWeight: 700 }}>
                TRUE CULPRIT
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
                {solution.culpritName}
              </div>
            </div>

            <div className="solution-item">
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 700 }}>
                CONFIRMED MOTIVE
              </div>
              <div style={{ fontSize: '14px', color: '#cbd5e1', marginTop: '2px' }}>
                {solution.motive}
              </div>
            </div>

            <div className="solution-item">
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                MEANS & WEAPON
              </div>
              <div style={{ fontSize: '14px', color: '#cbd5e1', marginTop: '2px' }}>
                {solution.means}
              </div>
            </div>

            <div className="solution-item">
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                OPPORTUNITY / TIMELINE
              </div>
              <div style={{ fontSize: '14px', color: '#cbd5e1', marginTop: '2px' }}>
                {solution.opportunity}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '20px', padding: '16px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--accent-gold)' }}>
            <div style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--accent-gold)', fontWeight: 700, marginBottom: '6px' }}>
              FORENSIC DEDUCTION BREAKDOWN
            </div>
            <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#e2e8f0' }}>
              {solution.fullExplanation}
            </p>
          </div>
        </section>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '60px' }}>
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={() => navigate('/create')}
        >
          <RotateCcw size={18} />
          <span>Investigate Another Mystery</span>
        </button>

        <button
          type="button"
          className="btn btn-outline btn-lg"
          onClick={() => navigate('/')}
        >
          <span>Return to Headquarters</span>
        </button>
      </div>
    </div>
  );
}
