import { buildLockedSummaries } from '../../domain/calculations/lockedSummary';
import { formatMoney } from '../../domain/money/money';
import type { Binding, Person, Product } from '../../domain/types';
import { formatQuantityPrefix } from '../../utils/productLabel';

type LockedUnitsPanelProps = {
  people: Person[];
  products: Product[];
  bindings: Binding[];
};

export const LockedUnitsPanel = ({ people, products, bindings }: LockedUnitsPanelProps) => {
  const summaries = buildLockedSummaries(people, products, bindings);
  if (summaries.length === 0) return null;

  return (
    <div className="locked-panel">
      <h3 className="locked-panel__title">🔒 Produtos previamente vinculados</h3>
      <div className="locked-panel__people">
        {summaries.map((summary) => (
          <div key={summary.person.id} className="locked-panel__person">
            <p className="locked-panel__name">{summary.person.name}</p>
            <ul className="locked-panel__lines">
              {summary.lines.map((line) => (
                <li key={line.id}>
                  {formatQuantityPrefix(line.quantity) || '1× '}
                  {line.label}
                </li>
              ))}
            </ul>
            <p className="locked-panel__total money">{formatMoney(summary.totalCents)}</p>
          </div>
        ))}
      </div>
      <p className="locked-panel__note">Esses produtos não participaram da distribuição automática.</p>
    </div>
  );
};
