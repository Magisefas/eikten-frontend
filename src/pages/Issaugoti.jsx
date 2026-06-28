import { useState } from 'react'

const savedEvents = [
  { id:0, name:'Gyvoji muzika — Džiazas', meta:'Keistuoliai · Šiandien · 20:00', color:'#f87171', tags:['Nemokama','Muzika'],  badge:'now',   notify:true  },
  { id:1, name:'Gatvės maisto mugė',       meta:'Rotušės a. · Šiandien · 21:30',  color:'#fbbf24', tags:['Nemokama','Maistas'], badge:'soon',  notify:false },
  { id:2, name:'DJ naktis — Techno',       meta:'Hologram Club · Rytoj · 22:00',  color:'#a78bfa', tags:['€8','Muzika'],        badge:'later', notify:false },
  { id:3, name:'Standap komedija',         meta:'Kaunas Comedy · Rytoj · 21:00',  color:'#38bdf8', tags:['€12','Kultūra'],      badge:'later', notify:false },
]

const goingEvents = [
  { id:4, name:'Atviras kinas lauke', meta:'Santakos parkas · 22:00', color:'#4ade80', going:34  },
  { id:5, name:'Krepšinis — Žalgiris', meta:'Žalgirio arena · 22:30', color:'#f97316', going:128 },
]

const lists = [
  { id:0, name:'Muzikos vakarai',        icon:'ti-music',  color:'#a78bfa', bg:'#1a1a2a', count:6 },
  { id:1, name:'Nemokama šį savaitgalį', icon:'ti-ticket', color:'#4ade80', bg:'#1a2a1a', count:4 },
  { id:2, name:'Karšti taškai',          icon:'ti-flame',  color:'#f97316', bg:'#2a1a1a', count:3 },
]

const tabs = ['Išsaugoti','Einu','Sąrašai']

export default function Issaugoti() {
  const [activeTab, setActiveTab] = useState('Išsaugoti')
  const [saved, setSaved] = useState(savedEvents.map(e => e.id))

  const remove = (id) => setSaved(s => s.filter(x => x !== id))
  const visible = savedEvents.filter(e => saved.includes(e.id))

  const today = visible.filter(e => e.meta.includes('Šiandien'))
  const tomorrow = visible.filter(e => e.meta.includes('Rytoj'))

  return (
    <div className="flex flex-col flex-1 overflow-hidden">

      {/* Header */}
      <div className="bg-[#0f0f0f] px-4 md:px-6 pt-10 md:pt-6 pb-3 border-b border-[#1a1a1a] flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-white">Išsaugoti</h1>
            <p className="text-xs text-[#555] mt-0.5">{visible.length} renginiai išsaugoti</p>
          </div>
          {activeTab === 'Išsaugoti' && visible.length > 0 && (
            <button
              onClick={() => setSaved([])}
              className="text-xs text-[#555] hover:text-[#f87171] transition-colors"
            >
              Išvalyti viską
            </button>
          )}
        </div>

        {/* Tabs */}
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

          {/* Saved tab */}
          {activeTab === 'Išsaugoti' && (
            <>
              {visible.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#161616] border border-[#252525] flex items-center justify-center">
                    <i className="ti ti-heart text-3xl text-[#333]"></i>
                  </div>
                  <div className="text-sm font-semibold text-[#555]">Nieko neišsaugota</div>
                  <div className="text-xs text-[#333] text-center">Spausk širdelę prie renginio kad išsaugotum</div>
                </div>
              )}

              {today.length > 0 && (
                <div className="mb-4">
                  <div className="text-[10px] text-[#444] font-semibold uppercase tracking-wider mb-3">Šiandien</div>
                  {today.map(ev => (
                    <div key={ev.id} className="flex gap-3 items-start bg-[#161616] border border-[#222] rounded-xl p-3 mb-2">
                      <div className="w-0.5 rounded self-stretch flex-shrink-0" style={{background:ev.color}}></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white">{ev.name}</div>
                        <div className="text-xs text-[#555] mt-0.5 mb-2">{ev.meta}</div>
                        <div className="flex gap-1.5">
                          {ev.tags.map(t => (
                            <span key={t} className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                              t==='Nemokama' ? 'bg-[#0d1f0d] text-[#4ade80]' :
                              t.startsWith('€') ? 'bg-[#1a1a0d] text-[#fbbf24]' :
                              'bg-[#1a1a2a] text-[#a78bfa]'
                            }`}>{t}</span>
                          ))}
                        </div>
                        {ev.notify && (
                          <div className="flex items-center gap-1 mt-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80]"></div>
                            <span className="text-[9px] text-[#4ade80]">Primins likus 30 min</span>
                          </div>
                        )}
                      </div>
                      <button onClick={() => remove(ev.id)} className="text-[#333] hover:text-[#f87171] transition-colors mt-0.5">
                        <i className="ti ti-x text-base"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {tomorrow.length > 0 && (
                <div className="mb-4">
                  <div className="text-[10px] text-[#444] font-semibold uppercase tracking-wider mb-3">Rytoj</div>
                  {tomorrow.map(ev => (
                    <div key={ev.id} className="flex gap-3 items-start bg-[#161616] border border-[#222] rounded-xl p-3 mb-2">
                      <div className="w-0.5 rounded self-stretch flex-shrink-0" style={{background:ev.color}}></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-white">{ev.name}</div>
                        <div className="text-xs text-[#555] mt-0.5 mb-2">{ev.meta}</div>
                        <div className="flex gap-1.5">
                          {ev.tags.map(t => (
                            <span key={t} className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                              t==='Nemokama' ? 'bg-[#0d1f0d] text-[#4ade80]' :
                              t.startsWith('€') ? 'bg-[#1a1a0d] text-[#fbbf24]' :
                              'bg-[#1a1a2a] text-[#a78bfa]'
                            }`}>{t}</span>
                          ))}
                        </div>
                      </div>
                      <button onClick={() => remove(ev.id)} className="text-[#333] hover:text-[#f87171] transition-colors mt-0.5">
                        <i className="ti ti-x text-base"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Going tab */}
          {activeTab === 'Einu' && (
            <>
              <div className="text-[10px] text-[#444] font-semibold uppercase tracking-wider mb-3">Šiandien einu</div>
              {goingEvents.map(ev => (
                <div key={ev.id} className="flex gap-3 items-start bg-[#0d1a0d] border border-[#4ade80]/20 rounded-xl p-3 mb-2">
                  <div className="w-0.5 rounded self-stretch flex-shrink-0" style={{background:ev.color}}></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white">{ev.name}</div>
                    <div className="text-xs text-[#555] mt-0.5 mb-2">{ev.meta}</div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80]"></div>
                      <span className="text-[9px] text-[#4ade80]">{ev.going} žmonės eina</span>
                    </div>
                  </div>
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-semibold bg-[#0d1f0d] text-[#4ade80]">
                    ✓ Einu
                  </span>
                </div>
              ))}

              {/* Week stats */}
              <div className="bg-[#111] border border-[#1a1a1a] rounded-xl p-4 mt-4">
                <div className="text-[10px] text-[#444] font-semibold uppercase tracking-wider mb-3">Savaitės planas</div>
                <div className="grid grid-cols-3 gap-0 divide-x divide-[#1a1a1a]">
                  <div className="text-center px-2">
                    <div className="text-xl font-bold text-[#4ade80]">2</div>
                    <div className="text-[9px] text-[#444] mt-1">Renginiai</div>
                  </div>
                  <div className="text-center px-2">
                    <div className="text-xl font-bold text-[#fbbf24]">162</div>
                    <div className="text-[9px] text-[#444] mt-1">Žmonių eina</div>
                  </div>
                  <div className="text-center px-2">
                    <div className="text-xl font-bold text-[#a78bfa]">1.2km</div>
                    <div className="text-[9px] text-[#444] mt-1">Atstumas</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Lists tab */}
          {activeTab === 'Sąrašai' && (
            <>
              <div className="text-[10px] text-[#444] font-semibold uppercase tracking-wider mb-3">Mano sąrašai</div>
              {lists.map(l => (
                <div key={l.id} className="flex items-center gap-3 bg-[#161616] border border-[#222] hover:border-[#4ade80] rounded-xl p-3 mb-2 cursor-pointer transition-colors">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:l.bg}}>
                    <i className={`ti ${l.icon} text-xl`} style={{color:l.color}}></i>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">{l.name}</div>
                    <div className="text-xs text-[#555] mt-0.5">{l.count} renginiai</div>
                  </div>
                  <i className="ti ti-chevron-right text-[#333]"></i>
                </div>
              ))}
              <div className="text-center mt-4">
                <button className="bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#4ade80] text-[#888] hover:text-[#4ade80] rounded-xl px-6 py-2.5 text-sm transition-colors">
                  + Naujas sąrašas
                </button>
              </div>
            </>
          )}

        </div>
      </div>

    </div>
  )
}