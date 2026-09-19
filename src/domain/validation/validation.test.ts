import { describe, expect, it } from 'vitest';
import { validateBindingQuantity } from './binding';
import { parseProductForm } from './product';

describe('validação de vínculos', () => {
  it('avisa quando há menos unidades disponíveis', () => {
    expect(validateBindingQuantity('3', 2)).toEqual({
      ok: false,
      message: 'Você tentou vincular 3 unidades, mas existem apenas 2 disponíveis.',
    });
  });

  it('aceita quantidade dentro do limite', () => {
    expect(validateBindingQuantity('2', 2)).toEqual({ ok: true, quantity: 2 });
  });

  it('recusa quantidade inválida', () => {
    expect(validateBindingQuantity('0', 2)).toMatchObject({ ok: false });
    expect(validateBindingQuantity('1,5', 2)).toMatchObject({ ok: false });
  });
});

describe('validação de produto', () => {
  const valid = { name: 'Arroz', quantity: '2', price: '5,00', unit: '' };

  it('converte um formulário válido', () => {
    expect(parseProductForm(valid)).toEqual({
      ok: true,
      draft: { name: 'Arroz', quantity: 2, unitPriceCents: 500, unit: '' },
    });
  });

  it('recusa nome vazio, quantidade zero e preço negativo', () => {
    const result = parseProductForm({ name: ' ', quantity: '0', price: '-1', unit: '' });
    expect(result).toMatchObject({ ok: false });
    if (!result.ok) expect(Object.keys(result.errors)).toEqual(['name', 'quantity', 'price']);
  });

  it('não deixa reduzir a quantidade abaixo do que está vinculado', () => {
    expect(parseProductForm({ ...valid, quantity: '1' }, 2)).toMatchObject({ ok: false });
  });
});
