export const scrollToElement = (id: string) => {
  requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }));
};
