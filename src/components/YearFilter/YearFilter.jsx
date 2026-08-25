import styles from './YearFilter.module.css'

export default function YearFilter({ years, activeYear, onSelect }) {
  if (!years.length) return null
  return (
    <nav className={styles.wrap} aria-label="Фильтр по году">
      <button
        type="button"
        className={`${styles.chip} ${!activeYear ? styles.active : ''}`}
        onClick={() => onSelect(null)}
      >
        Все годы
      </button>
      {years.map((year) => (
        <button
          key={year}
          type="button"
          className={`${styles.chip} ${activeYear === year ? styles.active : ''}`}
          onClick={() => onSelect(year)}
        >
          {year}
        </button>
      ))}
    </nav>
  )
}
