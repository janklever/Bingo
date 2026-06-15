import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleGoToSetup = () => {
    navigate('/sorteio');
  };

  const handleGoToCard = () => {
    navigate('/cartela');
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>{t('global.bingo')}</h1>
        <p>{t('global.online')}</p>
      </div>

      <div className="home-steps">
        <div className="step-card">
          <h3>
            <i>1</i>
            <span>{t('home.organizer_title')}</span>
          </h3>
          <p>{t('home.organizer_desc')}</p>
        </div>
        <div className="step-card">
          <h3>
            <i>2</i>
            <span>{t('home.participant_title')}</span>
          </h3>
          <p>{t('home.participant_desc')}</p>
        </div>
        <div className="step-card">
          <h3>
            <i>3</i>
            <span>{t('home.winner_title')}</span>
          </h3>
          <p>
            {t('home.winner_desc')}<strong>{t('home.winner_bold')}</strong>
          </p>
        </div>
      </div>

      <div className="home-actions">
        <button id="btn-sou-organizador" className="btn-primary" onClick={handleGoToSetup}>
          {t('home.btn_organizer')}
        </button>
        <button id="btn-ver-minha-cartela" className="btn-secondary" onClick={handleGoToCard}>
          {t('home.btn_participant')}
        </button>
      </div>
    </div>
  );
}

