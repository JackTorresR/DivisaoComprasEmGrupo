import { findLargestDifferenceCents } from '../../domain/calculations/summary';
import { formatMoney } from '../../domain/money/money';
import { validateReadyToCalculate } from '../../domain/validation/readiness';
import { useTripData } from '../../hooks/useTripData';
import { Button } from '../common/Button';

type SummaryPanelProps = {
  isCalculating: boolean;
  error: string | null;
  onCalculate: () => void;
};

type MetricProps = {
  label: string;
  value: string | number;
  emphasis?: boolean;
};

const Metric = ({ label, value, emphasis = false }: MetricProps) => (
  <div className={emphasis ? 'metric metric--emphasis' : 'metric'}>
    <dt className="metric__label">{label}</dt>
    <dd className="metric__value money">{value}</dd>
  </div>
);

export const SummaryPanel = ({ isCalculating, error, onCalculate }: SummaryPanelProps) => {
  const { summary, shares, people, products } = useTripData();
  const readinessMessage = validateReadyToCalculate(people.length, products.length);

  return (
    <section className="card summary" aria-labelledby="summary-title">
      <h2 id="summary-title" className="card__title">
        Resumo da viagem
      </h2>
      <dl className="metrics">
        <Metric label="Valor total" value={formatMoney(summary.totalCents)} emphasis />
        <Metric label="Média por pessoa" value={formatMoney(summary.averageCents)} emphasis />
        <Metric label="Pessoas" value={summary.peopleCount} />
        <Metric label="Total de produtos" value={summary.unitCount} />
        {shares && <Metric label="Maior diferença da média" value={formatMoney(findLargestDifferenceCents(shares))} />}
      </dl>
      <Button variant="primary" className="summary__button" disabled={Boolean(readinessMessage) || isCalculating} onClick={onCalculate}>
        {shares ? '↻ Recalcular distribuição' : 'Calcular distribuição'}
      </Button>
      {readinessMessage && <p className="summary__hint">{readinessMessage}</p>}
      {error && (
        <p className="field__message field__message--error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
};
