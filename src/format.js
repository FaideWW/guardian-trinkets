export function formatNumber(number) {
  return number.toLocaleString();
}

export function formatPercent(number, precision = 2) {
  return `${(number * 100).toFixed(precision)}%`;
}
