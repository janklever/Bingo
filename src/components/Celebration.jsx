
import { useTranslation } from 'react-i18next';

export default function Celebration({ celebrationData, onDismiss }) {
  const { t } = useTranslation();
  if (!celebrationData) return null;
  const { title, sub, confettiData } = celebrationData;

  return (
    <div id="btn-fechar-celebracao" className="celebration-overlay" onClick={onDismiss}>
      <div className="confetti-container">
        {confettiData.map((p, i) => (
          <div
            key={i}
            className="confetti-piece"
            style={{
              left: `${p.l}%`,
              width: p.s,
              height: p.s,
              background: p.c,
              borderRadius: p.circ ? '50%' : '2px',
              animation: `confettiFall ${p.dur}s ${p.d}s ease-in forwards`
            }}
          />
        ))}
      </div>
      <div className="celebration-content">
        <div className="celeb-title">{title}</div>
        <div className="celeb-sub">{sub}</div>
        <div className="dismiss-hint">{t('celebration.dismiss_hint')}</div>
      </div>
    </div>
  );
}

