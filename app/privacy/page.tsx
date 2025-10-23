export default function PrivacyPage() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="min-h-screen bg-light">
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-dark mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-slate-600">
              Last updated: {currentYear}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12">
            <div className="prose prose-slate max-w-none">
              {/* Information We Collect */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-dark mb-6">
                  Information We Collect
                </h2>
                <div className="space-y-4 text-slate-600">
                  <p>
                    We collect information you provide directly to us, such as when you create an account, 
                    post a property brief, or contact other users through our platform.
                  </p>
                  <p>
                    This may include your name, email address, property preferences, budget information, 
                    and any messages you send to other users.
                  </p>
                  <p>
                    We also automatically collect certain information about your device and usage of our 
                    services, including your IP address, browser type, and pages visited.
                  </p>
                </div>
              </section>

              {/* How We Use It */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-dark mb-6">
                  How We Use It
                </h2>
                <div className="space-y-4 text-slate-600">
                  <p>
                    We use the information we collect to provide, maintain, and improve our services, 
                    including connecting buyers and sellers in the property market.
                  </p>
                  <p>
                    Your contact information is used to facilitate communication between users through 
                    our secure email relay system, protecting your privacy while enabling connections.
                  </p>
                  <p>
                    We may also use your information to send you important updates about our services, 
                    respond to your inquiries, and ensure the security of our platform.
                  </p>
                </div>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-2xl font-bold text-dark mb-6">
                  Contact
                </h2>
                <div className="space-y-4 text-slate-600">
                  <p>
                    If you have any questions about this Privacy Policy or our data practices, 
                    please contact us at:
                  </p>
                  <div className="bg-[#F5F5F5] rounded-lg p-4">
                    <p className="font-medium text-dark mb-2">NestFinder Support</p>
                    <p>Email: privacy@nestfinder.com</p>
                    <p>Address: [Your Business Address]</p>
                  </div>
                  <p>
                    We will respond to your inquiry within 48 hours and work to address any 
                    concerns you may have about your privacy and data protection.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

