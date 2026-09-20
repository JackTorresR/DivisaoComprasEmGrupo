export const buildTripUrl = (slug: string): string => {
  const base = import.meta.env.BASE_URL;
  const baseComBarra = base.endsWith("/") ? base : `${base}/`;
  return `${window.location.origin}${baseComBarra}${slug}`;
};
