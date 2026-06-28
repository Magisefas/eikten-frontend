import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/',          icon: 'ti-map-pin',     label: 'Arti' },
  { to: '/visi',      icon: 'ti-list',        label: 'Visi' },
  { to: '/prideti',   icon: 'ti-circle-plus', label: 'Pridėti' },
  { to: '/issaugoti', icon: 'ti-heart',       label: 'Išsaugoti' },
  { to: '/profilis',  icon: 'ti-user',        label: 'Profilis' },
]

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-[#1a1a1a] flex justify-around pb-6 pt-2 z-50">
      {tabs.map(tab => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[9px] px-2 cursor-pointer transition-colors ${
              isActive ? 'text-[#4ade80]' : 'text-[#444]'
            }`
          }
        >
          <i className={`ti ${tab.icon} text-xl`}></i>
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}