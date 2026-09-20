import type { CSSProperties } from "react";

import { calculateGaugeFill } from "../../domain/calculations/gauge";
import { getDifferenceTone } from "../../domain/calculations/tone";
import { formatSignedMoney, type Cents } from "../../domain/money/money";

type BalanceGaugeProps = {
  averageCents: Cents;
  differenceCents: Cents;
};

const HALF_TRACK_PERCENT = 50;

const buildFillStyle = (
  differenceCents: Cents,
  averageCents: Cents,
): CSSProperties => {
  const { ratio, isBelowAverage } = calculateGaugeFill(
    differenceCents,
    averageCents,
  );
  const width = `${ratio * HALF_TRACK_PERCENT}%`;

  return isBelowAverage ? { width, right: "50%" } : { width, left: "50%" };
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
