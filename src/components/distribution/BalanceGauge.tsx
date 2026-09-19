import type { CSSProperties } from 'react';
import { getDifferenceTone } from '../../domain/calculations/tone';
import { formatSignedMoney, type Cents } from '../../domain/money/money';

type BalanceGaugeProps = {
  differenceCents: Cents;
  averageCents: Cents;
};

const FULL_SCALE_RATIO = 0.25;
const HALF_TRACK_PERCENT = 50;

const buildFillStyle = (differenceCents: Cents, averageCents: Cents): CSSProperties => {
  const scale = averageCents * FULL_SCALE_RATIO;
  const ratio = scale === 0 ? 0 : Math.min(Math.abs(differenceCents) / scale, 1);
  const width = `${ratio * HALF_TRACK_PERCENT}%`;
  return differenceCents < 0 ? { width, right: '50%' } : { width, left: '50%' };
};

export const BalanceGauge = ({ differenceCents, averageCents }: BalanceGaugeProps) => (
  <div
    className="gauge"
    role="img"
    aria-label={`Diferença de ${formatSignedMoney(differenceCents)} em relação à média`}
  >
    <span
      className={`gauge__fill gauge__fill--${getDifferenceTone(differenceCents)}`}
      style={buildFillStyle(differenceCents, averageCents)}
    />
    <span className="gauge__center" />
  </div>
);
