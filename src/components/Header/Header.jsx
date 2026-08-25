import { Link } from 'react-router-dom'
import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>

          <svg className={styles.mark} viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" strokeWidth="1" />
    
            <path
              d="M 25 8 C 19 12 14 18 12 26 M 25 8 L 12 26"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />

            <path
              d="M 14 12 Q 17 9 20 12 Q 23 9 26 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
 
            <path
              d="M 8 30 Q 14 26 20 30 T 32 30"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
          <span className={styles.brandText}>
            <span className={styles.brandTitle}>Санина писанина</span>
            <span className={styles.brandSubtitle}>стихи и заметки</span>
          </span>
        </Link>

        <div className={styles.odessaAtmosphere}>
          <span className={styles.quote}>Поэзия с видом на море</span>
          <span className={styles.anchorIcon} aria-hidden="true"> ⚓</span>
        </div>
      </div>
    </header>
  )
}
