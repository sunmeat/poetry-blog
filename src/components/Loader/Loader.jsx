import styles from './Loader.module.css'

export default function Loader({ label = 'Перелистываем страницы…' }) {
  return (
    <div className={styles.wrap} role="status" aria-live="polite">
      <div className={styles.feather}>
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <path
            d="M28 11c-8 1-15 6-19 15-2 4-3 7-4 9 3-0.6 8-2.4 13-6 8-6 12-13 13-19"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span className={styles.label}>{label}</span>
    </div>
  )
}
