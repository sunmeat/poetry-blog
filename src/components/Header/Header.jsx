import { Link } from 'react-router-dom'
import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <svg
            className={styles.mark}
            viewBox="0 0 64 64"
            aria-hidden="true"
          >
            <path
              d="
                M10 19
                C14 15 18 15 22 19
                C26 14 31 14 36 18
                C40 14 45 15 49 19
              "
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d="
                M38 10
                C27 15 19 28 17 45
                C27 39 36 27 38 10Z
              "
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />


            <path
              d="M17 45 C24 34 31 23 38 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            
            <path
              d="
                M22 36 L17 32
                M26 30 L20 26
                M30 24 L25 20
                M34 18 L30 15
              "
              fill="none"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
            />

            <path
              d="
                M7 49
                C13 45 19 45 25 49
                C31 53 37 53 43 49
                C49 45 55 45 59 49
              "
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            <path
              d="
                M7 55
                C13 51 19 51 25 55
                C31 59 37 59 43 55
                C49 51 55 51 59 55
              "
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.55"
            />
          </svg>

          <span className={styles.brandText}>
            <span className={styles.brandTitle}>
              Санина писанина
            </span>

            <span className={styles.brandSubtitle}>
              стихи и заметки Сани
            </span>
          </span>
        </Link>

        <div className={styles.odessaAtmosphere}>
          <span className={styles.quote}>
            Поэзия с видом на море ⚓
          </span>
        </div>
      </div>
    </header>
  )
}
