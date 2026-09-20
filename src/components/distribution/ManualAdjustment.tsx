import { formatMoney } from "../../domain/money/money";
import type { Assignments, Person, Unit } from "../../domain/types";
import { formatUnitLabel } from "../../utils/productLabel";
import { ScrollArea } from "../common/ScrollArea";

type ManualAdjustmentProps = {
  units: Unit[];
  people: Person[];
  assignments: Assignments;
  onReassign: (unitId: string, personId: string) => void;
};

export const ManualAdjustment = (props: ManualAdjustmentProps) => {
  const { units, people, onReassign, assignments } = props;

  return (
    <details className="manual">
      <summary className="manual__summary">Ajustar manualmente</summary>
      <p className="manual__description">
        Troque o responsável por uma unidade. Os totais são atualizados na hora,
        sem refazer o cálculo.
      </p>
      <ScrollArea label="Unidades e responsáveis" size="md">
        <ul className="manual__list">
          {units.map((unit) => {
            const label = formatUnitLabel(unit);
            const isLocked = unit.lockedPersonId !== null;
            return (
              <li key={unit.id} className="manual__row">
                <span className="manual__label">
                  {isLocked && <span aria-hidden="true">🔒 </span>}
                  {label}
                </span>
                <span className="manual__price money">
                  {formatMoney(unit.priceCents)}
                </span>
                <select
                  className="field__input manual__select"
                  aria-label={`Responsável por ${label}`}
                  value={assignments[unit.id]}
                  disabled={isLocked}
                  onChange={(event) => onReassign(unit.id, event.target.value)}
                >
                  {people.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.name}
                    </option>
                  ))}
                </select>
              </li>
            );
          })}
        </ul>
      </ScrollArea>
    </details>
  );
};
