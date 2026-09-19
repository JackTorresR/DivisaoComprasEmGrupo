import { useEffect, useRef, type SyntheticEvent } from 'react';
import { Button } from './Button';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmDialog = ({ open, title, message, confirmLabel, onConfirm, onCancel }: ConfirmDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const handleCancel = (event: SyntheticEvent) => {
    event.preventDefault();
    onCancel();
  };

  return (
    <dialog ref={dialogRef} className="dialog" onCancel={handleCancel}>
      <h2 className="dialog__title">{title}</h2>
      <p className="dialog__message">{message}</p>
      <div className="dialog__actions">
        <Button onClick={onCancel}>Cancelar</Button>
        <Button variant="danger" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  );
};
