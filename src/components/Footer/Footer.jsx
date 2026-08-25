import styles from './Footer.module.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.decor}>
          <span />
          <span className={styles.dot}>✦</span>
          <span />
        </div>

        <p className={styles.quote}>
          Написанное останется, сказанное — забудется.
        </p>

        <div className={styles.bottom}>
          <span className={styles.copy}>
            Санина писанина · {year}
          </span>

          <a
            href="https://sunmeat.shop"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            sunmeat.shop
            <span className={styles.arrow}>↗</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
