import { useEffect, useRef, type MouseEvent, type SyntheticEvent } from "react";
import type { PersonShare } from "../../domain/calculations/summary";
import type { Cents } from "../../domain/money/money";
import { usePersonCardImage } from "../../hooks/usePersonCardImage";
import { buildImageFileName } from "../../services/image/personCardImage";
import { Button } from "../common/Button";
import { CopyButton } from "../common/CopyButton";

type PersonImageDialogProps = {
  share: PersonShare;
  averageCents: Cents;
  onClose: () => void;
};

export const PersonImageDialog = (props: PersonImageDialogProps) => {
  const { share, onClose, averageCents } = props;
  const { image, hasFailed } = usePersonCardImage(share, averageCents);

  const personName = share.person.name;
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const handleCancel = (event: SyntheticEvent) => {
    event.preventDefault();
    onClose();
  };

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  const copyImage = async () => {
    if (!image) throw new Error("Imagem ainda não gerada.");
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": image.blob }),
    ]);
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      className="dialog dialog--image"
    >
      <h2 className="dialog__title">Imagem de {personName}</h2>
      <div className="image-preview">
        {image && <img src={image.url} alt={`Card de ${personName}`} />}
        {!image && !hasFailed && (
          <p className="image-preview__message">Gerando imagem...</p>
        )}
        {hasFailed && (
          <p
            className="image-preview__message field__message--error"
            role="alert"
          >
            Não foi possível gerar a imagem. Tente novamente.
          </p>
        )}
      </div>
      <div className="dialog__actions dialog__actions--wrap">
        <Button onClick={onClose}>Fechar</Button>
        <CopyButton
          disabled={!image}
          onCopy={copyImage}
          label="Copiar imagem"
        />
        {image ? (
          <a
            href={image.url}
            download={buildImageFileName(personName)}
            className="button button--md button--primary"
          >
            Baixar imagem
          </a>
        ) : (
          <Button variant="primary" disabled>
            Baixar imagem
          </Button>
        )}
      </div>
    </dialog>
  );
};
