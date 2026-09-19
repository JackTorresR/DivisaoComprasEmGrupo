import type { Person } from '../types';

const normalizeName = (name: string) => name.trim().toLocaleLowerCase('pt-BR');

export const validatePersonName = (name: string, people: Person[], ignoredId?: string): string | null => {
  if (name.trim() === '') return 'Informe o nome da pessoa.';
  const isDuplicated = people.some(
    (person) => person.id !== ignoredId && normalizeName(person.name) === normalizeName(name),
  );
  return isDuplicated ? 'Já existe uma pessoa com esse nome.' : null;
};
