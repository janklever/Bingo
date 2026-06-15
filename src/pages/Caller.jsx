import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BingoGlobe from '../components/BingoGlobe';


function getLetterOf(num) {
  if (num <= 0) return 'N';
  if (num <= 15) return 'B';
  if (num <= 30) return 'I';
  if (num <= 45) return 'N';
  if (num <= 60) return 'G';
  return 'O';
}

export default function Caller() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [drawnNumbers, setDrawnNumbers] = useState([]);
  const [lastDrawn, setLastDrawn] = useState(null);

  const [isGlobeSpinning, setIsGlobeSpinning] = useState(false);
  const [flyOffset, setFlyOffset] = useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const audioContextRef = useRef(null);
  const globeRef = useRef(null);

  const joinUrl = `${window.location.origin}/cartela/${gameId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

  const slotRef = useRef(null);

  // Calculate coordinates from the center of the globe to the center of the last ball slot
  useEffect(() => {
    const updateFlyOffset = () => {
      if (globeRef.current && slotRef.current) {
        const globeRect = globeRef.current.getBoundingClientRect();
        const slotRect = slotRef.current.getBoundingClientRect();

        const globeCenterX = globeRect.left + globeRect.width / 2;
        const globeCenterY = globeRect.top + globeRect.height * 0.42; // Center of the actual cage
        const slotCenterX = slotRect.left + slotRect.width / 2;
        const slotCenterY = slotRect.top + slotRect.height / 2;

        setFlyOffset({
          x: globeCenterX - slotCenterX,
          y: globeCenterY - slotCenterY,
        });
      }
    };

    // Run initially
    updateFlyOffset();

    // Run after a short delay to ensure layout has settled
    const timer = setTimeout(updateFlyOffset, 100);

    window.addEventListener('resize', updateFlyOffset);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateFlyOffset);
    };
  }, [drawnNumbers.length > 0]); // Also update when drawing status changes

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

    setIsGlobeSpinning(true);

    const pool = Array.from({ length: 75 }, (_, i) => i + 1).filter(
      (n) => !drawnNumbers.includes(n)
    );
    const num = pool[Math.floor(Math.random() * pool.length)];

    setTimeout(() => {
      const all = [...drawnNumbers, num];
      setDrawnNumbers(all);
      setLastDrawn(num);
      setIsGlobeSpinning(false);

      try {
        localStorage.setItem('bdraw_' + gameId, JSON.stringify(all));
      } catch (e) {
        console.error(e);
      }

      // Audio play
      playDrawSound();
    }, 1500);
  };

  // Save active game ID to LocalStorage
  useEffect(() => {
    if (gameId) {
      localStorage.setItem('game_id', gameId);
    }
  }, [gameId]);

  const handleGoToSetup = () => {
    navigate('/sorteio');
  };

  const drawDisabled = drawnNumbers.length >= 75 || isGlobeSpinning;
  const drawLabel =
    drawnNumbers.length >= 75
      ? t('caller.all_drawn')
      : isGlobeSpinning
        ? t('caller.spinning')
        : t('caller.draw_ball');


  return (
    <div className="caller-container">
      <div className="caller-header">
        <button id="btn-sortador-voltar-qrcode" className="btn-back-qr" onClick={handleGoToSetup}>
          ← {t('global.back')}
        </button>
        <div className="game-info">
          <div className="game-label">{t('global.bingo')}</div>
          <div className="game-id">{gameId}</div>
        </div>
        <button id="btn-ver-qrcode" className="btn-show-qr" onClick={() => setIsModalOpen(true)}>
          {t('caller.btn_show_qr')}
        </button>
      </div>

      <div className="caller-main-section">
        <BingoGlobe ref={globeRef} width={188} height={240} isSpinning={isGlobeSpinning} />
        <div className="last-ball-section">
          <div className="last-ball-label">{t('caller.last_ball')}</div>
          <div ref={slotRef} style={{ width: 130, height: 130, margin: '0 auto', position: 'relative' }}>
            {lastDrawn ? (
              <div
                key={lastDrawn}
                className="last-ball"
                style={{
                  '--fly-x': `${flyOffset.x}px`,
                  '--fly-y': `${flyOffset.y}px`
                }}
              >
                <span className="ball-letter">{getLetterOf(lastDrawn)}</span>
                <span className={`ball-number ${lastDrawn < 10 ? 'single-digit' : ''}`}>
                  {lastDrawn}
                </span>
              </div>
            ) : (
              <div className="last-ball-empty">
                <span>{t('caller.press_draw')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="history-panel">
        <div className="history-title">{t('caller.drawn_numbers', { count: drawnNumbers.length })}</div>
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
          <p className="history-empty">{t('caller.no_drawn_yet')}</p>
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

      {isModalOpen && (
        <div className="qr-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="qr-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="btn-close-modal" onClick={() => setIsModalOpen(false)}>
              &times;
            </button>
            <h2>{t('caller.modal_title')}</h2>
            <p>{t('caller.modal_desc')}</p>

            <div className="qr-code-wrapper">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(joinUrl)}&color=0A5C50&bgcolor=FFF8E7&margin=10`}
                width={200}
                height={200}
                className="qr-image"
                alt={t('setup.qr_alt')}
              />
            </div>

            <div className="game-id-badge">
              <p>{t('global.game_code')}</p>
              <p className="game-id">{gameId}</p>
            </div>

            <div className="link-copy-section">
              <div className="join-link-input">{joinUrl}</div>
              <button
                className={`btn-copy-link ${copied ? 'copied' : ''}`}
                onClick={handleCopyLink}
              >
                {copied ? t('caller.copied') : t('caller.copy_link')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


