import { useMemo } from "react";

const EMOJIS_DE_COMIDA = [
  "🍕",
  "🍔",
  "🌮",
  "🍩",
  "🍪",
  "🍫",
  "🍿",
  "🥐",
  "🧁",
  "🍉",
  "🍓",
  "🍇",
  "🥑",
  "🍜",
];

const sortearEmojiDeComida = () =>
  EMOJIS_DE_COMIDA[Math.floor(Math.random() * EMOJIS_DE_COMIDA.length)];

type LoadingOverlayProps = {
  message?: string;
};

export const LoadingOverlay = (props: LoadingOverlayProps) => {
  const { message = "Só um instante..." } = props;
  const emojiSorteado = useMemo(sortearEmojiDeComida, []);

  return (
    <div
      role="dialog"
      aria-busy="true"
      aria-modal="true"
      className="overlay"
      aria-labelledby="loading-overlay-title"
    >
      <div className="overlay__card overlay__card--compact">
        <span className="overlay__emoji" aria-hidden="true">
          {emojiSorteado}
        </span>
        <p id="loading-overlay-title" className="overlay__title">
          {message}
        </p>
      </div>
    </div>
  );
};
