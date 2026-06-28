import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/',          icon: 'ti-map-pin',     label: 'Arti' },
  { to: '/visi',      icon: 'ti-list',        label: 'Visi' },
  { to: '/prideti',   icon: 'ti-circle-plus', label: 'Pridėti' },
  { to: '/issaugoti', icon: 'ti-heart',       label: 'Išsaugoti' },
  { to: '/profilis',  icon: 'ti-user',        label: 'Profilis' },
]

export default function SideNav() {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#0a0a0a] border-r border-[#1a1a1a] p-4 flex-shrink-0">
      {/* Logo */}
      <div className="text-2xl font-bold tracking-tight mb-8 px-2 pt-4">
        eik<span className="text-[#4ade80]">ten</span>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 flex-1">
        {tabs.map(tab => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#0d1a0d] text-[#4ade80] border border-[#4ade80]/20'
                  : 'text-[#555] hover:text-[#aaa] hover:bg-[#161616]'
              }`
            }
          >
            <i className={`ti ${tab.icon} text-xl`}></i>
            <span>{tab.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom of sidebar */}
      <div className="border-t border-[#1a1a1a] pt-4 mt-4">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-[#1a2a1a] border border-[#4ade80] flex items-center justify-center text-[#4ade80] font-bold text-sm">
            K
          </div>
          <div>
            <div className="text-xs font-semibold text-white">Karolis</div>
            <div className="text-[10px] text-[#555]">Kaunas</div>
          </div>
        </div>
        <div className="text-[10px] text-[#2a2a2a] text-center mt-3">eikten.lt · v0.1 beta</div>
      </div>
    </aside>
  )
}