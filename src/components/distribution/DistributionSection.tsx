import { formatMoney } from '../../domain/money/money';
import { useTripData } from '../../hooks/useTripData';
import { useAppStore } from '../../store/useAppStore';
import { buildDistributionText } from '../../utils/exportText';
import { Button } from '../common/Button';
import { CopyButton } from '../common/CopyButton';
import { EmptyState } from '../common/EmptyState';
import { Section } from '../common/Section';
import { LockedUnitsPanel } from './LockedUnitsPanel';
import { ManualAdjustment } from './ManualAdjustment';
import { PersonShareCard } from './PersonShareCard';

type DistributionSectionProps = {
  isCalculating: boolean;
  canCalculate: boolean;
  onCalculate: () => void;
};

export const DistributionSection = ({ isCalculating, canCalculate, onCalculate }: DistributionSectionProps) => {
  const { people, products, bindings, assignments, units, summary, shares } = useTripData();
  const reassignUnit = useAppStore((state) => state.reassignUnit);

  return (
    <Section
      id="distribution"
      step="3"
      title="Distribuição"
      description="Quem fica responsável por comprar e pagar cada produto."
      actions={
        shares && (
          <>
            <Button disabled={isCalculating} onClick={onCalculate}>
              ↻ Recalcular distribuição
            </Button>
            <CopyButton label="Copiar para WhatsApp" getText={() => buildDistributionText(shares, summary)} />
          </>
        )
      }
    >
      {!shares || !assignments ? (
        <EmptyState
          title="Nenhuma distribuição calculada"
          description="Cadastre pessoas e produtos e clique em Calcular distribuição. Sempre que você alterar os dados, o cálculo precisa ser refeito."
          action={
            <Button variant="primary" disabled={!canCalculate || isCalculating} onClick={onCalculate}>
              Calcular distribuição
            </Button>
          }
        />
      ) : (
        <>
          <p className="distribution__reference">
            Média por pessoa: <strong className="money">{formatMoney(summary.averageCents)}</strong>
          </p>
          <div className="share-grid">
            {shares.map((share) => (
              <PersonShareCard key={share.person.id} share={share} averageCents={summary.averageCents} />
            ))}
          </div>
          <LockedUnitsPanel people={people} products={products} bindings={bindings} />
          <ManualAdjustment units={units} people={people} assignments={assignments} onReassign={reassignUnit} />
        </>
      )}
    </Section>
  );
};
