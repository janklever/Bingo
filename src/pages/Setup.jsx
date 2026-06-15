import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Setup() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [gameId, setGameId] = useState(() => {
    return localStorage.getItem('game_id') || Math.random().toString(36).slice(2, 8).toUpperCase();
  });
  const [isExistingGame, setIsExistingGame] = useState(() => !!localStorage.getItem('game_id'));
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    // Save to LocalStorage immediately if not already saved
    localStorage.setItem('game_id', gameId);
  }, [gameId]);

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

  const handleStartNew = () => {
    const confirm = window.confirm(t('setup.confirm_new'));
    if (confirm) {
      const newId = Math.random().toString(36).slice(2, 8).toUpperCase();
      setGameId(newId);
      setIsExistingGame(false);
      localStorage.setItem('game_id', newId);
    }
  };

  return (
    <div className="setup-container">
      <button id="btn-sorteio-voltar-inicio" className="btn-back" onClick={handleGoToHome}>
        ← {t('global.back')}
      </button>

      <h2>{t('setup.title')}</h2>
      <p className="setup-subtitle">{t('setup.subtitle')}</p>

      <div className="qr-card">
        {qrCodeUrl && (
          <img
            src={qrCodeUrl}
            width={200}
            height={200}
            className="qr-image"
            alt={t('setup.qr_alt')}
          />
        )}
        <div className="game-code-container">
          <p>{t('global.game_code')}</p>
          <p className="game-id">{gameId}</p>
        </div>
      </div>

      <p className="setup-info">
        {t('setup.info')}
      </p>

      <div className="setup-actions" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <button id="btn-iniciar-sorteio" className="btn-start" onClick={handleGoToCaller}>
          {isExistingGame ? t('setup.btn_continue') : t('setup.btn_start')}
        </button>

        {isExistingGame && (
          <button id="btn-novo-sorteio" className="btn-secondary-setup" onClick={handleStartNew}>
            {t('setup.btn_start_new')}
          </button>
        )}
      </div>
    </div>
  );
}

