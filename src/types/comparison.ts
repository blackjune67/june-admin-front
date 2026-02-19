export interface CategoryData {
  category: string;
  currentUsage: number;
  currentAdjustment: number;
  currentSubtotal: number;
  previousUsage: number;
  previousAdjustment: number;
  previousSubtotal: number;
  difference: number;
}

export interface ComparisonResult {
  categories: CategoryData[];
  currentTotal: number;
  previousTotal: number;
  medicineConsumableSum: number;
}

export interface ColumnIndices {
  categoryCol: number;
  amountCol: number;
}

export interface ProcessedSheet {
  data: any[][];
  columns: ColumnIndices;
}

export interface SheetData {
  summary: ProcessedSheet;
  adjustment: ProcessedSheet;
}

export interface ExcelFile {
  file: File;
  name: string;
  id: string;
}
