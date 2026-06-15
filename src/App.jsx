import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Home from './pages/Home';
import Setup from './pages/Setup';
import Caller from './pages/Caller';
import Card from './pages/Card';
import LanguageSwitcher from './components/LanguageSwitcher';

import './styles/main.scss';

export default function App() {
  const { t } = useTranslation();

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
        <footer className="app-footer">
          <div className="footer-credits">
            {t('global.created_by')}{' '}
            <a href="https://janklever.work" target="_blank" rel="noopener noreferrer">
              Jan Klever
            </a>
          </div>
          <LanguageSwitcher />
        </footer>
      </div>
    </Router>
  );
}


