import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, ArrowRight, Download, CheckCircle2, ChevronRight, Mail, MapPin, Send, Sparkles,
  BookOpen, Target, Building2, Award, GraduationCap, Microscope, Stethoscope, Languages,
  PenTool, FileSpreadsheet, RefreshCw, ShieldCheck, Headphones, Pill, Activity, UserCheck, BookMarked, Trophy, Globe
} from 'lucide-react'


import { getPage, listStats, listServices, listBlogPosts, submitContact, searchTerms } from '../services/api'
import StatCard from '../components/StatCard'
import ServiceCard from '../components/ServiceCard'
import BlogCard from '../components/BlogCard'
import LoadingSpinner from '../components/LoadingSpinner'
import useScrollReveal from '../hooks/useScrollReveal'
import useDebounce from '../hooks/useDebounce'

const DEFAULT_HERO = {
  kural_line1: "சொல்லுக சொல்லைப் பிறிதோர்சொல் அச்சொல்லை",
  kural_line2: "வெல்லுஞ்சொல் இன்மை அறிந்து.",
  kural_number: "645",
  kural_chapter_ta: "வாய்மை",
  kural_chapter_en: "Truthfulness",
  kural_meaning_en: "Speak only after making sure that no better word exists to express the same thought.",
  quote_ta: "சொல்லுக சொல்லைப் பிறிதோர்சொல் அச்சொல்லை வெல்லுஞ்சொல் இன்மை அறிந்து.",
  quote_en: '"Utter not a word without making sure there is no better word to express it."',
  quote_source: "— Thiruvalluvar (திருக்குறள் 645)",
  heading_ta: "உலகின் முதல் தமிழ் மருத்துவச் சொல்லகராதி",
  heading_en: "The World's First Tamil Medical Dictionary",
  subtitle: "English → Tamil Medical Glossary",
  description: "The most comprehensive Tamil Medical Dictionary and Thesaurus designed for students, healthcare professionals, researchers, translators, and medical writers.",
  popular_searches: ["Anatomy", "Cardiology", "Neurology", "Pharmacology", "Surgery"],
}

function getStatIcon(ic) {
  if (ic === '📚') return <BookMarked size={32} className="text-primary-600 mb-2 mx-auto" />
  if (ic === '🎯') return <Target size={32} className="text-primary-600 mb-2 mx-auto" />
  if (ic === '🏥') return <Building2 size={32} className="text-primary-600 mb-2 mx-auto" />
  if (ic === '⭐') return <Award size={32} className="text-primary-600 mb-2 mx-auto" />
  if (typeof ic === 'string' && ic.length <= 2) return <Activity size={32} className="text-primary-600 mb-2 mx-auto" />
  return <div className="text-3xl mb-2">{ic}</div>
}

const AUDIENCES = [
  { icon: <PenTool size={22} className="text-rose-500" />, label: "Medical Writers" },
  { icon: <Languages size={22} className="text-teal-600" />, label: "Medical Translators" },
  { icon: <Stethoscope size={22} className="text-cyan-600" />, label: "Doctors" },
  { icon: <GraduationCap size={22} className="text-purple-600" />, label: "Medical Students" },
  { icon: <Microscope size={22} className="text-indigo-600" />, label: "Researchers" },
  { icon: <Building2 size={22} className="text-blue-600" />, label: "Healthcare Professionals" },
  { icon: <BookOpen size={22} className="text-primary-600" />, label: "Academicians" },
]

const PROCESS_STEPS = [
  { step: "01", title: "Glossary Compilation", description: "Building an extensive collection of validated medical terminology from authoritative sources.", icon: <FileSpreadsheet size={24} className="text-primary-600" /> },
  { step: "02", title: "Translation", description: "Professional translation by experienced linguistic and medical experts.", icon: <Languages size={24} className="text-emerald-600" /> },
  { step: "03", title: "Quality Assurance", description: "Rigorous proofreading and medical validation by certified professionals.", icon: <ShieldCheck size={24} className="text-indigo-600" /> },
  { step: "04", title: "Client Support", description: "Continuous assistance and revision support whenever needed.", icon: <Headphones size={24} className="text-blue-600" /> },
]


export default function HomePage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [hero, setHero] = useState(DEFAULT_HERO)
  const [stats, setStats] = useState([])
  const [services, setServices] = useState([])
  const [blogs, setBlogs] = useState([])
  const [about, setAbout] = useState(null)
  const [mission, setMission] = useState(null)
  const [featuredResource, setFeaturedResource] = useState(null)
  const [specializedAreas, setSpecializedAreas] = useState(null)
  const [loading, setLoading] = useState(true)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const debouncedQuery = useDebounce(query, 250)

  // Contact form
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', company: '', message: '' })
  const [formStatus, setFormStatus] = useState(null)
  const [formLoading, setFormLoading] = useState(false)

  // Scroll-reveal — must be called here, before any early returns
  useScrollReveal()

  useEffect(() => {
    const load = async () => {
      try {
        const [heroRes, statsRes, servicesRes, blogsRes, aboutRes, missionRes, featuredRes, areasRes] = await Promise.allSettled([
          getPage('hero'),
          listStats(),
          listServices(),
          listBlogPosts({ limit: 3 }),
          getPage('about'),
          getPage('mission'),
          getPage('featured-resource'),
          getPage('specialized-areas'),
        ])
        if (heroRes.status === 'fulfilled' && heroRes.value?.data?.content) setHero({ ...DEFAULT_HERO, ...heroRes.value.data.content })
        if (statsRes.status === 'fulfilled') setStats(statsRes.value?.data?.stats || [])
        if (servicesRes.status === 'fulfilled') setServices(servicesRes.value?.data?.services || [])
        if (blogsRes.status === 'fulfilled') setBlogs(blogsRes.value?.data?.posts || [])
        if (aboutRes.status === 'fulfilled' && aboutRes.value?.data?.content) setAbout(aboutRes.value.data.content)
        if (missionRes.status === 'fulfilled' && missionRes.value?.data?.content) setMission(missionRes.value.data.content)
        if (featuredRes.status === 'fulfilled' && featuredRes.value?.data?.content) setFeaturedResource(featuredRes.value.data.content)
        if (areasRes.status === 'fulfilled' && areasRes.value?.data?.content) setSpecializedAreas(areasRes.value.data.content)
      } catch (e) {
        console.error('Failed to load page data', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (debouncedQuery.trim() && searchFocused) {
      searchTerms(debouncedQuery.trim(), 1, 5, '').then(res => {
        setSuggestions(res.data.results || [])
        setShowSuggestions(true)
      }).catch(err => console.error(err))
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [debouncedQuery, searchFocused])

  const handleSearch = (e) => {
    e?.preventDefault()
    setShowSuggestions(false)
    if (query.trim()) navigate(`/dictionary?q=${encodeURIComponent(query.trim())}`)
  }

  const handleSuggestionClick = (term) => {
    setQuery(term.en_term)
    setShowSuggestions(false)
    navigate(`/dictionary?q=${encodeURIComponent(term.en_term)}`)
  }

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    setFormStatus(null)
    try {
      await submitContact(form)
      setFormStatus({ type: 'success', message: 'Thank you! Your message has been received. We\'ll respond shortly.' })
      setForm({ first_name: '', last_name: '', email: '', company: '', message: '' })
    } catch {
      setFormStatus({ type: 'error', message: 'Something went wrong. Please try again or email us directly.' })
    } finally {
      setFormLoading(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <LoadingSpinner size="lg" text="Loading TamilMeDictionary..." />
    </div>
  )

  const heroData = { ...DEFAULT_HERO, ...(hero || {}) }
  const aboutData = { heading: "Medical Dictionary in Tamil", body: "", audiences: AUDIENCES.map(a => a.label), ...(about || {}) }
  const missionData = { heading: "Our Mission", body: "", ...(mission || {}) }
  const featuredData = { heading: "Medical Glossary Collection", author: "Prof. Dr. Semmal Mustafa", ta_title: "மருத்துவக் கலைச்சொல் களஞ்சியம்", description: "", download_url: "#", ...(featuredResource || {}) }
  const areasData = { heading: "Our Expertise", areas: [], ...(specializedAreas || {}) }

  return (
    <div>
      {/* ── INLINE HERO STYLES ─────────────────────────────────────────────── */}
      <style>{`
        @keyframes floatUp {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes floatDown {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(10px); }
        }
        @keyframes fadeSlideLeft {
          from { opacity:0; transform: translateX(-40px); }
          to   { opacity:1; transform: translateX(0); }
        }
        @keyframes fadeSlideRight {
          from { opacity:0; transform: translateX(40px); }
          to   { opacity:1; transform: translateX(0); }
        }
        @keyframes fadeSlideUp {
          from { opacity:0; transform: translateY(30px); }
          to   { opacity:1; transform: translateY(0); }
        }
        @keyframes orbPulse {
          0%,100% { transform: scale(1); opacity:0.55; }
          50% { transform: scale(1.18); opacity:0.85; }
        }
        @keyframes kuralGlow {
          0%,100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
          50% { box-shadow: 0 0 0 6px rgba(99,102,241,0.12); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes twinkle {
          0%,100% { opacity: 0.15; transform: scale(0.8); }
          50% { opacity: 0.8; transform: scale(1.3); }
        }
        .hero-slide-left  { animation: fadeSlideLeft  0.8s cubic-bezier(.25,.8,.25,1) both; }
        .hero-slide-right { animation: fadeSlideRight 0.8s cubic-bezier(.25,.8,.25,1) both; }
        .hero-slide-up    { animation: fadeSlideUp   0.7s cubic-bezier(.25,.8,.25,1) both; }
        .hero-float-up    { animation: floatUp 6s ease-in-out infinite; }
        .hero-float-down  { animation: floatDown 7s ease-in-out infinite; }
        .kural-card:hover { transform: translateY(-4px); }
        .kural-card { transition: transform 0.35s ease, box-shadow 0.35s ease; animation: kuralGlow 3.5s ease-in-out infinite; }
        .hero-img-card { transition: transform 0.4s ease, box-shadow 0.4s ease; }
        .hero-img-card:hover { transform: translateY(-8px) scale(1.015); box-shadow: 0 40px 90px rgba(59,130,246,0.18), 0 8px 32px rgba(0,0,0,0.10) !important; }
        .stat-pill { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .stat-pill:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(99,102,241,0.18); }
        .popular-tag { transition: all 0.2s ease; }
        .popular-tag:hover { background: rgba(99,102,241,0.12) !important; border-color: #6366f1 !important; color: #4f46e5 !important; transform: translateY(-2px); }
        .hero-search-input:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
        .hero-search-btn { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .hero-search-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(99,102,241,0.35); }
        .dot-particle { animation: twinkle var(--dur,3s) ease-in-out infinite; animation-delay: var(--delay,0s); }
      `}</style>

      {/* ── 1. HERO ────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden flex items-center"
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(145deg, #f0f6ff 0%, #e8f0fe 35%, #f5f0ff 65%, #eef7ff 100%)',
          paddingTop: '64px'   /* navbar height */
        }}
      >
        {/* ── Background: image as soft wash ── */}
        <div className="absolute inset-0 z-0" style={{ paddingTop: '64px' }}>
          <img
            src="/images/AdobeStock_293330068.jpeg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
            style={{ opacity: 0.07 }}
          />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(145deg, rgba(240,246,255,0.96) 0%, rgba(232,240,254,0.92) 40%, rgba(245,240,255,0.94) 100%)'
          }} />
        </div>

        {/* ── Animated soft orbs ── */}
        <div className="hero-float-up absolute z-0" style={{
          top: '8%', right: '8%', width: '340px', height: '340px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.13) 0%, transparent 70%)',
          filter: 'blur(40px)'
        }} />
        <div className="hero-float-down absolute z-0" style={{
          bottom: '12%', left: '4%', width: '260px', height: '260px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
          filter: 'blur(35px)'
        }} />
        <div className="hero-float-up absolute z-0" style={{
          animationDelay: '2s',
          top: '55%', right: '30%', width: '180px', height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.10) 0%, transparent 70%)',
          filter: 'blur(28px)'
        }} />

        {/* ── Twinkling dot particles ── */}
        {[[8,15,'4s','0.3s'],[90,20,'3.2s','1.1s'],[15,70,'5s','0.7s'],[80,60,'3.8s','2s'],[45,88,'4.5s','0.5s'],[70,10,'3s','1.8s']].map(([x,y,dur,del],i)=>(
          <div key={i} className="dot-particle absolute z-0 rounded-full" style={{
            left:`${x}%`, top:`${y}%`,
            width:'6px', height:'6px',
            background:'rgba(99,102,241,0.5)',
            '--dur': dur, '--delay': del
          }} />
        ))}

        {/* ── Content ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10" style={{ paddingTop: '24px', paddingBottom: '32px' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* ══════════════ LEFT COLUMN ══════════════ */}
            <div className="hero-slide-left flex flex-col" style={{ gap: '20px' }}>

              {/* 1 ── Thirukkural quote card */}
              <div className="kural-card hero-slide-up" style={{
                animationDelay: '40ms',
                display: 'flex', alignItems: 'center', gap: '14px',
                background: 'rgba(255,255,255,0.92)',
                border: '1.5px solid rgba(99,102,241,0.14)',
                borderRadius: '18px', padding: '14px 18px',
                backdropFilter: 'blur(18px)',
                boxShadow: '0 4px 20px rgba(99,102,241,0.08)',
                maxWidth: '100%',
                width: 'fit-content',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{
                      background: 'linear-gradient(135deg,#6366f1,#818cf8)',
                      color: 'white', fontSize: '10px', fontWeight: 700,
                      padding: '2px 10px', borderRadius: '999px', letterSpacing: '0.06em'
                    }}>திருக்குறள் {heroData.kural_number || '645'}</span>
                  </div>
                  <div className="font-tamil" style={{ lineHeight: 1.7 }}>
                    <p style={{ color: '#1e1b4b', fontSize: '0.88rem', fontWeight: 700, margin: '0 0 2px 0', whiteSpace: 'nowrap' }}>
                      {heroData.kural_line1 || 'சொல்லுக சொல்லைப் பிறிதோர்சொல் அச்சொல்லை'}
                    </p>
                    <p style={{ color: '#1e1b4b', fontSize: '0.88rem', fontWeight: 700, margin: 0, whiteSpace: 'nowrap' }}>
                      {heroData.kural_line2 || 'வெல்லுஞ்சொல் இன்மை அறிந்து.'}
                    </p>
                  </div>
                  <p style={{ color: '#6366f1', fontSize: '11px', fontWeight: 600, marginTop: '6px', marginBottom: 0 }}>— திருவள்ளுவர்</p>
                </div>

              </div>

              {/* 2 ── Main heading */}
              <div className="hero-slide-up" style={{ animationDelay: '100ms' }}>
                {/* Tamil sub-heading */}
                <p className="font-tamil" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#4f46e5', marginBottom: '10px' }}>
                  {heroData.heading_ta || 'உலகின் முதல் தமிழ் மருத்துவச் சொல்லகராதி'}
                </p>
                <h1 style={{
                  fontSize: 'clamp(2.4rem, 4.8vw, 3.6rem)',
                  fontWeight: 900, lineHeight: 1.1, color: '#0a0a1a',
                  margin: '0 0 12px 0', letterSpacing: '-0.02em'
                }}>
                  World's First<br />
                  <span style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                  }}>Tamil Medical</span><br />
                  Dictionary
                </h1>
                {/* Subtitle */}
                <p style={{ fontSize: '1rem', fontWeight: 600, color: '#6366f1', marginBottom: '8px' }}>
                  {heroData.subtitle || 'English → Tamil Medical Glossary'}
                </p>
                {/* Description */}
                <p style={{ color: '#64748b', fontSize: '0.93rem', lineHeight: 1.75, maxWidth: '500px', marginBottom: 0 }}>
                  {heroData.description || 'The most comprehensive Tamil Medical Dictionary and Thesaurus designed for students, healthcare professionals, researchers, translators, and medical writers.'}
                </p>
              </div>

              {/* 3 ── Trust badge + stats line */}
              <div className="hero-slide-up" style={{ animationDelay: '150ms' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '14px' }}>🛡️</span>
                  <span style={{ color: '#374151', fontSize: '0.88rem', fontWeight: 600 }}>
                    Trusted by Students, Doctors &amp; Researchers
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {[
                    { v: '10,000+', l: 'Medical Terms' },
                    { v: '98%', l: 'Accuracy' },
                    { v: '8+ Years', l: 'of Trust' },
                  ].map((s, i) => (
                    <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      {i > 0 && <span style={{ color: '#c4b5fd', fontWeight: 700 }}>·</span>}
                      <span style={{ color: '#1e1b4b', fontWeight: 800, fontSize: '0.88rem' }}>{s.v}</span>
                      <span style={{ color: '#6b7280', fontSize: '0.82rem' }}>{s.l}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* 4 ── Search bar */}
              <div className="hero-slide-up" style={{ animationDelay: '200ms' }}>
                <form onSubmit={handleSearch} style={{
                  position: 'relative',
                  display: 'flex', alignItems: 'center',
                  background: 'white',
                  border: '1.5px solid #e0e7ff',
                  borderRadius: '14px',
                  padding: '6px 6px 6px 16px',
                  boxShadow: '0 4px 20px rgba(99,102,241,0.10)',
                  gap: '8px',
                }}>
                  <Search size={17} color="#a5b4fc" style={{ flexShrink: 0 }} />
                  <input
                    type="text" id="hero-search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    placeholder="Search medical terms in English..."
                    className="hero-search-input"
                    style={{
                      flex: 1, border: 'none', outline: 'none', background: 'transparent',
                      color: '#1e1b4b', fontSize: '0.92rem', fontWeight: 500, padding: '6px 0'
                    }}
                  />
                  
                  <span className="hidden sm:inline-block" style={{ color: '#9ca3af', fontSize: '0.78rem', fontWeight: 500, whiteSpace: 'nowrap', paddingRight: '8px', borderRight: '1px solid #e5e7eb' }}>
                    English → Tamil
                  </span>
                  <button type="submit" className="hero-search-btn" style={{
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    color: 'white', border: 'none', borderRadius: '10px',
                    padding: '10px 20px', fontSize: '0.88rem', fontWeight: 700,
                    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px',
                    whiteSpace: 'nowrap', flexShrink: 0,
                    boxShadow: '0 4px 14px rgba(99,102,241,0.30)'
                  }}>
                    Search Dictionary <Search size={14} />
                  </button>
                </form>

                {/* Suggestions Box */}
                {showSuggestions && suggestions.length > 0 && (
                  <div style={{
                    display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '12px',
                    animation: 'popIn 0.2s ease both', justifyContent: 'flex-start', alignItems: 'center',
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '1.5px solid rgba(99,102,241,0.15)',
                    borderRadius: '12px',
                    padding: '10px 16px',
                    boxShadow: '0 4px 12px rgba(99,102,241,0.08)',
                    backdropFilter: 'blur(8px)',
                    width: '100%', boxSizing: 'border-box'
                  }}>
                    <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: 600, marginRight: '6px' }}>Suggestions:</span>
                    {suggestions.map((sug, i) => (
                      <span
                        key={sug.id || i}
                        onMouseDown={() => handleSuggestionClick(sug)}
                        style={{
                          cursor: 'pointer', transition: 'all 0.15s ease',
                          fontWeight: 600, color: '#4f46e5', fontSize: '14px',
                          padding: '4px 8px', borderRadius: '6px'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        {sug.en_term}
                      </span>
                    ))}
                  </div>
                )}

                {/* 5 ── Popular searches */}
                {heroData.popular_searches?.length > 0 && (
                  <div style={{ marginTop: '14px' }}>
                    <p style={{ color: '#6b7280', fontSize: '0.77rem', fontWeight: 600, marginBottom: '8px' }}>Popular Searches</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                      {heroData.popular_searches.map((term) => (
                        <button key={term} className="popular-tag"
                          onClick={() => navigate(`/dictionary?q=${encodeURIComponent(term)}`)}
                          style={{
                            fontSize: '0.78rem', fontWeight: 600, padding: '6px 14px', borderRadius: '8px',
                            background: 'white', border: '1.5px solid #e5e7eb',
                            color: '#374151', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
                          }}>{term}</button>
                      ))}
                      <button
                        onClick={() => navigate('/dictionary')}
                        style={{
                          fontSize: '0.78rem', fontWeight: 700, color: '#6366f1',
                          background: 'none', border: 'none', cursor: 'pointer',
                          display: 'inline-flex', alignItems: 'center', gap: '4px'
                        }}>View All →</button>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* ══════════════ RIGHT COLUMN ══════════════ */}
            <div className="hero-slide-right hidden lg:flex flex-col" style={{ gap: '16px', animationDelay: '100ms' }}>

              {/* Image with floating specialty bubbles */}
              <div style={{ position: 'relative', width: '100%' }}>
                <div className="hero-img-card" style={{
                  borderRadius: '28px', overflow: 'hidden',
                  border: '2px solid rgba(99,102,241,0.10)',
                  boxShadow: '0 24px 72px rgba(99,102,241,0.15), 0 6px 24px rgba(0,0,0,0.08)',
                  width: '100%'
                }}>
                  <img
                    src="/images/AdobeStock_180790271.jpeg"
                    alt="Tamil Medical Dictionary research"
                    style={{ width: '100%', height: '400px', objectFit: 'cover', display: 'block' }}
                  />
                </div>

                {/* Floating specialty bubbles */}
                {[
                  { label: '🧠 Neurology', top: '12%', left: '-8%' },
                  { label: '❤️ Cardiology', top: '18%', right: '-6%' },
                  { label: '🦴 Anatomy', top: '55%', left: '-10%' },
                  { label: '💊 Pharmacology', bottom: '20%', right: '-7%' },
                ].map((b, i) => (
                  <div key={i} className="hero-float-up" style={{
                    position: 'absolute',
                    top: b.top, bottom: b.bottom,
                    left: b.left, right: b.right,
                    animationDelay: `${i * 0.4}s`,
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '12px', padding: '8px 16px',
                    boxShadow: '0 6px 24px rgba(99,102,241,0.14), 0 2px 8px rgba(0,0,0,0.08)',
                    fontSize: '0.8rem', fontWeight: 700, color: '#1e1b4b',
                    whiteSpace: 'nowrap',
                    border: '1px solid rgba(255,255,255,0.8)'
                  }}>{b.label}</div>
                ))}
              </div>

              {/* Stats bar below image */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px',
                background: 'rgba(255,255,255,0.92)',
                border: '1.5px solid rgba(99,102,241,0.12)',
                borderRadius: '18px', padding: '16px 12px',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 4px 20px rgba(99,102,241,0.08)'
              }}>
                {[
                  { v: '10K+', l: 'Medical Terms', icon: <BookMarked size={20} className="text-primary-600 mx-auto" /> },
                  { v: '98%', l: 'Accuracy Rate', icon: <CheckCircle2 size={20} className="text-emerald-600 mx-auto" /> },
                  { v: '8+', l: 'Years of Trust', icon: <Trophy size={20} className="text-amber-500 mx-auto" /> },
                  { v: 'Free', l: 'For Everyone', icon: <Sparkles size={20} className="text-indigo-500 mx-auto" /> },
                ].map((s, i) => (
                  <div key={i} className="stat-pill" style={{ textAlign: 'center', padding: '4px 6px' }}>
                    <div className="mb-1 flex justify-center">{s.icon}</div>
                    <p style={{ color: '#4f46e5', fontWeight: 900, fontSize: '1.25rem', margin: '0 0 2px 0', lineHeight: 1 }}>{s.v}</p>
                    <p style={{ color: '#6b7280', fontSize: '0.66rem', fontWeight: 600, margin: 0 }}>{s.l}</p>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ── 2. ABOUT DICTIONARY ─────────────────────────────────────────────── */}
      <section className="section-pad bg-white" style={{ position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-60px', right:'-60px', width:'280px', height:'280px', borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.07) 0%,transparent 70%)', filter:'blur(30px)', pointerEvents:'none' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="reveal-left">
              <span className="badge mb-4">About Us</span>
              <h2 className="section-heading mb-5">{aboutData.heading}</h2>
              <p className="section-subheading mb-8">{aboutData.body}</p>
              <a href="/about" className="btn-primary inline-flex">
                Learn More <ArrowRight size={16} />
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger">
              {(aboutData.audiences || AUDIENCES.map(a => a.label)).map((audience, i) => {
                const matchedAud = AUDIENCES.find(a => a.label === (typeof audience === 'string' ? audience : audience.label))
                const iconComponent = typeof audience === 'object' && audience.icon ? audience.icon : matchedAud?.icon || <UserCheck size={22} className="text-primary-600" />
                return (
                  <div key={i} className="reveal glass-card-light" style={{ padding:'20px', display:'flex', alignItems:'center', gap:'12px', animationDelay:`${i*60}ms` }}>
                    <div className="w-10 h-10 rounded-xl bg-slate-100/90 flex items-center justify-center flex-shrink-0 shadow-sm border border-slate-200/60">
                      {iconComponent}
                    </div>
                    <span style={{ fontSize:'13.5px', fontWeight:600, color:'#1e1b4b' }}>{typeof audience === 'string' ? audience : audience.label}</span>
                  </div>
                )
              })}

            </div>
          </div>
        </div>
      </section>


      {/* ── 3. FEATURED RESOURCE / MEDICAL GLOSSARY COLLECTION ────────────────────────────── */}
      <section className="section-pad bg-gradient-hero border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-6 sm:p-10 border border-slate-200/90 rounded-3xl shadow-xl bg-white/90 backdrop-blur-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Side Collection Image with Modern Curvy Styling */}
              <div className="lg:col-span-5 relative group">
                {/* Background Glow */}
                <div className="absolute -inset-3 bg-gradient-to-br from-indigo-500 via-primary-500 to-blue-600 rounded-tl-[4.5rem] rounded-br-[4.5rem] rounded-tr-3xl rounded-bl-3xl opacity-25 blur-xl group-hover:opacity-40 transition-all duration-500" />
                
                {/* Modern Asymmetrical Curved Container (Top-Left & Bottom-Right Curves) */}
                <div className="relative rounded-tl-[4rem] rounded-br-[4rem] rounded-tr-2xl rounded-bl-2xl overflow-hidden border-4 border-white shadow-2xl ring-1 ring-slate-200/80 bg-slate-900 aspect-[4/3] sm:h-80 w-full">
                  <img
                    src="/images/collection.png"
                    alt="Medical Glossary Collection"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "/images/AdobeStock_293330068.jpeg"
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>

              {/* Right Side Content */}
              <div className="lg:col-span-7 space-y-5 text-left">
                <div>
                  <span className="badge mb-2 inline-flex items-center gap-1.5 px-3 py-1 bg-primary-100 text-primary-700 font-semibold rounded-full text-xs uppercase tracking-wider">
                    <Sparkles size={14} className="text-primary-600" /> Featured Collection
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                    {featuredData.heading}
                  </h2>
                  <p className="text-xs font-semibold text-primary-600 mt-1">{featuredData.author}</p>
                </div>

                <p className="font-tamil text-xl font-bold text-slate-800">
                  {featuredData.ta_title}
                </p>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {featuredData.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/collections')}
                    className="btn-primary inline-flex items-center gap-2 py-3 px-6 rounded-xl shadow-lg"
                  >
                    <Download size={18} /> Download Document Collection
                  </button>
                  <a href="/about" className="btn-outline inline-flex items-center gap-2 py-3 px-5 rounded-xl">
                    Learn More <ArrowRight size={16} />
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>


      {/* ── 4. MISSION ──────────────────────────────────────────────────────── */}
      <section className="section-pad bg-white relative overflow-hidden border-y border-slate-100">
        <div className="blob w-80 h-80 bg-primary-300 -bottom-20 -right-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div>
                <span className="badge mb-3 inline-flex items-center gap-1.5 px-3 py-1 bg-primary-100 text-primary-700 font-semibold rounded-full text-xs uppercase tracking-wider">
                  <Sparkles size={14} className="text-primary-600" /> Our Mission
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                  {missionData.heading}
                </h2>
              </div>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                {missionData.body}
              </p>

              {/* Mission Bullet Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
                  <div className="w-8 h-8 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Standardized Terminology</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Vetted by healthcare practitioners & language experts.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Accessible Healthcare</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Empowering patients & medical professionals alike.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a href="/about" className="btn-primary inline-flex items-center gap-2">
                  About Us <ArrowRight size={16} />
                </a>
              </div>
            </div>

            {/* Right Side Image with Modern Opposite End Curved Styling */}
            <div className="lg:col-span-5 relative group">
              {/* Glowing Background Glow */}
              <div className="absolute -inset-3 bg-gradient-to-tr from-primary-500 via-emerald-400 to-blue-500 rounded-tr-[4.5rem] rounded-bl-[4.5rem] rounded-tl-3xl rounded-br-3xl opacity-25 blur-xl group-hover:opacity-40 transition-all duration-500" />
              
              {/* Modern Asymmetrical Curved Container (Opposite Ends Curved) */}
              <div className="relative rounded-tr-[4rem] rounded-bl-[4rem] rounded-tl-2xl rounded-br-2xl overflow-hidden border-4 border-white shadow-2xl ring-1 ring-slate-200/80 bg-slate-900">
                <img
                  src="/images/480_F_328026660_eGnryhW4ldjfXwMqEt9BMl3Z3jFdp1iK.jpg"
                  alt="Our Mission"
                  className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ── 5. SERVICES ─────────────────────────────────────────────────────── */}
      <section className="section-pad bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="badge mb-4">Our Services</span>
            <h2 className="section-heading">Why Choose Us</h2>
            <p className="section-subheading mt-3 max-w-xl mx-auto">
              Everything you need for precise, professional medical translation in Tamil.
            </p>
          </div>
          {services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s, i) => <ServiceCard key={s.id || i} service={s} index={i} />)}
            </div>
          ) : (
            <LoadingSpinner text="Loading services..." />
          )}
        </div>
      </section>

      {/* ── 6. STATISTICS ───────────────────────────────────────────────────── */}
      <section className="section-pad bg-gradient-to-r from-primary-700 via-primary-600 to-primary-500 relative overflow-hidden">
        <div className="blob w-96 h-96 bg-white -top-32 -left-32" />
        <div className="blob w-64 h-64 bg-primary-300 bottom-0 right-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Enhancing Medical Communication
            </h2>
            <p className="text-primary-200 text-lg">Numbers that speak for our commitment to excellence</p>
          </div>
          {stats.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={stat.id || i} className="glass-card p-6 text-center animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}>
                  {getStatIcon(stat.icon)}
                  <div className="text-3xl font-extrabold text-primary-600 mb-1">{stat.value}</div>
                  <p className="text-xs text-slate-500 leading-snug">{stat.label}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { value: '10K+', label: 'Medical Terms Translated', icon: <BookOpen size={24} className="text-white mx-auto" /> },
                { value: '98%', label: 'Translation Accuracy', icon: <Target size={24} className="text-emerald-300 mx-auto" /> },
                { value: '25+', label: 'Institutions Served', icon: <Building2 size={24} className="text-sky-300 mx-auto" /> },
                { value: '8+', label: 'Years of Excellence', icon: <Award size={24} className="text-amber-300 mx-auto" /> }
              ].map((s, i) => (
                <div key={i} className="glass-card p-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-3 shadow-inner">
                    {s.icon}
                  </div>
                  <div className="text-3xl font-extrabold text-white mb-1">{s.value}</div>
                  <p className="text-xs text-primary-100 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 7. SPECIALIZED AREAS ────────────────────────────────────────────── */}
      <section className="section-pad bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="badge mb-4">Expertise</span>
            <h2 className="section-heading">{areasData.heading || 'Our Expertise'}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(areasData.areas?.length > 0
              ? areasData.areas
              : [
                  { title: "Pharmaceuticals", description: "Translation of pharmaceutical and drug-related terminology.", icon: <Pill size={28} className="text-pink-500" /> },
                  { title: "Research & Academia", description: "Supporting universities, research organizations, and publications.", icon: <GraduationCap size={28} className="text-purple-600" /> },
                  { title: "Healthcare Services", description: "Medical communication support for hospitals, clinics, and healthcare providers.", icon: <Building2 size={28} className="text-blue-600" /> },
                ]
            ).map((area, i) => (
              <div key={i} className="soft-card p-8 text-center animate-fade-in-up"
                style={{ animationDelay: `${i * 120}ms`, animationFillMode: 'both' }}>
                <div className="w-16 h-16 rounded-2xl bg-slate-100/90 flex items-center justify-center mx-auto mb-5 border border-slate-200/80 shadow-sm">
                  {typeof area.icon === 'string' ? <Activity size={28} className="text-primary-600" /> : area.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{area.title}</h3>

                <p className="text-slate-500 text-sm leading-relaxed">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. OUR PROCESS ──────────────────────────────────────────────────── */}
      <section className="section-pad bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="badge mb-4">How We Work</span>
            <h2 className="section-heading">Our Process</h2>
            <p className="section-subheading mt-3 max-w-xl mx-auto">
              A proven four-step methodology ensuring accuracy and quality in every translation.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS_STEPS.map((step, i) => (
              <div key={i} className="soft-card p-6 relative animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl font-black text-primary-100 leading-none">{step.step}</span>
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
                {i < PROCESS_STEPS.length - 1 && (
                  <ChevronRight size={20} className="absolute -right-3 top-1/2 -translate-y-1/2 text-primary-300 hidden lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. BLOG ─────────────────────────────────────────────────────────── */}
      {blogs.length > 0 && (
        <section className="section-pad bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="badge mb-3">Latest Articles</span>
                <h2 className="section-heading">From Our Blog</h2>
              </div>
              <a href="/blog" className="btn-outline text-sm hidden md:inline-flex">
                View All <ArrowRight size={15} />
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogs.map((post, i) => <BlogCard key={post.id || i} post={post} index={i} />)}
            </div>
            <div className="text-center mt-8 md:hidden">
              <a href="/blog" className="btn-outline">View All Articles <ArrowRight size={15} /></a>
            </div>
          </div>
        </section>
      )}

      {/* ── 10. CALL TO ACTION ──────────────────────────────────────────────── */}
      <section className="section-pad bg-gradient-blue relative overflow-hidden">
        <div className="blob w-96 h-96 bg-white -top-24 -right-24" />
        <div className="blob w-64 h-64 bg-primary-300 bottom-0 left-10" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
            Start Your Medical Translation Journey
          </h2>
          <p className="text-primary-100 text-lg mb-8 leading-relaxed">
            Whether you're a student, translator, researcher, or healthcare professional, TamilMeDictionary is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/dictionary" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl shadow-soft-lg hover:shadow-soft hover:-translate-y-0.5 transition-all duration-200">
              <Search size={18} /> Search Dictionary
            </a>
            <a href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-800/50 text-white font-semibold rounded-xl border border-white/30 hover:bg-primary-800/70 transition-all duration-200">
              Get Started <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* ── 11. CONTACT ─────────────────────────────────────────────────────── */}
      <section id="contact" className="section-pad bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            {/* Info */}
            <div>
              <span className="badge mb-4">Get In Touch</span>
              <h2 className="section-heading mb-4">Contact Us</h2>
              <p className="text-slate-500 leading-relaxed mb-8">
                Have a question, need a translation, or want to collaborate? We'd love to hear from you.
              </p>
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Email</p>
                    <a href="mailto:Tamilmedictionary@gmail.com" className="text-slate-700 font-medium hover:text-primary-600 transition-colors">
                      Tamilmedictionary@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Location</p>
                    <p className="text-slate-700 font-medium">Chennai, Tamil Nadu, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="soft-card p-8">
              <form onSubmit={handleContactSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">First Name *</label>
                    <input
                      type="text" required id="contact-first-name"
                      value={form.first_name}
                      onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                      placeholder="John"
                      className="soft-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Last Name *</label>
                    <input
                      type="text" required id="contact-last-name"
                      value={form.last_name}
                      onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
                      placeholder="Doe"
                      className="soft-input"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Email Address *</label>
                  <input
                    type="email" required id="contact-email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="john@example.com"
                    className="soft-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Company / Organization</label>
                  <input
                    type="text" id="contact-company"
                    value={form.company}
                    onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                    placeholder="Your organization"
                    className="soft-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Message *</label>
                  <textarea
                    required rows={4} id="contact-message"
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Tell us how we can help..."
                    className="soft-input resize-none"
                  />
                </div>

                {formStatus && (
                  <div className={`flex items-start gap-2 p-4 rounded-xl text-sm ${
                    formStatus.type === 'success'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" />
                    {formStatus.message}
                  </div>
                )}

                <button
                  type="submit"
                  id="contact-submit"
                  disabled={formLoading}
                  className="btn-primary justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {formLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <Send size={16} /> Submit Message
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
