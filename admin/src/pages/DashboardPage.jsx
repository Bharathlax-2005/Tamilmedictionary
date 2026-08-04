import { useState, useEffect } from 'react'
import { adminStats } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { BookOpen, FileText, Mail, ShoppingBag, ArrowUpRight, Building2, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminStats()
      .then(r => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner size="lg" />

  const cards = [
    { label: 'Dictionary Terms', value: stats?.terms || 0, icon: <BookOpen className="text-blue-500" size={24} />, link: '/admin/terms', bg: 'bg-blue-50' },
    { label: 'Our Clients & Partners', value: stats?.clients || 0, icon: <Building2 className="text-indigo-500" size={24} />, link: '/admin/clients', bg: 'bg-indigo-50' },
    { label: 'Blog Posts', value: stats?.blogs || 0, icon: <FileText className="text-emerald-500" size={24} />, link: '/admin/blog', bg: 'bg-emerald-50' },
    { label: 'Contact Submissions', value: stats?.contacts || 0, badge: stats?.unread_contacts ? `${stats.unread_contacts} unread` : null, icon: <Mail className="text-amber-500" size={24} />, link: '/admin/contacts', bg: 'bg-amber-50' },
    { label: 'Shop Products', value: stats?.products || 0, icon: <ShoppingBag className="text-purple-500" size={24} />, link: '/admin/shop', bg: 'bg-purple-50' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
        <p className="text-slate-500 text-sm mt-1">Welcome to the TamilMeDictionary administration portal.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {cards.map((card, i) => (
          <Link key={i} to={card.link} className="soft-card p-5 flex flex-col justify-between hover:border-primary-300 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl ${card.bg} flex items-center justify-center`}>
                {card.icon}
              </div>
              <ArrowUpRight size={17} className="text-slate-400 group-hover:text-primary-600 transition-colors" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold text-slate-800">{card.value}</span>
                {card.badge && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                    {card.badge}
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-slate-500 mt-1">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Info / Guidance */}
      <div className="soft-card p-6 bg-gradient-to-br from-white to-primary-50/30">
        <h2 className="text-lg font-bold text-slate-800 mb-2">Quick Actions</h2>
        <p className="text-slate-600 text-sm mb-4">Select a tab from the sidebar to manage content across the website:</p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600">
          <li className="flex items-center gap-2">🔹 <b>Dictionary Terms:</b> Add, edit, or delete English-Tamil medical translations.</li>
          <li className="flex items-center gap-2">🔹 <b>Our Clients:</b> Add, edit, reorder, or delete client and partner organizations.</li>
          <li className="flex items-center gap-2">🔹 <b>Team Management:</b> Manage doctors, executives, and staff profiles.</li>
          <li className="flex items-center gap-2">🔹 <b>Blog Posts:</b> Publish new articles and research news.</li>
          <li className="flex items-center gap-2">🔹 <b>Contacts:</b> Review and respond to user messages & inquiries.</li>
          <li className="flex items-center gap-2">🔹 <b>Collections & Files:</b> Manage glossaries, documents, and resources.</li>
        </ul>
      </div>
    </div>
  )
}
