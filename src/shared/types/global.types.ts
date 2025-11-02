export type ThemeMode = 'light' | 'dark';

export type ErrorCatched = {
  message: string;
  cause?: {
    code: string
  }
}