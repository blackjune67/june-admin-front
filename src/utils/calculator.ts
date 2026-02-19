import type { ComparisonResult, CategoryData, ProcessedSheet } from '../types/comparison';

export const CATEGORIES = [
  '기공료',
  '임플란트',
  '치과재료',
  '기공재료',
  '의약품',
  '소모품',
] as const;

export function sumif(
  data: any[][],
  colB: number,
  category: string,
  targetCol: number,
): number {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length <= Math.max(colB, targetCol)) continue;
    const categoryValue = row[colB];
    const targetValue = row[targetCol];
    const trimmedCategory =
      typeof categoryValue === 'string' ? categoryValue.trim() : categoryValue;
    if (trimmedCategory === category) {
      if (targetValue !== null && targetValue !== undefined && targetValue !== '') {
        const numValue = Number(targetValue);
        if (!isNaN(numValue) && isFinite(numValue)) {
          sum += numValue;
        }
      }
    }
  }
  return sum;
}

export function calculateComparison(
  currentSummary: ProcessedSheet,
  currentAdjustment: ProcessedSheet,
  previousSummary: ProcessedSheet,
  previousAdjustment: ProcessedSheet,
): ComparisonResult {
  const categories: CategoryData[] = [];

  for (const category of CATEGORIES) {
    const currentUsage = sumif(
      currentSummary.data,
      currentSummary.columns.categoryCol,
      category,
      currentSummary.columns.amountCol,
    );
    const currentAdjustmentValue = sumif(
      currentAdjustment.data,
      currentAdjustment.columns.categoryCol,
      category,
      currentAdjustment.columns.amountCol,
    );
    const currentSubtotal = currentUsage - currentAdjustmentValue;

    const previousUsage = sumif(
      previousSummary.data,
      previousSummary.columns.categoryCol,
      category,
      previousSummary.columns.amountCol,
    );
    const previousAdjustmentValue = sumif(
      previousAdjustment.data,
      previousAdjustment.columns.categoryCol,
      category,
      previousAdjustment.columns.amountCol,
    );
    const previousSubtotal = previousUsage - previousAdjustmentValue;

    const difference = currentSubtotal - previousSubtotal;

    categories.push({
      category,
      currentUsage,
      currentAdjustment: currentAdjustmentValue,
      currentSubtotal,
      previousUsage,
      previousAdjustment: previousAdjustmentValue,
      previousSubtotal,
      difference,
    });
  }

  const currentTotal = categories.reduce((sum, cat) => sum + cat.currentSubtotal, 0);
  const previousTotal = categories.reduce((sum, cat) => sum + cat.previousSubtotal, 0);

  const medicineCategory = categories.find((cat) => cat.category === '의약품');
  const consumableCategory = categories.find((cat) => cat.category === '소모품');
  const medicineConsumableSum =
    (medicineCategory?.difference || 0) + (consumableCategory?.difference || 0);

  return { categories, currentTotal, previousTotal, medicineConsumableSum };
}
