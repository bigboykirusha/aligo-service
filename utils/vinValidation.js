/**
 * Validates a Vehicle Identification Number (VIN)
 * @param {string} vin - The VIN to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function validateVIN(vin) {
   if (!vin || typeof vin !== 'string') return false

   vin = vin.toUpperCase().replace(/\s/g, '')

   if (vin.length !== 17) return false

   // VIN must be alphanumeric, no I, O, Q
   const invalidChars = /[IOQ]/
   if (invalidChars.test(vin)) return false

   // Basic regex for allowed characters
   return /^[A-HJ-NPR-Z0-9]{17}$/.test(vin)
}

/**
 * Validates a Russian license plate (Gosnomber)
 * @param {string} gos - The license plate to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function isValidGosNumber(gos) {
   if (!gos || typeof gos !== 'string') return false

   gos = gos.toUpperCase().replace(/\s/g, '')

   // Russian license plate formats (simplified)
   // Common format: 1 letter + 3 digits + 2 letters + 2-3 digits
   // e.g., A123AA123
   const regex = /^[АВЕКМНОРСТУХ]\d{3}[АВЕКМНОРСТУХ]{2}\d{2,3}$/

   return regex.test(gos)
}