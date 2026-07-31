import { useState, useEffect, useCallback } from 'react'
import { getTerms, searchTermsAdmin, createTerm, updateTerm, deleteTerm } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'
import { Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

export default function TermsPage() {
  const [terms, setTerms] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTerm, setEditingTerm] = useState(null)
  const [formData, setFormData] = useState({
    en_term: '', ta_term: '', category: 'General', definition: '', ta_definition: '', tags: '', is_featured: false,
  })
  const [saving, setSaving] = useState(false)

  const fetchTerms = useCallback(async () => {
    setLoading(true)
    try {
      let res
      if (query.trim()) {
        res = await searchTermsAdmin(query.trim(), page)
      } else {
        res = await getTerms({ page, limit: 20 })
      }
      setTerms(res.data.results || [])
      setTotal(res.data.total || 0)
      setPages(res.data.pages || 1)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [query, page])

  useEffect(() => { fetchTerms() }, [fetchTerms])

  const openCreateModal = () => {
    setEditingTerm(null)
    setFormData({ en_term: '', ta_term: '', category: 'General', definition: '', ta_definition: '', tags: '', is_featured: false })
    setIsModalOpen(true)
  }

  const openEditModal = (term) => {
    setEditingTerm(term)
    setFormData({
      en_term: term.en_term || '',
      ta_term: term.ta_term || '',
      category: term.category || 'General',
      definition: term.definition || '',
      ta_definition: term.ta_definition || '',
      tags: Array.isArray(term.tags) ? term.tags.join(', ') : '',
      is_featured: term.is_featured || false,
    })
    setIsModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
    }

    try {
      if (editingTerm) {
        await updateTerm(editingTerm.id, payload)
      } else {
        await createTerm(payload)
      }
      setIsModalOpen(false)
      fetchTerms()
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to save term')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this term?')) return
    try {
      await deleteTerm(id)
      fetchTerms()
    } catch {
      alert('Failed to delete term')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Medical Terms Management</h1>
          <p className="text-slate-500 text-sm">Add, edit, and organize dictionary entries.</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary">
          <Plus size={16} /> Add New Term
        </button>
      </div>

      {/* Search Bar */}
      <div className="soft-card p-4 flex items-center gap-3">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search by English or Tamil term..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1) }}
          className="w-full bg-transparent text-sm outline-none text-slate-700 placeholder-slate-400"
        />
      </div>

      {/* Table */}
      <div className="soft-card overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : terms.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">English Term</th>
                  <th className="px-6 py-3.5">Tamil Translation</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Featured</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {terms.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{t.en_term}</td>
                    <td className="px-6 py-4 font-semibold text-primary-700 font-tamil">{t.ta_term}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {t.is_featured ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">Yes</span>
                      ) : (
                        <span className="text-slate-400 text-xs">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEditModal(t)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50">
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
          <div className="p-8 text-center text-slate-500">No terms found.</div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm">
            <span className="text-slate-500">Total: {total} terms</span>
            <div className="flex items-center gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-ghost disabled:opacity-40">
                <ChevronLeft size={16} />
              </button>
              <span className="text-slate-600 font-medium">Page {page} of {pages}</span>
              <button disabled={page === pages} onClick={() => setPage(p => p + 1)} className="btn-ghost disabled:opacity-40">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTerm ? "Edit Medical Term" : "Add Medical Term"}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">English Term *</label>
              <input type="text" required value={formData.en_term} onChange={e => setFormData({ ...formData, en_term: e.target.value })} className="form-input" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tamil Translation *</label>
              <input type="text" required value={formData.ta_term} onChange={e => setFormData({ ...formData, ta_term: e.target.value })} className="form-input" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
            <input type="text" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="form-input" placeholder="e.g. Basic Sciences, Cardiology" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">English Definition</label>
            <textarea rows={2} value={formData.definition} onChange={e => setFormData({ ...formData, definition: e.target.value })} className="form-input resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Tags (comma separated)</label>
            <input type="text" value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} className="form-input" placeholder="basic, heart, anatomy" />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="is_featured" checked={formData.is_featured} onChange={e => setFormData({ ...formData, is_featured: e.target.checked })} className="rounded text-primary-600" />
            <label htmlFor="is_featured" className="text-sm text-slate-700">Feature this term on homepage</label>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editingTerm ? 'Update Term' : 'Create Term'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
