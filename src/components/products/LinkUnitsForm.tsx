import { useId, useState, type FormEvent } from 'react';
import type { Person } from '../../domain/types';
import { validateBindingQuantity } from '../../domain/validation/binding';
import { pluralize } from '../../utils/plural';
import { Button } from '../common/Button';
import { TextField } from '../common/TextField';

type LinkUnitsFormProps = {
  people: Person[];
  availableUnits: number;
  onSubmit: (personId: string, quantity: number) => void;
  onCancel: () => void;
};

export const LinkUnitsForm = ({ people, availableUnits, onSubmit, onCancel }: LinkUnitsFormProps) => {
  const personFieldId = useId();
  const [personId, setPersonId] = useState(people[0]?.id ?? '');
  const [quantity, setQuantity] = useState('1');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const result = validateBindingQuantity(quantity, availableUnits);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    onSubmit(personId, result.quantity);
  };

  return (
    <form className="link-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label className="field__label" htmlFor={personFieldId}>
          Responsável
        </label>
        <select
          id={personFieldId}
          className="field__input"
          value={personId}
          onChange={(event) => setPersonId(event.target.value)}
        >
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>
      </div>
      <TextField
        label="Unidades"
        type="number"
        min={1}
        step={1}
        inputMode="numeric"
        value={quantity}
        error={error}
        hint={`${pluralize(availableUnits, 'unidade disponível', 'unidades disponíveis')}`}
        onChange={(event) => setQuantity(event.target.value)}
      />
      <div className="link-form__actions">
        <Button type="submit" variant="primary" size="sm">
          Vincular
        </Button>
        <Button size="sm" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};
