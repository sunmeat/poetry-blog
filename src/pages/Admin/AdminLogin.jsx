import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import styles from './Admin.module.css'

export default function AdminLogin() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (user) {
    navigate('/admin/dashboard', { replace: true })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email.trim(), password)
      navigate('/admin/dashboard')
    } catch (err) {
      console.error(err)
      setError('Неверный e-mail или пароль.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>Кабинет автора</p>
        <h1 className={styles.title}>Вход</h1>
        <p className={styles.hint}>
          Раздел доступен только автору тетради — для входа используется учётная запись Firebase.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
            E-mail
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              autoComplete="username"
            />
          </label>
          <label className={styles.label}>
            Пароль
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              autoComplete="current-password"
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submit} disabled={submitting}>
            {submitting ? 'Входим…' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  )
}
