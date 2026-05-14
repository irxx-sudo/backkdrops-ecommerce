import { useEffect, useMemo, useState } from 'react'

function CartIcon({ count }) {
  return (
    <div className="cartIconWrap" aria-label={`Cart has ${count} items`}>
      <span className="cartIcon" aria-hidden="true">
        🛍️
      </span>
      {count > 0 && <span className="cartCount">{count}</span>}
    </div>
  )
}

/**
 * Sticky premium navbar with mobile hamburger menu.
 */
export default function Navbar({ onOpenCart, cartCount, onOpenAuth, session, onLogout }) {
  const isAuthed = Boolean(session?.userId || session?.email)

  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 860) setMenuOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const navItems = useMemo(
    () => [
      { label: 'Collections', href: '#products' },
      { label: 'Features', href: '#features' },
      { label: 'Support', href: '#support' },
    ],
    []
  )

  const onNavClick = (href) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    else window.location.hash = href
  }

  return (
    <header className="navbarWrap">
      <div className="navbar glass">

        <button
          className="brand"
          type="button"
          onClick={() => onNavClick('#top')}
          aria-label="Go to top"
        >
          <span className="brandMark" aria-hidden="true">
            ◼︎
          </span>
          <span className="brandLogoWrap" aria-hidden="true">
            <img className="brandLogo" src="/src/assets/backkdrops-logo.svg" alt="" />
          </span>
          <span className="brandText">Backkdrops</span>

        </button>

        <nav className="navLinks" aria-label="Primary navigation">
          {navItems.map((it) => (
            <button
              key={it.href}
              className="navLink"
              type="button"
              onClick={() => onNavClick(it.href)}
            >
              {it.label}
            </button>
          ))}
        </nav>

        <div className="navRight">
          <button className="iconBtn" type="button" onClick={onOpenCart}>
            <CartIcon count={cartCount} />
          </button>


          <button
            className="hamburger"
            type="button"
            onClick={() => setMenuOpen((s) => !s)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <span className={`hamburgerLines ${menuOpen ? 'open' : ''}`} />
          </button>
        </div>
      </div>

      <div className={`mobileMenu glass ${menuOpen ? 'open' : ''}`}>
        {navItems.map((it) => (
          <button
            key={it.href}
            className="mobileLink"
            type="button"
            onClick={() => onNavClick(it.href)}
          >
            {it.label}
          </button>
        ))}

        <button className="mobileLink" type="button" onClick={() => onOpenCart()}>
          Cart ({cartCount})
        </button>

        {isAuthed ? (
          <button className="mobileLink" type="button" onClick={onLogout}>
            Logout
          </button>
        ) : (
          <button className="mobileLink" type="button" onClick={onOpenAuth}>
            Login / Signup
          </button>
        )}
      </div>
    </header>
  )
}

