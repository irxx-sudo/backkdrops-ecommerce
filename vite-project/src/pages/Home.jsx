import { useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'

import ProductGrid from '../components/ProductGrid'
import SearchBar from '../components/SearchBar'
import Loader from '../components/Loader'

const API_URL = 'https://json-placeholder-niche.onrender.com/fashion'

/**
 * Home page: fetches products from the fashion API,
 * provides search + category filtering, and renders ProductGrid.
 */
export default function Home({ onAddToCart, getCartCount }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  const abortRef = useRef(null)

  useEffect(() => {
    const controller = new AbortController()
    abortRef.current = controller

    async function fetchProducts() {
      setLoading(true)
      setError('')

      try {
        const res = await axios.get(API_URL, {
          signal: controller.signal,
          timeout: 15000,
        })

        // Robust parsing: API might return array or object with an items field.
        const data = res?.data
        const itemsRaw = Array.isArray(data) ? data : data?.items

        if (!Array.isArray(itemsRaw)) {
          throw new Error('Unexpected API response format.')
        }

        // Normalize whatever schema the API returns into the fields our UI expects.
        // This fixes: product names/images being the same + search/filter not matching.
        const normalizeProduct = (p) => {
          const title =
            p?.title ??
            p?.name ??
            p?.productName ??
            p?.product_name ??
            p?.label ??
            ''

          const description =
            p?.description ?? p?.desc ?? p?.details ?? p?.detail ?? ''

          const priceRaw = p?.price ?? p?.cost ?? p?.amount ?? p?.value
          const price = Number(priceRaw ?? 0)

          const category =
            p?.category ?? p?.type ?? p?.tag ?? p?.group ?? 'Uncategorized'

          const image = p?.image ?? p?.img ?? p?.imageUrl ?? p?.url ?? ''

          const id = p?.id ?? p?._id ?? p?.slug ?? p?.sku

          return {
            ...p,
            id,
            title,
            description,
            price: Number.isFinite(price) ? price : 0,
            category,
            image,
          }
        }

        const normalized = itemsRaw.map(normalizeProduct)
        setProducts(normalized)
      } catch (e) {
        if (e?.name === 'CanceledError' || e?.code === 'ERR_CANCELED') return
        setError(
          e?.message ||
            'Failed to load fashion products. Please check your connection and try again.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()

    return () => controller.abort()
  }, [])

  // Derive categories from data; gracefully handle missing category.
  const categories = useMemo(() => {
    const set = new Set()
    for (const p of products) {
      const c = p?.category || 'Uncategorized'
      set.add(c)
    }
    return ['All', ...Array.from(set)]
  }, [products])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    return products.filter((p) => {
      const title = (p?.title || '').toString()
      const desc = (p?.description || '').toString()
      const pCategory = p?.category || 'Uncategorized'

      const matchesQuery =
        !q || title.toLowerCase().includes(q) || desc.toLowerCase().includes(q)

      const matchesCategory = category === 'All' || pCategory === category

      return matchesQuery && matchesCategory
    })
  }, [products, query, category])

  const productSectionId = 'products'

  if (loading) return <Loader label="Loading fashion collections..." />

  if (error) {
    return (
      <div className="pageWrap">
        <div className="errorPanel glass">
          <div className="errorTitle">Couldn’t load products</div>
          <div className="errorText">{error}</div>
          <div className="errorActions">
            <button
              className="btn btnPrimary"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
            <a className="btn btnGhost" href={`#${productSectionId}`}>
              Browse anyway
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="main">
      <section className="section">
        <div className="sectionHeader">
          <div>
            <div className="eyebrow">Curated drops</div>
            <h2 className="sectionTitle">Premium essentials. Built for motion.</h2>
            <p className="sectionSubtitle">
              Search by name, filter by category, and add to cart in seconds.
            </p>
          </div>

          <div className="sectionMeta">
            <div className="metaPill glass">
              <span className="metaValue">{filtered.length}</span>
              <span className="metaLabel">items</span>
            </div>
            <div className="metaPill glass">
              <span className="metaValue">{getCartCount()}</span>
              <span className="metaLabel">in cart</span>
            </div>
          </div>
        </div>

        <div className="controls">
          <SearchBar
            query={query}
            setQuery={setQuery}
            category={category}
            setCategory={setCategory}
            categories={categories}
          />
        </div>

        <div id={productSectionId} className="gridWrap">
          <ProductGrid products={filtered} onAddToCart={onAddToCart} />
        </div>
      </section>
    </main>
  )
}

