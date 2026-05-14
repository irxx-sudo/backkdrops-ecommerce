export default function ProductCard({ product, onAddToCart }) {
  const title = product?.title || 'Untitled product'
  const description = product?.description || 'Premium fashion item'
  const price = Number(product?.price ?? 0)

  const category = product?.category || 'Uncategorized'
  const image = product?.image

  const formatPrice = (n) => {
    if (!Number.isFinite(n)) return '$0'
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(n)
  }

  return (
    <article className="productCard glass" aria-label={title}>
      <div className="productMedia">
        {image ? (
          <img
            src={image}
            alt={title}
            className="productImage"
            loading="lazy"
          />
        ) : (
          <div className="imagePlaceholder" aria-hidden="true">
            <div className="placeholderGlow" />
            <div className="placeholderText">FASHION</div>
          </div>
        )}
        <div className="productTag">{category}</div>
      </div>

      <div className="productBody">
        <h3 className="productTitle">{title}</h3>
        <p className="productDesc">{description}</p>

        <div className="productFooter">
          <div className="productPrice">{formatPrice(price)}</div>
          <button
            className="btn btnPrimary btnRipple"
            type="button"
            onClick={() => onAddToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  )
}

