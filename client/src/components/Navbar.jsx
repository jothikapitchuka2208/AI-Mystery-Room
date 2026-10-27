import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, PlusCircle, Shield, Award, HelpCircle } from 'lucide-react';

export default function Navbar({ activeCase, score }) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isCreate = location.pathname === '/create';
  const isCase = location.pathname.startsWith('/case/');

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <div className="nav-brand-icon">
            <Search size={20} strokeWidth={2.5} />
          </div>
          <span>AI Mystery Room</span>
        </Link>

        <div className="nav-links">
          {activeCase && isCase && (
            <div className="score-hud">
              <div className="hud-item">
                <span>Score:</span>
                <span className="hud-val gold">{score?.total ?? activeCase?.score?.total ?? 0}</span>
              </div>
              <div className="hud-item">
                <span className={`badge badge-${activeCase.difficulty === 'Easy' ? 'emerald' : activeCase.difficulty === 'Medium' ? 'gold' : 'crimson'}`}>
                  {activeCase.difficulty}
                </span>
              </div>
            </div>
          )}

          <Link
            to="/create"
            className={`btn btn-sm ${isCreate ? 'btn-ghost' : 'btn-primary'}`}
          >
            <PlusCircle size={15} />
            <span>New Case</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
