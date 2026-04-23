import Link from 'next/link'
import { Roboto } from 'next/font/google'
import './docs.css'

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-roboto' })

const navLinks = [
  { href: '/docs/overview', label: 'Overview' },
  { href: '/docs/architecture', label: 'Architecture' },
  { href: '/docs/api', label: 'API Reference' },
  { href: '/docs/seo', label: 'SEO' },
]

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={roboto.variable}>
      <body className="docs-body">
        <header className="docs-header">
          <Link href="/" className="docs-header-back">← App</Link>
          <span className="docs-header-divider">|</span>
          <Link href="/docs" className="docs-header-title">Global Music Trends</Link>
          <span className="docs-header-badge">docs</span>
        </header>

        <div className="docs-container">
          <nav className="docs-nav">
            <p className="docs-nav-label">Documentation</p>
            <ul className="docs-nav-list">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="docs-nav-link">{label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <main className="docs-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
