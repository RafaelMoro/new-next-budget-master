import { renderHook } from '@testing-library/react';
import { useMediaQuery } from '@/shared/hooks/useMediaQuery';

describe('useMediaQuery', () => {
  let matchMediaMock: jest.Mock;

  beforeEach(() => {
    matchMediaMock = jest.fn();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Server-side rendering / No window', () => {
    it('returns all false values when matchMedia is not available', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: undefined,
      });

      const { result } = renderHook(() => useMediaQuery());

      expect(result.current).toEqual({
        isMobile: false,
        isTablet: false,
        isTabletDesktop: false,
        isMobileTablet: false,
        isDesktop: false,
        isDesktopX2: false,
      });
    });
  });

  describe('Mobile viewport (max-width: 767px)', () => {
    beforeEach(() => {
      matchMediaMock.mockImplementation((query: string) => ({
        matches: query === '(max-width: 767px)' || query === '(max-width: 1023px)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));
    });

    it('detects mobile viewport correctly', () => {
      const { result } = renderHook(() => useMediaQuery());

      expect(result.current.isMobile).toBe(true);
      expect(result.current.isTablet).toBe(false);
      expect(result.current.isTabletDesktop).toBe(false);
      expect(result.current.isMobileTablet).toBe(true);
      expect(result.current.isDesktop).toBe(false);
      expect(result.current.isDesktopX2).toBe(false);
    });

    it('calls matchMedia with correct mobile query', () => {
      renderHook(() => useMediaQuery());

      expect(matchMediaMock).toHaveBeenCalledWith('(max-width: 767px)');
    });
  });

  describe('Tablet viewport (768px - 1023px)', () => {
    beforeEach(() => {
      matchMediaMock.mockImplementation((query: string) => ({
        matches:
          query === '(min-width: 768px) and (max-width: 1023px)' ||
          query === '(min-width: 768px)' ||
          query === '(max-width: 1023px)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));
    });

    it('detects tablet viewport correctly', () => {
      const { result } = renderHook(() => useMediaQuery());

      expect(result.current.isMobile).toBe(false);
      expect(result.current.isTablet).toBe(true);
      expect(result.current.isTabletDesktop).toBe(true);
      expect(result.current.isMobileTablet).toBe(true);
      expect(result.current.isDesktop).toBe(false);
      expect(result.current.isDesktopX2).toBe(false);
    });

    it('calls matchMedia with correct tablet query', () => {
      renderHook(() => useMediaQuery());

      expect(matchMediaMock).toHaveBeenCalledWith('(min-width: 768px) and (max-width: 1023px)');
    });
  });

  describe('Desktop viewport (1024px - 1279px)', () => {
    beforeEach(() => {
      matchMediaMock.mockImplementation((query: string) => ({
        matches:
          query === '(min-width: 1024px)' ||
          query === '(min-width: 768px)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));
    });

    it('detects desktop viewport correctly', () => {
      const { result } = renderHook(() => useMediaQuery());

      expect(result.current.isMobile).toBe(false);
      expect(result.current.isTablet).toBe(false);
      expect(result.current.isTabletDesktop).toBe(true);
      expect(result.current.isMobileTablet).toBe(false);
      expect(result.current.isDesktop).toBe(true);
      expect(result.current.isDesktopX2).toBe(false);
    });

    it('calls matchMedia with correct desktop query', () => {
      renderHook(() => useMediaQuery());

      expect(matchMediaMock).toHaveBeenCalledWith('(min-width: 1024px)');
    });
  });

  describe('Desktop X2 viewport (min-width: 1280px)', () => {
    beforeEach(() => {
      matchMediaMock.mockImplementation((query: string) => ({
        matches:
          query === '(min-width: 1280px)' ||
          query === '(min-width: 1024px)' ||
          query === '(min-width: 768px)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));
    });

    it('detects desktop X2 viewport correctly', () => {
      const { result } = renderHook(() => useMediaQuery());

      expect(result.current.isMobile).toBe(false);
      expect(result.current.isTablet).toBe(false);
      expect(result.current.isTabletDesktop).toBe(true);
      expect(result.current.isMobileTablet).toBe(false);
      expect(result.current.isDesktop).toBe(true);
      expect(result.current.isDesktopX2).toBe(true);
    });

    it('calls matchMedia with correct desktop X2 query', () => {
      renderHook(() => useMediaQuery());

      expect(matchMediaMock).toHaveBeenCalledWith('(min-width: 1280px)');
    });
  });

  describe('Combined breakpoints', () => {
    it('isTabletDesktop is true for tablet', () => {
      matchMediaMock.mockImplementation((query: string) => ({
        matches:
          query === '(min-width: 768px) and (max-width: 1023px)' ||
          query === '(min-width: 768px)' ||
          query === '(max-width: 1023px)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));

      const { result } = renderHook(() => useMediaQuery());

      expect(result.current.isTabletDesktop).toBe(true);
      expect(result.current.isTablet).toBe(true);
      expect(result.current.isDesktop).toBe(false);
    });

    it('isTabletDesktop is true for desktop', () => {
      matchMediaMock.mockImplementation((query: string) => ({
        matches:
          query === '(min-width: 1024px)' ||
          query === '(min-width: 768px)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));

      const { result } = renderHook(() => useMediaQuery());

      expect(result.current.isTabletDesktop).toBe(true);
      expect(result.current.isTablet).toBe(false);
      expect(result.current.isDesktop).toBe(true);
    });

    it('isMobileTablet is true for mobile', () => {
      matchMediaMock.mockImplementation((query: string) => ({
        matches: query === '(max-width: 767px)' || query === '(max-width: 1023px)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));

      const { result } = renderHook(() => useMediaQuery());

      expect(result.current.isMobileTablet).toBe(true);
      expect(result.current.isMobile).toBe(true);
      expect(result.current.isTablet).toBe(false);
    });

    it('isMobileTablet is true for tablet', () => {
      matchMediaMock.mockImplementation((query: string) => ({
        matches:
          query === '(min-width: 768px) and (max-width: 1023px)' ||
          query === '(min-width: 768px)' ||
          query === '(max-width: 1023px)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));

      const { result } = renderHook(() => useMediaQuery());

      expect(result.current.isMobileTablet).toBe(true);
      expect(result.current.isMobile).toBe(false);
      expect(result.current.isTablet).toBe(true);
    });
  });

  describe('matchMedia API calls', () => {
    beforeEach(() => {
      matchMediaMock.mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));
    });

    it('calls matchMedia for all breakpoints', () => {
      renderHook(() => useMediaQuery());

      expect(matchMediaMock).toHaveBeenCalledTimes(6);
      expect(matchMediaMock).toHaveBeenCalledWith('(max-width: 767px)');
      expect(matchMediaMock).toHaveBeenCalledWith('(min-width: 768px) and (max-width: 1023px)');
      expect(matchMediaMock).toHaveBeenCalledWith('(min-width: 768px)');
      expect(matchMediaMock).toHaveBeenCalledWith('(max-width: 1023px)');
      expect(matchMediaMock).toHaveBeenCalledWith('(min-width: 1024px)');
      expect(matchMediaMock).toHaveBeenCalledWith('(min-width: 1280px)');
    });
  });

  describe('Edge cases', () => {
    it('handles when no media queries match', () => {
      matchMediaMock.mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));

      const { result } = renderHook(() => useMediaQuery());

      expect(result.current).toEqual({
        isMobile: false,
        isTablet: false,
        isTabletDesktop: false,
        isMobileTablet: false,
        isDesktop: false,
        isDesktopX2: false,
      });
    });

    it('can be called multiple times', () => {
      matchMediaMock.mockImplementation((query: string) => ({
        matches: query === '(max-width: 767px)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));

      const { result: result1 } = renderHook(() => useMediaQuery());
      const { result: result2 } = renderHook(() => useMediaQuery());

      expect(result1.current.isMobile).toBe(true);
      expect(result2.current.isMobile).toBe(true);
    });
  });
});
