import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

const categories = [
  { id:'Muzika',  icon:'ti-music',           label:'Muzika'  },
  { id:'Barai',   icon:'ti-glass',           label:'Barai'   },
  { id:'Maistas', icon:'ti-tools-kitchen-2', label:'Maistas' },
  { id:'Sportas', icon:'ti-ball-football',   label:'Sportas' },
  { id:'Kultura', icon:'ti-building',        label:'Kultūra' },
  { id:'Lauke',   icon:'ti-trees',           label:'Lauke'   },
]

const colors = {
  Muzika:  '#f87171',
  Barai:   '#a78bfa',
  Maistas: '#fbbf24',
  Sportas: '#f97316',
  Kultura: '#38bdf8',
  Lauke:   '#4ade80',
}

export default function Prideti() {
  const { user }                        = useAuth()
  const navigate                        = useNavigate()
  const [name, setName]                 = useState('')
  const [location, setLocation]         = useState('')
  const [date, setDate]                 = useState('')
  const [time, setTime]                 = useState('')
  const [desc, setDesc]                 = useState('')
  const [contact, setContact]           = useState('')
  const [price, setPrice]               = useState('')
  const [isFree, setIsFree]             = useState(true)
  const [cats, setCats]                 = useState([])
  const [success, setSuccess]           = useState(false)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')

  const toggleCat = (id) => setCats(c => c.includes(id) ? c.filter(x=>x!==id) : [...c,id])

  const geocode = async (locationStr) => {
    try {
      const query = encodeURIComponent(locationStr + ', Kaunas, Lithuania')
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`)
      const data = await res.json()
      if (data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
      }
    } catch (err) {
      console.error('Geocoding failed:', err)
    }
    return { lat: 54.8985, lng: 23.9280 }
  }

  const submit = async () => {
    setError('')

    // Check if logged in
    if (!user) {
      navigate('/login')
      return
    }

    if (!name || !location || !date || !time) {
      setError('Prašome užpildyti visus privalomus laukus (*)')
      return
    }
    if (cats.length === 0) {
      setError('Pasirinkite bent vieną kategoriją')
      return
    }

    setLoading(true)

    try {
      const coords = await geocode(location)

      const eventData = {
        name,
        location,
        description: desc,
        lat:         coords.lat,
        lng:         coords.lng,
        category:    cats[0],
        starts_at:   `${date} ${time}:00`,
        is_free:     isFree,
        price:       isFree ? null : parseFloat(price),
        color:       colors[cats[0]] || '#4ade80',
        contact,
        source:      'user',
      }

      await api.post('/api/events', eventData)
      setSuccess(true)

    } catch (err) {
      console.error('Failed to save event:', err)
      setError('Nepavyko išsaugoti renginio. Bandykite dar kartą.')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setName(''); setLocation(''); setDate(''); setTime('')
    setDesc(''); setContact(''); setPrice(''); setIsFree(true)
    setCats([]); setSuccess(false); setError('')
  }

  if (success) return (
    <div className="flex flex-col flex-1 items-center justify-center gap-5 p-6 bg-[#0f0f0f]">
      <div className="w-20 h-20 rounded-full bg-[#0d1a0d] border-2 border-[#4ade80] flex items-center justify-center">
        <i className="ti ti-check text-4xl text-[#4ade80]"></i>
      </div>
      <div className="text-center">
        <div className="text-xl font-bold text-white mb-2">Renginys paskelbtas!</div>
        <div className="text-sm text-[#555]">Tavo renginys dabar matomas žemėlapyje</div>
      </div>
      <button
        onClick={() => window.location.href='/'}
        className="bg-[#4ade80] text-[#0a0a0a] font-bold px-8 py-3 rounded-xl text-sm"
      >
        Žiūrėti žemėlapyje
      </button>
      <button onClick={reset} className="text-sm text-[#555] hover:text-[#888]">
        Pridėti dar vieną
      </button>
    </div>
  )

  return (
    <div className="flex flex-col flex-1 overflow-hidden">

      <div className="bg-[#0f0f0f] px-4 md:px-6 pt-10 md:pt-6 pb-4 border-b border-[#1a1a1a] flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Pridėti renginį</h1>
            <p className="text-xs text-[#555] mt-0.5">Pasidalink tuo, kas vyksta šalia</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 scrollbar-hide pb-24 md:pb-6">
        <div className="max-w-xl mx-auto flex flex-col gap-5">

          {/* Not logged in banner */}
          {!user && (
            <div className="bg-[#1a1a0d] border border-[#fbbf24]/30 rounded-xl px-4 py-3 text-sm text-[#fbbf24] flex items-center justify-between">
              <span>Prisijunk kad galėtum skelbti renginius</span>
              <button
                onClick={() => navigate('/login')}
                className="bg-[#fbbf24] text-[#0a0a0a] font-bold px-3 py-1 rounded-lg text-xs ml-3 flex-shrink-0"
              >
                Prisijungti
              </button>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-[#2a1212] border border-[#f87171]/30 rounded-xl px-4 py-3 text-sm text-[#f87171]">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="text-[10px] text-[#555] font-semibold uppercase tracking-wider block mb-2">
              Pavadinimas *
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={80}
              placeholder="pvz. Gyvoji muzika bare..."
              className="w-full bg-[#161616] border border-[#252525] focus:border-[#4ade80] rounded-xl px-3 py-2.5 text-sm text-white outline-none placeholder-[#444] transition-colors"
            />
            <div className="text-[10px] text-[#444] text-right mt-1">{name.length}/80</div>
          </div>

          {/* Category */}
          <div>
            <label className="text-[10px] text-[#555] font-semibold uppercase tracking-wider block mb-2">
              Kategorija *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => toggleCat(c.id)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all cursor-pointer ${
                    cats.includes(c.id)
                      ? 'bg-[#0d1a0d] border-[#4ade80] text-[#4ade80]'
                      : 'bg-[#161616] border-[#252525] text-[#444] hover:border-[#333]'
                  }`}
                >
                  <i className={`ti ${c.icon} text-xl`}></i>
                  <span className="text-[10px] font-medium">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-[10px] text-[#555] font-semibold uppercase tracking-wider block mb-2">
              Vieta * <span className="text-[#333] normal-case font-normal">(gatvė arba vietos pavadinimas Kaune)</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="pvz. Laisvės alėja 93, Kauno pilis..."
              className="w-full bg-[#161616] border border-[#252525] focus:border-[#4ade80] rounded-xl px-3 py-2.5 text-sm text-white outline-none placeholder-[#444] transition-colors"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-[#555] font-semibold uppercase tracking-wider block mb-2">
                Data *
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-[#161616] border border-[#252525] focus:border-[#4ade80] rounded-xl px-3 py-2.5 text-sm text-white outline-none transition-colors"
                style={{colorScheme:'dark'}}
              />
            </div>
            <div>
              <label className="text-[10px] text-[#555] font-semibold uppercase tracking-wider block mb-2">
                Laikas *
              </label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full bg-[#161616] border border-[#252525] focus:border-[#4ade80] rounded-xl px-3 py-2.5 text-sm text-white outline-none transition-colors"
                style={{colorScheme:'dark'}}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] text-[#555] font-semibold uppercase tracking-wider block mb-2">
              Aprašymas
            </label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              maxLength={300}
              placeholder="Trumpai apie renginį..."
              rows={3}
              className="w-full bg-[#161616] border border-[#252525] focus:border-[#4ade80] rounded-xl px-3 py-2.5 text-sm text-white outline-none placeholder-[#444] transition-colors resize-none"
            />
            <div className="text-[10px] text-[#444] text-right mt-1">{desc.length}/300</div>
          </div>

          {/* Free toggle */}
          <div
            onClick={() => setIsFree(!isFree)}
            className="flex items-center justify-between bg-[#161616] border border-[#252525] rounded-xl px-4 py-3 cursor-pointer"
          >
            <span className="text-sm text-[#ccc]">Nemokamas renginys</span>
            <div className={`w-10 h-6 rounded-full relative transition-colors ${isFree ? 'bg-[#4ade80]' : 'bg-[#2a2a2a]'}`}>
              <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all ${isFree ? 'left-4' : 'left-0.5'}`}></div>
            </div>
          </div>

          {/* Price */}
          {!isFree && (
            <div>
              <label className="text-[10px] text-[#555] font-semibold uppercase tracking-wider block mb-2">
                Kaina (€)
              </label>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="pvz. 10"
                min={0}
                className="w-full bg-[#161616] border border-[#252525] focus:border-[#4ade80] rounded-xl px-3 py-2.5 text-sm text-white outline-none placeholder-[#444] transition-colors"
              />
            </div>
          )}

          {/* Contact */}
          <div>
            <label className="text-[10px] text-[#555] font-semibold uppercase tracking-wider block mb-2">
              Kontaktai (neprivaloma)
            </label>
            <input
              type="text"
              value={contact}
              onChange={e => setContact(e.target.value)}
              placeholder="El. paštas, tel. nr. arba nuoroda..."
              className="w-full bg-[#161616] border border-[#252525] focus:border-[#4ade80] rounded-xl px-3 py-2.5 text-sm text-white outline-none placeholder-[#444] transition-colors"
            />
          </div>

          {/* Submit */}
          <button
            onClick={submit}
            disabled={loading}
            className={`w-full font-bold py-3.5 rounded-xl text-sm transition-opacity ${
              loading
                ? 'bg-[#2a2a2a] text-[#666] cursor-not-allowed'
                : 'bg-[#4ade80] text-[#0a0a0a] hover:opacity-90'
            }`}
          >
            {loading ? 'Išsaugoma...' : 'Paskelbti renginį'}
          </button>

          <div className="h-4"></div>
        </div>
      </div>

    </div>
  )
}