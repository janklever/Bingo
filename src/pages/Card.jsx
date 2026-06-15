import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Celebration from '../components/Celebration';


export default function Card() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();


  const [playerCard, setPlayerCard] = useState(null);
  const [cardNumber, setCardNumber] = useState(1);
  const [markedCells, setMarkedCells] = useState([12]);
  const [completedLines, setCompletedLines] = useState([]);
  const [celebrationData, setCelebrationData] = useState(null);
  const [showInstructionModal, setShowInstructionModal] = useState(false);
  const hasShownInstructions = useRef(false);


  const [codeInputs, setCodeInputs] = useState(Array(6).fill(''));
  const inputRefs = useRef([]);

  const audioContextRef = useRef(null);

  const handleOtpChange = (val, idx) => {
    const cleanVal = val.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const newInputs = [...codeInputs];
    newInputs[idx] = cleanVal.slice(-1); // Keep last char
    setCodeInputs(newInputs);

    if (cleanVal && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      if (!codeInputs[idx] && idx > 0) {
        const newInputs = [...codeInputs];
        newInputs[idx - 1] = '';
        setCodeInputs(newInputs);
        inputRefs.current[idx - 1]?.focus();
      } else if (codeInputs[idx]) {
        const newInputs = [...codeInputs];
        newInputs[idx] = '';
        setCodeInputs(newInputs);
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData('text')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 6);

    const newInputs = [...codeInputs];
    for (let i = 0; i < 6; i++) {
      newInputs[i] = pastedData[i] || '';
    }
    setCodeInputs(newInputs);

    const nextFocusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  const handleSubmitCode = (e) => {
    if (e) e.preventDefault();
    const code = codeInputs.join('');
    if (code.length === 6) {
      navigate(`/cartela/${code}`);
    }
  };


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
    let savedMarked = [12];
    let savedCompleted = [];

    try {
      const saved = localStorage.getItem('bcard_' + gameId);
      if (saved) {
        const parsed = JSON.parse(saved);
        card = parsed.c;
        num = parsed.n;
      }

      const sm = localStorage.getItem('bmarked_' + gameId);
      if (sm) {
        savedMarked = JSON.parse(sm);
      }

      const sc = localStorage.getItem('bcompleted_' + gameId);
      if (sc) {
        savedCompleted = JSON.parse(sc);
      }
    } catch (e) {
      console.error(e);
    }

    if (!card) {
      card = generateCard();
      try {
        localStorage.setItem('bcard_' + gameId, JSON.stringify({ c: card, n: num }));
        localStorage.setItem('bmarked_' + gameId, JSON.stringify([12]));
        localStorage.setItem('bcompleted_' + gameId, JSON.stringify([]));
      } catch (e) {
        console.error(e);
      }
    }

    setPlayerCard(card);
    setCardNumber(num);
    setMarkedCells(savedMarked);
    setCompletedLines(savedCompleted);
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
    try {
      localStorage.setItem('bmarked_' + gameId, JSON.stringify(updatedMarked));
    } catch (e) {
      console.error(e);
    }
    checkWins(updatedMarked, completedLines);
  };

  const checkWins = (marked, completed) => {
    const wins = [];

    // Full Bingo Check (priority)
    if (marked.length === 25 && !completed.includes('bingo')) {
      wins.push({ key: 'bingo', title: 'BINGO!', sub: t('card.full_card') });
    }

    // Only check rows/columns if the card is not fully completed right now
    if (marked.length < 25) {
      // Rows check
      for (let r = 0; r < 5; r++) {
        const key = 'r' + r;
        if (
          !completed.includes(key) &&
          [0, 1, 2, 3, 4].map((c) => r * 5 + c).every((i) => marked.includes(i))
        ) {
          wins.push({ key, title: 'BINGO!', sub: t('card.wins_indicator_row', { number: r + 1 }) });
        }
      }

      // Columns check
      for (let c = 0; c < 5; c++) {
        const key = 'c' + c;
        if (
          !completed.includes(key) &&
          [0, 1, 2, 3, 4].map((r) => r * 5 + c).every((i) => marked.includes(i))
        ) {
          wins.push({ key, title: 'BINGO!', sub: t('card.wins_indicator_col', { number: c + 1 }) });
        }
      }
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

    const newCompleted = [...completed, ...wins.map((w) => w.key)];
    setCompletedLines(newCompleted);
    try {
      localStorage.setItem('bcompleted_' + gameId, JSON.stringify(newCompleted));
    } catch (e) {
      console.error(e);
    }
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

  const handleSwapCard = () => {
    // Only allow if no marks (excluding center 12)
    const activeMarks = markedCells.filter((idx) => idx !== 12);
    if (activeMarks.length > 0) return;

    const newCard = generateCard();
    const newNum = Math.floor(Math.random() * 999) + 1;

    try {
      localStorage.setItem('bcard_' + gameId, JSON.stringify({ c: newCard, n: newNum }));
      localStorage.setItem('bmarked_' + gameId, JSON.stringify([12]));
      localStorage.setItem('bcompleted_' + gameId, JSON.stringify([]));
    } catch (e) {
      console.error(e);
    }

    setPlayerCard(newCard);
    setCardNumber(newNum);
    setMarkedCells([12]);
    setCompletedLines([]);
    setCelebrationData(null);
  };

  useEffect(() => {
    if (!gameId) {
      const saved = localStorage.getItem('game_id');
      if (saved) {
        navigate(`/cartela/${saved}`, { replace: true });
      }
    } else {
      localStorage.setItem('game_id', gameId);
    }
  }, [gameId, navigate]);

  // Show instruction modal on first visit when no numbers are marked
  useEffect(() => {
    const activeMarks = markedCells.filter((idx) => idx !== 12).length;
    if (gameId && playerCard && activeMarks === 0 && !hasShownInstructions.current) {
      setShowInstructionModal(true);
      hasShownInstructions.current = true;
    }
  }, [gameId, playerCard, markedCells]);

  const handleChangeCode = () => {
    const confirm = window.confirm(t('card.confirm_change_code'));
    if (confirm) {
      localStorage.removeItem('game_id');
      navigate('/cartela');
    }
  };


  const markedCount = markedCells.filter((idx) => idx !== 12).length;
  const winsCount = completedLines.length;
  const hasWins = winsCount > 0;
  const winsText = winsCount === 1
    ? t('card.wins_indicator_one', { count: winsCount })
    : t('card.wins_indicator_other', { count: winsCount });
  const formattedCardNumber = String(cardNumber).padStart(3, '0');


  if (!gameId) {
    return (
      <div className="card-container code-entry-container">
        <button id="btn-cartela-voltar-inicio" className="btn-back" onClick={() => navigate('/')}>
          ← {t('global.back')}
        </button>

        <div className="card-header">
          <h1>{t('global.bingo')}</h1>
          <div className="card-number">{t('card.enter_game')}</div>
        </div>

        <form className="code-entry-card" onSubmit={handleSubmitCode}>
          <h2>{t('card.draw_code')}</h2>
          <p>{t('card.enter_code_desc')}</p>

          <div className="otp-inputs">
            {codeInputs.map((val, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                maxLength={1}
                value={val}
                onChange={(e) => handleOtpChange(e.target.value, idx)}
                onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                onPaste={handleOtpPaste}
                className="otp-input-box"
                placeholder="•"
                autoComplete="off"
                spellCheck="false"
              />
            ))}
          </div>

          <button
            type="submit"
            className="btn-submit-code"
            disabled={codeInputs.some((c) => !c)}
          >
            {t('card.btn_access_card')}
          </button>
        </form>
      </div>
    );
  }


  return (
    <div className="card-container">
      <div className="card-header">
        <div className="game-info">
          <div className="game-label">{t('global.bingo')}</div>
          <div className="game-id">{gameId}</div>
        </div>
        <div className="card-number">{t('card.card_number', { number: formattedCardNumber })}</div>
      </div>

      {playerCard && (
        <div className={`bingo-grid-wrapper ${markedCount === 24 ? 'is-full-card' : ''}`}>
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
                    <span className="cell-free-text">{t('card.free_cell')}</span>
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

      {markedCount === 0 ? (
        <button
          onClick={handleSwapCard}
          className="btn-new-card"
        >
          {t('card.btn_new_card')}
        </button>
      ) : (
        <div className="stats-panel">
          <span className="marked-count">
            {markedCount === 1 ? t('card.marked_count_one', { count: markedCount }) : t('card.marked_count_other', { count: markedCount })}
          </span>
          {hasWins && (
            <>
              <span className="separator">•</span>
              <span className="wins-indicator">
                {markedCount === 24 ? t('card.full_card') : winsText}
              </span>
            </>
          )}
        </div>
      )}

      <button className="btn-change-code" onClick={handleChangeCode}>
        {t('card.btn_change_code')}
      </button>

      <Celebration
        celebrationData={celebrationData}
        onDismiss={() => setCelebrationData(null)}
      />

      {showInstructionModal && (
        <div className="instruction-modal-overlay" onClick={() => setShowInstructionModal(false)}>
          <div className="instruction-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{t('card.how_to_play')}</h2>
            <div className="instruction-steps">
              <div className="instruction-step">
                <span className="instruction-icon">📢</span>
                <p>{t('card.step1')}</p>
              </div>
              <div className="instruction-step">
                <span className="instruction-icon">👆</span>
                <p>{t('card.step2')}</p>
              </div>
              <div className="instruction-step">
                <span className="instruction-icon">🎉</span>
                <p>{t('card.step3')}</p>
              </div>
            </div>
            <button className="btn-dismiss-instructions" onClick={() => setShowInstructionModal(false)}>
              {t('card.btn_dismiss')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

