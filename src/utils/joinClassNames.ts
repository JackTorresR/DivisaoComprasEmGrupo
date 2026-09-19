export const joinClassNames = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(' ');
