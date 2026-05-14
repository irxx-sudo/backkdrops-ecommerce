import { useCallback, useMemo, useState } from 'react'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Cart from './components/Cart'
import Home from './pages/Home'
import AuthPanel from './components/AuthPanel'
import ShippingAddress from './components/ShippingAddress'



import './App.css'

/**
 * App: central state for cart + layout wiring.
 */
export default function App() {
  const LS_SESSION_KEY = 'backkdrops_session_v1'
  const [authOpen, setAuthOpen] = useState(false)
  const [session, setSessionState] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_SESSION_KEY) || 'null')
    } catch {
      return null
    }
  })
  const [welcomeMsg, setWelcomeMsg] = useState('')
  const [shippingMsg, setShippingMsg] = useState('')

  const [cartOpen, setCartOpen] = useState(false)

  // Store cart as an object keyed by product key.
  const [cartMap, setCartMap] = useState({})

  const cartCount = useMemo(() => {
    return Object.values(cartMap).reduce((sum, it) => sum + it.qty, 0)
  }, [cartMap])

  const onOpenCart = () => setCartOpen(true)

  const onAuth = (nextSession) => {
    setSessionState(nextSession)
    setWelcomeMsg(`Welcome, ${nextSession?.name || 'customer'}!`)
    setTimeout(() => setWelcomeMsg(''), 2500)
  }

  const onLogout = () => {
    localStorage.removeItem(LS_SESSION_KEY)
    setSessionState(null)
    setWelcomeMsg('Logged out.')
    setTimeout(() => setWelcomeMsg(''), 2000)
  }

  const openAuth = () => setAuthOpen(true)
  const closeAuth = () => setAuthOpen(false)

  const onCloseCart = () => setCartOpen(false)

  const normalizeKey = (product) => product?.id ?? product?.slug ?? product?.title

  const addToCart = useCallback((product) => {
    const key = normalizeKey(product)
    if (key === undefined || key === null) return

    setCartMap((prev) => {
      const existing = prev[key]
      const price = Number(product?.price ?? 0)
      const category = product?.category || 'Uncategorized'

      const nextItem = existing
        ? { ...existing, qty: existing.qty + 1 }
        : {
            key,
            title: product?.title || 'Untitled product',
            description: product?.description || '',
            price: Number.isFinite(price) ? price : 0,
            category,
            image: product?.image || '',
            qty: 1,
            lineTotal: Number.isFinite(price) ? price : 0,
          }

      if (existing) {
        nextItem.lineTotal = nextItem.price * nextItem.qty
      }

      return {
        ...prev,
        [key]: nextItem,
      }
    })

    setCartOpen(true)
  }, [])

  const removeFromCart = useCallback((key) => {
    setCartMap((prev) => {
      const copy = { ...prev }
      delete copy[key]
      return copy
    })
  }, [])

  const incQty = useCallback((key) => {
    setCartMap((prev) => {
      const it = prev[key]
      if (!it) return prev
      const next = { ...it, qty: it.qty + 1 }
      next.lineTotal = next.price * next.qty
      return { ...prev, [key]: next }
    })
  }, [])

  const decQty = useCallback((key) => {
    setCartMap((prev) => {
      const it = prev[key]
      if (!it) return prev
      const nextQty = it.qty - 1
      if (nextQty <= 0) {
        const copy = { ...prev }
        delete copy[key]
        return copy
      }
      const next = { ...it, qty: nextQty }
      next.lineTotal = next.price * next.qty
      return { ...prev, [key]: next }
    })
  }, [])

  const clearCart = useCallback(() => setCartMap({}), [])

  const checkout = useCallback(() => {
    // Demo-only: premium UI usually shows a success state.
    alert('Checkout is a demo in this project.');
  }, [])

  const cartItems = useMemo(() => {
    return Object.values(cartMap)
      .map((it) => ({
        ...it,
        lineTotal: it.price * it.qty,
      }))
      .sort((a, b) => String(a.title).localeCompare(String(b.title)))
  }, [cartMap])

  const getCartCount = () => cartCount

  const onCta = () => {
    const el = document.querySelector('#products')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="appRoot">
      <Navbar
        onOpenCart={onOpenCart}
        cartCount={cartCount}
        onOpenAuth={openAuth}
        session={session}
        onLogout={onLogout}
      />
      <Hero onCta={onCta} />

      <Home onAddToCart={addToCart} getCartCount={getCartCount} />

      {welcomeMsg && <div className="welcomeToast glass">{welcomeMsg}</div>}
      {shippingMsg && <div className="welcomeToast glass">{shippingMsg}</div>}


      {/* Extra premium sections (visual only) */}
      <section id="features" className="section sectionAlt">
        <div className="featureGrid">
          <div className="featureCard glass">
            <div className="featureIcon" aria-hidden="true">⚡</div>
            <div className="featureTitle">Fast checkout</div>
            <div className="featureText">Smooth cart sidebar and instant quantity updates.</div>
          </div>
          <div className="featureCard glass">
            <div className="featureIcon" aria-hidden="true">🖤</div>
            <div className="featureTitle">Dark premium design</div>
            <div className="featureText">Glassmorphism, custom typography, and luxury motion.</div>
          </div>
          <div className="featureCard glass">
            <div className="featureIcon" aria-hidden="true">🛡️</div>
            <div className="featureTitle">Reliable loading</div>
            <div className="featureText">Beautiful loading + error handling for the API.</div>
          </div>
        </div>
      </section>

      <ShippingAddress session={session} onShippingSaved={(m) => setShippingMsg(m)} />

      <section id="support" className="section supportSection">
        <div className="supportPanel glass">
          <div className="supportTitle">Need help?</div>
          <div className="supportText">
            This is a demo UI. Cart actions are fully functional, while checkout is simulated.
          </div>
          <div className="supportActions">
            <button className="btn btnGhost" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Back to top
            </button>
            <button className="btn btnPrimary" type="button" onClick={onOpenCart}>
              Open cart ({cartCount})
            </button>
          </div>
        </div>
      </section>

      <AuthPanel
        open={authOpen}
        onClose={closeAuth}
        onAuth={onAuth}
      />

      <Cart
        open={cartOpen}
        onClose={onCloseCart}

        items={cartItems}
        onRemove={removeFromCart}
        onInc={incQty}
        onDec={decQty}
        onClear={clearCart}
        onCheckout={checkout}
      />
    </div>
  )
}

