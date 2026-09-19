import { useState } from 'react';
import { countAvailableUnits, countBoundUnits } from '../../domain/calculations/bindings';
import { formatCentsForInput, formatMoney } from '../../domain/money/money';
import type { Binding, Person, Product } from '../../domain/types';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../common/Button';
import { ProductBindings } from './ProductBindings';
import { ProductForm } from './ProductForm';

type ProductItemProps = {
  product: Product;
  bindings: Binding[];
  people: Person[];
};

export const ProductItem = ({ product, bindings, people }: ProductItemProps) => {
  const updateProduct = useAppStore((state) => state.updateProduct);
  const removeProduct = useAppStore((state) => state.removeProduct);
  const [isEditing, setIsEditing] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const availableUnits = countAvailableUnits(product, bindings);
  const canLink = people.length > 0 && availableUnits > 0;

  if (isEditing) {
    return (
      <li className="product-item">
        <ProductForm
          initialValues={{
            name: product.name,
            quantity: String(product.quantity),
            price: formatCentsForInput(product.unitPriceCents),
            unit: product.unit,
          }}
          minimumQuantity={Math.max(1, countBoundUnits(product.id, bindings))}
          submitLabel="Salvar"
          onSubmit={(draft) => {
            updateProduct(product.id, draft);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      </li>
    );
  }

  return (
    <li className="product-item">
      <div className="product-row">
        <div className="product-row__name">
          <span className="product-row__title">{product.name}</span>
          {product.unit && <span className="product-row__unit">{product.unit}</span>}
        </div>
        <div className="product-row__cell" data-label="Quantidade">
          {product.quantity}
        </div>
        <div className="product-row__cell money" data-label="Preço unitário">
          {formatMoney(product.unitPriceCents)}
        </div>
        <div className="product-row__cell money" data-label="Total">
          {formatMoney(product.unitPriceCents * product.quantity)}
        </div>
        <div className="product-row__actions">
          <Button
            size="sm"
            variant="ghost"
            disabled={!canLink}
            title={canLink ? undefined : 'Cadastre pessoas e deixe unidades livres para vincular'}
            onClick={() => setIsLinking(true)}
          >
            🔒 Vincular
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
            Editar
          </Button>
          <Button size="sm" variant="ghost" onClick={() => removeProduct(product.id)}>
            Remover
          </Button>
        </div>
      </div>
      <ProductBindings
        product={product}
        productBindings={bindings.filter((binding) => binding.productId === product.id)}
        people={people}
        availableUnits={availableUnits}
        isLinking={isLinking}
        onLinkingDone={() => setIsLinking(false)}
      />
    </li>
  );
};
