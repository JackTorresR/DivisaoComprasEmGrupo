import { useState, type FormEvent } from 'react';
import { validatePersonName } from '../../domain/validation/person';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../common/Button';
import { TextField } from '../common/TextField';

export const AddPersonForm = () => {
  const people = useAppStore((state) => state.people);
  const addPerson = useAppStore((state) => state.addPerson);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const message = validatePersonName(name, people);
    setError(message);
    if (message) return;
    addPerson(name);
    setName('');
  };

  return (
    <form className="inline-form" onSubmit={handleSubmit} noValidate>
      <TextField
        label="Nome da pessoa"
        hideLabel
        placeholder="Nome da pessoa"
        value={name}
        error={error}
        onChange={(event) => setName(event.target.value)}
        autoComplete="off"
      />
      <Button type="submit" variant="primary">
        + Adicionar pessoa
      </Button>
    </form>
  );
};
