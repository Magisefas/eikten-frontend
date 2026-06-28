import { useState } from 'react'

const events = [
  { id:0, name:'Gyvoji muzika — Džiazas', meta:'Keistuoliai · Laisvės al. 93', time:'Dabar',    color:'#f87171', tags:['Nemokama','Muzika'],  badge:'now'  },
  { id:1, name:'DJ naktis — Techno',       meta:'Hologram Club · Jonavos g.',   time:'22:00',    color:'#a78bfa', tags:['€8','Muzika'],         badge:'later'},
  { id:2, name:'Gatvės maisto mugė',       meta:'Rotušės aikštė · Nemokama',    time:'Po 20min', color:'#fbbf24', tags:['Nemokama','Maistas'],  badge:'soon' },
  { id:3, name:'Standap komedija',         meta:'Kaunas Comedy · Vilniaus g.',  time:'21:00',    color:'#38bdf8', tags:['€12','Kultūra'],       badge:'later'},
  { id:4, name:'Atviras kinas lauke',      meta:'Santakos parkas · 22:00',      time:'22:00',    color:'#4ade80', tags:['Nemokama','Kultūra'],  badge:'later'},
  { id:5, name:'Vinilo plokštelių mugė',   meta:'Meno parkas · Nemokama',       time:'21:30',    color:'#a78bfa', tags:['Nemokama','Muzika'],  badge:'later'},
  { id:6, name:'Krepšinis — Žalgiris',     meta:'Žalgirio arena · 22:30',       time:'22:30',    color:'#f97316', tags:['Nemokama','Sportas'], badge:'later'},
]

const badgeStyle = {
  now:   'bg-[#2a1212] text-[#f87171]',
  soon:  'bg-[#261f08] text-[#fbbf24]',
  later: 'bg-[#0d1f0d] text-[#4ade80]',
}

const badgeLabel = { now:'Dabar', soon:'Po 20min', later:'Vėliau' }

const groups = [
  { label:'Dabar vyksta',    items: events.filter(e => e.badge==='now')   },
  { label:'Prasideda netrukus', items: events.filter(e => e.badge==='soon')  },
  { label:'Vėliau šiandien', items: events.filter(e => e.badge==='later') },
]

const chips = ['all','Muzika','Maistas','Sportas','Kultūra','Nemokama']
const sorts = ['Atstumas','Prasideda','Nemokama','Populiaru']

export default function Visi() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('Atstumas')
  const [sortOpen, setSortOpen] = useState(false)
  const [liked, setLiked] = useState([])

  const filtered = events.filter(e =>
    (filter==='all' || e.tags.includes(filter)) &&
    (e.name.toLowerCase().includes(search.toLowerCase()) ||
     e.meta.toLowerCase().includes(search.toLowerCase()))
  )

  const toggleLike = (id) => setLiked(l => l.includes(id) ? l.filter(x=>x!==id) : [...l,id])

  const EventRow = ({ ev }) => (
    <div className="flex gap-3 items-start bg-[#161616] border border-[#222] hover:border-[#4ade80] rounded-xl p-3 mb-2 cursor-pointer transition-colors">
      <div className="w-0.5 rounded self-stretch flex-shrink-0" style={{background:ev.color}}></div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-white">{ev.name}</div>
        <div className="text-xs text-[#555] mt-0.5 mb-2">{ev.meta}</div>
        <div className="flex gap-1.5 flex-wrap">
          {ev.tags.map(t => (
            <span key={t} className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
              t==='Nemokama' ? 'bg-[#0d1f0d] text-[#4ade80]' :
              t.startsWith('€') ? 'bg-[#1a1a0d] text-[#fbbf24]' :
              'bg-[#1a1a2a] text-[#a78bfa]'
            }`}>{t}</span>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${badgeStyle[ev.badge]}`}>
          {badgeLabel[ev.badge]}
        </span>
        <button
          onClick={() => toggleLike(ev.id)}
          className={`text-base transition-colors ${liked.includes(ev.id) ? 'text-[#f87171]' : 'text-[#333] hover:text-[#666]'}`}
        >
          <i className={`ti ${liked.includes(ev.id) ? 'ti-heart-filled' : 'ti-heart'}`}></i>
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col flex-1 overflow-hidden">

      {/* Top bar */}
      <div className="bg-[#0f0f0f] px-4 md:px-6 pt-10 md:pt-6 pb-3 border-b border-[#1a1a1a] flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-white">Visi renginiai</h1>
            <p className="text-xs text-[#555] mt-0.5">{filtered.length} renginiai šiandien</p>
          </div>
          {/* Sort button */}
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

        {/* Search */}
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

        {/* Filters */}
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

      {/* Event list */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 scrollbar-hide pb-24 md:pb-4">
        {search || filter!=='all' ? (
          <>
            <div className="text-[10px] text-[#444] font-semibold uppercase tracking-wider mb-3">
              Rezultatai · {filtered.length}
            </div>
            {filtered.length === 0 && (
              <div className="text-sm text-[#444] text-center py-12">Nerasta renginių</div>
            )}
            {filtered.map(ev => <EventRow key={ev.id} ev={ev} />)}
          </>
        ) : (
          groups.map(g => g.items.length > 0 && (
            <div key={g.label} className="mb-4">
              <div className="text-[10px] text-[#444] font-semibold uppercase tracking-wider mb-3">{g.label}</div>
              {g.items.map(ev => <EventRow key={ev.id} ev={ev} />)}
            </div>
          ))
        )}
      </div>

    </div>
  )
}