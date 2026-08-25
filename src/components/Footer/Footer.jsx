import styles from './Footer.module.css'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.line}>«Написанное останется, сказанное — забудется.»</p>
        <p className={styles.copy}>Серебряная тетрадь · {year}</p>
      </div>
    </footer>
  )
}
