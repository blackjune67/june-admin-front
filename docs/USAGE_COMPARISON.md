# 재고 사용량 비교 기능 문서

## 개요

당월/전월 엑셀 파일을 업로드하면 카테고리별 재고 사용량을 자동으로 비교해주는 기능입니다.
기존에 엑셀에서 수동으로 수행하던 `SUMIF` 계산을 브라우저 내에서 자동 처리합니다.

---

## 관련 파일

```
src/
├── types/comparison.ts              # 타입 정의
├── utils/excelParser.ts             # 엑셀 파싱 로직
├── utils/calculator.ts              # SUMIF 계산 로직
├── stores/useComparisonStore.ts     # Zustand 상태 관리
├── hooks/useExcelComparison.ts      # React Query mutation 훅
└── pages/Automation/
    └── UsageComparison.tsx          # 페이지 컴포넌트
```

---

## 입력 파일 스펙

### 파일 형식

- 확장자: `.xlsx` 또는 `.xls`
- 당월 파일, 전월 파일 각각 1개씩 총 2개 업로드

### 필수 시트: `Summary(상세)`

파싱 시 `name.replace(/\s/g, '') === 'Summary(상세)'` 조건으로 매칭합니다.
시트명에 공백이 포함되어도 인식합니다. (예: `Summary (상세)` → 정상 인식)

### 선택 시트: `재고조정`

파싱 시 `name.replace(/\s/g, '') === '재고조정'` 조건으로 매칭합니다.
시트가 없는 경우 재고조정 금액을 0으로 처리합니다.

---

## 헤더 자동 감지 로직 (`excelParser.ts`)

엑셀 파일의 컬럼 구조가 바뀌어도 동적으로 헤더를 찾아 처리합니다.

### 1단계 — 헤더 행 위치 찾기

상위 10개 행을 순회하며 **`품목구분`** 또는 **`대분류`** 텍스트가 포함된 셀을 탐색합니다.
해당 셀이 있는 행이 헤더 행(`headerRowIndex`)으로 설정됩니다.

```
[행 0]  ...
[행 1]  ...
[행 2]  | 사용량 |       |       |  ← 병합 헤더 (상위 헤더 행)
[행 3]  | 품목구분 | 사용금액 | ...  |  ← headerRowIndex = 3
[행 4~] 실제 데이터
```

헤더 행을 찾지 못하면 기본 컬럼 인덱스(하단 참고)를 사용합니다.

### 2단계 — 카테고리 열 찾기

헤더 행 기준 위 3개 행까지 포함한 구간에서 **`품목구분`** 또는 **`대분류`** 텍스트로 열 인덱스를 탐색합니다.

기본값: 인덱스 `1` (B열)

### 3단계 — 금액 열 찾기

시트 타입에 따라 탐색 방식이 다릅니다.

#### Summary(상세) 시트

우선순위 순으로 탐색합니다:

1. **`사용금액`** 또는 **`사용 금액`** 텍스트로 직접 탐색
2. 없을 경우 — `사용량` 또는 `사용` 섹션 헤더를 먼저 찾은 뒤, 해당 열에서 우측으로 최대 5열 내 **`금액`** 텍스트 탐색

기본값: 인덱스 `17` (R열)

#### 재고조정 시트

**`금액`** 텍스트로 직접 탐색합니다.

기본값: 인덱스 `5` (F열)

### 4단계 — 데이터 추출

`headerRowIndex + 1` 부터 끝까지를 실제 데이터 행으로 사용합니다.

---

## 계산 로직 (`calculator.ts`)

### 대상 카테고리 (6개)

| 순번 | 카테고리 |
|------|---------|
| 1 | 기공료 |
| 2 | 임플란트 |
| 3 | 치과재료 |
| 4 | 기공재료 |
| 5 | 의약품 |
| 6 | 소모품 |

카테고리 매칭 시 셀 값의 앞뒤 공백은 `trim()`으로 제거 후 비교합니다.

### SUMIF 구현

엑셀의 `SUMIF` 함수를 JavaScript로 재현합니다.

```
SUMIF(카테고리열, 카테고리명, 금액열)
```

데이터 행을 순회하며 **카테고리열의 값이 대상 카테고리명과 일치**하는 행의 **금액열 값을 합산**합니다.
`null`, `undefined`, 빈 문자열, `NaN`, `Infinity`는 0으로 처리합니다.

### 카테고리별 계산 공식

| 항목 | 공식 | 원본 엑셀 공식 |
|------|------|---------------|
| 당월 사용량 | `SUMIF(당월Summary, 카테고리, 금액열)` | `=SUMIF(당월DB_상세!$B:$B, 카테고리, 당월DB_상세!$R:$R)` |
| 당월 재고조정 | `SUMIF(당월재고조정, 카테고리, 금액열)` | `=SUMIF(당월DB_재고조정!$B:$B, 카테고리, 당월DB_재고조정!$F:$F)` |
| 당월 소계 | `당월 사용량 - 당월 재고조정` | `=+D6-E6` |
| 전월 사용량 | `SUMIF(전월Summary, 카테고리, 금액열)` | `=SUMIF(전월DB_상세!$B:$B, 카테고리, 전월DB_상세!$R:$R)` |
| 전월 재고조정 | `SUMIF(전월재고조정, 카테고리, 금액열)` | `=SUMIF(전월DB_재고조정!$B:$B, 카테고리, 전월DB_재고조정!$F:$F)` |
| 전월 소계 | `전월 사용량 - 전월 재고조정` | `=+G6-H6` |
| 증감 | `당월 소계 - 전월 소계` | `=+F6-I6` |

### 합계 및 요약 계산

| 항목 | 공식 | 원본 엑셀 공식 |
|------|------|---------------|
| 당월 합계 | 6개 카테고리 당월 소계의 합 | `=SUM(F6:F11)` |
| 전월 합계 | 6개 카테고리 전월 소계의 합 | `=SUM(I6:I11)` |
| 의약품+소모품 증감 합계 | 의약품 증감 + 소모품 증감 | `=+J10+J11` |

---

## 결과 테이블 구조

| 카테고리 | 당월 사용량 | 당월 재고조정 | 당월 소계 | 전월 사용량 | 전월 재고조정 | 전월 소계 | 증감 |
|---------|-----------|------------|---------|-----------|------------|---------|------|
| 기공료 | | | | | | | |
| 임플란트 | | | | | | | |
| 치과재료 | | | | | | | |
| 기공재료 | | | | | | | |
| 의약품 | | | | | | | |
| 소모품 | | | | | | | |
| **합계** | | | **합계** | | | **합계** | **합계** |

증감 표시 색상:
- **양수 (증가)**: 빨강 (`text-error-500`)
- **음수 (감소)**: 파랑/브랜드 색상 (`text-brand-500`)
- **0**: 기본 색상 (gray)

숫자 포맷: `toLocaleString('ko-KR')` (천 단위 콤마 적용)

---

## 데이터 흐름

```
사용자 파일 선택 (당월 / 전월)
        ↓
useComparisonStore (Zustand)
  currentFile / previousFile 저장
        ↓
"비교 계산 실행" 버튼 클릭
        ↓
useExcelComparison (React Query useMutation)
        ↓
parseExcelFile() × 2  [병렬 실행]
  ├── FileReader로 바이너리 읽기
  ├── XLSX.read() → workbook
  ├── Summary(상세) 시트 파싱 → processSheetData('summary')
  └── 재고조정 시트 파싱 → processSheetData('adjustment')
        ↓
calculateComparison(당월Summary, 당월재고조정, 전월Summary, 전월재고조정)
  └── 6개 카테고리 × sumif() 계산
        ↓
useComparisonStore → setResult()
        ↓
UsageComparison 페이지 결과 테이블 렌더링
```

---

## 향후 백엔드 연동 계획

현재는 브라우저 로컬 연산만 수행하며 데이터를 저장하지 않습니다.
백엔드 연동 시 `src/hooks/useExcelComparison.ts`의 `mutationFn` 내부를 수정합니다.

### 예상 연동 방식

```typescript
// 방식 1: 계산 결과를 서버에 저장
mutationFn: async ({ currentFile, previousFile }) => {
  const result = await localCalculate(currentFile, previousFile); // 기존 로직 유지
  await api.post('/api/v1/usage-comparison', result);             // 결과 저장
  return result;
}

// 방식 2: 서버에서 파일 파싱 및 계산 처리
mutationFn: async ({ currentFile, previousFile }) => {
  const formData = new FormData();
  formData.append('current', currentFile);
  formData.append('previous', previousFile);
  return api.post('/api/v1/usage-comparison/calculate', formData);
}
```
