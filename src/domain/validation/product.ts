import { parseMoney, type Cents } from '../money/money';

export type ProductFormValues = {
  name: string;
  quantity: string;
  price: string;
  unit: string;
};

export type ProductDraft = {
  name: string;
  quantity: number;
  unitPriceCents: Cents;
  unit: string;
};

export type ProductFormErrors = Partial<Record<'name' | 'quantity' | 'price', string>>;

export type ProductFormResult =
  | { ok: true; draft: ProductDraft }
  | { ok: false; errors: ProductFormErrors };

const validateQuantity = (text: string, minimumQuantity: number) => {
  const quantity = Number(text);
  if (text.trim() === '' || !Number.isInteger(quantity) || quantity <= 0) {
    return { quantity, error: 'A quantidade deve ser um número inteiro maior que zero.' };
  }
  if (quantity < minimumQuantity) {
    return {
      quantity,
      error: `Existem ${minimumQuantity} unidades vinculadas. Remova o vínculo antes de reduzir a quantidade.`,
    };
  }
  return { quantity, error: null };
};

export const parseProductForm = (values: ProductFormValues, minimumQuantity = 1): ProductFormResult => {
  const quantityResult = validateQuantity(values.quantity, minimumQuantity);
  const priceResult = parseMoney(values.price);
  const errors: ProductFormErrors = {};

  if (values.name.trim() === '') errors.name = 'Informe o nome do produto.';
  if (quantityResult.error) errors.quantity = quantityResult.error;
  if (!priceResult.ok) errors.price = priceResult.message;

  if (Object.keys(errors).length > 0 || !priceResult.ok) return { ok: false, errors };

  return {
    ok: true,
    draft: {
      name: values.name.trim(),
      quantity: quantityResult.quantity,
      unitPriceCents: priceResult.cents,
      unit: values.unit.trim(),
    },
  };
};
