import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../../firebase.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { formatPoemDate } from '../../utils/dateUtils.js'
import Loader from '../../components/Loader/Loader.jsx'
import styles from './Admin.module.css'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [poems, setPoems] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    const q = query(collection(db, 'poems'), orderBy('date', 'desc'))
    const unsubscribe = onSnapshot(q, (snap) => {
      setPoems(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/admin')
  }

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Удалить стихотворение «${title}»? Это действие необратимо.`)) return
    setDeletingId(id)
    try {
      await deleteDoc(doc(db, 'poems', id))
    } catch (err) {
      console.error('Ошибка удаления:', err)
      window.alert('Не удалось удалить стихотворение.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className={`container-wide ${styles.page}`}>
      <div className={styles.dashboardHead}>
        <div>
          <p className={styles.eyebrow}>Кабинет Сани</p>
          <h1 className={styles.title}>Руко-писи</h1>
          <p className={styles.hint}>Вы вошли как {user?.email}</p>
        </div>
        <div className={styles.headActions}>
          <Link to="/admin/new" className={styles.primaryBtn}>+ Новое стихотворение</Link>
          <button type="button" onClick={handleLogout} className={styles.ghostBtn}>Выйти</button>
        </div>
      </div>

      {loading && <Loader />}

      {!loading && poems.length === 0 && (
        <p className={styles.hint}>Пока нет ни одного стихотворения. Начните с первого.</p>
      )}

      {!loading && poems.length > 0 && (
        <ul className={styles.list}>
          {poems.map((poem) => (
            <li key={poem.id} className={styles.row}>
              <div className={styles.rowMain}>
                <span className={styles.rowTitle}>{poem.title}</span>
                <span className={styles.rowDate}>{formatPoemDate(poem.date)}</span>
              </div>
              <div className={styles.rowActions}>
                <Link to={`/poem/${poem.id}`} className={styles.linkBtn}>Открыть</Link>
                <Link to={`/admin/edit/${poem.id}`} className={styles.linkBtn}>Изменить</Link>
                <button
                  type="button"
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(poem.id, poem.title)}
                  disabled={deletingId === poem.id}
                >
                  {deletingId === poem.id ? 'Удаление…' : 'Удалить'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
