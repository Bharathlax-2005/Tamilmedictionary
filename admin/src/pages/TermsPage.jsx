import { useState, useEffect, useCallback } from 'react'
import {
  getTerms,
  searchTermsAdmin,
  getCategoriesAdmin,
  createTerm,
  updateTerm,
  deleteTerm,
  importTermsAdmin,
  exportTermsAdmin
} from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  Filter,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react'

export default function TermsPage() {
  const [terms, setTerms] = useState([])
  const [categories, setCategories] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading] = useState(true)

  // Feedback State
  const [alertInfo, setAlertInfo] = useState(null)

  // Single Term Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTerm, setEditingTerm] = useState(null)
  const [formData, setFormData] = useState({
    en_term: '', ta_term: '', category: 'General', definition: '', ta_definition: '', tags: '', is_featured: false,
  })
  const [saving, setSaving] = useState(false)

  // Import Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [importFile, setImportFile] = useState(null)
  const [importing, setImporting] = useState(false)
  const [importError, setImportError] = useState(null)

  // Export State
  const [exporting, setExporting] = useState(false)

  const fetchCategories = useCallback(async () => {
    try {
      const res = await getCategoriesAdmin()
      setCategories(res.data.categories || [])
    } catch (e) {
      console.error('Failed to load categories', e)
    }
  }, [])

  const fetchTerms = useCallback(async () => {
    setLoading(true)
    try {
      let res
      if (query.trim() || selectedCategory) {
        res = await searchTermsAdmin(query.trim(), page, selectedCategory)
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
  }, [query, page, selectedCategory])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    fetchTerms()
  }, [fetchTerms])

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
        setAlertInfo({ type: 'success', message: `Term "${formData.en_term}" updated successfully in MongoDB.` })
      } else {
        await createTerm(payload)
        setAlertInfo({ type: 'success', message: `Term "${formData.en_term}" created successfully in MongoDB.` })
      }
      setIsModalOpen(false)
      fetchTerms()
      fetchCategories()
    } catch (err) {
      setAlertInfo({ type: 'error', message: err.response?.data?.detail || 'Failed to save term in MongoDB' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this medical term from MongoDB?')) return
    try {
      await deleteTerm(id)
      setAlertInfo({ type: 'success', message: 'Medical term deleted from MongoDB successfully.' })
      fetchTerms()
      fetchCategories()
    } catch {
      setAlertInfo({ type: 'error', message: 'Failed to delete term from MongoDB' })
    }
  }

  const handleExport = async (format) => {
    setExporting(true)
    try {
      const res = await exportTermsAdmin(format)
      const blob = new Blob([res.data], { type: format === 'csv' ? 'text/csv' : 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `tamilmedictionary_terms.${format}`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      setAlertInfo({ type: 'success', message: `Exported dictionary terms from MongoDB as ${format.toUpperCase()}.` })
    } catch (err) {
      setAlertInfo({ type: 'error', message: 'Failed to export terms from MongoDB.' })
    } finally {
      setExporting(false)
    }
  }

  const handleImportSubmit = async (e) => {
    e.preventDefault()
    if (!importFile) {
      setImportError('Please select a file to import.')
      return
    }
    setImporting(true)
    setImportError(null)
    const data = new FormData()
    data.append('file', importFile)

    try {
      const res = await importTermsAdmin(data)
      setAlertInfo({
        type: 'success',
        message: `Import complete! ${res.data.inserted} inserted, ${res.data.updated} updated in MongoDB. Total: ${res.data.total_processed}.`
      })
      setIsImportModalOpen(false)
      setImportFile(null)
      fetchTerms()
      fetchCategories()
    } catch (err) {
      console.error('Import error:', err)
      const status = err.response?.status
      const detail = err.response?.data?.detail
      if (status === 401) {
        setImportError('Session expired or not authenticated as Admin. Please log in again.')
      } else if (typeof detail === 'string') {
        setImportError(detail)
      } else if (Array.isArray(detail)) {
        setImportError(detail.map((d) => (typeof d === 'string' ? d : d.msg || d.detail || JSON.stringify(d))).join(', '))
      } else if (detail && typeof detail === 'object') {
        setImportError(detail.msg || detail.detail || JSON.stringify(detail))
      } else if (err.message) {
        setImportError(err.message)
      } else {
        setImportError('Failed to import terms into MongoDB.')
      }
    } finally {
      setImporting(false)
    }
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Medical Terms Management</h1>
          <p className="text-slate-500 text-sm">Add, edit, import, export, and organize terms stored in MongoDB.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => setIsImportModalOpen(true)} className="btn-outline inline-flex items-center gap-2 text-xs py-2 px-3.5">
            <Upload size={15} /> Bulk Import (CSV/JSON)
          </button>
          <div className="relative group">
            <button disabled={exporting} className="btn-outline inline-flex items-center gap-2 text-xs py-2 px-3.5">
              <Download size={15} /> {exporting ? 'Exporting...' : 'Export Terms'}
            </button>
            <div className="hidden group-hover:block absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg p-1 z-20 w-36">
              <button onClick={() => handleExport('json')} className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-lg">
                Export JSON
              </button>
              <button onClick={() => handleExport('csv')} className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-lg">
                Export CSV
              </button>
            </div>
          </div>
          <button onClick={openCreateModal} className="btn-primary inline-flex items-center gap-2 text-xs py-2 px-4">
            <Plus size={16} /> Add New Term
          </button>
        </div>
      </div>

      {/* Alert Notice */}
      {alertInfo && (
        <div className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-sm animate-fade-in ${
          alertInfo.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          <div className="flex items-center gap-2.5">
            {alertInfo.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-600 shrink-0" /> : <AlertCircle size={18} className="text-rose-600 shrink-0" />}
            <span>{alertInfo.message}</span>
          </div>
          <button onClick={() => setAlertInfo(null)} className="p-1 hover:bg-black/5 rounded-lg">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Search & Category Filter Bar */}
      <div className="soft-card p-4 flex flex-col md:flex-row items-center gap-3">
        <div className="flex-1 w-full flex items-center gap-3 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by English term, Tamil term, definition, or tags in MongoDB..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1) }}
            className="w-full bg-transparent text-sm outline-none text-slate-700 placeholder-slate-400"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600">
              <X size={15} />
            </button>
          )}
        </div>

        <div className="w-full md:w-64 flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
          <Filter size={16} className="text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setPage(1) }}
            className="w-full bg-transparent text-sm outline-none text-slate-700 font-medium cursor-pointer"
          >
            <option value="">All Categories ({categories.length})</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
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
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">Yes</span>
                      ) : (
                        <span className="text-slate-400 text-xs">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEditModal(t)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50">
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
          <div className="p-8 text-center text-slate-500">No medical terms found in MongoDB.</div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm">
            <span className="text-slate-500">Total: <strong>{total}</strong> terms in MongoDB</span>
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

      {/* Add / Edit Single Term Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTerm ? "Edit Medical Term" : "Add Medical Term to MongoDB"}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">English Term *</label>
              <input type="text" required value={formData.en_term} onChange={e => setFormData({ ...formData, en_term: e.target.value })} className="form-input" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tamil Translation *</label>
              <input type="text" required value={formData.ta_term} onChange={e => setFormData({ ...formData, ta_term: e.target.value })} className="form-input font-tamil" />
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
            <label className="block text-xs font-semibold text-slate-600 mb-1">Tamil Definition</label>
            <textarea rows={2} value={formData.ta_definition} onChange={e => setFormData({ ...formData, ta_definition: e.target.value })} className="form-input resize-none font-tamil" />
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
              {saving ? 'Saving to MongoDB...' : editingTerm ? 'Update Term' : 'Save to MongoDB'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Bulk Import Modal */}
      <Modal isOpen={isImportModalOpen} onClose={() => !importing && setIsImportModalOpen(false)} title="Bulk Import Dictionary Terms to MongoDB">
        <form onSubmit={handleImportSubmit} className="space-y-4">
          {importError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{importError}</span>
            </div>
          )}

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <p className="font-semibold text-slate-800">Multi-Format Import Guidelines:</p>
            <ul className="list-disc pl-4 space-y-1.5">
              <li><b>Excel (.xlsx, .xls) / CSV (.csv):</b> Tabular data with headers <code>en_term, ta_term, category, definition, ta_definition, tags, is_featured</code></li>
              <li><b>Word Document (.docx):</b> Must contain a structured table in the document.</li>
              <li><b>PDF Document (.pdf):</b> Must contain structured table data across page(s).</li>
              <li><b>JSON (.json):</b> Array of term objects with <code>en_term</code> and <code>ta_term</code>.</li>
              <li>Matching <code>en_term</code> entries will automatically UPDATE existing MongoDB records; new terms will be INSERTED.</li>
            </ul>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Select File (.csv, .xlsx, .xls, .docx, .pdf, .json) *</label>
            <input
              type="file"
              accept=".csv,.xlsx,.xls,.docx,.pdf,.json"
              onChange={(e) => setImportFile(e.target.files?.[0] || null)}
              className="form-input w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
              required
            />
            {importFile && (
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">Selected: {importFile.name} ({(importFile.size / 1024).toFixed(1)} KB)</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setIsImportModalOpen(false)} disabled={importing} className="btn-ghost disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={importing} className="btn-primary disabled:opacity-50 inline-flex items-center gap-2">
              <Upload size={15} /> {importing ? 'Parsing & Upserting to MongoDB...' : 'Upload & Process File'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  )
}
