import { useState, useEffect, useRef } from 'react'
import {
  getClients, createClient, updateClient, deleteClient, uploadClientLogo
} from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'
import {
  Plus, Edit2, Trash2, Building2, Globe, MapPin, Search,
  Upload, X, CheckCircle2, AlertCircle, ExternalLink, ShieldCheck, Sparkles
} from 'lucide-react'

const CATEGORY_OPTIONS = [
  'Healthcare Partner',
  'Academic Partner',
  'University Partner',
  'Research Org',
  'Publishing Partner',
  'Institutional',
  'Technology Partner',
  'Other'
]

const CATEGORY_COLORS = {
  'Healthcare Partner': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Academic Partner': 'bg-blue-50 text-blue-700 border-blue-200',
  'University Partner': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Research Org': 'bg-purple-50 text-purple-700 border-purple-200',
  'Publishing Partner': 'bg-amber-50 text-amber-700 border-amber-200',
  'Institutional': 'bg-rose-50 text-rose-700 border-rose-200',
  'Technology Partner': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'Other': 'bg-slate-50 text-slate-700 border-slate-200',
}

export default function ClientsPage() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    category: 'Healthcare Partner',
    location: '',
    logo_text: '',
    logo_url: '',
    website: '',
    order: 0
  })

  const fileInputRef = useRef(null)

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type })
    setTimeout(() => setToastMessage(null), 4000)
  }

  const fetchClients = async () => {
    setLoading(true)
    try {
      const res = await getClients()
      setClients(res.data || [])
    } catch (e) {
      console.error('Error loading clients:', e)
      showToast('Failed to load clients list', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const openCreateModal = () => {
    setEditingClient(null)
    setFormData({
      name: '',
      category: 'Healthcare Partner',
      location: '',
      logo_text: '',
      logo_url: '',
      website: '',
      order: clients.length + 1
    })
    setIsModalOpen(true)
  }

  const openEditModal = (c) => {
    setEditingClient(c)
    setFormData({
      name: c.name || '',
      category: c.category || 'Healthcare Partner',
      location: c.location || '',
      logo_text: c.logo_text || '',
      logo_url: c.logo_url || '',
      website: c.website || '',
      order: c.order || 0
    })
    setIsModalOpen(true)
  }

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingLogo(true)
    const data = new FormData()
    data.append('file', file)

    try {
      const res = await uploadClientLogo(data)
      setFormData(prev => ({ ...prev, logo_url: res.data.url }))
      showToast('Logo uploaded successfully!')
    } catch (err) {
      console.error(err)
      showToast(err.response?.data?.detail || 'Failed to upload logo', 'error')
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      showToast('Client name is required', 'error')
      return
    }

    setSaving(true)
    try {
      if (editingClient) {
        await updateClient(editingClient.id, formData)
        showToast(`Updated "${formData.name}" successfully`)
      } else {
        await createClient(formData)
        showToast(`Created "${formData.name}" successfully`)
      }
      setIsModalOpen(false)
      fetchClients()
    } catch (err) {
      console.error(err)
      showToast(err.response?.data?.detail || 'Failed to save client details', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (client) => {
    if (!window.confirm(`Are you sure you want to delete "${client.name}"?`)) return

    try {
      await deleteClient(client.id)
      showToast(`Deleted "${client.name}"`)
      fetchClients()
    } catch (err) {
      console.error(err)
      showToast(err.response?.data?.detail || 'Failed to delete client', 'error')
    }
  }

  // Filtered clients
  const filteredClients = clients.filter(c => {
    const matchesSearch = 
      (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.category || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCat = categoryFilter === 'ALL' || c.category === categoryFilter
    return matchesSearch && matchesCat
  })

  // Quick stats
  const totalCount = clients.length
  const healthcareCount = clients.filter(c => c.category === 'Healthcare Partner').length
  const academicCount = clients.filter(c => c.category === 'Academic Partner' || c.category === 'University Partner').length

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium border animate-slide-up ${
          toastMessage.type === 'error'
            ? 'bg-rose-50 text-rose-800 border-rose-200'
            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
        }`}>
          {toastMessage.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          {toastMessage.text}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-800 font-sans">Our Clients & Partners</h1>
            <span className="badge bg-primary-50 text-primary-700 border border-primary-200 text-xs px-2.5 py-0.5 rounded-full font-semibold">
              {totalCount} Total
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-0.5">
            Manage partner hospitals, medical colleges, universities, and research institutions shown on the About Us page.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary flex items-center gap-2 py-2.5 px-4 shadow-sm"
        >
          <Plus size={17} /> Add New Client
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
            <Building2 size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Clients & Partners</p>
            <h3 className="text-xl font-extrabold text-slate-800">{totalCount}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Healthcare Partners</p>
            <h3 className="text-xl font-extrabold text-slate-800">{healthcareCount}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Sparkles size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Academic & University</p>
            <h3 className="text-xl font-extrabold text-slate-800">{academicCount}</h3>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, category, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="ALL">All Categories ({clients.length})</option>
            {CATEGORY_OPTIONS.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content Area: Table / Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16">
            <LoadingSpinner />
          </div>
        ) : filteredClients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200/80 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Partner / Client</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Location</th>
                  <th className="px-6 py-3.5">Website</th>
                  <th className="px-6 py-3.5 text-center">Order</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClients.map((client) => {
                  const badgeClass = CATEGORY_COLORS[client.category] || CATEGORY_COLORS['Other']
                  return (
                    <tr key={client.id} className="hover:bg-slate-50/70 transition-colors group">
                      {/* Name & Logo/Icon */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {client.logo_url ? (
                              <img
                                src={client.logo_url}
                                alt={client.name}
                                className="w-full h-full object-contain p-1"
                                onError={(e) => {
                                  e.target.onerror = null
                                  e.target.style.display = 'none'
                                }}
                              />
                            ) : (
                              <Building2 size={20} className="text-primary-600" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 leading-snug group-hover:text-primary-600 transition-colors">
                              {client.name}
                            </h4>
                            {client.logo_text && (
                              <p className="text-xs text-slate-400 mt-0.5">{client.logo_text}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="px-6 py-4">
                        <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${badgeClass}`}>
                          {client.category || 'Healthcare Partner'}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4">
                        {client.location ? (
                          <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium">
                            <MapPin size={14} className="text-slate-400 flex-shrink-0" />
                            <span>{client.location}</span>
                          </div>
                        ) : (
                          <span className="text-slate-300 text-xs italic">—</span>
                        )}
                      </td>

                      {/* Website */}
                      <td className="px-6 py-4">
                        {client.website ? (
                          <a
                            href={client.website.startsWith('http') ? client.website : `https://${client.website}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-800 hover:underline font-medium"
                          >
                            <Globe size={13} />
                            <span>Visit Link</span>
                            <ExternalLink size={11} className="opacity-70" />
                          </a>
                        ) : (
                          <span className="text-slate-300 text-xs italic">—</span>
                        )}
                      </td>

                      {/* Order */}
                      <td className="px-6 py-4 text-center">
                        <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                          {client.order ?? 0}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(client)}
                            className="p-2 rounded-xl text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                            title="Edit Client"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(client)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Client"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 px-4 text-center">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Building2 size={26} />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Clients Found</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto mt-1">
              {searchQuery || categoryFilter !== 'ALL'
                ? 'Try adjusting your search filters to find what you are looking for.'
                : 'Click "Add New Client" to create your first partner organization.'}
            </p>
            {searchQuery || categoryFilter !== 'ALL' ? (
              <button
                onClick={() => { setSearchQuery(''); setCategoryFilter('ALL'); }}
                className="mt-4 text-xs font-semibold text-primary-600 hover:underline"
              >
                Clear all filters
              </button>
            ) : null}
          </div>
        )}
      </div>

      {/* Add / Edit Client Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClient ? `Edit "${editingClient.name}"` : 'Add New Client / Partner'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          
          {/* Logo / Image Upload Section */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Client Logo / Image (Optional)
            </label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 relative group">
                {formData.logo_url ? (
                  <>
                    <img src={formData.logo_url} alt="Logo Preview" className="w-full h-full object-contain p-1" />
                    <button
                      type="button"
                      onClick={() => setFormData(f => ({ ...f, logo_url: '' }))}
                      className="absolute inset-0 bg-slate-900/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                      title="Remove Logo"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <Building2 size={24} className="text-slate-400" />
                )}
              </div>

              <div className="space-y-1 flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingLogo}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-primary-400 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Upload size={13} />
                  {uploadingLogo ? 'Uploading...' : formData.logo_url ? 'Change Logo' : 'Upload Logo'}
                </button>
                <p className="text-[11px] text-slate-400">
                  PNG, SVG, JPG or WEBP. If empty, the default institution icon is used.
                </p>
              </div>
            </div>
          </div>

          {/* Client Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Client / Partner Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Apollo Hospitals Network"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              >
                {CATEGORY_OPTIONS.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location & Short Tag/Text */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Location (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Chennai / Pan-India"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Short Name / Logo Text (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Apollo Hospitals"
                value={formData.logo_text}
                onChange={e => setFormData({ ...formData, logo_text: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Website URL & Display Order */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Official Website URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://www.example.com"
                value={formData.website}
                onChange={e => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-mono"
              />
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-ghost px-4 py-2 text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary px-5 py-2 text-sm font-bold flex items-center gap-2"
            >
              {saving ? 'Saving...' : editingClient ? 'Save Changes' : 'Create Client'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
