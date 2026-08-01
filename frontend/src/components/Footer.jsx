import { Link } from 'react-router-dom'
import { BookOpen, Mail, MapPin, ArrowUpRight, Heart } from 'lucide-react'

const quickLinks = [
  { to: '/',           label: 'Home' },
  { to: '/dictionary', label: 'Dictionary' },
  { to: '/about',      label: 'About' },
  { to: '/services',   label: 'Services' },
  { to: '/blog',       label: 'Blog' },
  { to: '/collections',label: 'Collections' },
  { to: '/shop',       label: 'Shop' },
  { to: '/contact',    label: 'Contact' },
]

const legalLinks = [
  { to: '/privacy-policy',   label: 'Privacy Policy' },
  { to: '/terms-conditions', label: 'Terms & Conditions' },
  { to: '/refund-policy',    label: 'Refund Policy' },
  { to: '/faq',              label: 'FAQ' },
]

const LinkItem = ({ to, label }) => (
  <li>
    <Link
      to={to}
      style={{
        fontSize: '13.5px', color: 'rgba(255,255,255,0.55)',
        textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px',
        transition: 'color 0.2s ease, gap 0.2s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.color = '#a5b4fc'; e.currentTarget.style.gap = '8px'; }}
      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; e.currentTarget.style.gap = '4px'; }}
    >
      <span style={{
        display: 'inline-block', width: '5px', height: '5px', borderRadius: '50%',
        background: 'rgba(99,102,241,0.5)', flexShrink: 0, transition: 'background 0.2s',
      }} />
      {label}
    </Link>
  </li>
)

export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(135deg,#0f0e1a 0%,#1a1830 50%,#0d1a2e 100%)',
      color: 'rgba(255,255,255,0.55)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute', top: '-80px', right: '-80px', width: '320px', height: '320px',
        borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 70%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-60px', left: '-60px', width: '240px', height: '240px',
        borderRadius: '50%', background: 'radial-gradient(circle,rgba(59,130,246,0.06) 0%,transparent 70%)',
        filter: 'blur(35px)', pointerEvents: 'none',
      }} />

      {/* Top divider glow */}
      <div style={{
        height: '1px',
        background: 'linear-gradient(90deg,transparent,rgba(99,102,241,0.35),rgba(59,130,246,0.25),transparent)',
      }} />

      {/* Main grid */}
      <div style={{
        maxWidth: '1700px', margin: '0 auto', padding: '56px 32px 40px',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '40px',
        position: 'relative', zIndex: 1,
      }}>

        {/* Brand */}
        <div style={{ gridColumn: 'span 1' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', textDecoration: 'none' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '12px',
              background: 'linear-gradient(135deg,#6366f1,#3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(99,102,241,0.40)',
            }}>
              <BookOpen size={18} color="white" />
            </div>
            <span style={{ fontSize: '15px', fontWeight: 800, color: 'white' }}>
              TamilMe<span style={{
                background: 'linear-gradient(135deg,#818cf8,#60a5fa)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Dictionary</span>
            </span>
          </Link>
          <p style={{ fontSize: '13px', lineHeight: 1.75, marginBottom: '16px', color: 'rgba(255,255,255,0.45)' }}>
            The World's First Tamil Medical Dictionary — bridging English medical science with the Tamil language.
          </p>
          <div className="font-tamil" style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.30)', fontStyle: 'italic', lineHeight: 1.9 }}>
            <p style={{ margin: '0 0 0px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>சொல்லுக சொல்லைப் பிறிதோர்சொல் அச்சொல்லை</p>
            <p style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>வெல்லுஞ்சொல் இன்மை அறிந்து.</p>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 style={{ color: 'white', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>
            Quick Links
          </h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none', padding: 0, margin: 0 }}>
            {quickLinks.map(l => <LinkItem key={l.to} {...l} />)}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 style={{ color: 'white', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>
            Legal
          </h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none', padding: 0, margin: 0 }}>
            {legalLinks.map(l => <LinkItem key={l.to} {...l} />)}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 style={{ color: 'white', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>
            Contact
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <a
              href="mailto:Tamilmedictionary@gmail.com"
              style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#a5b4fc'}
              onMouseLeave={e => e.currentTarget.style.color = ''}
            >
              <div style={{
                width: '32px', height: '32px', borderRadius: '10px',
                background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Mail size={14} color="#818cf8" />
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '2px' }}>Email</p>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', wordBreak: 'break-all' }}>Tamilmedictionary@gmail.com</p>
              </div>
            </a>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '10px',
                background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <MapPin size={14} color="#60a5fa" />
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '2px' }}>Location</p>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>Chennai, Tamil Nadu, India</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        maxWidth: '1700px', margin: '0 auto', padding: '18px 32px',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px',
        position: 'relative', zIndex: 1,
      }}>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.30)' }}>
          © 2024 TamilMeDictionary.com. All Rights Reserved.
        </p>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.30)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          Designed with <Heart size={11} color="#818cf8" fill="#818cf8" /> for Tamil Healthcare
        </p>
      </div>
    </footer>
  )
}
