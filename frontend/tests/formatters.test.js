import { describe, it, expect, vi, beforeEach } from 'vitest';
import { formatDate, relativeDay, getDaysLeft, truncate } from '../src/utils/formatters';

describe('formatters', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-01'));
  });

  describe('formatDate', () => {
    it('formats date correctly for en-IN', () => {
      expect(formatDate('2026-05-22')).toBe('22 May 2026');
    });

    it('returns empty string if no date provided', () => {
      expect(formatDate(null)).toBe('');
    });
  });

  describe('relativeDay', () => {
    it('returns Today for current date', () => {
      expect(relativeDay('2026-05-01')).toBe('Today');
    });

    it('returns In X days for future date', () => {
      expect(relativeDay('2026-05-03')).toBe('In 2 days');
    });

    it('returns X days ago for past date', () => {
      expect(relativeDay('2026-04-29')).toBe('2 days ago');
    });
  });

  describe('getDaysLeft', () => {
    it('returns correct number of days left', () => {
      expect(getDaysLeft('2026-05-22')).toBe(21);
    });

    it('returns 0 if date has passed', () => {
      expect(getDaysLeft('2026-04-20')).toBe(0);
    });
  });

  describe('truncate', () => {
    it('truncates long text', () => {
      expect(truncate('Hello world this is a long text', 10)).toBe('Hello worl…');
    });

    it('does not truncate short text', () => {
      expect(truncate('Short', 10)).toBe('Short');
    });
  });
});
