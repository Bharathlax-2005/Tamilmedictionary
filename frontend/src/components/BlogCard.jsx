import { Link } from 'react-router-dom'
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react'

export default function BlogCard({ post, index }) {
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
    : ''

  return (
    <Link
      to={`/blog/${post.slug}`}
      style={{
        display: 'flex', flexDirection: 'column', textDecoration: 'none',
        background: 'white', borderRadius: '20px', overflow: 'hidden',
        border: '1.5px solid rgba(99,102,241,0.08)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
        transition: 'transform 0.32s cubic-bezier(.2,.9,.2,1), box-shadow 0.32s ease, border-color 0.2s',
        animationDelay: `${index * 80}ms`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)'
        e.currentTarget.style.boxShadow = '0 20px 50px rgba(99,102,241,0.14)'
        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.22)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.04)'
        e.currentTarget.style.borderColor = 'rgba(99,102,241,0.08)'
      }}
    >
      {/* Cover image */}
      <div style={{
        width: '100%', height: '180px', overflow: 'hidden',
        background: 'linear-gradient(135deg,rgba(99,102,241,0.08),rgba(59,130,246,0.06))',
        position: 'relative',
      }}>
        {post.cover_image ? (
          <img src={post.cover_image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.45s ease' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="w-14 h-14 rounded-2xl bg-indigo-100/70 flex items-center justify-center border border-indigo-200/60 text-primary-600 shadow-sm">
              <BookOpen size={28} />
            </div>
          </div>
        )}
      </div>


      {/* Content */}
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Tags */}
        {post.tags?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {post.tags.slice(0, 3).map(tag => (
              <span key={tag} style={{
                fontSize: '10px', fontWeight: 700, padding: '2px 10px', borderRadius: '999px',
                background: 'rgba(99,102,241,0.08)', color: '#6366f1',
                border: '1px solid rgba(99,102,241,0.14)',
              }}>{tag}</span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1e1b4b', lineHeight: 1.4, margin: 0 }}>
          {post.title}
        </h3>

        {/* Excerpt */}
        <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.65, margin: 0,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {post.excerpt}
        </p>

        {/* Meta + read more */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(99,102,241,0.07)' }}>
          <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#9ca3af' }}>
            {date && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={11} />{date}</span>}
            {post.author && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><User size={11} />{post.author}</span>}
          </div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#6366f1', display: 'flex', alignItems: 'center', gap: '3px', transition: 'gap 0.2s ease' }}>
            Read <ArrowRight size={11} />
          </span>
        </div>
      </div>
    </Link>
  )
}
