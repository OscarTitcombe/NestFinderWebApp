export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Copyright */}
          <div className="text-slate-600 text-sm mb-4 md:mb-0">
            © {currentYear} NestFinder. All rights reserved.
          </div>

          {/* Footer Links */}
          <div className="flex space-x-6">
            <a 
              href="/privacy" 
              className="text-slate-600 hover:text-dark transition-colors text-sm"
            >
              Privacy
            </a>
            <a 
              href="/terms" 
              className="text-slate-600 hover:text-dark transition-colors text-sm"
            >
              Terms
            </a>
            <a 
              href="/contact" 
              className="text-slate-600 hover:text-dark transition-colors text-sm"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
