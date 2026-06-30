import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

const tabs = ['Išsaugoti','Einu','Sąrašai']

export default function Issaugoti() {
  const { user }                 = useAuth()
  const navigate                 = useNavigate()
  const [activeTab, setActiveTab] = useState('Išsaugoti')
  const [saved, setSaved]         = useState([])
  const [loadingSaved, setLoadingSaved] = useState(false)

  useEffect(() => {
    if (user && activeTab === 'Išsaugoti') {
      setLoadingSaved(true)
      api.get('/api/saved-events')
        .then(res => setSaved(res.data.data))
        .catch(err => console.error(err))
        .finally(() => setLoadingSaved(false))
    }
  }, [user, activeTab])

  const remove = async (id) => {
    try {
      await api.delete(`/api/saved-events/${id}`)
      setSaved(s => s.filter(e => e.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const getBadgeStyle = (timeLabel) => {
    if (timeLabel === 'Dabar') return 'bg-[#2a1212] text-[#f87171]'
    if (timeLabel?.includes('min')) return 'bg-[#261f08] text-[#fbbf24]'
    return 'bg-[#0d1f0d] text-[#4ade80]'
  }

  if (!user) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center gap-4 bg-[#0f0f0f] p-6">
        <div className="w-16 h-16 rounded-full bg-[#161616] border border-[#252525] flex items-center justify-center">
          <i className="ti ti-heart text-3xl text-[#333]"></i>
        </div>
        <div className="text-sm text-[#555] text-center">Prisijunk kad matytum išsaugotus renginius</div>
        <button onClick={() => navigate('/login')} className="bg-[#4ade80] text-[#0a0a0a] font-bold px-6 py-2.5 rounded-xl text-sm">
          Prisijungti
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">

      <div className="bg-[#0f0f0f] px-4 md:px-6 pt-10 md:pt-6 pb-3 border-b border-[#1a1a1a] flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-white">Išsaugoti</h1>
            <p className="text-xs text-[#555] mt-0.5">{saved.length} renginiai išsaugoti</p>
          </div>
        </div>

        <div className="flex gap-1 bg-[#161616] rounded-xl p-1">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 text-xs font-medium py-2 rounded-lg transition-all cursor-pointer border-none ${
                activeTab===t ? 'bg-[#0f0f0f] text-white' : 'text-[#555] hover:text-[#888]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 scrollbar-hide pb-24 md:pb-6">
        <div className="max-w-xl mx-auto">

          {activeTab === 'Išsaugoti' && (
            <>
              {loadingSaved && (
                <div className="text-center text-sm text-[#444] py-12">Kraunama...</div>
              )}

              {!loadingSaved && saved.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#161616] border border-[#252525] flex items-center justify-center">
                    <i className="ti ti-heart text-3xl text-[#333]"></i>
                  </div>
                  <div className="text-sm font-semibold text-[#555]">Nieko neišsaugota</div>
                  <div className="text-xs text-[#333] text-center">Atidaryk renginį ir paspausk širdelę kad išsaugotum</div>
                  <button onClick={() => navigate('/')} className="bg-[#4ade80] text-[#0a0a0a] font-bold px-5 py-2 rounded-xl text-xs">
                    Naršyti renginius
                  </button>
                </div>
              )}

              {!loadingSaved && saved.length > 0 && (
                <div>
                  <div className="text-[10px] text-[#444] font-semibold uppercase tracking-wider mb-3">Tavo sąrašas</div>
                  {saved.map(ev => (
                    <div
                      key={ev.id}
                      onClick={() => navigate(`/event/${ev.id}`)}
                      className="flex gap-3 items-start bg-[#161616] border border-[#222] hover:border-[#4ade80] rounded-xl p-3 mb-2 cursor-pointer transition-colors"
                    >
                      <div className="w-0.5 rounded self-stretch flex-shrink-0" style={{background:ev.color}}></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white">{ev.name}</div>
                        <div className="text-xs text-[#555] mt-0.5 mb-2">{ev.location}</div>
                        <div className="flex gap-1.5">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                            ev.is_free ? 'bg-[#0d1f0d] text-[#4ade80]' : 'bg-[#1a1a0d] text-[#fbbf24]'
                          }`}>{ev.is_free ? 'Nemokama' : `€${ev.price}`}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-medium bg-[#1a1a2a] text-[#a78bfa]">{ev.category}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${getBadgeStyle(ev.time_label)}`}>
                          {ev.time_label}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); remove(ev.id) }}
                          className="text-[#333] hover:text-[#f87171] transition-colors"
                        >
                          <i className="ti ti-x text-base"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'Einu' && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-14 h-14 rounded-full bg-[#161616] border border-[#252525] flex items-center justify-center">
                <i className="ti ti-walk text-2xl text-[#333]"></i>
              </div>
              <div className="text-sm text-[#555] text-center">Greitai galėsi matyti visus renginius<br/>kuriuose pažymėjai "Einu"</div>
            </div>
          )}

          {activeTab === 'Sąrašai' && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-14 h-14 rounded-full bg-[#161616] border border-[#252525] flex items-center justify-center">
                <i className="ti ti-list text-2xl text-[#333]"></i>
              </div>
              <div className="text-sm text-[#555] text-center">Asmeniniai sąrašai bus prieinami<br/>artimiausiu metu</div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}