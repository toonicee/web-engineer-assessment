import { formatCurrency, formatTime, cn } from './utils';

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('should format number with RM prefix', () => {
      expect(formatCurrency(1000)).toBe('RM 1000.00');
      expect(formatCurrency(0)).toBe('RM 0.00');
      expect(formatCurrency(1234.56)).toBe('RM 1234.56');
      
      // Additional test cases
      expect(formatCurrency(10)).toBe('RM 10.00');
      expect(formatCurrency(100.5)).toBe('RM 100.50');
    });
  });

  describe('formatTime', () => {
    it('should format seconds to mm:ss', () => {
      expect(formatTime(65)).toBe('1:05');
      expect(formatTime(0)).toBe('0:00');
      expect(formatTime(125)).toBe('2:05');
    });
  });

  describe('cn (classNames)', () => {
    it('should combine class names', () => {
      expect(cn('test', 'class1', 'class2')).toBe('test class1 class2');
      expect(cn('', 'class1', null, 'class2')).toBe('class1 class2');
    });
  });
});