import type { ShoppingItem } from '../domain/calculations/shoppingList';
import type { PersonShare, TripSummary } from '../domain/calculations/summary';
import { groupUnitsByProduct, type UnitGroup } from '../domain/calculations/unitGroups';
import { formatMoneyPlain } from '../domain/money/money';
import { formatProductLabel, formatQuantityPrefix } from './productLabel';

const formatGroupLine = (group: UnitGroup) =>
  `- ${formatQuantityPrefix(group.quantity)}${formatProductLabel(group.name, group.unitLabel)}`;

const formatShareBlock = (share: PersonShare) =>
  [
    `${share.person.name} — ${formatMoneyPlain(share.totalCents)}`,
    ...groupUnitsByProduct(share.units).map(formatGroupLine),
  ].join('\n');

export const buildDistributionText = (shares: PersonShare[], summary: TripSummary) => {
  const totals = [
    `💰 Total: ${formatMoneyPlain(summary.totalCents)}`,
    `👥 Pessoas: ${summary.peopleCount}`,
    `📊 Média: ${formatMoneyPlain(summary.averageCents)}`,
  ].join('\n');
  return ['🛒 COMPRAS DA VIAGEM', ...shares.map(formatShareBlock), totals].join('\n\n');
};

export const buildShoppingListText = (items: ShoppingItem[]) => {
  const lines = items.map((item) => `- ${item.quantity}× ${item.label}`);
  return ['🛒 LISTA DE COMPRAS', lines.join('\n')].join('\n\n');
};
