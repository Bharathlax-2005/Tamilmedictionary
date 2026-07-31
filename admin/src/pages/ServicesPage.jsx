import { useState, useEffect } from 'react'
import { getServices, createService, updateService, deleteService } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'
import { Plus, Edit2, Trash2 } from 'lucide-react'

export default function ServicesPage() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [formData, setFormData] = useState({ title: '', description: '', icon: '🔬', order: 0 })
  const [saving, setSaving] = useState(false)

  const fetchServices = async () => {
    setLoading(true)
    try {
      const res = await getServices()
      setServices(res.data.services || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchServices() }, [])

  const openCreateModal = () => {
    setEditingService(null)
    setFormData({ title: '', description: '', icon: '🔬', order: services.length + 1 })
    setIsModalOpen(true)
  }

  const openEditModal = (s) => {
    setEditingService(s)
    setFormData({ title: s.title || '', description: s.description || '', icon: s.icon || '🔬', order: s.order || 0 })
    setIsModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingService) {
        await updateService(editingService.id, formData)
      } else {
        await createService(formData)
      }
      setIsModalOpen(false)
      fetchServices()
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to save service')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return
    try {
      await deleteService(id)
      fetchServices()
    } catch {
      alert('Failed to delete service')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-sans">Services Management</h1>
          <p className="text-slate-500 text-sm">Manage services offered on the Why Choose Us / Services section.</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary">
          <Plus size={16} /> Add Service
        </button>
      </div>

      <div className="soft-card overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : services.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Icon</th>
                  <th className="px-6 py-3.5">Title</th>
                  <th className="px-6 py-3.5">Description</th>
                  <th className="px-6 py-3.5">Order</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {services.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-2xl">{s.icon}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{s.title}</td>
                    <td className="px-6 py-4 max-w-md text-slate-500">{s.description}</td>
                    <td className="px-6 py-4 font-mono text-xs">{s.order}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEditModal(s)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500">No services found.</div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingService ? "Edit Service" : "Add Service"}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Icon (Emoji)</label>
              <input type="text" required value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} className="form-input text-center text-lg" />
            </div>
            <div className="col-span-3">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Title *</label>
              <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="form-input" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Description *</label>
            <textarea rows={3} required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="form-input resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Display Order</label>
            <input type="number" value={formData.order} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} className="form-input" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editingService ? 'Update Service' : 'Create Service'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
