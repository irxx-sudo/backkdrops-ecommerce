import { useEffect } from 'react'

/**
 * Cart sidebar slide-in.
 * Props are controlled by App state.
 */
export default function Cart({
  open,
  onClose,
  items,
  onRemove,
  onInc,
  onDec,
  onClear,
  onCheckout,
}) {
  const total = items.reduce((sum, it) => sum + it.lineTotal, 0)

  useEffect(() => {
    if (!open) return

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  const formatPrice = (n) => {
    if (!Number.isFinite(n)) return '$0'
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(n)
  }

  return (
    <>
      <div
        className={`cartOverlay ${open ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        className={`cartSidebar glass ${open ? 'open' : ''}`}
        aria-hidden={!open}
        aria-label="Shopping cart"
      >
        <div className="cartHeader">
          <div>
            <div className="cartKicker">Your selection</div>
            <div className="cartTitle">Shopping Cart</div>
          </div>

          <button className="iconBtn" onClick={onClose} aria-label="Close cart">
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        <div className="cartBody">
          {items.length === 0 ? (
            <div className="cartEmpty">
              <div className="cartEmptyIcon" aria-hidden="true">
                🛒
              </div>
              <div className="cartEmptyTitle">Cart is empty</div>
              <div className="cartEmptyText">
                Add items to experience premium style.
              </div>
            </div>
          ) : (
            <ul className="cartList">
              {items.map((it) => (
                <li className="cartItem" key={it.key}>
                  <div className="cartItemMedia">
                    {it.image ? (
                      <img
                        className="cartItemImg"
                        src={it.image}
                        alt={it.title}
                      />
                    ) : (
                      <div className="cartItemImg placeholderGlow" aria-hidden="true" />
                    )}
                  </div>

                  <div className="cartItemInfo">
                    <div className="cartItemTop">
                      <div className="cartItemTitle">{it.title}</div>
                      <button
                        className="textBtn"
                        type="button"
                        onClick={() => onRemove(it.key)}
                      >
                        Remove
                      </button>
                    </div>

                    <div className="cartItemMeta">
                      <span className="cartItemPrice">{formatPrice(it.price)}</span>
                      <span className="dot">•</span>
                      <span className="cartItemCat">{it.category}</span>
                    </div>

                    <div className="qtyRow">
                      <button
                        className="qtyBtn"
                        type="button"
                        onClick={() => onDec(it.key)}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <div className="qtyValue" aria-label={`Quantity ${it.qty}`}>
                        {it.qty}
                      </div>
                      <button
                        className="qtyBtn"
                        type="button"
                        onClick={() => onInc(it.key)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                      <div className="lineTotal">{formatPrice(it.lineTotal)}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="cartFooter">
          <div className="totals">
            <div className="totalsRow">
              <span className="totalsLabel">Total</span>
              <span className="totalsValue">{formatPrice(total)}</span>
            </div>
            <div className="finePrint">Taxes and shipping calculated at checkout.</div>
          </div>

          <div className="cartActions">
            <button
              className="btn btnGhost"
              onClick={onClear}
              disabled={items.length === 0}
            >
              Clear
            </button>
            <button
              className="btn btnPrimary"
              onClick={onCheckout}
              disabled={items.length === 0}
            >
              Checkout
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

