export default function TermsPage() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="min-h-screen bg-light">
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-dark mb-4">
              Terms of Use
            </h1>
            <p className="text-lg text-slate-600">
              Last updated: {currentYear}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12">
            <div className="prose prose-slate max-w-none">
              {/* Acceptance of Terms */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-dark mb-6">
                  Acceptance of Terms
                </h2>
                <div className="space-y-4 text-slate-600">
                  <p>
                    By accessing and using NestFinder, you accept and agree to be bound by the terms 
                    and provision of this agreement. If you do not agree to abide by the above, 
                    please do not use this service.
                  </p>
                  <p>
                    These terms apply to all visitors, users, and others who access or use the service. 
                    Your continued use of the platform constitutes acceptance of any modifications 
                    to these terms.
                  </p>
                </div>
              </section>

              {/* Platform Use */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-dark mb-6">
                  Platform Use
                </h2>
                <div className="space-y-4 text-slate-600">
                  <p>
                    NestFinder is a platform that connects property buyers and sellers. Users may post 
                    property briefs, browse buyer demand, and communicate through our secure email relay system.
                  </p>
                  <p>
                    You agree to use the platform only for lawful purposes and in accordance with these terms. 
                    You may not use the service in any way that could damage, disable, overburden, or impair 
                    any NestFinder server or interfere with any other party's use of the service.
                  </p>
                  <p>
                    All content posted on the platform must be accurate, lawful, and not infringe on the 
                    rights of others. We reserve the right to remove content that violates these terms.
                  </p>
                </div>
              </section>

              {/* Limitation of Liability */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-dark mb-6">
                  Limitation of Liability
                </h2>
                <div className="space-y-4 text-slate-600">
                  <p>
                    NestFinder provides a platform for connecting buyers and sellers but does not guarantee 
                    the accuracy of information posted by users or the success of any property transactions.
                  </p>
                  <p>
                    To the maximum extent permitted by law, NestFinder shall not be liable for any indirect, 
                    incidental, special, consequential, or punitive damages, including without limitation, 
                    loss of profits, data, use, goodwill, or other intangible losses.
                  </p>
                  <p>
                    Users are responsible for conducting their own due diligence when engaging with other 
                    users and entering into property transactions. NestFinder is not a party to any 
                    transactions between users.
                  </p>
                </div>
              </section>

              {/* Governing Law */}
              <section>
                <h2 className="text-2xl font-bold text-dark mb-6">
                  Governing Law
                </h2>
                <div className="space-y-4 text-slate-600">
                  <p>
                    These terms shall be governed by and construed in accordance with the laws of the 
                    United Kingdom, without regard to its conflict of law provisions.
                  </p>
                  <p>
                    Any disputes arising from these terms or your use of the platform shall be subject to 
                    the exclusive jurisdiction of the courts of England and Wales.
                  </p>
                  <p>
                    If any provision of these terms is found to be unenforceable or invalid, that provision 
                    will be limited or eliminated to the minimum extent necessary so that these terms will 
                    otherwise remain in full force and effect.
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

