export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="pageWrap loaderWrap" role="status" aria-live="polite">
      <div className="loaderCard glass">
        <div className="spinner" aria-hidden="true" />
        <div className="loaderLabel">{label}</div>
      </div>
    </div>
  )
}

