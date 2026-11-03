export function formatVND(amount: number | string | null | undefined, locale: string = 'vi-VN'): string {
  const numeric = typeof amount === 'number' ? amount : Number(amount)
  if (isNaN(numeric) || amount === null || amount === undefined) {
    return '0 ₫'
  }

  try {
    return new Intl.NumberFormat(locale === 'vi' || locale === 'vi-VN' ? 'vi-VN' : 'en-US', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(numeric)
  } catch {
    return `${numeric.toLocaleString()} ₫`
  }
}

