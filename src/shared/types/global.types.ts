export type ThemeMode = 'light' | 'dark';

export type ErrorCatched = {
  message: string;
  cause?: {
    code: string
  }
}

export type CookieObject = {
  name: string;
  value: string;
};

export type GeneralError = {
  response: {
    data: {
      error: {
        message: string;
      }
    }
  }
}