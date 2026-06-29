import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const badges = [
  { icon:'★', color:'#fbbf24', name:'Tyrinėtojas',    sub:'5+ miestų'    },
  { icon:'♪', color:'#f87171', name:'Muzikos fanai',  sub:'20+ koncertų' },
  { icon:'⬡', color:'#4ade80', name:'Vietinis',       sub:'Kaunas pro'   },
  { icon:'✦', color:'#a78bfa', name:'Beta vartotojas',sub:'Pirmas!'      },
]

const prefs = [
  { id:'muzika',  icon:'ti-music',           label:'Muzika'  },
  { id:'maistas', icon:'ti-tools-kitchen-2', label:'Maistas' },
  { id:'sportas', icon:'ti-ball-football',   label:'Sportas' },
  { id:'kultura', icon:'ti-building',        label:'Kultūra' },
  { id:'barai',   icon:'ti-glass',           label:'Barai'   },
  { id:'free',    icon:'ti-ticket',          label:'Nemokama'},
]

const menuItems = [
  { icon:'ti-bell',     color:'#a78bfa', bg:'#1a1a2a', label:'Pranešimai',            badge:'Įjungta' },
  { icon:'ti-map-pin',  color:'#4ade80', bg:'#1a2a1a', label:'Vieta — 2km spindulys', badge:null      },
  { icon:'ti-lock',     color:'#f87171', bg:'#2a1a1a', label:'Privatumas',             badge:null      },
  { icon:'ti-language', color:'#888',    bg:'#1a1a1a', label:'Kalba — Lietuvių',       badge:null      },
  { icon:'ti-help',     color:'#888',    bg:'#1a1a1a', label:'Pagalba',                badge:null      },
]

const recent = [
  { color:'#f87171', name:'Gyvoji muzika — Džiazas', meta:'Keistuoliai · Vakar',           time:'20:00' },
  { color:'#fbbf24', name:'Gatvės maisto mugė',       meta:'Rotušės a. · Šeštadienis',      time:'14:00' },
  { color:'#4ade80', name:'Atviras kinas lauke',      meta:'Santakos parkas · Penktadienis', time:'22:00' },
]

export default function Profilis() {
  const { user, logout }                    = useAuth()
  const navigate                            = useNavigate()
  const [activePref, setActivePref]         = useState(['muzika','maistas','kultura'])
  const [prefSaved, setPrefSaved]           = useState(false)
  const [editing, setEditing]               = useState(false)
  const [tempName, setTempName]             = useState('')

  const togglePref = (id) => {
    setActivePref(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id])
    setPrefSaved(false)
  }

  const savePref = () => {
    setPrefSaved(true)
    setTimeout(() => setPrefSaved(false), 2000)
  }

  const startEdit = () => { setTempName(user?.name || ''); setEditing(true) }
  const saveEdit  = () => { setEditing(false) }

  const handleLogout = async () => {
    if (window.confirm('Ar tikrai nori atsijungti?')) {
      await logout()
      navigate('/login')
    }
  }

  const displayName = user?.name || 'Vartotojas'
  const displayEmail = user?.email || ''

  return (
    <div className="flex flex-col flex-1 overflow-hidden">

      {/* Header */}
      <div className="bg-[#0f0f0f] px-4 md:px-6 pt-10 md:pt-6 pb-4 border-b border-[#1a1a1a] flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Profilis</h1>
          <button className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-[#666] hover:border-[#4ade80] hover:text-[#4ade80] transition-all">
            <i className="ti ti-settings text-base"></i>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide pb-24 md:pb-6">
        <div className="max-w-xl mx-auto">

          {/* Profile hero */}
          <div className="px-4 md:px-6 py-5 border-b border-[#1a1a1a]">
            <div className="flex items-center gap-4 mb-5">
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-[#1a2a1a] border-2 border-[#4ade80] flex items-center justify-center text-2xl font-bold text-[#4ade80]">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#4ade80] rounded-full border-2 border-[#0f0f0f] flex items-center justify-center">
                  <i className="ti ti-check text-[8px] text-[#0a0a0a]"></i>
                </div>
              </div>
              <div className="flex-1">
                {editing ? (
                  <div className="flex gap-2 items-center">
                    <input
                      value={tempName}
                      onChange={e => setTempName(e.target.value)}
                      className="bg-[#161616] border border-[#4ade80] rounded-lg px-2 py-1 text-sm text-white outline-none flex-1"
                      autoFocus
                    />
                    <button onClick={saveEdit} className="text-[#4ade80] text-xs font-semibold">
                      Išsaugoti
                    </button>
                  </div>
                ) : (
                  <div className="text-base font-bold text-white">{displayName}</div>
                )}
                <div className="text-xs text-[#555] mt-0.5">{displayEmail}</div>
                {!editing && (
                  <button
                    onClick={startEdit}
                    className="mt-2 text-xs bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#4ade80] text-[#888] hover:text-[#4ade80] rounded-lg px-3 py-1 transition-colors"
                  >
                    Redaguoti profilį
                  </button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 rounded-xl overflow-hidden border border-[#1a1a1a] mb-5">
              {[['47','Aplankyta'],['12','Išsaugota'],['5','Pridėta']].map(([n,l]) => (
                <div key={l} className="bg-[#161616] py-3 text-center border-r border-[#1a1a1a] last:border-0">
                  <div className="text-xl font-bold text-white">{n}</div>
                  <div className="text-[9px] text-[#444] uppercase tracking-wider mt-0.5">{l}</div>
                </div>
              ))}
            </div>

            {/* Badges */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {badges.map(b => (
                <div key={b.name} className="flex-shrink-0 bg-[#161616] border border-[#252525] rounded-xl px-3 py-2 flex items-center gap-2">
                  <span style={{color:b.color, fontSize:'16px'}}>{b.icon}</span>
                  <div>
                    <div className="text-xs font-semibold text-white whitespace-nowrap">{b.name}</div>
                    <div className="text-[9px] text-[#555]">{b.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent */}
          <div className="px-4 md:px-6 py-4 border-b border-[#1a1a1a]">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] text-[#444] font-semibold uppercase tracking-wider">
                Neseniai aplankyta
              </div>
              <span className="text-[10px] text-[#4ade80] cursor-pointer">Visi →</span>
            </div>
            {recent.map(r => (
              <div key={r.name} className="flex items-center gap-3 py-2.5 border-b border-[#151515] last:border-0 cursor-pointer">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:r.color}}></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-[#ddd] font-medium truncate">{r.name}</div>
                  <div className="text-xs text-[#555] mt-0.5">{r.meta}</div>
                </div>
                <div className="text-xs text-[#444]">{r.time}</div>
              </div>
            ))}
          </div>

          {/* Preferences */}
          <div className="px-4 md:px-6 py-4 border-b border-[#1a1a1a]">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] text-[#444] font-semibold uppercase tracking-wider">
                Mano pomėgiai
              </div>
              <button onClick={savePref} className="text-[10px] text-[#4ade80] cursor-pointer">
                {prefSaved ? 'Išsaugota ✓' : 'Keisti'}
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {prefs.map(p => (
                <button
                  key={p.id}
                  onClick={() => togglePref(p.id)}
                  className={`flex items-center gap-2 p-3 rounded-xl border transition-all cursor-pointer text-left ${
                    activePref.includes(p.id)
                      ? 'bg-[#0d1a0d] border-[#4ade80] text-[#4ade80]'
                      : 'bg-[#161616] border-[#222] text-[#444] hover:border-[#333]'
                  }`}
                >
                  <i className={`ti ${p.icon} text-lg`}></i>
                  <span className="text-xs font-medium">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Not logged in prompt */}
          {!user && (
            <div className="px-4 md:px-6 py-6 border-b border-[#1a1a1a]">
              <div className="bg-[#161616] border border-[#252525] rounded-xl p-4 text-center">
                <div className="text-sm text-[#888] mb-3">Prisijunk kad išsaugotum savo nustatymus</div>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-[#4ade80] text-[#0a0a0a] font-bold px-5 py-2 rounded-xl text-sm"
                  >
                    Prisijungti
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] px-5 py-2 rounded-xl text-sm"
                  >
                    Registruotis
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Settings menu */}
          <div className="px-4 md:px-6 py-4 border-b border-[#1a1a1a]">
            <div className="text-[10px] text-[#444] font-semibold uppercase tracking-wider mb-3">
              Nustatymai
            </div>
            {menuItems.map(m => (
              <div key={m.label} className="flex items-center gap-3 py-3 border-b border-[#151515] last:border-0 cursor-pointer hover:opacity-70 transition-opacity">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:m.bg}}>
                  <i className={`ti ${m.icon} text-lg`} style={{color:m.color}}></i>
                </div>
                <div className="flex-1 text-sm text-[#ccc]">{m.label}</div>
                {m.badge && (
                  <span className="text-[9px] bg-[#4ade8022] text-[#4ade80] px-2 py-0.5 rounded-md">
                    {m.badge}
                  </span>
                )}
                <i className="ti ti-chevron-right text-[#333]"></i>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 md:px-6 py-5 text-center">
            <div className="text-[10px] text-[#2a2a2a] mb-3">eikten.lt · v0.1 beta</div>
            {user ? (
              <button
                onClick={handleLogout}
                className="text-sm text-[#f87171] hover:opacity-70 transition-opacity"
              >
                Atsijungti
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="text-sm text-[#4ade80] hover:opacity-70 transition-opacity"
              >
                Prisijungti
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}