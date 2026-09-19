import { useState } from 'react';
import type { Person } from '../../domain/types';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../common/Button';
import { EditPersonForm } from './EditPersonForm';

type PersonCardProps = {
  person: Person;
};

export const PersonCard = ({ person }: PersonCardProps) => {
  const removePerson = useAppStore((state) => state.removePerson);
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <li className="person-card">
        <EditPersonForm person={person} onDone={() => setIsEditing(false)} />
      </li>
    );
  }

  return (
    <li className="person-card">
      <div className="person-card__identity">
        <span className="avatar" aria-hidden="true">
          {person.name.charAt(0).toLocaleUpperCase('pt-BR')}
        </span>
        <span className="person-card__name">{person.name}</span>
      </div>
      <div className="person-card__actions">
        <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
          Editar
        </Button>
        <Button size="sm" variant="ghost" onClick={() => removePerson(person.id)}>
          Remover
        </Button>
      </div>
    </li>
  );
};
