export class ServiceUtils {
  static validatePagination(page: number, limit: number): void {
    if (page < 1) throw new Error('Page must be greater than 0');
    if (limit < 1 || limit > 100)
      throw new Error('Limit must be between 1 and 100');
  }

  /**
   * Sanitize search input
   */
  static sanitizeSearch(search: string | undefined): string | undefined {
    if (!search) return undefined;
    return search.trim().slice(0, 100);
  }

  /**
   * Validate UUID format
   */
  static isValidUUID(uuid: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Calculate percentage safely
   */
  static calculatePercentage(part: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((part / total) * 100 * 100) / 100;
  }
}
