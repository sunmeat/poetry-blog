import { useEffect, useState } from 'react'
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../../firebase.js'
import { formatDateTime } from '../../utils/dateUtils.js'
import styles from './Comments.module.css'

export default function Comments({ poemId }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const q = query(
      collection(db, 'comments'),
      where('poemId', '==', poemId),
      orderBy('createdAt', 'asc'),
    )
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      (err) => {
        console.error('Ошибка загрузки комментариев:', err)
        setLoading(false)
      },
    )
    return unsubscribe
  }, [poemId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!text.trim()) {
      setError('Напишите что-нибудь перед отправкой.')
      return
    }
    setSubmitting(true)
    try {
      await addDoc(collection(db, 'comments'), {
        poemId,
        authorName: name.trim() || 'Гость',
        text: text.trim(),
        createdAt: serverTimestamp(),
      })
      setText('')
      setName('')
    } catch (err) {
      console.error('Не удалось отправить комментарий:', err)
      setError('Не удалось отправить комментарий. Попробуйте ещё раз.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {open ? 'Скрыть отклики' : `Отклики${comments.length ? ` (${comments.length})` : ''}`}
      </button>

      {open && (
        <div className={styles.panel}>
          {loading && <p className={styles.hint}>Загрузка откликов…</p>}
          {!loading && comments.length === 0 && (
            <p className={styles.hint}>Пока здесь тихо. Будьте первым, кто оставит отклик.</p>
          )}

          <ul className={styles.list}>
            {comments.map((c) => (
              <li key={c.id} className={styles.item}>
                <div className={styles.itemHead}>
                  <span className={styles.author}>{c.authorName || 'Гость'}</span>
                  <span className={styles.time}>{formatDateTime(c.createdAt)}</span>
                </div>
                <p className={styles.text}>{c.text}</p>
              </li>
            ))}
          </ul>

          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Ваше имя (необязательно)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              maxLength={60}
            />
            <textarea
              placeholder="Оставьте отклик о стихотворении…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className={styles.textarea}
              rows={3}
              maxLength={1000}
            />
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.submit} disabled={submitting}>
              {submitting ? 'Отправка…' : 'Отправить'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
