/**
 * Simple in-memory rate limiter
 * For production, consider using Redis (Upstash) for distributed rate limiting
 */

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

interface RateLimitOptions {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
}

interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
  message?: string
}

/**
 * Rate limit check
 * @param identifier - Unique identifier (IP, user ID, etc.)
 * @param options - Rate limit options
 * @returns Rate limit result
 */
export function rateLimit(
  identifier: string,
  options: RateLimitOptions = { windowMs: 60000, maxRequests: 10 }
): RateLimitResult {
  const now = Date.now()
  const key = identifier

  // Clean up expired entries periodically (every 1000 requests)
  if (Math.random() < 0.001) {
    for (const k in store) {
      if (store[k].resetTime < now) {
        delete store[k]
      }
    }
  }

  // Get or create entry
  let entry = store[key]

  if (!entry || entry.resetTime < now) {
    // Create new entry or reset expired one
    entry = {
      count: 0,
      resetTime: now + options.windowMs
    }
    store[key] = entry
  }

  // Check if limit exceeded
  if (entry.count >= options.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
      message: `Rate limit exceeded. Please try again after ${Math.ceil((entry.resetTime - now) / 1000)} seconds.`
    }
  }

  // Increment count
  entry.count++

  return {
    success: true,
    remaining: options.maxRequests - entry.count,
    resetTime: entry.resetTime
  }
}

/**
 * Get client identifier from request
 */
export function getClientIdentifier(request: Request): string {
  // Try to get IP from various headers (for Vercel/proxies)
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  
  const ip = forwardedFor?.split(',')[0] || realIp || cfConnectingIp || 'unknown'
  
  return ip
}

