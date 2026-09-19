import type { CSSProperties } from "react";

import { getDifferenceTone } from "../../domain/calculations/tone";
import { formatSignedMoney, type Cents } from "../../domain/money/money";

type BalanceGaugeProps = {
  averageCents: Cents;
  differenceCents: Cents;
};

const FULL_SCALE_RATIO = 0.25;
const HALF_TRACK_PERCENT = 50;

const buildFillStyle = (
  differenceCents: Cents,
  averageCents: Cents,
): CSSProperties => {
  const scale = averageCents * FULL_SCALE_RATIO;

  const ratio =
    scale === 0 ? 0 : Math.min(Math.abs(differenceCents) / scale, 1);

  const width = `${ratio * HALF_TRACK_PERCENT}%`;

  return differenceCents < 0 ? { width, right: "50%" } : { width, left: "50%" };
};

export const BalanceGauge = (props: BalanceGaugeProps) => {
  const { averageCents, differenceCents } = props;

  return (
    <div
      className="gauge-wrapper"
      role="img"
      aria-label={`Diferença de ${formatSignedMoney(differenceCents)} em relação à média`}
    >
      <div className="gauge-labels" aria-hidden="true">
        <span>Abaixo da média</span>
        <strong>Média</strong>
        <span>Acima da média</span>
      </div>
      <div className="gauge">
        <span
          className={`gauge__fill gauge__fill--${getDifferenceTone(differenceCents)}`}
          style={buildFillStyle(differenceCents, averageCents)}
        />
        <span className="gauge__center" />
      </div>
    </div>
  );
};
