import { renderHook, act } from '@testing-library/react';
import { useCurrencyField } from '@/shared/hooks/useCurrencyField';
import { CURRENCY_ZERO_ERROR } from '@/shared/constants/records.constants';
import { DEFAULT_AMOUNT_VALUE } from '@/shared/constants/global.constants';

describe('useCurrencyField', () => {
  describe('Initialization', () => {
    it('initializes with default amount when amount is null', () => {
      const { result } = renderHook(() => useCurrencyField({ amount: null }));

      expect(result.current.currencyState).toBe(DEFAULT_AMOUNT_VALUE);
      expect(result.current.errorAmount).toBeNull();
    });

    it('initializes with provided amount', () => {
      const { result } = renderHook(() => useCurrencyField({ amount: '$10.00' }));

      expect(result.current.currencyState).toBe('$10.00');
      expect(result.current.errorAmount).toBeNull();
    });
  });

  describe('isZeroCurrency', () => {
    it('returns true when currency state is default value', () => {
      const { result } = renderHook(() => useCurrencyField({ amount: null }));

      expect(result.current.isZeroCurrency()).toBe(true);
    });

    it('returns false when currency state is not default value', () => {
      const { result } = renderHook(() => useCurrencyField({ amount: '$10.00' }));

      expect(result.current.isZeroCurrency()).toBe(false);
    });
  });

  describe('handleChange', () => {
    it('handles first decimal place input ($0.001 to $0.009)', () => {
      const { result } = renderHook(() => useCurrencyField({ amount: null }));

      act(() => {
        result.current.handleChange({
          target: { value: '$0.005' }
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.currencyState).toBe('$0.05');
      expect(result.current.errorAmount).toBeNull();
    });

    it('handles second decimal place input ($0.01 to $0.09)', () => {
      const { result } = renderHook(() => useCurrencyField({ amount: null }));

      act(() => {
        result.current.handleChange({
          target: { value: '$0.025' }
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.currencyState).toBe('$0.25');
    });

    it('handles third decimal place input ($0.1 to $0.9)', () => {
      const { result } = renderHook(() => useCurrencyField({ amount: null }));

      act(() => {
        result.current.handleChange({
          target: { value: '$0.225' }
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.currencyState).toBe('$2.25');
    });

    it('handles number without thousand separator', () => {
      const { result } = renderHook(() => useCurrencyField({ amount: null }));

      act(() => {
        result.current.handleChange({
          target: { value: '$123.456' }
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.currencyState).toBe('$1,234.56');
    });

    it('handles number with thousand separator', () => {
      const { result } = renderHook(() => useCurrencyField({ amount: null }));

      act(() => {
        result.current.handleChange({
          target: { value: '$1,234.567' }
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.currencyState).toBe('$12,345.67');
    });

    it('handles number with double zero decimals', () => {
      const { result } = renderHook(() => useCurrencyField({ amount: null }));

      act(() => {
        result.current.handleChange({
          target: { value: '$123.400' }
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.currencyState).toBe('$1,234.00');
    });

    it('handles number with zero second decimal and non-zero third', () => {
      const { result } = renderHook(() => useCurrencyField({ amount: null }));

      act(() => {
        result.current.handleChange({
          target: { value: '$123.405' }
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.currencyState).toBe('$1,234.05');
    });

    it('handles deleted number shifting decimal left', () => {
      const { result } = renderHook(() => useCurrencyField({ amount: null }));

      act(() => {
        result.current.handleChange({
          target: { value: '$123.4' }
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.currencyState).toBe('$12.34');
    });

    it('handles deleted number with thousand separator shifting decimal left', () => {
      const { result } = renderHook(() => useCurrencyField({ amount: null }));

      act(() => {
        result.current.handleChange({
          target: { value: '$1,234.5' }
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.currencyState).toBe('$123.45');
    });

    it('handles complex thousand separator scenarios', () => {
      const { result } = renderHook(() => useCurrencyField({ amount: null }));

      act(() => {
        result.current.handleChange({
          target: { value: '$1,000,000.123' }
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.currencyState).toBe('$10,000,001.23');
    });
  });

  describe('validateZeroAmount', () => {
    it('returns false and sets error when amount is default value', () => {
      const { result } = renderHook(() => useCurrencyField({ amount: null }));

      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validateZeroAmount({ amountState: DEFAULT_AMOUNT_VALUE });
      });

      expect(isValid).toBe(false);
      expect(result.current.errorAmount).toBe(CURRENCY_ZERO_ERROR);
    });

    it('returns true and does not set error when amount is not default value', () => {
      const { result } = renderHook(() => useCurrencyField({ amount: null }));

      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validateZeroAmount({ amountState: '$10.00' });
      });

      expect(isValid).toBe(true);
      expect(result.current.errorAmount).toBeNull();
    });

    it('sets custom error message when provided', () => {
      const { result } = renderHook(() => useCurrencyField({ amount: null }));
      const customMessage = 'Custom error message';

      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validateZeroAmount({ 
          amountState: DEFAULT_AMOUNT_VALUE, 
          message: customMessage 
        });
      });

      expect(isValid).toBe(false);
      expect(result.current.errorAmount).toBe(customMessage);
    });
  });

  describe('updateErrorAmount', () => {
    it('updates error amount with provided error message', () => {
      const { result } = renderHook(() => useCurrencyField({ amount: null }));
      const errorMessage = 'Test error message';

      act(() => {
        result.current.updateErrorAmount(errorMessage);
      });

      expect(result.current.errorAmount).toBe(errorMessage);
    });

    it('can update error amount multiple times', () => {
      const { result } = renderHook(() => useCurrencyField({ amount: null }));

      act(() => {
        result.current.updateErrorAmount('First error');
      });
      expect(result.current.errorAmount).toBe('First error');

      act(() => {
        result.current.updateErrorAmount('Second error');
      });
      expect(result.current.errorAmount).toBe('Second error');
    });
  });

  describe('resetCurrencyState', () => {
    it('resets currency state to default value and clears error', () => {
      const { result } = renderHook(() => useCurrencyField({ amount: '$100.00' }));

      act(() => {
        result.current.updateErrorAmount('Some error');
      });

      expect(result.current.currencyState).toBe('$100.00');
      expect(result.current.errorAmount).toBe('Some error');

      act(() => {
        result.current.resetCurrencyState();
      });

      expect(result.current.currencyState).toBe(DEFAULT_AMOUNT_VALUE);
      expect(result.current.errorAmount).toBeNull();
    });
  });

  describe('handleEditState', () => {
    it('updates currency state with provided amount', () => {
      const { result } = renderHook(() => useCurrencyField({ amount: null }));

      act(() => {
        result.current.handleEditState('$50.00');
      });

      expect(result.current.currencyState).toBe('$50.00');
    });

    it('can update currency state multiple times', () => {
      const { result } = renderHook(() => useCurrencyField({ amount: null }));

      act(() => {
        result.current.handleEditState('$25.00');
      });
      expect(result.current.currencyState).toBe('$25.00');

      act(() => {
        result.current.handleEditState('$75.00');
      });
      expect(result.current.currencyState).toBe('$75.00');
    });
  });

  describe('Integration scenarios', () => {
    it('handles complete user flow: input, validate, reset', () => {
      const { result } = renderHook(() => useCurrencyField({ amount: null }));

      // Initial state
      expect(result.current.currencyState).toBe(DEFAULT_AMOUNT_VALUE);
      expect(result.current.isZeroCurrency()).toBe(true);

      // User enters amount
      act(() => {
        result.current.handleChange({
          target: { value: '$100.123' }
        } as React.ChangeEvent<HTMLInputElement>);
      });
      expect(result.current.currencyState).toBe('$1,001.23');
      expect(result.current.isZeroCurrency()).toBe(false);

      // Validate non-zero amount
      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validateZeroAmount({ amountState: result.current.currencyState });
      });
      expect(isValid).toBe(true);
      expect(result.current.errorAmount).toBeNull();

      // Reset
      act(() => {
        result.current.resetCurrencyState();
      });
      expect(result.current.currencyState).toBe(DEFAULT_AMOUNT_VALUE);
      expect(result.current.isZeroCurrency()).toBe(true);
    });

    it('handles error flow: validate zero, show error, update error, reset', () => {
      const { result } = renderHook(() => useCurrencyField({ amount: null }));

      // Validate zero amount
      let isValid: boolean = true;
      act(() => {
        isValid = result.current.validateZeroAmount({ amountState: DEFAULT_AMOUNT_VALUE });
      });
      expect(isValid).toBe(false);
      expect(result.current.errorAmount).toBe(CURRENCY_ZERO_ERROR);

      // Update error
      act(() => {
        result.current.updateErrorAmount('Updated error message');
      });
      expect(result.current.errorAmount).toBe('Updated error message');

      // Reset clears error
      act(() => {
        result.current.resetCurrencyState();
      });
      expect(result.current.errorAmount).toBeNull();
    });

    it('handles edit flow: edit state, validate, update', () => {
      const { result } = renderHook(() => useCurrencyField({ amount: null }));

      // Edit state directly
      act(() => {
        result.current.handleEditState('$200.00');
      });
      expect(result.current.currencyState).toBe('$200.00');

      // Continue with input changes
      act(() => {
        result.current.handleChange({
          target: { value: '$200.003' }
        } as React.ChangeEvent<HTMLInputElement>);
      });
      expect(result.current.currencyState).toBe('$2,000.03');

      // Validate
      let isValid: boolean = false;
      act(() => {
        isValid = result.current.validateZeroAmount({ amountState: result.current.currencyState });
      });
      expect(isValid).toBe(true);
    });
  });
});
