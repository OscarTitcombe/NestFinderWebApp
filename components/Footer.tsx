export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#F5F5F5] border-t border-slate-200">
      <div className="nf-container py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Copyright */}
          <div className="text-slate-600 text-sm mb-4 md:mb-0">
            © {currentYear} NestFinder. All rights reserved.
          </div>

          {/* Footer Links */}
          <div className="flex space-x-6">
            <a 
              href="/privacy" 
              className="text-slate-600 hover:text-[#101314] transition-colors text-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-lg px-1 py-1"
            >
              Privacy
            </a>
            <a 
              href="/terms" 
              className="text-slate-600 hover:text-[#101314] transition-colors text-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-lg px-1 py-1"
            >
              Terms
            </a>
            <a 
              href="/contact" 
              className="text-slate-600 hover:text-[#101314] transition-colors text-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-lg px-1 py-1"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
