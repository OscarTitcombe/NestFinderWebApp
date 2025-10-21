import PostcodeSearch from './PostcodeSearch'

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-white to-light py-16 sm:py-24">
      <div className="container-custom">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Headline */}
          <h1 className="heading-primary">
            See who's buying in your area.
          </h1>
          
          {/* Subheading */}
          <p className="subheading max-w-2xl mx-auto">
            Buyers post what they want. Sellers browse demand and connect directly — fewer middlemen.
          </p>

          {/* Postcode Search */}
          <div className="mt-12">
            <PostcodeSearch />
          </div>
        </div>
      </div>
    </section>
  )
}
