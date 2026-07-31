import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, BookOpen, FileText, Wrench, BarChart2,
  Mail, ShoppingBag, FileEdit, LogOut, BookMarked, Users
} from 'lucide-react'

const links = [
  { to: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard', end: true },
  { to: '/admin/terms', icon: <BookOpen size={18} />, label: 'Dictionary Terms' },
  { to: '/admin/team', icon: <Users size={18} />, label: 'Team Management' },
  { to: '/admin/blog', icon: <FileText size={18} />, label: 'Blog Posts' },
  { to: '/admin/services', icon: <Wrench size={18} />, label: 'Services' },
  { to: '/admin/stats', icon: <BarChart2 size={18} />, label: 'Statistics' },
  { to: '/admin/contacts', icon: <Mail size={18} />, label: 'Contact Submissions' },
  { to: '/admin/shop', icon: <ShoppingBag size={18} />, label: 'Shop / Products' },
  { to: '/admin/pages', icon: <FileEdit size={18} />, label: 'Page Content (CMS)' },
  { to: '/admin/collections', icon: <FileText size={18} />, label: 'Collections' },
]


export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }


  return (
    <aside className="w-64 flex-shrink-0 bg-slate-900 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
          <BookMarked size={18} className="text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">TamilMe<span className="text-primary-400">Dictionary</span></p>
          <p className="text-slate-500 text-[10px]">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
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

      {/* User */}
      <div className="px-4 py-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary-600/20 flex items-center justify-center text-primary-400 font-bold text-sm">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.username}</p>
            <p className="text-slate-500 text-xs">{user?.role}</p>
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
  )
}
