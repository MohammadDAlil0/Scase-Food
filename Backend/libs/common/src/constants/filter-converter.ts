import { Op } from 'sequelize';

/**
 * Converts filter object to use Sequelize LIKE operators.
 * @param whereFilter - An object containing filters.
 * @returns A new object with LIKE conditions applied.
 */
export function convertFiltersToLike(whereFilter: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(whereFilter).map(([key, value]) => [
      key,
      { [Op.like]: `${value}%` }
    ])
  );
}
