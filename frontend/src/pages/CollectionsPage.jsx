import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, FileText, Sparkles, ArrowRight, FolderOpen } from 'lucide-react'
import { getCollections } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import PageHero from '../components/PageHero'
import useScrollReveal from '../hooks/useScrollReveal'


function formatSize(bytes) {
  if (!bytes) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB']
  let value = bytes
  let index = 0
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024
    index += 1
  }
  return `${value.toFixed(1)} ${units[index]}`
}

export default function CollectionsPage() {
  useScrollReveal()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getCollections()
      .then((res) => setDocuments(Array.isArray(res.data?.documents) ? res.data.documents : []))
      .catch((err) => {
        console.error(err)
        setError('Failed to load document collections. Please try again later.')
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', background: '#fafbff' }}>
      <PageHero
        badge="Collections"
        badgeIcon={<Sparkles size={13} />}
        title={<>Medical <span style={{ background:'linear-gradient(135deg,#6366f1,#3b82f6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Document Library</span></>}
        subtitle="Explore and download medical documents, glossaries, and reference materials"
      />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '56px 24px' }}>
        {loading ? (
          <div style={{ padding: '64px 0' }}>
            <LoadingSpinner size="lg" text="Loading document collections..." />
          </div>
        ) : error ? (
          <div className="soft-card p-8 text-center text-slate-600 reveal-scale">{error}</div>
        ) : documents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }} className="reveal-scale">
            <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center border border-indigo-100 text-indigo-600 shadow-sm mx-auto mb-4">
              <FolderOpen size={40} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1e1b4b', marginBottom: '8px' }}>No documents available yet</h3>
            <p style={{ color: '#9ca3af' }}>Check back soon for uploaded medical glossaries and publications.</p>
          </div>
        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
            {documents.map((doc, i) => (
              <div key={doc.id} className="reveal glass-card-light" style={{ padding: '24px', display: 'flex', flexDirection: 'column', animationDelay: `${i * 60}ms` }}>
                <div style={{ display: 'flex', itemsAlign: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '16px', flexShrink: 0,
                    background: 'linear-gradient(135deg,rgba(99,102,241,0.12),rgba(59,130,246,0.08))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1.5px solid rgba(99,102,241,0.14)',
                  }}>
                    <FileText size={24} color="#6366f1" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#1e1b4b', marginBottom: '4px', lineHeight: 1.35 }}>{doc.title}</h2>
                    <span style={{
                      fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px',
                      background: 'rgba(99,102,241,0.08)', color: '#6366f1',
                      border: '1px solid rgba(99,102,241,0.15)', display: 'inline-block',
                    }}>{doc.category}</span>
                  </div>
                </div>

                <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.65, marginBottom: '20px', flex: 1 }}>
                  {doc.description || 'No description available for this document.'}
                </p>

                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px',
                  background: '#f8faff', padding: '12px 14px', borderRadius: '14px',
                  border: '1px solid rgba(99,102,241,0.10)', marginBottom: '20px',
                  fontSize: '12px', color: '#6b7280', textAlign: 'center',
                }}>
                  <div style={{ minWidth: 0 }}>
                    <span style={{ color: '#9ca3af', fontSize: '11px', display: 'block', fontWeight: 600 }}>Format</span>
                    <strong style={{ color: '#1e1b4b', display: 'block' }}>{doc.file_type?.toUpperCase()}</strong>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <span style={{ color: '#9ca3af', fontSize: '11px', display: 'block', fontWeight: 600 }}>File Size</span>
                    <strong style={{ color: '#1e1b4b', display: 'block' }}>{formatSize(doc.file_size)}</strong>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <span style={{ color: '#9ca3af', fontSize: '11px', display: 'block', fontWeight: 600 }}>Uploaded</span>
                    <strong style={{ color: '#1e1b4b', display: 'block' }}>{new Date(doc.upload_date).toLocaleDateString()}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <a
                    href={doc.download_url}
                    download={doc.original_filename}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      flex: 1, padding: '11px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: 700,
                      background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: 'white',
                      textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      boxShadow: '0 4px 14px rgba(99,102,241,0.30)',
                      transition: 'all 0.22s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.40)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,0.30)'; }}
                  >
                    <Download size={15} /> Download Document
                  </a>
                  <button
                    type="button"
                    onClick={() => navigate('/contact')}
                    style={{
                      padding: '11px 14px', borderRadius: '12px', fontSize: '13px', fontWeight: 600,
                      background: 'white', color: '#4f46e5', border: '1.5px solid rgba(99,102,241,0.20)',
                      cursor: 'pointer', transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = 'rgba(99,102,241,0.05)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.20)'; e.currentTarget.style.background = 'white'; }}
                  >
                    Support
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
