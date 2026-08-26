import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase.js'
import PoemCard from '../../components/PoemCard/PoemCard.jsx'
import Loader from '../../components/Loader/Loader.jsx'
import { updateSeo, resetSeo, buildExcerpt, SITE_URL } from '../../utils/seo.js'
import styles from './PoemPage.module.css'

export default function PoemPage() {
  const { id } = useParams()
  const [poem, setPoem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const ref = doc(db, 'poems', id)
    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setPoem({ id: snap.id, ...snap.data() })
        } else {
          setNotFound(true)
        }
        setLoading(false)
      },
      () => {
        setNotFound(true)
        setLoading(false)
      },
    )
    return unsubscribe
  }, [id])

  useEffect(() => {
    if (!poem) return
    updateSeo({
      title: poem.title,
      description: buildExcerpt(poem.content),
      url: `${SITE_URL}/poem/${poem.id}`,
    })
    return resetSeo
  }, [poem])

  if (loading) return <Loader />

  if (notFound || !poem) {
    return (
      <div className="container">
        <p className={styles.notFound}>Это стихотворение не найдено — возможно, страница была удалена.</p>
        <Link to="/" className={styles.back}>← Вернуться к тетради</Link>
      </div>
    )
  }

  return (
    <div className={`container ${styles.page}`}>
      <Link to="/" className={styles.back}>← Вернуться к тетради</Link>
      <PoemCard poem={poem} />
    </div>
  )
}
