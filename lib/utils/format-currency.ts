import { currencies } from "../constants/currencies";
// Cache to store currency symbols
const currencyCache: { [key: string]: string } = {};
export function formatCurrency(amount: number | undefined, currencyCode: string): string {
  if (amount === undefined || isNaN(amount)) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode || 'USD',
    }).format(0);
  }

  // Check if the currency symbol is already cached
  let symbol = currencyCache[currencyCode];
  if (!symbol) {
    // If not cached, find the currency symbol and store it in the cache
    const currency = currencies.find((c) => c.value === currencyCode);
    symbol = currency?.symbol || "$";
    currencyCache[currencyCode] = symbol;
  }

  // Format the amount
  let formattedCurrency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode || 'USD',
    currencyDisplay: 'symbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  // Replace only the INR symbol with 'Rs'
  if (currencyCode === 'INR') {
    formattedCurrency = formattedCurrency.replace('₹', 'Rs');
  }

  return formattedCurrency;
}
