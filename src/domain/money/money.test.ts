import { describe, expect, it } from 'vitest';
import { formatCentsForInput, formatMoneyPlain, formatSignedMoney, parseMoney, sumCents } from './money';

describe('money', () => {
  it('soma centavos sem erro de ponto flutuante', () => {
    expect(formatMoneyPlain(sumCents([1010, 520]))).toBe('R$ 15,30');
    expect(sumCents([10, 20])).toBe(30);
  });

  it('converte texto para centavos', () => {
    expect(parseMoney('12,50')).toEqual({ ok: true, cents: 1250 });
    expect(parseMoney('R$ 1.234,5')).toEqual({ ok: true, cents: 123450 });
    expect(parseMoney('3')).toEqual({ ok: true, cents: 300 });
    expect(parseMoney('0,07')).toEqual({ ok: true, cents: 7 });
    expect(parseMoney('19.99')).toEqual({ ok: true, cents: 1999 });
  });

  it('recusa valores inválidos e negativos', () => {
    expect(parseMoney('')).toMatchObject({ ok: false });
    expect(parseMoney('-5')).toEqual({ ok: false, message: 'O preço não pode ser negativo.' });
    expect(parseMoney('abc')).toMatchObject({ ok: false });
    expect(parseMoney('1,234')).toMatchObject({ ok: false });
  });

  it('formata valores com sinal e para campos de texto', () => {
    expect(formatSignedMoney(144).replace(/\u00a0/g, ' ')).toBe('+ R$ 1,44');
    expect(formatSignedMoney(-200).replace(/\u00a0/g, ' ')).toBe('- R$ 2,00');
    expect(formatCentsForInput(1205)).toBe('12,05');
  });
});
