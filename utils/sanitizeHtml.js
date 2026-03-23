const SAFE_TAGS = new Set(['br', 'strong', 'b', 'em', 'i', 'u', 'a'])

const escapeHtml = (value = '') =>
   String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')

const normalizeHref = (value = '') => {
   const href = String(value).trim()
   if (!href) return null

   const lower = href.toLowerCase()
   if (
      lower.startsWith('javascript:') ||
      lower.startsWith('data:') ||
      lower.startsWith('vbscript:')
   ) {
      return null
   }

   if (
      href.startsWith('/') ||
      href.startsWith('#') ||
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:')
   ) {
      return href
   }

   return null
}

const sanitizeAnchors = (html) =>
   html.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (_, rawAttrs, rawInner) => {
      const hrefMatch =
         rawAttrs.match(/\shref\s*=\s*"([^"]*)"/i) ||
         rawAttrs.match(/\shref\s*=\s*'([^']*)'/i) ||
         rawAttrs.match(/\shref\s*=\s*([^\s>]+)/i)

      const href = normalizeHref(hrefMatch?.[1] || '')
      const inner = sanitizeHtml(rawInner)

      if (!href) return inner

      return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${inner}</a>`
   })

export const sanitizeHtml = (value = '') => {
   if (!value) return ''

   let html = String(value)
   html = html.replace(/<!--[\s\S]*?-->/g, '')
   html = html.replace(/<script\b[\s\S]*?<\/script>/gi, '')
   html = html.replace(/<style\b[\s\S]*?<\/style>/gi, '')

   html = sanitizeAnchors(html)

   html = html.replace(/<(\/?)([a-z0-9-]+)([^>]*)>/gi, (match, slash, tagName) => {
      const tag = String(tagName || '').toLowerCase()
      if (!SAFE_TAGS.has(tag)) return ''

      if (tag === 'a') {
         return match
      }

      if (tag === 'br') {
         return slash ? '' : '<br>'
      }

      return slash ? `</${tag}>` : `<${tag}>`
   })

   return html
}

export const sanitizePlainTextFromHtml = (value = '') =>
   sanitizeHtml(value)
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&#39;/gi, "'")
      .replace(/&quot;/gi, '"')
