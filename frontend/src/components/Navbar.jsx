import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Search, BookOpen, LogIn, ChevronDown } from 'lucide-react'

const navLinks = [
  { to: '/',           label: 'Home' },
  { to: '/dictionary', label: 'Dictionary' },
  { to: '/about',      label: 'About' },
  { to: '/services',   label: 'Services' },
  { to: '/blog',       label: 'Blog' },
  { to: '/collections',label: 'Collections' },
  { to: '/shop',       label: 'Shop' },
  { to: '/contact',    label: 'Contact Us' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location])

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'all 0.35s cubic-bezier(.2,.9,.2,1)',
        background: scrolled
          ? 'rgba(255,255,255,0.97)'
          : 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(18px)',
        borderBottom: scrolled
          ? '1px solid rgba(99,102,241,0.10)'
          : '1px solid transparent',
        boxShadow: scrolled
          ? '0 4px 24px rgba(99,102,241,0.07)'
          : 'none',
      }}
    >
      <div style={{ width: '100%', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', gap: '16px' }}>

          {/* ── Logo ── */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '12px',
              background: 'linear-gradient(135deg,#6366f1,#3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99,102,241,0.35)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08) rotate(-4deg)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 12px rgba(99,102,241,0.35)'; }}
            >
              <BookOpen size={18} color="white" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#1e1b4b', letterSpacing: '-0.01em' }}>
                TamilMe<span style={{
                  background: 'linear-gradient(135deg,#6366f1,#3b82f6)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                }}>Dictionary</span>
              </span>
              <span style={{ fontSize: '9.5px', color: '#9ca3af', fontWeight: 500, letterSpacing: '0.02em', marginTop: '2px' }} className="hidden sm:block">
                Medical Dictionary & Translation Portal
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden lg:flex" style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: '2px' }}>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                style={({ isActive }) => ({
                  padding: '7px 12px',
                  borderRadius: '10px',
                  fontSize: '13.5px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#4f46e5' : '#4b5563',
                  background: isActive ? 'rgba(99,102,241,0.08)' : 'transparent',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                  position: 'relative',
                })}
                onMouseEnter={e => {
                  if (!e.currentTarget.classList.contains('active')) {
                    e.currentTarget.style.color = '#4f46e5'
                    e.currentTarget.style.background = 'rgba(99,102,241,0.06)'
                  }
                }}
                onMouseLeave={e => {
                  if (!e.currentTarget.getAttribute('aria-current')) {
                    e.currentTarget.style.color = '#4b5563'
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* ── Desktop Actions ── */}
          <div className="hidden lg:flex" style={{ alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <Link
              to="/dictionary"
              style={{
                width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '10px', color: '#6b7280',
                transition: 'all 0.2s ease',
              }}
              aria-label="Search"
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.color = '#4f46e5'; }}
              onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = '#6b7280'; }}
            >
              <Search size={17} />
            </Link>
            <Link
              to="/login"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '7px 14px', borderRadius: '10px',
                border: '1.5px solid rgba(99,102,241,0.20)',
                color: '#4b5563', fontSize: '13px', fontWeight: 600,
                transition: 'all 0.2s ease', textDecoration: 'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#4f46e5'; e.currentTarget.style.background = 'rgba(99,102,241,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.20)'; e.currentTarget.style.color = '#4b5563'; e.currentTarget.style.background = ''; }}
            >
              <LogIn size={14} /> Login
            </Link>
            <Link
              to="/contact"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '8px 18px', borderRadius: '10px',
                background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
                color: 'white', fontSize: '13px', fontWeight: 700,
                boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                transition: 'all 0.22s ease', textDecoration: 'none',
                position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,0.35)'; }}
            >
              Get Started
            </Link>
          </div>

          {/* ── Mobile Toggle ── */}
          <button
            className="lg:hidden"
            style={{
              width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '10px', border: '1.5px solid rgba(99,102,241,0.15)',
              color: '#6b7280', background: 'transparent', cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <div style={{ transition: 'transform 0.3s ease', transform: open ? 'rotate(90deg)' : 'none' }}>
              {open ? <X size={19} /> : <Menu size={19} />}
            </div>
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <div style={{
        overflow: 'hidden',
        maxHeight: open ? '600px' : '0',
        transition: 'max-height 0.4s cubic-bezier(.2,.9,.2,1)',
        background: 'rgba(255,255,255,0.98)',
        borderTop: open ? '1px solid rgba(99,102,241,0.08)' : 'none',
      }}
        className="lg:hidden"
      >
        <div style={{ padding: '12px 20px 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {navLinks.map((link, i) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                style={({ isActive }) => ({
                  padding: '11px 14px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#4f46e5' : '#4b5563',
                  background: isActive ? 'rgba(99,102,241,0.08)' : 'transparent',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                  animation: open ? `fadeInUp 0.4s ${i * 40}ms both` : 'none',
                })}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(99,102,241,0.08)', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link to="/login" style={{
              padding: '11px 14px', borderRadius: '12px',
              border: '1.5px solid rgba(99,102,241,0.18)', color: '#4b5563',
              textAlign: 'center', fontWeight: 700, fontSize: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              textDecoration: 'none',
            }}>
              <LogIn size={15} /> Login
            </Link>
            <Link to="/contact" className="btn-primary" style={{ justifyContent: 'center', fontSize: '14px' }}>
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
