export function formatCOP(value: number) {
  try {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
  } catch {
    return `$${value}`; // fallback
  }
}
