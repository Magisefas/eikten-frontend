import { useState } from 'react'

const categories = [
  { id:'muzika',  icon:'ti-music',          label:'Muzika'  },
  { id:'barai',   icon:'ti-glass',          label:'Barai'   },
  { id:'maistas', icon:'ti-tools-kitchen-2',label:'Maistas' },
  { id:'sportas', icon:'ti-ball-football',  label:'Sportas' },
  { id:'kultura', icon:'ti-building',       label:'Kultūra' },
  { id:'lauke',   icon:'ti-trees',          label:'Lauke'   },
]

export default function Prideti() {
  const [name, setName]         = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate]         = useState('')
  const [time, setTime]         = useState('')
  const [desc, setDesc]         = useState('')
  const [contact, setContact]   = useState('')
  const [price, setPrice]       = useState('')
  const [isFree, setIsFree]     = useState(true)
  const [cats, setCats]         = useState([])
  const [success, setSuccess]   = useState(false)

  const toggleCat = (id) => setCats(c => c.includes(id) ? c.filter(x=>x!==id) : [...c,id])

  const submit = () => {
    if (!name || !location || !date || !time) {
      alert('Prašome užpildyti visus privalomus laukus (*)')
      return
    }
    // Later: save to Laravel API here
    setSuccess(true)
  }

  const reset = () => {
    setName(''); setLocation(''); setDate(''); setTime('')
    setDesc(''); setContact(''); setPrice(''); setIsFree(true)
    setCats([]); setSuccess(false)
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
      <button onClick={reset} className="bg-[#4ade80] text-[#0a0a0a] font-bold px-8 py-3 rounded-xl text-sm">
        Pridėti dar vieną
      </button>
      <button onClick={reset} className="text-sm text-[#555] hover:text-[#888]">
        Grįžti atgal
      </button>
    </div>
  )

  return (
    <div className="flex flex-col flex-1 overflow-hidden">

      {/* Header */}
      <div className="bg-[#0f0f0f] px-4 md:px-6 pt-10 md:pt-6 pb-4 border-b border-[#1a1a1a] flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Pridėti renginį</h1>
            <p className="text-xs text-[#555] mt-0.5">Pasidalink tuo, kas vyksta šalia</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 scrollbar-hide pb-24 md:pb-6">
        <div className="max-w-xl mx-auto flex flex-col gap-5">

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
              Vieta *
            </label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Gatvė, pastatas ar vieta..."
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

          {/* Price — only if not free */}
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
            className="w-full bg-[#4ade80] text-[#0a0a0a] font-bold py-3.5 rounded-xl text-sm hover:opacity-90 transition-opacity"
          >
            Paskelbti renginį
          </button>

          <div className="h-4"></div>
        </div>
      </div>

    </div>
  )
}