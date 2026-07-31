import { useState, useEffect } from 'react'
import { getCollections } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { Download, FileText, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

function formatSize(bytes) {
  if (!bytes) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  const sizes = ['KB', 'MB', 'GB']
  let i = 0
  let value = bytes
  while (value >= 1024 && i < sizes.length - 1) {
    value /= 1024
    i += 1
  }
  return `${value.toFixed(1)} ${sizes[i]}`
}

export default function CollectionsPage() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCollections()
      .then((res) => setDocuments(res.data.documents || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner size="lg" text="Loading collections..." />

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Document Collections</h1>
          <p className="text-slate-500 text-sm">All uploaded medical documents are managed from the admin collections module.</p>
        </div>
        <Link to="/admin/collections" className="btn-primary inline-flex items-center gap-2">
          <Plus size={16} /> Manage Collections
        </Link>
      </div>

      {documents.length === 0 ? (
        <div className="soft-card text-center py-16">
          <p className="text-slate-600">No documents have been uploaded yet. Add a document from the admin dashboard.</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {documents.map((doc) => (
            <div key={doc.id} className="soft-card p-6 border border-slate-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-3xl bg-primary-100 text-primary-700 grid place-items-center text-2xl">
                  <FileText size={28} />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-slate-900 truncate">{doc.title}</h2>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{doc.file_type?.toUpperCase()}</p>
                </div>
              </div>
              <p className="text-slate-600 text-sm mb-4 line-clamp-2">{doc.description || 'No description available.'}</p>
              <div className="grid grid-cols-3 gap-2 text-xs text-slate-500 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                <div className="min-w-0"><span className="font-semibold text-slate-700 block">Size</span> {formatSize(doc.file_size)}</div>
                <div className="min-w-0"><span className="font-semibold text-slate-700 block">Uploaded</span> {new Date(doc.upload_date).toLocaleDateString()}</div>
                <div className="min-w-0"><span className="font-semibold text-slate-700 block">Category</span> {doc.category}</div>
              </div>
              <a
                href={doc.download_url}
                download={doc.original_filename}
                target="_blank"
                rel="noreferrer"
                className="btn-outline w-full inline-flex items-center justify-center gap-2 text-xs"
              >
                <Download size={16} /> Download Document
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
