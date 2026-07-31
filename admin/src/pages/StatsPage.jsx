import { useState, useEffect } from 'react'
import { getStats, createStat, updateStat, deleteStat } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'
import { Plus, Edit2, Trash2 } from 'lucide-react'

export default function StatsPage() {
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStat, setEditingStat] = useState(null)
  const [formData, setFormData] = useState({ label: '', value: '', icon: '📊', order: 0 })
  const [saving, setSaving] = useState(false)

  const fetchStats = async () => {
    setLoading(true)
    try {
      const res = await getStats()
      setStats(res.data.stats || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStats() }, [])

  const openCreateModal = () => {
    setEditingStat(null)
    setFormData({ label: '', value: '', icon: '📊', order: stats.length + 1 })
    setIsModalOpen(true)
  }

  const openEditModal = (st) => {
    setEditingStat(st)
    setFormData({ label: st.label || '', value: st.value || '', icon: st.icon || '📊', order: st.order || 0 })
    setIsModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingStat) {
        await updateStat(editingStat.id, formData)
      } else {
        await createStat(formData)
      }
      setIsModalOpen(false)
      fetchStats()
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to save statistic')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this statistic?')) return
    try {
      await deleteStat(id)
      fetchStats()
    } catch {
      alert('Failed to delete statistic')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Homepage Statistics</h1>
          <p className="text-slate-500 text-sm">Update numbers, labels, and icons shown in the statistics section.</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary">
          <Plus size={16} /> Add Statistic
        </button>
      </div>

      <div className="soft-card overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : stats.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Icon</th>
                  <th className="px-6 py-3.5">Value</th>
                  <th className="px-6 py-3.5">Label</th>
                  <th className="px-6 py-3.5">Order</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-2xl">{st.icon}</td>
                    <td className="px-6 py-4 font-bold text-primary-600 text-base">{st.value}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{st.label}</td>
                    <td className="px-6 py-4 font-mono text-xs">{st.order}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEditModal(st)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(st.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50">
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
          <div className="p-8 text-center text-slate-500">No statistics found.</div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingStat ? "Edit Statistic" : "Add Statistic"}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Icon</label>
              <input type="text" required value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} className="form-input text-center text-lg" />
            </div>
            <div className="col-span-3">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Value (e.g. 10K+, 98%) *</label>
              <input type="text" required value={formData.value} onChange={e => setFormData({ ...formData, value: e.target.value })} className="form-input font-bold" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Label *</label>
            <input type="text" required value={formData.label} onChange={e => setFormData({ ...formData, label: e.target.value })} className="form-input" placeholder="e.g. Medical Terms Translated" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Display Order</label>
            <input type="number" value={formData.order} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} className="form-input" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editingStat ? 'Update Statistic' : 'Create Statistic'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
