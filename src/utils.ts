let _latestId = 0;

/**
 * Gets a unique id as an integer.
 * @returns Returns a unique id.
 */
export function getUniqueId(): number {
  return ++_latestId;
}