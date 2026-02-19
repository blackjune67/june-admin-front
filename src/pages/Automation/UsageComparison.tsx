import { useCallback, useRef } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { useComparisonStore } from "../../stores/useComparisonStore";
import { useExcelComparison } from "../../hooks/useExcelComparison";
import type { CategoryData } from "../../types/comparison";

function formatNumber(value: number): string {
  return value.toLocaleString("ko-KR");
}

function DifferenceCell({ value }: { value: number }) {
  if (value > 0) {
    return (
      <span className="font-medium text-error-500">+{formatNumber(value)}</span>
    );
  }
  if (value < 0) {
    return (
      <span className="font-medium text-brand-500">{formatNumber(value)}</span>
    );
  }
  return <span className="text-gray-500 dark:text-gray-400">0</span>;
}

interface FileDropZoneProps {
  label: string;
  file: { name: string } | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
}

function FileDropZone({ label, file, onFileSelect, onFileRemove }: FileDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected) onFileSelect(selected);
      if (inputRef.current) inputRef.current.value = "";
    },
    [onFileSelect],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const dropped = e.dataTransfer.files[0];
      if (dropped) onFileSelect(dropped);
    },
    [onFileSelect],
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>
      {file ? (
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-2 min-w-0">
            <svg
              className="size-5 shrink-0 text-brand-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
            <span className="truncate text-sm text-gray-700 dark:text-gray-200">
              {file.name}
            </span>
          </div>
          <button
            onClick={onFileRemove}
            className="ml-2 shrink-0 rounded-md p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            aria-label="파일 삭제"
          >
            <svg
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 p-8 transition-colors hover:border-brand-500 dark:border-gray-700 dark:hover:border-brand-500"
        >
          <svg
            className="mb-2 size-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            클릭하거나 드래그하여 파일 업로드
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">.xlsx, .xls</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}

export default function UsageComparison() {
  const {
    currentFile,
    previousFile,
    result,
    error,
    setCurrentFile,
    setPreviousFile,
    setResult,
    setError,
    setIsLoading,
    reset,
  } = useComparisonStore();

  const { mutate, isPending } = useExcelComparison();

  const handleCompare = () => {
    if (!currentFile || !previousFile) return;

    setIsLoading(true);
    setError(null);

    mutate(
      { currentFile: currentFile.file, previousFile: previousFile.file },
      {
        onSuccess: (data) => {
          setResult(data);
          setIsLoading(false);
        },
        onError: (err) => {
          setError(err.message);
          setIsLoading(false);
        },
      },
    );
  };

  const canCompare = !!currentFile && !!previousFile && !isPending;

  const totalDifference = result
    ? result.categories.reduce((sum, cat) => sum + cat.difference, 0)
    : 0;

  return (
    <>
      <PageMeta
        title="재고 사용량 비교"
        description="당월/전월 엑셀 파일을 업로드하여 재고 사용량을 비교합니다"
      />
      <PageBreadcrumb pageTitle="재고 사용량 비교" />

      <div className="space-y-6">
        {/* 파일 업로드 카드 */}
        <ComponentCard
          title="엑셀 파일 업로드"
          desc="당월과 전월 엑셀 파일을 업로드하면 재고 사용량을 자동으로 비교합니다"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FileDropZone
              label="당월"
              file={currentFile}
              onFileSelect={(file) =>
                setCurrentFile({ file, name: file.name, id: crypto.randomUUID() })
              }
              onFileRemove={() => setCurrentFile(null)}
            />
            <FileDropZone
              label="전월"
              file={previousFile}
              onFileSelect={(file) =>
                setPreviousFile({ file, name: file.name, id: crypto.randomUUID() })
              }
              onFileRemove={() => setPreviousFile(null)}
            />
          </div>

          <button
            onClick={handleCompare}
            disabled={!canCompare}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              <>
                <svg
                  className="size-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                계산 중...
              </>
            ) : (
              "비교 계산 실행"
            )}
          </button>
        </ComponentCard>

        {/* 에러 표시 */}
        {error && (
          <div className="rounded-xl border border-error-200 bg-error-50 p-4 text-sm text-error-700 dark:border-error-500/20 dark:bg-error-500/10 dark:text-error-400">
            <strong className="mr-1">오류:</strong>
            {error}
          </div>
        )}

        {/* 결과 테이블 */}
        {result && (
          <ComponentCard title="비교 결과">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th
                      rowSpan={2}
                      className="py-3 pr-4 text-left font-medium text-gray-500 dark:text-gray-400"
                    >
                      카테고리
                    </th>
                    <th
                      colSpan={3}
                      className="border-l border-gray-100 px-4 py-2 text-center font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300"
                    >
                      당월
                    </th>
                    <th
                      colSpan={3}
                      className="border-l border-gray-100 px-4 py-2 text-center font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300"
                    >
                      전월
                    </th>
                    <th
                      rowSpan={2}
                      className="border-l border-gray-100 py-3 pl-4 text-right font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400"
                    >
                      증감
                    </th>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="border-l border-gray-100 px-4 py-2 text-right text-xs font-medium text-gray-400 dark:border-gray-700 dark:text-gray-500">
                      사용량
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-400 dark:text-gray-500">
                      재고조정
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-400 dark:text-gray-500">
                      소계
                    </th>
                    <th className="border-l border-gray-100 px-4 py-2 text-right text-xs font-medium text-gray-400 dark:border-gray-700 dark:text-gray-500">
                      사용량
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-400 dark:text-gray-500">
                      재고조정
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-400 dark:text-gray-500">
                      소계
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.categories.map((cat: CategoryData) => (
                    <tr
                      key={cat.category}
                      className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/[0.02]"
                    >
                      <td className="py-3 pr-4 font-medium text-gray-800 dark:text-white/90">
                        {cat.category}
                      </td>
                      <td className="border-l border-gray-100 px-4 py-3 text-right text-gray-600 dark:border-gray-800 dark:text-gray-300">
                        {formatNumber(cat.currentUsage)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-300">
                        {formatNumber(cat.currentAdjustment)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-200">
                        {formatNumber(cat.currentSubtotal)}
                      </td>
                      <td className="border-l border-gray-100 px-4 py-3 text-right text-gray-600 dark:border-gray-800 dark:text-gray-300">
                        {formatNumber(cat.previousUsage)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-300">
                        {formatNumber(cat.previousAdjustment)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-200">
                        {formatNumber(cat.previousSubtotal)}
                      </td>
                      <td className="border-l border-gray-100 py-3 pl-4 text-right dark:border-gray-800">
                        <DifferenceCell value={cat.difference} />
                      </td>
                    </tr>
                  ))}

                  {/* 합계 행 */}
                  <tr className="border-t-2 border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-white/[0.03]">
                    <td className="py-3 pr-4 font-bold text-gray-800 dark:text-white/90">
                      합계
                    </td>
                    <td className="border-l border-gray-200 px-4 py-3 text-right dark:border-gray-700" />
                    <td className="px-4 py-3 text-right" />
                    <td className="px-4 py-3 text-right font-bold text-gray-800 dark:text-white/90">
                      {formatNumber(result.currentTotal)}
                    </td>
                    <td className="border-l border-gray-200 px-4 py-3 text-right dark:border-gray-700" />
                    <td className="px-4 py-3 text-right" />
                    <td className="px-4 py-3 text-right font-bold text-gray-800 dark:text-white/90">
                      {formatNumber(result.previousTotal)}
                    </td>
                    <td className="border-l border-gray-200 py-3 pl-4 text-right dark:border-gray-700">
                      <DifferenceCell value={totalDifference} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 하단 요약 */}
            <div className="mt-4 flex flex-col gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  의약품 + 소모품 증감 합계:{" "}
                </span>
                <DifferenceCell value={result.medicineConsumableSum} />
              </div>
              <button
                onClick={reset}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.05]"
              >
                초기화
              </button>
            </div>
          </ComponentCard>
        )}
      </div>
    </>
  );
}
