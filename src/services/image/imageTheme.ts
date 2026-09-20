import type { DifferenceTone } from "../../domain/calculations/tone";

export type ToneColors = {
  text: string;
  soft: string;
  fill: string;
};

export type ImageTheme = {
  ink: string;
  line: string;
  surface: string;
  primary: string;
  inkMuted: string;
  fontFamily: string;
  background: string;
  surfaceMuted: string;
  tones: Record<DifferenceTone, ToneColors>;
};

export const readImageTheme = (): ImageTheme => {
  const styles = getComputedStyle(document.documentElement);
  const read = (name: string) => styles.getPropertyValue(name).trim();

  return {
    ink: read("--color-ink"),
    line: read("--color-line"),
    background: read("--color-bg"),
    fontFamily: read("--font-sans"),
    surface: read("--color-surface"),
    primary: read("--color-primary"),
    inkMuted: read("--color-ink-muted"),
    surfaceMuted: read("--color-surface-muted"),
    tones: {
      above: {
        text: read("--color-above"),
        soft: read("--color-above-soft"),
        fill: read("--color-above-fill"),
      },
      below: {
        text: read("--color-below"),
        soft: read("--color-below-soft"),
        fill: read("--color-below-fill"),
      },
      even: {
        fill: read("--color-primary"),
        text: read("--color-primary-text"),
        soft: read("--color-primary-soft"),
      },
    },
  };
};
