import axios from 'axios';
import { LoginMutationCb, getCookieProps } from '@/shared/utils/login.utils';
import { LoginFormValues, LoginData } from '@/shared/types/login.types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('login.utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('LoginMutationCb', () => {
    it('returns login data when API call is successful', async () => {
      const mockLoginData: LoginData = {
        data: {
          user: {
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            middleName: '',
            _id: '123',
            __v: 0
          }
        },
        error: null,
        message: null,
        success: true,
        version: '1.0.0'
      };

      const formValues: LoginFormValues = {
        email: 'test@example.com',
        password: 'password123'
      };

      mockedAxios.post.mockResolvedValue({ data: mockLoginData });

      const result = await LoginMutationCb(formValues);

      expect(result).toEqual(mockLoginData);
      expect(mockedAxios.post).toHaveBeenCalledWith('/api', formValues);
    });

    it('throws error when API call fails', async () => {
      const mockError = new Error('API Error');
      const formValues: LoginFormValues = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      mockedAxios.post.mockRejectedValue(mockError);

      await expect(LoginMutationCb(formValues)).rejects.toThrow('API Error');
      expect(mockedAxios.post).toHaveBeenCalledWith('/api', formValues);
    });

    it('calls API with correct endpoint and data', async () => {
      const formValues: LoginFormValues = {
        email: 'user@test.com',
        password: 'securepass'
      };

      const mockResponse = { data: { success: true } };
      mockedAxios.post.mockResolvedValue(mockResponse);

      await LoginMutationCb(formValues);

      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith('/api', formValues);
    });
  });

  describe('getCookieProps', () => {
    it('parses a simple cookie string correctly', () => {
      const cookieString = 'sessionId=abc123';
      const result = getCookieProps(cookieString);

      expect(result).toEqual({
        name: 'sessionId',
        value: 'abc123'
      });
    });

    it('parses cookie string with additional attributes', () => {
      const cookieString = 'token=xyz789; Path=/; HttpOnly';
      const result = getCookieProps(cookieString);

      expect(result).toEqual({
        name: 'token',
        value: 'xyz789'
      });
    });

    it('parses cookie with multiple semicolons', () => {
      const cookieString = 'authToken=secretValue; Secure; HttpOnly; SameSite=Strict';
      const result = getCookieProps(cookieString);

      expect(result).toEqual({
        name: 'authToken',
        value: 'secretValue'
      });
    });

    it('handles cookie with equals sign in value', () => {
      const cookieString = 'data=key=value; Path=/';
      const result = getCookieProps(cookieString);

      expect(result).toEqual({
        name: 'data',
        value: 'key=value'
      });
    });

    it('handles cookie with empty value', () => {
      const cookieString = 'emptyCookie=; Path=/';
      const result = getCookieProps(cookieString);

      expect(result).toEqual({
        name: 'emptyCookie',
        value: ''
      });
    });

    it('handles cookie string with spaces', () => {
      const cookieString = 'mySession=value123 ; Path=/ ; Secure';
      const result = getCookieProps(cookieString);

      expect(result).toEqual({
        name: 'mySession',
        value: 'value123'
      });
    });
  });
});
