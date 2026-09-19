import { useCallback, useEffect, useRef, useState } from 'react';
import type { WorkerRequest, WorkerResponse } from '../domain/distribution/workerProtocol';
import { useAppStore } from '../store/useAppStore';

const CALCULATION_ERROR = 'Não foi possível calcular a distribuição. Tente novamente.';

const createDistributionWorker = () =>
  new Worker(new URL('../domain/distribution/distribution.worker.ts', import.meta.url), { type: 'module' });

export const useDistributionCalculator = (onCompleted: () => void) => {
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const setAssignments = useAppStore((state) => state.setAssignments);

  const stop = useCallback(() => {
    workerRef.current?.terminate();
    workerRef.current = null;
    setProgress(null);
  }, []);

  const calculate = useCallback(() => {
    const { people, products, bindings } = useAppStore.getState();
    stop();
    setError(null);
    setProgress(0);

    const worker = createDistributionWorker();
    workerRef.current = worker;
    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      if (event.data.type === 'progress') {
        setProgress(event.data.progress);
        return;
      }
      setAssignments(event.data.assignments);
      stop();
      onCompleted();
    };
    worker.onerror = () => {
      setError(CALCULATION_ERROR);
      stop();
    };
    worker.postMessage({ people, products, bindings } satisfies WorkerRequest);
  }, [onCompleted, setAssignments, stop]);

  useEffect(() => stop, [stop]);

  return { isCalculating: progress !== null, progress: progress ?? 0, error, calculate, cancel: stop };
};
