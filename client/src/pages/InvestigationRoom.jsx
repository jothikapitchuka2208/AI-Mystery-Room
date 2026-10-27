import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getCase, 
  discoverClue, 
  requestHint, 
  accuseSuspect 
} from '../services/api';
import ScoreHUD from '../components/ScoreHUD';
import SuspectCard from '../components/SuspectCard';
import ClueCard from '../components/ClueCard';
import HintAccordion from '../components/HintAccordion';
import AccusationModal from '../components/AccusationModal';
import LoadingDossier from '../components/LoadingDossier';
import { 
  Users, 
  Search, 
  Lightbulb, 
  ShieldAlert, 
  MapPin, 
  FileText, 
  AlertTriangle,
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function InvestigationRoom({ onActiveCaseChange }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [currentScore, setCurrentScore] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('suspects'); // 'suspects' | 'clues' | 'hints'
  const [isAccusing, setIsAccusing] = useState(false);
  const [preselectedSuspect, setPreselectedSuspect] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 3500);
      return () => clearInterval(timer);
    }
  }, [toastMessage]);

  // Load case data
  useEffect(() => {
    async function fetchCase() {
      setIsLoading(true);
      setError('');
      try {
        const data = await getCase(id);
        setCaseData(data);
        setCurrentScore(data.score);
        if (onActiveCaseChange) {
          onActiveCaseChange(data);
        }

        // If case was already solved/failed, redirect to results
        if (data.status === 'solved' || data.status === 'failed') {
          navigate(`/case/${id}/result`);
        }
      } catch (err) {
        setError(err.message || 'Failed to load case files');
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchCase();
    }
  }, [id, navigate]);

  // Discover Clue Handler
  const handleDiscoverClue = async (clueId) => {
    try {
      const result = await discoverClue(id, clueId);
      // Update case data with new clue and score
      setCaseData((prev) => {
        const updatedClues = prev.clues.map((c) =>
          c.id === clueId ? { ...c, discovered: true, discoveredAt: new Date() } : c
        );
        return {
          ...prev,
          clues: updatedClues,
          score: result.case?.score || prev.score
        };
      });

      if (result.case?.score) {
        setCurrentScore(result.case.score);
      }

      setToastMessage(result.message || 'Clue discovered! (+5 points)');
    } catch (err) {
      setToastMessage(err.message || 'Failed to discover clue');
    }
  };

  // Request Hint Handler
  const handleRequestHint = async () => {
    try {
      const result = await requestHint(id);
      setCaseData((prev) => {
        const updatedHints = prev.hints.map((h) =>
          h.id === result.hint.id ? result.hint : h
        );
        return {
          ...prev,
          hints: updatedHints,
          score: result.case?.score || prev.score
        };
      });

      if (result.case?.score) {
        setCurrentScore(result.case.score);
      }

      setToastMessage(result.message || 'Hint revealed! (-10 points)');
    } catch (err) {
      setToastMessage(err.message || 'Failed to request hint');
    }
  };

  // Accuse Suspect Handler
  const handleAccuse = async (suspectId, reasoning) => {
    const verdictData = await accuseSuspect(id, suspectId, reasoning);
    navigate(`/case/${id}/result`, { state: { verdictData } });
  };

  const handleOpenAccuse = (suspectId = '') => {
    setPreselectedSuspect(suspectId);
    setIsAccusing(true);
  };

  if (isLoading) {
    return <LoadingDossier title="Retrieving Case Archives..." />;
  }

  if (error || !caseData) {
    return (
      <div className="content-wrapper animate-fade-in" style={{ paddingTop: '60px', textAlign: 'center' }}>
        <div className="card-glass" style={{ maxWidth: '500px', margin: '0 auto', padding: '36px' }}>
          <AlertTriangle size={36} color="var(--accent-crimson)" style={{ marginBottom: '16px' }} />
          <h2 style={{ marginBottom: '10px' }}>Unable to Open Case</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
            {error || 'The requested case record could not be found.'}
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/create')}>
            Start New Investigation
          </button>
        </div>
      </div>
    );
  }

  const discoveredCount = caseData.clues?.filter(c => c.discovered)?.length || 0;

  return (
    <div className="content-wrapper animate-fade-in">
      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className="toast-banner">
          <Sparkles size={16} color="var(--accent-gold)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Case Header */}
      <section className="room-header">
        <div className="room-title-area">
          <div className="room-meta-tags">
            <span className={`badge badge-${caseData.difficulty === 'Easy' ? 'emerald' : caseData.difficulty === 'Medium' ? 'gold' : 'crimson'}`}>
              {caseData.difficulty} Case
            </span>
            <span className="room-setting">
              <MapPin size={13} color="var(--accent-gold)" />
              {caseData.setting || 'Classified Location'}
            </span>
          </div>
          <h1 className="room-title">{caseData.title}</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Premise: {caseData.premise}
          </p>
        </div>

        <div>
          <button
            type="button"
            className="btn btn-crimson btn-lg"
            onClick={() => handleOpenAccuse()}
          >
            <ShieldAlert size={18} />
            <span>File Accusation</span>
          </button>
        </div>
      </section>

      {/* Live Score HUD */}
      <ScoreHUD caseData={caseData} currentScore={currentScore} />

      {/* Case Briefing Dossier */}
      <section className="briefing-box">
        <div className="briefing-title">
          <BookOpen size={18} />
          <span>Confidential Crime Briefing</span>
        </div>
        <p className="briefing-story">{caseData.story}</p>

        {caseData.victim && (
          <div className="victim-card">
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--accent-crimson)', fontWeight: 700, letterSpacing: '0.05em' }}>
                VICTIM DOSSIER
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>
                {caseData.victim.name} — <span style={{ fontWeight: 400, color: '#cbd5e1' }}>{caseData.victim.role}</span>
              </div>
              {caseData.victim.details && (
                <div className="victim-meta" style={{ marginTop: '2px' }}>
                  {caseData.victim.details}
                </div>
              )}
            </div>

            {caseData.crime && (
              <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '14px' }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                  CRIME COMMITTED
                </div>
                <div style={{ fontSize: '13px', color: '#fca5a5', fontWeight: 600 }}>
                  {caseData.crime}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Navigation Tabs */}
      <div className="room-tabs">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'suspects' ? 'active' : ''}`}
          onClick={() => setActiveTab('suspects')}
        >
          <Users size={16} />
          <span>Suspects Lineup ({caseData.suspects?.length || 0})</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === 'clues' ? 'active' : ''}`}
          onClick={() => setActiveTab('clues')}
        >
          <Search size={16} />
          <span>
            Crime Scene Evidence ({discoveredCount}/{caseData.clues?.length || 0})
          </span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === 'hints' ? 'active' : ''}`}
          onClick={() => setActiveTab('hints')}
        >
          <Lightbulb size={16} />
          <span>Deductive Guidance ({caseData.hints?.filter(h => h.revealed).length || 0}/{caseData.hints?.length || 0})</span>
        </button>
      </div>

      {/* Tab 1: Suspects Lineup */}
      {activeTab === 'suspects' && (
        <section className="animate-fade-in">
          <div className="suspects-grid">
            {caseData.suspects?.map((suspect) => (
              <SuspectCard
                key={suspect.id}
                suspect={suspect}
                onSelectAccuse={handleOpenAccuse}
              />
            ))}
          </div>
        </section>
      )}

      {/* Tab 2: Crime Scene Clues */}
      {activeTab === 'clues' && (
        <section className="animate-fade-in">
          <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Search locations to discover physical evidence. Each unsearched clue yields <strong>+5 points</strong>.
            </p>
            <span className="badge badge-emerald">
              {discoveredCount} of {caseData.clues?.length} Found
            </span>
          </div>

          <div className="clues-grid">
            {caseData.clues?.map((clue, idx) => (
              <ClueCard
                key={clue.id || idx}
                clue={clue}
                index={idx}
                onDiscover={handleDiscoverClue}
              />
            ))}
          </div>
        </section>
      )}

      {/* Tab 3: Hints Accordion */}
      {activeTab === 'hints' && (
        <section className="animate-fade-in">
          <HintAccordion
            hints={caseData.hints}
            onRequestHint={handleRequestHint}
          />
        </section>
      )}

      {/* Accusation Modal */}
      <AccusationModal
        isOpen={isAccusing}
        onClose={() => setIsAccusing(false)}
        suspects={caseData.suspects || []}
        preselectedSuspectId={preselectedSuspect}
        difficulty={caseData.difficulty}
        onSubmitAccusation={handleAccuse}
      />
    </div>
  );
}
