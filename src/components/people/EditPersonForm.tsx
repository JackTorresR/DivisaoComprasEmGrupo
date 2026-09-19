import { useState, type FormEvent } from 'react';
import type { Person } from '../../domain/types';
import { validatePersonName } from '../../domain/validation/person';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../common/Button';
import { TextField } from '../common/TextField';

type EditPersonFormProps = {
  person: Person;
  onDone: () => void;
};

export const EditPersonForm = ({ person, onDone }: EditPersonFormProps) => {
  const people = useAppStore((state) => state.people);
  const renamePerson = useAppStore((state) => state.renamePerson);
  const [name, setName] = useState(person.name);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const message = validatePersonName(name, people, person.id);
    setError(message);
    if (message) return;
    renamePerson(person.id, name);
    onDone();
  };

  return (
    <form className="person-card__edit" onSubmit={handleSubmit} noValidate>
      <TextField
        label={`Novo nome para ${person.name}`}
        hideLabel
        value={name}
        error={error}
        onChange={(event) => setName(event.target.value)}
        autoComplete="off"
        autoFocus
      />
      <div className="person-card__actions">
        <Button type="submit" size="sm" variant="primary">
          Salvar
        </Button>
        <Button size="sm" onClick={onDone}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};
