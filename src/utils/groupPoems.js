import { getYearMonth, monthName } from './dateUtils.js'

// группирует стихи по году, затем по месяцу, сохраняя порядок от новых к старым
export function groupPoemsByYearMonth(poems) {
  const byYear = new Map()

  for (const poem of poems) {
    const { year, month } = getYearMonth(poem.date)
    if (!byYear.has(year)) byYear.set(year, new Map())
    const byMonth = byYear.get(year)
    const key = month || 0
    if (!byMonth.has(key)) byMonth.set(key, [])
    byMonth.get(key).push(poem)
  }

  const years = Array.from(byYear.keys()).sort((a, b) => {
    if (a === 'Без даты') return 1
    if (b === 'Без даты') return -1
    return b - a
  })

  return years.map((year) => {
    const byMonth = byYear.get(year)
    const months = Array.from(byMonth.keys()).sort((a, b) => b - a)
    return {
      year,
      months: months.map((m) => ({
        month: m,
        label: m ? monthName(m) : 'Без месяца',
        poems: byMonth.get(m),
      })),
    }
  })
}

// список доступных лет для фильтра
export function extractAvailableYears(poems) {
  const years = new Set()
  poems.forEach((p) => {
    const { year } = getYearMonth(p.date)
    years.add(year)
  })
  return Array.from(years).sort((a, b) => {
    if (a === 'Без даты') return 1
    if (b === 'Без даты') return -1
    return b - a
  })
}
