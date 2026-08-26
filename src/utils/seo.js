export const SITE_NAME = 'Санина писанина'
export const SITE_URL = 'https://pisanina.vercel.app'
export const DEFAULT_TITLE = 'Санина писанина — поэтический блог'
export const DEFAULT_DESCRIPTION =
  'Тихое цифровое пространство для стихов, слов и всего того, что хочется читать с чувствами.'
export const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`

// краткое описание из текста стихотворения для мета-тегов
export function buildExcerpt(content, max = 160) {
  if (!content) return DEFAULT_DESCRIPTION
  const flat = content.replace(/\s+/g, ' ').trim()
  if (flat.length <= max) return flat
  return `${flat.slice(0, max).trim()}…`
}

function setMetaByAttr(attrName, attrValue, content) {
  let el = document.head.querySelector(`meta[${attrName}="${attrValue}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attrName, attrValue)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

// Обновляет title, description и Open Graph / Twitter теги для текущей страницы.
// Полезно для вкладки браузера и поисковых роботов, исполняющих JS.
// Для превью в мессенджерах (Telegram, WhatsApp и т.д.) корректные теги
// для страниц /poem/:id дополнительно отдаются на уровне edge middleware,
// так как такие боты не выполняют JavaScript.
export function updateSeo({ title, description, url, image } = {}) {
  const finalTitle = title ? `${title} — ${SITE_NAME}` : DEFAULT_TITLE
  const finalDescription = description || DEFAULT_DESCRIPTION
  const finalUrl = url || window.location.href
  const finalImage = image || DEFAULT_IMAGE

  document.title = finalTitle

  setMetaByAttr('name', 'description', finalDescription)
  setMetaByAttr('property', 'og:type', title ? 'article' : 'website')
  setMetaByAttr('property', 'og:site_name', SITE_NAME)
  setMetaByAttr('property', 'og:title', finalTitle)
  setMetaByAttr('property', 'og:description', finalDescription)
  setMetaByAttr('property', 'og:image', finalImage)
  setMetaByAttr('property', 'og:url', finalUrl)
  setMetaByAttr('name', 'twitter:card', 'summary_large_image')
  setMetaByAttr('name', 'twitter:title', finalTitle)
  setMetaByAttr('name', 'twitter:description', finalDescription)
  setMetaByAttr('name', 'twitter:image', finalImage)

  let canonical = document.head.querySelector('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    document.head.appendChild(canonical)
  }
  canonical.setAttribute('href', finalUrl)
}

export function resetSeo() {
  updateSeo({})
}
