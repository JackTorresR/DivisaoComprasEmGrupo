import { useState } from "react";
import {
  EMPTY_SHARE_FILTER,
  filterShares,
} from "../../domain/calculations/shareFilter";
import { formatMoney } from "../../domain/money/money";
import { useTripData } from "../../hooks/useTripData";
import { useAppStore } from "../../store/useAppStore";
import { buildDistributionText } from "../../utils/exportText";
import { Button } from "../common/Button";
import { CopyButton } from "../common/CopyButton";
import { EmptyState } from "../common/EmptyState";
import { ScrollArea } from "../common/ScrollArea";
import { Section } from "../common/Section";
import { DistributionFilterBar } from "./DistributionFilterBar";
import { LockedUnitsPanel } from "./LockedUnitsPanel";
import { ManualAdjustment } from "./ManualAdjustment";
import { PersonShareCard } from "./PersonShareCard";

type DistributionSectionProps = {
  canCalculate: boolean;
  isCalculating: boolean;
  onCalculate: () => void;
};

export const DistributionSection = (props: DistributionSectionProps) => {
  const { onCalculate, canCalculate, isCalculating } = props;

  const { people, products, bindings, assignments, units, summary, shares } =
    useTripData();

  const resetFilter = () => setFilter(EMPTY_SHARE_FILTER);
  const [filter, setFilter] = useState(EMPTY_SHARE_FILTER);
  const visibleShares = shares ? filterShares(shares, filter) : [];
  const reassignUnit = useAppStore((state) => state.reassignUnit);

  return (
    <Section
      step="3"
      id="distribution"
      title="Distribuição"
      description="Quem fica responsável por comprar e pagar cada produto."
      actions={
        shares && (
          <>
            <Button disabled={isCalculating} onClick={onCalculate}>
              ↻ Recalcular distribuição
            </Button>
            <CopyButton
              label="Copiar para WhatsApp"
              onCopy={() =>
                navigator.clipboard.writeText(
                  buildDistributionText(shares, summary),
                )
              }
            />
          </>
        )
      }
    >
      {!shares || !assignments ? (
        <EmptyState
          title="Nenhuma distribuição calculada"
          description="Cadastre pessoas e produtos e clique em Calcular distribuição. Sempre que você alterar os dados, o cálculo precisa ser refeito."
          action={
            <Button
              variant="primary"
              onClick={onCalculate}
              disabled={!canCalculate || isCalculating}
            >
              Calcular distribuição
            </Button>
          }
        />
      ) : (
        <>
          <p className="distribution__reference">
            Média por pessoa:{" "}
            <strong className="money">
              {formatMoney(summary.averageCents)}
            </strong>
          </p>
          <DistributionFilterBar
            filter={filter}
            onChange={setFilter}
            onReset={resetFilter}
            totalCount={shares.length}
            resultCount={visibleShares.length}
          />
          {visibleShares.length === 0 ? (
            <EmptyState
              title="Nenhuma pessoa encontrada"
              description="Ninguém corresponde à busca ou ao filtro atual."
              action={<Button onClick={resetFilter}>Limpar filtros</Button>}
            />
          ) : (
            <ScrollArea label="Distribuição por pessoa" size="xl">
              <div className="share-grid">
                {visibleShares.map((share) => (
                  <PersonShareCard
                    share={share}
                    key={share.person.id}
                    averageCents={summary.averageCents}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
          <LockedUnitsPanel
            people={people}
            products={products}
            bindings={bindings}
          />
          <ManualAdjustment
            units={units}
            people={people}
            assignments={assignments}
            onReassign={reassignUnit}
          />
        </>
      )}
    </Section>
  );
};
