import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { Button } from "./Button";
import { TextField } from "./TextField";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmacaoObrigatoria?: string;
};

export const ConfirmDialog = (props: ConfirmDialogProps) => {
  const {
    open,
    title,
    message,
    onCancel,
    onConfirm,
    confirmLabel,
    confirmacaoObrigatoria,
  } = props;

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [valorDigitado, setValorDigitado] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setValorDigitado("");
      dialog.showModal();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const handleCancel = (event: SyntheticEvent) => {
    event.preventDefault();
    onCancel();
  };

  const confirmacaoPendente =
    confirmacaoObrigatoria !== undefined &&
    valorDigitado !== confirmacaoObrigatoria;

  return (
    <dialog ref={dialogRef} className="dialog" onCancel={handleCancel}>
      <h2 className="dialog__title">{title}</h2>
      <p className="dialog__message">{message}</p>
      {confirmacaoObrigatoria !== undefined && (
        <TextField
          label={`Digite "${confirmacaoObrigatoria}" para confirmar`}
          value={valorDigitado}
          onChange={(event) => setValorDigitado(event.target.value)}
          className="dialog__confirmation-field"
        />
      )}
      <div className="dialog__actions">
        <Button onClick={onCancel}>Cancelar</Button>
        <Button
          variant="danger"
          onClick={onConfirm}
          disabled={confirmacaoPendente}
        >
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  );
};
