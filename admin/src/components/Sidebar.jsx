import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, BookOpen, FileText, Wrench, BarChart2,
  Mail, ShoppingBag, LogOut, BookMarked, Users, Menu, X, Building2
} from 'lucide-react'

const links = [
  { to: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard', end: true },
  { to: '/admin/terms', icon: <BookOpen size={18} />, label: 'Dictionary Terms' },
  { to: '/admin/team', icon: <Users size={18} />, label: 'Team Management' },
  { to: '/admin/clients', icon: <Building2 size={18} />, label: 'Our Clients' },
  { to: '/admin/blog', icon: <FileText size={18} />, label: 'Blog Posts' },
  { to: '/admin/services', icon: <Wrench size={18} />, label: 'Services' },
  { to: '/admin/stats', icon: <BarChart2 size={18} />, label: 'Statistics' },
  { to: '/admin/contacts', icon: <Mail size={18} />, label: 'Contact Submissions' },
  { to: '/admin/shop', icon: <ShoppingBag size={18} />, label: 'Shop / Products' },
  { to: '/admin/collections', icon: <FileText size={18} />, label: 'Collections' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const closeMobile = () => setMobileOpen(false)

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-30 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
            <BookMarked size={16} className="text-white" />
          </div>
          <span className="font-bold text-sm">TamilMe<span className="text-primary-400">Dictionary</span> Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Backdrop Overlay for Mobile */}
      {mobileOpen && (
        <div
          onClick={closeMobile}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`w-64 bg-slate-900 flex flex-col h-screen fixed md:sticky top-0 left-0 z-50 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
              <BookMarked size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">
                TamilMe<span className="text-primary-400">Dictionary</span>
              </p>
              <p className="text-slate-500 text-[10px]">Admin Panel</p>
            </div>
          </div>
          <button onClick={closeMobile} className="md:hidden text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={closeMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="px-4 py-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary-600/20 flex items-center justify-center text-primary-400 font-bold text-sm">
              {user?.username?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.username || 'Admin'}</p>
              <p className="text-slate-500 text-xs">{user?.role || 'administrator'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 text-sm transition-colors"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
