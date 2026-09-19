export type Cents = number;

export type ParsedMoney = { ok: true; cents: Cents } | { ok: false; message: string };

const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const MONEY_PATTERN = /^\d+(\.\d{1,2})?$/;

const normalizeMoneyText = (text: string) => {
  const cleaned = text.replace(/R\$/gi, '').replace(/\s/g, '');
  return cleaned.includes(',') ? cleaned.replace(/\./g, '').replace(',', '.') : cleaned;
};

export const parseMoney = (text: string): ParsedMoney => {
  const normalized = normalizeMoneyText(text);
  if (normalized === '') return { ok: false, message: 'Informe o preço.' };
  if (normalized.startsWith('-')) return { ok: false, message: 'O preço não pode ser negativo.' };
  if (!MONEY_PATTERN.test(normalized)) return { ok: false, message: 'Use um valor válido, como 12,50.' };
  const [integerPart, decimalPart = ''] = normalized.split('.');
  return { ok: true, cents: Number(integerPart) * 100 + Number(decimalPart.padEnd(2, '0')) };
};

export const sumCents = (values: Cents[]): Cents => values.reduce((total, value) => total + value, 0);

export const formatMoney = (cents: Cents) => currencyFormatter.format(cents / 100);

export const formatMoneyPlain = (cents: Cents) => formatMoney(cents).replace(/\u00a0/g, ' ');

export const formatSignedMoney = (cents: Cents) => {
  if (cents === 0) return formatMoney(0);
  const sign = cents > 0 ? '+' : '-';
  return `${sign} ${formatMoney(Math.abs(cents))}`;
};

export const formatCentsForInput = (cents: Cents) => {
  const reais = Math.floor(cents / 100);
  const remainder = String(cents % 100).padStart(2, '0');
  return `${reais},${remainder}`;
};
