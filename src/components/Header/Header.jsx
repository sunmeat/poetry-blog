import { Link, NavLink } from 'react-router-dom'
import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <svg className={styles.mark} viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" strokeWidth="1" />
            <path
              d="M28 11c-8 1-15 6-19 15-2 4-3 7-4 9 3-0.6 8-2.4 13-6 8-6 12-13 13-19"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
          </svg>
          <span className={styles.brandText}>
            <span className={styles.brandTitle}>Серебряная тетрадь</span>
            <span className={styles.brandSubtitle}>стихи и заметки Сани</span>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Основная навигация">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
          >
            Стихотворения
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
          >
            Админка (только для Сани)
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
