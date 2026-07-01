import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useAuth } from '../context/AuthContext'
import api from '../api'

function makeIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="width:20px;height:20px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.3);box-shadow:0 2px 8px rgba(0,0,0,0.5)"></div>`,
    iconSize: [20,20], iconAnchor: [10,10],
  })
}

export default function EventDetail() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const { user }  = useAuth()
  const [event, setEvent]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved]     = useState(false)
  const [going, setGoing]     = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    setLoading(true)
    api.get(`/api/events/${id}`)
      .then(res => setEvent(res.data.data))
      .catch(() => setError('Renginys nerastas'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (user) {
      api.get('/api/saved-events')
        .then(res => setSaved(res.data.data.some(e => e.id === parseInt(id))))
        .catch(() => {})
    }
  }, [user, id])

  const toggleSave = async () => {
    if (!user) { navigate('/login'); return }
    try {
      if (saved) {
        await api.delete(`/api/saved-events/${id}`)
        setSaved(false)
      } else {
        await api.post(`/api/saved-events/${id}`)
        setSaved(true)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const toggleGoing = async () => {
    if (!user) { navigate('/login'); return }
    try {
      const res = await api.post(`/api/events/${id}/going`)
      setGoing(res.data.going)
      setEvent(e => ({ ...e, going_count: res.data.going_count }))
    } catch (err) {
      console.error(err)
    }
  }

  const share = () => {
    if (navigator.share) {
      navigator.share({ title: event.name, text: event.location, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Nuoroda nukopijuota!')
    }
  }

  const report = async () => {
    if (!user) { navigate('/login'); return }
    if (!window.confirm('Pranešti apie si renginį?')) return
    try {
      await api.post(`/api/events/${id}/report`, { reason: 'Inappropriate content' })
      alert('Aciu! Pranesimas gautas.')
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return (
    <div className="flex flex-col flex-1 items-center justify-center bg-[#0f0f0f]">
      <div className="text-sm text-[#444]">Kraunama...</div>
    </div>
  )

  if (error || !event) return (
    <div className="flex flex-col flex-1 items-center justify-center gap-4 bg-[#0f0f0f] p-6">
      <div className="text-sm text-[#555]">{error || 'Renginys nerastas'}</div>
      <button onClick={() => navigate('/')} className="text-[#4ade80] text-sm">
        Grizti i zemėlapį
      </button>
    </div>
  )

  return (
    <div className="flex flex-col flex-1 overflow-hidden">

      {/* Header */}
      <div className="bg-[#0f0f0f] px-4 md:px-6 pt-10 md:pt-6 pb-3 border-b border-[#1a1a1a] flex-shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[#888] flex-shrink-0"
          >
            <i className="ti ti-arrow-left text-lg"></i>
          </button>
          <h1 className="text-base font-semibold text-white truncate">{event.name}</h1>
        </div>
        <div className="flex gap-2 flex-shrink-0 ml-2">
          <button
            onClick={share}
            className="w-9 h-9 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[#888] hover:border-[#4ade80] hover:text-[#4ade80] transition-colors"
          >
            <i className="ti ti-share text-base"></i>
          </button>
          <button
            onClick={report}
            className="w-9 h-9 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[#888] hover:border-[#f87171] hover:text-[#f87171] transition-colors"
          >
            <i className="ti ti-flag text-base"></i>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide pb-24 md:pb-6">
        <div className="max-w-2xl mx-auto">

          {/* Mini map */}
          <div className="h-48 md:h-64 relative">
            <MapContainer
              center={[event.lat, event.lng]}
              zoom={15}
              className="w-full h-full"
              zoomControl={false}
              attributionControl={false}
              dragging={false}
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                className="map-dark"
              />
              <Marker position={[event.lat, event.lng]} icon={makeIcon(event.color)} />
            </MapContainer>
          </div>

          <div className="px-4 md:px-6 py-5">

            {/* Title */}
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white mb-1">{event.name}</h2>
              <div className="flex items-center gap-1 text-sm text-[#888]">
                <i className="ti ti-map-pin text-[#4ade80] text-sm"></i>
                <span>{event.location}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex gap-2 flex-wrap mb-5">
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                event.time_label === 'Dabar'
                  ? 'bg-[#2a1212] text-[#f87171]'
                  : event.time_label?.includes('min')
                  ? 'bg-[#261f08] text-[#fbbf24]'
                  : 'bg-[#0d1f0d] text-[#4ade80]'
              }`}>
                {event.time_label}
              </span>

              {/* Only show free/paid badge for user posted events */}
              {event.source !== 'kaunaspilnasrenginiu' && (
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  event.is_free
                    ? 'bg-[#0d1f0d] text-[#4ade80]'
                    : 'bg-[#1a1a0d] text-[#fbbf24]'
                }`}>
                  {event.is_free ? 'Nemokama' : `${event.price} EUR`}
                </span>
              )}

              <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-[#1a1a2a] text-[#a78bfa]">
                {event.category}
              </span>
            </div>

            {/* Description */}
            {event.description && (
              <div className="mb-5">
                <div className="text-[10px] text-[#444] font-semibold uppercase tracking-wider mb-2">
                  Aprašymas
                </div>
                <p className="text-sm text-[#ccc] leading-relaxed">{event.description}</p>
              </div>
            )}

            {/* Going count */}
            <div className="flex items-center gap-2 mb-5 text-sm text-[#888]">
              <i className="ti ti-users text-[#4ade80]"></i>
              <span>
                <strong className="text-white">{event.going_count}</strong> žmonės eina
              </span>
            </div>

            {/* Contact */}
            {event.contact && (
              <div className="mb-5">
                <div className="text-[10px] text-[#444] font-semibold uppercase tracking-wider mb-2">
                  Kontaktai
                </div>
                <div className="text-sm text-[#ccc]">{event.contact}</div>
              </div>
            )}

 {/* Action buttons */}
            <div className="flex gap-3 mt-6">

              {/* Scraped events — Daugiau info button */}
              {event.source === 'kaunaspilnasrenginiu' && (
                <a
                  href={event.ticket_url || 'https://kaunaspilnasrenginiu.lt/lt/renginiai'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 font-bold py-3 rounded-xl text-sm text-center bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] hover:border-[#4ade80] hover:text-[#4ade80] transition-colors flex items-center justify-center gap-2"
                >
                  <span>Daugiau info</span>
                  <i className="ti ti-external-link text-sm"></i>
                </a>
              )}

              {/* User posted paid events — ticket button */}
              {event.source !== 'kaunaspilnasrenginiu' && !event.is_free && event.ticket_url && (
                <a
                  href={event.ticket_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 font-bold py-3 rounded-xl text-sm text-center bg-[#fbbf24] text-[#0a0a0a] hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <span>Pirkti bilietą</span>
                  <i className="ti ti-arrow-right text-sm"></i>
                </a>
              )}

              {/* Going button */}
              <button
                onClick={toggleGoing}
                className={`flex-1 font-bold py-3 rounded-xl text-sm transition-colors ${
                  going
                    ? 'bg-[#0d1f0d] text-[#4ade80] border border-[#4ade80]'
                    : 'bg-[#4ade80] text-[#0a0a0a]'
                }`}
              >
                {going ? '✓ Einu' : 'Einu'}
              </button>

              {/* Save heart */}
              <button
                onClick={toggleSave}
                className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 transition-colors ${
                  saved
                    ? 'bg-[#2a1212] border-[#f87171] text-[#f87171]'
                    : 'bg-[#1a1a1a] border-[#2a2a2a] text-[#888] hover:border-[#f87171]'
                }`}
              >
                <i className={`ti ${saved ? 'ti-heart-filled' : 'ti-heart'} text-lg`}></i>
              </button>

            </div>

            {/* Source link */}
            {event.source === 'kaunaspilnasrenginiu' && (
              <div className="mt-4 text-center">
                <a
                  href="https://kaunaspilnasrenginiu.lt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-[#333] hover:text-[#555] transition-colors"
                >
                  Saltinis: kaunaspilnasrenginiu.lt
                </a>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}