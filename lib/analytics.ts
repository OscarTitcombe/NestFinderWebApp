/**
 * Analytics tracking helper
 * Supports Vercel Analytics and can be extended with other providers
 */

/**
 * Track a custom event
 * Note: Custom events require Vercel Pro/Enterprise plan
 * For free tier, events are logged to console in development
 */
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window === 'undefined') return

  // Vercel Analytics (requires Pro/Enterprise for custom events)
  // For now, we'll use it and it will work if you upgrade
  try {
    // Dynamic import to avoid SSR issues
    import('@vercel/analytics').then(({ track }) => {
      track(eventName, properties)
    }).catch(() => {
      // Vercel Analytics not available or custom events not enabled
      // This is fine - page views still work on free tier
    })
  } catch {
    // Ignore errors
  }

  // Development logging (always works)
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics Event:', eventName, properties || '')
  }
}

/**
 * Track page view
 */
export function trackPageView(path: string) {
  if (typeof window === 'undefined') return

  // Vercel Analytics automatically tracks page views
  // But we can track custom page views if needed
  trackEvent('page_view', { path })

  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Page View:', path)
  }
}

// Pre-defined analytics events for NestFinder
export const analytics = {
  // User actions
  signup: (method: 'email' = 'email') => {
    trackEvent('user_signup', { method })
  },

  signin: (method: 'email' = 'email') => {
    trackEvent('user_signin', { method })
  },

  signout: () => {
    trackEvent('user_signout')
  },

  // Buyer actions
  buyerRequestPosted: (data: {
    budget_min: number
    budget_max: number
    beds_min: number
    beds_max?: number
    property_type: string
    postcode_districts: string[]
  }) => {
    trackEvent('buyer_request_posted', {
      budget_min: data.budget_min,
      budget_max: data.budget_max,
      beds_min: data.beds_min,
      beds_max: data.beds_max || data.beds_min,
      property_type: data.property_type,
      postcode_count: data.postcode_districts.length,
      postcodes: data.postcode_districts.join(',')
    })
  },

  buyerRequestEdited: (requestId: string) => {
    trackEvent('buyer_request_edited', { request_id: requestId })
  },

  buyerRequestDeleted: (requestId: string) => {
    trackEvent('buyer_request_deleted', { request_id: requestId })
  },

  buyerRequestPaused: (requestId: string) => {
    trackEvent('buyer_request_paused', { request_id: requestId })
  },

  buyerRequestActivated: (requestId: string) => {
    trackEvent('buyer_request_activated', { request_id: requestId })
  },

  // Seller actions
  sellerContacted: (data: {
    buyer_request_id: string
    budget_min: number
    budget_max: number
  }) => {
    trackEvent('seller_contacted_buyer', {
      buyer_request_id: data.buyer_request_id,
      budget_min: data.budget_min,
      budget_max: data.budget_max
    })
  },

  // Search & browsing
  postcodeSearched: (postcode: string, normalizedPostcode?: string) => {
    trackEvent('postcode_searched', {
      postcode,
      normalized_postcode: normalizedPostcode || postcode
    })
  },

  marketPageViewed: (postcode?: string, buyerCount?: number) => {
    trackEvent('market_page_viewed', {
      postcode: postcode || null,
      buyer_count: buyerCount || 0
    })
  },

  // Contact & messaging
  contactModalOpened: (buyerId: string) => {
    trackEvent('contact_modal_opened', { buyer_id: buyerId })
  },

  messageRead: (contactId: string) => {
    trackEvent('message_read', { contact_id: contactId })
  },

  // Navigation
  pageView: (path: string) => {
    trackPageView(path)
  }
}

