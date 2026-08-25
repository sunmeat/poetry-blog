import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

export default function NotFound() {
  return (
    <div className={`container ${styles.wrap}`}>
      <p className={styles.mark}>❧</p>
      <h1 className={styles.title}>Страница потеряна</h1>
      <p className={styles.text}>Возможно, эта страница существовала лишь в черновике.</p>
      <Link to="/" className={styles.link}>← Вернуться к тетради</Link>
    </div>
  )
}
