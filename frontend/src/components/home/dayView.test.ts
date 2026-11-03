import { describe, expect, it } from 'vitest';
import { dayViewMode } from './dayView';

describe('dayViewMode', () => {
  it('does not flash the empty state while the shifts query is still pending', () => {
    expect(dayViewMode({ isLoading: true, isError: false, hasGroups: false })).toBe('loading');
  });

  it('keeps loaded groups on screen during a background refetch', () => {
    expect(dayViewMode({ isLoading: true, isError: false, hasGroups: true })).toBe('list');
  });

  it('shows the empty state once loading settles with no shifts', () => {
    expect(dayViewMode({ isLoading: false, isError: false, hasGroups: false })).toBe('empty');
  });

  it('renders the shift list when groups exist', () => {
    expect(dayViewMode({ isLoading: false, isError: false, hasGroups: true })).toBe('list');
  });

  it('never claims "no shifts" when the load actually failed', () => {
    expect(dayViewMode({ isLoading: false, isError: true, hasGroups: false })).toBe('failed');
  });

  it('prefers existing groups over an error from a stale window', () => {
    expect(dayViewMode({ isLoading: false, isError: true, hasGroups: true })).toBe('list');
  });
});
