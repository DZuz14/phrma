/**
 * Splits an array into chunks of specified size
 * @param arr The array to split into chunks
 * @param size The size of each chunk
 * @returns Array of arrays, where each inner array has the specified size
 */
export const chunk = <T>(arr: T[], size: number): T[][] => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
};

/**
 * Determines the appropriate chunk size based on screen width
 * @param width The current screen width in pixels
 * @returns The number of items per chunk based on screen size
 */
export const getChunkSize = (width: number): number => {
  if (width < 640) return 2; // Mobile
  if (width < 1024) return 3; // Tablet
  return 4; // Desktop
};
