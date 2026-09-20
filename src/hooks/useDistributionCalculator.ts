import { useCallback, useEffect, useRef, useState } from "react";
import { DURACAO_MINIMA_CALCULO_MS } from "../domain/distribution/settings";
import type {
  WorkerRequest,
  WorkerResponse,
} from "../domain/distribution/workerProtocol";
import { useAppStore } from "../store/useAppStore";

const CALCULATION_ERROR =
  "Não foi possível calcular a distribuição. Tente novamente.";

const INTERVALO_ATUALIZACAO_PROGRESSO_MS = 50;
const PROGRESSO_MAXIMO_ANTES_DE_CONCLUIR = 0.99;

const createDistributionWorker = () =>
  new Worker(
    new URL("../domain/distribution/distribution.worker.ts", import.meta.url),
    { type: "module" },
  );

type AguardarTempoRestanteProps = {
  tempoInicioMs: number;
};

const aguardarTempoRestante = (
  props: AguardarTempoRestanteProps,
): Promise<void> => {
  const { tempoInicioMs } = props;
  if (DURACAO_MINIMA_CALCULO_MS === null) return Promise.resolve();

  const tempoRestanteMs =
    DURACAO_MINIMA_CALCULO_MS - (Date.now() - tempoInicioMs);

  if (tempoRestanteMs <= 0) return Promise.resolve();

  return new Promise((resolve) => setTimeout(resolve, tempoRestanteMs));
};

type CalcularProgressoPorTempoProps = {
  tempoInicioMs: number;
  duracaoMinimaMs: number;
  calculoConcluido: boolean;
};

const calcularProgressoPorTempo = (
  props: CalcularProgressoPorTempoProps,
): number => {
  const { tempoInicioMs, duracaoMinimaMs, calculoConcluido } = props;
  const tempoDecorridoMs = Date.now() - tempoInicioMs;
  const proporcaoTempo = Math.min(tempoDecorridoMs / duracaoMinimaMs, 1);

  if (calculoConcluido) return proporcaoTempo;

  return Math.min(proporcaoTempo, PROGRESSO_MAXIMO_ANTES_DE_CONCLUIR);
};

export const useDistributionCalculator = (onCompleted: () => void) => {
  const tempoInicioRef = useRef(0);
  const tokenExecucaoAtualRef = useRef(0);
  const calculoConcluidoRef = useRef(false);
  const workerRef = useRef<Worker | null>(null);
  const [error, setError] = useState<string | null>(null);
  const intervaloProgressoRef = useRef<number | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const setAssignments = useAppStore((state) => state.setAssignments);

  const pararTickerDeProgresso = useCallback(() => {
    if (intervaloProgressoRef.current === null) return;
    window.clearInterval(intervaloProgressoRef.current);
    intervaloProgressoRef.current = null;
  }, []);

  const stop = useCallback(() => {
    tokenExecucaoAtualRef.current += 1;
    workerRef.current?.terminate();
    workerRef.current = null;
    pararTickerDeProgresso();
    setProgress(null);
  }, [pararTickerDeProgresso]);

  const iniciarTickerDeProgresso = useCallback(() => {
    if (DURACAO_MINIMA_CALCULO_MS === null) return;
    const duracaoMinimaMs = DURACAO_MINIMA_CALCULO_MS;

    pararTickerDeProgresso();
    intervaloProgressoRef.current = window.setInterval(() => {
      setProgress(
        calcularProgressoPorTempo({
          duracaoMinimaMs,
          tempoInicioMs: tempoInicioRef.current,
          calculoConcluido: calculoConcluidoRef.current,
        }),
      );
    }, INTERVALO_ATUALIZACAO_PROGRESSO_MS);
  }, [pararTickerDeProgresso]);

  const calculate = useCallback(() => {
    const { people, products, bindings } = useAppStore.getState();
    stop();
    setError(null);
    setProgress(0);
    calculoConcluidoRef.current = false;
    tempoInicioRef.current = Date.now();
    const tokenDestaExecucao = tokenExecucaoAtualRef.current;

    const worker = createDistributionWorker();
    workerRef.current = worker;
    iniciarTickerDeProgresso();

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      if (event.data.type === "progress") {
        if (DURACAO_MINIMA_CALCULO_MS === null) {
          setProgress(event.data.progress);
        }
        return;
      }
      const { assignments } = event.data;
      calculoConcluidoRef.current = true;
      aguardarTempoRestante({ tempoInicioMs: tempoInicioRef.current }).then(
        () => {
          if (tokenExecucaoAtualRef.current !== tokenDestaExecucao) return;
          setAssignments(assignments);
          stop();
          onCompleted();
        },
      );
    };
    worker.onerror = () => {
      if (tokenExecucaoAtualRef.current !== tokenDestaExecucao) return;
      setError(CALCULATION_ERROR);
      stop();
    };
    worker.postMessage({ people, products, bindings } satisfies WorkerRequest);
  }, [iniciarTickerDeProgresso, onCompleted, setAssignments, stop]);

  useEffect(() => stop, [stop]);

  return {
    error,
    calculate,
    cancel: stop,
    progress: progress ?? 0,
    isCalculating: progress !== null,
  };
};
