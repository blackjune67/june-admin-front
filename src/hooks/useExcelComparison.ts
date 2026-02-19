import { useMutation } from '@tanstack/react-query';
import { parseExcelFile } from '../utils/excelParser';
import { calculateComparison } from '../utils/calculator';
import type { ComparisonResult } from '../types/comparison';

interface ExcelComparisonParams {
  currentFile: File;
  previousFile: File;
}

export function useExcelComparison() {
  return useMutation<ComparisonResult, Error, ExcelComparisonParams>({
    mutationFn: async ({ currentFile, previousFile }) => {
      try {
        const [currentData, previousData] = await Promise.all([
          parseExcelFile(currentFile),
          parseExcelFile(previousFile),
        ]);
        return calculateComparison(
          currentData.summary,
          currentData.adjustment,
          previousData.summary,
          previousData.adjustment,
        );
      } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error(`엑셀 파일 비교 실패: ${String(error)}`);
      }
    },
  });
}
