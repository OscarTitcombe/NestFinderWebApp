import PostcodeSearch from './PostcodeSearch'

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-white to-light py-16 sm:py-24">
      <div className="container-custom">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Headline */}
          <h1 className="heading-primary">
            Private, pre-market, home discovery
          </h1>
          
          {/* Subheading */}
          <div className="subheading max-w-2xl mx-auto">
            <p>Find real buyers before you list — or sellers before they go live.</p>
            <p>NestFinder connects people quietly, before the market does.</p>
          </div>

          {/* Postcode Search */}
          <div className="mt-12">
            <PostcodeSearch 
              buttonLabel="Explore your area"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
