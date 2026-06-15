import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Celebration from '../components/Celebration';

export default function Card() {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const [playerCard, setPlayerCard] = useState(null);
  const [cardNumber, setCardNumber] = useState(1);
  const [markedCells, setMarkedCells] = useState([12]);
  const [completedLines, setCompletedLines] = useState([]);
  const [celebrationData, setCelebrationData] = useState(null);

  const audioContextRef = useRef(null);

  // Helper to generate a new card
  const generateCard = () => {
    const ranges = [[1, 15], [16, 30], [31, 45], [46, 60], [61, 75]];
    const cols = ranges.map(([min, max]) => {
      const pool = Array.from({ length: max - min + 1 }, (_, i) => i + min);
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      return pool.slice(0, 5);
    });
    const flat = [];
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        flat.push(cols[c][r]);
      }
    }
    flat[12] = 0; // FREE space in the center
    return flat;
  };

  // Audio Context getter
  const getAudioContext = () => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        console.error(e);
      }
    }
    return audioContextRef.current;
  };

  const playMarkSound = () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const t = ctx.currentTime;
    [[660, 0], [880, 0.09]].forEach(([freq, delay]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + delay);
      gain.gain.setValueAtTime(0.16, t + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.22);
      osc.start(t + delay);
      osc.stop(t + delay + 0.22);
    });
  };

  const playCelebrationSound = (isBingo) => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const freqs = isBingo
      ? [523, 659, 784, 1047, 1319, 1047, 784, 1047, 1319, 1568]
      : [523, 659, 784, 1047];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const t = ctx.currentTime + idx * 0.13;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.52);
      osc.start(t);
      osc.stop(t + 0.52);
    });
  };

  // Initial setup based on gameId
  useEffect(() => {
    if (!gameId) return;

    let card = null;
    let num = Math.floor(Math.random() * 999) + 1;

    try {
      const saved = localStorage.getItem('bcard_' + gameId);
      if (saved) {
        const parsed = JSON.parse(saved);
        card = parsed.c;
        num = parsed.n;
      }
    } catch (e) {
      console.error(e);
    }

    if (!card) {
      card = generateCard();
      try {
        localStorage.setItem('bcard_' + gameId, JSON.stringify({ c: card, n: num }));
      } catch (e) {
        console.error(e);
      }
    }

    setPlayerCard(card);
    setCardNumber(num);
    setMarkedCells([12]);
  }, [gameId]);

  const handleMarkCell = (idx) => {
    if (!playerCard || idx === 12) return; // FREE cell cannot be unmarked

    let updatedMarked;
    if (markedCells.includes(idx)) {
      updatedMarked = markedCells.filter((i) => i !== idx);
    } else {
      updatedMarked = [...markedCells, idx];
      playMarkSound();
    }
    setMarkedCells(updatedMarked);
    checkWins(updatedMarked, completedLines);
  };

  const checkWins = (marked, completed) => {
    const wins = [];

    // Rows check
    for (let r = 0; r < 5; r++) {
      const key = 'r' + r;
      if (
        !completed.includes(key) &&
        [0, 1, 2, 3, 4].map((c) => r * 5 + c).every((i) => marked.includes(i))
      ) {
        wins.push({ key, title: 'LINHA!', sub: `Linha ${r + 1} completa! 🎉` });
      }
    }

    // Columns check
    for (let c = 0; c < 5; c++) {
      const key = 'c' + c;
      if (
        !completed.includes(key) &&
        [0, 1, 2, 3, 4].map((r) => r * 5 + c).every((i) => marked.includes(i))
      ) {
        wins.push({ key, title: 'COLUNA!', sub: `Coluna ${c + 1} completa! 🎉` });
      }
    }

    // Full Bingo Check
    if (marked.length === 25 && !completed.includes('bingo')) {
      wins.push({ key: 'bingo', title: 'BINGO!', sub: 'Cartela completa! Você ganhou! 🏆' });
    }

    if (wins.length === 0) return;

    const confettiData = Array.from({ length: 40 }, (_, i) => ({
      l: Math.random() * 100,
      s: 7 + Math.random() * 10,
      d: Math.random() * 0.7,
      dur: 1.8 + Math.random() * 2,
      circ: Math.random() > 0.4,
      c: ['#F0CC7A', '#5BB5A0', '#FF8B74', '#FFD93D', '#A8E6CF', '#D0AAFF'][i % 6]
    }));

    setCompletedLines([...completed, ...wins.map((w) => w.key)]);
    setCelebrationData({ ...wins[0], confettiData });
    playCelebrationSound(wins[0].key === 'bingo');
  };

  const checkInLine = (idx) => {
    return completedLines.some((k) => {
      if (k[0] === 'r') return idx >= +k[1] * 5 && idx < +k[1] * 5 + 5;
      if (k[0] === 'c') return idx % 5 === +k[1];
      return k === 'bingo';
    });
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  const markedCount = markedCells.filter((idx) => idx !== 12).length;
  const winsCount = completedLines.length;
  const hasWins = winsCount > 0;
  const winsLabel = winsCount === 1 ? 'linha/coluna' : 'linhas/colunas';
  const winsPlural = winsCount === 1 ? '' : 's';
  const formattedCardNumber = String(cardNumber).padStart(3, '0');

  return (
    <div className="card-container">
      <button id="btn-cartela-voltar-inicio" className="btn-back" onClick={handleGoToHome}>
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
              const isWinningLine = isMarked && checkInLine(idx);

              let cellClass = 'grid-cell';
              if (isFree) cellClass += ' is-free';
              if (isMarked) cellClass += ' is-marked';
              if (isWinningLine) cellClass += ' is-winning-line';

              return (
                <div
                  key={idx}
                  className={cellClass}
                  onClick={() => handleMarkCell(idx)}
                >
                  {isFree ? (
                    <span className="cell-free-text">LIVRE</span>
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

      <Celebration
        celebrationData={celebrationData}
        onDismiss={() => setCelebrationData(null)}
      />
    </div>
  );
}
