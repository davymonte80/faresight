"use client";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-700 bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 mt-16">
      <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4 text-foreground">
              FareSight
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Smart flight search engine with real-time price tracking and
              intelligent filtering.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Features</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Flight Search
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Price Tracking
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Inspiration
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Booking
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Company</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Terms
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Connect</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <a
                  href="https://github.com/davymonte80"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/david-monte-228a91387/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            © 2026 FareSight. Created by{" "}
            <a
              href="https://github.com/davymonte80"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              David Monte
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
