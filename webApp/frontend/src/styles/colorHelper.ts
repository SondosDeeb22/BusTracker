//======================================================================================
//? Helper functions for colors
//======================================================================================

// convert HEX color into RGB ------------------------------------------------------------------
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const cleaned = String(hex || '').trim().replace('#', '')

  // support ARGB format coming from backend/mobile like: 0xAARRGGBB ---------------------------
  if (cleaned.toLowerCase().startsWith('0x') && cleaned.length === 10) {
    const rrggbb = cleaned.slice(4)
    const r = parseInt(rrggbb.slice(0, 2), 16)
    const g = parseInt(rrggbb.slice(2, 4), 16)
    const b = parseInt(rrggbb.slice(4, 6), 16)
    return { r, g, b }
  }

  if (cleaned.length === 3) {
    const r = parseInt(cleaned[0] + cleaned[0], 16)
    const g = parseInt(cleaned[1] + cleaned[1], 16)
    const b = parseInt(cleaned[2] + cleaned[2], 16)
    return { r, g, b }
  }

  if (cleaned.length === 6) {
    const r = parseInt(cleaned.slice(0, 2), 16)
    const g = parseInt(cleaned.slice(2, 4), 16)
    const b = parseInt(cleaned.slice(4, 6), 16)
    return { r, g, b }
  }

  return null
}

//======================================================================================
//? Normalize any CSS color (hex/rgb/rgba/name) to RGB
//======================================================================================

export const cssColorToRgb = (color: string): { r: number; g: number; b: number } | null => {
  const input = String(color || '').trim()

  // try HEX / ARGB first ------------------------------------------------------------------
  const hex = hexToRgb(input)
  if (hex) return hex

  // try rgb(...) / rgba(...) --------------------------------------------------------------
  const rgbMatch = input.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(\d*\.?\d+)\s*)?\)$/i)
  if (rgbMatch) {
    const r = Math.min(255, Math.max(0, Number(rgbMatch[1])))
    const g = Math.min(255, Math.max(0, Number(rgbMatch[2])))
    const b = Math.min(255, Math.max(0, Number(rgbMatch[3])))
    return { r, g, b }
  }

  // fallback: let the browser parse CSS named colors (yellow, etc.) -----------------------
  if (typeof document !== 'undefined') {
    const el = document.createElement('div')
    el.style.color = input
    document.body.appendChild(el)
    const computed = getComputedStyle(el).color
    document.body.removeChild(el)
    return cssColorToRgb(computed)
  }

  return null
}

//======================================================================================
//? Determine text color based on background brightness
//======================================================================================

export const textColorForBackground = (bgColor: string): string => {
  const rgb = cssColorToRgb(bgColor)

  if (!rgb) return '#ffffff'

  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000

  return brightness > 140 ? '#000000' : '#ffffff'
}
