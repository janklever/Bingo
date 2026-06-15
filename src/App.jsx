import React, { useState, useEffect, useRef } from 'react';
import Home from './pages/Home';
import Setup from './pages/Setup';
import Caller from './pages/Caller';
import Card from './pages/Card';
import Celebration from './components/Celebration';

// Custom CSS entry point
import './styles/main.scss';

export default function App() {
  const [page, setPage] = useState('home'); // 'home' | 'setup' | 'caller' | 'card'
  const [gameId, setGameId] = useState(() => Math.random().toString(36).slice(2, 8).toUpperCase());
  const [drawnNumbers, setDrawnNumbers] = useState([]);
  const [lastDrawn, setLastDrawn] = useState(null);
  const [playerCard, setPlayerCard] = useState(null);
  const [markedCells, setMarkedCells] = useState([12]);
  const [completedLines, setCompletedLines] = useState([]);
  const [isGlobeSpinning, setIsGlobeSpinning] = useState(false);
  const [celebrationData, setCelebrationData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [cardNumber, setCardNumber] = useState(1);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const audioContextRef = useRef(null);
  const broadcastChannelRef = useRef(null);

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

  // Generate QR Code URL
  useEffect(() => {
    const base = window.location.origin + window.location.pathname;
    const cu = `${base}?view=cartela&gameId=${gameId}`;
    setQrCodeUrl(
      `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
        cu
      )}&color=0A5C50&bgcolor=FFF8E7&margin=10`
    );
  }, [gameId]);

  // Initial routing and setup based on URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    const gid = params.get('gameId');

    if (view === 'cartela' && gid) {
      setGameId(gid);
      setPage('card');

      let card = null;
      let num = Math.floor(Math.random() * 999) + 1;

      try {
        const saved = localStorage.getItem('bcard_' + gid);
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
          localStorage.setItem('bcard_' + gid, JSON.stringify({ c: card, n: num }));
        } catch (e) {
          console.error(e);
        }
      }

      setPlayerCard(card);
      setCardNumber(num);
      setMarkedCells([12]);

      let drawn = [];
      try {
        const savedDraws = localStorage.getItem('bdraw_' + gid);
        if (savedDraws) {
          drawn = JSON.parse(savedDraws);
          setDrawnNumbers(drawn);
          if (drawn.length > 0) {
            setLastDrawn(drawn[drawn.length - 1]);
          }
        }
      } catch (e) {
        console.error(e);
      }

      // Sincronização em tempo real via BroadcastChannel
      try {
        const channel = new BroadcastChannel('bg_' + gid);
        channel.onmessage = (event) => {
          if (event.data.type === 'DR') {
            setDrawnNumbers(event.data.a);
            setLastDrawn(event.data.n);
          }
        };
        broadcastChannelRef.current = channel;
        setIsConnected(true);
      } catch (e) {
        console.error(e);
      }
    }

    return () => {
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
      }
    };
  }, []);

  // Sync state if gameId changes or draw numbers are called in draw mode
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

    try {
      const channel = new BroadcastChannel('bg_' + gameId);
      channel.postMessage({ type: 'DR', n: num, a: all });
      setTimeout(() => channel.close(), 300);
    } catch (e) {
      console.error(e);
    }

    playDrawSound();
  };

  const handleMarkCell = (idx) => {
    if (!playerCard || idx === 12) return; // FREE cell cannot be unmarked
    if (isConnected && !drawnNumbers.includes(playerCard[idx])) return; // Can only mark drawn numbers in synced mode

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

  // Navigations
  const handleGoToHome = () => {
    setPage('home');
  };

  const handleGoToSetup = () => {
    setPage('setup');
  };

  const handleGoToCaller = () => {
    setPage('caller');
  };

  const handleGoToCard = () => {
    if (!playerCard) {
      const card = generateCard();
      const num = Math.floor(Math.random() * 999) + 1;
      try {
        localStorage.setItem('bcard_' + gameId, JSON.stringify({ c: card, n: num }));
      } catch (e) {
        console.error(e);
      }
      setPlayerCard(card);
      setCardNumber(num);
      setMarkedCells([12]);
    }
    setPage('card');
  };

  return (
    <div className="app-wrapper">
      {page === 'home' && (
        <Home onGoToSetup={handleGoToSetup} onGoToCard={handleGoToCard} />
      )}
      {page === 'setup' && (
        <Setup
          gameId={gameId}
          qrCodeUrl={qrCodeUrl}
          onGoToHome={handleGoToHome}
          onGoToCaller={handleGoToCaller}
        />
      )}
      {page === 'caller' && (
        <Caller
          gameId={gameId}
          drawnNumbers={drawnNumbers}
          lastDrawn={lastDrawn}
          isGlobeSpinning={isGlobeSpinning}
          onGoToSetup={handleGoToSetup}
          onDrawNumber={handleDrawNumber}
        />
      )}
      {page === 'card' && (
        <Card
          gameId={gameId}
          cardNumber={cardNumber}
          playerCard={playerCard}
          markedCells={markedCells}
          drawnNumbers={drawnNumbers}
          completedLines={completedLines}
          isConnected={isConnected}
          onGoToHome={handleGoToHome}
          onMarkCell={handleMarkCell}
        />
      )}

      <Celebration
        celebrationData={celebrationData}
        onDismiss={() => setCelebrationData(null)}
      />
    </div>
  );
}
