export default function Hero({ onCta }) {
  return (
    <section id="top" className="heroWrap">
      <div className="heroBg" aria-hidden="true">
        <div className="blob blobA" />
        <div className="blob blobB" />
        <div className="blob blobC" />
        <div className="gridGlow" />
      </div>

      <div className="heroInner">
        <div className="heroCopy">
          <div className="eyebrow">
            <span className="dot" />
            Luxury fashion • crafted for motion
          </div>

          <h1 className="heroTitle">
            Dark essentials.
            <span className="heroTitleAccent"> Premium</span> by design.
          </h1>

          <p className="heroSubtitle">
            Minimal silhouettes, glass-smooth cards, and a cart experience built for speed.
          </p>

          <div className="heroActions">
            <button className="btn btnPrimary btnRipple" type="button" onClick={onCta}>
              Shop the collection
            </button>
            <a className="btn btnGhost" href="#products">
              Explore products
            </a>
          </div>

          <div className="heroBadges" aria-hidden="true">
            <div className="badge glass">Free returns</div>
            <div className="badge glass">Secure checkout</div>
            <div className="badge glass">New drops weekly</div>
          </div>
        </div>

        <div className="heroVisual glass" aria-hidden="true">
          <div className="visualRing" />
          <div className="visualLines" />
          <div className="visualMark">FS</div>
          <div className="visualCaption">Black luxury UI</div>
        </div>
      </div>

      {/* Entrance animation hook */}
      <div className="heroEnter" aria-hidden="true" />
    </section>
  )
}

