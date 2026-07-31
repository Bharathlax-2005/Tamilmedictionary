import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react'
import { getBlogPost } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

export default function BlogPostPage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    getBlogPost(slug)
      .then(r => setPost(r.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="pt-24 min-h-screen"><LoadingSpinner size="lg" text="Loading article..." /></div>
  if (error || !post) return (
    <div className="pt-24 min-h-screen flex flex-col items-center justify-center gap-4">
      <span className="text-6xl">📭</span>
      <h2 className="text-2xl font-bold text-slate-700">Article not found</h2>
      <Link to="/blog" className="btn-primary">← Back to Blog</Link>
    </div>
  )

  const date = post.published_at ? new Date(post.published_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : ''

  return (
    <div className="pt-16 min-h-screen">
      <div className="bg-gradient-hero py-14 border-b border-soft-border">
        <div className="max-w-3xl mx-auto px-4">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to Blog
          </Link>
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map(t => <span key={t} className="badge">{t}</span>)}
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4 leading-tight">{post.title}</h1>
          <div className="flex flex-wrap gap-5 text-sm text-slate-400">
            <span className="flex items-center gap-1.5"><User size={14} />{post.author}</span>
            {date && <span className="flex items-center gap-1.5"><Calendar size={14} />{date}</span>}
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="soft-card p-8 prose prose-slate max-w-none">
          <p className="text-slate-500 italic border-l-4 border-primary-300 pl-4 mb-6">{post.excerpt}</p>
          <div className="whitespace-pre-line text-slate-600 leading-relaxed">{post.content}</div>
        </div>
      </div>
    </div>
  )
}
