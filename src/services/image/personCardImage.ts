import { calculateGaugeFill } from "../../domain/calculations/gauge";
import type { PersonShare } from "../../domain/calculations/summary";
import { getDifferenceTone } from "../../domain/calculations/tone";
import {
  groupUnitsByProduct,
  type UnitGroup,
} from "../../domain/calculations/unitGroups";
import {
  formatMoney,
  formatSignedMoney,
  type Cents,
} from "../../domain/money/money";
import { normalizeText } from "../../utils/normalizeText";
import {
  formatProductLabel,
  formatQuantityPrefix,
} from "../../utils/productLabel";
import {
  canvasToBlob,
  drawText,
  fillRoundedRect,
  fitText,
  measureText,
} from "./canvasPrimitives";
import { readImageTheme, type ImageTheme } from "./imageTheme";

type Layout = {
  left: number;
  right: number;
  width: number;
};

type DrawInput = {
  layout: Layout;
  theme: ImageTheme;
  share: PersonShare;
  averageCents: Cents;
  context: CanvasRenderingContext2D;
};

const GAP = 16;
const SCALE = 2;
const OUTER = 24;
const WIDTH = 720;
const PADDING = 36;
const ROW_HEIGHT = 46;
const MARK_WIDTH = 40;
const STAT_HEIGHT = 36;
const GAUGE_HEIGHT = 86;
const TOTAL_HEIGHT = 80;
const FOOTER_HEIGHT = 64;
const HEADER_HEIGHT = 68;
const DIVIDER_HEIGHT = 36;

const calculateHeight = (rowCount: number) =>
  OUTER * 2 +
  PADDING * 2 +
  HEADER_HEIGHT +
  TOTAL_HEIGHT +
  STAT_HEIGHT * 2 +
  GAUGE_HEIGHT +
  DIVIDER_HEIGHT +
  Math.max(rowCount, 1) * ROW_HEIGHT +
  FOOTER_HEIGHT;

const drawBackground = ({ context, theme }: DrawInput, height: number) => {
  context.fillStyle = theme.background;
  context.fillRect(0, 0, WIDTH, height);
  fillRoundedRect(
    context,
    {
      x: OUTER,
      y: OUTER,
      width: WIDTH - OUTER * 2,
      height: height - OUTER * 2,
    },
    28,
    theme.surface,
  );
};

const drawHeader = (input: DrawInput, top: number) => {
  const { context, theme, layout, share } = input;
  const tone = theme.tones[getDifferenceTone(share.differenceCents)];
  const centerY = top + HEADER_HEIGHT / 2;
  const chipStyle = {
    color: tone.text,
    size: 22,
    weight: 700,
    fontFamily: theme.fontFamily,
    align: "center" as const,
  };
  const chipText = formatSignedMoney(share.differenceCents);
  const chipWidth = measureText(context, chipText, chipStyle) + 36;
  const nameStyle = {
    color: theme.ink,
    size: 38,
    weight: 700,
    fontFamily: theme.fontFamily,
  };
  const name = fitText(
    context,
    share.person.name,
    layout.width - chipWidth - GAP,
    nameStyle,
  );

  drawText(context, name, layout.left, centerY, nameStyle);
  fillRoundedRect(
    context,
    {
      x: layout.right - chipWidth,
      y: centerY - 20,
      width: chipWidth,
      height: 40,
    },
    20,
    tone.soft,
  );
  drawText(context, chipText, layout.right - chipWidth / 2, centerY, chipStyle);
  return top + HEADER_HEIGHT;
};

const drawValueRow = (
  input: DrawInput,
  top: number,
  height: number,
  label: string,
  value: string,
  valueSize: number,
) => {
  const { context, theme, layout } = input;
  const centerY = top + height / 2;
  drawText(context, label, layout.left, centerY, {
    color: theme.inkMuted,
    size: 24,
    weight: 500,
    fontFamily: theme.fontFamily,
  });
  drawText(context, value, layout.right, centerY, {
    color: theme.ink,
    size: valueSize,
    weight: valueSize > 30 ? 800 : 600,
    fontFamily: theme.fontFamily,
    align: "right",
  });
  return top + height;
};

const drawGauge = (input: DrawInput, top: number) => {
  const { context, theme, layout, share, averageCents } = input;
  const labelStyle = {
    color: theme.inkMuted,
    size: 18,
    weight: 500,
    fontFamily: theme.fontFamily,
  };
  const labelY = top + 26;
  drawText(context, "Abaixo da média", layout.left, labelY, labelStyle);
  drawText(context, "Média", layout.left + layout.width / 2, labelY, {
    ...labelStyle,
    color: theme.ink,
    weight: 700,
    align: "center",
  });
  drawText(context, "Acima da média", layout.right, labelY, {
    ...labelStyle,
    align: "right",
  });

  const track = {
    x: layout.left,
    y: top + 48,
    width: layout.width,
    height: 12,
  };
  const fill = calculateGaugeFill(share.differenceCents, averageCents);
  const tone = theme.tones[getDifferenceTone(share.differenceCents)];
  const fillWidth = (layout.width / 2) * fill.ratio;
  const fillX = fill.isBelowAverage
    ? layout.left + layout.width / 2 - fillWidth
    : layout.left + layout.width / 2;

  fillRoundedRect(context, track, 6, theme.surfaceMuted);
  context.save();
  context.beginPath();
  context.roundRect(track.x, track.y, track.width, track.height, 6);
  context.clip();
  context.fillStyle = tone.fill;
  context.fillRect(fillX, track.y, fillWidth, track.height);
  context.fillStyle = theme.ink;
  context.fillRect(
    layout.left + layout.width / 2 - 1.5,
    track.y,
    3,
    track.height,
  );
  context.restore();
  return top + GAUGE_HEIGHT;
};

const drawDivider = ({ context, theme, layout }: DrawInput, top: number) => {
  context.fillStyle = theme.line;
  context.fillRect(
    layout.left,
    top + DIVIDER_HEIGHT / 2 - 12,
    layout.width,
    1.5,
  );
  return top + DIVIDER_HEIGHT;
};

const drawGroupRow = (input: DrawInput, group: UnitGroup, top: number) => {
  const { context, theme, layout } = input;
  const centerY = top + ROW_HEIGHT / 2;
  const priceStyle = {
    color: theme.inkMuted,
    size: 24,
    weight: 500,
    fontFamily: theme.fontFamily,
    align: "right" as const,
  };
  const labelStyle = {
    color: theme.ink,
    size: 25,
    weight: 500,
    fontFamily: theme.fontFamily,
  };
  const price = formatMoney(group.totalCents);
  const labelWidth =
    layout.width - MARK_WIDTH - measureText(context, price, priceStyle) - GAP;
  const label = fitText(
    context,
    `${formatQuantityPrefix(group.quantity)}${formatProductLabel(group.name, group.unitLabel)}`,
    labelWidth,
    labelStyle,
  );

  drawText(context, group.locked ? "🔒" : "✓", layout.left, centerY, {
    color: theme.primary,
    size: 22,
    weight: 700,
    fontFamily: theme.fontFamily,
  });
  drawText(context, label, layout.left + MARK_WIDTH, centerY, labelStyle);
  drawText(context, price, layout.right, centerY, priceStyle);
};

const drawGroups = (input: DrawInput, groups: UnitGroup[], top: number) => {
  if (groups.length === 0) {
    drawText(
      input.context,
      "Nenhum produto atribuído.",
      input.layout.left,
      top + ROW_HEIGHT / 2,
      {
        color: input.theme.inkMuted,
        size: 24,
        weight: 500,
        fontFamily: input.theme.fontFamily,
      },
    );
    return top + ROW_HEIGHT;
  }
  groups.forEach((group, index) =>
    drawGroupRow(input, group, top + index * ROW_HEIGHT),
  );
  return top + groups.length * ROW_HEIGHT;
};

const drawFooter = (input: DrawInput, top: number) => {
  const { context, theme, layout, averageCents } = input;
  const centerY = top + FOOTER_HEIGHT / 2 + 8;
  const style = {
    color: theme.inkMuted,
    size: 20,
    weight: 500,
    fontFamily: theme.fontFamily,
  };
  drawText(context, "Divisor de Compras", layout.left, centerY, style);
  drawText(
    context,
    `Média do grupo: ${formatMoney(averageCents)}`,
    layout.right,
    centerY,
    { ...style, align: "right" },
  );
};

export const renderPersonCardImage = async (
  share: PersonShare,
  averageCents: Cents,
): Promise<Blob> => {
  const groups = groupUnitsByProduct(share.units);
  const height = calculateHeight(groups.length);
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH * SCALE;
  canvas.height = height * SCALE;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas indisponível.");
  context.scale(SCALE, SCALE);

  const left = OUTER + PADDING;
  const right = WIDTH - OUTER - PADDING;
  const input: DrawInput = {
    context,
    theme: readImageTheme(),
    layout: { left, right, width: right - left },
    share,
    averageCents,
  };

  drawBackground(input, height);
  let top = OUTER + PADDING;
  top = drawHeader(input, top);
  top = drawValueRow(
    input,
    top,
    TOTAL_HEIGHT,
    "Total",
    formatMoney(share.totalCents),
    56,
  );
  top = drawValueRow(
    input,
    top,
    STAT_HEIGHT,
    "Média",
    formatMoney(averageCents),
    24,
  );
  top = drawValueRow(
    input,
    top,
    STAT_HEIGHT,
    "Diferença",
    formatSignedMoney(share.differenceCents),
    24,
  );
  top = drawGauge(input, top);
  top = drawDivider(input, top);
  top = drawGroups(input, groups, top);
  drawFooter(input, top);

  return canvasToBlob(canvas);
};

export const buildImageFileName = (personName: string) => {
  const slug = normalizeText(personName)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `divisao-${slug || "pessoa"}.png`;
};
