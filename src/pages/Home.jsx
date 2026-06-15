import React from 'react';
import { useNavigate } from 'react-router-dom';
import BingoGlobe from '../components/BingoGlobe';

export default function Home() {
  const navigate = useNavigate();

  const handleGoToSetup = () => {
    navigate('/sorteio');
  };

  const handleGoToCard = () => {
    navigate('/cartela');
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>BINGO</h1>
        <p>Online</p>
      </div>

      <div className="home-steps">
        <div className="step-card">
          <h3>
            <i>1</i>
            <span>Organizador</span>
          </h3>
          <p>Compartilhe o QR Code com os participantes e inicie o sorteio.</p>
        </div>
        <div className="step-card">
          <h3>
            <i>2</i>
            <span>Participante</span>
          </h3>
          <p>Escaneie o QR Code ou digite o código do sorteio para receber sua cartela única.</p>
        </div>
        <div className="step-card">
          <h3>
            <i>3</i>
            <span>Ganhador</span>
          </h3>
          <p>Fique atendo, ao completar uma linha ou coluna grite: <strong>BINGO!</strong></p>
        </div>
      </div>

      <div className="home-actions">
        <button id="btn-sou-organizador" className="btn-primary" onClick={handleGoToSetup}>
          Sou organizador →
        </button>
        <button id="btn-ver-minha-cartela" className="btn-secondary" onClick={handleGoToCard}>
          Sou participante →
        </button>
      </div>
    </div>
  );
}
