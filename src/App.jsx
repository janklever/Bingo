import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Setup from './pages/Setup';
import Caller from './pages/Caller';
import Card from './pages/Card';

import './styles/main.scss';

export default function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sorteio" element={<Setup />} />
          <Route path="/sorteador/:gameId" element={<Caller />} />
          <Route path="/cartela/:gameId" element={<Card />} />
          <Route path="/cartela" element={<Card />} />
          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
