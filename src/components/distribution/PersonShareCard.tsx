import { groupUnitsByProduct } from '../../domain/calculations/unitGroups';
import type { PersonShare } from '../../domain/calculations/summary';
import { getDifferenceTone } from '../../domain/calculations/tone';
import { formatMoney, formatSignedMoney, type Cents } from '../../domain/money/money';
import { formatProductLabel, formatQuantityPrefix } from '../../utils/productLabel';
import { BalanceGauge } from './BalanceGauge';

type PersonShareCardProps = {
  share: PersonShare;
  averageCents: Cents;
};

export const PersonShareCard = ({ share, averageCents }: PersonShareCardProps) => {
  const tone = getDifferenceTone(share.differenceCents);
  const groups = groupUnitsByProduct(share.units);

  return (
    <article className="share-card">
      <header className="share-card__header">
        <h3 className="share-card__name">{share.person.name}</h3>
        <span className={`difference-chip difference-chip--${tone}`}>{formatSignedMoney(share.differenceCents)}</span>
      </header>
      <dl className="share-card__stats">
        <div className="share-card__stat share-card__stat--total">
          <dt>Total</dt>
          <dd className="money">{formatMoney(share.totalCents)}</dd>
        </div>
        <div className="share-card__stat">
          <dt>Média</dt>
          <dd className="money">{formatMoney(averageCents)}</dd>
        </div>
        <div className="share-card__stat">
          <dt>Diferença</dt>
          <dd className="money">{formatSignedMoney(share.differenceCents)}</dd>
        </div>
      </dl>
      <BalanceGauge differenceCents={share.differenceCents} averageCents={averageCents} />
      {groups.length === 0 ? (
        <p className="share-card__empty">Nenhum produto atribuído.</p>
      ) : (
        <ul className="unit-lines">
          {groups.map((group) => (
            <li key={group.key} className="unit-line">
              <span className="unit-line__mark" title={group.locked ? 'Vinculado previamente' : 'Distribuído'}>
                {group.locked ? '🔒' : '✓'}
              </span>
              <span className="unit-line__label">
                {formatQuantityPrefix(group.quantity)}
                {formatProductLabel(group.name, group.unitLabel)}
              </span>
              <span className="unit-line__price money">{formatMoney(group.totalCents)}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
};
