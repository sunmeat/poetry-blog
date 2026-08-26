import { useEffect, useRef, useState } from 'react'
import styles from './ShareButton.module.css'

const FALLBACK_LINKS = [
  {
    key: 'telegram',
    label: 'Telegram',
    build: (url, text) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    build: (url, text) => `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`,
  },
  {
    key: 'vk',
    label: 'ВКонтакте',
    build: (url, text) => `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
  },
]

export default function ShareButton({ title, url }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const wrapRef = useRef(null)

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const shareText = title ? `«${title}» — Санина писанина` : 'Санина писанина'

  useEffect(() => {
    if (!menuOpen) return
    const handleClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Скопируйте ссылку:', shareUrl)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: shareText, url: shareUrl })
      } catch {
        // пользователь отменил — ничего не делаем
      }
      return
    }
    setMenuOpen((prev) => !prev)
  }

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button
        type="button"
        className={styles.button}
        onClick={handleShare}
        aria-haspopup={navigator.share ? undefined : 'true'}
        aria-expanded={navigator.share ? undefined : menuOpen}
      >
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="18" cy="5" r="2.8" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="6" cy="12" r="2.8" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="18" cy="19" r="2.8" stroke="currentColor" strokeWidth="1.4" />
          <path d="M8.5 10.7L15.5 6.7M8.5 13.3L15.5 17.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        Поделиться
      </button>

      {menuOpen && (
        <div className={styles.menu} role="menu">
          {FALLBACK_LINKS.map((link) => (
            <a
              key={link.key}
              className={styles.menuItem}
              role="menuitem"
              href={link.build(shareUrl, shareText)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <button type="button" className={styles.menuItem} role="menuitem" onClick={copyLink}>
            {copied ? 'Ссылка скопирована ✓' : 'Скопировать ссылку'}
          </button>
        </div>
      )}

      {copied && !menuOpen && <span className={styles.toast}>Ссылка скопирована</span>}
    </div>
  )
}
