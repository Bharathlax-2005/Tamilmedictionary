import { useState, useEffect } from 'react'
import { listBlogPosts } from '../services/api'
import BlogCard from '../components/BlogCard'
import LoadingSpinner from '../components/LoadingSpinner'
import PageHero from '../components/PageHero'
import useScrollReveal from '../hooks/useScrollReveal'
import { BookOpen } from 'lucide-react'

export default function BlogPage() {
  useScrollReveal()
  const [posts, setPosts]   = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage]     = useState(1)
  const [pages, setPages]   = useState(1)

  useEffect(() => {
    setLoading(true)
    listBlogPosts({ page, limit: 9 })
      .then(r => { setPosts(Array.isArray(r.data?.posts) ? r.data.posts : []); setPages(r.data?.pages || 1) })
      .finally(() => setLoading(false))
  }, [page])

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', background: '#fafbff' }}>
      <PageHero
        badge="Blog"
        badgeIcon={<BookOpen size={13} />}
        title={<>Medical <span style={{ background:'linear-gradient(135deg,#6366f1,#3b82f6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Insights</span></>}
        subtitle="Expert articles on medical terminology, translation, and Tamil healthcare"
      />

      <div style={{ maxWidth:'1400px', margin:'0 auto', padding:'56px 24px' }}>
        {loading ? (
          <LoadingSpinner size="lg" text="Loading articles..." />
        ) : posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 stagger">
              {posts.map((post, i) => (
                <div key={post.id} className="reveal">
                  <BlogCard post={post} index={i} />
                </div>
              ))}
            </div>
            {pages > 1 && (
              <div style={{ display:'flex', justifyContent:'center', gap:'8px' }} className="reveal">
                {Array.from({ length: pages }, (_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)}
                    style={{
                      width:'38px', height:'38px', borderRadius:'12px', fontSize:'13px', fontWeight:700,
                      cursor:'pointer', transition:'all 0.2s ease',
                      background: page===i+1 ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : 'white',
                      color: page===i+1 ? 'white' : '#6b7280',
                      boxShadow: page===i+1 ? '0 4px 12px rgba(99,102,241,0.30)' : '0 1px 4px rgba(0,0,0,0.06)',
                      border: page===i+1 ? 'none' : '1.5px solid rgba(99,102,241,0.12)',
                    }}
                    onMouseEnter={e => { if(page!==i+1) e.currentTarget.style.background='rgba(99,102,241,0.08)'; }}
                    onMouseLeave={e => { if(page!==i+1) e.currentTarget.style.background='white'; }}
                  >{i + 1}</button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign:'center', padding:'80px 0' }} className="reveal-scale">
            <div style={{ fontSize:'64px', marginBottom:'16px' }}>📝</div>
            <h3 style={{ fontSize:'20px', fontWeight:700, color:'#1e1b4b', marginBottom:'8px' }}>No articles yet</h3>
            <p style={{ color:'#9ca3af' }}>Check back soon for expert medical insights</p>
          </div>
        )}
      </div>
    </div>
  )
}
