import { useEffect, useMemo, useState } from 'react'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase.js'
import PoemList from '../../components/PoemList/PoemList.jsx'
import YearFilter from '../../components/YearFilter/YearFilter.jsx'
import Loader from '../../components/Loader/Loader.jsx'
import { extractAvailableYears } from '../../utils/groupPoems.js'
import styles from './Home.module.css'

export default function Home() {
  const [poems, setPoems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeYear, setActiveYear] = useState(null)

  useEffect(() => {
    const q = query(collection(db, 'poems'), orderBy('date', 'desc'))
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setPoems(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      (err) => {
        console.error('Ошибка загрузки стихотворений:', err)
        setError('Не удалось загрузить стихотворения. Проверьте соединение и настройки Firebase.')
        setLoading(false)
      },
    )
    return unsubscribe
  }, [])

  const years = useMemo(() => extractAvailableYears(poems), [poems])
  const filteredPoems = useMemo(() => {
    if (!activeYear) return poems
    return poems.filter((p) => {
      const y = p.date ? Number(p.date.split('-')[0]) : 'Без даты'
      return String(y) === String(activeYear)
    })
  }, [poems, activeYear])

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Мой личный дневник в стихах</p>
        <h1 className={styles.heroTitle}>Санина писанина</h1>
        <p className={styles.heroSubtitle}>
          Стихотворения, записанные на память — <br className={styles.brDesktop} />
          в духе тех вечеров, когда строка ещё умела дышать.
        </p>
        <div className="ornament" aria-hidden="true">
          <span className="ornament-mark">❧</span>
        </div>
      </section>

      <div className="container">
        <YearFilter years={years} activeYear={activeYear} onSelect={setActiveYear} />

        {loading && <Loader />}
        {!loading && error && <p className={styles.error}>{error}</p>}
        {!loading && !error && <PoemList poems={filteredPoems} />}
      </div>
    </div>
  )
}
