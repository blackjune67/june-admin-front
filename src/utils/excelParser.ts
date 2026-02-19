import * as XLSX from 'xlsx';
import type { SheetData, ProcessedSheet, ColumnIndices } from '../types/comparison';

function findColumnIndex(headerRows: any[][], searchTerms: string[]): number {
  for (const row of headerRows) {
    if (!Array.isArray(row)) continue;
    for (let colIdx = 0; colIdx < row.length; colIdx++) {
      const cell = row[colIdx];
      if (typeof cell === 'string') {
        const cellText = cell.replace(/\s/g, '');
        for (const term of searchTerms) {
          const searchText = term.replace(/\s/g, '');
          if (cellText.includes(searchText)) {
            return colIdx;
          }
        }
      }
    }
  }
  return -1;
}

function findUsageAmountColumn(headerRows: any[][]): number {
  let usageSectionStart = -1;
  for (const row of headerRows) {
    if (!Array.isArray(row)) continue;
    for (let colIdx = 0; colIdx < row.length; colIdx++) {
      const cell = row[colIdx];
      if (typeof cell === 'string') {
        const cellText = cell.replace(/\s/g, '');
        if (cellText.includes('사용량') || cellText === '사용') {
          usageSectionStart = colIdx;
          break;
        }
      }
    }
    if (usageSectionStart !== -1) break;
  }

  if (usageSectionStart !== -1) {
    for (const row of headerRows) {
      if (!Array.isArray(row)) continue;
      for (
        let colIdx = usageSectionStart;
        colIdx < Math.min(usageSectionStart + 5, row.length);
        colIdx++
      ) {
        const cell = row[colIdx];
        if (typeof cell === 'string') {
          const cellText = cell.replace(/\s/g, '');
          if (cellText.includes('금액')) {
            return colIdx;
          }
        }
      }
    }
  }
  return -1;
}

function processSheetData(rawData: any[][], sheetType: 'summary' | 'adjustment'): ProcessedSheet {
  let headerRowIndex = -1;

  for (let i = 0; i < Math.min(10, rawData.length); i++) {
    const row = rawData[i];
    if (Array.isArray(row)) {
      const catIndex = row.findIndex(
        (cell) =>
          typeof cell === 'string' &&
          (cell.includes('품목구분') || cell.includes('대분류')),
      );
      if (catIndex !== -1) {
        headerRowIndex = i;
        break;
      }
    }
  }

  const columns: ColumnIndices = {
    categoryCol: 1,
    amountCol: sheetType === 'summary' ? 17 : 5,
  };

  if (headerRowIndex === -1) {
    return { data: rawData, columns };
  }

  const headerRows = rawData.slice(Math.max(0, headerRowIndex - 3), headerRowIndex + 1);

  const categoryCol = findColumnIndex(headerRows, ['품목구분', '대분류']);
  if (categoryCol !== -1) {
    columns.categoryCol = categoryCol;
  }

  if (sheetType === 'summary') {
    let amountCol = findColumnIndex(headerRows, ['사용금액', '사용 금액']);
    if (amountCol === -1) {
      amountCol = findUsageAmountColumn(headerRows);
    }
    if (amountCol !== -1) {
      columns.amountCol = amountCol;
    }
  } else {
    const amountCol = findColumnIndex(headerRows, ['금액']);
    if (amountCol !== -1) {
      columns.amountCol = amountCol;
    }
  }

  return {
    data: rawData.slice(headerRowIndex + 1),
    columns,
  };
}

export function parseExcelFile(file: File): Promise<SheetData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          reject(new Error('파일 읽기 실패: 데이터가 없습니다'));
          return;
        }

        const workbook = XLSX.read(data, { type: 'binary' });

        const summarySheetName = workbook.SheetNames.find(
          (name) => name.replace(/\s/g, '') === 'Summary(상세)',
        );

        if (!summarySheetName) {
          reject(
            new Error(
              '"Summary(상세)" 시트를 찾을 수 없습니다. 사용 가능한 시트: ' +
                workbook.SheetNames.join(', '),
            ),
          );
          return;
        }

        const adjustmentSheetName = workbook.SheetNames.find(
          (name) => name.replace(/\s/g, '') === '재고조정',
        );

        const summarySheet = workbook.Sheets[summarySheetName];
        const summaryRawData = XLSX.utils.sheet_to_json<(string | number)[]>(summarySheet, {
          header: 1,
        });

        let adjustmentRawData: (string | number)[][] = [];
        if (adjustmentSheetName) {
          const adjustmentSheet = workbook.Sheets[adjustmentSheetName];
          adjustmentRawData = XLSX.utils.sheet_to_json<(string | number)[]>(adjustmentSheet, {
            header: 1,
          });
        }

        const processedSummary = processSheetData(summaryRawData, 'summary');
        const processedAdjustment = processSheetData(adjustmentRawData, 'adjustment');

        resolve({ summary: processedSummary, adjustment: processedAdjustment });
      } catch (error) {
        reject(
          new Error(
            `엑셀 파일 파싱 실패: ${error instanceof Error ? error.message : String(error)}`,
          ),
        );
      }
    };

    reader.onerror = () => reject(new Error('파일 읽기 실패: FileReader 오류'));
    reader.readAsBinaryString(file);
  });
}
