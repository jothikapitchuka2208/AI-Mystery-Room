import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CreateCasePage from './pages/CreateCasePage';
import InvestigationRoom from './pages/InvestigationRoom';
import ResultsPage from './pages/ResultsPage';
import './App.css';

export default function App() {
  const [activeCase, setActiveCase] = useState(null);
  const [currentScore, setCurrentScore] = useState(null);

  const handleActiveCaseChange = (caseData) => {
    setActiveCase(caseData);
    if (caseData?.score) {
      setCurrentScore(caseData.score);
    }
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        {/* Persistent Top Navigation Bar */}
        <Navbar activeCase={activeCase} score={currentScore} />

        {/* Main Application Views */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/create"
              element={<CreateCasePage onCaseCreated={handleActiveCaseChange} />}
            />
            <Route
              path="/case/:id"
              element={<InvestigationRoom onActiveCaseChange={handleActiveCaseChange} />}
            />
            <Route path="/case/:id/result" element={<ResultsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Atmospheric Footer */}
        <footer style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '24px 0',
          textAlign: 'center',
          fontSize: '13px',
          color: 'var(--text-muted)',
          background: 'rgba(10, 13, 20, 0.95)'
        }}>
          <div className="content-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <strong style={{ color: '#fff' }}>AI Mystery Room</strong> — Powered by Gemini 2.5 & Express Mongoose Engine
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-emerald)', display: 'inline-block' }}></span>
              <span>Deductive Core Active</span>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
