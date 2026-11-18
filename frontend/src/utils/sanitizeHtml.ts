/**
 * Sanitize HTML avant dangerouslySetInnerHTML.
 * ponytail: pas de DOMPurify — strip scripts / handlers / iframes / javascript: URLs.
 * Upgrade: isomorphic-dompurify si le contenu admin devient plus riche.
 */

const BLOCKED_TAGS = /<\/?(?:script|iframe|object|embed|link|meta|base|form|input|button|textarea|select|svg\s+onload)\b[^>]*>/gi
const EVENT_ATTRS = /\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi
const JS_URLS = /\s+(?:href|src|xlink:href)\s*=\s*(?:"\s*(?:javascript|vbscript):[^"]*"|'\s*(?:javascript|vbscript):[^']*'|\s*(?:javascript|vbscript):[^\s>]+)/gi
const DATA_URLS = /\s+src\s*=\s*(?:"\s*data:text\/html[^"]*"|'\s*data:text\/html[^']*')/gi
const STYLE_EXPRESSION = /\s+style\s*=\s*(?:"[^"]*expression\s*\([^"]*"|'[^']*expression\s*\([^']*')/gi

export function sanitizeHtml(html: string): string {
  if (!html) return ''
  return html
    .replace(BLOCKED_TAGS, '')
    .replace(EVENT_ATTRS, '')
    .replace(JS_URLS, '')
    .replace(DATA_URLS, '')
    .replace(STYLE_EXPRESSION, '')
}

/** SVG admin : mêmes règles + pas de foreignObject. */
export function sanitizeSvg(svg: string): string {
  return sanitizeHtml(svg).replace(/<\/?foreignObject\b[^>]*>/gi, '')
}
