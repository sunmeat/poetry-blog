// Vercel Edge Middleware
//
// Большинство мессенджеров и соцсетей (Telegram, WhatsApp, Facebook, VK, Viber,
// Discord, Slack, LinkedIn и т.д.) при генерации превью ссылки НЕ выполняют
// JavaScript — они читают только статический HTML, отданный сервером.
// Данное приложение — SPA (Vite + React), поэтому обычным пользователям всегда
// отдаётся один и тот же index.html, а нужные <meta property="og:..."> для
// конкретного стихотворения проставляются уже в браузере (см. src/utils/seo.js).
// Ботам от этого пользы нет, поэтому для запросов на /poem/:id, пришедших от
// известных ботов, этот middleware подменяет ответ на лёгкую HTML-страницу
// с правильными title/description/og-тегами для этого конкретного стихотворения,
// подтянутыми из Firestore (публичное чтение коллекции poems разрешено правилами).
//
// Обычные посетители (браузеры) middleware не трогает — им отдаётся исходное SPA.

const SITE_NAME = 'Санина писанина'
const SITE_URL = 'https://pisanina.vercel.app'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`
const DEFAULT_DESCRIPTION =
  'Тихое цифровое пространство для стихов, слов и всего того, что хочется читать с чувствами.'

// Признаки ботов-краулеров превью ссылок (регистронезависимо)
const BOT_UA_REGEX =
  /(facebookexternalhit|Facebot|Twitterbot|TelegramBot|WhatsApp|Slackbot|LinkedInBot|Discordbot|redditbot|Pinterest|vkShare|Viber|SkypeUriPreview|W3C_Validator|Google-InspectionTool|Applebot)/i

function escapeHtml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function buildExcerpt(content = '', max = 160) {
  const flat = String(content).replace(/\s+/g, ' ').trim()
  if (!flat) return DEFAULT_DESCRIPTION
  if (flat.length <= max) return flat
  return `${flat.slice(0, max).trim()}…`
}

async function fetchPoem(id) {
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID
  if (!projectId) return null

  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/poems/${id}`
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    const fields = data.fields || {}
    return {
      title: fields.title?.stringValue || '',
      content: fields.content?.stringValue || '',
    }
  } catch {
    return null
  }
}

function renderHtml({ title, description, pageUrl }) {
  const safeTitle = escapeHtml(title)
  const safeDescription = escapeHtml(description)
  const safeUrl = escapeHtml(pageUrl)

  return `<!doctype html>
<html lang="ru">
<head>
<meta charset="UTF-8" />
<title>${safeTitle}</title>
<meta name="description" content="${safeDescription}" />

<meta property="og:type" content="article" />
<meta property="og:site_name" content="${SITE_NAME}" />
<meta property="og:title" content="${safeTitle}" />
<meta property="og:description" content="${safeDescription}" />
<meta property="og:image" content="${DEFAULT_IMAGE}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:url" content="${safeUrl}" />
<meta property="og:locale" content="ru_RU" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${safeTitle}" />
<meta name="twitter:description" content="${safeDescription}" />
<meta name="twitter:image" content="${DEFAULT_IMAGE}" />

<meta http-equiv="refresh" content="0; url=${safeUrl}" />
<link rel="canonical" href="${safeUrl}" />
</head>
<body>
<p><a href="${safeUrl}">${safeTitle}</a></p>
</body>
</html>`
}

export default async function middleware(request) {
  const userAgent = request.headers.get('user-agent') || ''
  const { pathname } = new URL(request.url)

  const match = pathname.match(/^\/poem\/([^/]+)\/?$/)

  // Не бот или не страница стихотворения — пропускаем запрос как есть
  if (!match || !BOT_UA_REGEX.test(userAgent)) {
    return
  }

  const id = decodeURIComponent(match[1])
  const poem = await fetchPoem(id)
  const pageUrl = `${SITE_URL}${pathname}`

  const title = poem?.title ? `${poem.title} — ${SITE_NAME}` : `${SITE_NAME} — поэтический блог`
  const description = poem?.content ? buildExcerpt(poem.content) : DEFAULT_DESCRIPTION

  return new Response(renderHtml({ title, description, pageUrl }), {
    status: 200,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  })
}

export const config = {
  matcher: '/poem/:path*',
}
