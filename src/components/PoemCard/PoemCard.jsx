import { Link } from 'react-router-dom'
import { formatPoemDate } from '../../utils/dateUtils.js'
import Reactions from '../Reactions/Reactions.jsx'
import Comments from '../Comments/Comments.jsx'
import ShareButton from '../ShareButton/ShareButton.jsx'
import styles from './PoemCard.module.css'

const SITE_URL = 'https://pisanina.vercel.app'

function renderStanzas(content) {
  if (!content) return null
  const stanzas = content.split(/\n\s*\n/)
  return stanzas.map((stanza, i) => (
    <p className={styles.stanza} key={i}>
      {stanza.split('\n').map((line, j, arr) => (
        <span key={j}>
          {line}
          {j < arr.length - 1 && <br />}
        </span>
      ))}
    </p>
  ))
}

export default function PoemCard({ poem, expandable = true }) {
  return (
    <article className={styles.card} id={`poem-${poem.id}`}>
      <header className={styles.header}>
        <Link to={`/poem/${poem.id}`} className={styles.titleLink}>
          <h2 className={styles.title}>{poem.title}</h2>
        </Link>
        <time className={styles.date} dateTime={poem.date}>
          {formatPoemDate(poem.date)}
        </time>
      </header>

      {poem.epigraph && (
        <blockquote className={styles.epigraph}>
          {poem.epigraph.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </blockquote>
      )}

      <div className={styles.body}>{renderStanzas(poem.content)}</div>

      <div className={styles.ornamentSmall} aria-hidden="true">
        <span />
        <span className={styles.dot}>❧</span>
        <span />
      </div>

      <div className={styles.actions}>
        <Reactions poemId={poem.id} initialReactions={poem.reactions} />
        <ShareButton title={poem.title} url={`${SITE_URL}/poem/${poem.id}`} />
      </div>

      {expandable && <Comments poemId={poem.id} />}
    </article>
  )
}
