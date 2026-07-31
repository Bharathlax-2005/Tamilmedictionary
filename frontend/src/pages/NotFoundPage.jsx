import { Link } from 'react-router-dom'
import { Home, Search } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div style={{
      paddingTop: '64px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(145deg,#f0f6ff 0%,#e8f0fe 40%,#f5f0ff 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Orbs */}
      <div style={{ position:'absolute', top:'15%', right:'10%', width:'260px', height:'260px', borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.12) 0%,transparent 70%)', filter:'blur(35px)', animation:'floatY 6s ease-in-out infinite', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'15%', left:'10%', width:'200px', height:'200px', borderRadius:'50%', background:'radial-gradient(circle,rgba(59,130,246,0.10) 0%,transparent 70%)', filter:'blur(28px)', animation:'floatY 8s ease-in-out infinite 2s', pointerEvents:'none' }} />

      <div style={{ textAlign: 'center', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
        {/* 404 number */}
        <div style={{ animation: 'floatY 4s ease-in-out infinite' }}>
          <span style={{
            fontSize: 'clamp(6rem,18vw,10rem)', fontWeight: 900, lineHeight: 1,
            background: 'linear-gradient(135deg,#6366f1,#3b82f6,#818cf8)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            display: 'block',
          }}>404</span>
        </div>

        <div style={{ marginBottom: '8px', animation: 'fadeInUp 0.6s 0.2s both' }}>
          <div style={{ fontSize: '60px', marginBottom: '16px' }}>📚</div>
          <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 900, color: '#1e1b4b', marginBottom: '10px' }}>
            Page Not Found
          </h1>
          <p style={{ fontSize: '15px', color: '#6b7280', maxWidth: '400px', margin: '0 auto 32px', lineHeight: 1.7 }}>
            The page you're looking for doesn't exist. Let's get you back on track.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', animation: 'fadeInUp 0.6s 0.4s both' }}>
          <Link to="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', borderRadius: '14px', fontWeight: 700, fontSize: '15px',
            background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: 'white',
            textDecoration: 'none', boxShadow: '0 4px 14px rgba(99,102,241,0.30)',
            transition: 'all 0.22s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(99,102,241,0.45)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 4px 14px rgba(99,102,241,0.30)'; }}
          >
            <Home size={16} /> Go Home
          </Link>
          <Link to="/dictionary" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', borderRadius: '14px', fontWeight: 700, fontSize: '15px',
            background: 'white', color: '#4f46e5',
            textDecoration: 'none', border: '2px solid rgba(99,102,241,0.22)',
            boxShadow: '0 2px 8px rgba(99,102,241,0.08)',
            transition: 'all 0.22s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.borderColor='#6366f1'; e.currentTarget.style.boxShadow='0 8px 24px rgba(99,102,241,0.18)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.borderColor='rgba(99,102,241,0.22)'; e.currentTarget.style.boxShadow='0 2px 8px rgba(99,102,241,0.08)'; }}
          >
            <Search size={16} /> Search Dictionary
          </Link>
        </div>
      </div>
    </div>
  )
}
