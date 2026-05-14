import ProductCard from './ProductCard'

export default function ProductGrid({ products, onAddToCart }) {
  if (!products?.length) {
    return (
      <div className="emptyState glass">
        <div className="emptyTitle">No matches</div>
        <div className="emptyText">Try adjusting your search or category filter.</div>
      </div>
    )
  }

  return (
    <div className="productGrid" role="list">
      {products.map((p, idx) => {
        const key = p?.id ?? p?.slug ?? `${p?.title ?? 'product'}-${idx}`
        return (
          <div className="productGridItem" key={key} role="listitem">
            <ProductCard product={p} onAddToCart={onAddToCart} />
          </div>
        )
      })}
    </div>
  )
}

