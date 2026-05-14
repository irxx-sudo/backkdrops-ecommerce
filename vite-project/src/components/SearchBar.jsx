export default function SearchBar({
  query,
  setQuery,
  category,
  setCategory,
  categories = ['All'],
}) {
  return (
    <div className="searchBar glass" role="search">
      <div className="field">
        <label className="label" htmlFor="searchInput">
          Search
        </label>
        <input
          id="searchInput"
          className="input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. jacket, sneakers, denim..."
          autoComplete="off"
        />
      </div>

      <div className="field">
        <label className="label" htmlFor="categorySelect">
          Category
        </label>
        <select
          id="categorySelect"
          className="select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="searchActions">
        <button
          className="btn btnGhost"
          type="button"
          onClick={() => {
            setQuery('')
            setCategory('All')
          }}
        >
          Reset
        </button>
      </div>
    </div>
  )
}

