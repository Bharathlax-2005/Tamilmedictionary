import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Search, ChevronLeft, ChevronRight, BookOpen, Filter, Sparkles } from 'lucide-react'
import { searchTerms, listTerms, getCategories } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import useScrollReveal from '../hooks/useScrollReveal'
import useDebounce from '../hooks/useDebounce'

/* Animated counter for stats in header */
function StatBadge({ value, label }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '14px 20px',
      background: 'rgba(255,255,255,0.85)',
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
      <span style={{ fontSize: '0.71rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>{label}</span>
    </div>
  )
}

/* Individual term card */
function TermCard({ term, index }) {
  return (
    <div
      className="reveal term-card group hover:-translate-y-1 transition-all duration-300"
      style={{
        animationDelay: `${(index % 20) * 30}ms`,
        background: 'white',
        borderRadius: '20px',
        padding: '22px',
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start',
        border: '1.5px solid #f1f5f9',
        boxShadow: '0 4px 16px rgba(15,23,42,0.04)',
      }}
    >
      <div style={{
        width: '46px', height: '46px', borderRadius: '14px', flexShrink: 0,
        background: 'linear-gradient(135deg,rgba(99,102,241,0.12),rgba(59,130,246,0.10))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1.5px solid rgba(99,102,241,0.15)',
      }}>
        <BookOpen size={20} className="text-primary-600 group-hover:scale-110 transition-transform duration-200" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
          <h3 style={{ fontWeight: 800, color: '#0f172a', fontSize: '16px', margin: 0, letterSpacing: '-0.01em' }}>
            {term.en_term}
          </h3>
          {term.category && (
            <span style={{
              fontSize: '10.5px', fontWeight: 700, padding: '3px 10px', borderRadius: '999px',
              background: 'rgba(99,102,241,0.08)', color: '#4f46e5',
              border: '1px solid rgba(99,102,241,0.15)', flexShrink: 0,
            }}>
              {term.category}
            </span>
          )}
        </div>
        <p className="font-tamil" style={{ color: '#4338ca', fontWeight: 800, fontSize: '1.2rem', margin: '4px 0 6px', lineHeight: 1.3 }}>
          {term.ta_term}
        </p>
        {term.definition && (
          <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, margin: '4px 0 0' }}>
            {term.definition}
          </p>
        )}
        {term.ta_definition && term.ta_definition !== term.definition && (
          <p className="font-tamil" style={{ fontSize: '12.5px', color: '#64748b', lineHeight: 1.5, margin: '4px 0 0' }}>
            {term.ta_definition}
          </p>
        )}
        {term.tags?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '10px' }}>
            {term.tags.map(tag => (
              <span key={tag} style={{
                fontSize: '10px', padding: '2px 8px', borderRadius: '999px',
                background: '#f1f5f9', color: '#64748b', fontWeight: 600,
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
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debouncedInput = useDebounce(inputValue, 200)

  useEffect(() => {
    getCategories().then(r => setCategories(r.data.categories || []))
  }, [])

  useEffect(() => {
    const qFromUrl = searchParams.get('q') || ''
    setQuery(qFromUrl)
    setInputValue(qFromUrl)
    setPage(1)
  }, [searchParams])

  // Fetch suggestions as user types
  useEffect(() => {
    if (debouncedInput.trim() && focused) {
      searchTerms(debouncedInput.trim(), 1, 6, category).then(res => {
        setSuggestions(res.data.results || [])
        setShowSuggestions(true)
      }).catch(err => console.error(err))
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [debouncedInput, focused, category])

  const fetchTerms = useCallback(async () => {
    setLoading(true)
    try {
      let res
      if (query.trim()) {
        res = await searchTerms(query.trim(), page, 24, category)
      } else {
        res = await listTerms({ page, limit: 24, category: category || undefined })
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
    e?.preventDefault()
    setQuery(inputValue)
    setShowSuggestions(false)
    setPage(1)
    if (inputValue.trim()) {
      navigate(`/dictionary?q=${encodeURIComponent(inputValue.trim())}`, { replace: true })
    } else {
      navigate('/dictionary', { replace: true })
    }
  }

  const handleSuggestionClick = (term) => {
    setInputValue(term.en_term)
    setQuery(term.en_term)
    setShowSuggestions(false)
    setPage(1)
    navigate(`/dictionary?q=${encodeURIComponent(term.en_term)}`, { replace: true })
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
          <div className="animate-fade-in-up flex items-center justify-center mb-4">
            <span style={{
              display:'inline-flex', alignItems:'center', gap:'6px',
              padding:'6px 18px', borderRadius:'999px', fontSize:'12.5px', fontWeight:700,
              background:'rgba(99,102,241,0.10)', color:'#4f46e5',
              border:'1.5px solid rgba(99,102,241,0.18)',
              animation:'popIn 0.4s ease both',
            }}>
              <Sparkles size={14} /> Medical Dictionary
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
            <p style={{ color:'#6b7280', fontSize:'1rem', marginBottom:'28px' }}>
              Search from 10,000+ medical terms professionally translated into Tamil
            </p>
          </div>

          {/* Search bar */}
          <div className="animate-fade-in-up" style={{ animationDelay:'160ms' }}>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-[680px] mx-auto mb-4">
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
                  onBlur={() => setTimeout(() => setFocused(false), 250)}
                  placeholder="Search medical terms in English or Tamil (e.g., Anatomy, இதயம்)..."
                  style={{
                    width:'100%', padding:'15px 16px 15px 48px',
                    background:'rgba(255,255,255,0.95)',
                    border: focused ? '2px solid #6366f1' : '2px solid rgba(99,102,241,0.20)',
                    borderRadius:'16px', fontSize:'15px', color:'#1e1b4b',
                    outline:'none', boxSizing:'border-box',
                    boxShadow: focused ? '0 0 0 4px rgba(99,102,241,0.12)' : '0 4px 16px rgba(0,0,0,0.06)',
                    transition:'all 0.25s ease',
                  }}
                />
              </div>
              <button type="submit" style={{
                padding:'15px 28px', borderRadius:'16px', fontWeight:700, fontSize:'15px',
                background:'linear-gradient(135deg,#6366f1,#4f46e5)', color:'white',
                border:'none', cursor:'pointer', flexShrink:0,
                boxShadow:'0 4px 16px rgba(99,102,241,0.35)',
                transition:'all 0.22s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(99,102,241,0.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 4px 16px rgba(99,102,241,0.35)'; }}
              >Search</button>
            </form>

            {/* Suggestions Box */}
            {showSuggestions && suggestions.length > 0 && (
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '6px',
                animation: 'popIn 0.2s ease both', justifyContent: 'flex-start', alignItems: 'center',
                maxWidth: '680px', margin: '0 auto 20px auto',
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1.5px solid rgba(99,102,241,0.18)',
                borderRadius: '14px',
                padding: '10px 16px',
                boxShadow: '0 6px 20px rgba(99,102,241,0.10)',
                backdropFilter: 'blur(10px)',
                width: '100%', boxSizing: 'border-box'
              }}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, marginRight: '4px' }}>Quick Matches:</span>
                {suggestions.map((sug, i) => (
                  <button
                    key={sug.id || i}
                    type="button"
                    onClick={() => handleSuggestionClick(sug)}
                    style={{
                      cursor: 'pointer', transition: 'all 0.15s ease',
                      fontWeight: 700, color: '#4f46e5', fontSize: '13px',
                      padding: '4px 10px', borderRadius: '8px',
                      background: 'rgba(99,102,241,0.06)', border: 'none',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.15)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.06)'; }}
                  >
                    {sug.en_term} <span className="font-tamil font-normal text-slate-500">({sug.ta_term})</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Stats row */}
          <div className="animate-fade-in-up mt-5" style={{ animationDelay:'240ms', display:'flex', justifyContent:'center', gap:'12px', flexWrap:'wrap' }}>
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
              padding:'7px 18px', borderRadius:'999px', fontSize:'12.5px', fontWeight:700,
              cursor:'pointer', transition:'all 0.2s ease',
              background: !category ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : 'white',
              color: !category ? 'white' : '#64748b',
              boxShadow: !category ? '0 4px 12px rgba(99,102,241,0.30)' : '0 1px 4px rgba(0,0,0,0.06)',
              border: !category ? 'none' : '1.5px solid #e2e8f0',
            }}
          >All Categories</button>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => { setCategory(c); setPage(1) }}
              className="tag-hover"
              style={{
                padding:'7px 18px', borderRadius:'999px', fontSize:'12.5px', fontWeight:700,
                cursor:'pointer', transition:'all 0.2s ease',
                background: category === c ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : 'white',
                color: category === c ? 'white' : '#64748b',
                boxShadow: category === c ? '0 4px 12px rgba(99,102,241,0.30)' : '0 1px 4px rgba(0,0,0,0.06)',
                border: category === c ? 'none' : '1.5px solid #e2e8f0',
              }}
            >{c}</button>
          ))}
        </div>

        {/* ── Results count ── */}
        {!loading && (
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', flexWrap:'wrap', gap:'8px' }} className="reveal">
            <p style={{ fontSize:'14px', color:'#64748b', margin:0, fontWeight:500 }}>
              {total > 0 ? (
                <>Showing <strong style={{color:'#4f46e5'}}>{terms.length}</strong> of <strong style={{color:'#4f46e5'}}>{total.toLocaleString()}</strong> medical terms
                  {query && <> for "<span style={{color:'#6366f1',fontWeight:700}}>{query}</span>"</>}
                  {category && <> in category <span style={{color:'#6366f1',fontWeight:700}}>{category}</span></>}
                </>
              ) : query ? (
                <>No results found for "<span style={{color:'#6366f1'}}>{query}</span>"</>
              ) : 'Browse all medical terms'}
            </p>
            <p style={{ fontSize:'12px', color:'#94a3b8', margin:0 }}>
              Page {page} of {pages}
            </p>
          </div>
        )}

        {/* ── Terms grid ── */}
        {loading ? (
          <div style={{ padding:'64px 0' }}>
            <LoadingSpinner size="lg" text="Searching medical terms..." />
          </div>
        ) : terms.length > 0 ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:'20px', marginBottom:'40px' }}>
            {terms.map((term, i) => <TermCard key={term.id || i} term={term} index={i} />)}
          </div>
        ) : (
          <div style={{ textAlign:'center', padding:'64px 0' }} className="reveal-scale">
            <div style={{ fontSize:'64px', marginBottom:'16px' }}>🔍</div>
            <h3 style={{ fontSize:'20px', fontWeight:700, color:'#1e1b4b', marginBottom:'8px' }}>No medical terms found</h3>
            <p style={{ color:'#9ca3af', marginBottom:'24px' }}>Try searching in English, Tamil, or clearing your category filters</p>
            <button onClick={() => { setCategory(''); setQuery(''); setInputValue(''); navigate('/dictionary', { replace: true }); }}
              style={{
                padding:'12px 28px', borderRadius:'14px', fontSize:'14px', fontWeight:700,
                background:'linear-gradient(135deg,#6366f1,#4f46e5)', color:'white',
                border:'none', cursor:'pointer', boxShadow:'0 4px 16px rgba(99,102,241,0.30)',
              }}>
              Reset All Filters
            </button>
          </div>
        )}

        {/* ── Pagination ── */}
        {pages > 1 && (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', marginTop:'24px' }} className="reveal">
            <button onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 380, behavior: 'smooth' }); }} disabled={page === 1}
              style={{
                width:'40px', height:'40px', display:'flex', alignItems:'center', justifyContent:'center',
                borderRadius:'12px', border:'1.5px solid rgba(99,102,241,0.15)',
                background:'white', cursor: page===1 ? 'not-allowed' : 'pointer',
                opacity: page===1 ? 0.4 : 1,
                transition:'all 0.2s ease',
              }}
              onMouseEnter={e => { if(page>1) e.currentTarget.style.background='rgba(99,102,241,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='white'; }}
            ><ChevronLeft size={18} color="#6366f1" /></button>

            {/* Page number buttons */}
            {Array.from({ length: Math.min(5, pages) }, (_, i) => {
              let p
              if (pages <= 5) {
                p = i + 1
              } else if (page <= 3) {
                p = i + 1
              } else if (page >= pages - 2) {
                p = pages - 4 + i
              } else {
                p = page - 2 + i
              }
              return (
                <button key={p} onClick={() => { setPage(p); window.scrollTo({ top: 380, behavior: 'smooth' }); }}
                  style={{
                    minWidth:'40px', height:'40px', padding:'0 8px', display:'flex', alignItems:'center', justifyContent:'center',
                    borderRadius:'12px', fontSize:'13.5px', fontWeight:700, cursor:'pointer',
                    background: page===p ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : 'white',
                    color: page===p ? 'white' : '#64748b',
                    border: page===p ? 'none' : '1.5px solid rgba(99,102,241,0.12)',
                    boxShadow: page===p ? '0 4px 12px rgba(99,102,241,0.30)' : 'none',
                    transition:'all 0.2s ease',
                  }}>{p}</button>
              )
            })}

            {pages > 5 && page < pages - 2 && <span style={{ color:'#9ca3af', padding:'0 4px' }}>…</span>}

            <button onClick={() => { setPage(p => Math.min(pages, p + 1)); window.scrollTo({ top: 380, behavior: 'smooth' }); }} disabled={page === pages}
              style={{
                width:'40px', height:'40px', display:'flex', alignItems:'center', justifyContent:'center',
                borderRadius:'12px', border:'1.5px solid rgba(99,102,241,0.15)',
                background:'white', cursor: page===pages ? 'not-allowed' : 'pointer',
                opacity: page===pages ? 0.4 : 1,
                transition:'all 0.2s ease',
              }}
              onMouseEnter={e => { if(page<pages) e.currentTarget.style.background='rgba(99,102,241,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='white'; }}
            ><ChevronRight size={18} color="#6366f1" /></button>
          </div>
        )}
      </div>
    </div>
  )
}
