import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const { login }               = useAuth()
  const navigate                = useNavigate()

  const submit = async () => {
    setError('')
    if (!email || !password) { setError('Užpildykite visus laukus'); return }
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError('Neteisingas el. paštas arba slaptažodis')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center p-6 bg-[#0f0f0f]">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <div className="text-3xl font-bold mb-2">eik<span className="text-[#4ade80]">ten</span></div>
          <div className="text-sm text-[#555]">Prisijunk prie savo paskyros</div>
        </div>

        {error && (
          <div className="bg-[#2a1212] border border-[#f87171]/30 rounded-xl px-4 py-3 text-sm text-[#f87171] mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-[10px] text-[#555] font-semibold uppercase tracking-wider block mb-2">El. paštas</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="vardas@gmail.com"
              className="w-full bg-[#161616] border border-[#252525] focus:border-[#4ade80] rounded-xl px-3 py-3 text-sm text-white outline-none placeholder-[#444] transition-colors"
            />
          </div>

          <div>
            <label className="text-[10px] text-[#555] font-semibold uppercase tracking-wider block mb-2">Slaptažodis</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={e => e.key === 'Enter' && submit()}
              className="w-full bg-[#161616] border border-[#252525] focus:border-[#4ade80] rounded-xl px-3 py-3 text-sm text-white outline-none placeholder-[#444] transition-colors"
            />
          </div>

          <button
            onClick={submit}
            disabled={loading}
            className={`w-full font-bold py-3.5 rounded-xl text-sm mt-2 transition-opacity ${
              loading ? 'bg-[#2a2a2a] text-[#666]' : 'bg-[#4ade80] text-[#0a0a0a] hover:opacity-90'
            }`}
          >
            {loading ? 'Jungiamasi...' : 'Prisijungti'}
          </button>
        </div>

        <div className="text-center mt-6 text-sm text-[#555]">
          Neturi paskyros?{' '}
          <Link to="/register" className="text-[#4ade80] hover:opacity-80">
            Registruotis
          </Link>
        </div>

      </div>
    </div>
  )
}