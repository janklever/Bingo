import React from 'react';
import BingoGlobe from '../components/BingoGlobe';

function getLetterOf(num) {
  if (num <= 0)  return 'N';
  if (num <= 15) return 'B';
  if (num <= 30) return 'I';
  if (num <= 45) return 'N';
  if (num <= 60) return 'G';
  return 'O';
}

export default function Caller({
  gameId,
  drawnNumbers,
  lastDrawn,
  isGlobeSpinning,
  onGoToSetup,
  onDrawNumber
}) {
  const drawDisabled = drawnNumbers.length >= 75 || isGlobeSpinning;
  const drawLabel =
    drawnNumbers.length >= 75
      ? 'Todas as pedras sorteadas!'
      : isGlobeSpinning
      ? 'Sorteando…'
      : 'Sortear Próxima Pedra';

  return (
    <div className="caller-container">
      <div className="caller-header">
        <button id="btn-sortador-voltar-qrcode" className="btn-back-qr" onClick={onGoToSetup}>
          ← QR Code
        </button>
        <div className="game-info">
          <div className="game-label">Jogo</div>
          <div className="game-id">{gameId}</div>
        </div>
        <div className="counter-badge">
          <div className="counter-value">{drawnNumbers.length}</div>
          <div className="counter-total">/75</div>
        </div>
      </div>

      <div className="caller-main-section">
        <BingoGlobe width={188} height={240} isSpinning={isGlobeSpinning} />
        <div className="last-ball-section">
          <div className="last-ball-label">Última Pedra</div>
          {lastDrawn ? (
            <div className="last-ball">
              <span className="ball-letter">{getLetterOf(lastDrawn)}</span>
              <span className={`ball-number ${lastDrawn < 10 ? 'single-digit' : ''}`}>
                {lastDrawn}
              </span>
            </div>
          ) : (
            <div className="last-ball-empty">
              <span>{`Pressione\nSortear`}</span>
            </div>
          )}
        </div>
      </div>

      <div className="history-panel">
        <div className="history-title">Pedras Sorteadas — {drawnNumbers.length}/75</div>
        {drawnNumbers.length > 0 ? (
          <div className="history-list">
            {drawnNumbers.map((num, i) => {
              const isLast = i === drawnNumbers.length - 1;
              return (
                <div
                  key={num}
                  className={`history-ball ${isLast ? 'is-latest' : 'is-older'}`}
                >
                  <span className="ball-letter-sm">{getLetterOf(num)}</span>
                  <span className={`ball-number-sm ${num < 10 ? 'single-digit-sm' : ''}`}>
                    {num}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="history-empty">Nenhuma pedra sorteada ainda</p>
        )}
      </div>

      <button
        id="btn-sortear-pedra"
        className="btn-draw"
        onClick={onDrawNumber}
        disabled={drawDisabled}
      >
        {drawLabel}
      </button>
    </div>
  );
}
