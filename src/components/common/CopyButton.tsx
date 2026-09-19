import { useEffect, useState } from 'react';
import { Button } from './Button';

type CopyButtonProps = {
  label: string;
  getText: () => string;
  disabled?: boolean;
};

type CopyStatus = 'idle' | 'copied' | 'failed';

const STATUS_LABELS: Record<CopyStatus, string | null> = {
  idle: null,
  copied: 'Copiado!',
  failed: 'Não foi possível copiar',
};

const FEEDBACK_DURATION_MS = 2500;

export const CopyButton = ({ label, getText, disabled }: CopyButtonProps) => {
  const [status, setStatus] = useState<CopyStatus>('idle');

  useEffect(() => {
    if (status === 'idle') return;
    const timer = setTimeout(() => setStatus('idle'), FEEDBACK_DURATION_MS);
    return () => clearTimeout(timer);
  }, [status]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(getText());
      setStatus('copied');
    } catch {
      setStatus('failed');
    }
  };

  return (
    <Button onClick={copy} disabled={disabled} aria-live="polite">
      {STATUS_LABELS[status] ?? label}
    </Button>
  );
};
