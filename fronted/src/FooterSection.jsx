/* ----------------------------- FOOTER SECTION ----------------------------- */

export default function FooterSection() {
  return (
    <footer className="bg-black text-gray-400 pt-20 md:pt-24 pb-10 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 md:gap-12">
        
        {/* Brand Column - Full width on smallest mobile, 2 cols on tablet */}
        <div className="col-span-2 md:col-span-3 lg:col-span-2">
          <div className="flex items-center gap-3 mb-6 text-white text-xl font-bold">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.3)]">
              ✨
            </div>
            DocuGrammar
          </div>
          <p className="max-w-sm text-sm md:text-base leading-relaxed">
            AI-powered writing assistant for the modern web. Crafting the future of communication, one sentence at a time.
          </p>

          <div className="flex gap-4 mt-8">
            {[1, 2, 3].map((i) => (
              <a 
                key={i} 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-blue-600 hover:border-blue-500 transition-all duration-300"
              >
                🌐
              </a>
            ))}
          </div>
        </div>

        {/* Product Links */}
        <div className="col-span-1">
          <h4 className="font-semibold text-white mb-5">Product</h4>
          <ul className="space-y-3 text-sm md:text-base">
            {["Features", "Pricing", "API", "Integrations", "Changelog"].map((link) => (
              <li key={link}>
                <a href="#" className="hover:text-blue-400 transition-colors cursor-pointer">{link}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Company Links */}
        <div className="col-span-1">
          <h4 className="font-semibold text-white mb-5">Company</h4>
          <ul className="space-y-3 text-sm md:text-base">
            {["About", "Careers", "Blog", "Contact", "Partners"].map((link) => (
              <li key={link}>
                <a href="#" className="hover:text-blue-400 transition-colors cursor-pointer">{link}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal Links - Moves to its own row on tablet if needed, or stays in line on desktop */}
        <div className="col-span-2 md:col-span-1">
          <h4 className="font-semibold text-white mb-5">Legal</h4>
          <ul className="space-y-3 text-sm md:text-base">
            {["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"].map((link) => (
              <li key={link}>
                <a href="#" className="hover:text-blue-400 transition-colors cursor-pointer">{link}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-16 md:mt-20 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs md:text-sm">
        <p className="text-center md:text-left">
          © {new Date().getFullYear()} DocuGrammar Inc. All rights reserved.
        </p>
        <div className="flex items-center gap-1 text-gray-500">
          <span>Made with</span>
          <span className="text-red-500 animate-pulse">❤️</span>
          <span>globally</span>
        </div>
      </div>
    </footer>
  );
}