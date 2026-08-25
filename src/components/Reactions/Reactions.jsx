import { useEffect, useState } from 'react'
import { doc, updateDoc, increment } from 'firebase/firestore'
import { db } from '../../firebase.js'
import styles from './Reactions.module.css'

const EMOJI_TYPES = [
  { key: 'heart', emoji: '❤️', label: 'Люблю' },
  { key: 'clap', emoji: '👏', label: 'Браво' },
  { key: 'dove', emoji: '🕊️', label: 'Светло' },
  { key: 'pen', emoji: '✍️', label: 'Отзывается' },
  { key: 'fire', emoji: '🔥', label: 'Пронзительно' },
  { key: 'sparkles', emoji: '✨', label: 'Волшебно' },
  { key: 'rose', emoji: '🌹', label: 'Прекрасно' },
  { key: 'candle', emoji: '🕯️', label: 'Душевно' },
  { key: 'moon', emoji: '🌙', label: 'Таинственно' },
  { key: 'star', emoji: '🌟', label: 'Вдохновляет' },
  { key: 'coffee', emoji: '☕', label: 'Уютно' },
  { key: 'music', emoji: '🎶', label: 'Мелодично' },
  { key: 'folded_hands', emoji: '🙏', label: 'Благодарю' },
  { key: 'tear', emoji: '🥹', label: 'До слёз' },
]

const STORAGE_KEY = 'silver-notebook-reactions'

function getLocalReaction(poemId) {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return raw[poemId] || null
  } catch {
    return null
  }
}

function setLocalReaction(poemId, emojiKey) {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    if (emojiKey) {
      raw[poemId] = emojiKey
    } else {
      delete raw[poemId]
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(raw))
  } catch {
    // localStorage недоступен
  }
}

export default function Reactions({ poemId, initialReactions }) {
  const [counts, setCounts] = useState(() => {
    const base = {}
    EMOJI_TYPES.forEach((e) => {
      base[e.key] = (initialReactions && initialReactions[e.key]) || 0
    })
    return base
  })

  const [selectedReaction, setSelectedReaction] = useState(null)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    setSelectedReaction(getLocalReaction(poemId))
  }, [poemId])

  const handleReact = async (emojiKey) => {
    if (pending) return

    const previousReaction = selectedReaction

    const isRemoving = previousReaction === emojiKey
    const nextReaction = isRemoving ? null : emojiKey

    setSelectedReaction(nextReaction)
    setCounts((prev) => {
      const updated = { ...prev }
      if (previousReaction) {
        updated[previousReaction] = Math.max(0, updated[previousReaction] - 1)
      }
      if (!isRemoving) {
        updated[emojiKey] = (updated[emojiKey] || 0) + 1
      }
      return updated
    })
    setLocalReaction(poemId, nextReaction)
    setPending(true)

    try {
      const poemRef = doc(db, 'poems', poemId)
      const updates = {}

      if (previousReaction) {
        updates[`reactions.${previousReaction}`] = increment(-1)
      }
      if (!isRemoving) {
        updates[`reactions.${emojiKey}`] = increment(1)
      }

      await updateDoc(poemRef, updates)
    } catch (err) {
      // Откат при ошибке запроса
      setSelectedReaction(previousReaction)
      setLocalReaction(poemId, previousReaction)
      setCounts((prev) => {
        const reverted = { ...prev }
        if (previousReaction) {
          reverted[previousReaction] = (reverted[previousReaction] || 0) + 1
        }
        if (!isRemoving) {
          reverted[emojiKey] = Math.max(0, reverted[emojiKey] - 1)
        }
        return reverted
      })
      console.error('Не удалось сохранить реакцию:', err)
    } finally {
      setPending(false)
    }
  }

  return (
      <div className={styles.wrap} role="group" aria-label="Реакции на стихотворение">
        {EMOJI_TYPES.map(({ key, emoji, label }) => {
          const isActive = selectedReaction === key
          return (
              <button
                  key={key}
                  type="button"
                  className={`${styles.pill} ${isActive ? styles.active : ''}`}
                  onClick={() => handleReact(key)}
                  disabled={pending}
                  title={label}
                  aria-pressed={isActive}
              >
                <span className={styles.emoji}>{emoji}</span>
                <span className={styles.count}>{counts[key] || 0}</span>
              </button>
          )
        })}
      </div>
  )
}