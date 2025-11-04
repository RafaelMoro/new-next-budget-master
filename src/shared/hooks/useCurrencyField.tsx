import { useState } from "react";
import { cleanCurrencyString, formatNumberToCurrency, shiftSingleDecimalLeft, shiftThousandSingleDecimalLeft } from "../utils/currency.utils";
import { CURRENCY_ZERO_ERROR } from "../constants/records.constants";
import { DEFAULT_AMOUNT_VALUE } from "../constants/global.constants";

interface UseCurrencyFieldProps {
  amount: string | null;
}

/**
* This hook is to handle the usage of the currency field component
*/
export const useCurrencyField = ({ amount }: UseCurrencyFieldProps) => {
  const [currencyState, setCurrencyState] = useState(amount ?? DEFAULT_AMOUNT_VALUE);
  const [errorAmount, setErrorAmount] = useState<string | null>(null)
  const updateErrorAmount = (error: string) => {
    setErrorAmount(error);
  }

  const isZeroCurrency = () => {
    return currencyState === DEFAULT_AMOUNT_VALUE;
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // Matches values between $0.001 and $0.009 inclusive
    const currencyFirstNumber = /^\$0\.00[1-9]$/;
    const currencySecondNumber = /^\$0\.0[1-9][0-9]$/;
    const currencyThirdNumber = /^\$0\.[1-9][1-9][0-9]$/;
    const numberWithThousand = /^\$(\d{1,3}(,\d{3})+)\.[1-9]{3}$/
    const numberWithoutThousand = /^\$\d+\.\d{3}$/
    const numberDoubleZeroDecimals = /^\$[\d,]+\.\d00$/
    const numberZeroSecondDecimalAndNonZeroThird = /^\$[\d,]+\.\d0[1-9]$/
    const deletedNumberRegex = /^\$\d+\.\d$/;
    const deletedNumberThousandRegex = /^\$(\d{1,3}(,\d{3})+)\.\d$/

    if (currencyFirstNumber.test(value)) {
      const newValue = `$0.0${value.charAt(5)}`
      setCurrencyState(newValue);
      setErrorAmount(null)
      return;
    }
    if (currencySecondNumber.test(value)) {
      const newValue = `$0.${value.charAt(4)}${value.charAt(5)}`
      setCurrencyState(newValue);
      return;
    }
    if (currencyThirdNumber.test(value)) {
      const newValue = `$${value.charAt(3)}.${value.charAt(4)}${value.charAt(5)}`
      setCurrencyState(newValue)
      return;
    }
    if (numberWithoutThousand.test(value)) {
      const valueCleaned = cleanCurrencyString(value);
      const valueTransformed = formatNumberToCurrency(valueCleaned);
      setCurrencyState(valueTransformed);
      return;
    }
    if (numberWithThousand.test(value)) {
      const valueCleaned = cleanCurrencyString(value);
      const valueTransformed = formatNumberToCurrency(valueCleaned);
      setCurrencyState(valueTransformed);
      return;
    }
    if (numberDoubleZeroDecimals.test(value)) {
      const valueCleaned = cleanCurrencyString(value);
      const valueTransformed = formatNumberToCurrency(valueCleaned);
      setCurrencyState(valueTransformed);
      return;
    }
    if (numberZeroSecondDecimalAndNonZeroThird.test(value)) {
      const valueCleaned = cleanCurrencyString(value);
      const valueTransformed = formatNumberToCurrency(valueCleaned);
      setCurrencyState(valueTransformed);
      return;
    }
    if (deletedNumberRegex.test(value)) {
      const valueCleaned = shiftSingleDecimalLeft(value)
      const valueTransformed = formatNumberToCurrency(valueCleaned);
      setCurrencyState(valueTransformed);
      return;
    }
    if (deletedNumberThousandRegex.test(value)) {
      const valueCleaned = shiftThousandSingleDecimalLeft(value)
      const valueTransformed = formatNumberToCurrency(valueCleaned);
      setCurrencyState(valueTransformed);
      return;
    }
    
  }

  const validateZeroAmount = ({ amountState, message = CURRENCY_ZERO_ERROR }: { amountState: string, message?: string }):boolean => {
    if (amountState === DEFAULT_AMOUNT_VALUE) {
      setErrorAmount(message)
      return false
    }
    return true
  }

  const resetCurrencyState = () => {
    setCurrencyState(DEFAULT_AMOUNT_VALUE);
    setErrorAmount(null);
  }

  const handleEditState = (amount: string) => {
    setCurrencyState(amount);
  }

  return {
    handleChange,
    currencyState,
    errorAmount,
    updateErrorAmount,
    validateZeroAmount,
    resetCurrencyState,
    handleEditState,
    isZeroCurrency,
  };
}