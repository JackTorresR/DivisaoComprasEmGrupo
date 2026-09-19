import { Button } from '../common/Button';

type CalculatingOverlayProps = {
  progress: number;
  onCancel: () => void;
};

const TOP_EMOJIS = ['🍕', '🥤', '🍫', '🧀', '🍞', '🥩', '🥚', '🥤', '🍕', '🧃'];
const BOTTOM_EMOJIS = ['🍔', '🥛', '🍪', '🥖', '🧀', '🍫', '🥤', '🥚', '🍕'];

type EmojiTrackProps = {
  emojis: string[];
  direction: 'left' | 'right';
};

const EmojiTrack = ({ emojis, direction }: EmojiTrackProps) => (
  <div className="emoji-track" aria-hidden="true">
    <div className={`emoji-track__strip emoji-track__strip--${direction}`}>
      {[...emojis, ...emojis].map((emoji, index) => (
        <span key={index} className="emoji-track__item">
          {emoji}
        </span>
      ))}
    </div>
  </div>
);

export const CalculatingOverlay = ({ progress, onCancel }: CalculatingOverlayProps) => (
  <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="calculating-title" aria-busy="true">
    <div className="overlay__card">
      <EmojiTrack emojis={TOP_EMOJIS} direction="left" />
      <h2 id="calculating-title" className="overlay__title">
        Calculando a melhor divisão...
      </h2>
      <p className="overlay__text">Estamos tentando deixar os valores o mais equilibrados possível.</p>
      <div
        className="progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <span className="progress__fill" style={{ width: `${Math.round(progress * 100)}%` }} />
      </div>
      <EmojiTrack emojis={BOTTOM_EMOJIS} direction="right" />
      <Button size="sm" variant="ghost" onClick={onCancel}>
        Cancelar
      </Button>
    </div>
  </div>
);
