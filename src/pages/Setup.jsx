import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Setup() {
  const navigate = useNavigate();
  const [gameId] = useState(() => Math.random().toString(36).slice(2, 8).toUpperCase());
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    const cu = `${window.location.origin}/cartela/${gameId}`;
    setQrCodeUrl(
      `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
        cu
      )}&color=0A5C50&bgcolor=FFF8E7&margin=10`
    );
  }, [gameId]);

  const handleGoToHome = () => {
    navigate('/');
  };

  const handleGoToCaller = () => {
    navigate(`/sorteador/${gameId}`);
  };

  return (
    <div className="setup-container">
      <button id="btn-sorteio-voltar-inicio" className="btn-back" onClick={handleGoToHome}>
        ← Início
      </button>

      <h2>Novo sorteio</h2>
      <p className="setup-subtitle">Compartilhe o QR Code antes de iniciar</p>

      <div className="qr-card">
        {qrCodeUrl && (
          <img
            src={qrCodeUrl}
            width={200}
            height={200}
            className="qr-image"
            alt="QR Code da cartela"
          />
        )}
        <div className="game-code-container">
          <p>Código do jogo</p>
          <p className="game-id">{gameId}</p>
        </div>
      </div>

      <p className="setup-info">
        Cada participante que escanear receberá uma cartela única e aleatória. Aguarde antes de iniciar.
      </p>

      <button id="btn-iniciar-sorteio" className="btn-start" onClick={handleGoToCaller}>
        Iniciar sorteio →
      </button>
    </div>
  );
}
