import { create } from 'zustand';
import type { ExcelFile, ComparisonResult } from '../types/comparison';

interface ComparisonState {
  currentFile: ExcelFile | null;
  previousFile: ExcelFile | null;
  result: ComparisonResult | null;
  error: string | null;
  isLoading: boolean;
}

interface ComparisonActions {
  setCurrentFile: (file: ExcelFile | null) => void;
  setPreviousFile: (file: ExcelFile | null) => void;
  setResult: (result: ComparisonResult | null) => void;
  setError: (error: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  reset: () => void;
}

type ComparisonStore = ComparisonState & ComparisonActions;

const initialState: ComparisonState = {
  currentFile: null,
  previousFile: null,
  result: null,
  error: null,
  isLoading: false,
};

export const useComparisonStore = create<ComparisonStore>((set) => ({
  ...initialState,
  setCurrentFile: (file) => set({ currentFile: file, error: null }),
  setPreviousFile: (file) => set({ previousFile: file, error: null }),
  setResult: (result) => set({ result, error: null }),
  setError: (error) => set({ error, isLoading: false }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  reset: () => set(initialState),
}));
