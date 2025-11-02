import { getThemePreference, saveThemeCookie, deleteThemeCookie } from '@/shared/lib/preferences.lib';
import { THEME_COOKIE_KEY } from '@/shared/constants/global.constants';

// Mock next/headers
const mockGet = jest.fn();
const mockSet = jest.fn();
const mockDelete = jest.fn();

jest.mock('next/headers', () => ({
  cookies: jest.fn(async () => ({
    get: mockGet,
    set: mockSet,
    delete: mockDelete,
  })),
}));

describe('preferences.lib', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getThemePreference', () => {
    it('returns the theme value from cookies when it exists', async () => {
      mockGet.mockReturnValue({ value: 'light' });

      const result = await getThemePreference();

      expect(result).toBe('light');
      expect(mockGet).toHaveBeenCalledWith(THEME_COOKIE_KEY);
    });

    it('returns "dark" as default when theme cookie does not exist', async () => {
      mockGet.mockReturnValue(undefined);

      const result = await getThemePreference();

      expect(result).toBe('dark');
      expect(mockGet).toHaveBeenCalledWith(THEME_COOKIE_KEY);
    });

    it('returns "dark" when theme cookie value is falsy', async () => {
      mockGet.mockReturnValue({ value: '' });

      const result = await getThemePreference();

      expect(result).toBe('dark');
    });

    it('returns "dark" when an error occurs', async () => {
      const { cookies } = await import('next/headers');
      (cookies as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Cookie error');
      });

      const result = await getThemePreference();

      expect(result).toBe('dark');
    });
  });

  describe('saveThemeCookie', () => {
    it('saves the theme to cookies with correct options', async () => {
      await saveThemeCookie('light');

      expect(mockSet).toHaveBeenCalledWith(THEME_COOKIE_KEY, 'light', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
    });

    it('saves dark theme to cookies', async () => {
      await saveThemeCookie('dark');

      expect(mockSet).toHaveBeenCalledWith(THEME_COOKIE_KEY, 'dark', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });
    });

    it('handles errors gracefully when saving theme fails', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const { cookies } = await import('next/headers');
      (cookies as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Save error');
      });

      await saveThemeCookie('light');

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error saving theme preference:', expect.any(Error));
      consoleErrorSpy.mockRestore();
    });
  });

  describe('deleteThemeCookie', () => {
    it('deletes the theme cookie', async () => {
      await deleteThemeCookie();

      expect(mockDelete).toHaveBeenCalledWith(THEME_COOKIE_KEY);
    });

    it('handles errors gracefully when deleting theme fails', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const { cookies } = await import('next/headers');
      (cookies as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Delete error');
      });

      await deleteThemeCookie();

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error deleting theme preference:', expect.any(Error));
      consoleErrorSpy.mockRestore();
    });
  });
});
