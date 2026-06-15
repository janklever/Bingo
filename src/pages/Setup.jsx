import React from 'react';

export default function Setup({ gameId, qrCodeUrl, onGoToHome, onGoToCaller }) {
  return (
    <div className="setup-container">
      <button id="btn-sorteio-voltar-inicio" className="btn-back" onClick={onGoToHome}>
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

      <button id="btn-iniciar-sorteio" className="btn-start" onClick={onGoToCaller}>
        Iniciar sorteio →
      </button>
    </div>
  );
}
