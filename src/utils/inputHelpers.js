/**
 * Sanitize numeric input: replace . with , and remove invalid characters
 * @param {string} value - Raw input value
 * @returns {string} Sanitized value
 */
export function sanitizeNumericInput(value) {
  // Replace . with ,
  let sanitized = value.replace(/\./g, ',')
  
  // Remove all characters except digits, comma, and minus sign
  sanitized = sanitized.replace(/[^\d,\-]/g, '')
  
  // Ensure only one comma
  const parts = sanitized.split(',')
  if (parts.length > 2) {
    sanitized = parts[0] + ',' + parts.slice(1).join('')
  }
  
  // Ensure minus only at start
  const hasMinus = sanitized.startsWith('-')
  sanitized = sanitized.replace(/-/g, '')
  if (hasMinus) {
    sanitized = '-' + sanitized
  }
  
  return sanitized
}

/**
 * Parse sanitized input to float (French format with comma)
 * @param {string} value - Sanitized input value
 * @returns {number} Parsed float value
 */
export function parseNumericInput(value) {
  if (!value || value === '-') return NaN
  // Replace comma with dot for parseFloat
  return parseFloat(value.replace(',', '.'))
}

/**
 * Format number for display in input (with comma)
 * @param {number} value - Number to format
 * @returns {string} Formatted string with comma
 */
export function formatNumericInput(value) {
  if (value === null || value === undefined || isNaN(value)) return ''
  return value.toString().replace('.', ',')
}
