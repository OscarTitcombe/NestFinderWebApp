export default function StructuredData() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.nestfinder.co.uk'
  
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'NestFinder',
    url: siteUrl,
    logo: `${siteUrl}/logo-v3.png`,
    description: 'Browse buyer interest in your area or upload your property brief. Connect buyers and sellers before properties are listed.',
    sameAs: [
      // Add social media URLs when available
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      // Add email when available
    }
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Property Matching Service',
    provider: {
      '@type': 'Organization',
      name: 'NestFinder',
    },
    description: 'Browse buyer interest in your area or upload your property brief. Connect buyers and sellers before properties are listed. Pre-market property matching service.',
    areaServed: {
      '@type': 'Country',
      name: 'United Kingdom',
    },
    offers: {
      '@type': 'Offer',
      description: 'Pre-market property matching service',
    }
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'NestFinder',
    url: siteUrl,
    description: 'Browse buyer interest or upload your property brief. Pre-market property matching.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/market?postcode={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  // JSON-LD structured data - valid in body or head
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  )
}

