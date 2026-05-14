import { useEffect, useMemo, useState } from 'react'

const LS_USERS_KEY = 'backkdrops_users_v1'
const LS_SESSION_KEY = 'backkdrops_session_v1'

function safeJsonParse(s, fallback) {
  try {
    const v = JSON.parse(s)
    return v ?? fallback
  } catch {
    return fallback
  }
}

function getUsers() {
  const raw = localStorage.getItem(LS_USERS_KEY)
  return safeJsonParse(raw, [])
}

function setUsers(users) {
  localStorage.setItem(LS_USERS_KEY, JSON.stringify(users))
}

function getSession() {
  const raw = localStorage.getItem(LS_SESSION_KEY)
  return safeJsonParse(raw, null)
}

function setSession(session) {
  if (!session) localStorage.removeItem(LS_SESSION_KEY)
  else localStorage.setItem(LS_SESSION_KEY, JSON.stringify(session))
}

export default function AuthPanel({ open, onClose, onAuth }) {
  const [tab, setTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    setError('')
    setLoading(false)
  }, [open])

  const title = useMemo(() => {
    return tab === 'login' ? 'Welcome back' : 'Create your account'
  }, [tab])

  const submit = async () => {
    setError('')
    const e = email.trim().toLowerCase()
    const p = password

    if (!e || !e.includes('@')) return setError('Enter a valid email address.')
    if (!p || p.length < 4) return setError('Password must be at least 4 characters.')

    if (tab === 'signup') {
      const n = name.trim()
      if (!n) return setError('Enter your name.')

      setLoading(true)
      try {
        const users = getUsers()
        const exists = users.some((u) => u.email === e)
        if (exists) return setError('An account with this email already exists.')

        const nextUser = {
          id: crypto.randomUUID(),
          name: n,
          email: e,
          password: p,
        }

        setUsers([...users, nextUser])

        const session = {
          userId: nextUser.id,
          email: nextUser.email,
          name: nextUser.name,
        }
        setSession(session)
        onAuth?.(session)
        onClose?.()
      } finally {
        setLoading(false)
      }

      return
    }

    // login
    setLoading(true)
    try {
      const users = getUsers()
      const user = users.find((u) => u.email === e)
      if (!user) return setError('No account found for this email.')
      if (user.password !== p) return setError('Incorrect password.')

      const session = { userId: user.id, email: user.email, name: user.name }
      setSession(session)
      onAuth?.(session)
      onClose?.()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // If already authenticated and panel opens, reset to login.
    const session = getSession()
    if (open && session) setTab('login')
  }, [open])

  useEffect(() => {
    if (!open) return
    // reset fields when opening
    setEmail('')
    setPassword('')
    setName('')
    setError('')
    setLoading(false)
    setTab('login')
  }, [open])

  if (!open) return null

  return (
    <div className="authOverlay open" role="dialog" aria-modal="true" aria-label="Authentication">
      <div className="authBackdrop" onClick={onClose} />

      <div className="authCard glass">
        <div className="authHeader">
          <div>
            <div className="authKicker">Backkdrops</div>
            <div className="authTitle">{title}</div>
          </div>
          <button className="iconBtn" type="button" onClick={onClose} aria-label="Close auth">
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        <div className="authTabs" role="tablist" aria-label="Auth tabs">
          <button
            type="button"
            className={`tabBtn ${tab === 'login' ? 'active' : ''}`}
            onClick={() => setTab('login')}
            role="tab"
            aria-selected={tab === 'login'}
          >
            Login
          </button>
          <button
            type="button"
            className={`tabBtn ${tab === 'signup' ? 'active' : ''}`}
            onClick={() => setTab('signup')}
            role="tab"
            aria-selected={tab === 'signup'}
          >
            Sign up
          </button>
        </div>

        <div className="authBody">
          <div className="authFields">
            {tab === 'signup' && (
              <div className="field">
                <label className="label" htmlFor="authName">
                  Name
                </label>
                <input
                  id="authName"
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </div>
            )}

            <div className="field">
              <label className="label" htmlFor="authEmail">
                Email
              </label>
              <input
                id="authEmail"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="authPassword">
                Password
              </label>
              <input
                id="authPassword"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••"
                autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            {error && <div className="authError">{error}</div>}

            <button className="btn btnPrimary" type="button" onClick={submit} disabled={loading}>
              {loading ? 'Please wait…' : tab === 'login' ? 'Login' : 'Create account'}
            </button>

            <div className="authFinePrint">Demo auth only: credentials stored in your browser (localStorage).</div>
          </div>
        </div>
      </div>
    </div>
  )
}

