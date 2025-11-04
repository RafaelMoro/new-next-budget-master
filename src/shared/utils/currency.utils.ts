const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});
export const formatNumberToCurrency = (amount: number): string =>
  formatter.format(amount);

export const cleanCurrencyString = (currency: string): number => {
  // Remove dollar sign and commas
  const cleaned = currency.replace(/[$,]/g, '');
  // Si tiene tres decimales, recorre el punto decimal
  const match = cleaned.match(/^(\d+)\.(\d{3})$/);
  if (match) {
    // Unir los dígitos y colocar el punto antes de los dos últimos
    const allDigits = match[1] + match[2];
    const result = allDigits.slice(0, -2) + '.' + allDigits.slice(-2);
    return parseFloat(result);
  }
  return parseFloat(cleaned);
};

export const shiftSingleDecimalLeft = (currency: string): number => {
  // Elimina el signo de dólar y comas
  const cleaned = currency.replace(/[$,]/g, '');
  // Busca el patrón de un solo decimal
  const match = cleaned.match(/^(\d+)\.(\d)$/);
  if (match) {
    // Une los dígitos y coloca el punto antes de los dos últimos
    const allDigits = match[1] + match[2];
    const result = allDigits.slice(0, -2) + '.' + allDigits.slice(-2);
    return parseFloat(result);
  }
  return parseFloat(cleaned);
};

export const shiftThousandSingleDecimalLeft = (currency: string): number => {
  // Elimina el signo de dólar y comas
  const cleaned = currency.replace(/[$,]/g, '');
  // Busca el patrón de un solo decimal
  const match = cleaned.match(/^(\d+)\.(\d)$/);
  if (match) {
    // Une los dígitos y coloca el punto antes de los dos últimos
    const allDigits = match[1] + match[2];
    const result = allDigits.slice(0, -2) + '.' + allDigits.slice(-2);
    return parseFloat(result);
  }
  return parseFloat(cleaned);
};