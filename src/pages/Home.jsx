import React from 'react';
import { useNavigate } from 'react-router-dom';
import BingoGlobe from '../components/BingoGlobe';

export default function Home() {
  const navigate = useNavigate();

  const handleGoToSetup = () => {
    navigate('/sorteio');
  };

  const handleGoToCard = () => {
    // Generate a temporary/local game ID if none exists
    const randomGameId = Math.random().toString(36).slice(2, 8).toUpperCase();
    navigate(`/cartela/${randomGameId}`);
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <BingoGlobe width={108} height={128} isSpinning={false} />
        <h1>BINGO</h1>
        <p>Online Brasileiro</p>
      </div>

      <div className="home-steps">
        <div className="step-card">
          <div className="step-number">1</div>
          <h3>Organizador</h3>
          <p>Acesse "Sorteio", compartilhe o QR Code com os participantes e inicie o sorteio das pedras.</p>
        </div>
        <div className="step-card">
          <div className="step-number">2</div>
          <h3>Participante</h3>
          <p>Escaneie o QR Code para receber sua cartela única, gerada aleatoriamente para você.</p>
        </div>
        <div className="step-card">
          <div className="step-number">3</div>
          <h3>Ganhe!</h3>
          <p>Toque nas pedras sorteadas para marcá-las. Complete uma linha ou coluna e comemore!</p>
        </div>
      </div>

      <div className="home-actions">
        <button id="btn-sou-organizador" className="btn-primary" onClick={handleGoToSetup}>
          Sou organizador →
        </button>
        <button id="btn-ver-minha-cartela" className="btn-secondary" onClick={handleGoToCard}>
          Ver minha cartela →
        </button>
      </div>
    </div>
  );
}
