export type BindingQuantityResult = { ok: true; quantity: number } | { ok: false; message: string };

const describeAvailability = (available: number) =>
  available === 1 ? 'existe apenas 1 disponível' : `existem apenas ${available} disponíveis`;

export const validateBindingQuantity = (text: string, available: number): BindingQuantityResult => {
  const quantity = Number(text);
  if (available <= 0) return { ok: false, message: 'Todas as unidades deste produto já estão vinculadas.' };
  if (text.trim() === '' || !Number.isInteger(quantity) || quantity <= 0) {
    return { ok: false, message: 'Informe uma quantidade inteira maior que zero.' };
  }
  if (quantity > available) {
    const noun = quantity === 1 ? 'unidade' : 'unidades';
    return {
      ok: false,
      message: `Você tentou vincular ${quantity} ${noun}, mas ${describeAvailability(available)}.`,
    };
  }
  return { ok: true, quantity };
};
