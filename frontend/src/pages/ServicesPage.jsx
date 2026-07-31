import { useState, useEffect } from 'react'
import { listServices } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import PageHero from '../components/PageHero'
import useScrollReveal from '../hooks/useScrollReveal'
import { CheckCircle2, Sparkles } from 'lucide-react'

export default function ServicesPage() {
  useScrollReveal()
  const [services, setServices] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    listServices()
      .then(r => setServices(r.data.services || []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', background: '#fafbff' }}>
      <PageHero
        badge="What We Offer"
        badgeIcon={<Sparkles size={13} />}
        title={<>Our <span style={{ background:'linear-gradient(135deg,#6366f1,#3b82f6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Services</span></>}
        subtitle="Professional medical translation services tailored for healthcare, research, and academia"
      />

      <div style={{ maxWidth:'1400px', margin:'0 auto', padding:'56px 24px' }}>
        {loading ? (
          <LoadingSpinner size="lg" text="Loading services..." />
        ) : services.length > 0 ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'24px' }} className="stagger">
            {services.map((s, i) => (
              <div key={s.id || i} className="reveal glass-card-light" style={{ padding:'32px' }}>
                <div style={{
                  width:'56px', height:'56px', borderRadius:'16px', marginBottom:'20px',
                  background:'linear-gradient(135deg,rgba(99,102,241,0.12),rgba(59,130,246,0.10))',
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:'26px',
                  border:'1.5px solid rgba(99,102,241,0.14)',
                }}>
                  {s.icon || '🔬'}
                </div>
                <h3 style={{ fontSize:'18px', fontWeight:800, color:'#1e1b4b', marginBottom:'10px' }}>{s.title}</h3>
                <p style={{ fontSize:'14px', color:'#6b7280', lineHeight:1.75, marginBottom:'16px' }}>{s.description}</p>
                {s.features?.length > 0 && (
                  <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:'6px' }}>
                    {s.features.map((f, fi) => (
                      <li key={fi} style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', color:'#4b5563' }}>
                        <CheckCircle2 size={14} color="#6366f1" /> {f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign:'center', padding:'80px 0' }}>
            <div style={{ fontSize:'64px', marginBottom:'16px' }}>🔬</div>
            <h3 style={{ fontSize:'20px', fontWeight:700, color:'#1e1b4b' }}>Services coming soon</h3>
          </div>
        )}
      </div>
    </div>
  )
}
