/**
 * 指定された日付の月の開始日（1日）を取得
 */
export function getMonthStartDate(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * 指定された日付の月の終了日（月末）を取得
 */
export function getMonthEndDate(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/**
 * 指定された月の予算期間を取得
 * @param year 年
 * @param month 月（1-12）
 */
export function getBudgetPeriod(year: number, month: number): { startDate: Date; endDate: Date } {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  return { startDate, endDate };
}

/**
 * 現在の月の予算期間を取得
 */
export function getCurrentMonthBudgetPeriod(): { startDate: Date; endDate: Date } {
  const now = new Date();
  return getBudgetPeriod(now.getFullYear(), now.getMonth() + 1);
} 