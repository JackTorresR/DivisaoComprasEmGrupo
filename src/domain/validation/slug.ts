const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MIN_SLUG_LENGTH = 3;
const MAX_SLUG_LENGTH = 60;

export const normalizeSlug = (rawSlug: string): string =>
  rawSlug
    .trim()
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const validateSlugFormat = (slug: string): string | null => {
  if (slug.length < MIN_SLUG_LENGTH)
    return `O link precisa ter pelo menos ${MIN_SLUG_LENGTH} caracteres.`;

  if (slug.length > MAX_SLUG_LENGTH)
    return `O link pode ter no máximo ${MAX_SLUG_LENGTH} caracteres.`;

  if (!SLUG_PATTERN.test(slug))
    return "Use apenas letras minúsculas, números e hífen (ex.: mulungu-2026-09).";

  return null;
};
