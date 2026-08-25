const MONTHS_RU = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
]

const MONTHS_RU_NOM = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]

export function formatPoemDate(dateStr) {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-').map(Number)
  if (!year) return dateStr
  if (!month) return String(year)
  const monthName = MONTHS_RU[month - 1] || ''
  if (!day) return `${monthName} ${year}`.trim()
  return `${day} ${monthName} ${year}`
}

export function getYearMonth(dateStr) {
  if (!dateStr) return { year: 'Без даты', month: null }
  const [year, month] = dateStr.split('-').map(Number)
  return { year: year || 'Без даты', month: month || null }
}

export function monthName(month) {
  if (!month) return ''
  return MONTHS_RU_NOM[month - 1] || ''
}

// формат даты для комментариев/публикации: "3 июня 2026, 14:20"
export function formatDateTime(timestamp) {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  const day = date.getDate()
  const month = MONTHS_RU[date.getMonth()]
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${day} ${month} ${year}, ${hours}:${minutes}`
}
