// Utilitaire pour formater les dates en français

/**
 * Formate une date au format français JJ/MM/AAAA
 * @param date Date à formater (string ISO, Date, ou timestamp)
 * @returns Date formatée en JJ/MM/AAAA
 */
export function formatDateFrench(date: string | Date | number): string {
  const dateObj = typeof date === 'string' ? new Date(date) : typeof date === 'number' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) {
    return ''
  }
  
  const day = dateObj.getDate().toString().padStart(2, '0')
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
  const year = dateObj.getFullYear()
  
  return `${day}/${month}/${year}`
}

/**
 * Formate une date et heure au format français JJ/MM/AAAA HH:MM
 * @param date Date à formater (string ISO, Date, ou timestamp)
 * @returns Date et heure formatées
 */
export function formatDateTimeFrench(date: string | Date | number): string {
  const dateObj = typeof date === 'string' ? new Date(date) : typeof date === 'number' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) {
    return ''
  }
  
  const day = dateObj.getDate().toString().padStart(2, '0')
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
  const year = dateObj.getFullYear()
  const hours = dateObj.getHours().toString().padStart(2, '0')
  const minutes = dateObj.getMinutes().toString().padStart(2, '0')
  
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

