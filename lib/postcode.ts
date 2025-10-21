/**
 * UK Postcode validation and normalization utility
 * Accepts district-level inputs like "SW1", "E3", "BS8", and full codes like "SW1A 1AA"
 */

export interface PostcodeResult {
  ok: boolean;
  district?: string;
  error?: string;
}

/**
 * UK postcode regex pattern that matches:
 * - District codes: SW1, E3, BS8, etc.
 * - Full postcodes: SW1A 1AA, E3 4AB, etc.
 */
const UK_POSTCODE_REGEX = /^([A-Z]{1,2}[0-9][A-Z0-9]?)(\s*[0-9][A-Z]{2})?$/i;

/**
 * Normalizes and validates a UK postcode input
 * @param input - The postcode string to validate
 * @returns PostcodeResult with ok status, district code, or error message
 */
export function normalizePostcode(input: string): PostcodeResult {
  if (!input || typeof input !== 'string') {
    return { ok: false, error: 'Please enter a postcode' };
  }

  // Clean the input: remove extra spaces, convert to uppercase
  const cleaned = input.trim().toUpperCase();
  
  if (cleaned.length === 0) {
    return { ok: false, error: 'Please enter a postcode' };
  }

  // Test against UK postcode pattern
  const match = cleaned.match(UK_POSTCODE_REGEX);
  
  if (!match) {
    return { 
      ok: false, 
      error: 'Please enter a valid UK postcode (e.g., SW1A, E3, BS8)' 
    };
  }

  // Extract the district part (first group)
  const district = match[1];
  
  if (!district) {
    return { 
      ok: false, 
      error: 'Please enter a valid UK postcode' 
    };
  }

  return { 
    ok: true, 
    district 
  };
}

/**
 * Validates if a string looks like a UK postcode without normalization
 * @param input - The string to validate
 * @returns boolean indicating if the input matches UK postcode pattern
 */
export function isValidPostcode(input: string): boolean {
  return normalizePostcode(input).ok;
}
