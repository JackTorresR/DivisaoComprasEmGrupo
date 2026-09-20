import { useAppStore } from "../../store/useAppStore";
import { pluralize } from "../../utils/plural";
import { EmptyState } from "../common/EmptyState";
import { ScrollArea } from "../common/ScrollArea";
import { Section } from "../common/Section";
import { AddPersonForm } from "./AddPersonForm";
import { PersonCard } from "./PersonCard";

export const PeopleSection = () => {
  const people = useAppStore((state) => state.people);

  return (
    <Section
      step="1"
      title="Pessoas"
      description="Quem vai participar da viagem e dividir as compras."
      actions={
        <span className="count-pill">
          {pluralize(people.length, "pessoa", "pessoas")}
        </span>
      }
    >
      <AddPersonForm />
      {people.length === 0 ? (
        <EmptyState
          title="Nenhuma pessoa cadastrada"
          description="Digite um nome acima para começar, ou carregue o exemplo no topo da página."
        />
      ) : (
        <ScrollArea label="Lista de pessoas" size="sm">
          <ul className="person-grid">
            {people.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </ul>
        </ScrollArea>
      )}
    </Section>
  );
};
