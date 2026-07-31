import { useState, useEffect } from 'react'
import { getPageContent, updatePageContent } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { Save, CheckCircle2 } from 'lucide-react'

const PAGES = [
  { slug: 'hero', title: 'Hero Section' },
  { slug: 'about', title: 'About Section' },
  { slug: 'mission', title: 'Mission Section' },
  { slug: 'featured-resource', title: 'Featured Resource' },
  { slug: 'specialized-areas', title: 'Specialized Areas' },
  { slug: 'workflow', title: 'Workflow Process' },
]

export default function PagesPage() {
  const [selectedSlug, setSelectedSlug] = useState('hero')
  const [contentJson, setContentJson] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    setLoading(true)
    setStatus(null)
    getPageContent(selectedSlug)
      .then(r => setContentJson(JSON.stringify(r.data.content, null, 2)))
      .catch(() => setContentJson('{}'))
      .finally(() => setLoading(false))
  }, [selectedSlug])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setStatus(null)
    try {
      const parsed = JSON.parse(contentJson)
      await updatePageContent(selectedSlug, parsed)
      setStatus({ type: 'success', message: 'Page content updated successfully!' })
    } catch (err) {
      if (err instanceof SyntaxError) {
        setStatus({ type: 'error', message: 'Invalid JSON format. Please check your syntax.' })
      } else {
        setStatus({ type: 'error', message: 'Failed to update page content.' })
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Page Content Manager (CMS)</h1>
        <p className="text-slate-500 text-sm">Directly customize section titles, quotes, translations, and layout texts.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {PAGES.map(p => (
          <button
            key={p.slug}
            onClick={() => setSelectedSlug(p.slug)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              selectedSlug === p.slug
                ? 'bg-primary-600 text-white'
                : 'soft-card hover:bg-slate-100 text-slate-600'
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      <div className="soft-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider text-xs">
            Editing JSON Configuration for: <span className="text-primary-600">{selectedSlug}</span>
          </h2>
          <button onClick={handleSave} disabled={saving || loading} className="btn-primary">
            <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {status && (
          <div className={`flex items-center gap-2 p-3 rounded-xl text-sm mb-4 ${
            status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            <CheckCircle2 size={16} /> {status.message}
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : (
          <form onSubmit={handleSave}>
            <textarea
              rows={18}
              value={contentJson}
              onChange={e => setContentJson(e.target.value)}
              className="form-input font-mono text-xs leading-relaxed bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-700 focus:border-primary-500"
              spellCheck={false}
            />
          </form>
        )}
      </div>
    </div>
  )
}
