export type TextAlign = "left" | "right" | "center";

type TextStyle = {
  size: number;
  color: string;
  weight: number;
  align?: TextAlign;
  fontFamily: string;
};

export const fillRoundedRect = (
  context: CanvasRenderingContext2D,
  rect: { x: number; y: number; width: number; height: number },
  radius: number,
  color: string,
) => {
  context.beginPath();
  context.roundRect(rect.x, rect.y, rect.width, rect.height, radius);
  context.fillStyle = color;
  context.fill();
};

export const applyTextStyle = (
  context: CanvasRenderingContext2D,
  style: TextStyle,
) => {
  context.font = `${style.weight} ${style.size}px ${style.fontFamily}`;
  context.fillStyle = style.color;
  context.textAlign = style.align ?? "left";
  context.textBaseline = "middle";
};

export const drawText = (
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  centerY: number,
  style: TextStyle,
) => {
  applyTextStyle(context, style);
  context.fillText(text, x, centerY);
};

export const measureText = (
  context: CanvasRenderingContext2D,
  text: string,
  style: TextStyle,
) => {
  applyTextStyle(context, style);
  return context.measureText(text).width;
};

export const fitText = (
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  style: TextStyle,
) => {
  if (measureText(context, text, style) <= maxWidth) return text;

  let end = text.length;
  while (
    end > 1 &&
    measureText(context, `${text.slice(0, end)}…`, style) > maxWidth
  ) {
    end -= 1;
  }
  return `${text.slice(0, end).trimEnd()}…`;
};

export const canvasToBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Falha ao gerar a imagem.")),
      "image/png",
    );
  });
