import { pluralize } from '../../utils/plural';
import { useAppStore } from '../../store/useAppStore';
import { EmptyState } from '../common/EmptyState';
import { Section } from '../common/Section';
import { AddPersonForm } from './AddPersonForm';
import { PersonCard } from './PersonCard';

export const PeopleSection = () => {
  const people = useAppStore((state) => state.people);

  return (
    <Section
      step="1"
      title="Pessoas"
      description="Quem vai participar da viagem e dividir as compras."
      actions={<span className="count-pill">{pluralize(people.length, 'pessoa', 'pessoas')}</span>}
    >
      <AddPersonForm />
      {people.length === 0 ? (
        <EmptyState
          title="Nenhuma pessoa cadastrada"
          description="Digite um nome acima para começar, ou carregue o exemplo no topo da página."
        />
      ) : (
        <ul className="person-grid">
          {people.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </ul>
      )}
    </Section>
  );
};
