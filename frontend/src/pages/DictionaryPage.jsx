import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Search, ChevronLeft, ChevronRight, BookOpen, Filter, Sparkles, ArrowRight } from 'lucide-react'
import { searchTerms, listTerms, getCategories } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import useScrollReveal from '../hooks/useScrollReveal'

/* Animated counter for stats in header */
function StatBadge({ value, label }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '14px 20px',
      background: 'rgba(255,255,255,0.80)',
      border: '1.5px solid rgba(99,102,241,0.14)',
      borderRadius: '16px',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 2px 12px rgba(99,102,241,0.07)',
      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(99,102,241,0.15)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 12px rgba(99,102,241,0.07)'; }}
    >
      <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#4f46e5', lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: '0.71rem', color: '#9ca3af', marginTop: '4px' }}>{label}</span>
    </div>
  )
}

/* Individual term card */
function TermCard({ term, index }) {
  return (
    <div
      className="reveal term-card"
      style={{
        animationDelay: `${index * 40}ms`,
        background: 'white', borderRadius: '18px',
        padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <div style={{
        width: '44px', height: '44px', borderRadius: '14px', flexShrink: 0,
        background: 'linear-gradient(135deg,rgba(99,102,241,0.10),rgba(59,130,246,0.08))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1.5px solid rgba(99,102,241,0.12)',
      }}>
        <BookOpen size={18} color="#6366f1" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
          <h3 style={{ fontWeight: 700, color: '#1e1b4b', fontSize: '15px', margin: 0 }}>{term.en_term}</h3>
          {term.category && (
            <span style={{
              fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '999px',
              background: 'rgba(99,102,241,0.08)', color: '#6366f1',
              border: '1px solid rgba(99,102,241,0.15)', flexShrink: 0,
            }}>{term.category}</span>
          )}
        </div>
        <p className="font-tamil" style={{ color: '#4f46e5', fontWeight: 700, fontSize: '1.1rem', margin: '0 0 4px' }}>{term.ta_term}</p>
        {term.definition && (
          <p style={{ fontSize: '12px', color: '#9ca3af', lineHeight: 1.6, margin: 0 }}>{term.definition}</p>
        )}
        {term.tags?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
            {term.tags.map(tag => (
              <span key={tag} style={{
                fontSize: '10px', padding: '2px 8px', borderRadius: '999px',
                background: '#f1f5f9', color: '#64748b',
              }}>{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function DictionaryPage() {
  useScrollReveal()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [query, setQuery]         = useState(searchParams.get('q') || '')
  const [inputValue, setInputValue] = useState(searchParams.get('q') || '')
  const [terms, setTerms]         = useState([])
  const [total, setTotal]         = useState(0)
  const [page, setPage]           = useState(1)
  const [pages, setPages]         = useState(1)
  const [loading, setLoading]     = useState(false)
  const [category, setCategory]   = useState('')
  const [categories, setCategories] = useState([])
  const [focused, setFocused]     = useState(false)

  useEffect(() => {
    getCategories().then(r => setCategories(r.data.categories || []))
  }, [])

  useEffect(() => {
    const qFromUrl = searchParams.get('q') || ''
    setQuery(qFromUrl)
    setInputValue(qFromUrl)
    setPage(1)
  }, [searchParams])

  const fetchTerms = useCallback(async () => {
    setLoading(true)
    try {
      let res
      if (query.trim()) {
        res = await searchTerms(query.trim(), page, 20)
      } else {
        res = await listTerms({ page, limit: 20, category: category || undefined })
      }
      setTerms(res.data.results || [])
      setTotal(res.data.total || 0)
      setPages(res.data.pages || 1)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [query, page, category])

  useEffect(() => { fetchTerms() }, [fetchTerms])

  const handleSearch = (e) => {
    e.preventDefault()
    setQuery(inputValue)
    setPage(1)
    if (inputValue.trim()) {
      navigate(`/dictionary?q=${encodeURIComponent(inputValue.trim())}`, { replace: true })
    } else {
      navigate('/dictionary', { replace: true })
    }
  }

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', background: '#fafbff' }}>

      {/* ── Page Hero ── */}
      <div style={{
        background: 'linear-gradient(145deg,#f0f6ff 0%,#e8f0fe 40%,#f5f0ff 100%)',
        borderBottom: '1px solid rgba(99,102,241,0.08)',
        padding: '56px 24px 48px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative orbs */}
        <div style={{ position:'absolute',top:'-40px',right:'-40px',width:'220px',height:'220px',borderRadius:'50%',background:'radial-gradient(circle,rgba(99,102,241,0.12) 0%,transparent 70%)',filter:'blur(30px)',animation:'floatY 6s ease-in-out infinite' }} />
        <div style={{ position:'absolute',bottom:'-30px',left:'10%',width:'160px',height:'160px',borderRadius:'50%',background:'radial-gradient(circle,rgba(59,130,246,0.10) 0%,transparent 70%)',filter:'blur(25px)',animation:'floatY 8s ease-in-out infinite 1s' }} />

        <div style={{ maxWidth:'900px', margin:'0 auto', textAlign:'center', position:'relative', zIndex:1 }}>
          {/* Badge */}
          <div className="animate-fade-in-up" style={{ marginBottom:'16px' }}>
            <span style={{
              display:'inline-flex', alignItems:'center', gap:'6px',
              padding:'5px 16px', borderRadius:'999px', fontSize:'12px', fontWeight:700,
              background:'rgba(99,102,241,0.10)', color:'#4f46e5',
              border:'1.5px solid rgba(99,102,241,0.18)',
              animation:'popIn 0.4s ease both',
            }}>
              <Sparkles size={13} /> Medical Dictionary
            </span>
          </div>

          {/* Heading */}
          <div className="animate-fade-in-up" style={{ animationDelay:'80ms' }}>
            <h1 style={{ fontSize:'clamp(1.8rem,4vw,2.8rem)', fontWeight:900, color:'#1e1b4b', marginBottom:'10px', lineHeight:1.2 }}>
              English{' '}
              <span style={{ position:'relative', display:'inline-block' }}>
                →{' '}
                <span style={{
                  background:'linear-gradient(135deg,#6366f1,#3b82f6)',
                  WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
                }}>Tamil</span>
              </span>
              {' '}Dictionary
            </h1>
            <p style={{ color:'#6b7280', fontSize:'1rem', marginBottom:'32px' }}>
              Search from 10,000+ medical terms professionally translated into Tamil
            </p>
          </div>

          {/* Search bar */}
          <div className="animate-fade-in-up" style={{ animationDelay:'160ms' }}>
            <form onSubmit={handleSearch} style={{ display:'flex', gap:'10px', maxWidth:'680px', margin:'0 auto 28px' }}>
              <div style={{ position:'relative', flex:1 }}>
                <Search size={18} style={{
                  position:'absolute', left:'16px', top:'50%', transform:'translateY(-50%)',
                  color: focused ? '#6366f1' : '#9ca3af', transition:'color 0.2s',
                }} />
                <input
                  id="dictionary-search"
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="Search medical terms in English or Tamil..."
                  style={{
                    width:'100%', padding:'14px 16px 14px 48px',
                    background:'rgba(255,255,255,0.92)',
                    border: focused ? '2px solid #6366f1' : '2px solid rgba(99,102,241,0.15)',
                    borderRadius:'14px', fontSize:'15px', color:'#1e1b4b',
                    outline:'none', boxSizing:'border-box',
                    boxShadow: focused ? '0 0 0 4px rgba(99,102,241,0.10)' : '0 2px 8px rgba(0,0,0,0.06)',
                    transition:'all 0.25s ease',
                  }}
                />
              </div>
              <button type="submit" style={{
                padding:'14px 24px', borderRadius:'14px', fontWeight:700, fontSize:'15px',
                background:'linear-gradient(135deg,#6366f1,#4f46e5)', color:'white',
                border:'none', cursor:'pointer', flexShrink:0,
                boxShadow:'0 4px 14px rgba(99,102,241,0.35)',
                transition:'all 0.22s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(99,102,241,0.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 4px 14px rgba(99,102,241,0.35)'; }}
              >Search</button>
            </form>
          </div>

          {/* Stats row */}
          <div className="animate-fade-in-up" style={{ animationDelay:'240ms', display:'flex', justifyContent:'center', gap:'12px', flexWrap:'wrap' }}>
            {[{v:'10K+',l:'Medical Terms'},{v:'98%',l:'Accuracy'},{v:'50+',l:'Categories'},{v:'8+',l:'Years'}].map(s => (
              <StatBadge key={s.l} value={s.v} label={s.l} />
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:'1400px', margin:'0 auto', padding:'32px 24px' }}>

        {/* ── Filter pills ── */}
        <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:'10px', marginBottom:'28px' }} className="reveal">
          <div style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'13px', color:'#6b7280', fontWeight:600 }}>
            <Filter size={15} color="#6366f1" /> Filter:
          </div>
          <button
            onClick={() => { setCategory(''); setPage(1) }}
            style={{
              padding:'6px 16px', borderRadius:'999px', fontSize:'12.5px', fontWeight:600,
              cursor:'pointer', transition:'all 0.2s ease',
              background: !category ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : 'white',
              color: !category ? 'white' : '#6b7280',
              boxShadow: !category ? '0 4px 12px rgba(99,102,241,0.30)' : '0 1px 4px rgba(0,0,0,0.06)',
              border: !category ? 'none' : '1.5px solid rgba(99,102,241,0.12)',
            }}
          >All Categories</button>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => { setCategory(c); setPage(1) }}
              className="tag-hover"
              style={{
                padding:'6px 16px', borderRadius:'999px', fontSize:'12.5px', fontWeight:600,
                cursor:'pointer', transition:'all 0.2s ease',
                background: category === c ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : 'white',
                color: category === c ? 'white' : '#6b7280',
                boxShadow: category === c ? '0 4px 12px rgba(99,102,241,0.30)' : '0 1px 4px rgba(0,0,0,0.06)',
                border: category === c ? 'none' : '1.5px solid rgba(99,102,241,0.12)',
              }}
            >{c}</button>
          ))}
        </div>

        {/* ── Results count ── */}
        {!loading && (
          <p style={{ fontSize:'13.5px', color:'#9ca3af', marginBottom:'20px', fontWeight:500 }} className="reveal">
            {total > 0 ? (
              <>Showing <strong style={{color:'#4f46e5'}}>{terms.length}</strong> of <strong style={{color:'#4f46e5'}}>{total}</strong> results
                {query && <> for "<span style={{color:'#6366f1',fontWeight:700}}>{query}</span>"</>}
              </>
            ) : query ? (
              <>No results for "<span style={{color:'#6366f1'}}>{query}</span>"</>
            ) : 'Browse all medical terms'}
          </p>
        )}

        {/* ── Terms grid ── */}
        {loading ? (
          <div style={{ padding:'48px 0' }}>
            <LoadingSpinner size="lg" text="Searching terms..." />
          </div>
        ) : terms.length > 0 ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:'16px', marginBottom:'40px' }}>
            {terms.map((term, i) => <TermCard key={term.id || i} term={term} index={i} />)}
          </div>
        ) : (
          <div style={{ textAlign:'center', padding:'64px 0' }} className="reveal-scale">
            <div style={{ fontSize:'64px', marginBottom:'16px' }}>🔍</div>
            <h3 style={{ fontSize:'20px', fontWeight:700, color:'#1e1b4b', marginBottom:'8px' }}>No terms found</h3>
            <p style={{ color:'#9ca3af', marginBottom:'24px' }}>Try a different search term or browse all categories</p>
            <button onClick={() => { setCategory(''); setQuery(''); setInputValue(''); navigate('/dictionary', { replace: true }); }}
              style={{
                padding:'10px 24px', borderRadius:'12px', fontSize:'14px', fontWeight:600,
                background:'linear-gradient(135deg,#6366f1,#4f46e5)', color:'white',
                border:'none', cursor:'pointer', boxShadow:'0 4px 14px rgba(99,102,241,0.30)',
              }}>
              Browse All Terms
            </button>
          </div>
        )}

        {/* ── Pagination ── */}
        {pages > 1 && (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }} className="reveal">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              style={{
                width:'38px', height:'38px', display:'flex', alignItems:'center', justifyContent:'center',
                borderRadius:'12px', border:'1.5px solid rgba(99,102,241,0.15)',
                background:'white', cursor: page===1 ? 'not-allowed' : 'pointer',
                opacity: page===1 ? 0.4 : 1,
                transition:'all 0.2s ease',
              }}
              onMouseEnter={e => { if(page>1) e.currentTarget.style.background='rgba(99,102,241,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='white'; }}
            ><ChevronLeft size={17} color="#6366f1" /></button>

            {Array.from({ length: Math.min(5, pages) }, (_, i) => {
              const p = i + 1
              return (
                <button key={p} onClick={() => setPage(p)}
                  style={{
                    width:'38px', height:'38px', display:'flex', alignItems:'center', justifyContent:'center',
                    borderRadius:'12px', fontSize:'13px', fontWeight:700, cursor:'pointer',
                    background: page===p ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : 'white',
                    color: page===p ? 'white' : '#6b7280',
                    border: page===p ? 'none' : '1.5px solid rgba(99,102,241,0.12)',
                    boxShadow: page===p ? '0 4px 12px rgba(99,102,241,0.30)' : 'none',
                    transition:'all 0.2s ease',
                  }}>{p}</button>
              )
            })}

            {pages > 5 && <span style={{ color:'#9ca3af' }}>…</span>}
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
              style={{
                width:'38px', height:'38px', display:'flex', alignItems:'center', justifyContent:'center',
                borderRadius:'12px', border:'1.5px solid rgba(99,102,241,0.15)',
                background:'white', cursor: page===pages ? 'not-allowed' : 'pointer',
                opacity: page===pages ? 0.4 : 1,
                transition:'all 0.2s ease',
              }}
              onMouseEnter={e => { if(page<pages) e.currentTarget.style.background='rgba(99,102,241,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='white'; }}
            ><ChevronRight size={17} color="#6366f1" /></button>
          </div>
        )}
      </div>
    </div>
  )
}
