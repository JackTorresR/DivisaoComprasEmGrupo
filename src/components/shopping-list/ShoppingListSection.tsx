import { useMemo } from 'react';
import { buildShoppingList } from '../../domain/calculations/shoppingList';
import { useAppStore } from '../../store/useAppStore';
import { buildShoppingListText } from '../../utils/exportText';
import { CopyButton } from '../common/CopyButton';
import { EmptyState } from '../common/EmptyState';
import { Section } from '../common/Section';

export const ShoppingListSection = () => {
  const products = useAppStore((state) => state.products);
  const items = useMemo(() => buildShoppingList(products), [products]);

  return (
    <Section
      title="Lista de compras"
      description="Tudo o que precisa ser comprado, independente de quem ficar responsável."
      actions={<CopyButton label="Copiar lista" getText={() => buildShoppingListText(items)} disabled={items.length === 0} />}
    >
      {items.length === 0 ? (
        <EmptyState title="A lista está vazia" description="Os produtos cadastrados aparecem aqui automaticamente." />
      ) : (
        <ul className="shopping-list">
          {items.map((item) => (
            <li key={item.id} className="shopping-list__item">
              <span>{item.label}</span>
              <span className="shopping-list__leader" aria-hidden="true" />
              <span className="shopping-list__quantity">{item.quantity}</span>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
};
