import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

const chips = ['all','Muzika','Maistas','Sportas','Kultūra','Nemokama']
const sorts = ['Atstumas','Prasideda','Nemokama','Populiaru']

export default function Visi() {
  const navigate = useNavigate()
  const [events, setEvents]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('all')
  const [sort, setSort]       = useState('Prasideda')
  const [sortOpen, setSortOpen] = useState(false)
  const [liked, setLiked]     = useState([])

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      try {
        const params = {}
        if (filter !== 'all') params.category = filter
        if (search) params.search = search
        const res = await api.get('/api/events', { params })
        setEvents(res.data.data)
      } catch (err) {
        console.error('Failed to fetch events:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [filter, search])

  const toggleLike = (id, e) => {
    e.stopPropagation()
    setLiked(l => l.includes(id) ? l.filter(x=>x!==id) : [...l,id])
  }

  const getBadgeStyle = (timeLabel) => {
    if (timeLabel === 'Dabar') return 'bg-[#2a1212] text-[#f87171]'
    if (timeLabel?.includes('min')) return 'bg-[#261f08] text-[#fbbf24]'
    return 'bg-[#0d1f0d] text-[#4ade80]'
  }

  const EventRow = ({ ev }) => (
    <div
      onClick={() => navigate(`/event/${ev.id}`)}
      className="flex gap-3 items-start bg-[#161616] border border-[#222] hover:border-[#4ade80] rounded-xl p-3 mb-2 cursor-pointer transition-colors"
    >
      <div className="w-0.5 rounded self-stretch flex-shrink-0" style={{background:ev.color}}></div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-white">{ev.name}</div>
        <div className="text-xs text-[#555] mt-0.5 mb-2">{ev.location}</div>
        <div className="flex gap-1.5 flex-wrap">
          <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
            ev.is_free ? 'bg-[#0d1f0d] text-[#4ade80]' : 'bg-[#1a1a0d] text-[#fbbf24]'
          }`}>
            {ev.is_free ? 'Nemokama' : `€${ev.price}`}
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded font-medium bg-[#1a1a2a] text-[#a78bfa]">
            {ev.category}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${getBadgeStyle(ev.time_label)}`}>
          {ev.time_label}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-[#555]">
            <i className="ti ti-users text-[10px]"></i> {ev.going_count}
          </span>
          <button
            onClick={(e) => toggleLike(ev.id, e)}
            className={`text-base transition-colors ${liked.includes(ev.id) ? 'text-[#f87171]' : 'text-[#333] hover:text-[#666]'}`}
          >
            <i className={`ti ${liked.includes(ev.id) ? 'ti-heart-filled' : 'ti-heart'}`}></i>
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col flex-1 overflow-hidden">

      <div className="bg-[#0f0f0f] px-4 md:px-6 pt-10 md:pt-6 pb-3 border-b border-[#1a1a1a] flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-white">Visi renginiai</h1>
            <p className="text-xs text-[#555] mt-0.5">{loading ? 'Kraunama...' : `${events.length} renginiai šiandien`}</p>
          </div>
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs text-[#888] cursor-pointer hover:border-[#4ade80] transition-colors"
            >
              <i className="ti ti-arrows-sort text-sm"></i>
              {sort}
              <i className="ti ti-chevron-down text-xs"></i>
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-10 bg-[#161616] border border-[#2a2a2a] rounded-xl overflow-hidden z-50 min-w-40">
                {sorts.map(s => (
                  <button key={s} onClick={() => { setSort(s); setSortOpen(false); }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors border-b border-[#1a1a1a] last:border-0 cursor-pointer ${
                      sort===s ? 'text-[#4ade80] bg-[#0d1a0d]' : 'text-[#888] hover:text-[#fff] hover:bg-[#1a1a1a]'
                    }`}>{s}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#252525] rounded-xl px-3 py-2.5 mb-3 focus-within:border-[#4ade80] transition-colors">
          <i className="ti ti-search text-[#555]"></i>
          <input
            type="text"
            placeholder="Ieškoti renginių..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm text-white flex-1 placeholder-[#444]"
          />
          {search && <i className="ti ti-x text-[#444] cursor-pointer" onClick={() => setSearch('')}></i>}
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {chips.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap border-none transition-all cursor-pointer ${
                filter===c ? 'bg-[#4ade80] text-[#0a0a0a]' : 'bg-[#1e1e1e] text-[#777] hover:text-[#aaa]'
              }`}>
              {c==='all' ? 'Visi' : c}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 scrollbar-hide pb-24 md:pb-4">

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-sm text-[#444]">Kraunama...</div>
          </div>
        )}

        {!loading && events.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-14 h-14 rounded-full bg-[#161616] border border-[#252525] flex items-center justify-center">
              <i className="ti ti-calendar-off text-2xl text-[#333]"></i>
            </div>
            <div className="text-sm text-[#555]">Nerasta renginių</div>
            <div className="text-xs text-[#333] text-center">Pabandykite pakeisti filtrus arba paiešką</div>
          </div>
        )}

        {!loading && events.length > 0 && (
          <>
            <div className="text-[10px] text-[#444] font-semibold uppercase tracking-wider mb-3">
              Šiandien ir artimiausiu metu
            </div>
            {events.map(ev => <EventRow key={ev.id} ev={ev} />)}
          </>
        )}

      </div>
    </div>
  )
}