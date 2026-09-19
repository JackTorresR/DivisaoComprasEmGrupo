import type { Cents } from '../money/money';

export type DifferenceTone = 'above' | 'below' | 'even';

export const getDifferenceTone = (differenceCents: Cents): DifferenceTone => {
  if (differenceCents > 0) return 'above';
  if (differenceCents < 0) return 'below';
  return 'even';
};
