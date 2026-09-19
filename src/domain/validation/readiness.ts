export const validateReadyToCalculate = (peopleCount: number, productCount: number): string | null => {
  if (peopleCount === 0) return 'Cadastre ao menos uma pessoa para calcular a distribuição.';
  if (productCount === 0) return 'Cadastre ao menos um produto para calcular a distribuição.';
  return null;
};
