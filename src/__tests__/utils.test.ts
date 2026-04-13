import { cn, parsePercentage } from '../lib/utils';

describe('Utility Functions', () => {
  describe('cn (Tailwind Merge)', () => {
    it('should correctly merge classes', () => {
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
      expect(cn('px-2 py-1', 'p-4')).toBe('p-4');
    });

    it('should correctly handle conditional classes', () => {
      const isTrue = true;
      const isFalse = false;
      expect(cn('base', isTrue && 'truthy', isFalse && 'falsy')).toBe('base truthy');
    });
  });

  describe('parsePercentage', () => {
    it('should handle undefined or null', () => {
      expect(parsePercentage(undefined)).toBe(0);
      expect(parsePercentage(null)).toBe(0);
      expect(parsePercentage('')).toBe(0);
    });

    it('should handle strings with percentages', () => {
      expect(parsePercentage('45%')).toBe(45);
      expect(parsePercentage('100%')).toBe(100);
      expect(parsePercentage('0.5%')).toBe(0.5);
      expect(parsePercentage('45.23%')).toBe(45.23);
    });

    it('should handle strings without percentages', () => {
      expect(parsePercentage('75')).toBe(75);
      expect(parsePercentage('0')).toBe(0);
      expect(parsePercentage('3.14')).toBe(3.14);
    });

    it('should clamp values between 0 and 100', () => {
      expect(parsePercentage('150%')).toBe(100);
      expect(parsePercentage(-50)).toBe(0);
      expect(parsePercentage(120)).toBe(100);
      expect(parsePercentage('-10%')).toBe(0);
    });

    it('should return 0 for invalid formats', () => {
      expect(parsePercentage('hello')).toBe(0);
      expect(parsePercentage('NaN')).toBe(0);
    });

    it('should work seamlessly with raw numbers', () => {
      expect(parsePercentage(50)).toBe(50);
      expect(parsePercentage(88.8)).toBe(88.8);
      expect(parsePercentage(0)).toBe(0);
      expect(parsePercentage(100)).toBe(100);
    });
  });
});
