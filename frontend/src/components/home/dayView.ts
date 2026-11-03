export type DayViewMode = 'loading' | 'list' | 'empty' | 'failed';

export type DayViewInput = {
  isLoading: boolean;
  isError: boolean;
  hasGroups: boolean;
};

export function dayViewMode({ isLoading, isError, hasGroups }: DayViewInput): DayViewMode {
  if (hasGroups) return 'list';
  if (isLoading) return 'loading';
  if (isError) return 'failed';
  return 'empty';
}
