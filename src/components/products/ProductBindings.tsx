import type { Binding, Person, Product } from '../../domain/types';
import { useAppStore } from '../../store/useAppStore';
import { LinkUnitsForm } from './LinkUnitsForm';

type ProductBindingsProps = {
  product: Product;
  productBindings: Binding[];
  people: Person[];
  availableUnits: number;
  isLinking: boolean;
  onLinkingDone: () => void;
};

export const ProductBindings = ({
  product,
  productBindings,
  people,
  availableUnits,
  isLinking,
  onLinkingDone,
}: ProductBindingsProps) => {
  const addBinding = useAppStore((state) => state.addBinding);
  const removeBinding = useAppStore((state) => state.removeBinding);

  const findPersonName = (personId: string) => people.find((person) => person.id === personId)?.name ?? '';

  const handleLink = (personId: string, quantity: number) => {
    addBinding(product.id, personId, quantity);
    onLinkingDone();
  };

  if (productBindings.length === 0 && !isLinking) return null;

  return (
    <div className="bindings">
      {productBindings.map((binding) => (
        <span key={binding.id} className="chip">
          <span aria-hidden="true">🔒</span>
          {findPersonName(binding.personId)} × {binding.quantity}
          <button
            type="button"
            className="chip__remove"
            aria-label={`Remover vínculo de ${findPersonName(binding.personId)} com ${product.name}`}
            onClick={() => removeBinding(binding.id)}
          >
            ×
          </button>
        </span>
      ))}
      {isLinking && (
        <LinkUnitsForm
          people={people}
          availableUnits={availableUnits}
          onSubmit={handleLink}
          onCancel={onLinkingDone}
        />
      )}
    </div>
  );
};
