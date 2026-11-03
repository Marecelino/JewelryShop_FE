export function formatDate(dateStr: string | null | undefined, locale: string = 'vi-VN'): string {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr

    return new Intl.DateTimeFormat(locale === 'vi' || locale === 'vi-VN' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(d)
  } catch {
    return dateStr
  }
}

