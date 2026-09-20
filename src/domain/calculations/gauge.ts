import type { Cents } from "../money/money";

export type GaugeFill = {
  ratio: number;
  isBelowAverage: boolean;
};

const FULL_SCALE_RATIO = 0.25;

export const calculateGaugeFill = (
  differenceCents: Cents,
  averageCents: Cents,
): GaugeFill => {
  const scale = averageCents * FULL_SCALE_RATIO;
  const ratio =
    scale === 0 ? 0 : Math.min(Math.abs(differenceCents) / scale, 1);

  return { ratio, isBelowAverage: differenceCents < 0 };
};
