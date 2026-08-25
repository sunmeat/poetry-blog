// src/pages/Admin/PoemForm.jsx
import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../../firebase.js'
import { formatDateTime } from '../../utils/dateUtils.js'
import Loader from '../../components/Loader/Loader.jsx'
import styles from './Admin.module.css'

const emptyForm = { title: '', date: '', epigraph: '', content: '' }

export default function PoemForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // --- Комментарии к этому стихотворению (видно только автору) ---
  const [comments, setComments] = useState([])
  const [commentsLoading, setCommentsLoading] = useState(isEdit)
  const [commentsError, setCommentsError] = useState('')
  const [deletingCommentId, setDeletingCommentId] = useState(null)

  useEffect(() => {
    if (!isEdit) return
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'poems', id))
        if (snap.exists()) {
          const data = snap.data()
          setForm({
            title: data.title || '',
            date: data.date || '',
            epigraph: data.epigraph || '',
            content: data.content || '',
          })
        } else {
          setError('Стихотворение не найдено.')
        }
      } catch (err) {
        console.error(err)
        setError('Не удалось загрузить стихотворение.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, isEdit])

  // Подписка на комментарии этого стихотворения в реальном времени
  useEffect(() => {
    if (!isEdit) return
    const q = query(
        collection(db, 'comments'),
        where('poemId', '==', id),
        orderBy('createdAt', 'desc'),
    )
    const unsubscribe = onSnapshot(
        q,
        (snap) => {
          setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
          setCommentsLoading(false)
        },
        (err) => {
          console.error('Ошибка загрузки комментариев:', err)
          setCommentsError('Не удалось загрузить комментарии.')
          setCommentsLoading(false)
        },
    )
    return unsubscribe
  }, [id, isEdit])

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.title.trim() || !form.content.trim() || !form.date) {
      setError('Заполните название, дату и текст стихотворения.')
      return
    }

    setSaving(true)
    try {
      if (isEdit) {
        await updateDoc(doc(db, 'poems', id), {
          title: form.title.trim(),
          date: form.date,
          epigraph: form.epigraph.trim(),
          content: form.content,
          updatedAt: serverTimestamp(),
        })
      } else {
        await addDoc(collection(db, 'poems'), {
          title: form.title.trim(),
          date: form.date,
          epigraph: form.epigraph.trim(),
          content: form.content,
          reactions: { heart: 0, clap: 0, dove: 0, pen: 0, fire: 0 },
          createdAt: serverTimestamp(),
        })
      }
      navigate('/admin/dashboard')
    } catch (err) {
      console.error('Ошибка сохранения:', err)
      setError('Не удалось сохранить стихотворение. Попробуйте снова.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Удалить этот отклик? Это действие необратимо.')) return
    setDeletingCommentId(commentId)
    try {
      await deleteDoc(doc(db, 'comments', commentId))
    } catch (err) {
      console.error('Не удалось удалить комментарий:', err)
      window.alert('Не удалось удалить комментарий.')
    } finally {
      setDeletingCommentId(null)
    }
  }

  if (loading) return <Loader />

  return (
      <div className={`container ${styles.page}`}>
        <Link to="/admin/dashboard" className={styles.back}>← К списку рукописей</Link>
        <div className={styles.card}>
          <p className={styles.eyebrow}>{isEdit ? 'Редактирование' : 'Новая запись'}</p>
          <h1 className={styles.title}>{isEdit ? 'Изменить стихотворение' : 'Новое стихотворение'}</h1>

          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.label}>
              Название
              <input
                  type="text"
                  value={form.title}
                  onChange={handleChange('title')}
                  className={styles.input}
                  placeholder="Например, «Бессонница»"
                  required
              />
            </label>

            <label className={styles.label}>
              Дата написания
              <input
                  type="date"
                  value={form.date}
                  onChange={handleChange('date')}
                  className={styles.input}
                  required
              />
            </label>

            <label className={styles.label}>
              Эпиграф (необязательно)
              <textarea
                  value={form.epigraph}
                  onChange={handleChange('epigraph')}
                  className={styles.textarea}
                  rows={2}
                  placeholder="Строка, посвящение или цитата перед стихотворением"
              />
            </label>

            <label className={styles.label}>
              Текст стихотворения
              <textarea
                  value={form.content}
                  onChange={handleChange('content')}
                  className={`${styles.textarea} ${styles.poemTextarea}`}
                  rows={14}
                  placeholder={'Строка первая\nСтрока вторая\n\nНовая строфа...'}
                  required
              />
              <span className={styles.smallHint}>
              Переносы строк сохраняются. Разделяйте строфы пустой строкой.
            </span>
            </label>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.formActions}>
              <button type="submit" className={styles.primaryBtn} disabled={saving}>
                {saving ? 'Сохранение…' : isEdit ? 'Сохранить изменения' : 'Опубликовать'}
              </button>
              <Link to="/admin/dashboard" className={styles.ghostBtn}>Отмена</Link>
            </div>
          </form>
        </div>

        {/* --- Модерация комментариев (только в режиме редактирования) --- */}
        {isEdit && (
            <div className={`${styles.card} ${styles.commentsCard}`}>
              <p className={styles.eyebrow}>Модерация</p>
              <h2 className={styles.title}>
                Отклики читателей{!commentsLoading && comments.length > 0 ? ` (${comments.length})` : ''}
              </h2>

              {commentsLoading && <p className={styles.hint}>Загрузка откликов…</p>}
              {!commentsLoading && commentsError && <p className={styles.error}>{commentsError}</p>}
              {!commentsLoading && !commentsError && comments.length === 0 && (
                  <p className={styles.hint}>Под этим стихотворением пока нет откликов.</p>
              )}

              {!commentsLoading && comments.length > 0 && (
                  <ul className={styles.commentList}>
                    {comments.map((c) => (
                        <li key={c.id} className={styles.commentItem}>
                          <div className={styles.commentHead}>
                            <span className={styles.commentAuthor}>{c.authorName || 'Гость'}</span>
                            <span className={styles.commentTime}>{formatDateTime(c.createdAt)}</span>
                          </div>
                          <p className={styles.commentText}>{c.text}</p>
                          <button
                              type="button"
                              className={styles.deleteBtn}
                              onClick={() => handleDeleteComment(c.id)}
                              disabled={deletingCommentId === c.id}
                          >
                            {deletingCommentId === c.id ? 'Удаление…' : 'Удалить отклик'}
                          </button>
                        </li>
                    ))}
                  </ul>
              )}
            </div>
        )}
      </div>
  )
}