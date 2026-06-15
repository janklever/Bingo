import React from 'react';

export default function Card({
  gameId,
  cardNumber,
  playerCard,
  markedCells,
  drawnNumbers,
  completedLines,
  isConnected,
  onGoToHome,
  onMarkCell
}) {
  const checkInLine = (idx) => {
    return completedLines.some((k) => {
      if (k[0] === 'r') return idx >= +k[1] * 5 && idx < +k[1] * 5 + 5;
      if (k[0] === 'c') return idx % 5 === +k[1];
      return k === 'bingo';
    });
  };

  const markedCount = markedCells.length;
  const winsCount = completedLines.length;
  const hasWins = winsCount > 0;
  const winsLabel = winsCount === 1 ? 'linha/coluna' : 'linhas/colunas';
  const winsPlural = winsCount === 1 ? '' : 's';
  const formattedCardNumber = String(cardNumber).padStart(3, '0');

  return (
    <div className="card-container">
      <button id="btn-cartela-voltar-inicio" className="btn-back" onClick={onGoToHome}>
        ← Início
      </button>

      <div className="card-header">
        <h1>BINGO</h1>
        <div className="card-number">Cartela Nº {formattedCardNumber}</div>
      </div>

      {playerCard && (
        <div className="bingo-grid-wrapper">
          {/* Header B-I-N-G-O */}
          <div className="letters-header">
            {['B', 'I', 'N', 'G', 'O'].map((l) => (
              <div key={l} className="letter-cell">
                {l}
              </div>
            ))}
          </div>

          {/* Grid Cells */}
          <div className="cells-grid">
            {playerCard.map((num, idx) => {
              const isFree = num === 0;
              const isMarked = markedCells.includes(idx);
              const isDrawn = isFree || drawnNumbers.includes(num);
              const isPending = isDrawn && !isMarked;
              const isWinningLine = isMarked && checkInLine(idx);

              let cellClass = 'grid-cell';
              if (isFree) cellClass += ' is-free';
              if (isPending) cellClass += ' is-pending';
              if (isMarked) cellClass += ' is-marked';
              if (isWinningLine) cellClass += ' is-winning-line';

              return (
                <div
                  key={idx}
                  className={cellClass}
                  onClick={() => onMarkCell(idx)}
                >
                  {isFree ? (
                    <span className="cell-free-text">FREE</span>
                  ) : (
                    <span className={`cell-number-text ${num >= 10 ? 'double-digit' : ''}`}>
                      {num}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="stats-panel">
        <span className="marked-count">{markedCount} pedras marcadas</span>
        {hasWins && (
          <span className="wins-indicator">
            · {winsCount} {winsLabel} completa{winsPlural}
          </span>
        )}
      </div>

      {isConnected && (
        <div className="connection-status">
          <div className="status-dot" />
          Sincronizado com o sorteio ao vivo
        </div>
      )}
    </div>
  );
}
