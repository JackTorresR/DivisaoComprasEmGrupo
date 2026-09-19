import { useState, type FormEvent } from 'react';
import {
  parseProductForm,
  type ProductDraft,
  type ProductFormErrors,
  type ProductFormValues,
} from '../../domain/validation/product';
import { Button } from '../common/Button';
import { TextField } from '../common/TextField';

type ProductFormProps = {
  initialValues?: ProductFormValues;
  minimumQuantity?: number;
  submitLabel: string;
  cancelLabel?: string;
  onSubmit: (draft: ProductDraft) => void;
  onCancel: () => void;
};

const EMPTY_VALUES: ProductFormValues = { name: '', quantity: '1', price: '', unit: '' };

export const ProductForm = ({
  initialValues = EMPTY_VALUES,
  minimumQuantity = 1,
  submitLabel,
  cancelLabel = 'Cancelar',
  onSubmit,
  onCancel,
}: ProductFormProps) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<ProductFormErrors>({});

  const updateValue = (field: keyof ProductFormValues, value: string) =>
    setValues((current) => ({ ...current, [field]: value }));

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const result = parseProductForm(values, minimumQuantity);
    if (result.ok) {
      onSubmit(result.draft);
      return;
    }
    setErrors(result.errors);
  };

  return (
    <form className="product-form" onSubmit={handleSubmit} noValidate>
      <TextField
        className="product-form__name"
        label="Produto"
        value={values.name}
        error={errors.name}
        onChange={(event) => updateValue('name', event.target.value)}
        autoComplete="off"
        autoFocus
      />
      <TextField
        label="Quantidade"
        type="number"
        min={minimumQuantity}
        step={1}
        inputMode="numeric"
        value={values.quantity}
        error={errors.quantity}
        onChange={(event) => updateValue('quantity', event.target.value)}
      />
      <TextField
        label="Preço unitário"
        inputMode="decimal"
        placeholder="0,00"
        value={values.price}
        error={errors.price}
        onChange={(event) => updateValue('price', event.target.value)}
        autoComplete="off"
      />
      <TextField
        label="Embalagem (opcional)"
        placeholder="Ex.: 8 un., 1 kg"
        value={values.unit}
        onChange={(event) => updateValue('unit', event.target.value)}
        autoComplete="off"
      />
      <div className="product-form__actions">
        <Button type="submit" variant="primary">
          {submitLabel}
        </Button>
        <Button onClick={onCancel}>{cancelLabel}</Button>
      </div>
    </form>
  );
};
