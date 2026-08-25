import { useMemo, useState } from 'react'
import PoemCard from '../PoemCard/PoemCard.jsx'
import { groupPoemsByYearMonth } from '../../utils/groupPoems.js'
import styles from './PoemList.module.css'

const GROUPS_PER_PAGE = 3

export default function PoemList({ poems }) {
  const [visibleGroups, setVisibleGroups] = useState(GROUPS_PER_PAGE)

  const grouped = useMemo(() => groupPoemsByYearMonth(poems), [poems])
  const visible = grouped.slice(0, visibleGroups)
  const hasMore = visibleGroups < grouped.length

  if (!poems.length) {
    return (
      <p className={styles.empty}>
        Здесь пока нет стихотворений. Загляните позже — тетрадь пишется.
      </p>
    )
  }

  return (
    <div>
      {visible.map((yearGroup) => (
        <section key={yearGroup.year} className={styles.yearSection}>
          <h2 className={styles.yearTitle}>{yearGroup.year}</h2>
          {yearGroup.months.map((monthGroup) => (
            <div key={`${yearGroup.year}-${monthGroup.month}`} className={styles.monthGroup}>
              {monthGroup.label && (
                <h3 className={styles.monthTitle}>{monthGroup.label}</h3>
              )}
              {monthGroup.poems.map((poem) => (
                <PoemCard key={poem.id} poem={poem} />
              ))}
            </div>
          ))}
        </section>
      ))}

      {hasMore && (
        <div className={styles.moreWrap}>
          <button
            type="button"
            className={styles.moreButton}
            onClick={() => setVisibleGroups((v) => v + GROUPS_PER_PAGE)}
          >
            Показать более ранние годы
          </button>
        </div>
      )}
    </div>
  )
}
