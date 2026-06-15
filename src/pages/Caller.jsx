import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BingoGlobe from '../components/BingoGlobe';

function getLetterOf(num) {
  if (num <= 0)  return 'N';
  if (num <= 15) return 'B';
  if (num <= 30) return 'I';
  if (num <= 45) return 'N';
  if (num <= 60) return 'G';
  return 'O';
}

export default function Caller() {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const [drawnNumbers, setDrawnNumbers] = useState([]);
  const [lastDrawn, setLastDrawn] = useState(null);
  const [isGlobeSpinning, setIsGlobeSpinning] = useState(false);

  const audioContextRef = useRef(null);

  // Load drawn numbers from local storage on mount
  useEffect(() => {
    try {
      const savedDraws = localStorage.getItem('bdraw_' + gameId);
      if (savedDraws) {
        const parsed = JSON.parse(savedDraws);
        setDrawnNumbers(parsed);
        if (parsed.length > 0) {
          setLastDrawn(parsed[parsed.length - 1]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [gameId]);

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

  const playDrawSound = () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(860, t);
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.4);
    gain.gain.setValueAtTime(0.28, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
    osc.start(t);
    osc.stop(t + 0.55);
  };

  const handleDrawNumber = () => {
    if (isGlobeSpinning || drawnNumbers.length >= 75) return;

    const pool = Array.from({ length: 75 }, (_, i) => i + 1).filter(
      (n) => !drawnNumbers.includes(n)
    );
    const num = pool[Math.floor(Math.random() * pool.length)];
    const all = [...drawnNumbers, num];

    setDrawnNumbers(all);
    setLastDrawn(num);
    setIsGlobeSpinning(true);

    setTimeout(() => {
      setIsGlobeSpinning(false);
    }, 1800);

    try {
      localStorage.setItem('bdraw_' + gameId, JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }

    // Audio play
    playDrawSound();
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "Deseja sair do sorteio? O progresso deste jogo será perdido.";
      return e.returnValue;
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleGoToSetup = () => {
    const confirmLeave = window.confirm("Deseja sair do sorteio? O progresso deste jogo será perdido.");
    if (confirmLeave) {
      navigate('/sorteio');
    }
  };

  const drawDisabled = drawnNumbers.length >= 75 || isGlobeSpinning;
  const drawLabel =
    drawnNumbers.length >= 75
      ? 'Todas as pedras sorteadas!'
      : isGlobeSpinning
      ? 'Sorteando…'
      : 'Sortear próxima pedra';

  return (
    <div className="caller-container">
      <div className="caller-header">
        <button id="btn-sortador-voltar-qrcode" className="btn-back-qr" onClick={handleGoToSetup}>
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
        onClick={handleDrawNumber}
        disabled={drawDisabled}
      >
        {drawLabel}
      </button>
    </div>
  );
}
