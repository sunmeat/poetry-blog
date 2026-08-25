import styles from './Footer.module.css'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.line}>Написанное останется, сказанное — забудется.</p>
        <p className={styles.copy}>
          Санина писанина · {year} ·{' '}
          <a
            href="https://sunmeat.shop"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            sunmeat.shop
          </a>
        </p>
      </div>
    </footer>
  )
}
