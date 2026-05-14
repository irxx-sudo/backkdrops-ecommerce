import { useEffect, useMemo, useState } from 'react'

const LS_SHIPPING_KEY = 'backkdrops_shipping_v1'

function safeJsonParse(s, fallback) {
  try {
    const v = JSON.parse(s)
    return v ?? fallback
  } catch {
    return fallback
  }
}

function loadAll() {
  const raw = localStorage.getItem(LS_SHIPPING_KEY)
  return safeJsonParse(raw, {})
}

function saveAll(obj) {
  localStorage.setItem(LS_SHIPPING_KEY, JSON.stringify(obj))
}

export default function ShippingAddress({ session, onShippingSaved }) {
  const userKey = useMemo(() => session?.userId || session?.email || 'guest', [session])

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
  })

  const [savedMsg, setSavedMsg] = useState('')

  useEffect(() => {
    if (!userKey) return
    const all = loadAll()
    const existing = all[userKey]
    if (!existing) return

    setForm({
      fullName: existing.fullName || '',
      phone: existing.phone || '',
      address1: existing.address1 || '',
      address2: existing.address2 || '',
      city: existing.city || '',
      state: existing.state || '',
      postalCode: existing.postalCode || '',
      country: existing.country || 'United States',
    })
  }, [userKey])

  const update = (k) => (e) => {
    setForm((prev) => ({ ...prev, [k]: e.target.value }))
    setSavedMsg('')
  }

  const requiredOk =
    form.fullName.trim() &&
    form.phone.trim() &&
    form.address1.trim() &&
    form.city.trim() &&
    form.state.trim() &&
    form.postalCode.trim()

  const save = () => {
    const all = loadAll()
    all[userKey] = {
      fullName: form.fullName,
      phone: form.phone,
      address1: form.address1,
      address2: form.address2,
      city: form.city,
      state: form.state,
      postalCode: form.postalCode,
      country: form.country,
    }
    saveAll(all)
    const msg = 'Demo: shipping address submitted.'
    setSavedMsg(msg)
    onShippingSaved?.(msg)
    setTimeout(() => setSavedMsg(''), 2000)
  }

  return (
    <section id="shipping" className="section sectionAlt">
      <div className="sectionHeader">
        <div>
          <div className="eyebrow">Customer shipping address</div>
          <h2 className="sectionTitle">Where should we deliver?</h2>
          <p className="sectionSubtitle">Submit your address to continue checkout (demo).</p>
        </div>
      </div>

      <div className="shippingCard glass">
        <div className="shippingGrid">
          <div className="field">
            <label className="label" htmlFor="shipName">
              Full name
            </label>
            <input id="shipName" className="input" value={form.fullName} onChange={update('fullName')} />
          </div>

          <div className="field">
            <label className="label" htmlFor="shipPhone">
              Phone
            </label>
            <input
              id="shipPhone"
              className="input"
              value={form.phone}
              onChange={update('phone')}
              placeholder="e.g. +1 555 0100"
            />
          </div>

          <div className="field shippingSpan2">
            <label className="label" htmlFor="ship1">
              Address line 1
            </label>
            <input id="ship1" className="input" value={form.address1} onChange={update('address1')} />
          </div>

          <div className="field shippingSpan2">
            <label className="label" htmlFor="ship2">
              Address line 2 (optional)
            </label>
            <input id="ship2" className="input" value={form.address2} onChange={update('address2')} />
          </div>

          <div className="field">
            <label className="label" htmlFor="shipCity">
              City
            </label>
            <input id="shipCity" className="input" value={form.city} onChange={update('city')} />
          </div>

          <div className="field">
            <label className="label" htmlFor="shipState">
              State
            </label>
            <input id="shipState" className="input" value={form.state} onChange={update('state')} />
          </div>

          <div className="field">
            <label className="label" htmlFor="shipZip">
              Postal code
            </label>
            <input id="shipZip" className="input" value={form.postalCode} onChange={update('postalCode')} />
          </div>

          <div className="field">
            <label className="label" htmlFor="shipCountry">
              Country
            </label>
            <input id="shipCountry" className="input" value={form.country} onChange={update('country')} />
          </div>
        </div>

        <div className="shippingActions">
          <button
            className="btn btnGhost"
            type="button"
            onClick={() => window.location.hash = '#top'}
          >
            Back to top
          </button>
          <button className="btn btnPrimary" type="button" onClick={save} disabled={!requiredOk}>
            Submit address
          </button>
        </div>

        {savedMsg && <div className="shippingSaved">{savedMsg}</div>}
      </div>
    </section>
  )
}

