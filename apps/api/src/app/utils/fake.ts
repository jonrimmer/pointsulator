export const arrayOf: <T>(count: number, generator: () => T) => T[] = (
  count,
  generator
) => {
  return Array.from({ length: count }, generator);
};
