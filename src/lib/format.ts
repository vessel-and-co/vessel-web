const GUARANIES_FORMATTER = new Intl.NumberFormat("es-PY", {
  maximumFractionDigits: 0,
});

export function formatGuaranies(amount: number): string {
  return `Gs. ${GUARANIES_FORMATTER.format(amount)}`;
}
