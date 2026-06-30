import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import api from '../api'

function haversine(la1,lo1,la2,lo2){
  const R=6371000,r=d=>d*Math.PI/180
  const a=Math.sin(r(la2-la1)/2)**2+Math.cos(r(la1))*Math.cos(r(la2))*Math.sin(r(lo2-lo1)/2)**2
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))
}
function fmtDist(m){ return m<1000?Math.round(m)+'m':(m/1000).toFixed(1)+'km' }

function makeIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="width:20px;height:20px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.3);box-shadow:0 2px 8px rgba(0,0,0,0.5)"></div>`,
    iconSize: [20,20], iconAnchor: [10,10], popupAnchor: [0,-12],
  })
}

const youIcon = L.divIcon({
  className: '',
  html: `<div style="width:16px;height:16px;border-radius:50%;background:#4ade80;border:3px solid #0f0f0f;box-shadow:0 0 0 3px rgba(74,222,128,0.3)"></div>`,
  iconSize: [16,16], iconAnchor: [8,8],
})

export default function Arti() {
  const navigate = useNavigate()
  const [events, setEvents]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [userPos, setUserPos]   = useState([54.8985, 23.9280])
  const [located, setLocated]   = useState(false)
  const [selected, setSelected] = useState(null)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('all')
  const now = new Date()
  const clock = String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0')

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const params = {}
        if (filter !== 'all') params.category = filter
        if (search) params.search = search
        const res = await api.get('/api/events', { params })
        setEvents(res.data.data)
        if (res.data.data.length > 0) setSelected(res.data.data[0].id)
      } catch (err) {
        console.error('Failed to fetch events:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [filter, search])

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(p => {
      setUserPos([p.coords.latitude, p.coords.longitude])
      setLocated(true)
    })
  }, [])

  const chips = ['all','Muzika','Maistas','Sportas','Kultūra','Nemokama']

  const EventCard = ({ ev }) => (
    <div
      onClick={() => navigate(`/event/${ev.id}`)}
      className={`flex gap-3 items-start bg-[#161616] rounded-xl p-3 mb-2 cursor-pointer border transition-colors hover:border-[#4ade80] ${
        selected===ev.id ? 'border-[#4ade80]' : 'border-[#222]'
      }`}
    >
      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{background:ev.color}}></div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-white truncate">{ev.name}</div>
        <div className="text-xs text-[#555] mt-0.5">{ev.location}</div>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${
          ev.time_label==='Dabar' ? 'bg-[#2a1212] text-[#f87171]' :
          ev.time_label?.includes('min') ? 'bg-[#261f08] text-[#fbbf24]' :
          'bg-[#0d1f0d] text-[#4ade80]'
        }`}>{ev.time_label}</span>
        <span className="text-[10px] text-[#4ade80] font-semibold">
          {located ? fmtDist(haversine(userPos[0],userPos[1],ev.lat,ev.lng)) : '...'}
        </span>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col md:flex-row-reverse flex-1 overflow-hidden">

      {/* ── LEFT PANEL (desktop only) ── */}
      <div className="hidden md:flex flex-col w-96 border-l border-[#1a1a1a] bg-[#0f0f0f] flex-shrink-0">
        <div className="px-5 pt-6 pb-4 border-b border-[#1a1a1a]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-lg font-bold text-white">Renginiai šalia</h1>
              <div className="flex items-center gap-1 mt-1">
                <i className="ti ti-map-pin text-[#4ade80] text-xs"></i>
                <span className="text-xs text-[#666]">
                  {located ? `Vieta nustatyta · ${events.length} renginiai` : 'Nustatoma vieta...'}
                </span>
              </div>
            </div>
            <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-2 py-1 text-xs text-[#4ade80] font-semibold">
              <i className="ti ti-clock text-[10px]"></i> {clock}
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
            {search && <i className="ti ti-x text-[#444] cursor-pointer text-sm" onClick={() => setSearch('')}></i>}
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

        <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
          <div className="text-[10px] text-[#444] font-semibold uppercase tracking-wider mb-3">
            Šiandien vakare
          </div>
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-sm text-[#444]">Kraunama...</div>
            </div>
          )}
          {!loading && events.length === 0 && (
            <div className="text-sm text-[#444] text-center py-8">Nerasta renginių</div>
          )}
          {!loading && events.map(ev => <EventCard key={ev.id} ev={ev} />)}
        </div>
      </div>

      {/* ── MAP ── */}
      <div className="flex-1 relative min-h-0">
        <MapContainer
          center={userPos}
          zoom={14}
          className="w-full h-full"
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="map-dark"
          />
          <Marker position={userPos} icon={youIcon} />
          {events.map(ev => (
            <Marker
              key={ev.id}
              position={[ev.lat, ev.lng]}
              icon={makeIcon(ev.color)}
              eventHandlers={{ click: () => setSelected(ev.id) }}
            >
              <Popup>
                <div style={{background:'#111',padding:'8px',borderRadius:'8px',minWidth:'140px'}}>
                  <div style={{fontSize:'12px',fontWeight:600,color:'#fff',marginBottom:'3px'}}>{ev.name}</div>
                  <div style={{fontSize:'10px',color:'#666',marginBottom:'4px'}}>{ev.location}</div>
                  <div style={{fontSize:'10px',color:'#4ade80',fontWeight:600,marginBottom:'6px'}}>{ev.time_label}</div>
                  <a href={`/event/${ev.id}`} style={{fontSize:'10px',color:'#4ade80',fontWeight:600,textDecoration:'underline'}}>
                    Žiūrėti daugiau →
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <div className="md:hidden absolute top-3 right-3 z-[999] bg-[#0f0f0f]/90 border border-[#2a2a2a] rounded-lg px-2 py-1 text-[11px] text-[#4ade80] font-semibold">
          <i className="ti ti-clock text-[10px]"></i> {clock}
        </div>
      </div>

      {/* ── MOBILE event list ── */}
      <div className="md:hidden bg-[#0f0f0f] border-t border-[#1a1a1a] max-h-52 overflow-y-auto flex-shrink-0 px-3 py-2 pb-20">
        <div className="text-[10px] text-[#444] font-semibold uppercase tracking-wider mb-2">
          {search ? 'Paieškos rezultatai' : 'Šiandien vakare'}
        </div>

        <div className="flex items-center gap-2 bg-[#1a1a1a] border border-[#252525] rounded-xl px-3 py-2 mb-3 focus-within:border-[#4ade80] transition-colors">
          <i className="ti ti-search text-[#555] text-sm"></i>
          <input
            type="text"
            placeholder="Ieškoti..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent outline-none text-xs text-white flex-1 placeholder-[#444]"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-2">
          {chips.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className={`rounded-full px-3 py-1 text-[11px] font-medium whitespace-nowrap border-none transition-all cursor-pointer ${
                filter===c ? 'bg-[#4ade80] text-[#0a0a0a]' : 'bg-[#1e1e1e] text-[#777]'
              }`}>
              {c==='all' ? 'Visi' : c}
            </button>
          ))}
        </div>

        {loading && <div className="text-xs text-[#444] text-center py-4">Kraunama...</div>}
        {!loading && events.length === 0 && (
          <div className="text-xs text-[#444] text-center py-4">Nerasta renginių</div>
        )}
        {!loading && events.map(ev => <EventCard key={ev.id} ev={ev} />)}
      </div>

    </div>
  )
}