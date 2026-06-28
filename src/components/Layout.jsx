import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'
import SideNav from './SideNav'

export default function Layout() {
  return (
    <div className="flex h-dvh bg-[#0f0f0f] text-white overflow-hidden">
      {/* Sidebar — only on desktop */}
      <SideNav />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Outlet />
      </div>

      {/* Bottom nav — only on mobile */}
      <BottomNav />
    </div>
  )
}