import { useState, useEffect } from 'react'
import { getCollections, createCollection, updateCollection, deleteCollection } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'
import { Plus, Upload, Edit2, Trash2, Download, AlertCircle, FileText } from 'lucide-react'

const initialForm = {
  title: '',
  description: '',
  category: 'General',
  file: null,
}

function formatSize(bytes) {
  if (!bytes) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB']
  let i = 0
  let val = bytes
  while (val >= 1024 && i < units.length - 1) {
    val /= 1024
    i += 1
  }
  return `${val.toFixed(1)} ${units[i]}`
}

export default function CollectionsManagerPage() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDoc, setEditingDoc] = useState(null)
  const [formData, setFormData] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [progress, setProgress] = useState(null)

  const fetchDocuments = async () => {
    setLoading(true)
    try {
      const res = await getCollections()
      setDocuments(res.data.documents || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDocuments() }, [])

  const openCreate = () => {
    setEditingDoc(null)
    setFormData(initialForm)
    setErrorMessage(null)
    setProgress(null)
    setIsModalOpen(true)
  }

  const openEdit = (doc) => {
    setEditingDoc(doc)
    setFormData({
      title: doc.title,
      description: doc.description || '',
      category: doc.category || 'General',
      file: null,
    })
    setErrorMessage(null)
    setProgress(null)
    setIsModalOpen(true)
  }

  const handleFileChange = (event) => {
    setFormData({ ...formData, file: event.target.files?.[0] || null })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!formData.title.trim()) {
      setErrorMessage('Document title is required.')
      return
    }
    if (!editingDoc && !formData.file) {
      setErrorMessage('Please choose a document file to upload.')
      return
    }

    setSaving(true)
    setProgress(0)
    const payload = new FormData()
    payload.append('title', formData.title.trim())
    payload.append('description', formData.description.trim())
    payload.append('category', formData.category.trim() || 'General')
    if (formData.file) {
      payload.append('file', formData.file)
    }

    const onProgress = (percent, loaded, total) => {
      setProgress({ percent, loaded, total })
    }

    try {
      if (editingDoc) {
        await updateCollection(editingDoc.id, payload, onProgress)
      } else {
        await createCollection(payload, onProgress)
      }
      setIsModalOpen(false)
      fetchDocuments()
    } catch (err) {
      console.error('Upload Error:', err)
      const status = err.response?.status
      const detail = err.response?.data?.detail
      if (status === 401) {
        setErrorMessage('Session expired or not authenticated as Admin. Please sign in again.')
      } else if (typeof detail === 'string') {
        setErrorMessage(detail)
      } else if (Array.isArray(detail)) {
        setErrorMessage(detail.map((d) => (typeof d === 'string' ? d : d.msg || d.detail || JSON.stringify(d))).join(', '))
      } else if (detail && typeof detail === 'object') {
        setErrorMessage(detail.msg || detail.detail || JSON.stringify(detail))
      } else if (err.message) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage('Failed to save document. Please check server logs.')
      }
    } finally {
      setSaving(false)
      setProgress(null)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return
    try {
      await deleteCollection(id)
      fetchDocuments()
    } catch (err) {
      alert('Failed to delete document.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Collections Management</h1>
          <p className="text-slate-500 text-sm">Upload, edit, replace, and remove dynamic medical documents for public download.</p>
        </div>
        <button onClick={openCreate} className="btn-primary inline-flex items-center gap-2">
          <Plus size={16} /> Upload Document
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : documents.length === 0 ? (
        <div className="soft-card p-8 text-center text-slate-600">No documents yet. Upload one to make it available on the Collections page.</div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {documents.map((doc) => (
            <div key={doc.id} className="soft-card p-6 border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-3xl bg-primary-100 text-primary-700 grid place-items-center text-2xl shrink-0">
                  <FileText size={28} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-slate-900 truncate">{doc.title}</h2>
                  <p className="text-sm text-slate-500 line-clamp-2">{doc.description || 'No description provided.'}</p>
                  <p className="text-xs text-slate-400 mt-2">
                    {doc.file_type?.toUpperCase()} · Uploaded {new Date(doc.upload_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="min-w-0"><strong className="text-slate-700">Category:</strong> <span className="truncate inline-block align-bottom max-w-[120px]">{doc.category}</span></div>
                <div className="min-w-0"><strong className="text-slate-700">Size:</strong> {formatSize(doc.file_size)}</div>
                <div className="min-w-0"><strong className="text-slate-700">Uploaded:</strong> {new Date(doc.upload_date).toLocaleDateString()}</div>
                <div className="min-w-0"><strong className="text-slate-700">Type:</strong> {doc.file_type?.toUpperCase()}</div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={doc.download_url}
                  download={doc.original_filename}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline inline-flex items-center gap-2 text-xs py-2 px-4"
                >
                  <Download size={15} /> Download
                </a>
                <button onClick={() => openEdit(doc)} className="btn-primary inline-flex items-center gap-2 text-xs py-2 px-4">
                  <Edit2 size={15} /> Edit
                </button>
                <button onClick={() => handleDelete(doc.id)} className="btn-ghost text-rose-600 hover:text-white hover:bg-rose-500 text-xs py-2 px-3">
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => !saving && setIsModalOpen(false)} title={editingDoc ? 'Edit Document' : 'Upload New Document'}>
        <form onSubmit={handleSave} className="space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-fade-in">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Document Title *</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="form-input w-full" placeholder="e.g. Tamil Medical Terminology Glossary" required />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
            <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="form-input w-full resize-none" placeholder="Brief summary of document content..." />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
            <input type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="form-input w-full" placeholder="e.g. General, Cardiology, Pharmacology" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Select Document File {editingDoc ? '(leave empty to keep current file)' : '*'}
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="form-input w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.txt,.rtf,.odt,.zip,.rar,.7z,.tar,.gz,.png,.jpg,.jpeg,.webp"
            />
            {formData.file && (
              <p className="text-[11px] text-emerald-600 font-medium mt-1">Selected: {formData.file.name} ({formatSize(formData.file.size)})</p>
            )}
          </div>

          {saving && progress && (
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Uploading file to MongoDB...</span>
                <span>{progress.percent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-primary-600 transition-all duration-200" style={{ width: `${progress.percent}%` }} />
              </div>
              <div className="text-[11px] text-slate-500 text-right">
                {formatSize(progress.loaded)} of {formatSize(progress.total)}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} disabled={saving} className="btn-ghost disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
              {saving ? `Uploading (${progress?.percent || 0}%)...` : editingDoc ? 'Update Document' : 'Upload Document'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
