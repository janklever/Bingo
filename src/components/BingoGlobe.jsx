import React from 'react';

const BingoGlobe = React.forwardRef(({ width, height, isSpinning }, ref) => {
  const balls = [
    [80, 128, 15, '#D4A853'],
    [114, 142, 13, '#C8983A'],
    [152, 122, 14, '#D4A853'],
    [97, 102, 11, '#E0B460'],
    [140, 100, 12, '#C8983A'],
    [122, 154, 11, '#D4A853'],
    [165, 138, 10, '#E0B460']
  ];

  return (
    <div ref={ref} className={`globe-wrapper ${isSpinning ? 'spinning' : ''}`}>
      <svg viewBox="0 0 240 300" width={width} height={height}>
        <ellipse cx={120} cy={272} rx={62} ry={11} fill="#0C6E5C" />
        <rect x={88} y={194} width={10} height={77} rx={5} fill="#14957E" />
        <rect x={142} y={194} width={10} height={77} rx={5} fill="#14957E" />
        <rect x={68} y={186} width={104} height={10} rx={5} fill="#14957E" />
        <rect x={192} y={184} width={30} height={6} rx={3} fill="#1AB090" />
        <circle cx={222} cy={187} r={5} fill="#14957E" />
        <circle cx={120} cy={105} r={90} fill="rgba(20,152,126,.08)" stroke="#46BCA3" strokeWidth={3} />
        <ellipse cx={120} cy={70} rx={90} ry={22} fill="none" stroke="#46BCA3" strokeWidth={2} />
        <ellipse cx={120} cy={105} rx={90} ry={9} fill="none" stroke="#46BCA3" strokeWidth={2} />
        <ellipse cx={120} cy={140} rx={90} ry={22} fill="none" stroke="#46BCA3" strokeWidth={2} />
        <ellipse cx={120} cy={105} rx={27} ry={90} fill="none" stroke="#46BCA3" strokeWidth={1.5} />
        <ellipse cx={120} cy={105} rx={62} ry={90} fill="none" stroke="#46BCA3" strokeWidth={1.5} />
        <ellipse cx={120} cy={105} rx={84} ry={90} fill="none" stroke="#46BCA3" strokeWidth={1.5} />
        {balls.map(([cx, cy, r, fill], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill={fill}
            className={`globe-ball globe-ball-${i + 1}`}
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.42))',
              transformOrigin: `${cx}px ${cy}px`
            }}
          />
        ))}
        <ellipse cx={120} cy={16} rx={22} ry={10} fill="#071E18" stroke="#46BCA3" strokeWidth={2} />
        <circle cx={120} cy={12} r={8} fill="#030E0C" />
      </svg>
    </div>
  );
});

export default BingoGlobe;

